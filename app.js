const input = document.querySelector("input"),
  guess = document.querySelector(".guess"),
  checkButton = document.getElementById("checkBtn"),
  remainChances = document.querySelector(".chances"),
  scoreDisplay = document.querySelector(".score"),
  hintBtn = document.getElementById("hintBtn"),
  levelSelect = document.getElementById("level");

let randomNum, maxRange = 100, chance = 10, score = 0;

// 🎮 Initialize Game
const initGame = () => {
  randomNum = Math.floor(Math.random() * maxRange) + 1;
  chance = 10;
  input.disabled = false;
  remainChances.textContent = chance;
  guess.textContent = "";
  guess.style.color = "#fff";
  input.value = "";
  checkButton.textContent = "Check";
};
initGame();

// 🎚 Difficulty change
levelSelect.addEventListener("change", () => {
  maxRange = parseInt(levelSelect.value);
  initGame();
});

// 🔄 Reset game
const resetGame = () => { initGame(); };

// 💡 Hint
hintBtn.addEventListener("click", () => {
  if (randomNum % 2 === 0) {
    guess.textContent = "💡 Hint: The number is even!";
  } else {
    guess.textContent = "💡 Hint: The number is odd!";
  }
  guess.style.color = "#f1c40f";
});

// ✅ Check Guess
checkButton.addEventListener("click", () => {
  if (input.disabled) { resetGame(); return; }

  let inputValue = parseInt(input.value);

  if (!inputValue || inputValue < 1 || inputValue > maxRange) {
    guess.textContent = `⚠️ Enter a valid number between 1 and ${maxRange}`;
    guess.style.color = "#e74c3c";
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 500);
    return;
  }

  chance--;
  remainChances.textContent = chance;

  if (inputValue === randomNum) {
    guess.textContent = "🎉 Congrats! You found it!";
    guess.style.color = "#2ecc71";
    input.disabled = true;
    checkButton.textContent = "Replay";
    score += 10;
    scoreDisplay.textContent = score;
    startConfetti();
  } else if (inputValue > randomNum) {
    guess.textContent = "📈 Too high!";
    guess.style.color = "#fff";
  } else {
    guess.textContent = "📉 Too low!";
    guess.style.color = "#fff";
  }

  if (chance === 0 && inputValue !== randomNum) {
    guess.textContent = `❌ You lost! The number was ${randomNum}`;
    guess.style.color = "#e74c3c";
    input.disabled = true;
    checkButton.textContent = "Replay";
    score -= 5;
    scoreDisplay.textContent = score;
  }
});

// 🎊 Confetti Animation
function startConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;
  const confettiCanvas = document.getElementById("confetti");
  const ctx = confettiCanvas.getContext("2d");

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });

  const confettis = Array.from({ length: 150 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 10 + 5,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    tilt: Math.random() * 10 - 10
  }));

  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettis.forEach(c => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y, c.r, c.r);
      ctx.closePath();
    });
    update();
  }

  function update() {
    confettis.forEach(c => {
      c.y += c.d;
      c.x += Math.sin(c.tilt);
      if (c.y > confettiCanvas.height) {
        c.y = -10;
        c.x = Math.random() * confettiCanvas.width;
      }
    });
  }

  (function animate() {
    draw();
    if (Date.now() < end) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  })();
}
