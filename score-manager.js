
// Global variables
let globalScore = 0;
let highScore = 0;
let gameInstances = [];
let playAgainVisible = false;
let start = false; // New flag for game start
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highscore');

// Load high score from localStorage when the page loads
function loadHighScore() {
  const savedHighScore = localStorage.getItem('carGameHighScore');
  if (savedHighScore !== null) {
    highScore = parseInt(savedHighScore);
    highScoreElement.innerText = `High Score: ${highScore}`;
  }
}

// Save high score to localStorage
function saveHighScore() {
  localStorage.setItem('carGameHighScore', highScore.toString());
}

function updateGlobalScore() {
  globalScore++;
  scoreElement.innerText = `Score: ${globalScore}`;
  
  // Check if current score is higher than the high score
  if (globalScore > highScore) {
    highScore = globalScore;
    highScoreElement.innerText = `High Score: ${highScore}`;
    saveHighScore(); // Save to localStorage when high score is beaten
  }
}

function endAllGames() {
  gameInstances.forEach(game => game.gameOver());
  
  // Check for new high score at game over
  if (globalScore > highScore) {
    highScore = globalScore;
    highScoreElement.innerText = `High Score: ${highScore}`;
    saveHighScore();
  }
  
  showPlayAgainButton();
}

function showPlayAgainButton(gameOverReason = 'crash') {
  if (!playAgainVisible) {
     playAgainVisible = true;
     const overlay = document.createElement('div');
     overlay.id = 'game-over-overlay';
     overlay.classList.add(
         'absolute', 'inset-0', 'bg-black', 'bg-opacity-75',
         'flex', 'flex-col', 'justify-center', 'items-center',
         'z-10', 'opacity-0', 'transition-opacity', 'duration-500'
     );
 
     // Custom messages based on game over reason
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
 
     // Select message based on game over reason
     const messageConfig = messages[gameOverReason] || messages['default'];
     const gameOverText = document.createElement('h2');
     gameOverText.textContent = messageConfig.text;
     gameOverText.classList.add(...messageConfig.textClass.split(' '));
     overlay.appendChild(gameOverText);
 
     // High Score Check
     const savedHighScore = parseInt(localStorage.getItem('carGameHighScore') || "0");
     if (globalScore >= savedHighScore) {
         const highScoreText = document.createElement('h2');
         highScoreText.textContent = "New High Score!!";
         highScoreText.classList.add('text-green-200', 'text-2xl', 'mb-4', 'font-bold', 'animate-bounce');
         overlay.appendChild(highScoreText);
     }
 
     // Play Again Button
     const playPauseBtn = document.createElement('button');
     playPauseBtn.id = 'playPauseBtn';
     playPauseBtn.innerHTML = `<img src="/assets/play.svg" alt="Play" class="w-32 h-32 transition duration-300 hover:brightness-200 hover:drop-shadow-[0_0_5px_cyan]">`;
     playPauseBtn.addEventListener('click', () => {
         overlay.classList.add('opacity-0'); // Fade-out effect
         setTimeout(() => {
             document.body.removeChild(overlay);
             resetGame();
             playAgainVisible = false; // Reset so it can appear again next time
         }, 500);
     });
     overlay.appendChild(playPauseBtn);
 
     document.body.appendChild(overlay);
     // Fade-in after appending
     setTimeout(() => overlay.classList.remove('opacity-0'), 100);
  }
 }

function showStartButton() {
  const overlay = document.createElement('div');
  overlay.id = 'start-game-overlay';
  overlay.classList.add(
    'absolute', 'inset-0', 'bg-black', 'bg-opacity-50',
    'flex', 'flex-col', 'justify-center', 'items-center',
    'z-10', 'opacity-0', 'transition-opacity', 'duration-500'
  );
  document.body.appendChild(overlay);

  setTimeout(() => overlay.classList.remove('opacity-0'), 100); // Fade-in

  // Play/Pause Button
  const playPauseBtn = document.createElement('button');
  playPauseBtn.id = 'playPauseBtn';
  playPauseBtn.innerHTML = `<img src="/assets/play.svg" alt="Play" class="w-32 h-32 transition duration-300 hover:brightness-200 hover:drop-shadow-[0_0_5px_cyan]">`;
  playPauseBtn.addEventListener('click', startGameFlow);
  overlay.appendChild(playPauseBtn);
}


function startGameFlow() {
  // Remove start overlay
  const overlay = document.getElementById('start-game-overlay');
  if (overlay) overlay.remove();
  
  // Set start flag to true
  start = true;
  
  // Start all game instances
  gameInstances.forEach(game => game.startGame());
}

function resetGame() {
  // Remove overlay
  const overlay = document.getElementById('game-over-overlay');
  if (overlay) overlay.remove();
  
  // Reset score
  globalScore = 0;
  scoreElement.innerText = 'Score: 0';
  
  // Reset game instances
  gameInstances.forEach(game => game.reset());
  
  // Reset flag
  playAgainVisible = false;
}

// Initialize both games
document.addEventListener('DOMContentLoaded', () => {
  // Load high score first
  loadHighScore();
  
  const game1 = new Game('game1', 'car1');
  const game2 = new Game('game2', 'car2');
  gameInstances = [game1, game2];
  
  // Show start button when page loads
  showStartButton();
  
  document.addEventListener('keydown', (event) => {
    if (!playAgainVisible && start) { // Only process keystrokes if game is active and started
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
  document.addEventListener('click', (event) => {
    if (!playAgainVisible && start) { // Only process keystrokes if game is active and started
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
  // Handle car movement