/* =========================================================
   UBC WEBSITE SCRIPT – FINAL MERGED VERSION
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

/* ================== SCORING ================== */
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
function loadQuiz(story) {
  fetch(`quizzes/${story}_quiz.json`)
    .then(res => res.json())
    .then(data => { QUIZ_DATA[story] = data; })
    .catch(err => console.error(`⚠️ Quiz for ${story} not found`, err));
}
["Haven", "Rover", "Lotus", "Library", "Teacher", "Cat", "Lemoncello", "Survived"]
  .forEach(loadQuiz);

/* ================== REVIEW LOG ================== */
let REVIEW_LOG = JSON.parse(localStorage.getItem("reviewLog") || "[]");
function logMistake(question, chosen, correct, explanation, story, chapter) {
  const entry = { story, chapter, question, chosen, correct, explanation, timestamp: new Date().toISOString() };
  REVIEW_LOG.push(entry);
  localStorage.setItem("reviewLog", JSON.stringify(REVIEW_LOG));
}
function openReview() {
  const panel = document.getElementById("review-panel");
  const logDiv = document.getElementById("review-log");
  const log = JSON.parse(localStorage.getItem("reviewLog") || "[]");
  if (!log.length) {
    logDiv.innerHTML = "<p>No mistakes yet 🎉</p>";
  } else {
    logDiv.innerHTML = log.map(item => `
      <div class="review-item">
        <p><b>${item.story} – Chapter ${item.chapter}</b></p>
        <p>❓ ${item.question}</p>
        <p>❌ Your Answer: ${item.chosen}</p>
        <p>✅ Correct Answer: ${item.correct}</p>
        <p>💡 ${item.explanation}</p>
      </div><hr>
    `).join("");
  }
  panel.style.display = "block";
}
function closeReview() {
  document.getElementById("review-panel").style.display = "none";
}

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
        quizFeedback.innerHTML = `❌ Not quite… You can do it! 💪<br>
          Correct Answer: <b>${q.ans}</b><br>
          💡 ${q.explanation || "Remember this for next time!"}`;
        quizFeedback.classList.add("support-glow");
        setTimeout(() => quizFeedback.classList.remove("support-glow"), 2000);
        logMistake(q.q, opt, q.ans, q.explanation, story, chapter);
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
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
});

/* ================== CHAPTER BREAKS ================== */
const CHAPTER_BREAKS = {
  Haven: {
    1: 5, 2: 8, 3: 11, 4: 12, 5: 13, 6: 15, 7: 16, 8: 17,
    9: 19, 10: 24, 11: 26, 12: 27, 13: 33, 14: 34, 15: 36, 16: 37,
    17: 42, 18: 49, 19: 50, 20: 56, 21: 60, 22: 61, 23: 63, 24: 64,
    25: 66, 26: 68, 27: 71, 28: 74, 29: 77, 30: 80, 31: 81, 32: 82,
    33: 83, 34: 86, 35: 87, 36: 89, 37: 92, 38: 94, epilogue: 99
  },
  Rover: { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25, 6: 30, 7: 35, 8: 40, epilogue: 41 },
  Lotus: { 1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60, 7: 70, 8: 80, 9: 100, 10: 120, 11: 140, 12: 160 },
  Library: { 1: 15, 2: 30, 3: 45, 4: 60, 5: 75, 6: 90, 7: 120, 8: 150, 9: 180, 10: 200, 11: 224 },
  Teacher: { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100, 6: 120, 7: 150, 8: 180, 9: 210, 10: 240, 11: 270, 12: 304 },
  Cat: { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100, 6: 140, 7: 180, 8: 220, 9: 260, 10: 300, 11: 320 },
  Lemoncello: { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100, 6: 140, 7: 180, 8: 220, 9: 260, 10: 300, 11: 336 },
  Survived: { 1: 10, 2: 20, 3: 30, 4: 40, 5: 60, 6: 80, 7: 100, 8: 120, 9: 144 }
};

/* ================== FLIPBOOKS ================== */
const FLIPBOOKS = {
  haven: { dir: "haven", prefix: "Haven_", total: 101, index: 1,
    imgEl: document.getElementById("haven-page"),
    wrapEl: document.getElementById("haven-flipbook"),
    progressEl: document.getElementById("haven-progress") },
  rover: { dir: "rover", prefix: "Rover_", total: 41, index: 1,
    imgEl: document.getElementById("rover-page"),
    wrapEl: document.getElementById("rover-flipbook"),
    progressEl: document.getElementById("rover-progress") },
  lotus: { dir: "lotus", prefix: "Lotus_", total: 160, index: 1,
    imgEl: document.getElementById("lotus-page"),
    wrapEl: document.getElementById("lotus-flipbook"),
    progressEl: document.getElementById("lotus-progress") },
  library: { dir: "library", prefix: "Library_", total: 224, index: 1,
    imgEl: document.getElementById("library-page"),
    wrapEl: document.getElementById("library-flipbook"),
    progressEl: document.getElementById("library-progress") },
  teacher: { dir: "super_teacher", prefix: "Teacher_", total: 304, index: 1,
    imgEl: document.getElementById("teacher-page"),
    wrapEl: document.getElementById("teacher-flipbook"),
    progressEl: document.getElementById("teacher-progress") },
  cat: { dir: "cat_in_space", prefix: "Cat_", total: 320, index: 1,
    imgEl: document.getElementById("cat-page"),
    wrapEl: document.getElementById("cat-flipbook"),
    progressEl: document.getElementById("cat-progress") },
  lemon: { dir: "lemoncello", prefix: "Lemoncello_", total: 336, index: 1,
    imgEl: document.getElementById("lemon-page"),
    wrapEl: document.getElementById("lemon-flipbook"),
    progressEl: document.getElementById("lemon-progress") },
  storm: { dir: "i_survived", prefix: "Survived_", total: 144, index: 1,
    imgEl: document.getElementById("storm-page"),
    wrapEl: document.getElementById("storm-flipbook"),
    progressEl: document.getElementById("storm-progress") }
};

/* ================== FLIPBOOK FUNCTIONS ================== */
let autoplayTimer = null;

function preload(src) {
  const im = new Image();
  im.src = src;
  return im;
}

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
  fb.index = 1;
  fb.wrapEl.style.display = "flex";
  updateFlipbook(story);
}

function closeFlipbook(story) {
  stopAutoplay();
  FLIPBOOKS[story].wrapEl.style.display = "none";
}

function nextPage(story) {
  const fb = FLIPBOOKS[story];
  if (fb.index < fb.total) {
    fb.index++;
    updateFlipbook(story);
    playPageTurn();

    // 🎯 Auto-quiz trigger
    const breaks = CHAPTER_BREAKS[capitalize(story)];
    if (breaks) {
      for (let chapter in breaks) {
        if (fb.index === breaks[chapter]) {
          console.log(`✅ ${story} – Chapter ${chapter} complete → launching quiz`);
          showQuiz(capitalize(story), chapter);
        }
      }
    }
  } else {
    stopAutoplay();
    try { celebrate?.(story); } catch (e) {}
  }
}

function prevPage(story) {
  const fb = FLIPBOOKS[story];
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
    if (fb.index >= fb.total) {
      stopAutoplay();
      try { celebrate?.(story); } catch (e) {}
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

Object.keys(FLIPBOOKS).forEach(book => {
  addSwipe(FLIPBOOKS[book].wrapEl, () => nextPage(book), () => prevPage(book));
});

/* ================== READ ALOUD ================== */
function readAloud(text, lang="en-US") {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
