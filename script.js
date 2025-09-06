// ================== TEAM NAME + FOOTER SYNC ==================
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

// ================== LOADING + SPLASH ==================
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

// ================== PASSWORD GATE ==================
const pwBtn = document.getElementById("pw-btn");
const input = document.getElementById("password-input");
const err = document.getElementById("error-message");
const main = document.getElementById("main-content");
const gate = document.getElementById("password-screen");

function unlock() { gate.style.display = "none"; main.style.display = "block"; }
function checkSaved() { if (sessionStorage.getItem("ubc_ok") === "1") unlock(); }
checkSaved();

pwBtn?.addEventListener("click", () => {
  const ok = (input.value || "").toLowerCase() === "ubc2025";
  if (ok) { sessionStorage.setItem("ubc_ok","1"); unlock(); }
  else { err.textContent = "Incorrect password. Try again."; }
});
input?.addEventListener("keydown", e => { if (e.key === "Enter") pwBtn.click(); });

// ================== FIREWORKS ==================
const canvas = document.getElementById("fireworks");
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

// ================== CELEBRATION ==================
function celebrate(theme) {
  const sound = document.getElementById(`sound-${theme}`);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
  // Confetti
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

// Confetti colors per theme
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

// Test Celebration button (splash)
document.getElementById("test-celebration")?.addEventListener("click", () => {
  const ta = Math.random() > 0.5 ? "sound-ta1" : "sound-ta2";
  const sound = document.getElementById(ta);
  if (sound) { sound.currentTime = 0; sound.play(); }
  celebrate("rover");
});

// ================== DARK/LIGHT MODE ==================
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

// ================== LANGUAGE TOGGLE ==================
const translations = {
  en: {
    splashTitle: "UBC 2025–2026",
    teamPromptSplash: "Edit your team name:",
    startBtn: "Start Adventure 🚀",
    testBtn: "Test Celebration 🎆",
    pwTitle: "Enter Password",
    pwBtn: "Submit",
    mainTitle: "Ultimate Book Challenge 2025–2026",
    teamPromptMain: "Edit your team name below:",
    roverTitle: "A Rover’s Story",
    roverBtn: "Celebrate Rover 🎆",
    lotusTitle: "Legends of Lotus Island",
    lotusBtn: "Celebrate Lotus 🌸",
    havenTitle: "Haven: A Small Cat’s Big Adventure",
    havenBtn: "Celebrate Haven 🐾",
    libraryTitle: "The Lost Library",
    libraryBtn: "Celebrate Library 📚",
    teacherTitle: "The Superteacher Project",
    teacherBtn: "Celebrate Teacher 🍎",
    catTitle: "The First Cat in Space Ate Pizza",
    catBtn: "Celebrate Cat 🚀",
    lemonTitle: "Escape from Mr. Lemoncello’s Library",
    lemonBtn: "Celebrate Lemoncello 🏆",
    stormTitle: "I Survived the Galveston Hurricane",
    stormBtn: "Celebrate Galveston 🌊"
  },
  es: {
    splashTitle: "UBC 2025–2026",
    teamPromptSplash: "Edita el nombre de tu equipo:",
    startBtn: "Comenzar Aventura 🚀",
    testBtn: "Probar Celebración 🎆",
    pwTitle: "Ingresar Contraseña",
    pwBtn: "Enviar",
    mainTitle: "Desafío de Libros 2025–2026",
    teamPromptMain: "Edita el nombre de tu equipo abajo:",
    roverTitle: "La Historia de Rover",
    roverBtn: "Celebrar Rover 🎆",
    lotusTitle: "Leyendas de la Isla del Loto",
    lotusBtn: "Celebrar Loto 🌸",
    havenTitle: "Haven: La Gran Aventura de un Pequeño Gato",
    havenBtn: "Celebrar Haven 🐾",
    libraryTitle: "La Biblioteca Perdida",
    libraryBtn: "Celebrar Biblioteca 📚",
    teacherTitle: "El Proyecto Superprofesor",
    teacherBtn: "Celebrar Profesor 🍎",
    catTitle: "El Primer Gato en el Espacio Comió Pizza",
    catBtn: "Celebrar Gato 🚀",
    lemonTitle: "Escape de la Biblioteca de Lemoncello",
    lemonBtn: "Celebrar Lemoncello 🏆",
    stormTitle: "Sobreviví al Huracán de Galveston",
    stormBtn: "Celebrar Galveston 🌊"
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
