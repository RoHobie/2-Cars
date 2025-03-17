class Game {
  constructor(gameId, carId) {
    // Initialize game elements and properties
    this.gameContainer = document.getElementById(gameId);
    this.car = document.getElementById(carId);
    this.gameOverFlag = false;
    this.gameId = gameId;
    this.carId = carId;
    this.baseSpeed = 4; // Initial speed
    this.currentSpeed = this.baseSpeed;
    this.pointSound = new Audio('assets/point-sound.mp3'); // Sound for collecting points
    this.crashSound = new Audio('assets/loss-sound.mp3'); // Sound for crashing
    this.pointSound.preload = 'auto'; // Preload sounds for faster playback
    this.crashSound.preload = 'auto';
    this.pointSound.volume = 0.4; // Set initial volume
    this.crashSound.volume = 0.4;
  }

  startGame() {
    // Start the game loop
    this.spawnObject();
  }

  updateDifficulty() {
    // Increase game speed based on score
    if (globalScore >= 150) {
      this.currentSpeed = this.baseSpeed * 3.0;
    } else if (globalScore >= 100) {
      this.currentSpeed = this.baseSpeed * 2.75;
    } // ... other speed increase conditions
    else {
      this.currentSpeed = this.baseSpeed; // Default speed
    }
  }

  spawnObject() {
    // Spawn obstacles or points randomly
    if (this.gameOverFlag) return;
    this.updateDifficulty(); // Update difficulty before each spawn
    const chance = Math.random();
    if (chance < 0.6) {
      this.createObstacle();
    } else {
      this.createPoint();
    }
    // Calculate spawn delay based on score
    let minGap;
    if (globalScore >= 70) {
      minGap = 500;
    } else if (globalScore >= 50) {
      minGap = 300;
    } // ... other minGap conditions
    else {
      minGap = 200;
    }
    const spawnDelay = Math.max(minGap, 1100 - (globalScore * 10));
    const randomVariation = globalScore >= 70 ? 50 : (globalScore >= 50 ? 100 : 200);
    this.spawnTimeout = setTimeout(() => this.spawnObject(), Math.random() * randomVariation + spawnDelay);
  }

  createObstacle() {
    // Create an obstacle element
    this.createEntity('obstacle', 'bg-blue-600');
  }

  createPoint() {
    // Create a point element
    this.createEntity('point', 'bg-red-500 rounded-full');
  }

  createEntity(type, className) {
    // Create and position a game entity
    const entity = document.createElement('div');
    entity.classList.add(type, ...className.split(' '));
    const containerWidth = this.gameContainer.clientWidth;
    const leftLaneCenter = containerWidth * 0.25;
    const rightLaneCenter = containerWidth * 0.75;
    this.gameContainer.appendChild(entity);
    const entityWidth = entity.offsetWidth;
    const lane = Math.random() < 0.5 ? 'left' : 'right';
    const laneCenter = lane === 'left' ? leftLaneCenter : rightLaneCenter;
    entity.style.left = `${laneCenter - (entityWidth / 2)}px`;
    entity.style.top = '-60px';
    this.animateEntity(entity, type);
  }

  animateEntity(entity, type) {
    // Animate the entity's movement
    let position = -60;
    let lastTime = 0;
    const gameContainer = entity.parentElement;
    const gameHeight = gameContainer.clientHeight;
    const move = (currentTime) => {
      if (this.gameOverFlag) return;
      if (lastTime === 0) {
        lastTime = currentTime;
        requestAnimationFrame(move);
        return;
      }
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const speedMultiplier = 0.5;
      position += this.currentSpeed * speedMultiplier * (deltaTime / 6.94);
      entity.style.top = position + 'px';
      if (type === 'obstacle' && this.checkCollision(entity)) {
        entity.classList.add('obstacle-crash');
        endAllGames();
        return;
      }
      if (type === 'point' && this.checkPointCollection(entity)) {
        entity.remove();
        return;
      }
      if (position < gameHeight) {
        requestAnimationFrame(move);
      } else {
        if (type === 'point') {
          showPlayAgainButton('missed');
          endAllGames();
        }
        entity.remove();
      }
    };
    requestAnimationFrame(move);
  }

  checkCollision(entity) {
    // Check for collision between entity and car
    if (this.detectCollision(entity, this.car)) {
      entity.classList.add('obstacle-crash');
      return true;
    }
    return false;
  }

  checkPointCollection(entity) {
    // Check for point collection
    if (this.detectCollision(entity, this.car)) {
      this.pointSound.currentTime = 0;
      this.pointSound.play();
      entity.remove();
      updateGlobalScore();
      return true;
    }
    return false;
  }

  detectCollision(entity1, entity2) {
    // Detect collision between two entities
    const rect1 = entity1.getBoundingClientRect();
    const rect2 = entity2.getBoundingClientRect();
    const padding = 5;
    return (
      rect1.left + padding < rect2.right &&
      rect1.right - padding > rect2.left &&
      rect1.top + padding < rect2.bottom &&
      rect1.bottom - padding > rect2.top
    );
  }

  gameOver() {
    // End the game
    this.gameOverFlag = true;
    this.crashSound.currentTime = 0;
    this.crashSound.play();
  }

  reset() {
    // Reset the game state
    this.gameOverFlag = false;
    this.currentSpeed = this.baseSpeed;
    const entities = this.gameContainer.querySelectorAll('.obstacle, .point');
    entities.forEach(entity => entity.remove());
    this.car.classList.remove('left', 'right');
    this.car.classList.add('left');
    this.startGame();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Sound control setup
  const soundButtons = document.querySelectorAll('img[alt="mute"]');
  let isMuted = false;

  function updateSoundVolumes() {
    // Update sound volume for all game instances
    const allGameInstances = gameInstances || [];
    allGameInstances.forEach(game => {
      if (game.pointSound) {
        game.pointSound.volume = isMuted ? 0 : 0.4;
      }
      if (game.crashSound) {
        game.crashSound.volume = isMuted ? 0 : 0.4;
      }
    });
  }

  soundButtons.forEach(button => {
    // Toggle mute state and update visuals
    button.style.cursor = 'pointer';
    button.addEventListener('click', function() {
      isMuted = !isMuted;
      if (isMuted) {
        this.style.filter = 'brightness(1) sepia(1) saturate(10) hue-rotate(320deg)';
      } else {
        this.style.filter = 'grayscale(1) opacity(0.6)';
      }
      updateSoundVolumes();
    });
    button.style.filter = 'grayscale(1) opacity(0.6)'; // Set initial visual state
  });

  window.isSoundMuted = function() {
    // Expose mute state globally
    return isMuted;
  };
});