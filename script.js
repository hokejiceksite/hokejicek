fetch("data/matches.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("matches-container");
    data.matches.forEach(match => {
      const card = document.createElement("div");
      card.className = "match-card";
      card.innerHTML = `
        <h3>${match.home} vs ${match.away}</h3>
        <p>📅 ${match.date}</p>
        <p>🏟️ ${match.location}</p>
        <p>🏆 ${match.league}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => console.error("Chyba při načítání zápasů:", err));
