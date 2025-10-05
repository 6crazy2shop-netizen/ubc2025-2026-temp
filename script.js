/* =========================================================
   UBC WEBSITE SCRIPT – FINAL MASTER VERSION
   Phase 1 + Phase 2 + Narration Ready
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

/* ================== PAGE TURN SOUND ================== */
function playPageTurn() {
  const turnSound = document.getElementById("sound-whoosh");
  if (!turnSound) return;
  fadeOut(bgTracks[currentBg], 300);
  turnSound.currentTime = 0;
  turnSound.play().then(() => {
    setTimeout(() => {
      playBg(currentBg);
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
    parts.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      r: Math.random() * 2 + 1.8,
      a: 1,
      hue: Math.floor(Math.random() * 360)
    });
  }
  let t = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06;
      p.r *= 0.98; p.a *= 0.97;
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
function randomConfettiColor(theme) {
  const colors = {
    rover: ["#ff4d4d", "#ff9999", "#ff1a1a"],
    lotus: ["#33cc33", "#66ff66", "#009933"],
    haven: ["#ff66cc", "#ff99cc", "#ff3399"],
    library: ["#ffcc00", "#ffdd66", "#ffaa00"],
    teacher: ["#3366ff", "#6699ff", "#0033cc"],
    cat: ["#ff6600", "#ff9933", "#ffcc66"],
    lemon: ["#cc33ff", "#9933ff", "#cc99ff"],
    storm: ["#00ccff", "#3399ff", "#0066cc"]
  };
  const themeColors = colors[theme] || ["#ffffff"];
  return themeColors[Math.floor(Math.random() * themeColors.length)];
}

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

/* ================== FLIPBOOK CORE (generic) ================== */
const FLIPBOOKS = {
  haven:  { dir: "haven",  prefix: "Haven_",  total: 120, index: 1,
            imgEl: document.getElementById("haven-page"),
            wrapEl: document.getElementById("haven-flipbook"),
            progressEl: document.getElementById("haven-progress") },
  rover:  { dir: "rover",  prefix: "Rover_",  total: 120, index: 1,
            imgEl: document.getElementById("rover-page"),
            wrapEl: document.getElementById("rover-flipbook"),
            progressEl: document.getElementById("rover-progress") },
  lotus:  { dir: "lotus",  prefix: "Lotus_",  total: 160, index: 1,
            imgEl: document.getElementById("lotus-page"),
            wrapEl: document.getElementById("lotus-flipbook"),
            progressEl: document.getElementById("lotus-progress") },
  library:{ dir: "library",prefix: "Library_",total: 224, index: 1,
            imgEl: document.getElementById("library-page"),
            wrapEl: document.getElementById("library-flipbook"),
            progressEl: document.getElementById("library-progress") },
  teacher:{ dir: "super_teacher", prefix:"Teacher_", total:304, index:1,
            imgEl: document.getElementById("teacher-page"),
            wrapEl: document.getElementById("teacher-flipbook"),
            progressEl: document.getElementById("teacher-progress") },
  cat:    { dir: "cat_in_space", prefix:"Cat_", total:320, index:1,
            imgEl: document.getElementById("cat-page"),
            wrapEl: document.getElementById("cat-flipbook"),
            progressEl: document.getElementById("cat-progress") },
  lemon:  { dir: "mr_lemoncello", prefix:"Lemoncello_", total:336, index:1,
            imgEl: document.getElementById("lemon-page"),
            wrapEl: document.getElementById("lemon-flipbook"),
            progressEl: document.getElementById("lemon-progress") },
  storm:  { dir: "i_survived", prefix:"Survived_", total:144, index:1,
            imgEl: document.getElementById("storm-page"),
            wrapEl: document.getElementById("storm-flipbook"),
            progressEl: document.getElementById("storm-progress") },
};

let autoplayTimer = null;

function preload(src) {
  const im = new Image();
  im.src = src;
  return im;
}

// NOTE: narration hook is appended in Part 3 (playNarration inside updateFlipbook)
function updateFlipbook(story) {
  const fb = FLIPBOOKS[story];
  const src = `${fb.dir}/${fb.prefix}${fb.index}.png`;

  if (!fb.imgEl) return;

  fb.imgEl.classList.remove("show");
  setTimeout(() => {
    fb.imgEl.src = src;
    fb.imgEl.onload = () => fb.imgEl.classList.add("show");
  }, 10);

  if (fb.progressEl) fb.progressEl.textContent = `${fb.index} / ${fb.total}`;

  if (fb.index < fb.total) preload(`${fb.dir}/${fb.prefix}${fb.index + 1}.png`);
  if (fb.index > 1) preload(`${fb.dir}/${fb.prefix}${fb.index - 1}.png`);
}

function openFlipbook(story) {
  stopAutoplay();
  const fb = FLIPBOOKS[story];
  if (!fb) return;
  fb.index = 1;
  if (fb.wrapEl) fb.wrapEl.style.display = "flex";
  updateFlipbook(story);
}

function closeFlipbook(story) {
  stopAutoplay();
  const fb = FLIPBOOKS[story];
  if (!fb) return;
  if (fb.wrapEl) fb.wrapEl.style.display = "none";
}

function nextPage(story) {
  const fb = FLIPBOOKS[story];
  if (!fb) return;
  if (fb.index < fb.total) {
    fb.index++;
    updateFlipbook(story);
    playPageTurn();
  } else {
    stopAutoplay();
    celebrate(story);
  }
}

function prevPage(story) {
  const fb = FLIPBOOKS[story];
  if (!fb) return;
  if (fb.index > 1) {
    fb.index--;
    updateFlipbook(story);
    playPageTurn();
  }
}

function startAutoplay(story, ms = 3000) {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    const fb = FLIPBOOKS[story];
    if (!fb) return stopAutoplay();
    if (fb.index >= fb.total) {
      stopAutoplay();
      celebrate(story);
    } else {
      nextPage(story);
    }
  }, ms);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

/* ================== KEYBOARD & SWIPE ================== */
document.addEventListener("keydown", (e) => {
  const active = Object.keys(FLIPBOOKS).find(k => FLIPBOOKS[k].wrapEl && FLIPBOOKS[k].wrapEl.style.display === "flex");
  if (!active) return;

  if (e.key === "ArrowRight") nextPage(active);
  if (e.key === "ArrowLeft") prevPage(active);
  if (e.key.toLowerCase() === " ") {
    if (autoplayTimer) stopAutoplay(); else startAutoplay(active);
    e.preventDefault();
  }
});

function addSwipe(el, onLeft, onRight) {
  if (!el) return;
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
Object.keys(FLIPBOOKS).forEach(k => {
  const fb = FLIPBOOKS[k];
  addSwipe(fb.wrapEl, () => nextPage(k), () => prevPage(k));
});

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
  en: { splashTitle:"UBC 2025–2026", teamPromptSplash:"Edit your team name:", startBtn:"Start Adventure 🚀",
        pwTitle:"Enter Password", pwBtn:"Submit", mainTitle:"Ultimate Book Challenge 2025–2026",
        teamPromptMain:"Edit your team name below:" },
  es: { splashTitle:"UBC 2025–2026", teamPromptSplash:"Edita el nombre de tu equipo:", startBtn:"Comenzar Aventura 🚀",
        pwTitle:"Ingresar Contraseña", pwBtn:"Enviar", mainTitle:"Desafío de Libros 2025–2026",
        teamPromptMain:"Edita el nombre de tu equipo abajo:" }
};
function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang]?.[key]) el.textContent = translations[lang][key];
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

/* Friends/Notes panel */
const friendsBtn = document.getElementById("friends-toggle");
const friendsPanel = document.getElementById("friends-panel");
const notesArea = document.getElementById("team-notes");
const saveNotesBtn = document.getElementById("save-notes");
const teamDisplay = document.getElementById("team-name-display");

if (notesArea) notesArea.value = localStorage.getItem("teamNotes") || "";
if (teamDisplay) teamDisplay.textContent = localStorage.getItem("teamName") || "Unknown";

friendsBtn?.addEventListener("click", () => friendsPanel?.classList.toggle("open"));
saveNotesBtn?.addEventListener("click", () => {
  localStorage.setItem("teamNotes", notesArea.value);
  alert("Notes saved!");
});

/* ================== QUIZ OVERLAY ================== */
const quizOverlay = document.getElementById("quiz-overlay");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.querySelector(".quiz-feedback");
const quizReadBtn = document.getElementById("quiz-read-btn");
const ohno = document.getElementById("sound-ohno");
const nextlevel = document.getElementById("sound-nextlevel");

let currentBook = null;
let currentChapter = 1;

function loadQuiz(bookName, onReady) {
  // From title-like → file name (Haven → Haven_quiz.json)
  const pretty = bookName.replace(/_/g," ");
  const base = pretty.replace(/\s+/g,"_");
  const path = `quizzes/${base}_quiz.json`;
  fetch(path).then(r => r.ok ? r.json() : null).then(json => {
    onReady(json);
  }).catch(()=> onReady(null));
}

function showQuiz(bookTitle, chapterLabel) {
  currentBook = (bookTitle || currentBook || "Haven").toLowerCase().replace(/\s+/g, "_");
  currentChapter = chapterLabel || currentChapter || 1;

  loadQuiz(bookTitle || "Haven", (data) => {
    let chapterKey = `chapter_${currentChapter}`;
    let questions = (data && data[chapterKey]) ? data[chapterKey] : [
      {
        question: `What is a main idea in ${bookTitle} – Chapter ${currentChapter}?`,
        options: ["Shows courage", "Pizza from space", "Build a rocket", "A dragon sleeps"],
        answer: 0,
        explanation: "This chapter focuses on bravery or learning."
      },
      {
        question: "Which of these best describes the mood?",
        options: ["Hopeful", "Silly", "Angry", "Sleepy"],
        answer: 0,
        explanation: "Tone is generally calm/hopeful for study focus."
      }
    ];
    runQuiz(bookTitle || "Haven", currentChapter, questions);
  });
}

function runQuiz(bookTitle, chapterLabel, questions) {
  let idx = 0;
  quizOverlay.style.display = "flex";
  renderQ();

  function renderQ() {
    const q = questions[idx];
    quizQuestion.textContent = q.question;
    quizOptions.innerHTML = "";
    quizFeedback.textContent = "";

    q.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.textContent = opt;
      b.addEventListener("click", ()=> {
        if (i === q.answer) {
          quizFeedback.textContent = "Great job! ✅";
          try { nextlevel?.play(); } catch(e){}
          setTimeout(()=> nextQ(), 800);
        } else {
          quizFeedback.textContent = `Oh no — not quite. ${q.explanation || ""}`;
          try { ohno?.play(); } catch(e){}
          logIncorrectAnswer(currentBook, chapterLabel, q.question);
        }
      });
      quizOptions.appendChild(b);
    });

    quizReadBtn.onclick = () => {
      const lang = (localStorage.getItem("ubc_lang")==="es") ? "es-ES" : "en-US";
      readAloud(q.question, lang);
    };
  }

  function nextQ() {
    idx++;
    if (idx < questions.length) {
      renderQ();
    } else {
      quizOverlay.style.display = "none";
      completeChapter();
    }
  }
}

/* ================== QUIZ LOGGING ================== */
function logIncorrectAnswer(book, chapter, questionText) {
  const quizLog = JSON.parse(localStorage.getItem("quizLog") || "{}");
  if (!quizLog[book]) quizLog[book] = [];
  quizLog[book].push({ chapter, question: questionText, date: new Date().toLocaleString() });
  localStorage.setItem("quizLog", JSON.stringify(quizLog));
}

/* ================== PROGRESS + BADGES ================== */
const progressTracker = document.getElementById("progress-tracker");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const badgeGrid = document.getElementById("badge-grid");

let bookProgress = JSON.parse(localStorage.getItem("bookProgress") || "{}");

function initProgress(bookKey, totalChapters) {
  if (!bookProgress[bookKey]) {
    bookProgress[bookKey] = { chaptersDone: 0, totalChapters, badges: [] };
    saveProgress();
  } else {
    bookProgress[bookKey].totalChapters = totalChapters;
    saveProgress();
  }
  if (progressTracker) progressTracker.style.display = "block";
  updateProgressUI(bookKey);
}

function completeChapter() {
  const prog = bookProgress[currentBook];
  if (!prog) return;
  prog.chaptersDone = Math.min((prog.chaptersDone||0) + 1, prog.totalChapters);
  saveProgress();
  updateProgressUI(currentBook);

  const percent = Math.round((prog.chaptersDone / prog.totalChapters) * 100);
  if (percent === 100) { awardBadge(); celebrate(currentBook); }
}

function awardBadge() {
  const prog = bookProgress[currentBook]; if (!prog) return;

  const bookBadges = {
    haven: "🐾 Haven Hero",
    rover: "🚀 Rover Explorer",
    lotus: "🌸 Lotus Guardian",
    super_teacher: "🍎 Superteacher Star",
    cat_in_space: "🍕 Cosmic Cat",
    mr_lemoncello: "🏆 Lemoncello Legend",
    library: "📚 Library Detective",
    i_survived: "🌊 Survivor Champion"
  };
  const badgeText = bookBadges[currentBook] || "⭐ Story Star";
  const dateEarned = new Date().toLocaleString();

  if (!prog.badges.find(b => (b.name||b) === badgeText)) {
    prog.badges.push({ name: badgeText, date: dateEarned });
    saveProgress();
    showBadge(badgeText);
    document.getElementById("sound-nextlevel")?.play();
  }
}

function updateProgressUI(bookKey) {
  const prog = bookProgress[bookKey]; if (!prog) return;
  const percent = Math.round((prog.chaptersDone / prog.totalChapters) * 100);
  if (progressBar) progressBar.style.width = percent + "%";
  if (progressText) progressText.textContent = `${percent}% Complete`;
  if (badgeGrid) {
    badgeGrid.innerHTML = "";
    (prog.badges||[]).forEach(b => showBadge(b.name || b));
  }
}

function showBadge(label) {
  const el = document.createElement("div");
  el.className = "badge";
  el.innerHTML = `<span>${label.split(" ")[0]}</span><small>${label.split(" ").slice(1).join(" ")}</small>`;
  badgeGrid?.appendChild(el);
}

function saveProgress() {
  localStorage.setItem("bookProgress", JSON.stringify(bookProgress));
}

/* ================== BADGE SHELF + TIMELINE ================== */
const badgeShelf = document.getElementById("badge-shelf");
const shelfGrid  = document.getElementById("shelf-grid");
const viewBadges = document.getElementById("view-badges");
const backToMain = document.getElementById("back-to-main");

viewBadges?.addEventListener("click", () => showBadgeShelf());
backToMain?.addEventListener("click", () => {
  if (badgeShelf) badgeShelf.style.display = "none";
  if (progressTracker) progressTracker.style.display = "block";
});

function titleize(s) {
  return (s || "").replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase());
}

function showBadgeShelf() {
  if (progressTracker) progressTracker.style.display = "none";
  if (badgeShelf) badgeShelf.style.display = "block";
  if (shelfGrid) shelfGrid.innerHTML = "";
  const timeline = document.getElementById("timeline");
  if (timeline) timeline.innerHTML = "";

  const allProgress = JSON.parse(localStorage.getItem("bookProgress") || "{}");
  const entries = [];

  for (const [book, data] of Object.entries(allProgress)) {
    (data.badges || []).forEach(b => {
      const name = b.name || b;
      const date = b.date || "Date unknown";
      const el = document.createElement("div");
      el.className = "shelf-badge";
      const [emoji, ...words] = name.split(" ");
      el.innerHTML = `<span>${emoji}</span><small>${words.join(" ")}</small>`;
      shelfGrid?.appendChild(el);
      entries.push({ name, date });
    });
  }

  entries.sort((a,b)=> new Date(b.date) - new Date(a.date));
  if (entries.length) {
    entries.forEach(e => {
      const t = document.createElement("div");
      t.className = "timeline-entry";
      t.innerHTML = `<h4>${e.name}</h4><small>${e.date}</small>`;
      timeline?.appendChild(t);
    });
  } else {
    if (shelfGrid) shelfGrid.innerHTML = "<p>No badges earned yet. Keep reading! 📖✨</p>";
  }
}

/* ================== PARENT DASHBOARD (hooks) ================== */
const parentDash = document.getElementById("parent-dashboard");
const viewParentBtn = document.getElementById("view-parent-dashboard");
const backToBadges = document.getElementById("back-to-badges");

viewParentBtn?.addEventListener("click", () => {
  if (badgeShelf) badgeShelf.style.display = "none";
  if (parentDash) parentDash.style.display = "block";
  buildParentDashboard();
});
backToBadges?.addEventListener("click", () => {
  if (parentDash) parentDash.style.display = "none";
  if (badgeShelf) badgeShelf.style.display = "block";
});

function buildParentDashboard() {
  const totalBooksEl = document.getElementById("total-books");
  const totalChaptersEl = document.getElementById("total-chapters");
  const totalWordsEl = document.getElementById("total-words");
  const totalHoursEl = document.getElementById("total-hours");
  const tableBody = document.querySelector("#book-summary tbody");
  const troubleList = document.getElementById("trouble-list");

  const progress = JSON.parse(localStorage.getItem("bookProgress") || "{}");
  const quizLog = JSON.parse(localStorage.getItem("quizLog") || "{}");

  let booksCompleted = 0, chaptersRead = 0, words = 0, hours = 0;
  if (tableBody) tableBody.innerHTML = "";
  if (troubleList) troubleList.innerHTML = "";

  for (const [book, data] of Object.entries(progress)) {
    const chapters = data.chaptersDone || 0;
    const total = data.totalChapters || 1;
    const percent = Math.round((chapters / total) * 100);
    const status = percent >= 100 ? "✅ Completed" : "In Progress";

    if (percent >= 100) booksCompleted++;
    chaptersRead += chapters;

    // Estimate words/hours from scene arrays if loaded (optional)
    const sceneVar = window[`SCENES_${book.toUpperCase()}`];
    if (sceneVar) {
      words += sceneVar.reduce((sum, s) => sum + (s.caption?.split(" ").length || 0), 0);
      hours += sceneVar.reduce((sum, s) => sum + (s.readTime || 0), 0) / 3600;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${titleize(book)}</td>
      <td>${chapters} / ${total}</td>
      <td>${percent}%</td>
      <td>${status}</td>`;
    tableBody?.appendChild(row);
  }

  if (totalBooksEl) totalBooksEl.textContent = booksCompleted;
  if (totalChaptersEl) totalChaptersEl.textContent = chaptersRead;
  if (totalWordsEl) totalWordsEl.textContent = words.toLocaleString();
  if (totalHoursEl) totalHoursEl.textContent = hours.toFixed(2);

  for (const [book, mistakes] of Object.entries(quizLog)) {
    mistakes.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${titleize(book)}: Chapter ${item.chapter} – “${item.question.slice(0,60)}...”`;
      troubleList?.appendChild(li);
    });
  }
  if (troubleList && !troubleList.children.length) {
    troubleList.innerHTML = "<li>No incorrect answers recorded yet. Great job! 🌟</li>";
  }
}

/* ================== READ-ALOUD (TTS) ================== */
function readAloud(text, lang = "en-US") {
  if (!("speechSynthesis" in window)) return alert("Speech not supported in this browser.");
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  msg.rate = 1;
  msg.pitch = 1;
  msg.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

/* ================== PAGE-BY-PAGE NARRATION ================== */
function playNarration(story, pageIndex) {
  try {
    // Stop any existing narration
    document.querySelectorAll(".narration-audio").forEach(a => {
      a.pause();
      a.remove();
    });

    const src = `narration/${story}/${story}_${pageIndex}.mp3`;
    const audio = new Audio(src);
    audio.className = "narration-audio";
    audio.volume = 0.9;

    // Fade background music
    if (bgTracks[currentBg]) fadeOut(bgTracks[currentBg], 400);

    audio.onended = () => {
      playBg(currentBg); // resume music
      if (movieModeActive) nextPage(story); // auto-turn page if movie mode
    };

    audio.play().catch(() => {
      playBg(currentBg);
    });
    document.body.appendChild(audio);
  } catch (err) {
    console.warn("Narration error:", err);
  }
}

/* Hook narration into updateFlipbook override */
const originalUpdate = updateFlipbook;
updateFlipbook = function (story) {
  originalUpdate(story);
  playNarration(story, FLIPBOOKS[story].index);
};

/* ================== MOVIE-MODE ================== */
let movieModeActive = false;
const movieBtn = document.getElementById("movie-mode-toggle");

movieBtn?.addEventListener("click", () => {
  movieModeActive = !movieModeActive;
  movieBtn.textContent = movieModeActive ? "🎬 Stop Movie" : "🎥 Play Story";
  if (movieModeActive) startMovie();
  else stopMovie();
});

function startMovie() {
  const activeBook = Object.keys(FLIPBOOKS).find(k => FLIPBOOKS[k].wrapEl.style.display === "flex");
  if (!activeBook) return alert("Open a book first.");
  const fb = FLIPBOOKS[activeBook];
  fb.index = 1;
  updateFlipbook(activeBook);
}

function stopMovie() {
  movieModeActive = false;
  document.querySelectorAll(".narration-audio").forEach(a => { a.pause(); a.remove(); });
  playBg(currentBg);
}

/* ================== SAFE EXIT + RESET ================== */
window.addEventListener("beforeunload", () => {
  try { window.speechSynthesis.cancel(); } catch(e){}
  stopAutoplay();
});

/* ================== EXPORT UTILITIES (Optional CSV/PDF) ================== */
function exportQuizLogCSV() {
  const quizLog = JSON.parse(localStorage.getItem("quizLog") || "{}");
  let csv = "Book,Chapter,Question,Date\n";
  for (const [book, arr] of Object.entries(quizLog)) {
    arr.forEach(i => csv += `"${book}",${i.chapter},"${i.question.replace(/"/g,'""')}",${i.date}\n`);
  }
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "UBC_QuizLog.csv";
  a.click();
}

/* Optional: attach to a button id="export-quizlog" */
document.getElementById("export-quizlog")?.addEventListener("click", exportQuizLogCSV);

/* ================== END OF SCRIPT ================== */
console.log("%cUBC 2025–2026 Script Loaded Successfully ✅", "color:#3366ff;font-weight:bold;");
