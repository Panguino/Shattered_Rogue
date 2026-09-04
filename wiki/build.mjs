import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(__dirname, "dist");
const ASSETS_SRC = path.join(__dirname, "assets");
const ASSETS_DST = path.join(DIST, "assets");

marked.setOptions({ gfm: true, breaks: false });

const PAGES = [
  { id: "home", title: "Command Deck", group: "Start", kind: "home" },
  { id: "poc", title: "POC Plan", group: "Start", source: "00_POC_PLAYABLE_LOOP.md" },
  { id: "plan", title: "Catalog", group: "Start", source: "00_GAME_DEVELOPMENT_PLAN.md" },
  { id: "readme", title: "README", group: "Start", source: "README.md" },

  { id: "ships", title: "Player Ships", group: "Asset Catalogs", kind: "ships", source: "art/ships.json" },
  {
    id: "weapons",
    title: "Player Weapons",
    group: "Asset Catalogs",
    kind: "weapons",
    source: "art/weapons.json",
  },
  {
    id: "enemy-ships",
    title: "Enemy Ships",
    group: "Asset Catalogs",
    kind: "asset-catalog",
    catalog: "art/enemies/equation/cold-iron/models/catalog.json",
    assetRoot: "art/enemies/equation/cold-iron",
    distRoot: "catalogs/enemy-ships",
    intro: "Fifteen complete Cold Iron combat frames. Compare each source concept with its orbitable 6–9k-triangle PBR model.",
  },
  {
    id: "enemy-components",
    title: "Enemy Components",
    group: "Asset Catalogs",
    kind: "asset-catalog",
    catalog: "art/enemies/equation/cold-iron-kit/models/catalog.json",
    assetRoot: "art/enemies/equation/cold-iron-kit",
    distRoot: "catalogs/enemy-components",
    intro: "The aligned Cold Iron modular kit used by the procedural enemy generator, with concept art, mesh statistics, and review status.",
  },
  {
    id: "asteroids",
    title: "Asteroids",
    group: "Asset Catalogs",
    kind: "asteroids",
    distRoot: "catalogs/asteroids",
  },
  {
    id: "audio",
    title: "Music & SFX",
    group: "Asset Catalogs",
    kind: "audio",
    catalog: "art/audio/catalog.json",
    assetRoot: "art/audio",
    distRoot: "catalogs/audio",
    intro:
      "Music beds and SFX candidates with the prompts that produced them. Play samples in the inspector; copy a brief to regenerate or iterate.",
  },

  { id: "d01", title: "01 · Game Vision", group: "Design", source: "design/01_game_vision.md" },
  { id: "d02", title: "02 · Core Mechanics", group: "Design", source: "design/02_core_mechanics.md" },
  { id: "d03", title: "03 · Weapons & Upgrades", group: "Design", source: "design/03_weapons_and_upgrades.md" },
  { id: "d04", title: "04 · Meta-Progression", group: "Design", source: "design/04_meta_progression.md" },
  { id: "d05", title: "05 · Event Encounters", group: "Design", source: "design/05_event_encounters.md" },
  { id: "d06", title: "06 · Enemy Catalog", group: "Design", source: "design/06_enemy_catalog.md" },
  { id: "d07", title: "07 · Stations", group: "Design", source: "design/07_stations.md" },
  { id: "d08", title: "08 · Hub UI", group: "Design", source: "design/08_hub_ui.md" },
  { id: "d09", title: "09 · Audio", group: "Design", source: "design/09_audio_direction.md" },
  { id: "d10", title: "10 · Carrier Drones", group: "Design", source: "design/10_carrier_drones.md" },
  { id: "d11", title: "11 · Difficulty & Heat", group: "Design", source: "design/11_difficulty_heat.md" },
  { id: "d12", title: "12 · Combat & Co-op", group: "Design", source: "design/12_combat_and_coop.md" },
  { id: "d13", title: "13 · Stats & Boards", group: "Design", source: "design/13_statistics_and_leaderboards.md" },
  { id: "d14", title: "14 · Lore", group: "Design", source: "design/14_lore_and_narrative.md" },
  { id: "d15", title: "15 · Controls & Camera", group: "Design", source: "design/15_controls_and_camera.md" },
  { id: "d16", title: "16 · UI HUD VFX", group: "Design", source: "design/16_ui_hud_vfx.md" },
  { id: "d17", title: "17 · Anti-Kiting Combat", group: "Design", source: "design/17_anti_kiting_combat.md" },
  { id: "d18", title: "18 · Procedural Environments", group: "Design", source: "design/18_procedural_environments.md" },
  { id: "d00-ideas", title: "Unsorted ideas", group: "Design", source: "design/00_random_unsorted_ideas.md" },

  { id: "art-prompts", title: "Ship Prompts (Markdown)", group: "Art", source: "art/ship_prompts.md" },
  { id: "weapon-prompts", title: "Weapon Prompts (Markdown)", group: "Art", source: "art/weapon_prompts.md" },
  { id: "toolchain", title: "AI Toolchain", group: "Technical", source: "technical/ai_toolchain.md" },
  { id: "arch", title: "Architecture", group: "Technical", source: "technical/architecture.md" },

  { id: "archive", title: "Archive index", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/README.md" },
  { id: "plan-full", title: "Archived full plan", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/00_GAME_DEVELOPMENT_PLAN.md" },
  { id: "scope", title: "Archived prototype scope", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/prototype_scope.md" },
  { id: "impl", title: "Archived implementation", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/implementation_milestones.md" },
  { id: "p0102", title: "Phase 1–2 Foundation", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/milestones/phase_01_02_foundation_ship.md" },
  { id: "p03", title: "Phase 3 Combat", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/milestones/phase_03_combat.md" },
  { id: "p04", title: "Phase 4 Run Structure", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/milestones/phase_04_run_structure.md" },
  { id: "p0506", title: "Phase 5–6 Progression", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/milestones/phase_05_06_progression_coop.md" },
  { id: "p0710", title: "Phase 7–10 Content", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/milestones/phase_07_10_content_expansion.md" },
  { id: "p1114", title: "Phase 11–14 Systems", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/milestones/phase_11_14_systems_endgame.md" },
  { id: "p1518", title: "Phase 15–18 Polish", group: "Archived roadmap", source: "archive/full-game-roadmap-2026-08/technical/milestones/phase_15_18_audio_polish_release.md" },

  { id: "r-engine", title: "Engine MCP Research", group: "Research", source: "research/engine_mcp_ai_integration.md" },
  { id: "r-genre", title: "Roguelike Genre Research", group: "Research", source: "research/01_ROGUELIKE_GENRE_RESEARCH.md" },
];

// Titles here are curated, so the list stays hand-written rather than being read
// off the folder. The cost is drift: docs 17 and 18 existed in design/ for weeks
// without ever appearing in the wiki, and nothing said so. Refuse to build a
// documentation site that silently omits documentation.
const registered = new Set(
  PAGES.filter((page) => page.source).map((page) => path.basename(page.source)),
);
const unregistered = fs
  .readdirSync(path.join(ROOT, "design"))
  .filter((name) => name.endsWith(".md") && !registered.has(name));
if (unregistered.length) {
  console.error(`Not in PAGES, so they would be missing from the wiki: ${unregistered.join(", ")}`);
  process.exit(1);
}

const GAMES = [
  ["01_hades.md", "Hades"],
  ["02_hades_ii.md", "Hades II"],
  ["03_slay_the_spire.md", "Slay the Spire"],
  ["04_binding_of_isaac.md", "Binding of Isaac"],
  ["05_risk_of_rain_2.md", "Risk of Rain 2"],
  ["06_dead_cells.md", "Dead Cells"],
  ["07_crab_champions.md", "Crab Champions"],
  ["08_returnal.md", "Returnal"],
  ["09_enter_the_gungeon.md", "Enter the Gungeon"],
  ["10_vampire_survivors.md", "Vampire Survivors"],
  ["11_spelunky_2.md", "Spelunky 2"],
  ["12_ftl.md", "FTL"],
  ["13_noita.md", "Noita"],
  ["14_rogue_legacy_2.md", "Rogue Legacy 2"],
  ["15_gunfire_reborn.md", "Gunfire Reborn"],
  ["16_megabonk.md", "Megabonk"],
  ["17_nuclear_throne.md", "Nuclear Throne"],
  ["18_balatro.md", "Balatro"],
  ["19_into_the_breach.md", "Into the Breach"],
  ["20_crypt_of_the_necrodancer.md", "Crypt of the NecroDancer"],
  ["S1_void_bastards.md", "Void Bastards"],
  ["S2_nova_drift.md", "Nova Drift"],
  ["S3_drg_survivor.md", "DRG: Survivor"],
  ["S4_everspace.md", "Everspace"],
];

for (const [file, title] of GAMES) {
  PAGES.push({
    id: "g-" + file.replace(/\.md$/i, "").toLowerCase(),
    title,
    group: "Game Studies",
    source: `research/games/${file}`,
  });
}

const bySource = new Map(PAGES.filter((p) => p.source).map((p) => [p.source.replace(/\\/g, "/"), p]));

function hrefFor(page) {
  return page.id === "home" ? "index.html" : `${page.id}.html`;
}

function rewriteMdLinks(md) {
  return md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (full, label, href) => {
    if (/^https?:\/\//i.test(href) || href.startsWith("#") || href.startsWith("mailto:")) return full;
    const [file, hash] = href.split("#");
    if (!file || !file.endsWith(".md")) return full;
    const candidates = [
      file.replace(/^\.\.\//, ""),
      file.replace(/^\.\//, ""),
    ];
    let page;
    for (const c of candidates) {
      page = bySource.get(c) || [...bySource.entries()].find(([k]) => k.endsWith(c.replace(/^\.\.\//, "")))?.[1];
      if (page) break;
    }
    if (!page) {
      const base = path.posix.basename(file);
      page = [...bySource.entries()].find(([k]) => k.endsWith("/" + base) || k === base)?.[1];
    }
    if (!page) return full;
    return `[${label}](${hrefFor(page)}${hash ? "#" + hash : ""})`;
  });
}

function massageCallouts(html) {
  return html
    .replace(/<blockquote>\s*<p>\[!IMPORTANT\]\s*/g, '<blockquote class="callout-important"><p><strong>Important.</strong> ')
    .replace(/<blockquote>\s*<p>\[!TIP\]\s*/g, '<blockquote class="callout-tip"><p><strong>Tip.</strong> ')
    .replace(/<blockquote>\s*<p>\[!NOTE\]\s*/g, '<blockquote class="callout-tip"><p><strong>Note.</strong> ');
}

function navHtml(activeId) {
  const groups = [];
  for (const page of PAGES) {
    const last = groups[groups.length - 1];
    if (!last || last.name !== page.group) groups.push({ name: page.group, pages: [page] });
    else last.pages.push(page);
  }
  return groups
    .map((g) => {
      const open = g.pages.some((p) => p.id === activeId) ? " open" : "";
      const links = g.pages
        .map((p) => `<a class="${p.id === activeId ? "active" : ""}" href="${hrefFor(p)}">${esc(p.title)}</a>`)
        .join("\n");
      return `<details class="nav-group"${open}><summary>${esc(g.name)}</summary>${links}</details>`;
    })
    .join("\n");
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shell(page, body) {
  const extra = ["ships", "asset-catalog", "asteroids", "audio"].includes(page.kind)
    ? " content-assets"
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(page.title)} · Shattered Slop</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=IBM+Plex+Mono:wght@400;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/wiki.css" />
</head>
<body>
  <button class="menu-btn" id="menu-btn" type="button">Menu</button>
  <div class="layout">
    <aside class="sidebar">
      <a class="brand" href="index.html">
        <div class="brand-mark"><span></span></div>
        <div>
          <h1>Shattered<br/>Rogue</h1>
          <small>Outer Rim Wiki</small>
        </div>
      </a>
      <input class="search" id="nav-search" type="search" placeholder="Search nav…" />
      <nav class="nav">${navHtml(page.id)}</nav>
    </aside>
    <main class="content${extra}">${body}</main>
  </div>
  <script src="assets/wiki.js"></script>
</body>
</html>
`;
}

function hullFolder(hull) {
  return String(hull).toLowerCase();
}

function copyWeaponArt() {
  const srcRoot = path.join(ROOT, "art/weapons");
  const dstRoot = path.join(DIST, "catalogs/weapons");
  const images = new Set();
  const models = new Set();
  if (!fs.existsSync(srcRoot)) return { images, models };

  fs.mkdirSync(dstRoot, { recursive: true });
  for (const f of fs.readdirSync(srcRoot)) {
    const ext = path.extname(f).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp", ".glb", ".gltf"].includes(ext)) continue;
    fs.copyFileSync(path.join(srcRoot, f), path.join(dstRoot, f));
    const key = path.basename(f, ext);
    if (ext === ".glb" || ext === ".gltf") models.add(`${key}${ext}`);
    else images.add(`${key}${ext}`);
  }
  return { images, models };
}

function weaponChecklist(w, rules) {
  const slots = (rules.modSlotsByLevel || [0, 1, 2, 3, 4])
    .map((n, i) => `L${i + 1}=${n}`)
    .join(", ");
  return `
    <p class="meta inventory">Fills <em>one</em> ship weapon hardpoint. Max ${esc(String(rules.maxOwnedPerType))} owned of this type. ${esc(String(rules.levels))} levels. Mod crystals: ${esc(slots)}.</p>
    <div class="gold-check">
      <p class="gold-title">Visible gold — count exactly <strong>1</strong> circular mounting collar (the ship-pad mount). Extra gold = wrong. Four empty crystal wells, never gold.</p>
      <ol class="gold-list">
        <li class="gold-weapon"><span class="n">1</span><span class="k">Mount</span><span class="d">gold circular collar with dark hexagonal plug</span></li>
        <li class="gold-engine"><span class="n">2</span><span class="k">Wells</span><span class="d">four empty hexagonal crystal sockets (cream/charcoal, not gold)</span></li>
      </ol>
    </div>`;
}

function findWeaponArt(set, id, exts) {
  for (const ext of exts) {
    const key = `${id}${ext}`;
    if (set.has(key)) return `catalogs/weapons/${key}`;
  }
  return null;
}

function weaponEntries(data, art) {
  const rules = data.rules || {};
  return data.weapons.map((weapon) => ({
    id: weapon.id,
    title: weapon.name,
    group: weapon.family,
    image: findWeaponArt(art.images, weapon.id, [".png", ".webp", ".jpg", ".jpeg"]),
    model: findWeaponArt(art.models, weapon.id, [".glb", ".gltf"]),
    preview: null,
    note: weapon.read || "",
    status: weapon.starting ? "starter" : "concept",
    stats: [
      ["role", weapon.role],
      ["damage", weapon.damage],
      ["fire rate", weapon.fireRate],
      ["range", weapon.range],
      ["special", weapon.special],
      ["own cap", String(rules.maxOwnedPerType ?? 3)],
    ],
    extraHtml: weaponChecklist(weapon, rules),
    prompt: weapon.prompt,
  }));
}

function copyShipArt() {
  const srcRoot = path.join(ROOT, "art/ships");
  const dstRoot = path.join(DIST, "ships");
  const images = new Set();
  const models = new Set();
  if (!fs.existsSync(srcRoot)) return { images, models };

  for (const hull of fs.readdirSync(srcRoot)) {
    const hullDir = path.join(srcRoot, hull);
    if (!fs.statSync(hullDir).isDirectory() || hull.startsWith("_")) continue;
    for (const f of fs.readdirSync(hullDir)) {
      if (f.startsWith("_")) continue;
      const ext = path.extname(f).toLowerCase();
      if (![".png", ".jpg", ".jpeg", ".webp", ".glb", ".gltf"].includes(ext)) continue;
      const dstHull = path.join(dstRoot, hull);
      fs.mkdirSync(dstHull, { recursive: true });
      fs.copyFileSync(path.join(hullDir, f), path.join(dstHull, f));
      const key = `${hull}/${path.basename(f, ext)}`;
      if (ext === ".glb" || ext === ".gltf") models.add(`${key}${ext}`);
      else images.add(`${key}${ext}`);
    }
  }
  return { images, models };
}

function findArt(set, hull, id, exts) {
  const folder = hullFolder(hull);
  for (const ext of exts) {
    const key = `${folder}/${id}${ext}`;
    if (set.has(key)) return `ships/${key}`;
  }
  return null;
}

function homeBody(ships) {
  const hulls = ["Interceptor", "Corvette", "Carrier", "Organic", "Phantom", "Juggernaut"];
  const profs = ["Fighter", "Miner", "Scout", "Hauler", "Scientist"];
  const rows = hulls
    .map((h) => {
      const cells = profs
        .map((p) => {
          const s = ships.find((x) => x.hull === h && x.profession === p);
          return `<td><a class="ship" href="ships.html#${s.id}">${esc(s.name)}</a></td>`;
        })
        .join("");
      return `<tr><th>${h}</th>${cells}</tr>`;
    })
    .join("");

  return `
  <section class="hero">
    <p class="kicker">Design bible · Art pipeline · POC plan</p>
    <h2>A shattered galaxy.<br/>Thirty named ships.</h2>
    <p class="lede">You are a spaceman. The North Star is hull × profession on a hex grid. The <strong>active build</strong> is a Pirate Raid playable loop (menus, one arena, flagship). Markdown stays the source of truth.</p>
    <div class="chips">
      <span class="chip">1–4 co-op</span>
      <span class="chip">Unreal Engine 5.8</span>
      <span class="chip">Unreal MCP + Cursor</span>
      <span class="chip">Ace style lock</span>
      <span class="chip">Tripo 6k tris · GLB 2K</span>
    </div>
  </section>

  <p class="kicker">Jump in</p>
  <div class="grid-3">
    <a class="card" href="ships.html"><h3>Player ships</h3><p>Thirty hull × profession concepts and every available on-demand 3D model.</p></a>
    <a class="card" href="weapons.html"><h3>Player weapons</h3><p>Three hardpoint guns that bolt onto gold ship pads, with empty wells for mod crystals.</p></a>
    <a class="card" href="enemy-ships.html"><h3>Enemy ships</h3><p>Fifteen complete Cold Iron concepts beside their 6–9k-triangle models.</p></a>
    <a class="card" href="enemy-components.html"><h3>Enemy components</h3><p>The aligned modular mesh kit used by the procedural enemy generator.</p></a>
    <a class="card" href="asteroids.html"><h3>Asteroids</h3><p>Active size-family concepts and all eight Unreal runtime source GLBs.</p></a>
    <a class="card" href="audio.html"><h3>Music &amp; SFX</h3><p>Playable beds and cues with the prompts that produced them.</p></a>
    <a class="card" href="d01.html"><h3>Game vision</h3><p>Hulls, professions, combos, art direction, pillars.</p></a>
    <a class="card" href="poc.html"><h3>POC plan</h3><p>Pirate Raid loop: menus, placeholder Ace, waves, flagship. Sibling UE 5.8 project.</p></a>
    <a class="card" href="toolchain.html"><h3>AI toolchain</h3><p>Tripo targets, concept pipeline, editor MCP setup.</p></a>
    <a class="card" href="d14.html"><h3>Lore</h3><p>The Shattering, the Breach, the ooze that puppeted the ships.</p></a>
    <a class="card" href="r-engine.html"><h3>Engine research</h3><p>Why we stayed on Unreal instead of Unity or Godot.</p></a>
  </div>

  <p class="kicker">Hull × Profession</p>
  <table class="matrix">
    <thead><tr><th></th><th>Fighter</th><th>Miner</th><th>Scout</th><th>Hauler</th><th>Scientist</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
`;
}

function slotPhrase(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

function goldKind(line) {
  const k = String(line).split("—")[0].trim().toUpperCase();
  if (k === "WEAPON") return { cls: "weapon", label: "Weapon" };
  if (k === "DRONE") return { cls: "drone", label: "Drone bay" };
  if (k === "ENGINE") return { cls: "engine", label: "Engine collar" };
  return { cls: "other", label: k };
}

function goldDetail(line) {
  const parts = String(line).split("—");
  return parts.slice(1).join("—").trim() || line;
}

function shipChecklist(s) {
  const spec = s.slots.specialty;
  const specNote = ` ${spec} ${spec === 1 ? "specialty is" : "specialties are"} inventory-only — no gold ring.`;
  const items = (s.gold || [])
    .map((g, i) => {
      const k = goldKind(g);
      return `<li class="gold-${k.cls}"><span class="n">${i + 1}</span><span class="k">${esc(k.label)}</span><span class="d">${esc(goldDetail(g))}</span></li>`;
    })
    .join("");
  return `
    <p class="meta inventory">Inventory: ${slotPhrase(s.slots.weapons, "weapon", "weapons")}, ${slotPhrase(s.slots.modules, "module", "modules")} <em>(internal — never gold)</em>, ${slotPhrase(s.slots.specialty, "specialty", "specialties")} <em>(internal — never gold)</em>.${specNote}</p>
    <div class="gold-check">
      <p class="gold-title">Visible gold rings — count exactly <strong>${s.goldCount}</strong> (weapons + engines${(s.gold || []).some((g) => /^\s*DRONE\b/i.test(g)) ? " + drone bays" : ""}). Empty raised pads only. Extra gold = wrong.</p>
      <ol class="gold-list">${items}</ol>
    </div>`;
}

function shipEntries(data, art) {
  const hulls = ["Interceptor", "Corvette", "Carrier", "Organic", "Phantom", "Juggernaut"];
  return hulls.flatMap((hull) =>
    data.ships
      .filter((ship) => ship.hull === hull)
      .map((ship) => ({
        id: ship.id,
        title: ship.name,
        group: hull,
        image: findArt(art.images, ship.hull, ship.id, [".png", ".webp", ".jpg", ".jpeg"]),
        model: findArt(art.models, ship.hull, ship.id, [".glb", ".gltf"]),
        preview: null,
        note: ship.read || "",
        status: ship.profession,
        stats: [
          ["mechanic", ship.mechanic],
          ["weapons", String(ship.slots.weapons)],
          ["modules", String(ship.slots.modules)],
          ["specialty", String(ship.slots.specialty)],
          ["gold rings", String(ship.goldCount)],
        ],
        extraHtml: shipChecklist(ship),
        prompt: ship.prompt,
      })),
  );
}

function inspectGlb(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.readUInt32LE(0) !== 0x46546c67) throw new Error(`${file}: not a GLB`);
  let offset = 12;
  let json = null;
  while (offset < buffer.length) {
    const length = buffer.readUInt32LE(offset);
    const type = buffer.readUInt32LE(offset + 4);
    if (type === 0x4e4f534a) {
      json = JSON.parse(
        buffer.subarray(offset + 8, offset + 8 + length).toString("utf8"),
      );
      break;
    }
    offset += 8 + length + ((4 - (length % 4)) % 4);
  }
  if (!json) throw new Error(`${file}: missing glTF JSON`);

  let triangles = 0;
  let vertices = 0;
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives) {
      const positions = json.accessors[primitive.attributes.POSITION];
      vertices += positions.count;
      triangles +=
        primitive.indices == null
          ? positions.count / 3
          : json.accessors[primitive.indices].count / 3;
    }
  }
  return {
    triangles: Math.round(triangles),
    vertices,
    megabytes: Number((buffer.length / 1024 / 1024).toFixed(2)),
    materials: (json.materials ?? []).length,
    textures: (json.images ?? []).length,
  };
}

function copyCatalogFile(source, distRoot) {
  if (!source || !fs.existsSync(source)) return null;
  const name = path.basename(source);
  const destination = path.join(DIST, distRoot, name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  return `${distRoot}/${name}`.replaceAll("\\", "/");
}

function loadAssetCatalog(page) {
  const catalogFile = path.join(ROOT, page.catalog);
  const catalogDir = path.dirname(catalogFile);
  const sourceRoot = path.join(ROOT, page.assetRoot);
  const data = JSON.parse(fs.readFileSync(catalogFile, "utf8"));

  return data.entries.map((entry) => {
    const inferredImage = path.join(sourceRoot, `${entry.name}.png`);
    const imageSource = entry.image
      ? path.resolve(catalogDir, entry.image)
      : inferredImage;
    const modelSource = entry.model
      ? path.resolve(catalogDir, entry.model)
      : null;
    const previewSource = entry.preview
      ? path.resolve(catalogDir, entry.preview)
      : null;

    const stats = [];
    if (entry.triangles != null) {
      stats.push(["triangles", Number(entry.triangles).toLocaleString()]);
    }
    if (entry.vertices != null) {
      stats.push(["vertices", Number(entry.vertices).toLocaleString()]);
    }
    if (entry.materials != null) {
      stats.push([
        "material",
        `${entry.materials} · ${entry.textures ?? 0} PBR textures`,
      ]);
    }
    if (entry.megabytes != null) {
      stats.push(["on disk", `${Number(entry.megabytes).toFixed(2)} MB`]);
    }
    if (entry.budget) stats.push(["budget", entry.budget]);

    return {
      id: entry.name,
      title: entry.title,
      triangles: entry.triangles ?? 0,
      group: entry.family ?? entry.category ?? "other",
      image: copyCatalogFile(imageSource, page.distRoot),
      model: copyCatalogFile(modelSource, page.distRoot),
      preview: copyCatalogFile(previewSource, page.distRoot),
      note: entry.review?.note ?? entry.description ?? "",
      status: entry.review?.status ?? entry.budget ?? entry.status ?? "",
      stats,
    };
  });
}

function titleFromFile(file) {
  return path
    .basename(file, path.extname(file))
    .replace(/^ast_\d+_/, "")
    .replace(/^runtime_/, "")
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function loadAsteroidCatalog(page) {
  const sourceRoot = path.join(ROOT, "art/asteroids");
  const modelRoot = path.join(sourceRoot, "models");
  const concepts = fs
    .readdirSync(sourceRoot)
    .filter((file) => /^ast_\d+_.+\.png$/i.test(file))
    .sort();
  const models = fs
    .readdirSync(modelRoot)
    .filter((file) => /^runtime_(small|medium|high)_\d+\.glb$/i.test(file))
    .sort();

  const familyFor = (name) => {
    if (name.includes("_small_")) return "small";
    if (name.includes("_medium_")) return "medium";
    if (name.includes("_large_") || name.includes("_high_")) return "large";
    return "other";
  };
  const modelFamilies = new Map([
    ["small", models.filter((name) => name.includes("_small_"))],
    ["medium", models.filter((name) => name.includes("_medium_"))],
    ["large", models.filter((name) => name.includes("_high_"))],
  ]);
  const used = new Map();

  return concepts.map((imageName) => {
    const group = familyFor(imageName);
    const index = used.get(group) ?? 0;
    used.set(group, index + 1);
    const modelName = modelFamilies.get(group)?.[index] ?? null;
    const modelSource = modelName ? path.join(modelRoot, modelName) : null;
    const measured = modelSource ? inspectGlb(modelSource) : null;
    return {
      id: path.basename(imageName, ".png"),
      title: titleFromFile(imageName),
      triangles: measured?.triangles ?? 0,
      group,
      image: copyCatalogFile(path.join(sourceRoot, imageName), page.distRoot),
      model: copyCatalogFile(modelSource, page.distRoot),
      preview: copyCatalogFile(path.join(sourceRoot, imageName), page.distRoot),
      note: modelName
        ? `Runtime ${group} variant ${index + 1} · ${modelName}`
        : "Concept variation; no dedicated runtime GLB.",
      status: modelName ? "runtime" : "concept only",
      stats: measured
        ? [
            ["triangles", measured.triangles.toLocaleString()],
            ["vertices", measured.vertices.toLocaleString()],
            ["material", `${measured.materials} · ${measured.textures} PBR textures`],
            ["on disk", `${measured.megabytes.toFixed(2)} MB`],
            ["source", modelName],
          ]
        : [],
    };
  });
}

function assetCatalogLinks(activeId) {
  const links = [
    ["ships", "Player ships"],
    ["weapons", "Player weapons"],
    ["enemy-ships", "Enemy ships"],
    ["enemy-components", "Enemy components"],
    ["asteroids", "Asteroids"],
    ["audio", "Music & SFX"],
  ];
  return `<nav class="asset-catalog-nav" aria-label="Asset catalogs">${links
    .map(
      ([id, label]) =>
        `<a class="${id === activeId ? "active" : ""}" href="${id}.html">${label}</a>`,
    )
    .join("")}</nav>`;
}

function loadAudioCatalog(page) {
  const catalogFile = path.join(ROOT, page.catalog);
  const sourceRoot = path.join(ROOT, page.assetRoot);
  const data = JSON.parse(fs.readFileSync(catalogFile, "utf8"));

  return data.entries.map((entry) => {
    const fileSource = entry.file ? path.join(sourceRoot, entry.file) : null;
    const onDisk = Boolean(fileSource && fs.existsSync(fileSource));
    const audio = onDisk ? copyCatalogFile(fileSource, page.distRoot) : null;
    const bytes = onDisk ? fs.statSync(fileSource).size : null;

    const stats = [];
    if (entry.kind) stats.push(["kind", entry.kind]);
    if (entry.rating != null) stats.push(["rating", `${entry.rating}/10`]);
    if (entry.durationSec != null) stats.push(["duration", `${entry.durationSec}s`]);
    if (entry.bpm != null) stats.push(["bpm", String(entry.bpm)]);
    if (entry.key) stats.push(["key", entry.key]);
    if (entry.model) stats.push(["model", entry.model]);
    if (entry.songId) stats.push(["song id", entry.songId]);
    if (entry.generatedAt) stats.push(["generated", entry.generatedAt]);
    if (bytes != null) stats.push(["on disk", `${(bytes / 1024).toFixed(0)} KB`]);
    if (entry.referenceIntent) stats.push(["intent", entry.referenceIntent]);
    if (!onDisk && entry.file) stats.push(["file", "not generated yet"]);

    const status = onDisk
      ? entry.status || "on disk"
      : entry.status === "brief-only"
        ? "brief only"
        : entry.status || "missing file";

    return {
      id: entry.id,
      title: entry.title,
      group: entry.group || entry.kind || "audio",
      image: null,
      model: null,
      preview: null,
      audio,
      note: entry.note || "",
      status,
      rating: entry.rating ?? null,
      stats,
      extraHtml: entry.review
        ? `<div class="asset-review"><p class="kicker">Review</p><p>${esc(entry.review)}</p></div>`
        : null,
      prompt: entry.prompt || "",
      mediaKind: "audio",
    };
  });
}

// Entries ride along as JSON rather than as pre-rendered cards. The browse pane
// and the inspector show the same asset in two shapes and swap constantly, so
// rendering both server-side would mean shipping every record twice and keeping
// them in sync by hand.
function catalogData(entries) {
  return JSON.stringify({ entries }).replaceAll("<", "\\u003c");
}

function assetCatalogBody(page, entries) {
  const groups = [...new Set(entries.map((entry) => entry.group))];
  const models = entries.filter((entry) => entry.model).length;
  const audioFiles = entries.filter((entry) => entry.audio).length;
  const triangles = entries.reduce(
    (total, entry) => total + (entry.triangles ?? 0),
    0,
  );
  const isAudio = page.kind === "audio";

  return `
    ${assetCatalogLinks(page.id)}
    <p class="kicker">Asset wiki</p>
    <h1>${esc(page.title)}</h1>
    <p class="lede">${esc(page.intro ?? "Source images and runtime-ready models in one searchable catalog.")}</p>
    <div class="catalog-summary">
      <span><strong>${entries.length}</strong> assets</span>
      ${
        isAudio
          ? `<span><strong>${audioFiles}</strong> playable</span>`
          : `<span><strong>${models}</strong> with 3D</span>`
      }
      ${triangles ? `<span><strong>${triangles.toLocaleString()}</strong> total triangles</span>` : ""}
    </div>
    <div class="catalog-controls">
      <input id="catalog-search" type="search" placeholder="Filter this catalog…" />
      <button class="catalog-filter active" type="button" data-catalog-filter="all">All</button>
      ${groups.map((group) => `<button class="catalog-filter" type="button" data-catalog-filter="${esc(group)}">${esc(String(group).replaceAll("-", " "))}</button>`).join("")}
      <span class="catalog-views">
        <button class="catalog-view active" type="button" data-catalog-view="grid">Grid</button>
        <button class="catalog-view" type="button" data-catalog-view="list">List</button>
      </span>
    </div>
    <div class="catalog-layout">
      <div class="catalog-browse" id="catalog-browse" data-view="grid"></div>
      <aside class="catalog-inspector" id="catalog-inspector"></aside>
    </div>
    <script type="application/json" id="catalog-data">${catalogData(entries)}</script>
  `;
}

function mdBody(page, raw) {
  const html = massageCallouts(marked.parse(rewriteMdLinks(raw)));
  return `<article class="doc">${html}</article>`;
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(ASSETS_DST, { recursive: true });
for (const f of fs.readdirSync(ASSETS_SRC)) {
  fs.copyFileSync(path.join(ASSETS_SRC, f), path.join(ASSETS_DST, f));
}

const ships = JSON.parse(fs.readFileSync(path.join(ROOT, "art/ships.json"), "utf8"));
const shipArt = copyShipArt();
const weapons = JSON.parse(fs.readFileSync(path.join(ROOT, "art/weapons.json"), "utf8"));
const weaponArt = copyWeaponArt();

for (const page of PAGES) {
  let body;
  if (page.kind === "home") body = homeBody(ships.ships);
  else if (page.kind === "ships") {
    page.intro =
      "Thirty hull × profession concepts. Pick a ship to inspect its concept, 3D model, gold-ring checklist, and full generation prompt.";
    body = assetCatalogBody(page, shipEntries(ships, shipArt));
  } else if (page.kind === "weapons") {
    page.intro =
      "Starter trio of ship hardpoint weapons. Each bolts onto one gold pad, levels 1–5, and grows empty wells for mod crystals. Copy the prompt to regenerate.";
    body = assetCatalogBody(page, weaponEntries(weapons, weaponArt));
  } else if (page.kind === "asset-catalog") {
    body = assetCatalogBody(page, loadAssetCatalog(page));
  } else if (page.kind === "asteroids") {
    page.intro =
      "Active asteroid concepts paired by size family with the eight source-of-truth runtime GLBs used by Unreal.";
    body = assetCatalogBody(page, loadAsteroidCatalog(page));
  } else if (page.kind === "audio") {
    body = assetCatalogBody(page, loadAudioCatalog(page));
  } else {
    const abs = path.join(ROOT, page.source);
    const raw = fs.readFileSync(abs, "utf8");
    body = mdBody(page, raw);
  }
  const outName = hrefFor(page);
  fs.writeFileSync(path.join(DIST, outName), shell(page, body), "utf8");
}

fs.writeFileSync(
  path.join(DIST, "README.txt"),
  "Open index.html in a browser. Rebuild from repo root: cd wiki && npm install && npm run build\n",
  "utf8"
);

console.log(`Wiki built: ${PAGES.length} pages → wiki/dist`);
