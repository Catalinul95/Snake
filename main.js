window.onload = function () {
  // game related constants
  const SNAKE_COLOR = '#ff3838';
  const FOOD_COLOR = '#17c0eb';
  const EMPTY_TILE = 0;
  const SNAKE_TILE = 1;
  const FOOD_TILE = 2;
  const TILE_SIZE = 25;
  const COLS = 24;
  const ROWS = 24;
  const DIR_LEFT = 37;
  const DIR_RIGHT = 39;
  const DIR_UP = 38;
  const DIR_DOWN = 40;

  
  // canvas related stuff
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  // game related data
  const tilemap = [];
  let isRunning = true;
  let ticks = 0;
  let maxTicks = 25;
  let score = 0;

  function Snake(length, dir) {
    this.length = length;
    this.dir = dir;
    this.body = [];
  }

  Snake.prototype.init = function () {
    // TODO: make it random
    tilemap[4][5] = SNAKE_TILE;
    tilemap[5][5] = SNAKE_TILE;
    tilemap[6][5] = SNAKE_TILE;
    tilemap[7][5] = SNAKE_TILE;

    this.body.push([4, 5]);
    this.body.push([5, 5]);
    this.body.push([6, 5]);
    this.body.push([7, 5]);
  };

  Snake.prototype.setDir = function (dir) {
    this.dir = dir;
  };

  Snake.prototype.update = function () {
    // get the last body part
    const last = this.body[0];
    // get the first body part
    const first = this.body[this.body.length - 1];

    // add a new body part being the head of the snake
    switch (snake.dir) {
      case DIR_RIGHT:
        this.body.push([first[0] + 1, first[1]]);
        break;
      case DIR_DOWN:
        this.body.push([first[0], first[1] + 1]);
        break;
      case DIR_LEFT:
        this.body.push([first[0] - 1, first[1]]);
        break;
      case DIR_UP:
        this.body.push([first[0], first[1] - 1]);
        break;
    }

    // get the new head
    const head = this.body[this.body.length - 1];

    // check collision with edge and with another part of the snake body
    if (head[0] > 23 || head[1] > 23 || head[0] < 0 || head[1] < 0 || tilemap[head[0]][head[1]] == SNAKE_TILE) {
      isRunning = false;
    } else {

      // generate new food, increse the snake's body and the score
      if (tilemap[head[0]][head[1]] == FOOD_TILE) {
        generateFood();
        score += 10;
      } else {
        // update tilemap to empty
        tilemap[last[0]][last[1]] = EMPTY_TILE;
        // remove the last part from the body of the snake
        this.body.splice(0, 1);
      }

      // update the tilemap
      tilemap[head[0]][head[1]] = SNAKE_TILE;
    }
  };

  // generate random food
  function generateFood() {
    let col = Math.floor(Math.random() * (24 - 1) + 1);
    let row = Math.floor(Math.random() * (24 - 1) + 1);

    if (tilemap[col][row] != 0) {
      generateFood();
    } else {
      tilemap[col][row] = FOOD_TILE;
    }
  }

  // update maxTicks ( snake moves faster)
  function speedUpTheSnake() {
    switch (score) {
      case 50:
        maxTicks = 22;
        break;
      case 100:
        maxTicks = 20;
        break;
      case 150:
        maxTicks = 15;
        break;
      case 200:
        maxTicks = 5;
        break; 
    }
  }
  
  // game related functions
  function initGrid() {
    for (let i = 0; i < COLS; i++) {
      tilemap[i] = [];
      for (let j = 0; j < ROWS; j++) {
        tilemap[i][j] = 0;
      }
    }
  }

  function draw() {
    // draw the entire scene
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (tilemap[i][j] == 1) {
          ctx.fillStyle = SNAKE_COLOR;
          ctx.fillRect(
            i * TILE_SIZE,
            j * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );
        }
        if (tilemap[i][j] == 2) {
          ctx.fillStyle = FOOD_COLOR;
          ctx.fillRect(
            i * TILE_SIZE,
            j * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );
        }
      }
    }

    // change canvas line width and add shadow to the grid
    ctx.lineWidth = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur    = 5;
    ctx.shadowColor   = "#ccc";
    
    // draw the grid
    for (let i = 1; i < 24; i++) {
      ctx.strokeStyle = '#3FC380';
      ctx.beginPath();
      ctx.moveTo(25 * i, 0);
      ctx.lineTo(25 * i, 600);
      ctx.stroke();
    }
    
    for (let i = 1; i < 24; i++) {
      ctx.strokeStyle = '#3FC380';
      ctx.beginPath();
      ctx.moveTo(0, 25 * i);
      ctx.lineTo(600, 25 * i);
      ctx.stroke();
    }
  }

  function loop() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(loop);

    // as long the game is running ( !game over )
    if (isRunning) {
      speedUpTheSnake();

      // time to move the snake
      if (ticks == maxTicks) {
        snake.update();
        ticks = 0;
      }

      draw();
      ticks++;
    } else {
      ctx.textAlign = 'center';
      ctx.font = '30px Arial';
      ctx.fillText('Game Over!', 290, 300);
      ctx.font = '20px Arial';
      ctx.fillText('SCORE: ' + score, 290, 340);
    }
  }
  
  initGrid();
  const snake = new Snake(3, DIR_RIGHT);
  snake.init();
  generateFood();

  loop();

  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case DIR_LEFT:
        if (snake.dir != DIR_RIGHT) {
          snake.setDir(DIR_LEFT);
        }
        break;
      case DIR_UP:
        if (snake.dir != DIR_DOWN) {
          snake.setDir(DIR_UP);
        }
        break;
      case DIR_RIGHT:
        if (snake.dir != DIR_LEFT) {
          snake.setDir(DIR_RIGHT);
        }
        break;
      case DIR_DOWN:
        if (snake.dir != DIR_UP) {
          snake.setDir(DIR_DOWN);
        }
        break;
    }
  });
  
};
