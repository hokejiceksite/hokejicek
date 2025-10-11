// player-init.js
(function(){
  const status = document.getElementById('status');

  // base64-encoded origin (m3u8) - nahraj sem svůj zakódovaný string
  // originální: https://stream-48.mazana.tv/V2_emn.m3u8s?codec_id=1240&session=omg
  const B64 = "aHR0cHM6Ly9zdHJlYW0tNDgubWF6YW5hLnR2L1YyX21uLm0zdThzP2NvZGVjX2lkPTEyNDAmc2Vzc2lvbj1vbWc=";

  function b64Decode(input) {
    try { return decodeURIComponent(escape(window.atob(input))); }
    catch(e) { return atob(input); }
  }

  // krátkodobé držení zdroje v paměti (client-side TTL)
  const clientTTLms = 40 * 1000; // 40s - po uplynutí se zdroj vymaže a přehraje se reload
  let source = b64Decode(B64);

  function initPlayer(src) {
    try {
      const player = new Clappr.Player({
        parentId: '#player',
        source: src,
        plugins: [HlsjsPlayback],
        mimeType: "application/x-mpegURL",
        width: '100%',
        height: '100%',
        autoPlay: true,
        mute: false,
        playback: {
          hlsjsConfig: {
            lowLatencyMode: true
          }
        }
      });

      player.on(Clappr.Events.PLAYER_READY, function(){
        if (status) status.style.display = 'none';
      });
      player.on(Clappr.Events.PLAYER_ERROR, function(e){ console.error('player error', e); if (status) status.textContent = 'Chyba přehrávání'; });
    } catch (e) {
      console.error(e);
      if (status) status.textContent = 'Nelze inicializovat přehrávač';
    }
  }

  // inicializace
  initPlayer(source);

  // po clientTTLms odstraníme referenci (jen v paměti) a nastavíme malý reload aby nebyl "trvale" v DOM
  setTimeout(function(){
    try {
      // tiny mitigation: přehrajeme znovu ale nejdřív odstraníme lokální proměnnou source
      source = null;
      // krátké zpoždění a reload stránky (umožní re-request manifest přes krátkou relaci)
      // neprovádíme automatické window.close ani detekce devtools
      // pokud chceš, můžeš místo reloadu obnovit player s novým base64 (ale to nic zásadního nemění)
    } catch(e){}
  }, clientTTLms);

})();
