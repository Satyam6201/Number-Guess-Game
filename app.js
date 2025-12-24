const input = document.getElementById("guessInput");
const message = document.querySelector(".message");
const checkBtn = document.getElementById("checkBtn");
const hintBtn = document.getElementById("hintBtn");
const chancesEl = document.getElementById("chances");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const levelSelect = document.getElementById("level");

let maxRange = 100;
let number;
let chances = 10;
let score = 0;
let timer = 30;
let timerInterval;

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = highScore;

function setTheme(type) {
  if (type === "win")
    document.body.style.background =
      "linear-gradient(135deg,#00b09b,#96c93d)";
  else if (type === "lose")
    document.body.style.background =
      "linear-gradient(135deg,#ff416c,#ff4b2b)";
  else
    document.body.style.background =
      "linear-gradient(135deg,#667eea,#764ba2)";
}

function startGame() {
  number = Math.floor(Math.random() * maxRange) + 1;
  chances = 10;
  timer = 30;
  input.disabled = false;
  input.value = "";
  message.textContent = "Start guessing...";
  chancesEl.textContent = chances;
  setTheme("reset");
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = timer;

  timerInterval = setInterval(() => {
    timer--;
    document.getElementById("timer").textContent = timer;

    if (timer === 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function endGame(win) {
  input.disabled = true;
  checkBtn.textContent = "Replay";

  if (win) {
    message.textContent = "🎉 Correct! You win!";
    score += 10;
    setTheme("win");
    startConfetti();
  } else {
    message.textContent = `❌ You lost! Number was ${number}`;
    score -= 5;
    setTheme("lose");
  }

  scoreEl.textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreEl.textContent = highScore;
  }
}

checkBtn.addEventListener("click", () => {
  if (input.disabled) {
    checkBtn.textContent = "Check";
    startGame();
    return;
  }

  const guess = Number(input.value);
  if (!guess || guess < 1 || guess > maxRange) {
    message.textContent = `⚠ Enter 1–${maxRange}`;
    return;
  }

  chances--;
  chancesEl.textContent = chances;

  if (guess === number) {
    endGame(true);
  } else {
    message.textContent = guess > number ? "📈 Too High" : "📉 Too Low";
  }

  if (chances === 0 && guess !== number) {
    endGame(false);
  }
});

hintBtn.addEventListener("click", () => {
  const range = Math.floor(maxRange / 4);
  const min = Math.max(1, number - range);
  const max = Math.min(maxRange, number + range);
  message.textContent = `💡 Between ${min} and ${max}`;
});

levelSelect.addEventListener("change", () => {
  maxRange = Number(levelSelect.value);
  startGame();
});

startGame();

/* 🎊 Confetti */
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 6 + 4,
    speed: Math.random() * 5 + 2,
    color: `hsl(${Math.random() * 360},100%,50%)`
  }));

  const end = Date.now() + 3000;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;
      if (p.y > canvas.height) p.y = 0;
    });
    if (Date.now() < end) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}