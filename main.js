const matches = [
  {
    title: "HC Rytíři Vlašim vs HC Benešov",
    league: "Krajská liga",
    startTime: "2025-10-31T18:00:00",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Ice_hockey_puck_on_ice.jpg",
    link: "/live1.html"
  },
  {
    title: "Mountfield HK vs HC Sparta Praha",
    league: "TELH",
    startTime: "2025-11-02T17:30:00",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/9/97/Hockey_ice_rink.jpg",
    link: "/live2.html"
  },
  {
    title: "Florida Panthers vs Boston Bruins",
    league: "NHL",
    startTime: "2025-11-03T01:00:00",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Ice_hockey_players.jpg",
    link: "/live3.html"
  }
];

function renderMatches() {
  const container = document.getElementById("matches");
  container.innerHTML = "";
  matches.forEach((m, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${m.thumbnail}" alt="${m.title}" class="thumb">
      <div class="card-content">
        <h3>${m.title}</h3>
        <div class="league">${m.league}</div>
        <div class="timer" id="timer${index}"></div>
      </div>
    `;
    card.addEventListener("click", () => window.location.href = m.link);
    container.appendChild(card);
    updateTimer(m.startTime, `timer${index}`);
    setInterval(() => updateTimer(m.startTime, `timer${index}`), 1000);
  });
}

function updateTimer(startTime, id) {
  const now = new Date().getTime();
  const matchTime = new Date(startTime).getTime();
  const diff = matchTime - now;
  const el = document.getElementById(id);

  if (diff <= 0) {
    el.textContent = "🎥 Živě";
    el.style.color = "#35d07f";
    return;
  }

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  el.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

window.addEventListener("DOMContentLoaded", renderMatches);
