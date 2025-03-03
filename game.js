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
    if (globalScore >= 150) {
      this.currentSpeed = this.baseSpeed * 3.0; 
    } else if (globalScore >= 100) {
      this.currentSpeed = this.baseSpeed * 2.75; 
    } else if (globalScore >= 75) {
      this.currentSpeed = this.baseSpeed * 2.5; 
    } else if (globalScore >= 55) {
      this.currentSpeed = this.baseSpeed * 2.25; 
    } else if (globalScore >= 40) {
      this.currentSpeed = this.baseSpeed * 2.0; 
    } else if (globalScore >= 30) {
      this.currentSpeed = this.baseSpeed * 1.75; 
    }else if (globalScore >= 20) {
      this.currentSpeed = this.baseSpeed * 1.5; 
    } else if (globalScore >= 12) {
      this.currentSpeed = this.baseSpeed * 1.25; 
    }
     else {
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
    
    // Adjusted minimum gap progression for a smoother increase in difficulty
    let minGap;
    if (globalScore >= 70) {
      minGap = 550; 
    } else if (globalScore >= 50) {
      minGap = 400; 
    } else if (globalScore >= 30) {
      minGap = 250; 
    } else {
      minGap = 200; // Base case, slightly reduced
    }
    
    // Adjusted spawn delay formula for a smoother difficulty curve
    const spawnDelay = Math.max(minGap, 1100 - (globalScore * 10)); 
  
    // Reduce randomness further as difficulty increases
    const randomVariation = globalScore >= 70 ? 50 : (globalScore >= 50 ? 100 : 200);
    
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
    this.gameContainer.appendChild(entity);
    this.animateEntity(entity, type);
  }

  animateEntity(entity, type) {
    let position = -60;
    let lastTime = 0;
    
    const move = (currentTime) => {
      if (this.gameOverFlag) return;
      
      // Calculate delta time (time since last frame)
      if (lastTime === 0) {
        lastTime = currentTime;
        requestAnimationFrame(move);
        return;
      }
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Add a speed multiplier to control overall speed (0.5 = half speed)
      const speedMultiplier = 0.5;
      
      // Use 144fps normalization (6.94ms) with the speed multiplier
      position += this.currentSpeed * speedMultiplier * (deltaTime / 6.94);
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
    
    // Start the animation loop with timestamp
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
