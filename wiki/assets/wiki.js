document.querySelectorAll("pre").forEach((pre) => {
  const btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.type = "button";
  btn.textContent = "Copy";
  btn.addEventListener("click", async () => {
    const text = pre.querySelector("code")?.innerText || pre.innerText;
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied";
    setTimeout(() => (btn.textContent = "Copy"), 1200);
  });
  pre.appendChild(btn);
});

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const el = document.getElementById(btn.dataset.copy);
    const text = el?.value || el?.innerText || "";
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied";
    setTimeout(() => (btn.textContent = "Copy prompt"), 1200);
  });
});

let modelViewerReady = null;
function ensureModelViewer() {
  if (customElements.get("model-viewer")) return Promise.resolve();
  if (modelViewerReady) return modelViewerReady;
  const sources = [
    "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js",
    "https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js",
  ];
  modelViewerReady = (async () => {
    let lastErr;
    for (const src of sources) {
      try {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.type = "module";
          s.src = src;
          s.onerror = () => reject(new Error("viewer script failed: " + src));
          document.head.appendChild(s);
          const t = setTimeout(() => reject(new Error("viewer timed out")), 12000);
          customElements.whenDefined("model-viewer").then(() => {
            clearTimeout(t);
            resolve();
          }, reject);
        });
        return;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error("model-viewer failed to load");
  })();
  return modelViewerReady;
}

function showModelError(slot, message) {
  slot.classList.remove("is-live");
  slot.innerHTML = `<div class="placeholder">${message}</div>`;
}

initCatalog();

function initCatalog() {
  const source = document.getElementById("catalog-data");
  const browse = document.getElementById("catalog-browse");
  const inspector = document.getElementById("catalog-inspector");
  if (!source || !browse || !inspector) return;

  const entries = JSON.parse(source.textContent).entries;
  const searchBox = document.getElementById("catalog-search");
  const filters = [...document.querySelectorAll("[data-catalog-filter]")];
  const views = [...document.querySelectorAll("[data-catalog-view]")];

  let group = "all";
  let view = "grid";
  // The hash is how the home matrix deep-links a single ship, so honour it as
  // the initial selection instead of always opening the first asset.
  let selected =
    entries.find((entry) => entry.id === decodeURIComponent(location.hash.slice(1))) ||
    entries[0];

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const pretty = (value) => String(value ?? "").replaceAll("-", " ");

  function visibleEntries() {
    const query = searchBox?.value.trim().toLowerCase() || "";
    return entries.filter((entry) => {
      const inGroup = group === "all" || entry.group === group;
      const haystack = `${entry.title} ${entry.group} ${entry.note} ${entry.prompt || ""} ${entry.status || ""}`.toLowerCase();
      return inGroup && (!query || haystack.includes(query));
    });
  }

  function thumb(entry, alt) {
    if (entry.image || entry.preview) {
      const image = el("img");
      image.src = entry.image || entry.preview;
      image.alt = alt;
      image.loading = "lazy";
      return image;
    }
    if (entry.audio || entry.mediaKind === "audio") {
      const mark = el("span", `thumb-audio${entry.audio ? "" : " missing"}`);
      mark.textContent = entry.audio ? "♪" : "…";
      mark.title = entry.audio ? "Playable audio" : "Brief only — no file yet";
      return mark;
    }
    return el("span", "thumb-missing", "No image");
  }

  function mediaMeta(entry) {
    if (entry.audio) return "playable";
    if (entry.mediaKind === "audio") return "brief only";
    if (entry.model) return "3D ready";
    return "image only";
  }

  function renderBrowse() {
    const list = visibleEntries();
    browse.dataset.view = view;
    browse.replaceChildren();

    if (!list.length) {
      browse.append(el("p", "catalog-empty", "No assets match this filter."));
      return;
    }

    for (const entry of list) {
      const card = el("button", `catalog-tile${entry.id === selected?.id ? " selected" : ""}`);
      card.type = "button";
      card.title = entry.title;
      card.append(thumb(entry, `${entry.title} thumbnail`));

      const copy = el("span", "tile-copy");
      copy.append(el("span", "tile-title", entry.title));
      copy.append(
        el(
          "span",
          "tile-meta",
          view === "list"
            ? `${pretty(entry.group)} · ${mediaMeta(entry)}`
            : pretty(entry.group),
        ),
      );
      card.append(copy);
      if (entry.audio) card.append(el("span", "tile-flag", "AUDIO"));
      else if (entry.mediaKind === "audio") card.append(el("span", "tile-flag", "BRIEF"));
      else if (!entry.model) card.append(el("span", "tile-flag", "2D"));

      card.addEventListener("click", () => select(entry));
      browse.append(card);
    }
  }

  async function mountModel(stage, entry) {
    try {
      await ensureModelViewer();
      const viewer = document.createElement("model-viewer");
      viewer.src = entry.model;
      viewer.alt = `${entry.title} 3D model`;
      if (entry.preview) viewer.poster = entry.preview;
      for (const [name, value] of [
        ["camera-controls", ""],
        ["auto-rotate", ""],
        ["auto-rotate-delay", "600"],
        ["touch-action", "pan-y"],
        ["shadow-intensity", "0.7"],
        ["exposure", "1"],
        ["environment-image", "neutral"],
        ["interaction-prompt", "none"],
      ]) {
        viewer.setAttribute(name, value);
      }
      viewer.addEventListener("error", () => {
        showModelError(
          stage,
          location.protocol === "file:"
            ? "GLB cannot load from a file:// page. Run npm run serve in the wiki folder, then reopen over http://localhost:4173."
            : "Could not load this GLB. Rebuild the wiki or check the file path.",
        );
      });
      stage.replaceChildren(viewer);
    } catch (error) {
      showModelError(stage, "The 3D viewer script could not be loaded.");
      console.error(error);
    }
  }

  function renderInspector() {
    const entry = selected;
    inspector.replaceChildren();
    if (!entry) return;

    const header = el("header", "inspector-head");
    const heading = el("div");
    heading.append(el("p", "kicker", pretty(entry.group)));
    heading.append(el("h2", null, entry.title));
    header.append(heading);
    if (entry.status) header.append(el("span", "asset-status", pretty(entry.status)));
    inspector.append(header);

    if (entry.mediaKind === "audio" || entry.audio) {
      const stage = el("div", "inspector-stage is-audio");
      if (entry.audio) {
        const player = el("audio");
        player.controls = true;
        player.preload = "metadata";
        player.src = entry.audio;
        player.setAttribute("controlsList", "nodownload");
        stage.append(player);
      } else {
        stage.append(
          el(
            "div",
            "placeholder",
            "Brief only — generate this cue to hear it here.",
          ),
        );
      }
      inspector.append(stage);
    } else {
      const tabs = el("div", "inspector-tabs");
      const stage = el("div", "inspector-stage");
      // Clicking a thumbnail should land on the thing you cannot see in the
      // thumbnail, so 3D is the default whenever the asset has a model.
      let mode = entry.model ? "model" : "image";

      function paint() {
        for (const tab of tabs.children) {
          tab.classList.toggle("active", tab.dataset.mode === mode);
        }
        if (mode === "model" && entry.model) {
          stage.classList.add("is-model");
          stage.replaceChildren(el("div", "placeholder", "Loading 3D…"));
          mountModel(stage, entry);
          return;
        }
        stage.classList.remove("is-model");
        if (entry.image || entry.preview) {
          const link = el("a", "asset-frame");
          link.href = entry.image || entry.preview;
          link.target = "_blank";
          link.rel = "noopener";
          link.append(thumb(entry, `${entry.title} source image`));
          stage.replaceChildren(link);
        } else {
          stage.replaceChildren(el("div", "placeholder", "No source image on disk."));
        }
      }

      for (const [value, label] of [
        ["model", entry.model ? "3D model" : "3D model (none)"],
        ["image", "Source image"],
      ]) {
        const tab = el("button", "inspector-tab", label);
        tab.type = "button";
        tab.dataset.mode = value;
        tab.disabled = value === "model" && !entry.model;
        tab.addEventListener("click", () => {
          mode = value;
          paint();
        });
        tabs.append(tab);
      }
      inspector.append(tabs, stage);
      paint();
    }

    if (entry.note) inspector.append(el("p", "asset-note", entry.note));

    if (entry.stats?.length) {
      const list = el("dl", "inspector-stats");
      for (const [label, value] of entry.stats) {
        list.append(el("dt", null, label));
        list.append(el("dd", null, value));
      }
      inspector.append(list);
    }

    if (entry.extraHtml) {
      const extra = el("div", "inspector-extra");
      extra.innerHTML = entry.extraHtml;
      inspector.append(extra);
    }

    if (entry.prompt) {
      const promptBox = el("div", "audio-prompt");
      promptBox.append(el("p", "kicker", "Generation prompt"));
      const pre = el("pre", "prompt-body");
      pre.textContent = entry.prompt;
      promptBox.append(pre);
      const button = el("button", "copy-prompt", "Copy prompt");
      button.type = "button";
      button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(entry.prompt);
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy prompt"), 1200);
      });
      promptBox.append(button);
      inspector.append(promptBox);
    }
  }

  function select(entry) {
    selected = entry;
    history.replaceState(null, "", `#${entry.id}`);
    renderBrowse();
    renderInspector();
    if (window.matchMedia("(max-width: 1100px)").matches) {
      inspector.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  for (const button of filters) {
    button.addEventListener("click", () => {
      group = button.dataset.catalogFilter || "all";
      for (const candidate of filters) {
        candidate.classList.toggle("active", candidate === button);
      }
      const list = visibleEntries();
      if (list.length && !list.some((entry) => entry.id === selected?.id)) {
        selected = list[0];
        renderInspector();
      }
      renderBrowse();
    });
  }

  for (const button of views) {
    button.addEventListener("click", () => {
      view = button.dataset.catalogView;
      for (const candidate of views) {
        candidate.classList.toggle("active", candidate === button);
      }
      renderBrowse();
    });
  }

  searchBox?.addEventListener("input", renderBrowse);

  renderBrowse();
  renderInspector();
}

const search = document.getElementById("nav-search");
if (search) {
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll(".nav a").forEach((a) => {
      a.style.display = a.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

const menuBtn = document.getElementById("menu-btn");
const sidebar = document.querySelector(".sidebar");
menuBtn?.addEventListener("click", () => sidebar.classList.toggle("open"));
