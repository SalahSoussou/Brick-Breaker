/**@type {HTMLCanvasElement}*/
const cnv = document.getElementById("cnv"),
  ctx = cnv.getContext("2d"),
  gameWidth = 800,
  gameHeight = 600;
cnv.width = gameWidth;
cnv.height = gameHeight;
class Paddle {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.width = 150;
    this.height = 30;
    this.maxSpeed = 7;
    this.speed = 0;
    this.x = game.gameWidth / 2 - this.width / 2;
    this.y = game.gameHeight - this.height - 10;
  }
  moveLeft() {
    this.speed = -this.maxSpeed;
  }
  moveRight() {
    this.speed = this.maxSpeed;
  }
  stop() {
    this.speed = 0;
  }

  draw(ctx) {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update(deltaTime) {
    this.x += this.speed;
    if (this.x <= 0) this.x = 0;
    if (this.x + this.width >= this.gameWidth)
      this.x = this.gameWidth - this.width;
  }
}
class inputHandler {
  constructor(paddle, game) {
    document.addEventListener("keydown", (event) => {
      switch (event.keyCode) {
        case 37:
          paddle.moveLeft();
          break;
        case 39:
          paddle.moveRight();
          break;
      }
    });
    document.addEventListener("keyup", (event) => {
      switch (event.keyCode) {
        case 37:
          //if (paddle.speed < 0)
          paddle.stop();
          break;
        case 39:
          //if (paddle.speed > 0)
          paddle.stop();
          break;
        case 27:
          game.togglePause();
          break;
        case 32:
          game.start();
          break;
        case 13:
          game.restart();
          break;
      }
    });
  }
}
function collisionCheck(ball, brick) {
  let bottomOfBall = ball.y + ball.size;
  let tpoOfBall = ball.y;
  let topOfgameObject = brick.y;
  let gameObjectLefte = brick.x;
  let gameObjectRight = brick.x + brick.width;
  let gameObjectbottom = brick.y + brick.height;
  if (
    bottomOfBall >= topOfgameObject &&
    tpoOfBall <= gameObjectbottom &&
    ball.x >= gameObjectLefte &&
    ball.x + ball.size <= gameObjectRight
  ) {
    return true;
  } else {
    return false;
  }
}
class Ball {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.size = 8;
    this.game = game;
    this.color = "red";
    this.reset();
  }
  reset() {
    this.speed = { x: 2, y: -2 };
    this.x = 10;
    this.y = 400;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  update(deltaTime) {
    this.x += this.speed.x;
    this.y += this.speed.y;
    if (this.x - this.size < 0 || this.x + this.size > this.gameWidth) {
      this.speed.x = -this.speed.x;
    }
    if (this.y - this.size < 0 || this.y + this.size > this.gameHeight) {
      this.speed.y = -this.speed.y;
    }

    if (collisionCheck(this, this.game.paddle)) {
      this.speed.y = -this.speed.y;
      this.y = this.game.paddle.y - this.size;
    }
    if (this.y + this.size >= this.gameHeight) {
      this.game.lives -= 1;
      this.reset();
      this.x = Math.random() * this.gameWidth;
      this.y = 450;
    }
  }
}

class Brick {
  constructor(game, x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 24;
    this.game = game;
    this.marcked = false;
    this.heu = Math.random() * 255;
  }
  update() {
    let bottomOfBall = this.game.ball.y + this.game.ball.size;
    let tpoOfBall = this.game.ball.y;
    let topOfgameObject = this.y;
    let gameObjectLefte = this.x;
    let gameObjectRight = this.x + this.width;
    let gameObjectbottom = this.y + this.height;
    if (
      bottomOfBall >= topOfgameObject &&
      tpoOfBall <= gameObjectbottom &&
      this.game.ball.x >= gameObjectLefte &&
      this.game.ball.x + 8 <= gameObjectRight
    ) {
      this.game.ball.speed.y = -this.game.ball.speed.y;
      this.game.ball.color = `hsl(${this.heu}, 100%, 50%)`;
      this.game.scor += 10;
      this.marcked = true;
    }
  }
  draw(ctx) {
    ctx.fillStyle = `hsl(${this.heu}, 80%, 45%)`;
    ctx.strokeStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

function buildLevel(game, level) {
  let bricks = [];
  game.levels[game.currentlevel].forEach((row, rowIndex) => {
    row.forEach((brick, brickIndex) => {
      if (brick === 1) {
        let x = 80 * brickIndex;
        let y = 75 + 24 * rowIndex;
        bricks.push(new Brick(game, x, y));
      }
    });
  });
  return bricks;
}
const level3 = [
  [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const level2 = [
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const level1 = [
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
];
let x = 1;
const Rle = [
  [x, x, x, x, x, x, x, x, x, x],
  [x, x, x, x, x, x, x, x, x, x],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [x, x, x, x, x, x, x, x, x, x],
];
// =========================================================================
const gameState = {
  paused: 0,
  running: 1,
  menu: 2,
  gameOver: 3,
  newLevel: 4,
};

class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameState = gameState.menu;
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    this.gameObject = [];
    this.bricks = [];
    this.levels = [level1, level2, level3];
    this.currentlevel = 0;
    this.lives = 3;
    this.scor = 0;
    new inputHandler(this.paddle, this);
  }
  start() {
    if (
      this.gameState !== gameState.menu &&
      this.gameState !== gameState.newLevel
    )
      return;
    this.bricks = buildLevel(this, this.lives[this.currentlevel]);
    this.ball.reset();
    this.gameObject = [this.ball, this.paddle];
    this.gameState = gameState.running;
  }
  restart() {
    if (this.gameState !== gameState.gameOver) return;
    this.lives = 3;
    this.currentlevel = 0;
    this.scor = 0;
    this.paddle.x = gameWidth / 2 - this.paddle.width / 2;
    this.bricks = buildLevel(this, this.lives[this.currentlevel]);
    this.gameState = gameState.running;
  }
  update(deltaTime) {
    if (this.lives === 0) this.gameState = gameState.gameOver;
    if (
      this.gameState === gameState.paused ||
      this.gameState === gameState.gameOver ||
      this.gameState === gameState.menu
    )
      return;
    if (this.bricks.length === 0) {
      this.gameState = gameState.newLevel;
      this.levels.push(Rle);
      this.currentlevel++;
      this.lives = 3;
      if (this.ball.speed.x < 5) {
        this.ball.speed.x += 0.1;
        this.ball.speed.y += 0.1;
      }
      // console.log(this.currentlevel)
      this.start();
    }
    [...this.gameObject, ...this.bricks].forEach((object) =>
      object.update(deltaTime)
    );
    this.bricks = this.bricks.filter((brick) => !brick.marcked);
  }
  draw(ctx) {
    [...this.gameObject, ...this.bricks].forEach((object) => object.draw(ctx));
    if (this.gameState === gameState.paused) {
      ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = `30px Arial`;
      ctx.fillStyle = `White`;
      ctx.textAlign = `center`;
      ctx.fillText(`scor: ${this.scor}`, 70, 50);
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === gameState.menu) {
      ctx.fillStyle = `rgba(0, 0, 0, 1)`;
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = `30px Arial`;
      ctx.fillStyle = `White`;
      ctx.textAlign = `center`;
      ctx.fillText("Press SPACEBAR", this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillText(
        "to start playing",
        this.gameWidth / 2,
        this.gameHeight / 2 - 40
      );
    }
    if (this.gameState === gameState.gameOver) {
      ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = `30px Arial`;
      ctx.fillStyle = `White`;
      ctx.textAlign = `center`;
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillText(
        `your scor: ${this.scor}`,
        this.gameWidth / 2,
        this.gameHeight / 2 + 50
      );
      ctx.fillText(
        `Press ENTER to play agen`,
        this.gameWidth / 2,
        this.gameHeight / 2 + 100
      );
    }
    if (this.gameState === gameState.running) {
      ctx.font = `30px Arial`;
      ctx.fillStyle = `black `;
      ctx.textAlign = `center`;
      ctx.fillText(`lives: ${this.lives}`, this.gameWidth - 70, 50);
      ctx.fillText(`scor: ${this.scor}`, 70, 50);
    }
  }
  togglePause() {
    if (this.gameState === gameState.paused) {
      this.gameState = gameState.running;
    } else {
      this.gameState = gameState.paused;
    }
  }
}
let game = new Game(gameWidth, gameHeight);

let lastTime = 0;
function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
