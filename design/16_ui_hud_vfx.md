# 🖥️ UI, HUD & VFX Style Guide

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

## 1. VFX Style Identity

> [!IMPORTANT]
> **Visual cocktail:** Astroneer's clean, colorful particles + Crab Champions' punchy gun impacts + No Man's Sky's cosmic scale and lighting. The result should feel premium, vibrant, and satisfying — never generic or muddy.

### VFX Pillars

| Pillar               | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Clean & readable** | Effects must never obscure gameplay. Bright colors on dark space = high contrast               |
| **Punchy**           | Every hit, shot, and explosion should feel impactful. Screen shake, flash, particles           |
| **Color-coded**      | Damage types, factions, and rarity all have distinct color language                            |
| **Cartoonish scale** | Oversized explosions, exaggerated sparks, thick projectile trails — not realistic              |
| **Machine geometry** | Equation VFX uses sterile white construction lines, hostile coral nodes, and hard-edged mathematical projections (see [lore](14_lore_and_narrative.md)) |

### Color Language

| Element                      | Color                 | Reference                       |
| ---------------------------- | --------------------- | ------------------------------- |
| **Player shields**           | Bright cyan / blue    | Astroneer UI blue               |
| **Player damage**            | White flash           | Universal hit indicator         |
| **Kinetic weapons**          | Orange / yellow       | Crab Champions ballistic style  |
| **Energy weapons**           | Cyan / teal           | Sci-fi beam convention          |
| **Explosive weapons**        | Red-orange            | Satisfying boom colors          |
| **Critical hits**            | Gold flash + pop      | Oversized impact, special sound |
| **Equation (Outer)**         | Thin diagnostic-white seams | One added machine node; almost ordinary |
| **Equation (Mid)**           | White grid + coral target nodes | Floating plates and visible graph links |
| **Equation (Inner)**         | Coral-red proof lines + black metal | Recursive lattices and nested geometry |
| **Equation (Core)**          | White-hot edges + black void faces | Impossible joints and view-dependent silhouettes |
| **Healing**                  | Green pulse           | Universal heal color            |
| **Minerals (loot)**          | Warm gold sparkle     | Satisfying pickup particles     |
| **Research Data**            | Soft purple shimmer   | Feels valuable, scientific      |

### Weapon Impact VFX (Crab Champions-Inspired)

| Weapon Type      | Impact VFX                                                     |
| ---------------- | -------------------------------------------------------------- |
| **Pulse Cannon** | Thin orange emissive bolt with a short local light; bright orange sparks spray outward + small screen shake |
| **Spread Shot**  | Multiple smaller spark bursts at each pellet hit point         |
| **Beam Laser**   | Sustained cyan glow at contact + heat shimmer on target        |
| **Missile**      | Red-orange explosion ring + debris chunks fly outward          |
| **Tesla Coil**   | Blue-white lightning arc chains between targets                |
| **Railgun**      | Long trail lingering in air + target flashes white momentarily |

### Environment VFX

| Element               | VFX Description                                                    |
| --------------------- | ------------------------------------------------------------------ |
| **Asteroid breakup**  | Chunks scatter + dust cloud + mineral fragments glow gold          |
| **Nebula**            | Volumetric fog with slow color shifts (NMS-inspired)               |
| **Void Rift**         | Reality tears — cracks in space with purple light bleeding through |
| **Convergence zones** | Survey grids crawl over asteroids; sliced wreckage hangs in symmetric arrays; loose parts assemble into machines in zero-g |
| **Warp jump**         | Star streak lines + ship stretches slightly + flash                |
| **Station dock**      | Tractor beam pulls ship in + docking clamp sound                   |
| **Explosion (enemy)** | Astroneer-style: bright pop, colorful debris, satisfying crunch    |
| **Explosion (boss)**  | Massive: screen-wide flash, slow-mo moment, debris rain            |

### Niagara System Guidelines (UE5)

| Guideline             | Rule                                                               |
| --------------------- | ------------------------------------------------------------------ |
| **Particle budget**   | Max ~500 active particles per effect, ~2000 total on-screen        |
| **Lifetime**          | Most particles live 0.3–1.0s — keep effects snappy, not lingering  |
| **Emission**          | Burst emit for impacts, continuous for beams/trails                |
| **Sprites vs Meshes** | Sprites for small effects (sparks, dust), meshes for debris/chunks |
| **Glow / bloom**      | Use emissive materials — Astroneer's "everything glows" aesthetic  |
| **GPU particles**     | Use GPU sim for high-count effects (explosions, construction fragments) |

### Equation Shape Language

The enemy faction is robotic and mathematical, but must not become a field of
generic neon triangles:

- **Outer constructs retain readable machinery.** Pistons, barrels, armor plates,
  heat sinks, and tool heads establish that these are physical robots.
- **A line must communicate a function.** Tangents predict movement, shrinking
  circles announce a firing solution, graph edges show shared defense, and grids
  mark space the network has measured.
- **Progression is geometric replacement.** Deeper enemies have less donor hull
  and more mirrored, floating, recursive structure. Color communicates protocol,
  not difficulty.
- **Motion is exact until damaged.** Components stop on clean angles and rotate
  in integer rhythms. Low health introduces dropped frames, overshoot, and
  disagreement between linked parts.
- **Avoid digital cliché.** No green Matrix rain, scrolling binary, random
  equations, holographic faces, or “evil robot” skulls.

---

## 2. In-Game HUD

The HUD is two layers. **The ship tells you about the ship.** **The frame tells you about the run.** Combat vitals sit on the hull so your eye never leaves the fight. The current mission sits on the glass edge so it does not compete with aim; score, clock, level, and currencies are intentionally absent from this slice.

> Placement is the contract. Art comes after this layout is settled in the HTML mockup.

### Placement rules

1. **Nothing critical lives only in a corner.** Hull, shields, boost, and "can I shoot" must be readable while looking at the ship / reticle.
2. **The aim reticle is not a status dump.** It stays a projected impact mark. Ready / cooldown ticks can sit *on* it; bars cannot.
3. **The ship halo is screen-space**, not hull-space. Barrel roll must not spin the health arc. Project the ship's screen bounds and draw the arcs around that box.
4. **The blueprint is a schematic, not a 3D overlay.** Hardpoints are unreadable on a rolling mesh. A small orthographic silhouette next to the ship carries slot icons and ranks.
5. **POC vs full run.** Flight Training has no score, minerals, or enemies. Empty sockets stay in the layout so we are designing the real HUD, not a tutorial HUD. Hide or dim a socket when that system is off.

### HUD Layout

```
╔══════════════ HEADER BAND (one strip, edge to edge) ═════════════╗
║                        S E C T O R  N A M E                       ║
║                     wave pips · objective line                    ║
╚═══════════════════════════════════════════════════════════════════╝
│         (boss bar hangs off the rule: name + plates only)        │
│                                                       [RADAR]    │
│                                          bare disc, no header    │
│                                          red / grey / blue       │
│                                                                  │
│                    [impact reticle]                              │
│                    + weapon ready ticks                          │
│                                                                  │
│              [ HALO: shield · hull · boost ]                     │
│                    25 points per box                             │
│                                                                  │
│ [dial] [axis bars]                      [ MODS ]                 │
│ no header                  [prompt]     hull trace + pads        │
│                                         AUX / SPEC / CARGO pips  │
└──────────────────────────────────────────────────────────────────┘

  Tab ─► loadout overlay takes the left and right thirds only.
         Centre stays clear; header + halo stay lit.
```

> **Why a band instead of a mission pod.** A full-width baseline makes the
> objective feel like the frame of the cockpit rather than another floating
> window. The centre carries only mission identity. Score, time, ship level,
> and currencies are not side zones on this strip.
>
> **The band carries the mission headline.** Sector name is 22px, with the wave
> and objective below it. Band height remains 98px so this reads at a glance and
> leaves room for the boss bar to extend from its rule.
>
> The band uses **stretched anchors**, `FAnchors(0, 0, 1, 0)`, so it tracks the
> screen edge. The three zones are a grid of `1fr auto 1fr`: equal side columns
> are what actually keeps the sector name centred, since `auto` sides would let
> it drift every time the score got another digit.

> **Why the blueprint is bottom-right, not under the ship.** Measured off a real
> frame, the Ace sits at roughly **(980, 800)** on a 1920×1080 screen — 74% of the
> way down, because the camera keeps the hull below the crosshair. Once the halo
> rings it, the arcs reach to about y=910 and there is no room left underneath for
> a readable schematic. Centre-bottom stays clear for the single interact prompt.

> **No standing text near the ship.** "AFTERBURNER READY" and the like were tried
> and cut: a permanent word floating under the hull is read once and then becomes
> noise, and it competes with the arcs for the one place the player is already
> looking. State that is always true belongs in a pip on the blueprint; state that
> is momentary belongs in the prompt line or in VFX on the ship itself.

### Ship cluster (around the pawn)

Drawn in screen space around the projected ship. Same angular language as the impact reticle (broken brackets, thin rails) so they feel like one family.

| Element | Where on the cluster | Always? | What it shows |
| ------- | -------------------- | ------- | ------------- |
| **Shield arc** | Upper arc, outer band | Yes | Cyan boxes. Drains first. Recharge delay reads as a gap that closes. |
| **Hull arc** | Lower arc, outer band | Yes | Coral boxes. |
| **Boost arc** | Lower arc, inner band | Yes | Gold boxes. Same sweep as hull, drawn thinner so it cannot out-shout it. |
| **Brake pip** | Opposite the boost arc | When braking | Dim → gold while X is held. |
| **Weapon ticks** | On the *impact reticle*, not the hull | Yes | One tick per fire group (primary / secondary). Empty = cooling, filled = ready, gold = will-hit. Infinite ammo still has a fire-rate cooldown. |
| **Incoming pip** | On the halo, toward the hit | On damage | Brief tick on the arc facing the impact. Replaces a dedicated compass. |

Do **not** put weapon cooldown on the hull halo. Aim is at the reticle; "can I shoot" belongs there. Hull halo = "will I live / can I burst."

#### One box is 25 points

Every arc is divided into boxes worth **25 points each**, and that never changes:
`boxes = max / 25`, `lit = current / 25`. A stock Ace shows 4 shield boxes, 4 hull
boxes, and 2 boost boxes. A `+50 max shields` pickup shows 6 shield boxes — it adds
boxes rather than making the existing ones worth more, so "three boxes down" costs
the same 75 points in the first sector as in the last. Design max values in
multiples of 25 or the last box lies.

The arc keeps its sweep and the boxes divide it, so a heavily buffed ship gets
thinner boxes rather than a ring creeping round to collide with its neighbour. The
box you are currently losing drains within itself, so a 10-point hit still moves
something; whole boxes stay the thing you count.

**Every arc fills left to right.** Zero is the left end, max is the right end, on
shields, hull, and boost alike — the same way a straight bar reads. Do not mirror
the top arc against the bottom one for symmetry; losing shields and losing hull
should look like the same event.

No labels, no numbers on the halo. The count *is* the readout, and `SHLD` next to a
cyan arc only repeats what the colour and position already said. Numeric hull, if we
ever want it, belongs in a hold-to-inspect panel, not on the ring.

#### Runtime port status

The first runtime slice is implemented in the live UE project at
`../game/Source/ShatteredRogue/ShatteredHUD.*`. It replaces the old
placeholder pods with a paint-only halo and reticle:

- pawn bounds origin projected to widget-local space every frame, then pushed
  **34 units down** — the chase camera frames the hull above its own bounds
  centre, so an unshifted halo rides across the fuselage;
- screen-space radii matching the HTML mockup (`168×112`, boost `142×90`);
- 25-point plates generated from live capacity, including fractional fill inside
  the plate being lost;
- four stock shield plates, four hull plates, and two boost plates;
- halo hidden in cockpit view, where there is no visible hull to surround;
- `Shattered.ShowHUD 0` still hides the whole widget for clean plate capture;
- `Shattered.HUDGaugePreview 0..1` pins every gauge to a fraction, so a state can
  be captured without flying the ship down to it. Negative uses live values.

##### Mockup parity

The mockup is kept honest against the runtime rather than trusted on its own.
`art/hud/mockup/index.html` builds each plate as an outlined path with the same
28% corner radius, the same end-to-end track and fill, the same `ceil(max/25)`
plate count, and the same danger bands, and parks the halo at `(980, 790)` —
the runtime's offset centre, which is 10 above the ship's measured visual centre
on the plate. Sampled out of both frames, an idle shield plate lands on
`rgb(14, 147, 179)` and an alerting one on `rgb(20, 210, 255)` in each.

Two things the mockup shows that the runtime has not ported yet: the reticle's
outboard weapon-ready lights and its centre dot.

Capture the mockup for a comparison with `?shot=1`, which drops the control panel
and pins the stage to 1:1, plus any control id as a query key:
`?shot=1&shield=80&hull=80&boost=40`. `art/hud/plates/halo-parity.png` is the
resulting side by side.

##### Telemetry and mission runtime slice

The bottom-left telemetry and centre-only mission header are now in the same
paint path. Telemetry reads the pawn's real velocity every frame, transforms it
into hull-local forward, reverse, strafe, and vertical components, and reads roll
rate directly from the pawn. Gold cap markers use the pawn's configured speed
limits, so tuning and future modules move the limit without rescaling the whole
instrument.

The mission header reads `AShatteredGameState::RaidPhase` and `WaveNumber`.
Training shows `FLIGHT TRAINING` and `FREE FLIGHT // F8 TUNING` with no fake
wave. Raid phases switch among deployment, three live waves, the flagship, and
win/loss summaries. The strip has no left or right zones.

##### Plate geometry

Plates are emitted as explicit meshes through `MakeCustomVerts`, not as Slate
lines. This is forced by the combination of rounded corners and translucency:
Slate thick lines are butt-capped with no round-cap mode, and every workaround
fails on a translucent plate. Stacking tapered line passes double-blends the caps
into bright nubs, and butting the passes end to end still seams, because an
antialiased Slate line is inflated past its own endpoints by the filter radius.
The mesh carries an alpha-zero skirt around its outline in place of that line
antialiasing, and offsets along the true ellipse normal so thickness stays even
across the flat part of the sweep.

Corner radius is 28% of plate thickness, shrunk to fit when a nearly drained
plate is too short for two full caps.

Track and fill are laid **end to end**, not stacked. With an opaque fill the old
overlap was harmless, but a translucent fill painted over the dark track picks up
the track and mutes its colour. The boundary between them is a level rather than
an end, so it stays square; only a plate filled to its cap gets both corners
rounded.

##### Plate opacity

Plates rest at **70% alpha** so the halo reads as glass over the scene rather
than paint on top of it, and rise to full when the row has something to say:

| Trigger | Behaviour |
| --- | --- |
| Value drops | Full alpha immediately, held 1.8s, then eased back over 0.5s |
| Value in the danger band | Pinned at full alpha until it recovers |

The rise is instant and only the return is eased, so a hit registers on the frame
it lands. Danger bands are the bottom 35% for shields and hull. Boost has none:
a boost gauge that is not topped off is already the thing you want to look at, so
anything short of full counts, which also covers the whole recharge.

Rows fade independently, so a shield hit does not light the hull. Gauge state is
tracked from the cockpit too, so ducking inside and back out cannot leave a row
stuck lit or hide a hit that landed while the halo was off screen.

The reticle is drawn from the same paint layer at **1 Slate unit** — the thinnest
line Slate still antialiases. Hairline mode (thickness `0`) is a pixel narrower
but shimmers as the aim point drifts, so it is not used. Geometry is four
cardinal rails with an open centre plus four broken corner brackets, sized to the
mockup. It has two states, driven by the blocking-hit flag from the same sweep
the projectile uses:

| State | Colour | Alpha |
| --- | --- | --- |
| Sweep lands on something shootable | gold | 1.0 |
| Nothing in the lane | cyan | 0.25 |

Unlike the halo, the reticle also draws in cockpit view, since that is the view
where it is the only aiming reference.

The current pawn exposes boost as a **cooldown charge from 0–1**, not a fuel
resource. Until boost gets a real current/max pair, the runtime HUD maps that
charge onto the authored 50-point/two-plate gauge. This preserves the visual
contract but does not pretend the underlying mechanic has already changed.

### Mods panel — silhouette + aux (bottom-right)

Orthographic top-down schematic, bottom-right, opposite the telemetry. It is a
schematic, never an overlay on the live mesh. The HUD pod has **no title bar**:
the silhouette is the hull identity, and the AUX / SPEC / CARGO rows explain why
the panel exists.

Use the authored StarCraft-style line-art source at
`art/hud/mockup/ace-attachment-schematic.png`. The mockup derives a transparent
version so its cyan linework sits directly on the scene instead of carrying a
navy rectangle. HUD and loadout both render that same asset; maintaining two
drawings guarantees they eventually disagree.

**Pads go where the physical rings are** — the rule from
[03_weapons_and_upgrades.md](03_weapons_and_upgrades.md) is that only weapons and
engine collars are gold on the mesh. On the Ace that is a **nose pair** flanking
the canopy and **one pad mid-wing** each side: four guns, which is what makes it
the only quad-gun interceptor.

> **The Ace render carries eight gold rings, not seven.**
> `art/ship_prompts.md` predicts gold count = weapons + engines, which for a 4/5/1
> Ace is 7. The model has an extra ring on the spine ahead of the nozzles. It is
> read here as the **afterburner core** — the Interceptor's hull mechanic, which
> wanted a readout anyway. Either the art rule grows a third category or the ring
> comes off the mesh; flagged rather than silently ignored.

| Slot class | On the schematic | Notes |
| ---------- | ---------------- | ----- |
| ⚔️ **Weapons** | The four authored rings plus state overlays | Gold core = installed, coral dashed overlay = empty, gold heavy ring = selected. **The only selectable thing on the hull.** |
| **Nozzles / burner** | Drawn, flat, never interactive | The 10-slot model is W/M/S and has no engine category. They are hull features; making them look clickable promises a slot that does not exist. |
| 🛡️ **Modules** | `AUX` pip row below the hull | No socket on the mesh, so it can only ever be a pip. |
| 🔧 **Specialty** | `SPEC` pip row | Same reason. |
| **Cargo** | `CARGO` pip row, warm | Uninstalled items waiting for a Shipyard. Flash when something new lands. |
| **Carrier drones** | Bay marks on the hull | Carrier only — the one hull that does get a third socket type. |

**Why the bottom group is called AUX.** Modules, specialty and cargo are grouped
under the hull because they share one property: nothing on the ship physically
holds them. That is the distinction the schematic exists to make — mounts on the
hull above, everything else listed below it.

**Row metrics.** The three pip rows are one fixed-width block right-aligned under
the schematic: label 44px, pips 99px (six at 14×7 on a 3px gap), count 38px, 7px
between columns. Fixed columns are what keep the labels and counts aligned down
the block. The counts are deliberately *not* pushed to the pod edge — an earlier
pass floated them right, and the gap it opened between the pips and the number
made the panel read as two unrelated things. The pod is sized to this block plus
the schematic (228×258 at 28px inset), so the whole cluster sits docked against
the right edge rather than floating inside a wide, mostly empty slot.

The pip counts read from the same loadout the overlay edits, so the HUD can never
drift from what the loadout screen says is fitted. Names belong on the overlay;
in flight, empty-vs-filled is the only thing worth reading.

### Boss bar (named fights only)

Top-centre, 780 wide, hanging off the header rule on a short drop tick. It only
exists during a named fight, so it is allowed to be the widest thing on the HUD.

```
                       │  ← drop tick to the header rule
              D R E A D N O U G H T   V U L K A R R
 ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓   ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▒▒   ░░░░ ░░░░ ░░░░ ░░░░
 └────── phase 1 ────┘ └────── phase 2 ────┘ └────── phase 3 ────┘
                                    ↑ plate draining inside itself
```

**Why top-centre and not somewhere with more room.** The drop tick is the whole
point: the bar slides down *out of* the header band, so it reads as the existing
UI extending rather than a new window opening mid-fight. Anywhere else and it is
a separate thing that appeared.

**Plates, not a bar.** It uses the same discrete boxes as the shield and hull
arcs, straightened out. The player has already learned to read their own vitals
by counting plates; making a boss the one thing on screen that has to be read as
a number means switching modes mid-fight, at the exact moment there is least
attention to spare. Same coral as the hull arc, same left-to-right fill, same
butt-ended boxes, same behaviour where the plate being lost drains inside itself
so a burst still moves something visible.

**One phase = four plates**, deliberately the same count as a full shield or hull
bar. A three-phase boss then reads as three of your own health bars laid end to
end, which is a quantity you already have a feel for. It also lands every phase
boundary on a gap, so widening the gap between phase groups replaces the tick
marks an earlier pass drew over the fill — the grouping *is* the phase readout.

**Name above, centred, and nothing else.** An earlier pass cut the name entirely
along with phase pips, a `PHASE 2 / 3` badge, the mechanic and range. The name
came back because a boss needs an identity and one centred line above the plates
costs nothing; the rest stayed cut. The percentage went too — plates are the
readout, and a number beside them is the same fact told twice.

| Element | Why it earns the space |
| ------- | ---------------------- |
| **Phase grouping** | Wider gap every four plates. "One group to the next wipe mechanic" without a phase counter or ticks drawn over the fill. |
| **Lost-recently ghost** | The hot band between current HP and where HP was a moment ago. On a bar this long a good burst otherwise moves nothing visible and the fight feels inert. |

**The ghost is hotter than the fill, not dimmer.** The first pass drew it as a
washed-out coral, which is the same language every other UI uses for "partially
filled" or "preview" — so a third band sitting between the fill and the empty
track read as a third tier of health rather than as a hit. It is now orange
(`--hot`) with a white-hot 2px leading edge, so the brightest pixel on the bar is
the exact point damage is landing. Nothing else on the boss bar is hotter than
the health itself, which leaves impact as the only thing it can mean.

The white edge is gated to the single plate holding the fill boundary. A ghost
spanning two plates would otherwise paint an edge at the start of the second one
as well, inventing a boundary that is only where the plates happen to divide. A
small hit is nearly all edge and reads as a white spark, which is correct.

Range and the current mechanic still matter — see
[17_anti_kiting_combat.md](17_anti_kiting_combat.md) — but they belong on the
boss in world space or in the halo, not as a caption strip up here.

Phase pips in the header show phases **remaining**, not elapsed. Coral throughout:
it is the only cluster on the HUD that is entirely about a hostile.

### Dropped: the Contacts pod

A dedicated `CONTACTS 07 / 14` pod under the economy was cut. It was the third
place the same wave was being reported — the sector line already says `WAVE 3 / 5`
and the radar already shows every hostile as a dot. The one part that was not
duplicated, *how many are still alive*, survives as a `07 HOSTILES` chip in the
score zone, which is where the other kill-related numbers already live.

### Frame cluster (screen edges)

| Element | Position | Always? | Details |
| ------- | -------- | ------- | ------- |
| **Mission** | Header band, centre only | Yes | Sector / mode name, wave pips, one-line objective. The centre is the only spot a player reads without looking away from the reticle. No score, clock, ship level, or currencies flank it. |
| **Boss / objective HP** | Hangs off the header rule, top-centre | Contextual | See below. |
| **Radar** | Top-**right**, under the mission rule | Yes | Bare disc, no header, no counts. See the contact key below. |
| **Flight telemetry** | Bottom-left | Yes | See below. |
| **Ship level / XP** | Footer bar, bottom edge | Yes | See below. |
| **Low hull warning** | Screen-edge vignette | Hull < 20% | Coral pulse. Does not add another bar. |
| **Level-up / interact** | Center-low, above the blueprint | Contextual | Tech card ready, dock, scan, tractor. One prompt at a time. |

### Level footer (bottom edge)

XP is a green bar running the full width of the bottom edge, with `LEVEL 7`
centred just above it. It was a 52px stub tucked under the clock in the top-right
corner — both the furthest point on screen from the reticle and about the
smallest that bar could have been drawn, for the one number a player actually
wants to watch climb.

Green appears nowhere else in the HUD. Cyan is nominal, gold is a cap, coral is a
threat; progression is the only thing on screen that is never a warning, so it
gets its own hue rather than borrowing one that already means something. The fill
bleeds to the screen edge on purpose: this is background information, and a bar
on the boundary of vision is read without ever being looked at.

The footer also balances the frame. With the header band across the top and
nothing along the bottom, the HUD read as top-heavy the moment the score and
clock zones were restored.

### Radar (top-right)

2D disc in the ship's forward / camera plane, with a vertical stem per contact
for altitude relative to you — up means above. A true 3D sphere radar is too
noisy for a cartoon HUD, and a cardinal compass is meaningless out here.

Three contact classes, and **each carries a shape as well as a colour**, because
at 5px a red dot and a grey dot are the same dot to a colourblind player:

| Contact | Colour | Shape |
| ------- | ------ | ----- |
| **Hostiles** | Coral | Filled circle |
| **Asteroids** and other inert mass | Grey | Diamond |
| **Allies** | Blue | Chevron |
| **You** | Cyan | Chevron, centre |

**Ally blue is deliberately not the player's cyan.** Everything the player owns
is cyan across the whole HUD, so a teammate rendered in the same cyan makes "me"
and "not me but friendly" the same signal on the one display where telling them
apart is the point. For the same reason ally chevrons must never spawn on the
centre marker.

**No header, no counts.** The pod used to carry a `CONTACTS` caption, an `ALIVE`
tally and the wave. All three went: a disc covered in dots does not need a label
telling you it is a radar, and the wave is already in the header band.

**Units.** The HUD reads **one world unit as one metre**, everywhere. The speed
dial prints `Velocity.Size()` straight out of the pawn under an `M/S` caption,
so a 3,000uu radar sweep is labelled 3,000 M: at the 800uu/s cap the rim is
about four seconds away. Reading uu as centimetres instead would make the same
ship an 8 M/S jogger. Any distance printed on the HUD follows the dial.

**Scale.** The sweep is **3,000** — a tactical bubble around the ship, not a map
of the sector. At the 800 M/S cap the rim is about four seconds of flight away:
far enough to turn, close enough that a blip is your problem now.

Sizing it to the content instead was the mistake made twice. `ArenaBoundsRadius`
(150,000) is the physics backstop nothing ever flies to, and it squeezed the
whole asteroid field into the middle sixth of the disc. A field's seeded extent
(now roughly 4,500–8,200 depending on Cloud / Disk / Belt / Clusters / Sparse)
is not much better: rendering an entire sector into an 84px disc puts everything
you could react to inside the first few pixels. **The sweep should be sized to
reaction time, not to how far the content happens to extend.** Rocks past the
rim are simply not your concern yet.

Distance maps linearly; anything past the sweep parks on the rim rather than
drawing outside it. Pirates ingress at ±2,100, so the fight still arrives inside
the disc.

Altitude carries a **separate** 1,600 scale, because the field is far wider than
it is tall (±1,400) and a shared scale collapses every stem to a stub. It did
*not* shrink alongside the sweep: the field is still 1,400 tall, so tightening
this would clamp stems that are reporting real altitude. Culling is planar for
the same reason — a rock directly overhead still belongs on the disc.

Both scales are **labelled from the constants they annotate** (`RNG 3000 M`
above the disc, `ALT 1600 M` below it) and the rings sit on exact thirds, so the
inner two read a clean 1,000 and 2,000 without arithmetic. These labels were
frozen at `+10 M` / `-10 M` through several range changes, which quietly made
every distance on the instrument unreadable.

**Contact selection.** Hostiles and allies keep a straight nearest-N cut at 24
and 8: they are threats, and the near ones are the ones that matter. Asteroids
do not, because rocks are terrain and terrain has to report its true extent. The
disc keeps the nearest 14 — the ones you could actually hit — then takes an even
stride through the rest of the distance-sorted list to fill **30**.

A plain nearest-N cut is what produced the "asteroids are jammed in the middle"
report. The closest N of a few hundred rocks all fall inside the first ring, so
every seed painted a dense clot at the centre surrounded by empty space that
does not exist out there. Because the field is spread by *area*, an even stride
through the sorted list reproduces its real radial density instead.

Range and cap are the two halves of the same dial, and both were measured on
seed 196:

| Sweep | Cap | Rocks in range | Inner / middle / outer thirds |
| ----- | --- | -------------- | ----------------------------- |
| 6,000 | 44 (nearest-only) | ~205 | ~40 / 4 / 0 — the clot |
| 6,000 | 44 (strided) | ~205 | 21 / 11 / 12 |
| **3,000** | **30 (strided)** | **~70** | **5 / 16 / 9** |

Tightening the sweep is what actually empties the centre: at 3,000 only five
contacts fall inside the first ring, because there is simply less field crammed
into the middle of the disc. The cap came down with it — thirty dots on an 84px
disc is a readable instrument, forty-four is wallpaper.

**Refresh.** *Finding* contacts walks every actor of three classes, so it stays
periodic at 4Hz. *Placing* them is one inverse transform each and runs every
frame. An earlier pass did both at 10Hz, which made the disc visibly step while
the world behind it moved smoothly — the disc turns with the ship, so its refresh
rate is as legible as the camera's.

**Scan ring.** A cyan ring expands from the chevron to the rim every 2.6s,
brightening on a sine so it wells up out of the centre and thins out at the edge
rather than switching off there. Contacts lift from 0.7 to full opacity as the
ring reaches them, phase-locked to it, so the shimmer always has a visible cause.
This replaced a static quarter-wedge that implied a spinning dish which never
turned: a parked ship had a dead instrument. The floor of 0.7 is deliberate —
the disc has to stay readable between passes, so this is a shimmer and not a
reveal. A radar you have to wait on is a radar you stop checking.

### Flight telemetry (bottom-left)

A radial gauge for overall speed, with a segmented bar per axis beside it so
6DOF does not feel like a single throttle. **No header** — a dial reading `M/S`
next to five labelled axis bars does not need a caption saying "telemetry".

| Readout | What |
| ------- | ---- |
| **Speed** | The dial. `\|velocity\|`, tagged `VEL` — in 6DOF you can be doing 400 sideways, so this is not the same number as the forward bar and must not be mistaken for it. |
| **Forward / back** | Current along hull X vs `ForwardMax` / `ReverseMax`. |
| **Strafe** | Current along hull Y vs `StrafeMax`. |
| **Vertical** | Current along hull Z vs `VerticalMax`. |
| **Roll rate** | Deg/s vs roll cap — rotation, not a translation speed. |
Caps come from the ship, not the sector. When a module raises a cap, the bar's end marker moves.

**The dial runs 0 to a round scale maximum, not 0 to your cap.** The gold redline
sits at the hull's top speed partway round the dial, so a thruster upgrade visibly
pushes it outward. A dial that always ends at your own maximum makes a freighter
and an interceptor look identically fast, and hides every engine upgrade you buy.

**All axis bars share one scale**, set by the largest cap on the ship. That is the
whole point of drawing them together: strafe genuinely is a fifth of forward, and
five bars normalised to their own caps would all look full and say nothing.

### World-space (not HUD chrome)

| Element | Where | Notes |
| ------- | ----- | ----- |
| **Impact reticle** | Projected muzzle hit | Already shipped. Gold/coral on blocking hit. |
| **Damage numbers** | At the victim | White normal, gold crit. |
| **Teammate tags** | Over allied ships | Name + hull pip. Off-screen = edge chevron. |
| **Scientist scan** | Over scanned enemy | HP / weakness, only while analyzed. |
| **Loot beams** | On pickups | Gold minerals, purple RD. Magnet scoop just thickens them. |

### What this layout deliberately drops

| Dropped from the POC HUD | Why |
| ------------------------ | --- |
| ACE // INTERCEPTOR title | The blueprint silhouette *is* the hull identity. |
| Keybind cheatsheet | Training-only. Pause / options owns bindings. |
| Camera tag (`F1 CHASE`) | Debug. |
| Duplicate hull/shield bars in the top-left | Those move onto the ship halo. |
| Solid glass pods over every corner | Frame info can stay glass; the ship cluster should be line-art, not boxes covering the model. |

## Loadout overlay (`Tab`)

Full-run ship screen: what is bolted on, what is in the hold, and what swapping
one for the other would do.

```
════════ HEADER BAND stays lit ════════════════════════════════════
 SHIP  map  codex ////////////  IN FLIGHT — NO SHIPYARD IN RANGE  [TAB]
┌─────────────────────┐                         ┌──────────────────┐
│ ACE // INTERCEPTOR  │                         │ CARGO HOLD  5/6  │
│                     │      ← still flying →   │ [W] VOID LANCER  │
│    ╱▔▔▔╲  schematic │                         │ [W] CRYO BLASTER │
│   ╱ ○ ○ ╲ 4 pads    │        your ship        │ [M] SWARM CAP.   │
│  ╱_______╲          │        + halo           │ [S] ORE SNIFFER  │
│                     │        + reticle        │ [Q] REPAIR CELL  │
│ WEAPONS      3/4    │                         ├──────────────────┤
│ MODULES      3/5    │                         │ FITTED │ SELECTED│
│ SPECIALTY    1/1    │                         │ ─────────────────│
└─────────────────────┘                         │ [SHIPYARD REQ'D] │
              ENGINES LIVE // GUNS OFFLINE      └──────────────────┘
```

### The middle third stays empty

Stations do not pause in co-op ([07_stations.md](07_stations.md)) — three other
players are still fighting. So this screen is drawn over a ship that is still
being shot at, and **anything covering screen centre makes opening your own
inventory the most dangerous act in the game.**

Everything follows from that:

| Rule | Why |
| ---- | --- |
| Two panes hug the edges; centre ~32% is untouched | The gap is the survival corridor. Panes wash to fully transparent toward it rather than ending on a hard edge. |
| Header band, halo and reticle stay at full opacity | Hull, shields and hostile count are exactly what you need while distracted. Everything else recesses to 14%. |
| The mods pod hides outright | The overlay draws the same schematic ten times bigger. Leaving it dimmed just ghosts it behind the compare panel. |
| Panes slide in from their own edge, 0.22s | Fast enough not to be a tax, directional enough to show where it came from. |
| No pause, ever | Consistent with stations. If it pauses solo but not co-op, players learn the wrong habit. |

**Opening it costs your guns, not your engines.** Throttle, strafe and roll stay
live so you can keep evading; the mouse belongs to the UI, so you cannot aim or
fire. That is a real, readable price for reading your inventory mid-fight, and it
is legible in one line at the bottom of the screen. Taking a hard hit should
close the overlay outright.

### Install is Shipyard-only, and the screen has to say so

Per [02_core_mechanics.md](02_core_mechanics.md), found gear goes to Cargo and
only a **Shipyard** installs it; duplicates that rank up an equipped item apply
instantly, and quick-use consumables need no station. So the overlay has two
states, and the difference is one line and one button:

| | In flight | Docked at a Shipyard |
| --- | --- | --- |
| Status line | `IN FLIGHT — NO SHIPYARD IN RANGE`, coral | `DOCKED — SHIPYARD ONLINE`, lime |
| Empty slot | `SHIPYARD REQUIRED`, dashed, dead | `INSTALL` |
| Occupied slot | `SHIPYARD REQUIRED` | `SWAP — 25 MIN` (station price) |
| Quick-use item | `USE — [R]`, live | `USE — [R]` |

**Locked, not hidden.** The dead button still names the action and the reason.
Hiding it teaches nobody that Shipyards exist; greying it out teaches the whole
rule in one glance.

### Reading the panes

**Left — the ship.** Schematic on top with the four weapon pads live: clicking a
pad selects that slot, and the matching rack row highlights (and vice versa, so
the two halves are never out of sync). Below it, three racks — `WEAPONS 3/4`,
`MODULES 3/5`, `SPECIALTY 1/1` — straight from the combo matrix in
[01_game_vision.md](01_game_vision.md). **Slot counts are per named combo, not per
hull**: Ace is 4/5/1 but Prospector on the same hull is 2/4/4, so the racks have
to be generated, never laid out by hand.

**Right — the hold, then the comparison.** Items that cannot go in the selected
slot recede to 32% rather than disappearing; the hold is small enough that hiding
things just makes them vanish. Selecting one fills a `FITTED | SELECTED`
side-by-side so the trade is visible before it is paid for.

Rarity is the one place colour carries meaning alone, so it drives the dot, the
name and the label together: common grey, uncommon lime, rare cyan, epic violet,
legendary gold, **cursed coral** — with the drawback line printed in the same
coral underneath, because a cursed item that reads as "just a good item" is a
trap rather than a decision.

### `Tab` versus `I`

[15_controls_and_camera.md](15_controls_and_camera.md) had `Tab`/`M` on the
galaxy map and `I` on cargo. Rather than pick a winner, `Tab` opens **one ship
screen with a page rail** — `SHIP · MAP · CODEX` — and `I` and `M` jump straight
to their page. One key for "show me information", direct keys for people who know
where they are going, and no second overlay competing for the same third of the
screen.

### What was missing from the first sketch (keep these)

These are in the design docs and will surprise us later if the HUD has no socket for them:

| Missed | Why it needs a home |
| ------ | ------------------- |
| **Warp Crystals** | Jump fuel. Easy to forget if "money" is only minerals. |
| **Power Cores / XP** | In-run level-ups. Economy cluster, last pip. |
| **Luck** | Hidden-ish but visible; belongs with score, not money. |
| **Hull unique mechanic** | Cloak charge, fortress deploy, drone mode, regen. A pip in the blueprint's specialty slot — *not* a standing text line under the ship. |
| **Cargo waiting to install** | Hauler identity. Pip on the blueprint. |
| **Co-op teammates** | Edge chevrons + radar. |
| **Boss / flagship HP** | Replaces the skinny scenario chip. |
| **Incoming-hit direction** | Halo pip. Space has no ground, so a 2D hit marker on screen-center is weaker than a tick on the ship ring. |
| **Interact / level-up prompt** | Center-low. |
| **Secondary fire** | Second tick on the reticle. RMB is `--` in the POC; the socket should exist. |

### HUD Style

| Aspect           | Spec                                                         |
| ---------------- | ------------------------------------------------------------ |
| **Font**         | Chakra Petch (see Typography below) — single family, whole UI |
| **Opacity**      | 80% — HUD should be visible but not dominate                 |
| **Animation**    | Bars drain/fill smoothly. Numbers pop and fade.              |
| **Color scheme** | Dark backgrounds, bright text/bars on top                    |
| **Scale**        | Slightly oversized for readability — cartoonish, not mil-sim |

### Typography

One family for the whole UI: **Chakra Petch** (Cadson Demak, SIL OFL 1.1). It is
a squared-off techy sans with clipped corners on the counters, which reads as
machined rather than generic-futuristic, and unlike a display face such as
Orbitron it stays legible at the 9px label size the instruments run at. Using a
single family across labels, numerals and body copy is what makes the HUD, the
loadout overlay and the menus feel like one system.

Weights in use: 400 for values and body, 500 for instrument labels, 600–700 for
headers.

**Tracking carries the sci-fi read, not the size.** Labels run 0.16–0.20em,
values near zero. Small-and-wide beats large-and-tight for the instrument look.

#### Tabular digits have to be built, not requested

Chakra Petch ships **no `tnum` feature**, so `font-variant-numeric: tabular-nums`
is silently a no-op on it. Its digits are properly proportional as well — not
just a narrow `1`. Measured advances at weight 400:

| Digit | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| em | .628 | .358 | .550 | .579 | .555 | .582 | .598 | .498 | .614 | .603 |

A score ticking `111,111` → `222,222` grows by about a third of its own width.
Left alone, every live readout on the HUD twitches.

The fix is a digit cell: each digit sits in a box `0.63em` wide — the widest
glyph — and is centred in it. That is what a tabular figure set does; the only
difference is that the glyphs keep their proportional shapes rather than being
redrawn, so the `1` carries more air than it would in a purpose-built set. Cells
are applied to **all** digits, not only the ticking ones, so a static number
never sits at a different rhythm to a live one beside it.

This follows into the game. Slate cannot synthesise tabular figures either, so
the UMG readouts need the same fixed-width digit cells; it is not a mockup-only
workaround. If that becomes painful, the alternative is pulling digits from a
companion face with true tabular figures via a unicode-range split, at the cost
of a second font in the build.

**Symbols fall outside the subset.** Star ranks (`U+2605`/`U+2606`) are not in
Chakra Petch — no text face carries them — so they render from a fallback with
unrelated metrics. Any column holding them needs a fixed width or the column
beside it moves row to row.

The mockup self-hosts the latin subset in `art/hud/mockup/fonts/` rather than
linking the Google CDN, so it renders identically offline and under headless
capture. Note that `@font-face` will not load over `file://` in Chromium — the
mockup has to be served (`node serve.mjs`) or it silently falls back to Consolas
and every judgement made from it is about the wrong typeface.

The game does **not** go through a `UFont` asset. `UShatteredHUD` paints with
Slate primitives rather than `UTextBlock`s, so it builds an
`FStandaloneCompositeFont` over the full TTFs in
`game/Content/UI/Fonts/`, with Regular / Medium / SemiBold / Bold as
typeface entries. That keeps the face a code-side decision that no one has to
re-import after editing the HUD, and it fails soft: if the files are missing the
widget logs once and falls back to the Slate default rather than drawing
nothing. The cost is that the cooker has no asset reference to follow, so the
directory is staged explicitly via `DirectoriesToAlwaysStageAsUFS` in
`DefaultGame.ini`. Anything built in UMG later should still use a real `UFont`
asset. The OFL only requires shipping the license alongside, which is in both
`fonts/OFL.txt` and next to the TTFs.

### Iterating the HUD

The HUD is built in C++ (`UShatteredHUD`), which is a poor place to judge
composition: every tweak costs a compile. So layout is worked out first in a
browser mockup, then ported back. Run `node serve.mjs` from `art/hud/mockup/`
and open <http://localhost:5173/mockup/>; opening the file straight off disk
works too, but the clipboard the export buttons use is blocked outside a secure
context.

The mockup stacks three layers over a fixed 1920×1080 stage:

| Layer | Contents                                                              |
| ----- | --------------------------------------------------------------------- |
| Plate | A real frame from the game with the HUD switched off                  |
| HUD   | The pods, as HTML and CSS                                             |
| Guides| Title-safe box, thirds, and anchor crosses                            |

**Why it ports cleanly.** A `.pod` in `hud.css` is one `UCanvasPanelSlot`. It
takes the same four values the C++ passes — anchors, alignment, position, size —
and resolves them with the same formula Slate uses, so a pod sits on the same
pixel in both places. Drag a pod in the browser and *Copy every pod as C++*
emits the `SetAnchors` / `SetAlignment` / `SetPosition` / `SetSize` calls to
paste into the `Build*Pod` functions.

The palette in `hud.css` is the source of truth for colour: `ShatteredHUDStyle`
builds its `FLinearColor`s from the same hex strings via `FromSRGBColor`, so the
browser and Slate land on the same pixel and neither can drift. Everything Slate
draws goes through `ToFColor(true)`, so authoring in linear floats instead would
mean two different numbers for one colour, which is how the runtime plates and
the runtime reticle ended up rendering the same constant differently.

Vitals are deliberately more saturated than a flat mockup needs, because plates
spend most of their time at 70% alpha over a nebula and lose chroma to whatever
is behind them.

Because anchors are proportional rather than absolute, the resolution picker is
the cheapest way to catch pods that collide or drift off-screen on ultrawide.

**Capturing a state.** Add `?shot=1` to hide the control panel and pin the stage to
1:1, then point a headless browser at it with `--window-size=1920,1080` for a
pixel-exact frame. Any other query key sets the control of the same name, so a
specific state is reproducible without touching a slider:

```
index.html?shot=1&shield=0&hull=18&boost=12
index.html?shot=1&shield-max=150&shield=112&hull-max=125&hull=97
```

**Capturing a plate.** `Shattered.ShowHUD 0` stops the HUD drawing so a frame
can be grabbed with nothing over it; launch the game with
`-ExecCmds="Shattered.ShowHUD 0"` and run `art/hud/plates/capture-plate.ps1` to
write the window out. Plates live in `art/hud/plates/`, and any PNG dropped on
the mockup window replaces the current one.

**On HUD art.** A single full-screen transparent PNG is the wrong shipping
format: it cannot stretch across aspect ratios without distorting, and it costs
far more memory than the geometry it draws. Once a layout is settled here, the
pieces that genuinely need art — pod frames, the reticle, ability sockets — are
exported as small transparent PNGs and applied as nine-slice brushes, so corners
stay crisp while edges stretch. Everything else stays as Slate primitives.

In practice almost nothing has needed art yet. The reference sci-fi HUD look is
built from straight lines, flat fills, arcs and tick marks — all of which are
cheaper and *better* as geometry, because they have to move: a gauge arc tracks
speed, a redline tracks a stat, a bar tracks a cap. Baking any of that into a
texture would freeze the one thing that has to change.

### Instrument chrome

**Every pod floats.** No panels, no frames, no glass — content sits straight on
the scene the way the halo and reticle always did. A framed variant with cut
corners and bracket corners was built first and cut: it read as a window pasted
over the game, and the moment one pod lost its frame the rest looked like
leftovers from a different HUD. There is no middle option — a faint background
is the worst of both, too weak to help legibility and strong enough to look like
a mistake.

The shared style is now just four things:

| Feature | Rule |
| ------- | ---- |
| **Header** | Gold square, mono title, diagonal hatch filler, dim badge right-aligned, all sitting on a 1px cyan rule. The rule is what makes a cluster of readouts read as one instrument instead of scattered numbers. |
| **Type** | Chakra Petch, 9–11px, wide tracking. Values large and light, labels small and muted. |
| **Fills** | Flat. No gradients, no bevels, no glow. The one filled shape allowed is the radar disc, because dots need a plane to sit on. |
| **Palette** | Scoped to `.instrument`, hotter than the base tokens — floating cyan has to survive a nebula behind it. Cyan is nominal, gold is a limit or a cap, coral is past a limit or hostile. |

A floating readout has to carry its own contrast. The mockup uses a CSS
`drop-shadow`, which **Slate has no equivalent for**. In UMG this becomes:

- `UTextBlock` — `ShadowOffset` `(0, 1)` with `ShadowColorAndOpacity` near-black.
- Lines, arcs and bars — draw the same geometry once in near-black at a 1px
  offset before drawing it in colour, roughly doubling the draw calls for that
  widget.

---

## 3. Menu Screens

### Main Menu

```
┌─────────────────────────────────────────┐
│                                         │
│          S H A T T E R E D              │
│              R O G U E                  │
│                                         │
│          ▸ Launch Run                   │
│          ▸ Hub Station                  │
│          ▸ Co-op Lobby                  │
│          ▸ Settings                     │
│          ▸ Quit                         │
│                                         │
│    [Ship rotates slowly in background]  │
└─────────────────────────────────────────┘
```

### Galaxy Map Screen

| Element             | Details                                                       |
| ------------------- | ------------------------------------------------------------- |
| **Layout**          | 2D hex grid viewed from above, ship icon at current sector    |
| **Sector icons**    | Color-coded by encounter type, size shows difficulty          |
| **Fog of war**      | Unseen sectors are dark, adjacent sectors show type icon      |
| **Jump lines**      | Lines connect reachable sectors based on Jump Range           |
| **Warp cost**       | Number shown on each jump line (scales by ring)               |
| **Glyphs**          | Barrier lines shown between rings — glow when Glyph collected |
| **Station markers** | Distinct icon (anchor shape), always revealed                 |

### Cargo / Loadout Screen

```
┌──────────────────────────────────────────────────┐
│  LOADOUT                          CARGO HOLD     │
│                                                  │
│  [Primary Weapon]                 [Slot 1: Item] │
│  ┌──────────────┐                [Slot 2: Item]  │
│  │ Pulse Cannon │                [Slot 3: Empty] │
│  │ ★★☆ Rare     │                                │
│  │ DMG: 45      │                                │
│  └──────────────┘                                │
│                                                  │
│  [Secondary Weapon]                              │
│  [Module Slots: 1/4]                             │
│  [Specialty Slot: 0/1]                           │
│                                                  │
│  [Minerals: 234]  [Warp: 3]  [HP: 85/100]       │
└──────────────────────────────────────────────────┘
```

### Station Screen (Shipyard Example)

| Section     | Function                                               |
| ----------- | ------------------------------------------------------ |
| **Install** | Drag cargo items into loadout slots                    |
| **Swap**    | Swap installed weapons — old goes to cargo             |
| **Repair**  | Spend Minerals to restore HP (cost scales with damage) |
| **Scrap**   | Destroy cargo items for Minerals                       |
| **Leave**   | Return to sector and continue run                      |

### Run End Screen

| Outcome          | Screen Contents                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| **Run Complete** | "BREACH SEALED" / "RUN COMPLETE" + stats summary (sectors, kills, minerals, RD earned, time, weapons found) |
| **Run Failed**   | "SIGNAL LOST" + where you died, enemies killed, minerals/RD earned (kept), retry prompt                     |

### Settings Screen

| Category          | Options                                                      |
| ----------------- | ------------------------------------------------------------ |
| **Graphics**      | Resolution, fullscreen, VSync, quality preset, FOV           |
| **Audio**         | Master, Music, SFX, Voice volume sliders                     |
| **Controls**      | Full rebinding for KB/M and controller                       |
| **Gameplay**      | Screen shake intensity, damage numbers on/off, minimap scale |
| **Accessibility** | Colorblind mode, HUD scale, aim assist toggle                |
