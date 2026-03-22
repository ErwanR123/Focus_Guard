const blockedSites = [
  "instagram.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
];

// Détection propre des domaines
function isTargetSite(host) {
  return blockedSites.some(site =>
    host === site || host.endsWith("." + site)
  );
}

// Vérifie si bloqué
function isBlocked(callback) {
  chrome.storage.local.get(
    ["unlockStartTime", "unlockEndTime"],
    (result) => {
      const now = Date.now();

      if (!result.unlockStartTime || now < result.unlockStartTime) {
        callback(true);
        return;
      }

      if (now <= result.unlockEndTime) {
        callback(false);
        return;
      }

      callback(true);
    }
  );
}

// Bloque page (une seule fois)
let pageBlocked = false;

function blockPage() {
  if (pageBlocked) return;
  pageBlocked = true;

  document.documentElement.innerHTML = `
    <div style="
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      font-family:sans-serif;
      text-align:center;
    ">
      <div>
        <h1>Blocked</h1>
        <p>This site is blocked to help you stay focused.</p>
      </div>
    </div>
  `;
}

// Vérifie blocage
function checkBlocking() {
  const host = window.location.hostname;

  if (!isTargetSite(host)) return;

  isBlocked((blocked) => {
    if (blocked) blockPage();
  });
}

// Observer pour sites dynamiques (léger)
function initBlockingObserver() {
  const host = window.location.hostname;

  if (!isTargetSite(host)) return;

  const observer = new MutationObserver(() => {
    if (pageBlocked) return;

    isBlocked((blocked) => {
      if (blocked) blockPage();
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

// YouTube Shorts removal
function removeShorts() {
  document.querySelectorAll('ytd-rich-section-renderer').forEach(el => {
    if (el.innerText.includes("Shorts")) el.remove();
  });

  document.querySelectorAll('a[href^="/shorts/"]').forEach(el => {
    const parent = el.closest('ytd-video-renderer, ytd-rich-item-renderer');
    if (parent) parent.remove();
  });
}

// Focus homepage YouTube
let focusInjected = false;

function replaceYouTubeHomepage() {
  if (
    window.location.hostname.includes("youtube.com") &&
    window.location.pathname === "/" &&
    !focusInjected
  ) {
    focusInjected = true;

    chrome.storage.local.get(["ytFocusBypassed"], (result) => {
      if (result.ytFocusBypassed) return;

      document.body.innerHTML = `
        <div style="
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          height:100vh;
          font-family:sans-serif;
          text-align:center;
        ">
          <h1>Focus Mode</h1>
          <p>Search intentionally.</p>

          <input id="searchInput" placeholder="Search YouTube..." style="
            padding:10px;
            width:300px;
            font-size:16px;
            margin-top:10px;
          "/>

          <button id="continueBtn" style="
            margin-top:20px;
            padding:10px;
            cursor:pointer;
          ">
            Continue to YouTube
          </button>
        </div>
      `;

      const input = document.getElementById("searchInput");

      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = input.value.trim();
          if (query) {
            window.location.href =
              "https://www.youtube.com/results?search_query=" +
              encodeURIComponent(query);
          }
        }
      });

      document.getElementById("continueBtn").addEventListener("click", () => {
        chrome.storage.local.set({ ytFocusBypassed: true }, () => {
          location.reload();
        });
      });
    });
  }
}

// YouTube optimisation (sans boucle)
function initYouTube() {
  if (!window.location.hostname.includes("youtube.com")) return;

  // redirect shorts
  if (window.location.pathname.startsWith("/shorts/")) {
    window.location.href = "https://www.youtube.com/";
    return;
  }

  const observer = new MutationObserver(() => {
    removeShorts();
    replaceYouTubeHomepage();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // appel initial
  removeShorts();
  replaceYouTubeHomepage();
}

// RUN
checkBlocking();
initBlockingObserver();
initYouTube();