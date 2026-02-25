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
| **Corruption glow**  | Enemy VFX is dominated by purple-to-red bioluminescence (See [lore](14_lore_and_narrative.md)) |

### Color Language

| Element                      | Color                 | Reference                       |
| ---------------------------- | --------------------- | ------------------------------- |
| **Player shields**           | Bright cyan / blue    | Astroneer UI blue               |
| **Player damage**            | White flash           | Universal hit indicator         |
| **Kinetic weapons**          | Orange / yellow       | Crab Champions ballistic style  |
| **Energy weapons**           | Cyan / teal           | Sci-fi beam convention          |
| **Explosive weapons**        | Red-orange            | Satisfying boom colors          |
| **Critical hits**            | Gold flash + pop      | Oversized impact, special sound |
| **Enemy corruption (Outer)** | Faint purple veins    | Subtle, barely noticeable       |
| **Enemy corruption (Mid)**   | Purple-red tendrils   | Obvious, pulsing                |
| **Enemy corruption (Inner)** | Deep red glow         | Intense, alien, unsettling      |
| **Enemy corruption (Core)**  | Red + void distortion | Reality-warping shimmer         |
| **Healing**                  | Green pulse           | Universal heal color            |
| **Minerals (loot)**          | Warm gold sparkle     | Satisfying pickup particles     |
| **Research Data**            | Soft purple shimmer   | Feels valuable, scientific      |

### Weapon Impact VFX (Crab Champions-Inspired)

| Weapon Type      | Impact VFX                                                     |
| ---------------- | -------------------------------------------------------------- |
| **Pulse Cannon** | Bright orange sparks spray outward + small screen shake        |
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
| **Breach corruption** | Pulsing jellyfish tendrils on asteroids, ooze dripping in zero-g   |
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
| **GPU particles**     | Use GPU sim for high-count effects (explosions, ooze)              |

---

## 2. In-Game HUD

The HUD is minimal and stays out of the way. Information is layered: critical info is always visible, secondary info appears contextually.

### HUD Layout

```
┌────────────────────────────────────────────────────┐
│ [HP Bar]  [Shield Bar]                [Minimap]    │
│ [Hull Icon]                                        │
│                                                    │
│                                                    │
│                    GAMEPLAY                         │
│                     AREA                            │
│                                                    │
│                                                    │
│ [Minerals: 234]                                    │
│ [Warp: 3]   [RD: 42]     [Weapon Icons + Ammo]    │
│                            [Primary] [Secondary]    │
└────────────────────────────────────────────────────┘
```

### HUD Elements

| Element              | Position      | Always Visible?   | Details                                                  |
| -------------------- | ------------- | ----------------- | -------------------------------------------------------- |
| **HP Bar**           | Top-left      | Yes               | Horizontal bar, red when low, green when full            |
| **Shield Bar**       | Top-left      | Yes               | Above HP, cyan, drains first                             |
| **Hull icon**        | Top-left      | Yes               | Small ship silhouette showing damage state               |
| **Minimap**          | Top-right     | Yes               | Radar circle — dots for enemies, squares for loot        |
| **Minerals**         | Bottom-left   | Yes               | Gold icon + count                                        |
| **Warp Crystals**    | Bottom-left   | Yes               | Crystal icon + count                                     |
| **Research Data**    | Bottom-left   | Contextual        | Shows when RD is earned (fades after 3s)                 |
| **Weapon icons**     | Bottom-right  | Yes               | Primary + Secondary weapon icons with ammo/cooldown      |
| **Ability cooldown** | Bottom-center | When ability used | Radial cooldown timer for hull ability                   |
| **Boost cooldown**   | Near ship     | When on cooldown  | Small arc indicator near ship — fills as cooldown resets |
| **Drone status**     | Bottom-right  | Carrier only      | Drone count + behavior mode indicator                    |
| **Cargo indicator**  | Bottom-right  | When cargo found  | Brief flash showing new item in cargo hold               |
| **Boss HP bar**      | Top-center    | During boss       | Wide bar with boss name and phase indicator              |
| **Damage numbers**   | At enemy      | On hit            | Float upward and fade — white normal, gold crit          |
| **Sector label**     | Top-center    | On sector entry   | Fades in, stays 3s, fades out                            |
| **Low HP warning**   | Screen edges  | When < 20% HP     | Red vignette pulse at screen borders                     |

### HUD Style

| Aspect           | Spec                                                         |
| ---------------- | ------------------------------------------------------------ |
| **Font**         | Clean sans-serif (Rajdhani, Exo 2, or similar sci-fi)        |
| **Opacity**      | 80% — HUD should be visible but not dominate                 |
| **Animation**    | Bars drain/fill smoothly. Numbers pop and fade.              |
| **Color scheme** | Dark backgrounds, bright text/bars on top                    |
| **Scale**        | Slightly oversized for readability — cartoonish, not mil-sim |

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
