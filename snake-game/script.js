const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

const MOVE_INTERVAL = 100;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

let snake1 = {
  color: "purple",
  position: initPosition(),
  direction: initDirection(),
  score: 0,
};
let snake2 = {
  color: "blue",
  position: initPosition(),
  direction: initDirection(),
  score: 0,
};

let snake3 = {
  color: "green",
  position: initPosition(),
  direction: initDirection(),
  score: 0,
};

// apple
let apple1 = {
  position: initPosition(),
};

let apple2 = {
  position: initPosition(),
};

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  } else if (snake.color == snake2.color) {
    scoreCanvas = document.getElementById("score2Board");
  } else {
    scoreCanvas = document.getElementById("score3Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawCell(ctx, snake1.position.x, snake1.position.y, snake1.color);
    drawCell(ctx, snake2.position.x, snake2.position.y, snake2.color);
    // Soal no 6: Draw Player 3
    drawCell(ctx, snake3.position.x, snake3.position.y, snake3.color);

    // Soal no 4: draw more apples
    let img = document.getElementById("apple");
    // Soal no 3: change apples to image
    ctx.drawImage(
      img,
      apple1.position.x * CELL_SIZE,
      apple1.position.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
    ctx.drawImage(
      img,
      apple2.position.x * CELL_SIZE,
      apple2.position.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    drawScore(snake1);
    drawScore(snake2);
    drawScore(snake3);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.position.x < 0) {
    snake.position.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.position.x >= WIDTH) {
    snake.position.x = 0;
  }
  if (snake.position.y < 0) {
    snake.position.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.position.y >= HEIGHT) {
    snake.position.y = 0;
  }
}

function eat(snake, apple1, apple2) {
  if (
    snake.position.x == apple1.position.x &&
    snake.position.y == apple1.position.y
  ) {
    apple1.position = initPosition();
    snake.score++;
  }
  if (
    snake.position.x == apple2.position.x &&
    snake.position.y == apple2.position.y
  ) {
    apple2.position = initPosition();
    snake.score++;
  }
}

function moveLeft(snake) {
  snake.position.x--;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveRight(snake) {
  snake.position.x++;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveDown(snake) {
  snake.position.y++;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveUp(snake) {
  snake.position.y--;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  setTimeout(function () {
    move(snake);
  }, MOVE_INTERVAL);
}

// fungsi Control (buat jalanin ulernya)
document.addEventListener("keydown", function (event) {
  // control snake1
  if (event.key === "ArrowLeft") {
    snake1.direction = DIRECTION.LEFT;
  } else if (event.key === "ArrowRight") {
    snake1.direction = DIRECTION.RIGHT;
  } else if (event.key === "ArrowUp") {
    snake1.direction = DIRECTION.UP;
  } else if (event.key === "ArrowDown") {
    snake1.direction = DIRECTION.DOWN;
  }

  // control snake2
  if (event.key === "a") {
    snake2.direction = DIRECTION.LEFT;
  } else if (event.key === "d") {
    snake2.direction = DIRECTION.RIGHT;
  } else if (event.key === "w") {
    snake2.direction = DIRECTION.UP;
  } else if (event.key === "s") {
    snake2.direction = DIRECTION.DOWN;
  }

  // control snake3
  if (event.key === "j") {
    snake3.direction = DIRECTION.LEFT;
  } else if (event.key === "l") {
    snake3.direction = DIRECTION.RIGHT;
  } else if (event.key === "i") {
    snake3.direction = DIRECTION.UP;
  } else if (event.key === "k") {
    snake3.direction = DIRECTION.DOWN;
  }
});

move(snake1);
move(snake2);
move(snake3);