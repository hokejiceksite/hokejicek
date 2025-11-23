document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("adblock-overlay");

    const bait = document.createElement("div");
    bait.className = "adsbox ad-banner banner ad ads advertisement sponsor";
    bait.style.position = "absolute";
    bait.style.left = "-9999px";
    bait.style.width = "1px";
    bait.style.height = "1px";
    document.body.appendChild(bait);

    setTimeout(() => {
        const style = getComputedStyle(bait);
        const baitBlocked =
            bait.offsetHeight === 0 ||
            bait.clientHeight === 0 ||
            style.display === "none" ||
            style.visibility === "hidden";

        bait.remove();

        fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
            method: "HEAD",
            mode: "no-cors"
        })
        .then(() => {
            if (!baitBlocked) {
                overlay.style.display = "none";
                if (typeof startPlayer === "function") startPlayer();
            } else {
                overlay.style.display = "flex";
            }
        })
        .catch(() => {
            overlay.style.display = "flex";
        });

    }, 300);
});

document.addEventListener("click", e => {
    if (e.target.id === "adblock-retry") location.reload();
});
