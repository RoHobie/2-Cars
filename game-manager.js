// game-manager.js - Manages overall game state and initialization
class GameManager {
    static init() {
      this.gameInstances = [];
      this.playAgainVisible = false;
      this.isGameStarted = false;
      ScoreManager.init();
      
      this.initializeInputHandlers();
    }
  
    static initializeInputHandlers() {
      document.addEventListener('keydown', (event) => {
        if (!this.playAgainVisible && this.isGameStarted) {
          if (event.key === 'a') {
            document.getElementById('car1').classList.toggle('left');
            document.getElementById('car1').classList.toggle('right');
          }
          if (event.key === 'd') {
            document.getElementById('car2').classList.toggle('left');
            document.getElementById('car2').classList.toggle('right');
          }
        }
      });
    }
    
    static createGames() {
      const game1 = new Game('game1', 'car1');
      const game2 = new Game('game2', 'car2');
      this.gameInstances = [game1, game2];
    }
  
    static startGameFlow() {
      UIManager.removeOverlay('start-game-overlay');
      this.isGameStarted = true;
      this.gameInstances.forEach(game => game.startGame());
    }
  
    static endAllGames() {
      this.gameInstances.forEach(game => game.gameOver());
      if (!this.playAgainVisible) {
        this.playAgainVisible = true;
        UIManager.showPlayAgainOverlay();
      }
    }
  
    static resetGame() {
      UIManager.removeOverlay('game-over-overlay');
      ScoreManager.reset();
      this.gameInstances.forEach(game => game.reset());
      this.playAgainVisible = false;
    }
  }