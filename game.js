class Game {
    constructor(gameId, carId) {
      this.gameContainer = document.getElementById(gameId);
      this.car = document.getElementById(carId);
      this.gameOverFlag = false;
      this.gameId = gameId;
      this.carId = carId;
      this.baseSpeed = 4; // Initial slower speed
      this.currentSpeed = this.baseSpeed;
      // We don't auto-start the game anymore
    }
  
    startGame() {
      this.spawnObject();
    }
  
    // Update speed based on score
    updateDifficulty() {
      // Update immediately when score thresholds are crossed
      if (globalScore >= 70) {
        this.currentSpeed = this.baseSpeed * 2.5; // 2.5x speed at 70+ points
      } else if (globalScore >= 50) {
        this.currentSpeed = this.baseSpeed * 2.0; // 2x speed at 50-69 points
      } else if (globalScore >= 20) {
        this.currentSpeed = this.baseSpeed * 1.5; // 1.5x speed at 20-49 points
      } else {
        this.currentSpeed = this.baseSpeed; // Base speed below 20 points
      }
    }
    
    spawnObject() {
      if (this.gameOverFlag) return;
      
      // Force difficulty update on every spawn
      this.updateDifficulty();
      
      const chance = Math.random();
      if (chance < 0.6) {
        this.createObstacle();
      } else {
        this.createPoint();
      }
      
      // Immediately restart spawn cycle at new speed
      clearTimeout(this.spawnTimeout);
      
      // Increased minimum gap at highest difficulty level
      const minGap = globalScore >= 70 ? 600 : (globalScore >= 50 ? 350 : 250);
      
      // Reduced score multiplier from 10 to 8 for a gentler curve
      const spawnDelay = Math.max(minGap, 1200 - (globalScore * 8));
      
      // Further reduced randomness at max difficulty
      const randomVariation = globalScore >= 70 ? 75 : 300;
      this.spawnTimeout = setTimeout(() => this.spawnObject(), Math.random() * randomVariation + spawnDelay);
    }  
      
  
    createObstacle() {
      this.createEntity('obstacle', 'bg-blue-600');
    }
  
    createPoint() {
      this.createEntity('point', 'bg-red-500 rounded-full');
    }
  
    createEntity(type, className) {
      const entity = document.createElement('div');
      entity.classList.add(type, ...className.split(' '));
      entity.style.left = Math.random() < 0.5 ? '45px' : '175px';
      entity.style.top = '-60px';
      
      // Add difficulty indicator
      if (globalScore >= 70) {
        entity.classList.add('difficulty-hard');
      } else if (globalScore >= 50) {
        entity.classList.add('difficulty-medium');
      } else if (globalScore >= 20) {
        entity.classList.add('difficulty-easy');
      }
      
      this.gameContainer.appendChild(entity);
      this.animateEntity(entity, type);
    }
  
    animateEntity(entity, type) {
      let position = -60;
      const move = () => {
        if (this.gameOverFlag) return;
        
        // Use the current difficulty-based speed
        position += this.currentSpeed;
        entity.style.top = position + 'px';
        
        if (type === 'obstacle' && this.checkCollision(entity)) {
          endAllGames();
          return;
        }
        if (type === 'point' && this.checkPointCollection(entity)) {
          return;
        }
        if (position < 760) {
          requestAnimationFrame(move);
        } else {
          if (type === 'point') {
            endAllGames();
          }
          entity.remove();
        }
      };
      requestAnimationFrame(move);
    }
  
    checkCollision(entity) {
      return this.detectCollision(entity, this.car);
    }
  
    checkPointCollection(entity) {
      if (this.detectCollision(entity, this.car)) {
        entity.remove();
        updateGlobalScore();
        return true;
      }
      return false;
    }
  
    detectCollision(entity1, entity2) {
      const rect1 = entity1.getBoundingClientRect();
      const rect2 = entity2.getBoundingClientRect();
      return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
      );
    }
  
    gameOver() {
      this.gameOverFlag = true;
    }
  
    reset() {
      this.gameOverFlag = false;
      this.currentSpeed = this.baseSpeed; // Reset speed to base level
      
      // Clear all obstacles and points
      const entities = this.gameContainer.querySelectorAll('.obstacle, .point');
      entities.forEach(entity => entity.remove());
      
      // Reset car position
      this.car.classList.remove('left', 'right');
      this.car.classList.add('left');
      
      // Restart the game
      this.startGame();
    }
  }
  
  // Global variables
  let globalScore = 0;
  let gameInstances = [];
  let playAgainVisible = false;
  let start = false; // New flag for game start
  const scoreElement = document.getElementById('score');
  
  function updateGlobalScore() {
    globalScore++;
    scoreElement.innerText = `Score: ${globalScore}`;
    
    // Add difficulty level indicators at thresholds
    if (globalScore === 20) {
      showDifficultyNotification("Level 2! Speed increasing!");
    } else if (globalScore === 50) {
      showDifficultyNotification("Level 3! Getting faster!");
    } else if (globalScore === 70) {
      showDifficultyNotification("Maximum Difficulty! Good luck!");
    }
  }
  
  function showDifficultyNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('fixed', 'top-16', 'left-1/2', 'transform', '-translate-x-1/2', 
                              'bg-yellow-500', 'text-black', 'font-bold', 'py-2', 'px-4', 
                              'rounded', 'shadow-lg', 'z-50');
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }
  
  function endAllGames() {
    gameInstances.forEach(game => game.gameOver());
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
      
      // Game over text with difficulty level reached
      const gameOverText = document.createElement('h2');
      let levelReached = "Beginner";
      if (globalScore >= 70) levelReached = "Expert";
      else if (globalScore >= 50) levelReached = "Advanced";
      else if (globalScore >= 20) levelReached = "Intermediate";
      
      gameOverText.textContent = `Game Over! Final Score: ${globalScore}`;
      gameOverText.classList.add('text-white', 'text-2xl', 'mb-2');
      overlay.appendChild(gameOverText);
      
      // Level display
      const levelText = document.createElement('p');
      levelText.textContent = `Level Reached: ${levelReached}`;
      levelText.classList.add('text-yellow-400', 'text-xl', 'mb-4');
      overlay.appendChild(levelText);
      
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
    const game1 = new Game('game1', 'car1');
    const game2 = new Game('game2', 'car2');
    gameInstances = [game1, game2];
    
    // Show start button when page loads
    showStartButton();
    
    // Handle car movement
    document.addEventListener('keydown', (event) => {
      if (!playAgainVisible && start) { // Only process keystrokes if game is active and started
        if (event.key === 'a'||event.key === 'ArrowLeft') {
          document.getElementById('car1').classList.toggle('left');
          document.getElementById('car1').classList.toggle('right');
        }
        if (event.key === 'd'|event.key === 'ArrowRight') {
          document.getElementById('car2').classList.toggle('left');
          document.getElementById('car2').classList.toggle('right');
        }
      }
    });
  });