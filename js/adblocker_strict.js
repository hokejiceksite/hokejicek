(function(){
  'use strict';

  function showOverlay(){
    var o=document.getElementById('adblock-overlay');
    document.documentElement.classList.add('blocked');
    document.body.classList.add('hide-all');
    if(o){o.style.display='flex'}
  }

  function revealContent(){
    document.body.classList.remove('hide-all');
  }

  function testDomHeuristics(){
    var b=document.createElement('div');
    b.className='ad adsbox ad-banner advertisement ad-container';
    b.style.cssText='width:1px;height:1px;position:absolute;left:-10000px;top:-10000px;';
    document.body.appendChild(b);
    return new Promise(function(res){
      setTimeout(function(){
        var blocked=(b.offsetParent===null)||(b.offsetHeight===0)||(getComputedStyle(b).display==='none')||(getComputedStyle(b).visibility==='hidden');
        b.remove();
        res(blocked);
      },300);
    });
  }

  async function detect(){
    var blocked=false;
    if(typeof window.aclib==='undefined') blocked=true;
    if(!blocked){
      try{
        var r=await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',{method:'HEAD',mode:'no-cors',cache:'no-store'});
        if(r.redirected) blocked=true;
      }catch(e){blocked=true}
    }
    if(!blocked){
      var domBlocked=await testDomHeuristics();
      if(domBlocked) blocked=true;
    }
    if(blocked) showOverlay(); else revealContent();
  }

  window.addEventListener('load',detect);
})();
