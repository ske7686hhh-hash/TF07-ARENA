export const DEFAULT_TF07_GAME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>TF07 Arena</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #070913;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      color: #fff;
    }
    #gameCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
    }
    #uiLayer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
    }
    .hud-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .badge {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      color: #38bdf8;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hp-bar-wrap {
      width: 140px;
      height: 12px;
      background: rgba(15, 23, 42, 0.8);
      border-radius: 9999px;
      border: 1px solid rgba(239, 68, 68, 0.4);
      overflow: hidden;
    }
    .hp-bar-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #ef4444, #f97316);
      transition: width 0.15s ease-out;
    }
    .controls-overlay {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      padding-bottom: 8px;
    }
    .touch-pad {
      pointer-events: auto;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.5) 100%);
      border: 2px dashed rgba(56, 189, 248, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(56, 189, 248, 0.8);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      position: relative;
    }
    .touch-knob {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.7);
      position: absolute;
      transform: translate(0px, 0px);
      pointer-events: none;
    }
    .btn-fire {
      pointer-events: auto;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle, #f43f5e 0%, #be123c 100%);
      box-shadow: 0 0 20px rgba(244, 63, 94, 0.6);
      border: 2px solid rgba(254, 205, 211, 0.4);
      color: white;
      font-weight: 900;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      active: scale(0.95);
    }
    .btn-fire:active {
      transform: scale(0.92);
      box-shadow: 0 0 30px rgba(244, 63, 94, 0.9);
    }
    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(10, 15, 30, 0.92);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 24px;
      border-radius: 16px;
      text-align: center;
      pointer-events: auto;
      max-width: 320px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);
    }
    .modal h1 {
      font-size: 26px;
      color: #38bdf8;
      text-shadow: 0 0 16px rgba(56, 189, 248, 0.6);
      margin-bottom: 8px;
    }
    .modal p {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 18px;
      line-height: 1.4;
    }
    .btn-primary {
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.5);
      transition: all 0.2s;
    }
    .btn-primary:active {
      transform: scale(0.96);
    }
    #restartModal {
      display: none;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>

  <div id="uiLayer">
    <div class="hud-top">
      <div class="badge">
        <span>HP</span>
        <div class="hp-bar-wrap">
          <div class="hp-bar-fill" id="hpFill"></div>
        </div>
      </div>
      <div class="badge" id="scoreBadge">SCORE: 0</div>
      <div class="badge" id="waveBadge" style="color: #f59e0b; border-color: rgba(245, 158, 11, 0.3);">WAVE 1</div>
    </div>

    <div class="controls-overlay">
      <div class="touch-pad" id="joystickPad">
        <div class="touch-knob" id="joystickKnob"></div>
        MOVE
      </div>
      <div class="btn-fire" id="fireBtn">FIRE</div>
    </div>
  </div>

  <div class="modal" id="startModal">
    <h1>TF07 ARENA</h1>
    <p>Survive neon enemy waves in the cyberspace arena. Defend your core!</p>
    <button class="btn-primary" id="btnStartGame">START MISSION</button>
  </div>

  <div class="modal" id="restartModal">
    <h1 style="color: #ef4444;">MISSION FAILED</h1>
    <p id="finalScoreText">Final Score: 0</p>
    <button class="btn-primary" id="btnRestartGame">RETRY ARENA</button>
  </div>

  <script>
    // Audio synthesizer with Web Audio API (Zero external network dependencies)
    class SoundFx {
      constructor() {
        this.ctx = null;
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      laser() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }
      hit() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
      boom() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    }

    const sfx = new SoundFx();
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const hpFill = document.getElementById('hpFill');
    const scoreBadge = document.getElementById('scoreBadge');
    const waveBadge = document.getElementById('waveBadge');
    const startModal = document.getElementById('startModal');
    const restartModal = document.getElementById('restartModal');
    const finalScoreText = document.getElementById('finalScoreText');
    const btnStartGame = document.getElementById('btnStartGame');
    const btnRestartGame = document.getElementById('btnRestartGame');
    const fireBtn = document.getElementById('fireBtn');
    const joystickPad = document.getElementById('joystickPad');
    const joystickKnob = document.getElementById('joystickKnob');

    let width = 0;
    let height = 0;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // Game State
    let running = false;
    let score = 0;
    let wave = 1;
    let lastTime = 0;

    const player = {
      x: width / 2,
      y: height / 2,
      r: 18,
      speed: 240,
      hp: 100,
      maxHp: 100,
      angle: 0,
      dx: 0,
      dy: 0,
      lastShoot: 0,
      shootInterval: 180
    };

    let bullets = [];
    let enemies = [];
    let particles = [];
    let spawnTimer = 0;
    let isFiring = false;

    // Joystick logic
    let joyActive = false;
    let joyCenter = { x: 0, y: 0 };
    let joyTouchId = null;

    function handleJoyStart(touch) {
      joyActive = true;
      joyTouchId = touch.identifier;
      const rect = joystickPad.getBoundingClientRect();
      joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      handleJoyMove(touch);
    }

    function handleJoyMove(touch) {
      if (!joyActive) return;
      const dx = touch.clientX - joyCenter.x;
      const dy = touch.clientY - joyCenter.y;
      const dist = Math.hypot(dx, dy);
      const maxR = 40;
      const angle = Math.atan2(dy, dx);
      const clampedDist = Math.min(dist, maxR);
      
      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;
      joystickKnob.style.transform = \`translate(\${knobX}px, \${knobY}px)\`;

      if (dist > 5) {
        player.dx = Math.cos(angle);
        player.dy = Math.sin(angle);
        player.angle = angle;
      } else {
        player.dx = 0;
        player.dy = 0;
      }
    }

    function handleJoyEnd() {
      joyActive = false;
      joyTouchId = null;
      joystickKnob.style.transform = 'translate(0px, 0px)';
      player.dx = 0;
      player.dy = 0;
    }

    joystickPad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleJoyStart(e.changedTouches[0]);
    });

    window.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyTouchId) {
          handleJoyMove(e.changedTouches[i]);
          break;
        }
      }
    });

    window.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyTouchId) {
          handleJoyEnd();
          break;
        }
      }
    });

    // Keyboard support for desktop / dev testing
    const keys = {};
    window.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'f') isFiring = true;
    });
    window.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false;
      if (e.key === ' ' || e.key === 'f') isFiring = false;
    });

    // Mouse aiming support
    window.addEventListener('mousemove', (e) => {
      if (joyActive) return;
      const dx = e.clientX - player.x;
      const dy = e.clientY - player.y;
      player.angle = Math.atan2(dy, dx);
    });

    fireBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isFiring = true;
    });
    fireBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      isFiring = false;
    });
    fireBtn.addEventListener('mousedown', () => { isFiring = true; });
    window.addEventListener('mouseup', () => { isFiring = false; });

    function shootBullet() {
      const now = performance.now();
      if (now - player.lastShoot < player.shootInterval) return;
      player.lastShoot = now;
      sfx.laser();

      const speed = 550;
      bullets.push({
        x: player.x + Math.cos(player.angle) * player.r,
        y: player.y + Math.sin(player.angle) * player.r,
        vx: Math.cos(player.angle) * speed,
        vy: Math.sin(player.angle) * speed,
        r: 4,
        life: 1.8
      });
    }

    function spawnEnemy() {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) { x = Math.random() * width; y = -20; }
      else if (edge === 1) { x = width + 20; y = Math.random() * height; }
      else if (edge === 2) { x = Math.random() * width; y = height + 20; }
      else { x = -20; y = Math.random() * height; }

      const isFast = Math.random() < 0.25;
      enemies.push({
        x, y,
        r: isFast ? 13 : 18,
        hp: isFast ? 1 : 2 + Math.floor(wave / 2),
        speed: isFast ? 160 : 95 + wave * 5,
        color: isFast ? '#f59e0b' : '#ec4899',
        points: isFast ? 25 : 10
      });
    }

    function addExplosion(x, y, color, count = 14) {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 180;
        particles.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          r: 2 + Math.random() * 3,
          color,
          alpha: 1,
          decay: 1.2 + Math.random() * 1.5
        });
      }
    }

    function startGame() {
      sfx.init();
      running = true;
      score = 0;
      wave = 1;
      player.hp = 100;
      player.x = width / 2;
      player.y = height / 2;
      bullets = [];
      enemies = [];
      particles = [];
      spawnTimer = 0;
      scoreBadge.innerText = 'SCORE: 0';
      waveBadge.innerText = 'WAVE 1';
      hpFill.style.width = '100%';
      startModal.style.display = 'none';
      restartModal.style.display = 'none';
      lastTime = performance.now();
      requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      running = false;
      sfx.boom();
      finalScoreText.innerText = 'Final Arena Score: ' + score + ' (Wave ' + wave + ')';
      restartModal.style.display = 'block';
    }

    btnStartGame.addEventListener('click', startGame);
    btnRestartGame.addEventListener('click', startGame);

    function gameLoop(time) {
      if (!running) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update Player with keys if no touch
      if (!joyActive) {
        let kx = 0;
        let ky = 0;
        if (keys['w'] || keys['arrowup']) ky -= 1;
        if (keys['s'] || keys['arrowdown']) ky += 1;
        if (keys['a'] || keys['arrowleft']) kx -= 1;
        if (keys['d'] || keys['arrowright']) kx += 1;
        if (kx !== 0 || ky !== 0) {
          const l = Math.hypot(kx, ky);
          player.dx = kx / l;
          player.dy = ky / l;
          player.angle = Math.atan2(ky, kx);
        } else {
          player.dx = 0;
          player.dy = 0;
        }
      }

      player.x += player.dx * player.speed * dt;
      player.y += player.dy * player.speed * dt;
      player.x = Math.max(player.r, Math.min(width - player.r, player.x));
      player.y = Math.max(player.r, Math.min(height - player.r, player.y));

      if (isFiring) {
        shootBullet();
      }

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (b.life <= 0 || b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
          bullets.splice(i, 1);
        }
      }

      // Spawning
      spawnTimer += dt;
      const spawnInterval = Math.max(0.4, 1.8 - wave * 0.12);
      if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        spawnEnemy();
      }

      // Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const ang = Math.atan2(player.y - e.y, player.x - e.x);
        e.x += Math.cos(ang) * e.speed * dt;
        e.y += Math.sin(ang) * e.speed * dt;

        // Player Collision
        if (Math.hypot(player.x - e.x, player.y - e.y) < player.r + e.r) {
          sfx.hit();
          player.hp -= 15;
          hpFill.style.width = Math.max(0, (player.hp / player.maxHp) * 100) + '%';
          addExplosion(e.x, e.y, e.color, 12);
          enemies.splice(i, 1);
          if (player.hp <= 0) {
            gameOver();
            return;
          }
          continue;
        }

        // Bullet Collisions
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (Math.hypot(b.x - e.x, b.y - e.y) < b.r + e.r) {
            sfx.hit();
            e.hp -= 1;
            bullets.splice(j, 1);
            addExplosion(b.x, b.y, '#38bdf8', 6);
            if (e.hp <= 0) {
              sfx.boom();
              score += e.points;
              scoreBadge.innerText = 'SCORE: ' + score;
              if (score >= wave * 250) {
                wave++;
                waveBadge.innerText = 'WAVE ' + wave;
              }
              addExplosion(e.x, e.y, e.color, 16);
              enemies.splice(i, 1);
            }
            break;
          }
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // DRAWING
      ctx.fillStyle = '#070913';
      ctx.fillRect(0, 0, width, height);

      // Arena Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Bullets
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      for (const b of bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Enemies
      for (const e of enemies) {
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Neon Body
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, player.r, 0, Math.PI * 2);
      ctx.fill();

      // Barrel
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, -4, player.r + 10, 8);

      // Cockpit
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(0, 0, player.r * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Particles
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      requestAnimationFrame(gameLoop);
    }
  </script>
</body>
</html>
`;
