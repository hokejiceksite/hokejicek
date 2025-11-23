window.adblockDetected = false;

function detectAdblock(callback) {
    let detected = false;

    const bait = document.createElement("div");
    bait.className = "adsbox ads banner ad-banner adunit advertising text-ad sponsor";
    bait.style.position = "absolute";
    bait.style.top = "-1000px";
    bait.style.height = "10px";
    bait.style.width = "10px";
    bait.style.zIndex = "-1";

    document.body.appendChild(bait);

    setTimeout(() => {
        const styles = window.getComputedStyle(bait);
        const hidden =
            bait.offsetParent === null ||
            bait.offsetHeight === 0 ||
            bait.clientHeight === 0 ||
            styles.display === "none" ||
            styles.visibility === "hidden" ||
            styles.opacity === "0";

        if (hidden) detected = true;

        if (window.__aclibBlocked === true) detected = true;

        if (typeof window.aclib === "undefined") detected = true;

        const blockedScript = !document.querySelector("#aclib[src]");
        if (blockedScript) detected = true;

        bait.remove();

        window.adblockDetected = detected;
        callback(detected);

    }, 400);
}

function blockIfAdblock() {
    detectAdblock(function(isBlocked) {
        const overlay = document.getElementById("adblock-overlay");

        if (!overlay) return;

        if (isBlocked) {
            overlay.style.display = "flex";
            document.body.style.overflow = "hidden";

            const playerDiv = document.getElementById("player");
            if (playerDiv) playerDiv.innerHTML = "";

        } else {
            overlay.style.display = "none";
            document.body.style.overflow = "auto";

            // povolíme spuštění streamu
            if (typeof window.initStreaming === "function") {
                window.initStreaming();
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", blockIfAdblock);

setInterval(blockIfAdblock, 5000);

document.addEventListener("click", function(e) {
    if (e.target.id === "adblock-retry") {
        blockIfAdblock();
    }
});
