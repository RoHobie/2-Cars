// Global variables
let globalScore = 0;
let highScore = 0;
let gameInstances = [];
let playAgainVisible = false;
let start = false;
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highscore');

// Local Storage
function loadHighScore() {
  const savedHighScore = localStorage.getItem('carGameHighScore');
  if (savedHighScore !== null) {
    highScore = parseInt(savedHighScore);
    highScoreElement.innerText = `High Score: ${highScore}`;
  }
}

function saveHighScore() {
  localStorage.setItem('carGameHighScore', highScore.toString());
}

// Game Logic
function updateGlobalScore() {
  globalScore++;
  scoreElement.innerText = `Score: ${globalScore}`;
  if (globalScore > highScore) {
    highScore = globalScore;
    highScoreElement.innerText = `High Score: ${highScore}`;
    saveHighScore();
  }
}

function endAllGames() {
  gameInstances.forEach(game => game.gameOver());
  if (globalScore > highScore) {
    highScore = globalScore;
    highScoreElement.innerText = `High Score: ${highScore}`;
    saveHighScore();
  }
  showPlayAgainButton();
}

function resetGame() {
  globalScore = 0;
  scoreElement.innerText = 'Score: 0';
  gameInstances.forEach(game => game.reset());
  playAgainVisible = false;
}

// UI Functions
function showPlayAgainButton(gameOverReason = 'crash') {
  if (!playAgainVisible) {
    playAgainVisible = true;
    const game1 = document.getElementById('game1');
    const game2 = document.getElementById('game2');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add(
      'fixed', 'z-20', 'flex', 'flex-col', 'items-center', 'justify-center',
      'opacity-0', 'transition-opacity', 'duration-500'
    );
    const game1Rect = game1.getBoundingClientRect();
    const game2Rect = game2.getBoundingClientRect();
    const combinedWidth = game1Rect.width + game2Rect.width;
    const leftPosition = game1Rect.left + (combinedWidth / 2);
    const topPosition = game1Rect.top + (game1Rect.height / 2);
    messageContainer.style.left = `${leftPosition}px`;
    messageContainer.style.top = `${topPosition}px`;
    messageContainer.style.transform = 'translate(-50%, -50%)';
    const createGameOverlay = (gameElement) => {
      const overlay = document.createElement('div');
      overlay.classList.add(
        'absolute', 'inset-0', 'bg-black', 'bg-opacity-75',
        'z-10', 'opacity-0', 'transition-opacity', 'duration-500'
      );
      if (window.getComputedStyle(gameElement).position !== 'relative') {
        gameElement.style.position = 'relative';
      }
      gameElement.appendChild(overlay);
      return overlay;
    };
    const overlay1 = createGameOverlay(game1);
    const overlay2 = createGameOverlay(game2);
    const messages = {
      'crash': {
        text: "Oops! You Crashed!",
        textClass: 'text-red-300 text-3xl mb-4 font-bold drop-shadow-[0_0_3px_red]'
      },
      'missed': {
        text: "Points Slipped Away!",
        textClass: 'text-yellow-300 text-3xl mb-4 font-bold drop-shadow-[0_0_3px_yellow]'
      },
      'default': {
        text: "Game Over!",
        textClass: 'text-cyan-200 text-3xl mb-4 font-bold drop-shadow-[0_0_3px_cyan]'
      }
    };
    const messageConfig = messages[gameOverReason] || messages['default'];
    const gameOverText = document.createElement('h2');
    gameOverText.textContent = messageConfig.text;
    gameOverText.classList.add(...messageConfig.textClass.split(' '));
    messageContainer.appendChild(gameOverText);
    const savedHighScore = parseInt(localStorage.getItem('carGameHighScore') || "0");
    if (globalScore >= savedHighScore) {
      const highScoreText = document.createElement('h2');
      highScoreText.textContent = "New High Score!!";
      highScoreText.classList.add('text-green-200', 'text-2xl', 'mb-4', 'font-bold', 'animate-bounce');
      messageContainer.appendChild(highScoreText);
    }
    const playPauseBtn = document.createElement('button');
    playPauseBtn.id = 'playPauseBtn';
    playPauseBtn.innerHTML = `<img src="/assets/play.svg" alt="Play" class="w-32 h-32 transition duration-300 hover:brightness-200 hover:drop-shadow-[0_0_5px_cyan]">`;
    playPauseBtn.addEventListener('click', () => {
      overlay1.classList.add('opacity-0');
      overlay2.classList.add('opacity-0');
      messageContainer.classList.add('opacity-0');
      setTimeout(() => {
        game1.removeChild(overlay1);
        game2.removeChild(overlay2);
        document.body.removeChild(messageContainer);
        resetGame();
        playAgainVisible = false;
      }, 500);
    });
    messageContainer.appendChild(playPauseBtn);
    document.body.appendChild(messageContainer);
    setTimeout(() => {
      overlay1.classList.remove('opacity-0');
      overlay2.classList.remove('opacity-0');
      messageContainer.classList.remove('opacity-0');
    }, 100);
  }
}

function showStartButton() {
  const overlay = document.createElement('div');
  overlay.id = 'start-game-overlay';
  overlay.classList.add(
    'fixed', 'inset-0', 'bg-black', 'bg-opacity-50',
    'flex', 'flex-col', 'justify-center', 'items-center',
    'z-10', 'opacity-0', 'transition-opacity', 'duration-500'
  );
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.remove('opacity-0'), 100);
  const gameContent = document.querySelector('.game-content');
  const gameRect = gameContent.getBoundingClientRect();
  const playPauseBtn = document.createElement('button');
  playPauseBtn.id = 'playPauseBtn';
  playPauseBtn.innerHTML = `<img src="/assets/play.svg" alt="Play" class="w-32 h-32 transition duration-300 hover:brightness-200 hover:drop-shadow-[0_0_5px_cyan]">`;
  playPauseBtn.style.position = 'absolute';
  playPauseBtn.style.left = `${gameRect.left + (gameRect.width / 2) - 64}px`;
  playPauseBtn.style.top = `${gameRect.top + (gameRect.height / 2) - 64}px`;
  playPauseBtn.addEventListener('click', startGameFlow);
  overlay.appendChild(playPauseBtn);
}

function startGameFlow() {
  const overlay = document.getElementById('start-game-overlay');
  if (overlay) overlay.remove();
  start = true;
  gameInstances.forEach(game => game.startGame());
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadHighScore();
  const game1 = new Game('game1', 'car1');
  const game2 = new Game('game2', 'car2');
  gameInstances = [game1, game2];
  showStartButton();
  document.addEventListener('keydown', (event) => {
    if (!playAgainVisible && start) {
      if (event.key === 'a' || event.key === 'ArrowLeft') {
        document.getElementById('car1').classList.toggle('left');
        document.getElementById('car1').classList.toggle('right');
      }
      if (event.key === 'd' || event.key === 'ArrowRight') {
        document.getElementById('car2').classList.toggle('left');
        document.getElementById('car2').classList.toggle('right');
      }
    }
  });
});

const game1Element = document.querySelector('#game1');
const game2Element = document.querySelector