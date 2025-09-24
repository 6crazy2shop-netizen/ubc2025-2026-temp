/* =========================================================
   UBC WEBSITE SCRIPT – FULL FEATURE BUILD
   ========================================================= */

/* ================== HELPERS ================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ================== TEAM NAME + FOOTER SYNC ================== */
const teamSplash = $("#team-name-splash");
const teamMain   = $("#team-name");
const footer     = $("#footer-text");
const teamNameDisplay = $("#team-name-display");

function updateTeamName(name) {
  if (!name) return;
  localStorage.setItem("teamName", name);
  if (teamSplash) teamSplash.value = name;
  if (teamMain)   teamMain.value   = name;
  if (footer) footer.textContent = `Created by Devarani Ponna · Educational Use Only · Team: ${name}`;
  if (teamNameDisplay) teamNameDisplay.textContent = name;
}
const savedTeam = localStorage.getItem("teamName");
if (savedTeam) updateTeamName(savedTeam);

/* ================== LOADING + SPLASH ================== */
const splash  = $("#splash-screen");
const loading = $("#loading-screen");
const startBtn= $("#start-btn");

window.addEventListener("load", () => {
  // small whoosh on load (will be ignored until user gesture on some browsers)
  $("#sound-whoosh")?.play?.();
  setTimeout(() => {
    loading.style.display = "none";
    splash.style.display  = "block";
  }, 1200);
});

startBtn?.addEventListener("click", () => {
  updateTeamName(teamSplash?.value || "");
  splash.style.display = "none";
  gate.style.display   = "block";
});
teamMain?.addEventListener("input", () => updateTeamName(teamMain.value));

/* ================== PASSWORD GATE ================== */
const pwBtn  = $("#pw-btn");
const input  = $("#password-input");
const err    = $("#error-message");
const main   = $("#main-content");
const gate   = $("#password-screen");

function unlock() { gate.style.display = "none"; main.style.display = "block"; }
function checkSaved() { if (sessionStorage.getItem("ubc_ok") === "1") unlock(); }
checkSaved();

pwBtn?.addEventListener("click", () => {
  const ok = (input.value || "").toLowerCase() === "ubc2025";
  if (ok) { sessionStorage.setItem("ubc_ok","1"); unlock(); }
  else { err.textContent = "Incorrect password. Try again."; }
});
input?.addEventListener("keydown", e => { if (e.key === "Enter") pwBtn.click(); });

/* ================== DARK/LIGHT MODE ================== */
const modeBtn = $("#mode-toggle");
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

/* ================== LANGUAGE TOGGLE (basic) ================== */
const langBtn = $("#lang-toggle");
let currentLang = localStorage.getItem("ubc_lang") || "en";
// We’ll swap only the obvious headings/buttons that exist in this markup.
// Safe no-op if element missing.
const translations = {
  en: {
    pageSoundsOn:"🔊 Page Sounds On", pageSoundsOff:"🔇 Page Sounds Off",
    dark:"🌙 Dark Mode", light:"☀️ Light Mode",
    friends:"👥 Friends",
  },
  es: {
    pageSoundsOn:"🔊 Sonidos de página activados",
    pageSoundsOff:"🔇 Sonidos de página desactivados",
    dark:"🌙 Modo Oscuro", light:"☀️ Modo Claro",
    friends:"👥 Amigos",
  }
};
function applyLangOnce(lang){
  // Controls
  if ($("#page-sound-toggle")) {
    $("#page-sound-toggle").textContent = pageSoundsMuted
      ? translations[lang].pageSoundsOff
      : translations[lang].pageSoundsOn;
  }
  if (modeBtn) {
    const dark = document.body.classList.contains("dark-mode");
    modeBtn.textContent = dark ? translations[lang].light : translations[lang].dark;
  }
  if ($("#friends-toggle")) $("#friends-toggle").textContent = translations[lang].friends;
}
applyLangOnce(currentLang);
if (langBtn) langBtn.textContent = currentLang === "en" ? "🌐 Español" : "🌐 English";
langBtn?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  localStorage.setItem("ubc_lang", currentLang);
  applyLangOnce(currentLang);
  langBtn.textContent = currentLang === "en" ? "🌐 Español" : "🌐 English";
});

/* ================== FRIENDS (NOTES) SIDEBAR ================== */
const friendsBtn = $("#friends-toggle");
const friendsPanel = $("#friends-panel");
const notesArea = $("#team-notes");
const saveNotesBtn = $("#save-notes");
notesArea && (notesArea.value = localStorage.getItem("teamNotes") || "");
teamNameDisplay && (teamNameDisplay.textContent = localStorage.getItem("teamName") || "");
friendsBtn?.addEventListener("click", () => friendsPanel.classList.toggle("open"));
saveNotesBtn?.addEventListener("click", () => {
  localStorage.setItem("teamNotes", notesArea.value);
  alert("Notes saved!");
});

/* ================== BACKGROUND FOCUS MUSIC ================== */
const bgTracks = {
  calm:  $("#bg-music-calm"),
  piano: $("#bg-music-piano"),
  beat:  $("#bg-music-beat"),
};
let currentBg = "calm";
function playBg(track) {
  Object.values(bgTracks).forEach(t => { if (t){ t.pause(); try{t.currentTime=0;}catch(_){} } });
  currentBg = track;
  bgTracks[track]?.play?.().catch(()=>{});
}
function fadeOut(audio, duration = 500) {
  if (!audio || audio.paused) return;
  let vol = audio.volume;
  const step = vol / (duration / 50);
  const fade = setInterval(() => {
    vol -= step;
    if (vol <= 0) {
      audio.pause();
      audio.volume = 1;
      clearInterval(fade);
    } else audio.volume = Math.max(0, vol);
  }, 50);
}
// Start bg music after first user interaction (autoplay policy)
document.addEventListener("click", () => playBg(currentBg), { once: true });

/* ================== PAGE SOUND TOGGLE + PAGE TURN ================== */
let pageSoundsMuted = false;
const pageSoundToggle = $("#page-sound-toggle");
pageSoundToggle?.addEventListener("click", () => {
  pageSoundsMuted = !pageSoundsMuted;
  const lang = currentLang;
  pageSoundToggle.textContent = pageSoundsMuted
    ? translations[lang].pageSoundsOff
    : translations[lang].pageSoundsOn;
});

function playPageTurn() {
  if (pageSoundsMuted) return;
  const turn = $("#sound-whoosh");
  if (!turn) return;
  // stop any ongoing turn sound
  turn.pause(); turn.currentTime = 0;

  fadeOut(bgTracks[currentBg], 300);
  turn.play().then(() => {
    // hard-stop at 5s
    setTimeout(() => {
      turn.pause();
      turn.currentTime = 0;
      playBg(currentBg);
    }, 5000);
  }).catch(()=>{});
}

/* ================== FIREWORKS (canvas) ================== */
const canvas = $("#fireworks");
const ctx = canvas.getContext("2d");
function fit() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", fit); fit();

function burst(x, y) {
  const parts = [];
  for (let i=0;i<120;i++){
    parts.push({
      x, y,
      vx: (Math.random()-0.5)*8,
      vy: (Math.random()-0.5)*8,
      r: Math.random()*2+1.8,
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
    t++; if(t<140) requestAnimationFrame(tick);
  }
  tick();
}

/* ================== CELEBRATION ================== */
function celebrate(theme) {
  const sound = document.getElementById(`sound-${theme}`);
  if (sound) {
    // stop all other non-looping sounds
    $$("audio").forEach(a => { if (a !== sound && !a.loop) a.pause(); });
    fadeOut(bgTracks[currentBg], 500);
    sound.currentTime = 0;
    sound.play().catch(()=>{});
    // stop after 5s, resume bg
    setTimeout(() => playBg(currentBg), 5000);
  }
  // confetti
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    document.body.appendChild(confetti);
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = `hsl(${Math.random()*360},100%,55%)`;
    confetti.style.animationDuration = 2 + Math.random() * 3 + "s";
    setTimeout(() => confetti.remove(), 5000);
  }
  burst(innerWidth / 2, innerHeight / 2);
}

/* ================== FLIPBOOKS (8 books) ================== */
const FLIPBOOKS = {
  rover:   { dir: "rover",          prefix: "Rover_",    total:  41, index: 1,
             imgEl: $("#rover-page"),   wrapEl: $("#rover-flipbook"),   progressEl: $("#rover-progress") },
  haven:   { dir: "haven",          prefix: "Haven_",    total: 138, index: 1,
             imgEl: $("#haven-page"),   wrapEl: $("#haven-flipbook"),   progressEl: $("#haven-progress") },
  cat:     { dir: "Cat_in_space",   prefix: "Cat_",      total: 320, index: 1,
             imgEl: $("#cat-page"),     wrapEl: $("#cat-flipbook"),     progressEl: $("#cat-progress") },
  storm:   { dir: "I_survived",     prefix: "Storm_",    total: 144, index: 1,
             imgEl: $("#storm-page"),   wrapEl: $("#storm-flipbook"),   progressEl: $("#storm-progress") },
  lotus:   { dir: "Lotus_island",   prefix: "Lotus_",    total: 160, index: 1,
             imgEl: $("#lotus-page"),   wrapEl: $("#lotus-flipbook"),   progressEl: $("#lotus-progress") },
  lemon:   { dir: "Mr.Lemoncello",  prefix: "Lemon_",    total: 336, index: 1,
             imgEl: $("#lemon-page"),   wrapEl: $("#lemon-flipbook"),   progressEl: $("#lemon-progress") },
  teacher: { dir: "Super_teacher",  prefix: "Teacher_",  total: 304, index: 1,
             imgEl: $("#teacher-page"), wrapEl: $("#teacher-flipbook"), progressEl: $("#teacher-progress") },
  library: { dir: "library",        prefix: "Library_",  total: 224, index: 1,
             imgEl: $("#library-page"), wrapEl: $("#library-flipbook"), progressEl: $("#library-progress") },
};

let autoplayTimer = null;

function preload(src) {
  const im = new Image();
  im.src = src;
  return im;
}

function updateFlipbook(story) {
  const fb = FLIPBOOKS[story];
  if (!fb) return;

  // Path the code expects: /dir/prefix{index}.png
  const base = `${fb.dir}/${fb.prefix}${fb.index}`;
  const srcPng = `${base}.png`;
  const srcPNG = `${base}.PNG`;

  // Try .png first, then fallback to .PNG to tolerate mixed cases
  const tryLoad = (src1, src2) => {
    fb.imgEl.onerror = () => {
      if (fb.imgEl.src.endsWith(src1) && src2) {
        fb.imgEl.src = src2; // try alternate case
      }
    };
    fb.imgEl.src = src1;
  };
  tryLoad(srcPng, srcPNG);

  // progress text
  if (fb.progressEl) fb.progressEl.textContent = `${fb.index} / ${fb.total}`;

  // smooth appearance (optional)
  fb.imgEl.classList.remove("show");
  fb.imgEl.onload = () => fb.imgEl.classList.add("show");

  // Preload neighbors
  if (fb.index < fb.total) preload(`${fb.dir}/${fb.prefix}${fb.index + 1}.png`);
  if (fb.index > 1)        preload(`${fb.dir}/${fb.prefix}${fb.index - 1}.png`);
}

function openFlipbook(story) {
  stopAutoplay();
  const fb = FLIPBOOKS[story];
  if (!fb) return;
  fb.index = 1;
  fb.wrapEl.style.display = "flex";
  updateFlipbook(story);
}
function closeFlipbook(story) {
  stopAutoplay();
  const fb = FLIPBOOKS[story];
  if (!fb) return;
  fb.wrapEl.style.display = "none";
}

function nextPage(story) {
  const fb = FLIPBOOKS[story];
  if (fb && fb.index < fb.total) {
    fb.index++;
    updateFlipbook(story);
    playPageTurn();
  } else if (fb && fb.index >= fb.total) {
    stopAutoplay();
    try { celebrate(story); } catch(_) {}
  }
}

function prevPage(story) {
  const fb = FLIPBOOKS[story];
  if (fb && fb.index > 1) {
    fb.index--;
    updateFlipbook(story);
    playPageTurn();
  }
}

function startAutoplay(story, ms = 3000) {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    const fb = FLIPBOOKS[story];
    if (!fb) { stopAutoplay(); return; }
    if (fb.index >= fb.total) {
      stopAutoplay();
      try { celebrate(story); } catch(_) {}
    } else {
      nextPage(story);
    }
  }, ms);
}
function stopAutoplay() {
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
}

/* ================== KEYBOARD & SWIPE SUPPORT ================== */
document.addEventListener("keydown", (e) => {
  // detect which overlay is open
  const openKey = Object.keys(FLIPBOOKS).find(k => FLIPBOOKS[k].wrapEl.style.display === "flex");
  if (!openKey) return;

  if (e.key === "ArrowRight") nextPage(openKey);
  if (e.key === "ArrowLeft")  prevPage(openKey);
  if (e.key === " " || e.key === "Spacebar") {
    if (autoplayTimer) stopAutoplay(); else startAutoplay(openKey);
    e.preventDefault();
  }
});

// Tiny swipe helper
function addSwipe(el, onLeft, onRight) {
  if (!el) return;
  let x0 = null;
  el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    let dx = e.changedTouches[0].clientX - x0;
    if (dx < -30) onLeft();
    if (dx >  30) onRight();
    x0 = null;
  }, { passive: true });
}
// attach swipe to all overlays
Object.keys(FLIPBOOKS).forEach(k => {
  const w = FLIPBOOKS[k].wrapEl;
  addSwipe(w, () => nextPage(k), () => prevPage(k));
});

/* ================== NICE TOUCH: add CSS fade-in to pages ================== */
(function injectFlipAnimation(){
  const css = `.flipbook-page{opacity:0;transform:translateX(8px);transition:opacity .3s ease, transform .3s ease;}
               .flipbook-page.show{opacity:1;transform:translateX(0);}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
