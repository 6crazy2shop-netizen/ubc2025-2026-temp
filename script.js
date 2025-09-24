/* =========================================================
   UBC WEBSITE SCRIPT – FINAL VERSION (Phase 1 + Phase 2)
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

/* ================== PAGE SOUND TOGGLE ================== */
let pageSoundsMuted = false;
const pageSoundToggle = document.getElementById("page-sound-toggle");

pageSoundToggle?.addEventListener("click", () => {
  pageSoundsMuted = !pageSoundsMuted;
  pageSoundToggle.textContent = pageSoundsMuted ? "🔇 Page Sounds Off" : "🔊 Page Sounds On";
});

/* ================== PAGE TURN SOUND ================== */
function playPageTurn() {
  if (pageSoundsMuted) return;
  const turnSound = document.getElementById("sound-whoosh");
  if (!turnSound) return;

  turnSound.pause();
  turnSound.currentTime = 0;

  fadeOut(bgTracks[currentBg], 300);

  turnSound.play().then(() => {
    setTimeout(() => {
      turnSound.pause();
      turnSound.currentTime = 0;
      playBg?.(currentBg);
    }, 5000);
  }).catch(()=>{});
}

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

/* ================== FLIPBOOK CONFIG ================== */
const FLIPBOOKS = {
  rover: { dir: "rover", prefix: "Rover_", total: 41, index: 1,
           imgEl: $("#rover-page"), wrapEl: $("#rover-flipbook"), progressEl: $("#rover-progress") },
  haven: { dir: "haven", prefix: "Haven_", total: 138, index: 1,
           imgEl: $("#haven-page"), wrapEl: $("#haven-flipbook"), progressEl: $("#haven-progress") },
  cat: { dir: "Cat_in_space", prefix: "Cat_", total: 320, index: 1,
           imgEl: $("#cat-page"), wrapEl: $("#cat-flipbook"), progressEl: $("#cat-progress") },
  storm: { dir: "I_survived", prefix: "Storm_", total: 144, index: 1,
           imgEl: $("#storm-page"), wrapEl: $("#storm-flipbook"), progressEl: $("#storm-progress") },
  lotus: { dir: "Lotus_island", prefix: "Lotus_", total: 160, index: 1,
           imgEl: $("#lotus-page"), wrapEl: $("#lotus-flipbook"), progressEl: $("#lotus-progress") },
  lemon: { dir: "Mr.Lemoncello", prefix: "Lemon_", total: 336, index: 1,
           imgEl: $("#lemon-page"), wrapEl: $("#lemon-flipbook"), progressEl: $("#lemon-progress") },
  teacher: { dir: "Super_teacher", prefix: "Teacher_", total: 304, index: 1,
           imgEl: $("#teacher-page"), wrapEl: $("#teacher-flipbook"), progressEl: $("#teacher-progress") },
  library: { dir: "library", prefix: "Library_", total: 224, index: 1,
           imgEl: $("#library-page"), wrapEl: $("#library-flipbook"), progressEl: $("#library-progress") },
};

let autoplayTimer = null;
function $(id) { return document.getElementById(id); }

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
  if (fb.index > 1) preload(`${fb.dir}/${fb.prefix}${fb.index - 1}.png`);
}

function openFlipbook(story) {
  stopAutoplay();
  const fb = FLIPBOOKS[story];
  fb.index = loadProgress(story) || 1;
  fb.wrapEl.style.display = "flex";
  updateFlipbook(story);
  updateProgressText(story);
}
function closeFlipbook(story) { stopAutoplay(); FLIPBOOKS[story].wrapEl.style.display = "none"; }
function nextPage(story) {
  const fb = FLIPBOOKS[story];
  if (fb.index < fb.total) {
    fb.index++;
    updateFlipbook(story);
    saveProgress(story, fb.index);
    playPageTurn();
  } else { stopAutoplay(); openQuiz(story); }
}
function prevPage(story) {
  const fb = FLIPBOOKS[story];
  if (fb.index > 1) {
    fb.index--;
    updateFlipbook(story);
    saveProgress(story, fb.index);
    playPageTurn();
  }
}
function startAutoplay(story, ms = 3000) {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    const fb = FLIPBOOKS[story];
    if (fb.index >= fb.total) { stopAutoplay(); openQuiz(story); }
    else { nextPage(story); }
  }, ms);
}
function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }

/* ================== PROGRESS TRACKING ================== */
function saveProgress(book, page) { localStorage.setItem(`progress_${book}`, page); updateProgressText(book); }
function loadProgress(book) { return parseInt(localStorage.getItem(`progress_${book}`) || "1"); }
function updateProgressText(book) {
  const fb = FLIPBOOKS[book];
  const saved = loadProgress(book);
  const el = document.getElementById(`progress-${book}`);
  if (el) {
    const percent = Math.floor((saved / fb.total) * 100);
    el.textContent = `${saved} / ${fb.total} pages (${percent}%)`;
  }
}
Object.keys(FLIPBOOKS).forEach(updateProgressText);

/* ================== QUIZ DATA ================== */
const QUIZZES = {
  rover: [
    { q: "Where does Rover explore?", options: ["Mars", "Moon", "Ocean"], answer: "Mars" },
    { q: "What theme is important in Rover’s story?", options: ["Friendship", "Treasure", "Sports"], answer: "Friendship" }
  ],
  haven: [
    { q: "What kind of animal is Haven?", options: ["Dog", "Cat", "Bird"], answer: "Cat" },
    { q: "Where does Haven’s story begin?", options: ["Forest", "Beach", "Desert"], answer: "Forest" }
  ],
  cat: [
    { q: "What food does the Cat love?", options: ["Pizza", "Burgers", "Fish"], answer: "Pizza" },
    { q: "Where does the Cat go?", options: ["Space", "Ocean", "Mountains"], answer: "Space" }
  ],
  storm: [
    { q: "What disaster is this book about?", options: ["Hurricane", "Earthquake", "Tornado"], answer: "Hurricane" },
    { q: "What year was the Galveston storm?", options: ["1900", "2000", "1800"], answer: "1900" }
  ],
  lotus: [
    { q: "Where do the young heroes train?", options: ["Lotus Island", "Mars", "City"], answer: "Lotus Island" },
    { q: "What do they discover?", options: ["Magical powers", "Gold", "Robots"], answer: "Magical powers" }
  ],
  lemon: [
    { q: "Whose library is it?", options: ["Mr. Lemoncello", "Harry", "Alice"], answer: "Mr. Lemoncello" },
    { q: "What must kids solve?", options: ["Puzzles", "Riddles", "Math"], answer: "Puzzles" }
  ],
  teacher: [
    { q: "Who is the main character?", options: ["Superteacher", "Superman", "Robot"], answer: "Superteacher" },
    { q: "What surprises the students?", options: ["Teacher has powers", "Free food", "Holiday"], answer: "Teacher has powers" }
  ],
  library: [
    { q: "What is hidden?", options: ["A Lost Library", "A Lost City", "A Lost Dog"], answer: "A Lost Library" },
    { q: "Who are the authors?", options: ["Stead & Mass", "Rowling", "Tarshis"], answer: "Stead & Mass" }
  ]
};

/* ================== QUIZ HANDLING ================== */
const quizOverlay = $("#quiz-overlay");
const quizQuestions = $("#quiz-questions");
const quizSubmit = $("#quiz-submit");
const quizResult = $("#quiz-result");
const quizClose = $("#quiz-close");
let currentQuizBook = null;

function openQuiz(book) {
  currentQuizBook = book;
  quizOverlay.style.display = "flex";
  quizQuestions.innerHTML = "";
  quizResult.textContent = "";
  quizClose.style.display = "none";

  QUIZZES[book]?.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "quiz-option";
    div.innerHTML = `
      <p>${item.q}</p>
      ${item.options.map(opt => 
        `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`
      ).join("")}
    `;
    quizQuestions.appendChild(div);
  });
}

quizSubmit.addEventListener("click", () => {
  const quiz = QUIZZES[currentQuizBook];
  if (!quiz) return;
  let correct = 0;
  quiz.forEach((item, i) => {
    const chosen = document.querySelector(`input[name="q${i}"]:checked`);
    if (chosen && chosen.value === item.answer) correct++;
  });
  if (correct === quiz.length) {
    quizResult.textContent = "🎉 Correct! You passed!";
    celebrate(currentQuizBook);
  } else {
    quizResult.textContent = "❌ Some answers were wrong. Try again!";
  }
  quizClose.style.display = "inline-block";
});
quizClose.addEventListener("click", () => { quizOverlay.style.display = "none"; });

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
  el.addEventListener("touchstart", (e) => { 
    x0 = e.touches[0].clientX; 
  }, { passive: true });
  
  el.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    let dx = e.changedTouches[0].clientX - x0;
    if (dx < -30) onLeft();
    if (dx > 30) onRight();
    x0 = null;
  }, { passive: true });
}

// Enable swipe for all flipbooks
Object.keys(FLIPBOOKS).forEach(book => {
  addSwipe(FLIPBOOKS[book].wrapEl,
    () => nextPage(book),
    () => prevPage(book)
  );
});

/* ================== FRIENDS PANEL (TEAM NOTES) ================== */
const friendsBtn = document.getElementById("friends-toggle");
const friendsPanel = document.getElementById("friends-panel");
const notesArea = document.getElementById("team-notes");
const saveNotesBtn = document.getElementById("save-notes");
const teamDisplay = document.getElementById("team-name-display");

// Load saved notes
notesArea.value = localStorage.getItem("teamNotes") || "";
teamDisplay.textContent = localStorage.getItem("teamName") || "Unknown";

friendsBtn?.addEventListener("click", () => {
  friendsPanel.classList.toggle("open");
});

saveNotesBtn?.addEventListener("click", () => {
  localStorage.setItem("teamNotes", notesArea.value);
  alert("Notes saved!");
});

/* ================== DARK/LIGHT MODE ================== */
const modeBtn = document.getElementById("mode-toggle");
if (localStorage.getItem("ubc_mode") === "dark") {
  document.body.classList.add("dark-mode");
  if (modeBtn) modeBtn.textContent = "☀️ Light Mode";
}
modeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const dark = document.body.classList.contains("dark-mode");
  modeBtn.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("ubc_mode", dark ? "dark" : "light");
});

/* ================== LANGUAGE TOGGLE ================== */
const translations = {
  en: {
    splashTitle: "UBC 2025–2026",
    teamPromptSplash: "Edit your team name:",
    startBtn: "Start Adventure 🚀",
    pwTitle: "Enter Password",
    pwBtn: "Submit",
    mainTitle: "Ultimate Book Challenge 2025–2026",
    teamPromptMain: "Edit your team name below:"
  },
  es: {
    splashTitle: "UBC 2025–2026",
    teamPromptSplash: "Edita el nombre de tu equipo:",
    startBtn: "Comenzar Aventura 🚀",
    pwTitle: "Ingresar Contraseña",
    pwBtn: "Enviar",
    mainTitle: "Desafío de Libros 2025–2026",
    teamPromptMain: "Edita el nombre de tu equipo abajo:"
  }
};

function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

const langBtn = document.getElementById("lang-toggle");
let currentLang = localStorage.getItem("ubc_lang") || "en";
applyLanguage(currentLang);
if (langBtn) langBtn.textContent = currentLang === "en" ? "🌐 Español" : "🌐 English";

langBtn?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  localStorage.setItem("ubc_lang", currentLang);
  applyLanguage(currentLang);
  langBtn.textContent = currentLang === "en" ? "🌐 Español" : "🌐 English";
});
