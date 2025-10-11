// guard.js
(function(){
  // povolené hostitelské domény (můžeš upravit)
  const ALLOWED = ['hokejicek.site','starstreams.pro','w3schools.com'];

  // kontrola refereru / top-level hostitele
  function isAllowed() {
    try {
      // pokud je top-level (not iframe) – povolit pouze pokud jsme na povolené doméně
      const host = window.location.hostname || '';
      if (ALLOWED.some(h => host.includes(h))) return true;

      // pokud jsme v iframe -> zkus referrer (může být prázdný)
      if (window.top !== window.self) {
        const ref = document.referrer || '';
        if (ALLOWED.some(h => ref.includes(h))) return true;
      }
    } catch(e){}
    return false;
  }

  if (!isAllowed()) {
    // zobraz informaci a ukonči (není povolené embedování / hostování)
    document.documentElement.innerHTML = '<div style="background:#000;color:#fff;padding:30px;text-align:center">Tento přehrávač není povolen na této stránce.</div>';
    throw new Error('host not allowed');
  }

  // základní UI ochrany (neagresivní)
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('copy', e => { e.preventDefault(); });
  document.addEventListener('cut', e => { e.preventDefault(); });
  document.addEventListener('dragstart', e => e.preventDefault());

  // skrytí address bar v některých embed scénářích - drobnost
  try { window.history.replaceState(null, '', window.location.pathname); } catch(e){}
})();
