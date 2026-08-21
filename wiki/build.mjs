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
  { id: "ships", title: "Ship Matrix", group: "Start", kind: "ships", source: "art/ships.json" },
  { id: "poc", title: "POC Plan", group: "Start", source: "00_POC_PLAYABLE_LOOP.md" },
  { id: "plan", title: "Catalog", group: "Start", source: "00_GAME_DEVELOPMENT_PLAN.md" },
  { id: "readme", title: "README", group: "Start", source: "README.md" },

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

  { id: "art-prompts", title: "Ship Prompts (Markdown)", group: "Art", source: "art/ship_prompts.md" },
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
  const extra = page.kind === "ships" ? " content-ships" : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(page.title)} · Shattered Rogue</title>
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
    <a class="card" href="ships.html"><h3>Ship matrix</h3><p>Concept images, on-demand 3D, and a copy-prompt button per named combo.</p></a>
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

function shipsBody(data, art) {
  const hulls = ["Interceptor", "Corvette", "Carrier", "Organic", "Phantom", "Juggernaut"];
  const sections = hulls
    .map((h) => {
      const list = data.ships
        .filter((s) => s.hull === h)
        .map((s) => {
          const img = findArt(art.images, s.hull, s.id, [".png", ".webp", ".jpg", ".jpeg"]);
          const model = findArt(art.models, s.hull, s.id, [".glb", ".gltf"]);
          const imageBlock = img
            ? `<a class="asset-frame" href="${esc(img)}" target="_blank" rel="noopener"><img src="${esc(img)}" alt="${esc(s.name)} concept" /></a>`
            : `<div class="placeholder">Concept image not created yet</div>`;
          const modelBlock = model
            ? `<div class="model-slot" data-src="${esc(model)}" data-alt="${esc(s.name)}"><button class="load-3d" type="button">Load 3D</button><p class="hint">Loads the viewer only for this ship.</p></div>`
            : `<div class="placeholder">3D model not created yet</div>`;
          return `
        <article class="card ship-page" id="${esc(s.id)}">
          <header>
            <div>
              <h3>${esc(s.name)}</h3>
              <p class="meta">${esc(s.hull)} × ${esc(s.profession)} · ${esc(s.mechanic)}</p>
              <p class="meta"><em>${esc(s.read || "")}</em></p>
            </div>
            <button class="copy-prompt" type="button" data-copy="${esc(s.id)}-prompt">Copy prompt</button>
          </header>
          ${shipChecklist(s)}
          <div class="ship-media">
            <figure class="ship-asset">
              <figcaption>Concept</figcaption>
              ${imageBlock}
            </figure>
            <figure class="ship-asset">
              <figcaption>3D model</figcaption>
              ${modelBlock}
            </figure>
          </div>
          <textarea class="ship-prompt" id="${esc(s.id)}-prompt" readonly hidden>${esc(s.prompt)}</textarea>
        </article>`;
        })
        .join("");
      return `<h2 id="hull-${h.toLowerCase()}">${esc(h)}</h2>${list}`;
    })
    .join("\n");

  return `
  <p class="kicker">Art pipeline</p>
  <h1>Ship matrix</h1>
  <p class="lede">Concept stills and Tripo GLBs live here. Each card lists the gold rings you should actually see — weapons and engine collars (Carrier also lists drone bays). Modules and specialty never get a gold pad. Copy prompt still dumps the full ChatGPT one-shot. 3D viewers load only when you press the button. Open this wiki via <code>cd wiki && npm run serve</code> — a file:// page cannot fetch GLBs.</p>
  <div class="toc">${hulls.map((h) => `<a href="#hull-${h.toLowerCase()}">${esc(h)}</a>`).join("")}</div>
  ${sections}
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

for (const page of PAGES) {
  let body;
  if (page.kind === "home") body = homeBody(ships.ships);
  else if (page.kind === "ships") body = shipsBody(ships, shipArt);
  else {
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
