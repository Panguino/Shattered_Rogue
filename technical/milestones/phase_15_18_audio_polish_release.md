# Phases 15–18 — Audio, Co-op Expansion, Statistics & Release

---

## Phase 15 — Audio & Music

---

### 15.1 Adaptive Music System

#### 15.1.1 Create UMusicManager

- a. Create `ShatteredAudio/Public/MusicManager.h` inheriting `UGameInstanceSubsystem`
- b. Add `UPROPERTY`: `EMusicState CurrentState` — Ambient, Combat, Boss, Station, Menu, Breach
- c. Add `UPROPERTY`: `UAudioComponent* MusicTrack` — currently playing music
- d. Add `UFUNCTION`: `TransitionTo(EMusicState NewState, float CrossfadeDuration = 1.5f)`
- e. Subscribe to gameplay events: combat start/end, boss spawn, station dock, run state changes

#### 15.1.2 Create music layers

- a. Per environment: 3 layers — Ambient (base), Combat (additive drums/percussion), Intense (full instrumentation)
- b. Layers blend in/out based on game state (additive mixing)
- c. Ambient: plays during exploration, mining, travel
- d. Combat layer: fades in when enemies are present, fades out 5s after last enemy dies
- e. Intense layer: fades in during boss fights or high-threat situations (Heat 15+)

#### 15.1.3 Create 7 environment music tracks

- a. Asteroid Field: warm, frontier, mild tension — synth pads + light percussion
- b. Nebula: ethereal, mysterious — reverb-heavy synths, alien tones
- c. Void Rift: oppressive, dark — deep bass drones, distorted pulses
- d. Supernova Remnant: urgent, hot — fast tempo synth arpeggios
- e. Crystal Caves: delicate, resonant — crystalline chimes, echo effects
- f. Debris Field: industrial, somber — metallic clanks, distant sirens
- g. Frozen Expanse: cold, vast — minimal piano, wind textures
- h. Each track: 2-3 minute loops, seamless loop points

#### 15.1.4 Create boss music

- a. Phase 1: build-up, tension — dark orchestral + electronic hybrid
- b. Phase transition: brief silence or single hit, then key/tempo shift
- c. Phase 2+: intense, faster tempo, more aggressive percussion
- d. Architect boss: unique track with alien vocal elements and dissonance

#### 15.1.5 Create Hub music

- a. Warm, safe, hopeful — acoustic elements, gentle synth pads
- b. Changes subtly as Hub visual state improves (more instruments added)
- c. Menu version: simplified arrangement for main menu

#### 15.1.6 Implement crossfade system

- a. On state change: current track volume lerp 1.0→0.0 over CrossfadeDuration
- b. Simultaneously: new track volume lerp 0.0→1.0
- c. Special transitions: combat → ambient uses 3s fade (gradual calm-down)
- d. Boss start: immediate cut (dramatic impact), no fade-in

---

### 15.2 SFX Library

#### 15.2.1 Create weapon SFX

- a. Per weapon type: fire, impact (hit), and muzzle sounds
- b. Pulse Cannon: pew-pew laser, metallic impact spark
- c. Shotgun: chunky boom, scattered pellet impacts
- d. Beam Weapon: continuous hum-zap, electrical crackle on hit
- e. Missile Launcher: whoosh launch, rocket trail, explosion impact
- f. Tesla Coil: electric zap, crackling chain between targets
- g. Railgun: charge whine, massive crack on fire, shockwave boom
- h. Flak Cannon: rapid thuds, shrapnel scatter, AoE burst
- i. Plasma Caster: deep thud launch, splashy impact, sizzle
- j. Gatling Gun: rapid-fire rattle, metallic clink impacts
- k. Each weapon: 3-5 variants per sound to avoid repetition (randomized per shot)

#### 15.2.2 Create ship SFX

- a. Engine idle: low hum, varies by hull (higher for Phantom, deeper for Juggernaut)
- b. Engine thrust: pitch increases with speed, layered with thrust rumble
- c. Boost: accelerating whoosh, sonic rush
- d. Shield hit: energy crackle + glass-like impact
- e. Hull hit: metallic clang + sparking
- f. Shield break: shattering glass energy burst
- g. Ship death: chain of explosions, final big boom
- h. Low HP warning: pulsing alarm klaxon (subtle, not annoying)

#### 15.2.3 Create enemy SFX

- a. Enemy spawn: portal/warp-in whoosh (subtle)
- b. Enemy fire: varies by chassis (Drone=weak pew, Tank=heavy thud)
- c. Enemy death: size-based explosions (small pop to large boom)
- d. Boss-specific: unique attack sounds per boss (beam hum, missile barrage, tentacle sweep)
- e. Corruption: organic squelch/pulse sound layered on high-corruption enemies

#### 15.2.4 Create UI SFX

- a. Menu hover: soft click
- b. Menu select: satisfying confirm tone
- c. Menu back: subtle whoosh
- d. Item pickup: mineral=coin clink, weapon=metallic grab, RD=crystal chime
- e. Notification: alert chime (event, achievement, objective complete)
- f. Level up/unlock: celebratory fanfare (short, 1-2s)
- g. Error/invalid: negative buzz/boop

#### 15.2.5 Create ambient SFX

- a. Per environment: looping ambient beds (30-60s, seamless loop)
- b. Asteroid Field: distant rock grinding, solar wind
- c. Nebula: gas flows, energy crackles
- d. Void Rift: reality tearing, deep rumbles
- e. Station interior: mechanical hums, ventilation, radio chatter
- f. Hub: gentle station ambience, distant ship traffic

#### 15.2.6 Implement audio settings

- a. Master Volume slider (0-100%)
- b. Music Volume slider
- c. SFX Volume slider
- d. Ambient Volume slider
- e. UI Sound toggle (on/off)
- f. Dynamic Range: Full / Night Mode (compressed range for quiet environments)
- g. Save settings to config file, apply on game start

---

## Phase 16 — Co-op Expansion

---

### 16.1 Scale to 4 Players

#### 16.1.1 Update max players

- a. Change `MaxPlayers` from 2 → 4 in GameSession configuration
- b. Update lobby UI: show 4 player slots instead of 2
- c. Update co-op scaling formulas for 3-4 player counts

#### 16.1.2 Scale enemies for 3-4 players

- a. Wave budget: `base * (1.0 + 0.5 * (PlayerCount - 1))` — 3P=2×, 4P=2.5×
- b. Enemy HP: `base * (1.0 + 0.25 * (PlayerCount - 1))` — 3P=1.5×, 4P=1.75×
- c. Boss HP: `base * (1.0 + 0.5 * (PlayerCount - 1))` — 3P=2×, 4P=2.5×
- d. Loot: 20% more total drops per additional player beyond 2

#### 16.1.3 Update revive system

- a. With 4 players: any alive player can revive any downed player
- b. Total party wipe requires ALL 4 dead
- c. Bleedout timer remains 15s regardless of player count

#### 16.1.4 Update UI for 4 players

- a. Teammate indicators: support 3 off-screen arrows (each distinct color)
- b. Player colors: P1=Orange, P2=Blue, P3=Green, P4=Purple
- c. All 3 teammate HP bars visible as world-space widgets
- d. Lobby: 4 player cards, all must Ready to launch

#### 16.1.5 Galaxy map voting

- a. With 3+ players: implement sector vote system
- b. Each player votes on next sector destination
- c. Majority wins; ties decided by host
- d. Vote UI: 5s timer, each player picks a sector, results shown

---

### 16.2 Steam Networking

#### 16.2.1 Integrate Steamworks SDK

- a. Enable Steam Online Subsystem plugin in UE5
- b. Configure `DefaultEngine.ini` with Steam AppID (test: 480)
- c. Set `OnlineSubsystem=Steam` in config
- d. Verify Steam initialization on game launch

#### 16.2.2 Implement Steam session creation

- a. Replace NULL subsystem session with Steam session
- b. On "Host Game": create Steam lobby (public/friends-only/invite-only)
- c. Lobby settings: max players, game version compatibility check
- d. Generate invite link → sharable via Steam overlay

#### 16.2.3 Implement Steam lobby browser

- a. Create `WBP_LobbyBrowser` — shows available Steam lobbies
- b. Filter by: open slots, game version, region
- c. Quick Join: auto-select best lobby (lowest ping, open slots)
- d. Direct Join: enter lobby code or accept Steam invite

#### 16.2.4 Implement Steam friend invites

- a. In lobby: "Invite Friend" button → opens Steam overlay invite dialog
- b. Friends receive Steam notification → click to join
- c. Handle late join: if run in progress, player cannot join mid-run (lobby only)

#### 16.2.5 NAT traversal

- a. Use Steam Networking Sockets for NAT punch-through
- b. Fallback: Steam relay servers for strict NAT configurations
- c. Connection quality indicator in lobby: green/yellow/red per player

---

### 16.3 Shared Progression

#### 16.3.1 RD distribution

- a. All players earn individual RD from drops they collect
- b. Boss RD reward: each player gets full amount (not split)
- c. Run completion bonus RD: each player gets full bonus

#### 16.3.2 Loot distribution

- a. Maintain instanced loot system from M5
- b. With 4 players: slightly increase total drop rates
- c. Mineral deposits instanced: each player gets own minerals

#### 16.3.3 Host migration (optional)

- a. If host disconnects: attempt to migrate to next player
- b. Transfer GameState, RunManager, SectorManager state to new host
- c. Brief pause (3-5s) during migration
- d. If migration fails: all players returned to menu (run lost)
- e. Note: complex feature, can be deferred to post-release

---

## Phase 17 — Statistics & Leaderboards

---

### 17.1 Career Statistics

#### 17.1.1 Create UStatsSubsystem

- a. Create `ShatteredCore/Public/StatsSubsystem.h` inheriting `UGameInstanceSubsystem`
- b. `TMap<FName, int32> IntStats` — integer counters (kills, runs, etc.)
- c. `TMap<FName, float> FloatStats` — float values (best time, DPS, etc.)
- d. `IncrementStat(FName, int32)`, `SetStatMax(FName, float)`, `GetStat(FName)`
- e. Save/load with main save game

#### 17.1.2 Track core stats

- a. TotalRuns, CompletedRuns, FailedRuns
- b. TotalEnemiesKilled (and per-chassis breakdown)
- c. TotalMineralsCollected, TotalRDEarned
- d. TotalWeaponsFound, TotalItemsScrapped
- e. TotalSectorsVisited, TotalEventsCompleted
- f. TotalPlaytime (seconds, formatted as hours:mins)

#### 17.1.3 Track advanced stats

- a. BestRunTime (fastest completion)
- b. HighestHeatCompleted
- c. MostKillsInSingleRun
- d. FurthestSectorReached
- e. HighestDamageInSingleHit
- f. MostMineralsSingleRun
- g. LongestSurvivalStreak (consecutive runs completed)

#### 17.1.4 Per-hull and per-profession stats

- a. Track TotalRuns, CompletedRuns, TotalKills per hull
- b. Track TotalRuns, CompletedRuns, TotalKills per profession
- c. Track per combo (hull+profession) run count and completion rate
- d. "Favorite Hull" / "Favorite Profession" derived from most-used

#### 17.1.5 Create statistics UI

- a. In Hub Trophy Room: "Career Stats" tab
- b. Overview section: top stats in card format (total runs, kills, playtime)
- c. Detailed section: expandable categories (Combat, Exploration, Economy)
- d. Hull/Profession breakdown section: table view with sortable columns
- e. "Personal Records" section: best times, highest kills, highest Heat

---

### 17.2 Leaderboard System

#### 17.2.1 Create leaderboard service

- a. If using Steam: integrate Steamworks leaderboards API
- b. If standalone: create simple backend (or local-only leaderboard)
- c. Create `ULeaderboardService` with `SubmitScore()`, `FetchLeaderboard()`, `FetchFriendScores()`

#### 17.2.2 Create leaderboard categories

- a. Fastest Run (time, ascending — lower is better)
- b. Highest Heat Completed (heat score, descending)
- c. Most Kills in Single Run (descending)
- d. Longest Survival Streak (consecutive completions, descending)
- e. Each category: separate leaderboard, filterable by Friends/Global/Hull/Profession

#### 17.2.3 Create leaderboard UI

- a. Create `WBP_Leaderboard` — accessible from Hub
- b. Category tabs across top
- c. Player list: rank, name, score, hull used, profession used
- d. Highlight current player's position
- e. Show friend rankings (if Steam integrated)
- f. "Your Best" card: player's personal best for selected category

#### 17.2.4 Score submission

- a. On run completion: automatically submit relevant scores
- b. Fastest Run: submit run time if completed successfully
- c. Heat: submit total heat if run completed
- d. Show "New Personal Best!" notification if score improved
- e. Show rank change: "Rose from #45 to #32"

---

## Phase 18 — QA, Polish & Release

---

### 18.1 Comprehensive Playtesting

#### 18.1.1 Create playtest checklists

- a. Core loop checklist: launch run, fly to sectors, fight enemies, collect loot, use station, fight boss, complete run
- b. Per-hull checklist: play full run with each of 6 hulls, verify unique mechanics
- c. Per-profession checklist: play with each of 5 professions, verify modifiers apply correctly
- d. Per-environment checklist: visit each of 7 environments, verify visuals and hazards
- e. Co-op checklist: 2-player and 4-player runs, verify replication, revive, loot instancing

#### 18.1.2 Balance pass: weapons

- a. DPS analysis: calculate effective DPS for all weapons at each rarity
- b. Target DPS curve: Common=50, Uncommon=65, Rare=85, Epic=110, Legendary=140
- c. Adjust damage, fire rate, projectile speed to hit target ranges
- d. Test each weapon against each enemy chassis: time-to-kill within 2-8s depending on tier
- e. Verify proc effects don't create degenerate combos

#### 18.1.3 Balance pass: enemies

- a. Test each chassis × trait combination for fairness
- b. Ensure no unkillable combos (e.g., Regenerator + Armored must still be killable)
- c. Verify trait stacking doesn't produce invisible or unpredictable enemies
- d. Time-to-kill player: should be 8-15s against average enemies at Heat 0
- e. Boss fights: target 2-4 minutes at appropriate gear level

#### 18.1.4 Balance pass: economy

- a. Track mineral income per sector type: should afford 1-2 repairs or upgrades per run
- b. RD income: should unlock 1 item per 2-3 full runs at early game
- c. Weapon drop rates: player should find 3-5 weapons per run
- d. Station pricing: repair costs reasonable, upgrades feel earned not free
- e. Heat reward scaling: higher heat should feel significantly more rewarding

#### 18.1.5 Edge case testing

- a. All players disconnect during boss fight
- b. Player disconnects during station dock
- c. Player disconnects during event choice
- d. Empty cargo + full cargo edge cases
- e. 0 HP at exact moment of shield regen
- f. Simultaneous player death and enemy death
- g. Galaxy map with all sectors unreachable (should never happen — verify)

---

### 18.2 Performance Optimization

#### 18.2.1 GPU profiling

- a. Run UE5 profiler: `stat GPU`, `stat FPS`, `stat Unit`
- b. Target framerate: 60 FPS at 1080p on mid-range GPU (GTX 1060 / RX 580)
- c. Identify hot spots: Niagara VFX overdraw, mesh draw calls, material complexity
- d. LOD setup: all meshes have 3 LOD levels (full, medium at 2000u, low at 5000u)
- e. Niagara: set max particle counts, distance-based quality scaling

#### 18.2.2 CPU profiling

- a. Profile AI: behavior tree tick cost per enemy
- b. Target: 50 active enemies at <5ms AI tick time
- c. Optimize collision: use simple collision for enemies, complex only for player ship
- d. Object pooling: pool projectiles, pickups, VFX actors instead of spawn/destroy
- e. Profile networking: replication bandwidth per client under 10 KB/s

#### 18.2.3 Memory optimization

- a. Texture streaming: ensure all textures use streaming mipmaps
- b. Asset loading: use soft references and async loading for non-essential assets
- c. Clear asteroid/pickup actors between sectors (don't accumulate)
- d. Target: <4GB RAM at peak (menu + gameplay)
- e. Monitor for memory leaks: play 10 consecutive runs, compare memory usage

#### 18.2.4 Loading time optimization

- a. Sector transition: target <2s load time
- b. Pre-load next sector assets during current sector gameplay
- c. Asset bundles: group assets by environment type for efficient loading
- d. Initial game launch: target <15s to main menu

---

### 18.3 Bug Fixing & Polish

#### 18.3.1 Visual polish pass

- a. Screen shake: tune intensity for all sources (weapons, impacts, boss attacks)
- b. Particle quality: verify all Niagara systems look correct at all quality settings
- c. Material consistency: ensure all materials share same lighting response
- d. UI animations: add micro-animations to all buttons, transitions, notifications
- e. Camera: fine-tune dynamic camera behaviors (lead, zoom, shake dampening)

#### 18.3.2 Audio polish pass

- a. Volume balancing: all SFX, music, ambient at appropriate relative volumes
- b. Spatial audio: verify 3D positioning for all gameplay sounds
- c. Music transitions: verify crossfade sounds natural for all state transitions
- d. Repetition prevention: ensure no SFX plays identically twice in a row (variation)
- e. Audio occlusion: sounds behind asteroids/structures are muffled

#### 18.3.3 UX polish

- a. Tooltip system: all items, buttons, stats have hover tooltips with explanations
- b. Tutorial hints: first-time-play prompts for each new system encountered
- c. Color-blind modes: provide alternate color palettes for rarity, threat, team colors
- d. Button remapping: verify all controls are remappable and saved correctly
- e. Controller support: full gamepad navigation for all menus, radial menus where appropriate

#### 18.3.4 Crash & stability testing

- a. 8-hour soak test: leave game running with automated input
- b. Stress test: spawn 100 enemies + max VFX simultaneously
- c. Network stress: simulate 300ms latency, 5% packet loss — verify gameplay remains functional
- d. Save corruption test: corrupt save file, verify graceful fallback (new save, no crash)
- e. Multi-monitor test: verify fullscreen/windowed/borderless behavior

---

### 18.4 Build & Release

#### 18.4.1 Create shipping build

- a. UE5 Package Project: Development configuration → Shipping configuration
- b. Strip debug symbols, optimize for size
- c. Enable cook-on-the-fly disabled (all assets cooked)
- d. Test shipping build: full playthrough with no editor available
- e. Verify no editor-only code paths crash in shipping

#### 18.4.2 Create Steam store page

- a. SteamWorks: create app, configure store page metadata
- b. Write store description: game summary, feature list, system requirements
- c. Upload screenshots: 5-10 gameplay screenshots at 1920×1080
- d. Create/upload store trailer: 60-90s gameplay montage with music
- e. Set tags: Roguelike, Space, Co-op, Action, Indie

#### 18.4.3 Set up Steam achievements

- a. Map in-game achievements to Steam achievement API
- b. Create achievement icons (64×64 locked/unlocked versions)
- c. Test achievement pop-ups in Steam overlay
- d. Verify all achievements are earnable and correctly tracked

#### 18.4.4 Configure Steam Cloud Save

- a. Enable Steam Cloud for save game files
- b. Configure `UserSaveGames` path in SteamWorks
- c. Test: play on one machine, verify save syncs to another

#### 18.4.5 Final pre-release checklist

- a. All milestone features verified working
- b. Shipping build stable (no crashes in 8-hour soak)
- c. Performance targets met (60 FPS, <4GB RAM, <2s loads)
- d. Audio/visual quality acceptable
- e. Co-op functional with Steam networking
- f. Save/load working correctly
- g. Steam store page approved and ready
- h. Marketing materials prepared (screenshots, trailer, press kit)

#### 18.4.6 Launch

- a. Set Steam release date
- b. Upload shipping build to Steam depot
- c. Verify build on Steam: download + install + launch + play
- d. Click the button. Ship it. 🚀

---

### 18.5 Post-Launch

#### 18.5.1 Monitoring

- a. Monitor Steam crash reports for first 48 hours
- b. Watch community feedback (Steam reviews, Discord)
- c. Track key metrics: daily players, average session length, completion rate

#### 18.5.2 Hotfix readiness

- a. Maintain hotfix branch ready for critical bug fixes
- b. Process: identify → fix → test → ship within 24 hours for critical issues
- c. Non-critical: batch into weekly patch

#### 18.5.3 First content update planning

- a. Analyze player data: most/least used hulls, professions, weapons
- b. Identify balance issues from player feedback
- c. Plan first content update: new hull, new weapons, new environment, balance tweaks
- d. Target: first update within 4-6 weeks of launch
