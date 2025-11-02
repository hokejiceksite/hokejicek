(function() {
  'use strict';

  async function detectAdBlock() {
    const bait = document.createElement('div');
    bait.className = 'ad-banner ads adbox advertisement';
    bait.style.cssText = 'width:1px;height:1px;position:absolute;left:-10000px;top:-10000px;';
    document.body.appendChild(bait);

    let blocked = false;
    await new Promise(r => setTimeout(r, 300));
    if (bait.offsetParent === null || bait.offsetHeight === 0) blocked = true;
    bait.remove();

    try {
      const resp = await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", { method: "HEAD", mode: "no-cors" });
      if (resp.redirected) blocked = true;
    } catch {
      blocked = true;
    }

    return blocked;
  }

  function showOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'adblock-overlay';
    overlay.innerHTML = `
      <div style="
        position:fixed;inset:0;
        background:rgba(0,0,0,0.95);
        color:white;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        font-family:Segoe UI,Arial,sans-serif;
        text-align:center;
        z-index:99999;
        padding:20px;">
        <h1 style="color:#ff4747;font-size:2em;">⚠️ Přenosy nejsou zdarma</h1>
        <p style="font-size:1.2em;color:#ccc;max-width:500px;">
          Prosím, vypněte AdBlock a obnovte stránku.<br>
          Děkujeme za podporu Hokejíčku ❤️
        </p>
        <button id="reloadBtn" style="
          margin-top:25px;
          background:#4da3ff;
          color:white;
          border:none;
          padding:10px 22px;
          font-size:1em;
          border-radius:10px;
          cursor:pointer;">🔄 Zkusit znovu</button>
      </div>`;
    document.body.appendChild(overlay);

    document.body.style.overflow = 'hidden';
    document.getElementById('reloadBtn').addEventListener('click', () => {
      location.reload();
    });
  }

  window.addEventListener('load', async () => {
    const blocked = await detectAdBlock();
    if (blocked) showOverlay();
  });

})();
