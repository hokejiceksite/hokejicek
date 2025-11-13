function updateCountdowns() {
  const countdowns = document.querySelectorAll(".countdown");
  const now = new Date();

  countdowns.forEach(el => {
    const hour = parseInt(el.dataset.hour);
    const minute = parseInt(el.dataset.minute) || 0;

    // 📌 Pevně nastavené datum zápasů Maxa ligy: 15. listopad 2025
    const matchDate = new Date(2025, 10, 15, hour, minute, 0);
    const diff = matchDate - now;

    const dateString = "15. 11. 2025";

    // 🟡 Zápas probíhá (0 až 3,5 hodiny po startu)
    if (diff <= 0 && diff > -1 * (3.5 * 60 * 60 * 1000)) {
      el.innerHTML = "Zápas právě probíhá";
      return;
    }

    // 🔴 Zápas skončil
    if (diff <= -1 * (3.5 * 60 * 60 * 1000)) {
      el.innerHTML = "Zápas skončil";
      return;
    }

    // 🔵 Odpočet do zápasu
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    let countdownText = "";

    // 🗓 Automatické nahrazování "dnes", "zítra", "pozítří"
    if (days > 2) countdownText = `${days} dní • ${dateString}`;
    else if (days === 2) countdownText = `pozítří • ${dateString}`;
    else if (days === 1) countdownText = `zítra • ${dateString}`;
    else if (days === 0) countdownText = `dnes • ${dateString}`;
    else countdownText = dateString;

    countdownText += `<br>${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;

    el.innerHTML = countdownText;
  });
}

setInterval(updateCountdowns, 1000);
updateCountdowns();
