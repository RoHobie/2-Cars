// ui-manager.js - Manages game UI components
class UIManager {
    static showPlayAgainOverlay() {
      const overlay = document.createElement('div');
      overlay.id = 'game-over-overlay';
      overlay.classList.add('absolute', 'inset-0', 'bg-black', 'bg-opacity-75', 'flex', 'flex-col', 'justify-center', 'items-center', 'z-10');
      document.body.appendChild(overlay);
      
      const gameOverText = document.createElement('h2');
      let levelReached = "Beginner";
      const score = ScoreManager.getScore();
      
      if (score >= 70) levelReached = "Expert";
      else if (score >= 50) levelReached = "Advanced";
      else if (score >= 20) levelReached = "Intermediate";
      
      gameOverText.textContent = `Game Over! Final Score: ${score}`;
      gameOverText.classList.add('text-white', 'text-2xl', 'mb-2');
      overlay.appendChild(gameOverText);
      
      const levelText = document.createElement('p');
      levelText.textContent = `Level Reached: ${levelReached}`;
      levelText.classList.add('text-yellow-400', 'text-xl', 'mb-4');
      overlay.appendChild(levelText);
      
      const playAgainBtn = document.createElement('button');
      playAgainBtn.textContent = 'Play Again';
      playAgainBtn.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
      playAgainBtn.addEventListener('click', GameManager.resetGame);
      overlay.appendChild(playAgainBtn);
    }
  
    static showStartOverlay() {
      const overlay = document.createElement('div');
      overlay.id = 'start-game-overlay';
      overlay.classList.add('absolute', 'inset-0', 'bg-black', 'bg-opacity-75', 'flex', 'flex-col', 'justify-center', 'items-center', 'z-10');
      document.body.appendChild(overlay);
      
      const welcomeText = document.createElement('h2');
      welcomeText.textContent = 'Welcome to the Game!';
      welcomeText.classList.add('text-white', 'text-2xl', 'mb-4');
      overlay.appendChild(welcomeText);
      
      const instructions = document.createElement('p');
      instructions.textContent = 'Use "A" key to move left car, "D" key to move right car. Collect yellow orbs, avoid blue obstacles!';
      instructions.classList.add('text-white', 'text-lg', 'mb-6', 'max-w-md', 'text-center');
      overlay.appendChild(instructions);
      
      const startBtn = document.createElement('button');
      startBtn.textContent = 'Start Game';
      startBtn.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-3', 'px-6', 'rounded-lg', 'text-xl');
      startBtn.addEventListener('click', GameManager.startGameFlow);
      overlay.appendChild(startBtn);
    }
  
    static removeOverlay(id) {
      const overlay = document.getElementById(id);
      if (overlay) overlay.remove();
    }
  }