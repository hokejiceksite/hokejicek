function renderAdmin() {
  const matches = JSON.parse(localStorage.getItem("hokejicek_matches") || "[]");
  const container = document.getElementById("adminMatches");
  container.innerHTML = "";

  matches.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${m.image}" alt="${m.title}" class="thumb">
      <div class="card-content">
        <h3>${m.title}</h3>
        <div class="league">${m.league}</div>
        <div class="timer">${new Date(m.time).toLocaleString("cs-CZ")}</div>
        <button onclick="deleteMatch(${i})" class="danger">Smazat</button>
      </div>`;
    container.appendChild(card);
  });
}

function deleteMatch(index) {
  const matches = JSON.parse(localStorage.getItem("hokejicek_matches") || "[]");
  matches.splice(index, 1);
  localStorage.setItem("hokejicek_matches", JSON.stringify(matches));
  renderAdmin();
}

document.getElementById("addMatch").addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();
  const league = document.getElementById("league").value.trim();
  const image = document.getElementById("image").value.trim();
  const link = document.getElementById("link").value.trim();
  const time = document.getElementById("time").value;

  if (!title || !league || !image || !link || !time) {
    alert("Vyplň prosím všechna pole.");
    return;
  }

  const matches = JSON.parse(localStorage.getItem("hokejicek_matches") || "[]");
  const existing = matches.findIndex(m => m.link === link);
  const newMatch = { title, league, image, link, time };

  if (existing >= 0) matches[existing] = newMatch;
  else matches.push(newMatch);

  localStorage.setItem("hokejicek_matches", JSON.stringify(matches));
  renderAdmin();
  alert("✅ Přenos uložen!");
});

document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Opravdu smazat všechny přenosy?")) {
    localStorage.removeItem("hokejicek_matches");
    renderAdmin();
  }
});

window.addEventListener("DOMContentLoaded", renderAdmin);
