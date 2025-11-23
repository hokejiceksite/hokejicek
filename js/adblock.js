document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("adblock-overlay");

    const bait = document.createElement("div");
    bait.style.width = "1px";
    bait.style.height = "1px";
    bait.style.position = "absolute";
    bait.style.left = "-9999px";
    bait.className = "adsbox ad-banner banner ad ads advertisement sponsor";
    document.body.appendChild(bait);

    setTimeout(() => {
        const style = window.getComputedStyle(bait);
        const blocked =
            bait.offsetHeight === 0 ||
            bait.clientHeight === 0 ||
            style.display === "none" ||
            style.visibility === "hidden";

        bait.remove();

        if (blocked) {
            overlay.style.display = "flex";
        } else {
            overlay.style.display = "none";
            if (typeof startPlayer === "function") startPlayer();
        }
    }, 350);
});

document.addEventListener("click", e => {
    if (e.target.id === "adblock-retry") location.reload();
});
