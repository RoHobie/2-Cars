
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
    
    // Create overlays for both game areas
    const game1 = document.getElementById('game1');
    const game2 = document.getElementById('game2');
    
    // Create a common message container that will be positioned between the games
    const messageContainer = document.createElement('div');
    messageContainer.classList.add(
      'fixed', 'z-20', 'flex', 'flex-col', 'items-center', 'justify-center',
      'opacity-0', 'transition-opacity', 'duration-500'
    );
    
    // Position the message container between the two games
    const game1Rect = game1.getBoundingClientRect();
    const game2Rect = game2.getBoundingClientRect();
    const combinedWidth = game1Rect.width + game2Rect.width;
    const leftPosition = game1Rect.left + (combinedWidth / 2);
    const topPosition = game1Rect.top + (game1Rect.height / 2);
    
    messageContainer.style.left = `${leftPosition}px`;
    messageContainer.style.top = `${topPosition}px`;
    messageContainer.style.transform = 'translate(-50%, -50%)';
    
    // Create individual overlays for each game
    const createGameOverlay = (gameElement) => {
      const overlay = document.createElement('div');
      overlay.classList.add(
        'absolute', 'inset-0', 'bg-black', 'bg-opacity-75',
        'z-10', 'opacity-0', 'transition-opacity', 'duration-500'
      );
      
      // Make sure game element has position relative
      if (window.getComputedStyle(gameElement).position !== 'relative') {
        gameElement.style.position = 'relative';
      }
      
      gameElement.appendChild(overlay);
      return overlay;
    };
    
    const overlay1 = createGameOverlay(game1);
    const overlay2 = createGameOverlay(game2);
    
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
    messageContainer.appendChild(gameOverText);
    
    // High Score Check
    const savedHighScore = parseInt(localStorage.getItem('carGameHighScore') || "0");
    if (globalScore >= savedHighScore) {
      const highScoreText = document.createElement('h2');
      highScoreText.textContent = "New High Score!!";
      highScoreText.classList.add('text-green-200', 'text-2xl', 'mb-4', 'font-bold', 'animate-bounce');
      messageContainer.appendChild(highScoreText);
    }
    
    // Play Again Button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.id = 'playPauseBtn';
    playPauseBtn.innerHTML = `<img src="/assets/play.svg" alt="Play" class="w-32 h-32 transition duration-300 hover:brightness-200 hover:drop-shadow-[0_0_5px_cyan]">`;
    playPauseBtn.addEventListener('click', () => {
      // Fade-out effect
      overlay1.classList.add('opacity-0');
      overlay2.classList.add('opacity-0');
      messageContainer.classList.add('opacity-0');
      
      setTimeout(() => {
        game1.removeChild(overlay1);
        game2.removeChild(overlay2);
        document.body.removeChild(messageContainer);
        resetGame();
        playAgainVisible = false; // Reset so it can appear again next time
      }, 500);
    });
    messageContainer.appendChild(playPauseBtn);
    
    // Add message container to the body
    document.body.appendChild(messageContainer);
    
    // Fade-in after appending
    setTimeout(() => {
      overlay1.classList.remove('opacity-0');
      overlay2.classList.remove('opacity-0');
      messageContainer.classList.remove('opacity-0');
    }, 100);
  }
}
function showStartButton() {
  // Create the overlay for the entire page
  const overlay = document.createElement('div');
  overlay.id = 'start-game-overlay';
  overlay.classList.add(
    'fixed', 'inset-0', 'bg-black', 'bg-opacity-50',
    'flex', 'flex-col', 'justify-center', 'items-center',
    'z-10', 'opacity-0', 'transition-opacity', 'duration-500'
  );
  
  // Append to the body to cover the entire page
  document.body.appendChild(overlay);
  
  setTimeout(() => overlay.classList.remove('opacity-0'), 100); // Fade-in
  
  // Get the game content div's position to center the button there
  const gameContent = document.querySelector('.game-content');
  const gameRect = gameContent.getBoundingClientRect();
  
  // Play/Pause Button - positioned to align with the game content
  const playPauseBtn = document.createElement('button');
  playPauseBtn.id = 'playPauseBtn';
  playPauseBtn.innerHTML = `<img src="/assets/play.svg" alt="Play" class="w-32 h-32 transition duration-300 hover:brightness-200 hover:drop-shadow-[0_0_5px_cyan]">`;
  playPauseBtn.style.position = 'absolute';
  playPauseBtn.style.left = `${gameRect.left + (gameRect.width / 2) - 64}px`; // Center horizontally (64px is half of w-32)
  playPauseBtn.style.top = `${gameRect.top + (gameRect.height / 2) - 64}px`; // Center vertically (64px is half of h-32)
  
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

});
// Handle car movement

game1 = document.querySelector('#game1');
game2 = document.querySelector('#game2');

game1.addEventListener("click", () => {
  document.getElementById('car1').classList.toggle('left');
  document.getElementById('car1').classList.toggle('right');
})
game2.addEventListener("click", () => {
  document.getElementById('car2').classList.toggle('left');
  document.getElementById('car2').classList.toggle('right');
})