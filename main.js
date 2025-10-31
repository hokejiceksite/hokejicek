function loadMatches() {
  const matches = JSON.parse(localStorage.getItem("hokejicek_matches") || "[]");
  const container = document.getElementById("matches");
  container.innerHTML = "";

  if (matches.length === 0) {
    container.innerHTML =
      "<p style='text-align:center;color:#9fb0c6;'>Zatím žádné přenosy nejsou naplánované.</p>";
    return;
  }

  matches.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${m.image}" alt="${m.title}" class="thumb">
      <div class="card-content">
        <h3>${m.title}</h3>
        <div class="league">${m.league}</div>
        <div class="timer" id="timer${i}"></div>
      </div>`;
    card.onclick = () => window.location.href = m.link;
    container.appendChild(card);
    updateTimer(m.time, `timer${i}`);
    setInterval(() => updateTimer(m.time, `timer${i}`), 1000);
  });
}

function updateTimer(startTime, id) {
  const el = document.getElementById(id);
  if (!el) return;
  const now = Date.now();
  const matchTime = new Date(startTime).getTime();
  const diff = matchTime - now;

  if (diff <= 0) {
    el.textContent = "🎥 Živě";
    el.style.color = "#35d07f";
    return;
  }

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  el.textContent = `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Tajná klávesová zkratka pro admin (Shift + A + D + M)
let seq = "";
document.addEventListener("keydown", (e) => {
  if (e.shiftKey) seq += e.key.toUpperCase();
  if (seq.endsWith("ADM")) window.location.href = "/admin/index.html";
  if (seq.length > 4) seq = "";
});

window.addEventListener("DOMContentLoaded", loadMatches);
