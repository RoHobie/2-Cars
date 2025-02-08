// Game 1 Logic
let score1 = 0;
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        document.getElementById('car1').classList.toggle('left');
        document.getElementById('car1').classList.toggle('right');
    }
});

// Game 2 Logic
let score2 = 0;
document.addEventListener('keydown', (event) => {
    if (event.key === 'd') {
        document.getElementById('car2').classList.toggle('left');
        document.getElementById('car2').classList.toggle('right');
    }
});