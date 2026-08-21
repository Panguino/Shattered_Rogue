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

document.querySelectorAll(".load-3d").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const slot = btn.closest(".model-slot");
    if (!slot) return;
    btn.disabled = true;
    btn.textContent = "Loading…";
    try {
      await ensureModelViewer();
      const viewer = document.createElement("model-viewer");
      viewer.src = slot.dataset.src;
      viewer.alt = slot.dataset.alt || "Ship model";
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("auto-rotate", "");
      viewer.setAttribute("touch-action", "pan-y");
      viewer.setAttribute("shadow-intensity", "0.7");
      viewer.setAttribute("exposure", "1");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("camera-orbit", "45deg 65deg auto");
      viewer.setAttribute("field-of-view", "28deg");
      viewer.setAttribute("interaction-prompt", "none");
      viewer.addEventListener("error", () => {
        const viaFile = location.protocol === "file:";
        showModelError(
          slot,
          viaFile
            ? "GLB cannot load from a file:// page. From the wiki folder run npm run serve, then open http://localhost:4173/ships.html"
            : "Could not load this GLB. Check the file path or rebuild the wiki."
        );
      });
      slot.classList.add("is-live");
      slot.replaceChildren(viewer);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "Retry 3D";
      console.error(err);
    }
  });
});

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
