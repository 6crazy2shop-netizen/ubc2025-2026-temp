// Password check
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

// Fireworks
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

// Celebrate with sound + confetti + fireworks
function celebrate(theme) {
  // Play sound
  const sound = document.getElementById(`sound-${theme}`);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }

  // Confetti burst
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    document.body.appendChild(confetti);
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = randomConfettiColor(theme);
    confetti.style.animationDuration = 2 + Math.random() * 3 + "s";
    setTimeout(() => confetti.remove(), 5000);
  }

  // Fireworks
  burst(innerWidth / 2, innerHeight / 2);
}

// Confetti colors per book
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
