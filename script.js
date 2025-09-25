/* =========================================================
   UBC WEBSITE SCRIPT – FINAL VERSION WITH FLIPBOOK + QUIZ + READ ALOUD
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
    if (t) {
      t.pause();
      t.currentTime = 0;
    }
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
document.addEventListener("click", () => playBg(currentBg), { once: true });

/* ================== FIREWORKS ================== */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
function fit() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", fit); fit();

function burst(x, y) {
  const parts = [];
  for (let i = 0; i < 120; i++) {
    parts.push({
      x, y,
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
    t++; if (t < 140) requestAnimationFrame(tick);
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

/* ================== FLIPBOOK CORE ================== */
const FLIPBOOKS = {
  haven: {
    dir: "haven", prefix: "Haven_", total: 138,
    index: 1, imgEl: document.getElementById("haven-page"),
    wrapEl: document.getElementById("haven-flipbook"),
    progressEl: document.getElementById("haven-progress"),
  },
  rover: {
    dir: "rover", prefix: "Rover_", total: 41,
    index: 1, imgEl: document.getElementById("rover-page"),
    wrapEl: document.getElementById("rover-flipbook"),
    progressEl: document.getElementById("rover-progress"),
  }
  // TODO: add lotus, library, teacher, cat, lemon, storm with totals
};

let autoplayTimer = null;

function preload(src) { const im = new Image(); im.src = src; return im; }
function updateFlipbook(story) {
  const fb = FLIPBOOKS[story];
  const src = `${fb.dir}/${fb.prefix}${fb.index}.png`;
  fb.imgEl.classList.remove("show");
  setTimeout(() => {
    fb.imgEl.src = src;
    fb.imgEl.onload = () => fb.imgEl.classList.add("show");
  }, 10);
  fb.progressEl.textContent = `${fb.index} / ${fb.total}`;
  if (fb.index < fb.total) preload(`${fb.dir}/${fb.prefix}${fb.index + 1}.png`);
}
function openFlipbook(story) { stopAutoplay(); const fb = FLIPBOOKS[story]; fb.index = 1; fb.wrapEl.style.display = "flex"; updateFlipbook(story); }
function closeFlipbook(story) { stopAutoplay(); FLIPBOOKS[story].wrapEl.style.display = "none"; }
function nextPage(story) { const fb = FLIPBOOKS[story]; if (fb.index < fb.total) { fb.index++; updateFlipbook(story);} }
function prevPage(story) { const fb = FLIPBOOKS[story]; if (fb.index > 1) { fb.index--; updateFlipbook(story);} }
function startAutoplay(story, ms=3000) { stopAutoplay(); autoplayTimer = setInterval(() => { const fb = FLIPBOOKS[story]; if (fb.index>=fb.total) stopAutoplay(); else nextPage(story); }, ms); }
function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer=null; } }

/* ================== KEYBOARD & SWIPE ================== */
document.addEventListener("keydown", (e) => {
  const active = Object.keys(FLIPBOOKS).find(k => FLIPBOOKS[k].wrapEl.style.display === "flex");
  if (!active) return;
  if (e.key === "ArrowRight") nextPage(active);
  if (e.key === "ArrowLeft") prevPage(active);
  if (e.key.toLowerCase() === " ") {
    if (autoplayTimer) stopAutoplay(); else startAutoplay(active);
    e.preventDefault();
  }
});
function addSwipe(el, onLeft, onRight) {
  let x0 = null;
  el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    let dx = e.changedTouches[0].clientX - x0;
    if (dx < -30) onLeft();
    if (dx > 30) onRight();
    x0 = null;
  }, { passive: true });
}
Object.values(FLIPBOOKS).forEach(fb => addSwipe(fb.wrapEl, () => nextPage(fb.dir), () => prevPage(fb.dir)));

/* ================== READ ALOUD FOR BOOK PAGES ================== */
const PAGE_TEXTS = {
  haven: {
    "Haven_1.png": "Haven cover page.",
    "Haven_page1.png": "Haven woke to the smell of rising dough...",
    // Extend as needed
  },
  rover: {
    "Rover_1.png": "Rover cover page.",
    // Extend as needed
  }
};
function readAloud(story) {
  const fb = FLIPBOOKS[story];
  const pageSrc = `${fb.prefix}${fb.index}.png`;
  const text = PAGE_TEXTS[story]?.[pageSrc] || "No text available for this page.";
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = (currentLang === "es") ? "es-ES" : "en-US";
  utterance.rate = 1; utterance.pitch = 1;
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
}

/* ================== QUIZ SYSTEM ================== */
const QUIZZES = {
  haven: [
    { q: "What smell woke Haven?", options: ["Bread", "Pizza", "Rain"], answer: "Bread" },
    { q: "Who took Haven in?", options: ["Ma Millie", "Rover", "Teacher"], answer: "Ma Millie" }
  ],
  rover: [
    { q: "Where does Rover travel?", options: ["Mars", "Moon", "Ocean"], answer: "Mars" }
  ]
};
let currentQuiz = null;
function showQuiz(story) {
  currentQuiz = QUIZZES[story][0];
  document.getElementById("quiz-question").textContent = currentQuiz.q;
  const optionsContainer = document.getElementById("quiz-options");
  optionsContainer.innerHTML = "";
  currentQuiz.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkQuizAnswer(story, opt);
    optionsContainer.appendChild(btn);
  });
  document.getElementById("quiz-overlay").style.display = "flex";
  readQuizAloud();
}
function closeQuiz() { document.getElementById("quiz-overlay").style.display = "none"; }
function checkQuizAnswer(story, opt) {
  const feedback = document.getElementById("quiz-feedback");
  feedback.textContent = (opt === currentQuiz.answer) ? "✅ Correct!" : "❌ Try again!";
}

/* ================== READ ALOUD FOR QUIZZES ================== */
const quizReadBtn = document.getElementById("quiz-read-btn");
function readQuizAloud() {
  const question = document.getElementById("quiz-question")?.textContent || "";
  const options = [...document.querySelectorAll("#quiz-options button")]
    .map((btn, i) => `Option ${i+1}: ${btn.textContent}`)
    .join(". ");
  const text = `${question}. ${options}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = (currentLang === "es") ? "es-ES" : "en-US";
  utterance.rate = 1; utterance.pitch = 1;
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
}
quizReadBtn?.addEventListener("click", readQuizAloud);

/* ================== LANGUAGE TOGGLE ================== */
const translations = { en: { mainTitle:"Ultimate Book Challenge 2025–2026"}, es: { mainTitle:"Desafío de Libros 2025–2026"} };
let currentLang = localStorage.getItem("ubc_lang") || "en";
function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
}
applyLanguage(currentLang);
const langBtn = document.getElementById("lang-toggle");
langBtn?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  localStorage.setItem("ubc_lang", currentLang);
  applyLanguage(currentLang);
});
