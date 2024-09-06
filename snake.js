// Game constants and variables
let direction = {x: 0, y: 0};
const foodsound = new Audio('food.mp3');
const gameoversound = new Audio('gameover.mp3');
const movesound = new Audio('move.mp3');
const musicsound = new Audio('music.mp3');
let speed = 7;
let score = 0;
let lastpaintTime = 0;
let snakeArr = [{x: 17, y: 15}];
let food = {x: 6, y: 10}; // Changed from const to let
let inputDir = {x: 0, y: 0}; 

// Select score and hiscore boxes
let scoreBox = document.getElementById('scoreBox');
let hiscoreBox = document.getElementById('hiscoreBox');

// Check if there's a high score in localStorage
let hiscoreval = 0;
let storedHiscore = localStorage.getItem('hiscoreBox');
if (storedHiscore === null) {
    localStorage.setItem('hiscoreBox', JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(storedHiscore);
    hiscoreBox.innerHTML = "Hiscore: " + hiscoreval;
}

// Game function
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastpaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastpaintTime = ctime;
    gameEngine();
}

// Collision detection
function isCollide(snake) {
    // If you bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array and food
    if (isCollide(snakeArr)) {
        gameoversound.play();
        musicsound.pause();
        inputDir = {x: 0, y: 0};
        alert('Game over. Press any key to play again!');
        snakeArr = [{x: 13, y: 15}]; // Reset snake after game over
        movesound.play();
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodsound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem('hiscoreBox', JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "Hiscore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;

        // Increase snake length
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x, 
            y: snakeArr[0].y + inputDir.y
        });

        // Regenerate food
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()), 
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    let box = document.querySelector('.box');
    box.innerHTML = "";
    
    // Display snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        box.appendChild(snakeElement);
    });

    // Display food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    box.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);

// Use event listener for keypresses
window.addEventListener('keydown', e => {
    inputDir = {x: 0, y: 1}; // Start the game
    movesound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
