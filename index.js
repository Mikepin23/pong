const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "azure";
const paddleColor = "lightblue";
const paddleBorder = "black";
const ballColor = "black";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 75;
let intervalID;
let ballSpeed = 1;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let gameRunning = false;
let paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};
let paddle2 = {
  width: 25,
  height: 100,
  x: gameWidth - 25,
  y: gameHeight - 100,
};

clearBoard();
drawPaddles();
drawBall(ballX, ballY);

gameStartBtn.addEventListener("click", () => {
  gameStartBtn.disabled = true;
  globalThis.addEventListener("keydown", changeDirection);
  // Reset scores for a fresh game
  player1Score = 0;
  player2Score = 0;
  updateScore();
  gameRunning = true;
  gameStart();
});

resetBtn.addEventListener("click", resetGame);

function gameStart() {
  createBall();
  nextTick();
}
function nextTick() {
  if (!gameRunning) return;
  intervalID = setTimeout(() => {
    clearBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    checkCollision();
    nextTick();
  }, 10);
}
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function drawPaddles() {
  ctx.strokeStyle = paddleBorder;
  ctx.lineWidth = 4;

  ctx.fillStyle = paddleColor;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddleColor;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function createBall() {
  ballSpeed = 1;
  if (Math.round(Math.random()) == 1) {
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }
  if (Math.round(Math.random()) == 1) {
    ballYDirection = 1;
  } else {
    ballYDirection = -1;
  }
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  drawBall(ballX, ballY);
}
function moveBall() {
  ballX += ballSpeed * ballXDirection;
  ballY += ballSpeed * ballYDirection;
}
function drawBall(ballX, ballY) {
  ctx.fillStyle = ballColor;
  ctx.strokeStyle = ballBorderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}
function checkCollision() {
  handleWallCollision();
  if (handleScoring()) return;
  handlePaddleCollisions();
}

function handleWallCollision() {
  if (ballY <= 0 + ballRadius) {
    ballYDirection *= -1;
  }
  if (ballY >= gameHeight - ballRadius) {
    ballYDirection *= -1;
  }
}

function handleScoring() {
  if (ballX <= 0) {
    player2Score += 1;
    updateScore();
    if (player2Score == 5) {
      winGame();
    } else {
      createBall();
    }
    return true;
  }
  if (ballX >= gameWidth) {
    player1Score += 1;
    updateScore();
    if (player1Score == 5) {
      winGame();
    } else {
      createBall();
    }
    return true;
  }
  return false;
}

function handlePaddleCollisions() {
  // left paddle collision
  if (ballX <= paddle1.x + paddle1.width + ballRadius) {
    if (ballY >= paddle1.y && ballY <= paddle1.y + paddle1.height) {
      ballX = paddle1.x + paddle1.width + ballRadius; // if ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 0.75;
    }
  }
  // right paddle collision
  if (ballX >= paddle2.x - ballRadius) {
    if (ballY >= paddle2.y && ballY <= paddle2.y + paddle2.height) {
      ballX = paddle2.x - ballRadius; // if ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 0.75;
    }
  }
}
function changeDirection(e) {
  const keyPressed = e.keyCode;
  const paddle1Up = 87;
  const paddle1Down = 83;
  const paddle2Up = 38;
  const paddle2Down = 40;

  switch (keyPressed) {
    case paddle1Up:
      paddle1.y = Math.max(0, paddle1.y - paddleSpeed);
      break;
    case paddle1Down:
      paddle1.y = Math.min(
        gameHeight - paddle1.height,
        paddle1.y + paddleSpeed
      );
      break;
    case paddle2Up:
      paddle2.y = Math.max(0, paddle2.y - paddleSpeed);
      e.preventDefault();
      break;
    case paddle2Down:
      paddle2.y = Math.min(
        gameHeight - paddle2.height,
        paddle2.y + paddleSpeed
      );
      e.preventDefault();
      break;
  }
}
function updateScore() {
  scoreText.textContent = `${player1Score} : ${player2Score}`;
}
function displayWinner(message) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, gameWidth, gameHeight);
  ctx.fillStyle = "white";
  ctx.font = "3rem 'Permanent Marker', cursive";
  ctx.textAlign = "center";
  ctx.fillText(message, gameWidth / 2, gameHeight / 2);
}
function resetGame() {
  player1Score = 0;
  player2Score = 0;
  gameRunning = false;

  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100,
  };

  ballSpeed = 1;
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  ballXDirection = 0;
  ballYDirection = 0;
  updateScore();
  clearTimeout(intervalID);
  clearBoard();
  drawPaddles();
  drawBall(ballX, ballY);
  if (gameStartBtn) {
    gameStartBtn.disabled = false;
  }
}
function winGame() {
  gameRunning = false;
  clearTimeout(intervalID);
  if (player1Score == 5) {
    displayWinner("Player 1 Wins!");
  }
  if (player2Score == 5) {
    displayWinner("Player 2 Wins!");
  }
  gameStartBtn.disabled = false;
}
