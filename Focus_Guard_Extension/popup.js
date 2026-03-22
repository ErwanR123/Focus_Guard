// Cache DOM (évite de re-query à chaque fois)
const timerEl = document.getElementById("timer");
const statsEl = document.getElementById("stats");

// Update timer affiché (optimisé)
function updateTimer() {
  chrome.storage.local.get(
    ["unlockStartTime", "unlockEndTime"],
    (result) => {
      const now = Date.now();

      if (!result.unlockStartTime) {
        timerEl.textContent = "Locked";
        return;
      }

      // phase attente
      if (now < result.unlockStartTime) {
        const remaining = result.unlockStartTime - now;
        const min = Math.floor(remaining / 60000);
        const sec = Math.floor((remaining % 60000) / 1000);

        timerEl.textContent = `Unlock in ${min}:${sec
          .toString()
          .padStart(2, "0")}`;
        return;
      }

      // phase active
      if (now <= result.unlockEndTime) {
        const remaining = result.unlockEndTime - now;
        const min = Math.floor(remaining / 60000);
        const sec = Math.floor((remaining % 60000) / 1000);

        timerEl.textContent = `Unlocked ${min}:${sec
          .toString()
          .padStart(2, "0")}`;
        return;
      }

      // expired
      timerEl.textContent = "Locked";
    }
  );
}

// Incrément stats (léger)
function incrementStats() {
  const today = new Date().toISOString().split("T")[0];

  chrome.storage.local.get(["unlockStats"], (result) => {
    const stats = result.unlockStats || {};

    stats[today] = (stats[today] || 0) + 1;

    chrome.storage.local.set({ unlockStats: stats });
  });
}

// Calcul stats (optimisé)
function getStats(callback) {
  chrome.storage.local.get(["unlockStats"], (result) => {
    const stats = result.unlockStats || {};
    const today = Date.now();

    let day = 0;
    let week = 0;
    let month = 0;

    for (const date in stats) {
      const d = new Date(date).getTime();
      const diffDays = Math.floor((today - d) / 86400000);

      if (diffDays === 0) day += stats[date];
      if (diffDays <= 7) week += stats[date];
      if (diffDays <= 30) month += stats[date];
    }

    callback({ day, week, month });
  });
}

// Update affichage stats
function updateStats() {
  getStats((stats) => {
    statsEl.textContent =
      `Today: ${stats.day} | Week: ${stats.week} | Month: ${stats.month}`;
  });
}

// Unlock bouton (optimisé)
document.getElementById("unlock").addEventListener("click", () => {
  const reason = prompt("Why do you want to unlock?");

  if (!reason || reason.trim() === "") return;

  const now = Date.now();

  const unlockStartTime = now + 3 * 60 * 1000;
  const unlockEndTime = unlockStartTime + 5 * 60 * 1000;

  chrome.storage.local.set(
    { unlockStartTime, unlockEndTime },
    () => {
      incrementStats();
      updateStats();
      alert("Unlock will be available in 3 minutes.");
    }
  );
});

// Timer (léger car popup uniquement)
let timerInterval = setInterval(updateTimer, 1000);

// Nettoyage quand popup fermé
window.addEventListener("unload", () => {
  clearInterval(timerInterval);
});

// initial load
updateTimer();
updateStats();