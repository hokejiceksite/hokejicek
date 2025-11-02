(function () {
  "use strict";

  const OVERLAY_ID = "adblock-overlay";

  // 🧱 vytvoří overlay, pokud ještě není
  function createOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    const div = document.createElement("div");
    div.id = OVERLAY_ID;
    div.innerHTML = `
      <style>
        body.locked > *:not(#${OVERLAY_ID}) { display: none !important; }
        #${OVERLAY_ID} {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.96);
          color: white; display: flex;
          flex-direction: column; align-items: center; justify-content: center;
          z-index: 999999; font-family: "Segoe UI", Arial, sans-serif;
          text-align: center; padding: 20px;
        }
        #${OVERLAY_ID} h1 { color: #ff4747; font-size: 2em; margin-bottom: 0.5em; }
        #${OVERLAY_ID} p { color: #ccc; font-size: 1.1em; max-width: 480px; margin: 0 auto 1.2em; }
        #${OVERLAY_ID} button {
          background: #4da3ff; border: none; color: #fff;
          padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 1em;
        }
      </style>
      <h1>⚠️ Přenosy nejsou zdarma</h1>
      <p>Prosím vypněte AdBlock a obnovte stránku. Děkujeme za podporu Hokejíčku ❤️</p>
      <button id="reloadBtn">🔄 Zkusit znovu</button>
    `;
    document.body.appendChild(div);
    document.getElementById("reloadBtn").onclick = () => location.reload();
  }

  // 🧩 otestuje blokování
  async function detectAdblock() {
    let blocked = false;

    // 1️⃣ zkusíme načíst google ads skript
    try {
      await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", { method: "HEAD", mode: "no-cors", cache: "no-store" });
    } catch {
      blocked = true;
    }

    // 2️⃣ test na přítomnost aclib (tvé reklamy)
    if (typeof window.aclib === "undefined") blocked = true;

    // 3️⃣ DOM test – skrytý prvek s třídou reklamy
    const bait = document.createElement("div");
    bait.className = "ad adsbox ad-banner ad-container advertisement";
    bait.style.cssText = "width:1px;height:1px;position:absolute;left:-9999px;top:-9999px;";
    document.body.appendChild(bait);
    await new Promise(r => setTimeout(r, 250));
    const style = getComputedStyle(bait);
    if (bait.offsetHeight === 0 || style.display === "none" || style.visibility === "hidden") blocked = true;
    bait.remove();

    if (blocked) {
      document.body.classList.add("locked");
      createOverlay();
    } else {
      document.body.classList.remove("locked");
      const overlay = document.getElementById(OVERLAY_ID);
      if (overlay) overlay.remove();
    }
  }

  // 🚀 spustí po načtení
  window.addEventListener("load", detectAdblock);
})();
