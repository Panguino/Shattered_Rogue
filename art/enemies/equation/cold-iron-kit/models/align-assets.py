"""Bakes every kit mesh into its family's canonical orientation.

Run headless:

    blender --background --python align-assets.py -- [--out aligned]

Tripo orients a result to the concept image's implied camera, so parts arrive at
arbitrary angles: rod-a-spine lands on a full diagonal, and its axis-aligned box
is fifteen times the volume it needs. Two things downstream break on that. The
socket seeder finds end faces by slicing along world axes, which on a diagonal
rod slices through the middle of the part. And the runtime fits a part by
scaling its bounding box uniformly, so a box that is mostly empty air sizes the
part wrong no matter how good its sockets are.

The fix is to rotate the geometry itself, once, and bake it in. Nothing about
the transform is recoverable at runtime, because Unreal only ever applies a
rigid rotation on top of whatever the mesh already is.

Orientation is chosen by the surface's own principal axes rather than by hand:
the area-weighted covariance of the mesh gives three axes ordered by extent,
which are mapped onto world axes per family. Area weighting matters because
these meshes are decimated unevenly and counting raw vertices would drag the
long axis toward whichever boss happens to be densest.

Blender is Z-up and glTF is Y-up; the importer rotates on the way in and the
exporter rotates back. Everything below is in *Blender* space, so a part whose
long axis should be Unreal +Z wants Blender +Z here.
"""

import argparse
import math
import os
import sys

import bpy
import numpy as np
from mathutils import Matrix, Vector

MODELS = os.path.dirname(os.path.abspath(__file__))

# Which Blender axis each principal axis lands on, ordered longest to shortest.
#
# The targets mirror the proportions the generator asks for. A rod is (D, D, L)
# in Unreal with length on Z, so its longest principal axis belongs on Blender
# Z. A panel is wide and thin with thickness on Unreal Z, which is Blender Y.
AXIS_TARGETS = {
    "rod": (2, 0, 1),
    "battery": (2, 0, 1),
    "weapon": (2, 0, 1),
    "propulsion": (2, 0, 1),
    "panel": (0, 1, 2),
    "heatsink": (0, 2, 1),
}

# Round or cubic parts have no meaningful long axis, so forcing one would spin
# them arbitrarily. They only get the tilt taken out.
SNAP_ONLY = {"joint", "hub"}

# Families whose members do not agree on which axis matters. Terminal A is a
# plug, where the mount axis is the long one; terminals B and C are flat pads,
# where it is the face normal and the long axis is just how wide the pad is.
# Assuming either shape lays the other one on its side.
MOUNT_AXIS = {"electrical-terminal", "light"}


def family_of(name):
    stem = name[len("cold-iron-v2-"):]
    for family in sorted(
        list(AXIS_TARGETS) + list(SNAP_ONLY) + list(MOUNT_AXIS),
        key=len,
        reverse=True,
    ):
        if stem.startswith(family + "-"):
            return family
    raise RuntimeError(f"no family for {name}")


def load(path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=path)

    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not meshes:
        raise RuntimeError(f"{path}: no mesh objects")

    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()

    obj = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return obj


def triangle_stats(obj):
    """Area-weighted centroids of every triangle, in world space."""
    mesh = obj.data
    mesh.calc_loop_triangles()

    vertices = np.empty((len(mesh.vertices), 3))
    mesh.vertices.foreach_get("co", vertices.ravel())

    corners = np.empty((len(mesh.loop_triangles), 3), dtype=np.int64)
    mesh.loop_triangles.foreach_get("vertices", corners.ravel())

    a = vertices[corners[:, 0]]
    b = vertices[corners[:, 1]]
    c = vertices[corners[:, 2]]
    areas = np.linalg.norm(np.cross(b - a, c - a), axis=1) / 2
    centroids = (a + b + c) / 3

    keep = areas > 0
    return centroids[keep], areas[keep], vertices


def principal_axes(centroids, areas):
    weights = areas / areas.sum()
    mean = (centroids * weights[:, None]).sum(axis=0)
    offsets = centroids - mean
    covariance = (offsets * weights[:, None]).T @ offsets

    values, vectors = np.linalg.eigh(covariance)
    order = np.argsort(values)[::-1]
    return mean, vectors[:, order].T


def signed_targets(axes, vertices, mean, targets):
    """Assign each principal axis to a world axis, and pick which way it faces.

    Direction is decided by skew: mass piled at one end and a tail at the other
    means the bulky end is the base. Putting the base at negative and the tail
    at positive is what keeps a thruster's nozzle and a weapon's muzzle pointing
    the same way across the whole kit, instead of half of them arriving
    backwards.
    """
    frame = np.zeros((3, 3))
    skews = []
    for axis, target in zip(axes, targets):
        along = (vertices - mean) @ axis
        spread = along.std()
        skew = (
            ((along / spread) ** 3).mean() if spread > 1e-9 else 0.0
        )
        skews.append(abs(skew))
        frame[target] = axis if skew >= 0 else -axis

    # A reflection would turn every part inside out. Fixing it costs one flipped
    # axis, so it goes to whichever had the weakest skew and therefore the least
    # reason to face the way it does.
    if np.linalg.det(frame) < 0:
        frame[targets[int(np.argmin(skews))]] *= -1
    return frame


def mount_targets(axes, vertices, mean):
    """Put the axis a part mounts along on Z, whichever shape it turned out to be.

    A shape that is long in one direction mounts along that direction; a shape
    that is flat in one direction mounts along its normal. Reading it off the
    extents means one family can hold both without being told which is which.
    """
    extents = [float(np.ptp((vertices - mean) @ axis)) for axis in axes]
    order = sorted(range(3), key=lambda index: -extents[index])
    longest, middle, shortest = order

    if extents[longest] / max(extents[middle], 1e-9) > 1.25:
        mount = longest
    elif extents[middle] / max(extents[shortest], 1e-9) > 1.25:
        mount = shortest
    else:
        mount = longest

    targets = [None, None, None]
    targets[mount] = 2
    for slot, index in enumerate(
        sorted((i for i in range(3) if i != mount), key=lambda i: -extents[i])
    ):
        targets[index] = slot
    return targets


def snap_frame(axes, vertices, mean):
    """Nearest-axis assignment, for parts with no meaningful long axis."""
    targets = [None, None, None]
    free = {0, 1, 2}
    for index in np.argsort([-np.abs(axis).max() for axis in axes]):
        axis = axes[index]
        best = max(free, key=lambda candidate: abs(axis[candidate]))
        targets[index] = best
        free.discard(best)
    return signed_targets(axes, vertices, mean, targets)


def align(obj, family):
    centroids, areas, vertices = triangle_stats(obj)
    mean, axes = principal_axes(centroids, areas)

    if family in SNAP_ONLY:
        frame = snap_frame(axes, vertices, mean)
    elif family in MOUNT_AXIS:
        frame = signed_targets(
            axes, vertices, mean, mount_targets(axes, vertices, mean)
        )
    else:
        frame = signed_targets(axes, vertices, mean, AXIS_TARGETS[family])

    rotation = Matrix([list(row) for row in frame])
    obj.matrix_world = rotation.to_4x4() @ obj.matrix_world
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    low = Vector((math.inf,) * 3)
    high = Vector((-math.inf,) * 3)
    for corner in obj.bound_box:
        point = obj.matrix_world @ Vector(corner)
        low = Vector(map(min, low, point))
        high = Vector(map(max, high, point))

    obj.matrix_world = Matrix.Translation(-(low + high) / 2) @ obj.matrix_world
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return high - low


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="aligned")
    parser.add_argument("--only", default=None)
    arguments = parser.parse_args(sys.argv[sys.argv.index("--") + 1:])

    destination = os.path.join(MODELS, arguments.out)
    os.makedirs(destination, exist_ok=True)

    names = sorted(
        name for name in os.listdir(MODELS) if name.endswith(".glb")
    )
    if arguments.only:
        names = [name for name in names if arguments.only in name]

    for name in names:
        family = family_of(name[: -len(".glb")])
        obj = load(os.path.join(MODELS, name))
        size = align(obj, family)
        bpy.ops.export_scene.gltf(
            filepath=os.path.join(destination, name),
            export_format="GLB",
        )
        print(
            f"[align] {name:<48} {family:<20} "
            f"{size.x:.3f} x {size.y:.3f} x {size.z:.3f}"
        )

    print(f"[align] wrote {len(names)} meshes to {destination}")


main()
