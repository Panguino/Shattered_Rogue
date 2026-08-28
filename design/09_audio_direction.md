# 🎵 Audio & Music Direction

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

## 1. Sound Identity

> **TL;DR:** Arcade-era MIDI sensibility meets modern EDM production. Think chiptune composers who graduated to Ableton. Melodic, energetic, emotionally resonant — never generic "space ambient."

| Aspect                | Direction                                                                      |
| --------------------- | ------------------------------------------------------------------------------ |
| **Core Aesthetic**    | Retro-tinged electronic — MIDI arpeggios, FM synth leads, punchy drum machines |
| **Modern Production** | Full EDM production quality — sidechaining, stereo width, sub bass             |
| **Emotional Range**   | Heroic (boss fights) → Eerie (nebula) → Pumping (chase) → Chill (station)      |
| **Reference Artists** | Mick Gordon (DOOM), Disasterpeace (Hyper Light Drifter), C418 (Minecraft)      |
| **Reference Games**   | Celeste, Hades, Risk of Rain 2, FTL, Crypt of the NecroDancer                  |

---

## 2. Adaptive Music System

Music reacts to gameplay state in real-time — no jarring transitions:

| State                 | Musical Response                                          | Transition             |
| --------------------- | --------------------------------------------------------- | ---------------------- |
| **Exploring**         | Ambient pads, soft arpeggios, sparse percussion           | Fade in over 3s        |
| **Approaching Enemy** | Tension layer adds — low bass, rhythmic pulse             | Crossfade 2s           |
| **Combat**            | Full track drops — drums, bass, lead melody, high energy  | Hard cut on first shot |
| **Boss Intro**        | Cinematic swell → silence → boss theme drops              | Dramatic 2s pause      |
| **Boss Phase Change** | Track shifts key/tempo, new instruments layer in          | Seamless stem swap     |
| **Low HP**            | Distortion filter, heartbeat bass, reduced percussion     | Gradual filter sweep   |
| **Victory**           | Triumphant fanfare → track resolves to major key          | 1s silence → fanfare   |
| **Death**             | Music cuts to reverb tail → somber 4-bar conclusion       | Hard cut → fade        |
| **Station/Hub**       | Chill, lo-fi, warm synths. Genre: chillwave / lo-fi beats | Crossfade on dock      |

### Technical Implementation

| Feature               | Details                                                                             |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Stem-based mixing** | Each track has 4–6 stems (drums, bass, melody, pads, FX, vocals) mixed in real-time |
| **Horizontal mixing** | Different stems activate based on game state (combat adds drums + bass)             |
| **Vertical layering** | Intensity within a state — more enemies = more layers                               |
| **UE5 MetaSound**     | Leverages Unreal Engine 5's MetaSound system for dynamic audio graphs               |

---

## 3. Ring-Based Musical Progression

Each ring of the galaxy has a distinct musical identity — the closer to the Core, the more intense:

| Ring           | Musical Style                          | Key/Mode         | BPM     | Instruments                                  |
| -------------- | -------------------------------------- | ---------------- | ------- | -------------------------------------------- |
| **Outer Ring** | Upbeat, adventurous, arcade energy     | Major / Lydian   | 120–130 | Chiptune leads, bouncy bass, clean drums     |
| **Mid Ring**   | Darker, driving, urgency building      | Minor / Dorian   | 130–140 | Distorted synths, heavier drums, sub bass    |
| **Inner Ring** | Intense, dramatic, orchestral elements | Phrygian / Min   | 140–160 | Orchestral hits, aggressive bass, choir      |
| **The Core**   | Chaotic, overwhelming, genre-breaking  | Atonal / Shifted | 160–180 | Glitch, breakcore elements, all stems at max |
| **Loop+**      | Remixed versions of all ring tracks    | Varies           | +10 BPM | Distorted, reversed, time-stretched          |

> **Musical journey:** The game literally sounds different as you progress. Outer ring = fun adventure music. Core = musical chaos that matches the visual chaos. Loop+ remixes feel familiar but _wrong_ — reinforcing the "everything is harder" loop.

---

## 4. Environment-Specific Audio

| Environment          | Ambient Layer                                   | Music Modifier                         |
| -------------------- | ----------------------------------------------- | -------------------------------------- |
| ⛏️ Asteroid Field    | Rocky impacts, distant rumbles, crystal hums    | Add percussive elements                |
| 🌫️ Nebula            | Whooshing gas, ion crackles, muffled reverb     | Add reverb + delay, reduce clarity     |
| 💥 Debris Field      | Metal groans, hull stress, sparking wires       | Add industrial percussion              |
| 🧊 Ice Field         | Crystalline chimes, cracking ice, wind          | Add glass-like arpeggios               |
| 🌊 Gas Giant Rings   | Deep resonance, lightning crackles, gas swirls  | Add deep sub bass, rumble              |
| 🌋 Supernova Remnant | Radiation hiss, thermal expansion, alarm tones  | Increase tempo, add urgency percussion |
| 🕳️ Void Rift         | Reality distortion, phase shifts, eerie silence | Pitch bend everything, glitch effects  |

---

## 5. SFX Style Guide

| Category            | Style                                                    | Examples                                           |
| ------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| **Weapons**         | Punchy, satisfying, slightly exaggerated — arcade feel   | Pew pew lasers, bassy cannons, wooshy missiles     |
| **Mining**          | Crunchy, tactile, rewarding                              | Rock cracking, crystal chimes, drill whirring      |
| **UI / Menus**      | Clean, snappy, responsive                                | Click, confirm beep, page turn, hover hum          |
| **Ship Movement**   | Engine hum (varies by hull), boost whoosh, brake screech | Interceptor = high whine, Juggernaut = deep rumble |
| **Damage / Impact** | Metallic, satisfying crunch for hits                     | Shield pop, hull crunch, explosion boom            |
| **Pickups / Loot**  | Bright, cheerful, escalating for rare drops              | Coin ding, rare chime, Legendary fanfare           |
| **Ambient**         | Subtle, atmospheric, never intrusive                     | Station hum, space wind, distant radio chatter     |

### Loot Rarity SFX Escalation

| Rarity       | SFX                                                   |
| ------------ | ----------------------------------------------------- |
| ⬜ Common    | Simple "clink"                                        |
| 🟢 Uncommon  | Brighter chime + sparkle                              |
| 🔵 Rare      | Rising musical phrase + shimmer                       |
| 🟣 Epic      | Full chord + reverb swell + particle sound            |
| 🟡 Legendary | **Triumphant fanfare** + screen flash + time slow SFX |
| 🔴 Cursed    | Ominous chord + distortion + whisper                  |

---

## 6. AI Music Generation Pipeline

| Tool                | Use Case                      | Approach                                                                   |
| ------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| **ElevenLabs Music**| Full instrumental beds        | `art/audio/generate_music_beds.mjs`, briefs checked in beside the output   |
| **ElevenLabs SFX**  | One-shots and loops           | `art/audio/generate_elevenlabs.mjs`                                        |
| **Stem separation** | Post-processing all AI tracks | Split every generated track into stems for adaptive mixing                 |
| **Manual polish**   | DAW editing (Reaper/Ableton)  | Adjust transitions, loop points, stem volumes, add FX                      |

Both scripts read `ELEVENLABS_API_KEY` from `.env` and write to `art/audio/elevenlabs/`.
Music costs roughly **750 credits per minute**, so a 2-minute bed is ~1,500 of the
40,000-credit annual pool — about 26 full-length attempts before a top-up.

### Writing a music brief

The prompt is a session brief for a composer, not a search query. Four things
carry most of the result, and everything else is noise:

1. **Tempo, key, and instrument list.** Concrete and small. "Fretless bass, clean
   guitar through tape delay, layered polysynth" beats "epic space music."
2. **A structure over time.** "No drums for the first twenty seconds, kit enters,
   one long crescendo" is a shape the model can execute. "Builds up" is not.
3. **Production adjectives.** Tape saturation, plate reverb, analog noise floor,
   wide stereo. This is what separates a demo from a soundtrack.
4. **An explicit banned list.** Vocals, choir, trailer braams, vocal chops. The
   model reaches for these by default and they instantly date a track.

**Reference recordings cannot be uploaded.** ElevenLabs copyright-checks audio
references and rejects prompts built around a named commercial artist. When a
released track is the target, the workflow is to translate it into the four
categories above and generate something original with the same behaviour — a
style transfer done in words, not a cover.

### Designing for the thousandth listen

A roguelite soundtrack fails differently from a linear game's. The player will
hear a given bed for hours across dozens of runs, so the thing that makes a
track grab you on first listen is the same thing that makes it unbearable on the
fiftieth. Briefs therefore ask for **evolving texture instead of a hook**, and
loops start at **two minutes** rather than the eight or sixteen bars that would
be cheaper to generate. Length is not decoration here; it is what delays
recognition. Once a two-minute bed survives real play, it gets extended rather
than replaced.

### Production Workflow

```
1. Write the brief into art/audio/generate_music_beds.mjs and generate 2-3 variants
2. Play each one under an actual run, not at the desk
3. Stem-separate the survivor into 4-6 layers
4. Import stems into UE5 MetaSound
5. Build adaptive mixing graph (game state → stem volume/filter)
6. Polish loop points and crossfades in DAW
7. Export final stems + integration
```

> **Quality bar:** AI-generated tracks should be indistinguishable from hand-composed indie game soundtracks. Post-processing and stem work is what makes the difference.
