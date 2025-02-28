// score-manager.js - Manages game scores and notifications
class ScoreManager {
    static init() {
      this.score = 0;
      this.scoreElement = document.getElementById('score1');
      this.scoreElement.innerText = 'Score: 0';
    }
    
    static getScore() {
      return this.score;
    }
  
    static updateScore() {
      this.score++;
      this.scoreElement.innerText = `Score: ${this.score}`;
      
      if (this.score === 20) {
        this.showDifficultyNotification("Level 2! Speed increasing!");
      } else if (this.score === 50) {
        this.showDifficultyNotification("Level 3! Getting faster!");
      } else if (this.score === 70) {
        this.showDifficultyNotification("Maximum Difficulty! Good luck!");
      }
    }
  
    static showDifficultyNotification(message) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.classList.add('fixed', 'top-16', 'left-1/2', 'transform', '-translate-x-1/2', 
                                'bg-yellow-500', 'text-black', 'font-bold', 'py-2', 'px-4', 
                                'rounded', 'shadow-lg', 'z-50');
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => notification.remove(), 500);
      }, 2000);
    }
  
    static reset() {
      this.score = 0;
      this.scoreElement.innerText = 'Score: 0';
    }
  }