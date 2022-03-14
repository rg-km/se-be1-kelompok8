const CELL_SIZE = 30;
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

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(life) {
  return {
    color: "purple",
    ...initHeadAndBody(), // jadi ini itu ngedestruct isi dalam initHeadAndBody
    direction: initDirection(),
    life: life,
    score: 0,
    level: 1,
    speed: MOVE_INTERVAL,
  };
}

let snake1 = initSnake(3);

let apple1 = {
  position: initPosition(),
};

let apple2 = {
  position: initPosition(),
};

function clearScreen(ctx) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawCell(ctx, x, y, snakeId) {
  let img = document.getElementById(snakeId);
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake(ctx, snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-left");
      break;

    case DIRECTION.RIGHT:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-right");
      break;

    case DIRECTION.DOWN:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-down");
      break;

    case DIRECTION.UP:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-top");
      break;
  }
  for (let i = 1; i < snake.body.length; i += 1) {
    let body = snake.body[i];
    drawCell(ctx, body.x, body.y, "snake-body");
  }
}

function drawApple(ctx, apple) {
  let img = document.getElementById("apple");

  ctx.drawImage(
    img,
    apple.position.x * CELL_SIZE,
    apple.position.y * CELL_SIZE,
    CELL_SIZE + 10,
    CELL_SIZE
  );
}

function drawlife(life) {
  let img = document.getElementById("life" + life);
  if (life < 3) {
    img.parentNode.removeChild(img);
  }
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  clearScreen(scoreCtx);
  scoreCtx.font =
    "100px 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif";
  scoreCtx.fillStyle = "black";
  scoreCtx.fillText("score: " + snake.score, 50, 100, 200);
}

function drawSpeed(snake) {
  let speedCanvas;
  if (snake.color == snake1.color) {
    speedCanvas = document.getElementById("speedBoard");
  }

  let ctx = speedCanvas.getContext("2d");

  clearScreen(ctx);
  ctx.font = "15px Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Speed : " + snake.speed,
    speedCanvas.scrollWidth / 2,
    speedCanvas.scrollHeight / 2 + 5
  );
}

function drawLevel(snake) {
  let rankCanvas;
  if (snake.color == snake1.color) {
    rankCanvas = document.getElementById("levelBoard");
  }

  let ctx = rankCanvas.getContext("2d");

  clearScreen(ctx);
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Level : " + snake.level,
    rankCanvas.scrollWidth / 2,
    rankCanvas.scrollHeight / 2 + 5
  );
}

function draw() {
  setInterval(() => {
    // setInterval biar gambar terus menerus/repeateadly
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    clearScreen(ctx);

    // manggil buat gambar snake1
    drawSnake(ctx, snake1);

    // manggil buat gambar apple1
    drawApple(ctx, apple1);

    // manggil buat gambar apple2
    drawApple(ctx, apple2);

    // manggil drawScore() buat snake1
    drawScore(snake1);
    // gambar heart diatas
    drawlife(snake1.life);
    drawSpeed(snake1); // speed
    drawLevel(snake1);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    // ini klo snakenya ke kiri pojok (mentok layar/x < 0)
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1; // maka bakal dipindahin (teleport) ke pojok kanan
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eat(snake, apple) {
  let snakeEat = new Audio("assets/music/makanApple.wav");
  if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
    // jika posisi apple setara dengan kepala ular
    if (snake.body.x != apple.position.x && snake.body.y !== apple.position.y) {
      apple.position = initPosition(); // maka apple akan dipanggil lagi dengan posisi acak (init position)
    }
    snake.body.push({ x: snake.head.x, y: snake.head.y }); // dan snake bodynya ditambah (push/append)
    snakeEat.play(); // soundnya di play yg snakeEat itu
    // check score
    snake.score++;
    if (snake.score != 0 && snake.score % 5 == 0) {
      // set maksimum level to 5
      if (snake.level == 5) {
        snake.level;
      } else {
        // levelUp.play();
        snake.level++;
      }
      snake.speed -= 2; // increase speed
    }
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function checkCollision(snakes) {
  // parameternya snakes aja biar gk bingung, klo pake'snake' nnti bingung ngerujuknya kemana
  let isCollide = false;
  let gameOver = new Audio();
  gameOver.src = "assets/music/gameOver.mp3";

  let nabrak = new Audio();
  nabrak.src = "assets/music/ugh.mp3"

  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (
          snakes[i].head.x == snakes[j].body[k].x &&
          snakes[i].head.y == snakes[j].body[k].y
        ) {
          isCollide = true; // klo nabrak jadi true
        }
      }
    }
  }

  if (isCollide) {
    nabrak.play();
    snake1.life -= 1;

    if (snake1.life == 0) {
      alert("GAME OVER");
      gameOver.play();
      snake1 = initSnake(3);
    } else {
      snake1;
    }
  }

  return isCollide;
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
  moveBody(snake);
  if (!checkCollision([snake1])) {
    setTimeout(() => {
      move(snake);
    }, snake.speed);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    // bkin biar gk belok ke arah yang berlawanan
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };
  if (direction !== oppositeDirections[snake.direction]) {
    // jika directionnya mau ke arah berlawanan
    snake.direction = direction; // maka dijadiin arah semula jadi gk bisa belok kearah berlawanan
  }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
});

function initGame() {
  move(snake1);
}

initGame()