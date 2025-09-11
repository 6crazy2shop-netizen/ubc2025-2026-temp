/* =========================================================
   UBC WEBSITE SCRIPT – FINAL VERSION
   Includes:
   - Team name + password gate
   - Background music (3 options + mute toggles)
   - Celebration effects (sounds, confetti, fireworks)
   - Quizzes + Flashcards
   - Avatars + Progress Tracker + Themes
   - Notes + Export + Peer Q&A
   - Mock Game Mode
   ========================================================= */

/* -----------------------------
   TEAM NAME + FOOTER SYNC
----------------------------- */
const teamSplash = document.getElementById("team-name-splash");
const teamMain = document.getElementById("team-name");
const footer = document.getElementById("footer-text");

function updateTeamName(name) {
  if (!name) return;
  localStorage.setItem("teamName", name);
  if (teamSplash) teamSplash.value = name;
  if (teamMain) teamMain.value = name;
  if (footer) footer.textContent = `Created by Devarani Ponna · Educational Use Only · Team: ${name}`;
}

// Load saved team name
const savedTeam = localStorage.getItem("teamName");
if (savedTeam) updateTeamName(savedTeam);

/* -----------------------------
   LOADING + SPLASH
----------------------------- */
const splash = document.getElementById("splash-screen");
const loading = document.getElementById("loading-screen");
const startBtn = document.getElementById("start-btn");
const gate = document.getElementById("password-screen");

window.addEventListener("load", () => {
  playEffect("sound-whoosh"); // intro effect
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

/* -----------------------------
   PASSWORD GATE
----------------------------- */
const pwBtn = document.getElementById("pw-btn");
const input = document.getElementById("password-input");
const err = document.getElementById("error-message");
const main = document.getElementById("main-content");

function unlock() { gate.style.display = "none"; main.style.display = "block"; }
function checkSaved() { if (sessionStorage.getItem("ubc_ok") === "1") unlock(); }
checkSaved();

pwBtn?.addEventListener("click", () => {
  const ok = (input.value || "").toLowerCase() === "ubc2025";
  if (ok) { sessionStorage.setItem("ubc_ok","1"); unlock(); }
  else { err.textContent = "Incorrect password. Try again."; }
});
input?.addEventListener("keydown", e => { if (e.key === "Enter") pwBtn.click(); });

/* -----------------------------
   CELEBRATION EFFECTS
----------------------------- */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
function fit() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", fit); fit();

function burst(x, y) {
  const parts = [];
  for (let i=0;i<100;i++){
    parts.push({
      x, y,
      vx: (Math.random()-0.5)*8,
      vy: (Math.random()-0.5)*8,
      r: Math.random()*2+1.5,
      a: 1,
      hue: Math.floor(Math.random()*360)
    });
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
    t++; if(t<120) requestAnimationFrame(tick);
  }
  tick();
}

function celebrate(theme) {
  playEffect(`sound-${theme}`);
  burst(innerWidth/2, innerHeight/2);
  // Confetti
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    document.body.appendChild(confetti);
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = randomConfettiColor(theme);
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
    setTimeout(() => confetti.remove(), 4000);
  }
}

function randomConfettiColor(theme) {
  const colors = {
    rover: ["#ff4d4d","#ff9999","#ff1a1a"],
    lotus: ["#33cc33","#66ff66","#009933"],
    haven: ["#ff66cc","#ff99cc","#ff3399"],
    library: ["#ffcc00","#ffdd66","#ffaa00"],
    teacher: ["#3366ff","#6699ff","#0033cc"],
    cat: ["#ff6600","#ff9933","#ffcc66"],
    lemon: ["#cc33ff","#9933ff","#cc99ff"],
    storm: ["#00ccff","#3399ff","#0066cc"]
  };
  const themeColors = colors[theme] || ["#ffffff"];
  return themeColors[Math.floor(Math.random()*themeColors.length)];
}

/* -----------------------------
   MUSIC SYSTEM
----------------------------- */
const musicTracks = {
  calm: document.getElementById("bg-music-calm"),
  piano: document.getElementById("bg-music-piano"),
  beat: document.getElementById("bg-music-beat")
};
let currentMusic = musicTracks.calm;
let currentEffect = null;
let fadeInterval = null;

window.addEventListener("click", () => {
  if (currentMusic.paused) {
    currentMusic.volume = 0.4;
    currentMusic.play().catch(err => console.log("Autoplay blocked:", err));
  }
}, { once: true });

function fadeAudio(audio, targetVolume, duration = 1000) {
  if (!audio) return;
  clearInterval(fadeInterval);
  const step = (targetVolume - audio.volume) / (duration / 50);
  fadeInterval = setInterval(() => {
    audio.volume = Math.min(Math.max(audio.volume + step, 0), 1);
    if ((step < 0 && audio.volume <= targetVolume) || (step > 0 && audio.volume >= targetVolume)) {
      clearInterval(fadeInterval);
      audio.volume = targetVolume;
    }
  }, 50);
}

function playEffect(id) {
  const effect = document.getElementById(id);
  if (!effect) return;
  if (currentEffect && !currentEffect.paused) {
    currentEffect.pause();
    currentEffect.currentTime = 0;
  }
  fadeAudio(currentMusic, 0.05, 800);
  effect.currentTime = 0;
  effect.volume = 1;
  effect.play();
  currentEffect = effect;
  setTimeout(() => {
    if (effect === currentEffect) {
      effect.pause(); effect.currentTime = 0;
      currentEffect = null;
      fadeAudio(currentMusic, 0.4, 1200);
    }
  }, 5000);
}

/* -----------------------------
   MUSIC SWITCHER + MUTE
----------------------------- */
const musicSelect = document.getElementById("music-select");
let savedMusic = localStorage.getItem("ubc_music") || "calm";
musicSelect.value = savedMusic;
currentMusic = musicTracks[savedMusic];

musicSelect.addEventListener("change", () => {
  const choice = musicSelect.value;
  localStorage.setItem("ubc_music", choice);
  fadeAudio(currentMusic, 0, 600);
  setTimeout(() => {
    currentMusic.pause(); currentMusic.currentTime = 0;
    currentMusic = musicTracks[choice];
    currentMusic.volume = 0;
    currentMusic.play();
    fadeAudio(currentMusic, 0.4, 1200);
  }, 600);
});

const musicToggle = document.getElementById("music-toggle");
let isMuted = localStorage.getItem("ubc_musicMuted") === "true";
function updateMusicToggleUI() {
  musicToggle.textContent = isMuted ? "🎶 Off" : "🎶 On";
}
if (isMuted) currentMusic.muted = true;
updateMusicToggleUI();
musicToggle.addEventListener("click", () => {
  isMuted = !isMuted;
  currentMusic.muted = isMuted;
  localStorage.setItem("ubc_musicMuted", isMuted);
  updateMusicToggleUI();
});

const globalToggle = document.getElementById("global-toggle");
let isGlobalMuted = localStorage.getItem("ubc_globalMuted") === "true";
function setGlobalMute(state) {
  isGlobalMuted = state;
  localStorage.setItem("ubc_globalMuted", state);
  document.querySelectorAll("audio").forEach(a => a.muted = state);
  globalToggle.textContent = state ? "🔇 Off" : "🔊 On";
}
setGlobalMute(isGlobalMuted);
globalToggle.addEventListener("click", () => setGlobalMute(!isGlobalMuted));

/* -----------------------------
   QUIZZES
----------------------------- */
const quizData = {
  rover: [
    { q: "Who is the main character in A Rover's Story?", options: ["A robot", "A cat", "A teacher"], a: 0 },
    { q: "Where does Rover go?", options: ["Moon", "Mars", "Library"], a: 1 }
  ],
  lotus: [
    { q: "Lotus Island heroes discover?", options: ["Cars", "Magic powers", "Pizza"], a: 1 }
  ]
};
let currentQuiz = [], quizIndex = 0, currentBook = null;

function startQuiz(book) {
  currentBook = book;
  currentQuiz = quizData[book] || [];
  quizIndex = 0;
  main.style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  loadQuiz();
}
function loadQuiz() {
  const q = currentQuiz[quizIndex];
  if (!q) return endQuiz();
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = `<h3>${q.q}</h3>`;
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    quizContainer.appendChild(btn);
  });
}
function checkAnswer(i) {
  const q = currentQuiz[quizIndex];
  if (i === q.a) { alert("✅ Correct!"); awardStar(); celebrate(currentBook); }
  else { alert("❌ Try again!"); }
  quizIndex++;
  loadQuiz();
}
function endQuiz() { document.getElementById("quiz-container").innerHTML = "<p>🎉 Quiz Complete!</p>"; }
function exitQuiz() { document.getElementById("quiz-section").style.display = "none"; main.style.display = "block"; }

/* -----------------------------
   FLASHCARDS
----------------------------- */
const flashcards = [
  { front: "Who is Rover?", back: "A robot rover on Mars" },
  { front: "What is Lotus Island?", back: "A magical place with heroes" }
];
let cardIndex = 0, flipped = false;
function startFlashcards() {
  main.style.display = "none";
  document.getElementById("flashcards-section").style.display = "block";
  showFlashcard();
}
function showFlashcard() {
  flipped = false;
  document.getElementById("flashcard-text").textContent = flashcards[cardIndex].front;
}
function flipFlashcard() {
  flipped = !flipped;
  document.getElementById("flashcard-text").textContent = flipped ? flashcards[cardIndex].back : flashcards[cardIndex].front;
}
function nextFlashcard() {
  cardIndex = (cardIndex+1) % flashcards.length;
  showFlashcard();
}
function exitFlashcards() { document.getElementById("flashcards-section").style.display = "none"; main.style.display = "block"; }

/* -----------------------------
   AVATARS + PROGRESS
----------------------------- */
const avatarSelect = document.getElementById("avatar-select");
const avatarDisplay = document.getElementById("avatar-display");
avatarSelect.value = localStorage.getItem("ubc_avatar") || "🚀";
avatarDisplay.textContent = avatarSelect.value;
avatarSelect.addEventListener("change", () => {
  localStorage.setItem("ubc_avatar", avatarSelect.value);
  avatarDisplay.textContent = avatarSelect.value;
});
let stars = parseInt(localStorage.getItem("ubc_stars") || "0");
document.getElementById("stars").textContent = stars;
function awardStar() {
  stars++;
  localStorage.setItem("ubc_stars", stars);
  document.getElementById("stars").textContent = stars;
}

/* -----------------------------
   THEME SWITCHER
----------------------------- */
const themes = ["default","space","jungle"];
let currentTheme = localStorage.getItem("ubc_theme") || "default";
document.body.classList.add(currentTheme);
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.remove(currentTheme);
  currentTheme = themes[(themes.indexOf(currentTheme)+1)%themes.length];
  document.body.classList.add(currentTheme);
  localStorage.setItem("ubc_theme", currentTheme);
});

/* -----------------------------
   NOTES + EXPORT + PEER Q&A
----------------------------- */
const notesArea = document.getElementById("team-notes");
notesArea.value = localStorage.getItem("teamNotes") || "";
document.getElementById("save-notes").addEventListener("click", () => {
  localStorage.setItem("teamNotes", notesArea.value);
  alert("Notes saved!");
});
document.getElementById("export-notes").addEventListener("click", () => {
  const notes = notesArea.value;
  const blob = new Blob([notes], { type:"text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "team-notes.txt";
  link.click();
});
const peerList = document.getElementById("peer-list");
let peerQuestions = JSON.parse(localStorage.getItem("peerQs") || "[]");
renderPeers();
document.getElementById("add-peer-question").addEventListener("click", () => {
  const q = document.getElementById("peer-question").value;
  const a = document.getElementById("peer-answer").value;
  if (!q || !a) return;
  peerQuestions.push({q,a});
  localStorage.setItem("peerQs", JSON.stringify(peerQuestions));
  renderPeers();
});
function renderPeers() {
  peerList.innerHTML = "";
  peerQuestions.forEach(qa => {
    const li = document.createElement("li");
    li.textContent = `${qa.q} → ${qa.a}`;
    peerList.appendChild(li);
  });
}

/* -----------------------------
   MOCK GAME MODE
----------------------------- */
let gameQuestions=[],gameIndex=0,score=0,timer;
function startGame() {
  gameQuestions = Object.values(quizData).flat().sort(()=>Math.random()-0.5).slice(0,10);
  gameIndex=0; score=0;
  main.style.display="none";
  document.getElementById("game-mode").style.display="block";
  loadGameQ();
}
function loadGameQ() {
  if (gameIndex >= gameQuestions.length) return endGame();
  const q = gameQuestions[gameIndex];
  document.getElementById("game-question").textContent = q.q;
  const opts = document.getElementById("game-options");
  opts.innerHTML = "";
  q.options.forEach((opt,i)=>{
    const btn=document.createElement("button");
    btn.textContent=opt;
    btn.onclick=()=>gameAnswer(i);
    opts.appendChild(btn);
  });
  startTimer();
}
function startTimer() {
  let time=10;
  const bar=document.getElementById("timer-bar");
  bar.style.width="100%"; bar.style.background="lime";
  timer=setInterval(()=>{
    time--; bar.style.width=(time*10)+"%";
    if(time<=0){ clearInterval(timer); gameIndex++; loadGameQ(); }
  },1000);
}
function gameAnswer(i) {
  clearInterval(timer);
  const q=gameQuestions[gameIndex];
  if (i===q.a) { score++; awardStar(); celebrate("rover"); }
  gameIndex++; loadGameQ();
}
function endGame() {
  document.getElementById("game-question").textContent="🎉 Game Over!";
  document.getElementById("game-options").innerHTML="";
  document.getElementById("game-score").textContent=`Score: ${score}/${gameQuestions.length}`;
}
function exitGame() {
  clearInterval(timer);
  document.getElementById("game-mode").style.display="none";
  main.style.display="block";
}

/* -----------------------------
   BOOK OVERLAY
----------------------------- */
const overlay=document.getElementById("book-overlay");
const overlayTitle=document.getElementById("book-title");
const overlayCover=document.getElementById("book-cover");
const overlaySummary=document.getElementById("book-summary");
const summaries={
  rover:"A robot rover explores Mars, learning about friendship and resilience.",
  lotus:"Young heroes discover magical powers on Lotus Island.",
  haven:"A brave cat sets out on a big adventure in the city.",
  library:"A mysterious lost library hides secrets waiting to be found.",
  teacher:"A teacher with surprising powers inspires students.",
  cat:"A cat astronaut has a wild space adventure (and pizza!).",
  lemon:"Kids solve puzzles to escape Mr. Lemoncello’s amazing library.",
  storm:"Surviving the great Galveston hurricane of 1900."
};
function openBook(book) {
  currentBook = book;
  overlay.classList.add("active");
  overlayTitle.textContent=document.querySelector(`[data-key='${book}Title']`).textContent;
  overlayCover.src=`${book}.jpg`;
  overlaySummary.textContent=summaries[book] || "Story coming soon.";
}
function closeBook() { overlay.classList.remove("active"); }
