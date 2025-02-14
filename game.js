class Game {
    constructor(gameId, carId) {
        this.gameContainer = document.getElementById(gameId);
        this.car = document.getElementById(carId);
        this.gameOverFlag = false;
        this.startGame();
    }

    startGame() {
        this.spawnObject();
    }

    spawnObject() {
        if (this.gameOverFlag) return;
        const chance = Math.random();
        if (chance < 0.6) {
            this.createObstacle();
        } else {
            this.createPoint();
        }
        setTimeout(() => this.spawnObject(), Math.random() * 1000 + 1000);
    }

    createObstacle() {
        this.createEntity('obstacle', 'bg-blue-500');
    }

    createPoint() {
        this.createEntity('point', 'bg-yellow-400 rounded-full');
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
        let speed = 3;

        const move = () => {
            if (this.gameOverFlag) return;
            position += speed;
            entity.style.top = position + 'px';

            if (type === 'obstacle' && this.checkCollision(entity)) {
                this.gameOver();
                return;
            }

            if (type === 'point' && this.checkPointCollection(entity)) {
                return;
            }

            if (position < 760) {
                requestAnimationFrame(move);
            } else {
                if (type === 'point') {
                    this.gameOver();
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
            updateGlobalScore(); // Call global function
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
        alert(`Game Over! Refresh to restart.`);
        location.reload();
    }
}

// Global score variable and function
let globalScore = 0;
const scoreElement = document.getElementById('score1');

function updateGlobalScore() {
    globalScore++;
    scoreElement.innerText = `Score: ${globalScore}`;
}

// Initialize both games
new Game('game1', 'car1');
new Game('game2', 'car2');

// Handle car movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        document.getElementById('car1').classList.toggle('left');
        document.getElementById('car1').classList.toggle('right');
    }
    if (event.key === 'd') {
        document.getElementById('car2').classList.toggle('left');
        document.getElementById('car2').classList.toggle('right');
    }
});
