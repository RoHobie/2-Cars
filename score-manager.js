
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

function showPlayAgainButton() {
  if (!playAgainVisible) {
    playAgainVisible = true;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.classList.add('absolute', 'inset-0', 'bg-black', 'bg-opacity-75', 'flex', 'flex-col', 'justify-center', 'items-center', 'z-10');
    document.body.appendChild(overlay);
    
    // Game over text
    const gameOverText = document.createElement('h2');
    
    gameOverText.textContent = `Game Over! Final Score: ${globalScore}`;
    gameOverText.classList.add('text-white', 'text-2xl', 'mb-2');
    overlay.appendChild(gameOverText);
    
    // High score display - new
    const highScoreText = document.createElement('p');
    
    // Show special message if a new high score was achieved
    if (globalScore >= highScore && globalScore > 0) {
      highScoreText.textContent = `🏆 New High Score: ${highScore} 🏆`;
      highScoreText.classList.add('text-green-400', 'text-xl', 'mb-4', 'font-bold');
    } else {
      highScoreText.textContent = `High Score: ${highScore}`;
      highScoreText.classList.add('text-white', 'text-xl', 'mb-4');
    }
    
    overlay.appendChild(highScoreText);
    
    // Play Again button
    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
    playAgainBtn.addEventListener('click', resetGame);
    overlay.appendChild(playAgainBtn);
  }
}

function showStartButton() {
  // Create overlay for start button
  const overlay = document.createElement('div');
  overlay.id = 'start-game-overlay';
  overlay.classList.add('absolute', 'inset-0', 'bg-black', 'bg-opacity-75', 'flex', 'flex-col', 'justify-center', 'items-center', 'z-10');
  document.body.appendChild(overlay);
  
  // Welcome text
  const welcomeText = document.createElement('h2');
  welcomeText.textContent = 'Welcome to the Game!';
  welcomeText.classList.add('text-white', 'text-2xl', 'mb-4');
  overlay.appendChild(welcomeText);
  
  // High score display - if exists
  if (highScore > 0) {
    const highScoreText = document.createElement('p');
    highScoreText.textContent = `Your High Score: ${highScore}`;
    highScoreText.classList.add('text-yellow-400', 'text-xl', 'mb-4');
    overlay.appendChild(highScoreText);
  }
  
  // Instructions
  const instructions = document.createElement('p');
  instructions.textContent = 'Use "A" key to move left car, "D" key to move right car. Collect yellow orbs, avoid blue obstacles!';
  instructions.classList.add('text-white', 'text-lg', 'mb-6', 'max-w-md', 'text-center');
  overlay.appendChild(instructions);
  
  // Start button
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start Game';
  startBtn.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-3', 'px-6', 'rounded-lg', 'text-xl');
  startBtn.addEventListener('click', startGameFlow);
  overlay.appendChild(startBtn);
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
  
  // Handle car movement
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
});