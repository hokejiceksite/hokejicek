// guard.js (lehké omezení a whitelist)
(function(){
  const ALLOWED = ['hokejicek.site','starstreams.pro','w3schools.com'];
  function allowedHost(){
    try{
      const host = location.hostname || '';
      if (ALLOWED.some(h=>host.includes(h))) return true;
      if (window.top !== window.self){
        const ref = document.referrer || '';
        if (ALLOWED.some(h=>ref.includes(h))) return true;
      }
    }catch(e){}
    return false;
  }
  if (!allowedHost()){
    document.documentElement.innerHTML = '<div style="background:#000;color:#fff;padding:30px;text-align:center">Tento přehrávač není povolen zde.</div>';
    throw new Error('host not allowed');
  }

  // základní UI ochrany
  document.addEventListener('contextmenu', e=>e.preventDefault());
  document.addEventListener('selectstart', e=>e.preventDefault());
  document.addEventListener('copy', e=>e.preventDefault());
  document.addEventListener('cut', e=>e.preventDefault());
})();
