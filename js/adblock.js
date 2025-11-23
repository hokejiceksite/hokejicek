document.addEventListener("DOMContentLoaded",()=>{
    const overlay=document.getElementById("adblock-overlay");
    const bait=document.createElement("div");
    bait.style.width="1px";
    bait.style.height="1px";
    bait.style.position="absolute";
    bait.style.top="-1000px";
    bait.className="adsbox banner adunit ad ads advertisement";
    document.body.appendChild(bait);
    setTimeout(()=>{
        const hidden=
            bait.offsetHeight===0||
            bait.clientHeight===0||
            getComputedStyle(bait).display==="none"||
            getComputedStyle(bait).visibility==="hidden";
        bait.remove();
        if(hidden){
            overlay.style.display="flex";
        }else{
            overlay.style.display="none";
            startStream();
        }
    },300);
});
document.addEventListener("click",e=>{
    if(e.target.id==="adblock-retry")location.reload();
});
