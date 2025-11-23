function detectAdblock(callback){
    let detected = false;

    const bait = document.createElement("div");
    bait.className = "adsbox banner adunit";
    bait.style.position="absolute";
    bait.style.top="-1000px";
    document.body.appendChild(bait);

    setTimeout(()=>{
        const hidden =
            bait.offsetParent===null ||
            bait.offsetHeight===0 ||
            bait.clientHeight===0;

        const aclibBlocked = window.__aclibBlocked === true;

        if(aclibBlocked && hidden){
            detected = true;
        }

        bait.remove();
        callback(detected);
    },500);
}
