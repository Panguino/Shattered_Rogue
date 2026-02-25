# 🤖 AI-Powered Development Toolchain

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **AI-first development.** Every asset pipeline — code, 3D models, textures, music, SFX, concept art — is AI-assisted. Human work focuses on curation, integration, and polish.

---

## 1. Tool Matrix

| Domain              | Primary Tool(s)                              | Use Case                                              | Human Role                                |
| ------------------- | -------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| **Code Generation** | Antigravity (Gemini), Cursor, GitHub Copilot | C++ gameplay systems, Blueprint scaffolding, shaders  | Architect, review, integration            |
| **3D Models**       | Tripo AI, Meshy                              | Ship hulls, enemy chassis, station props, environment | Retopology, UV cleanup, rigging           |
| **Textures**        | Stable Diffusion, Midjourney                 | PBR textures, UI elements, skyboxes, decals           | Tiling fixes, UV projection               |
| **Music**           | Suno AI, Udio, AIVA                          | Full tracks per ring/environment, boss themes         | Stem separation, loop editing, DAW polish |
| **SFX**             | ElevenLabs SFX, Audiocraft                   | Weapon sounds, UI clicks, ambient, explosions         | Mixing, spatial audio, UE5 setup          |
| **Concept Art**     | Midjourney, DALL-E 3                         | Ship concepts, environment mood boards, UI mockups    | Direction, style consistency              |
| **VFX**             | AI-assisted + Niagara                        | Particle effects, shields, explosions, trails         | UE5 Niagara implementation                |
| **Voice / Barks**   | ElevenLabs                                   | NPC dialogue, pilot callouts, AI narration            | Script writing, directing tone            |

---

## 2. Code Generation Workflow

### C++ Systems (Antigravity / Copilot)

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
1. Concept Art (Midjourney) → Style reference + silhouette
2. 3D Generation (Tripo/Meshy) → Base mesh from concept
3. Retopology (manual) → Clean topology for animation/LODs
4. UV Mapping (manual/Blender auto) → Proper UV layout
5. Texture (AI + manual) → PBR materials from text prompts
6. Rigging (manual) → Skeleton for animation
7. LOD Generation (UE5 auto) → 3 LOD levels per model
8. Import to UE5 → Set up materials, physics, collision
```

### Model Quality Targets

| Asset Type    | Polycount Target | LODs | Textures              |
| ------------- | ---------------- | ---- | --------------------- |
| Player ships  | 5,000–10,000     | 3    | 2K diffuse + normal   |
| Enemy chassis | 2,000–5,000      | 3    | 1K diffuse + emissive |
| Station props | 500–3,000        | 2    | 1K diffuse            |
| Asteroids     | 200–1,000        | 2    | 1K tiling texture     |
| Projectiles   | 50–200           | 1    | Emissive material     |

---

## 4. Music Pipeline

| Step                | Tool              | Output                            |
| ------------------- | ----------------- | --------------------------------- |
| Generate base track | Suno / Udio       | Full song (~2–4 min)              |
| Generate variations | Suno / AIVA       | Alt arrangements, ring variations |
| Stem separation     | Demucs / Spleeter | 4–6 individual stems              |
| Loop editing        | Reaper / Ableton  | Seamless loop points              |
| Adaptive mixing     | UE5 MetaSound     | State-driven stem mixing graph    |
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
Prompt engineering → Midjourney/DALL-E
├── Ship designs: "cartoon spaceship [hull type], [aesthetic], Astroneer style"
├── Environment: "[environment type] space scene, colorful, stylized"
├── UI mockups: "game UI, upgrade selection, fantasy RPG style"
└── Enemy concepts: "cartoon space [chassis type], [trait], glowing [color]"

Iterations: 4–8 per concept → select → refine → model
```

> **Style consistency:** Use Midjourney style references (`--sref`) to keep all concepts in the same art family. Create a style ref sheet early and reference it for all subsequent generations.
