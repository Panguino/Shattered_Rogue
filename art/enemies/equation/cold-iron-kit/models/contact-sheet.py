"""Renders every aligned mesh into one labelled sheet, for checking flips.

    blender --background --python contact-sheet.py -- [--dir aligned]

The alignment pass fixes which axis a part lies on, but the direction it faces
along that axis is inferred from how its mass is distributed, and that inference
can be wrong: a thruster whose bell is heavier than its mount will be read as
base-first and baked in backwards. That is invisible in the numbers and obvious
in a picture, so this exists purely to be looked at.

Deliberately a flat elevation rather than a hero angle. World X runs right and
world Z runs up in the image, so a correctly aligned rod stands vertical and a
panel lies wide, and the camera is yawed just far enough off axis to show which
way a part faces.
"""

import argparse
import math
import os
import sys

import bpy
from mathutils import Vector

MODELS = os.path.dirname(os.path.abspath(__file__))
COLUMNS = 6
PITCH = 1.5


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_at(path, column, row):
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    fresh = [
        obj
        for obj in set(bpy.context.scene.objects) - before
        if obj.type == "MESH"
    ]

    for obj in fresh:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = fresh[0]
    if len(fresh) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    low = Vector((math.inf,) * 3)
    high = Vector((-math.inf,) * 3)
    for corner in obj.bound_box:
        point = Vector(corner)
        low = Vector(map(min, low, point))
        high = Vector(map(max, high, point))
    size = high - low

    # Normalised per cell so a rod and a hub are equally readable. Absolute size
    # is not what this sheet is checking.
    obj.scale = Vector((0.85 / max(size),) * 3)
    obj.location = Vector(
        (column * PITCH, 0.0, -row * PITCH)
    ) - (low + high) / 2 * obj.scale.x
    return obj


def label(text, column, row):
    bpy.ops.object.text_add()
    item = bpy.context.object
    item.data.body = text
    item.data.size = 0.11
    item.data.align_x = "CENTER"
    item.rotation_euler = (math.pi / 2, 0, 0)
    item.location = Vector((column * PITCH, 0.0, -row * PITCH - 0.72))
    return item


def frame(rows, aspect):
    # The occupied area is a whole cell wider and taller than the cell centres
    # span, plus the drop to the labels underneath the bottom row.
    width = COLUMNS * PITCH
    height = rows * PITCH + 0.3
    middle = Vector(((COLUMNS - 1) * PITCH / 2, 0.0, -(rows - 1) * PITCH / 2 - 0.15))

    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.data.type = "ORTHO"
    # ortho_scale governs the render's long edge, so a tall grid has to ask for
    # the width that its height implies or the top and bottom rows fall off.
    camera.data.ortho_scale = max(width, height * aspect) * 1.02

    yaw = math.radians(22)
    pitch = math.radians(12)
    camera.location = middle + Vector(
        (
            math.sin(yaw) * 10,
            -math.cos(yaw) * 10,
            math.sin(pitch) * 10,
        )
    )
    camera.rotation_euler = (math.pi / 2 - pitch, 0, yaw)
    bpy.context.scene.camera = camera


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", default="aligned")
    parser.add_argument("--out", default="aligned-contact-sheet.png")
    arguments = parser.parse_args(sys.argv[sys.argv.index("--") + 1:])

    source = os.path.join(MODELS, arguments.dir)
    names = sorted(name for name in os.listdir(source) if name.endswith(".glb"))

    clear()
    for index, name in enumerate(names):
        column = index % COLUMNS
        row = index // COLUMNS
        import_at(os.path.join(source, name), column, row)
        label(name[len("cold-iron-v2-"): -len(".glb")], column, row)

    scene = bpy.context.scene
    scene.render.resolution_x = 1900
    scene.render.resolution_y = 1700
    frame(
        math.ceil(len(names) / COLUMNS),
        scene.render.resolution_x / scene.render.resolution_y,
    )

    scene.render.engine = "BLENDER_WORKBENCH"
    scene.display.shading.light = "STUDIO"
    scene.display.shading.color_type = "SINGLE"
    scene.display.shading.single_color = (0.55, 0.57, 0.60)
    scene.display.shading.show_cavity = True
    scene.render.film_transparent = False
    scene.world = bpy.data.worlds.new("sheet")
    scene.world.color = (0.05, 0.05, 0.06)
    scene.render.filepath = os.path.join(MODELS, arguments.out)
    bpy.ops.render.render(write_still=True)
    print(f"[sheet] {len(names)} meshes -> {scene.render.filepath}")


main()
