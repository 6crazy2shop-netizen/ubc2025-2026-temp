/* =========================================================
   UBC WEBSITE SCRIPT – FINAL VERSION WITH QUIZ LOADER
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

/* ================== PAGE TURN SOUND ================== */
function playPageTurn() {
  const turnSound = document.getElementById("sound-whoosh");
  if (!turnSound) return;
  fadeOut(bgTracks[currentBg], 300);
  turnSound.pause();
  turnSound.currentTime = 0;
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
function fit() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", fit); fit();
function burst(x, y) {
  const parts = [];
  for (let i = 0; i < 120; i++) {
    parts.push({ x, y,
      vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8,
      r: Math.random()*2+1.8, a: 1,
      hue: Math.floor(Math.random()*360) });
  }
  let t=0;
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.06;
      p.r *= 0.98; p.a *= 0.97;
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(p.r,0),0,Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue},100%,55%,${p.a})`;
      ctx.fill();
    });
    t++; if(t<140) requestAnimationFrame(tick);
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

/* ================== SCORING SYSTEM ================== */
let playerScore = 0;
function updateScore(points) {
  playerScore += points;
  document.getElementById("scoreboard").textContent = "Score: " + playerScore;
  checkMilestone();
}
function checkMilestone() {
  if (playerScore > 0 && playerScore % 50 === 0) {
    document.getElementById("sound-nextlevel").play();

    const scoreboard = document.getElementById("scoreboard");
    scoreboard.classList.add("level-up");

    setTimeout(() => scoreboard.classList.remove("level-up"), 3000);

    alert("🎉 Next Level! You’ve earned " + playerScore + " points!");
  }
}

/* ================== QUIZ LOADER ================== */
let QUIZ_DATA = {};

// Load quiz JSON for a given book
function loadQuiz(story) {
  fetch(`quizzes/${story}_quiz.json`)
    .then(res => res.json())
    .then(data => {
      QUIZ_DATA[story] = data;
      console.log(`✅ Loaded quiz for ${story}`);
    })
    .catch(err => console.error(`⚠️ Quiz for ${story} not found`, err));
}

// Preload all quizzes
["Haven", "Rover", "Lotus", "Library", "Teacher", "Cat", "Lemoncello", "Survived"]
  .forEach(loadQuiz);

/* ================== QUIZ SYSTEM ================== */
const quizOverlay = document.getElementById("quiz-overlay");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const quizReadBtn = document.getElementById("quiz-read-btn");

function showQuiz(story, chapter = "1") {
  const questions = QUIZ_DATA[story]?.[chapter];
  if (!questions) {
    alert(`No quiz available yet for ${story}, Chapter ${chapter}`);
    return;
  }

  // Pick a random question
  const q = questions[Math.floor(Math.random() * questions.length)];

  quizOverlay.style.display = "flex";
  quizQuestion.textContent = q.q;
  quizOptions.innerHTML = "";

  q.opts.forEach(opt => {
    const b = document.createElement("button");
    b.textContent = opt;
    b.onclick = () => {
      if (opt === q.ans) {
        quizFeedback.textContent = "✅ Correct!";
        updateScore(10);

        document.getElementById("sound-nextlevel").play();
        celebrate(story);

        const lights = document.createElement("div");
        lights.className = "dance-lights";
        document.body.appendChild(lights);
        setTimeout(() => lights.remove(), 3000);

      } else {
        document.getElementById("sound-ohno").play();
        quizFeedback.textContent = "❌ Not quite… You can do it! 💪 Try again!";
        quizFeedback.classList.add("support-glow");
        setTimeout(() => quizFeedback.classList.remove("support-glow"), 2000);
      }
    };
    quizOptions.appendChild(b);
  });

  quizFeedback.textContent = "";
}

function closeQuiz() { quizOverlay.style.display = "none"; }

quizReadBtn?.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(quizQuestion.textContent);
  utterance.lang = (localStorage.getItem("ubc_lang") === "es") ? "es-ES" : "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
});

/* ================== READ ALOUD ================== */
let BOOK_TEXTS = { haven: {} };
fetch("Haven_text_from_docx.json")
  .then(res => res.json())
  .then(data => BOOK_TEXTS.haven = data);

function readAloud(story) {
  const fb = FLIPBOOKS[story];
  if (!fb) return;
  const pageNum = fb.index.toString();
  const text = BOOK_TEXTS[story]?.[pageNum] || `Page ${fb.index}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = (localStorage.getItem("ubc_lang") === "es") ? "es-ES" : "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

/* ================== LANGUAGE + DARK MODE + FRIENDS ================== */
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

const translations = {
  en: { splashTitle:"UBC 2025–2026", startBtn:"Start Adventure 🚀" },
  es: { splashTitle:"UBC 2025–2026", startBtn:"Comenzar Aventura 🚀" }
};
function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) el.textContent = translations[lang][key];
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

/* ================== FRIENDS PANEL ================== */
const friendsBtn = document.getElementById("friends-toggle");
const friendsPanel = document.getElementById("friends-panel");
const notesArea = document.getElementById("team-notes");
const saveNotesBtn = document.getElementById("save-notes");
const teamDisplay = document.getElementById("team-name-display");
notesArea.value = localStorage.getItem("teamNotes") || "";
teamDisplay.textContent = localStorage.getItem("teamName") || "Unknown";
friendsBtn?.addEventListener("click", () => { friendsPanel.classList.toggle("open"); });
saveNotesBtn?.addEventListener("click", () => {
  localStorage.setItem("teamNotes", notesArea.value);
  alert("Notes saved!");
});

/* ================== END OF SCRIPT ================== */
