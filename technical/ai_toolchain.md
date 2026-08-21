# 🤖 AI-Powered Development Toolchain

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md). **Active plan:** [00_POC_PLAYABLE_LOOP.md](../00_POC_PLAYABLE_LOOP.md).

---

> [!IMPORTANT]
> **AI-first development.** Every asset pipeline — code, 3D models, textures, music, SFX, concept art — is AI-assisted. Human work focuses on curation, integration, and polish.

---

## 1. Tool Matrix

| Domain              | Primary Tool(s)                              | Use Case                                              | Human Role                                |
| ------------------- | -------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| **Code Generation** | Cursor + Unreal MCP (UE 5.8), Copilot | C++ gameplay systems, Blueprint scaffolding, editor ops | Architect, review, integration            |
| **3D Models**       | Tripo Smart Mesh                             | Ship hulls, enemy chassis, station props, environment | Sockets, scale, UV cleanup                |
| **Textures**        | Stable Diffusion, Midjourney                 | PBR textures, UI elements, skyboxes, decals           | Tiling fixes, UV projection               |
| **Music**           | Suno AI, Udio, AIVA                          | Full tracks per ring/environment, boss themes         | Stem separation, loop editing, DAW polish |
| **SFX**             | ElevenLabs SFX, Audiocraft                   | Weapon sounds, UI clicks, ambient, explosions         | Mixing, spatial audio, UE 5.8 setup       |
| **Concept Art**     | ChatGPT Images, Midjourney                   | Ship concepts (Ace style sheet), environments, UI     | Direction, style consistency              |
| **VFX**             | AI-assisted + Niagara                        | Particle effects, shields, explosions, trails         | UE Niagara implementation                 |
| **Voice / Barks**   | ElevenLabs                                   | NPC dialogue, pilot callouts, AI narration            | Script writing, directing tone            |

---

## 2. Code Generation Workflow

### C++ Systems (Cursor + Unreal MCP)

| System               | AI-Generated                                     | Human-Refined                           |
| -------------------- | ------------------------------------------------ | --------------------------------------- |
| **Enemy AI**         | Behavior tree scaffolding, Boids algorithm       | Tuning parameters, playtesting          |
| **Weapon System**    | Base weapon classes, projectile physics          | Balance numbers, VFX integration        |
| **Proc System**      | Random roll logic, chain trigger framework       | Edge cases, performance optimization    |
| **Galaxy Grid**      | Graph generation, pathfinding, sector assignment | Visual polish, transition animations    |
| **Upgrade System**   | Inventory management, slot system, rank-up logic | UI/UX, drag-drop feel, sound hookups    |
| **Co-op Networking** | Replication, RPC scaffolding                     | Latency compensation, edge case testing |

### Blueprint Documentation

> All Blueprints must include:
>
> - Comment header block explaining purpose
> - Color-coded grouping (blue = input, green = logic, red = output)
> - Collapsed subgraphs for complex sections
> - Named reroute nodes at crossings

---

## 3. 3D Model Pipeline

```
1. Concept Art (ChatGPT Images) → Style reference + silhouette (Ace sheet locked)
2. 3D Generation (Tripo Smart Mesh) → Game-ready mesh at target triangle count
3. Cleanup (Blender) → Sockets on gold hardpoints, scale, origin
4. UV Mapping (Blender auto / manual) → Proper UV layout
5. Texture (Tripo bake + AI) → Stylized diffuse + emissive; skip heavy PBR
6. LOD Generation (UE auto) → 3 LOD levels per model
7. Import to UE 5.8 → Materials, simple collision, sockets
```

Ships are static meshes (no skeletal rig). Skip rigging unless a hull needs animated parts (Organic tentacles, Juggernaut fortress turrets).

### Triangle Targets (Unreal counts triangles)

Generate **at the target**, do not generate dense then decimate. Use Tripo **Smart Mesh**, topology **Triangle**.

| Asset Type    | LOD0 tris        | LOD1     | LOD2    | Textures                    |
| ------------- | ---------------- | -------- | ------- | --------------------------- |
| **Player ships (Ace test)** | **6,000** (ok 4k–8k) | ~2,500 | ~800 | 2K diffuse + emissive |
| Player ships (final) | 5,000–8,000     | ~2,500   | ~800    | 2K diffuse + emissive |
| Enemy chassis | 2,000–4,000      | ~1,200   | ~400    | 1K diffuse + emissive |
| Station props | 500–2,000        | ~400     | —       | 1K diffuse            |
| Asteroids     | 200–800          | ~150     | —       | 1K tiling             |
| Projectiles   | 50–200           | —        | —       | Emissive only         |
| Weapons / modules (attachable) | 400–1,500 | ~300 | — | 1K diffuse + emissive |

**Why 6k for Ace:** top-down ~55° camera, stylized chunky forms, gold hardpoints must stay as distinct geo for sockets. Below ~4k the rings melt. Above ~10k is wasted at this camera and fights the 4-ship + swarm + VFX 60 FPS budget.

**Tripo settings for Ace**

- Mode: Smart Mesh — API model **`P1-20260311`** (`tripo-p1`). Not HD / not v3.1 Ultra.
- Topology: Triangle (`quad` off)
- Polycount: **`face_limit=6000`**
- Texture: on, PBR on, `texture_quality=detailed`, convert at **2048 PNG**
- `auto_size=true` so scale is meters for Unreal
- Input: isometric Ace PNG only
- Export: **GLB/GLTF** (wiki + UE Interchange) and **FBX** (native Static Mesh import)
- After import: place sockets on the 4 weapon pads and 3 engine collars (no specialty pad — Ace's 1 specialty is inventory-only)

CLI (after `tripo login`): `node art/tripo-ship.mjs interceptor/ace`

If Tripo’s slider is labeled “polygons” in quad mode, set ~3,000 quads (≈ 6,000 tris). Prefer triangle mode so the number matches Unreal.

---

## 4. Music Pipeline

| Step                | Tool              | Output                            |
| ------------------- | ----------------- | --------------------------------- |
| Generate base track | Suno / Udio       | Full song (~2–4 min)              |
| Generate variations | Suno / AIVA       | Alt arrangements, ring variations |
| Stem separation     | Demucs / Spleeter | 4–6 individual stems              |
| Loop editing        | Reaper / Ableton  | Seamless loop points              |
| Adaptive mixing     | UE MetaSound      | State-driven stem mixing graph    |
| Polish              | DAW               | EQ, compression, mastering        |

> Generate 3–5 candidate tracks per context → pick the best → stem-separate → integrate. Budget: ~30 tracks total for full game.

---

## 5. SFX Pipeline

| Category   | Generation Method                    | Post-Processing                |
| ---------- | ------------------------------------ | ------------------------------ |
| Weapons    | ElevenLabs SFX + layered synthesis   | Compression, spatial, reverb   |
| Explosions | Audiocraft generation + foley mixing | Limiting, sub bass enhancement |
| UI sounds  | Synthesized (clean, snappy)          | High-pass, steryl tone         |
| Ambient    | Field recording + AI enhancement     | Looping, volume envelope       |
| Loot drops | Musical SFX (chimes, fanfares)       | Layered by rarity tier         |

---

## 6. Concept Art Workflow

```
Prompt engineering → ChatGPT Images (style locked on Ace)
├── Ship designs: isometric studio shot, gold weapon + engine sockets (specialty is inventory-only), Ace materials
├── Environment: colorful stylized space, same lighting language
├── UI mockups: clean rounded arcade HUD
└── Enemy concepts: cartoon chassis + trait glow, same low-poly read
```

Ace style family (materials locked 2026-08-19): gold empty **weapon and engine** sockets, isometric studio shot, crimson/cream/charcoal language. Specialty slots are inventory-only. **Each named combo has a unique silhouette** — do not generate a recolored Ace. See [art/ship_prompts.md](../art/ship_prompts.md).

> **Style consistency:** Feed the locked Ace image as a reference on later gens. Do not restart style from scratch.

---

## 7. Unreal MCP (Cursor ↔ Editor)

Stay on **UE 5.8**. Official Experimental plugin is the default. Research: [engine_mcp_ai_integration.md](../research/engine_mcp_ai_integration.md).

| Step | Action |
| ---- | ------ |
| 1 | Enable plugins: **Unreal MCP**, **All Toolsets** |
| 2 | Editor Preferences → Model Context Protocol → Auto Start Server (`http://127.0.0.1:8000/mcp`) |
| 3 | Console: `ModelContextProtocol.GenerateClientConfig Cursor` |
| 4 | Open Cursor from the `.uproject` root **after** the editor is running |
| 5 | If official toolsets are too thin: add ChiR24 (free) or StraySpark (paid) — do not change engines |

Custom game tools (sockets, hull DataTables, weapon attach) should be authored as `UToolsetDefinition` with `AICallable` so Cursor can drive our pipeline, not just generic actor spawn.
