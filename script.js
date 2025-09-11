/* =========================================================
   UBC WEBSITE SCRIPT – FINAL VERSION WITH FLIPBOOK
   ========================================================= */

/* ================== TEAM NAME + FOOTER SYNC ================== */
const teamSplash = document.getElementById("team-name-splash");
const teamMain = document.getElementById("team-name");
const footer = document.getElementById("footer-text");

function updateTeamName(name) {
  if (!name) return;
  localStorage.setItem("teamName", name);
  if (teamSplash) teamSplash.value = name;
  if (teamMain) teamMain.value = name;
  if (footer)
    footer.textContent = `Created by Devarani Ponna · Educational Use Only · Team: ${name}`;
}

const savedTeam = localStorage.getItem("teamName");
if (savedTeam) updateTeamName(savedTeam);

/* ================== LOADING + SPLASH ================== */
const splash = document.getElementById("splash-screen");
const loading = document.getElementById("loading-screen");
const startBtn = document.getElementById("start-btn");

window.addEventListener("load", () => {
  const whoosh = document.getElementById("sound-whoosh");
  whoosh?.play();
  setTimeout(() => {
    loading.style.display = "none";
    splash.style.display = "block";
  }, 2000);
});

startBtn?.addEventListener("click", () => {
  updateTeamName(teamSplash.value);
  splash.style.display = "none";
  gate.style.display = "block";
});

teamMain?.addEventListener("input", () => updateTeamName(teamMain.value));

/* ================== PASSWORD GATE ================== */
const pwBtn = document.getElementById("pw-btn");
const input = document.getElementById("password-input");
const err = document.getElementById("error-message");
const main = document.getElementById("main-content");
const gate = document.getElementById("password-screen");

function unlock() {
  gate.style.display = "none";
  main.style.display = "block";
}
function checkSaved() {
  if (sessionStorage.getItem("ubc_ok") === "1") unlock();
}
checkSaved();

pwBtn?.addEventListener("click", () => {
  const ok = (input.value || "").toLowerCase() === "ubc2025";
  if (ok) {
    sessionStorage.setItem("ubc_ok", "1");
    unlock();
  } else {
    err.textContent = "Incorrect password. Try again.";
  }
});
input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") pwBtn.click();
});

/* ================== BACKGROUND MUSIC ================== */
const bgTracks = {
  calm: document.getElementById("bg-music-calm"),
  piano: document.getElementById("bg-music-piano"),
  beat: document.getElementById("bg-music-beat"),
};
let currentBg = "calm";
let bgMuted = false;
let globalMuted = false;

function playBg(track) {
  Object.values(bgTracks).forEach((t) => {
    t.pause();
    t.currentTime = 0;
  });
  const selected = bgTracks[track];
  if (!selected) return;
  currentBg = track;
  if (!bgMuted && !globalMuted) selected.play().catch(() => {});
}

function fadeOut(audio, duration = 1000) {
  if (!audio) return;
  let vol = audio.volume;
  const step = vol / (duration / 50);
  const fade = setInterval(() => {
    vol -= step;
    if (vol <= 0) {
      audio.pause();
      audio.volume = 1;
      clearInterval(fade);
    } else audio.volume = vol;
  }, 50);
}

const musicSelect = document.getElementById("music-select");
const musicToggle = document.getElementById("music-toggle");
const globalToggle = document.getElementById("global-toggle");

musicSelect?.addEventListener("change", (e) => playBg(e.target.value));
musicToggle?.addEventListener("click", () => {
  bgMuted = !bgMuted;
  musicToggle.textContent = bgMuted ? "🎶 Off" : "🎶 On";
  if (bgMuted) Object.values(bgTracks).forEach((t) => t.pause());
  else playBg(currentBg);
});
globalToggle?.addEventListener("click", () => {
  globalMuted = !globalMuted;
  globalToggle.textContent = globalMuted ? "🔇 Off" : "🔊 On";
  if (globalMuted) {
    Object.values(bgTracks).forEach((t) => t.pause());
    document.querySelectorAll("audio").forEach((a) => a.pause());
  } else {
    playBg(currentBg);
  }
});
document.addEventListener("click", () => playBg(currentBg), { once: true });

/* ================== FIREWORKS ================== */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
function fit() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", fit);
fit();

function burst(x, y) {
  const parts = [];
  for (let i = 0; i < 120; i++) {
    parts.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      r: Math.random() * 2 + 1.8,
      a: 1,
      hue: Math.floor(Math.random() * 360),
    });
  }
  let t = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.r *= 0.98;
      p.a *= 0.97;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(p.r, 0), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,55%,${p.a})`;
      ctx.fill();
    });
    t++;
    if (t < 140) requestAnimationFrame(tick);
  }
  tick();
}

/* ================== CELEBRATION ================== */
function celebrate(theme) {
  const sound = document.getElementById(`sound-${theme}`);
  if (sound) {
    document.querySelectorAll("audio").forEach((a) => {
      if (a !== sound && !a.loop) a.pause();
    });
    fadeOut(bgTracks[currentBg], 500);
    sound.currentTime = 0;
    sound.play();
    setTimeout(() => playBg(currentBg), 5000);
  }
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    document.body.appendChild(confetti);
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = randomConfettiColor(theme);
    confetti.style.animationDuration = 2 + Math.random() * 3 + "s";
    setTimeout(() => confetti.remove(), 5000);
  }
  burst(innerWidth / 2, innerHeight / 2);
}

function randomConfettiColor(theme) {
  const colors = {
    rover: ["#ff4d4d", "#ff9999", "#ff1a1a"],
    lotus: ["#33cc33", "#66ff66", "#009933"],
    haven: ["#ff66cc", "#ff99cc", "#ff3399"],
    library: ["#ffcc00", "#ffdd66", "#ffaa00"],
    teacher: ["#3366ff", "#6699ff", "#0033cc"],
    cat: ["#ff6600", "#ff9933", "#ffcc66"],
    lemon: ["#cc33ff", "#9933ff", "#cc99ff"],
    storm: ["#00ccff", "#3399ff", "#0066cc"],
  };
  const themeColors = colors[theme] || ["#ffffff"];
  return themeColors[Math.floor(Math.random() * themeColors.length)];
}

/* ================== FLIPBOOKS ================== */
let autoplayInterval = null;

function openFlipbook(story) {
  document.getElementById(`${story}-flipbook`).style.display = "flex";
  let bookDiv = document.getElementById(`${story}-book`);
  bookDiv.innerHTML = "";

  let pageCount = story === "rover" ? 41 : 8;
  for (let i = 1; i <= pageCount; i++) {
    let img = document.createElement("img");
    img.src = `${story}/${story.charAt(0).toUpperCase() + story.slice(1)}_${i}.png`;
    bookDiv.appendChild(img);
  }

  $(`#${story}-book`).turn({
    width: 800,
    height: 600,
    autoCenter: true,
  });
}

function closeFlipbook(story) {
  document.getElementById(`${story}-flipbook`).style.display = "none";
  stopAutoplay();
  $(`#${story}-book`).turn("destroy");
}

function startAutoplay(story, speed = 3000) {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    $(`#${story}-book`).turn("next");
    let totalPages = $(`#${story}-book`).turn("pages");
    let currentPage = $(`#${story}-book`).turn("page");
    if (currentPage >= totalPages) {
      stopAutoplay();
      celebrate(story); // 🎆 Celebrate when story finishes
    }
  }, speed);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}
