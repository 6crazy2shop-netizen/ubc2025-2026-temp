// ---- Password (case-insensitive), once-per-session via sessionStorage
const pwBtn = document.getElementById('pw-btn');
const input = document.getElementById('password-input');
const err = document.getElementById('error-message');
const main = document.getElementById('main-content');
const gate = document.getElementById('password-screen');

function unlock() { gate.style.display='none'; main.style.display='block'; }
function checkSaved() { if (sessionStorage.getItem('ubc_ok') === '1') unlock(); }
checkSaved();

pwBtn?.addEventListener('click', () => {
  const ok = (input.value || '').toLowerCase() === 'ubc2025';
  if (ok) { sessionStorage.setItem('ubc_ok','1'); unlock(); }
  else { err.textContent = 'Incorrect password. Try again.'; }
});
input?.addEventListener('keydown', (e)=>{ if(e.key==='Enter') pwBtn.click(); });

// ---- Simple fireworks on Celebrate
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
function fit() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', fit); fit();

function burst(x, y) {
  const parts = [];
  for (let i=0;i<110;i++){
    parts.push({
      x, y,
      vx: (Math.random()-0.5)*8,
      vy: (Math.random()-0.5)*8,
      r: Math.random()*2+1.8,
      a: 1,
      hue: Math.floor(Math.random()*360)
    });
  }
  let t = 0;
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.06; // gravity
      p.r *= 0.98;  p.a *= 0.97;
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(p.r,0),0,Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue},100%,55%,${p.a})`;
      ctx.fill();
    });
    t++; if (t<120) requestAnimationFrame(tick);
  }
  tick();
}

document.getElementById('celebrate-btn')?.addEventListener('click', ()=>{
  burst(innerWidth/2, innerHeight/2);
});
