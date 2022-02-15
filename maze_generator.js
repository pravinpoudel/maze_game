let rows = 15;
let cols = 15;
let w;
let cellSet = [];
let path = [];
let wall_list = [];
let canvas, ctx, IMG;
let removedWallSet = {};
let player;
let startPosition;
let endPosition;
let startIndex, endIndex;
let previousTime = new Date();
let first = true;
let keyDown = {};
let history = [];
let isBreadcumbVisible = true;
let isHintVisible = false;
let isPathVisible = false;
let score = 0;
let gameOver = false;
let scoreList = [];
let playerImage;
let destinationImage;

let buttonDiv = document.getElementById("maze_size");

buttonDiv.onclick = (event) => {
  rows = event.srcElement.dataset.value;
  cols = Number(rows);
  rows = Number(rows);
  first = true;
  cellSet = [];
  removedWallSet = {};
  wall_list = [];
  path = [];
  history = [];
  isBreadcumbVisible = true;
  keyDown = {};
  score = 0;
  gameOver = false;
  gameOverBoard.innerText = "";
  gameLoop();
};

window.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key == "w" || key == "i" || key == "ArrowUp") {
    key = "w";
  }
  if (key == "a" || key == "j" || key == "ArrowLeft") {
    key = "a";
  }
  if (key == "s" || key == "k" || key == "ArrowDown") {
    key = "s";
  }
  if (key == "d" || key == "l" || key == "ArrowRight") {
    key = "d";
  }
  keyDown[key] = true;
});

function processInput(elapsedTime) {
  if (keyDown.w && canMove("w") && player.y > 0) {
    history.push({
      x: player.x,
      y: player.y,
    });
    player.y = player.y - 1;
    updateScore();
  }
  if (keyDown.a && canMove("a") && player.x > 0) {
    history.push({ x: player.x, y: player.y });
    player.x = player.x - 1;
    updateScore();
  }
  if (keyDown.s && canMove("s") && player.y < rows - 1) {
    history.push({
      x: player.x,
      y: player.y,
    });
    player.y = player.y + 1;
    updateScore();
  }
  if (keyDown.d && canMove("d") && player.x < cols - 1) {
    history.push({
      x: player.x,
      y: player.y,
    });
    player.x = player.x + 1;
    updateScore();
  }
  if (keyDown.b) {
    isBreadcumbVisible = !isBreadcumbVisible;
  }
  if (keyDown.h) {
    isHintVisible = !isHintVisible;
  }
  if (keyDown.p) {
    isPathVisible = !isPathVisible;
  }

  keyDown = {};
}

function canMove(key) {
  let checkWall = {};
  if (key == "s") {
    checkWall.x0 = player.x;
    checkWall.y0 = player.y + 1;
    checkWall.x1 = player.x + 1;
    checkWall.y1 = player.y + 1;
  }

  if (key == "d") {
    checkWall.x0 = player.x + 1;
    checkWall.y0 = player.y;
    checkWall.x1 = player.x + 1;
    checkWall.y1 = player.y + 1;
  }

  if (key == "w") {
    checkWall.x0 = player.x;
    checkWall.y0 = player.y;
    checkWall.x1 = player.x + 1;
    checkWall.y1 = player.y;
  }

  if (key == "a") {
    checkWall.x0 = player.x;
    checkWall.y0 = player.y;
    checkWall.x1 = player.x;
    checkWall.y1 = player.y + 1;
  }

  for (let i = 0; i < wall_list.length; i++) {
    if (
      wall_list[i].x0 == checkWall.x0 &&
      wall_list[i].y0 == checkWall.y0 &&
      wall_list[i].x1 == checkWall.x1 &&
      wall_list[i].y1 == checkWall.y1
    ) {
      return false;
    }
  }
  return true;
}
//[0, n)

function updateScore() {
  let playerIndex = player.x + player.y * cols;
  if (playerIndex != endIndex) {
    let correctPosition =
      path[path.length - 2].x + path[path.length - 2].y * cols;
    if (playerIndex == correctPosition) {
      score += 5;
    } else {
      score -= 2;
    }
  }
}

function drawSprite() {
  ctx.drawImage(playerImage, player.x * w, player.y * w, w, w);
  ctx.drawImage(
    destinationImage,
    cellSet[0][endPosition].x * w,
    cellSet[0][endPosition].y * w,
    w,
    w
  );

  // ctx.fillStyle = "rgba(0, 255, 0, 1)";
  // ctx.fillRect(player.x * w, player.y * w, w, w);
}

function showTrack(cellList, color) {
  let centerX, centerY;
  ctx.fillStyle = color;
  cellList.forEach((element, index) => {
    ctx.beginPath();
    centerX = element.x * w + w / 2;
    centerY = element.y * w + w / 2;
    ctx.arc(centerX, centerY, w / 4, 2 * Math.PI, false);
    ctx.fill();
  });
}

function randInt(n) {
  return Math.floor(Math.random() * n);
}

function putBackground() {
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  ctx.fillStyle = "#4aa1b0cc";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // something in the background
}

function render(time) {
  timeDiv.innerText = Math.floor(time / 1000) + " sec";
  scoreBoard.innerText = score;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // putBackground();

  drawStartAndEnd(startPosition, endPosition);
  if (isPathVisible) {
    showTrack(path, "#939ea0");
  }
  if (isBreadcumbVisible) {
    showTrack(history, "#556611");
  }
  if (isHintVisible) {
    if (path.length > 1) {
      let hint = [path[path.length - 2]];
      showTrack(hint, "#939ea0");
    }
  }
  show();
  drawSprite();
  scoreList.push(score);
  if (gameOver) {
    gameOverBoard.innerText = "You Won !!!!";
    highscoreBoard.innerText = Math.max(...scoreList);
  }
}

function drawStartAndEnd(startPosition, endPosition) {
  let startX = cellSet[0][startPosition].x;
  let startY = cellSet[0][startPosition].y;
  let endX = cellSet[0][endPosition].x;
  let endY = cellSet[0][endPosition].y;

  // ctx.drawImage(characterImage, startX.x * w, startY.y * w, w, w);
  // ctx.fillStyle = "rgba(255, 0, 0, 1)";
  // ctx.fillRect(endX * w, endY * w, w, w);
}

function findShortestLength(startIndex, endIndex) {
  let queue = [];
  let distances = new Array(rows * cols).fill(-1);
  queue.push(startIndex);
  distances[startIndex] = 0;
  let comb1, comb2;
  while (queue.length > 0) {
    let cellIndex = queue.shift();
    let neighbours = [cellIndex - cols, cellIndex + cols];
    if (cellIndex % cols == 0) {
      neighbours.push(cellIndex + 1);
    } else if (cellIndex % cols == cols - 1) {
      neighbours.push(cellIndex - 1);
    } else {
      neighbours.push(cellIndex + 1);
      neighbours.push(cellIndex - 1);
    }

    for (let i = 0; i < neighbours.length; i++) {
      // console.log(
      //   "index",
      //   i,
      //   neighbours[i],
      //   comb1,
      //   removedWallSet.hasOwnProperty(comb1),
      //   comb2,
      //   removedWallSet.hasOwnProperty(comb2)
      // );

      comb1 = neighbours[i] + "_" + cellIndex;
      comb2 = cellIndex + "_" + neighbours[i];

      if (!(removedWallSet[comb1] || removedWallSet[comb2])) {
        neighbours.splice(i, 1);
        i--;
      } else if (!(neighbours[i] < rows * cols && neighbours[i] >= 0)) {
        neighbours.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < neighbours.length; i++) {
      if (distances[neighbours[i]] == -1) {
        distances[neighbours[i]] = distances[cellIndex] + 1;
        queue.push(neighbours[i]);
        if (neighbours[i] == endIndex) {
          return distances;
        }
      }
    }
  }
}

function findShortestPath(startIndex, endIndex) {
  let distances = findShortestLength(startIndex, endIndex);
  let cellIndex = endIndex;
  path.push(endIndex);
  let currentDistance = distances[endIndex];
  while (currentDistance > 0) {
    currentDistance = distances[cellIndex];
    let neighbours = [cellIndex - cols, cellIndex + cols];
    if (cellIndex % cols == 0) {
      neighbours.push(cellIndex + 1);
    } else if (cellIndex % cols == cols - 1) {
      neighbours.push(cellIndex - 1);
    } else {
      neighbours.push(cellIndex + 1);
      neighbours.push(cellIndex - 1);
    }
    for (let i = 0; i < neighbours.length; i++) {
      comb1 = neighbours[i] + "_" + cellIndex;
      comb2 = cellIndex + "_" + neighbours[i];

      if (
        !(
          removedWallSet.hasOwnProperty(comb1) ||
          removedWallSet.hasOwnProperty(comb2)
        )
      ) {
        neighbours.splice(i, 1);
        i--;
      } else if (!(neighbours[i] < rows * cols && neighbours[i] >= 0)) {
        neighbours.splice(i, 1);
        i--;
      }
    }

    currentDistance--;
    for (let i = 0; i < neighbours.length; i++) {
      if (distances[neighbours[i]] == currentDistance) {
        path.push(neighbours[i]);
        break;
      }
    }
    cellIndex = path[path.length - 1];
  }

  for (let i = 0, length = path.length; i < length; i++) {
    let y = Math.floor(path[i] / cols);
    let x = path[i] % cols;
    path[i] = {
      x,
      y,
    };
  }
}

function setup() {
  canvas = document.getElementById("mazecanvas");
  ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  w = Math.floor(width / rows);
  h = Math.floor(height / cols);

  img = new Image();
  img.src = "./background.jpg";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      cellSet.push([
        {
          index: i + j * cols,
          x: i,
          y: j,
        },
      ]);
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x0 = i;
      let y0 = j;
      let x1 = i + 1;
      let y1 = j;
      wall_list.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
      });

      x1 = i;
      y1 = j + 1;

      wall_list.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
      });
    }
  }

  for (let i = 0, j = cols; i < rows; i++) {
    let x0 = i;
    let y0 = j;
    let x1 = i + 1;
    let y1 = j;

    wall_list.push({
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
    });
  }

  for (let j = 0, i = rows; j < cols; j++) {
    let x0 = i;
    let y0 = j;
    let x1 = i;
    let y1 = j + 1;
    wall_list.push({
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
    });
  }
}

function mazeGeneration() {
  while (cellSet.length > 1) {
    let n = wall_list.length;
    let found1Index = -1;
    let found2Index = -1;
    let randIndex = randInt(n);
    let cell1Index;
    let cell2Index;
    let removedWallString1;
    let removedWallString2;

    // console.log(randIndex, n, cellSet)
    if (wall_list[randIndex].y0 == wall_list[randIndex].y1) {
      let x0 = wall_list[randIndex].x0;
      let y0 = wall_list[randIndex].y0;
      for (let i = 0; i < cellSet.length; i++) {
        for (let j = 0; j < cellSet[i].length; j++) {
          if (cellSet[i][j].x == x0 && cellSet[i][j].y == y0) {
            found1Index = i;
            cell1Index = cellSet[i][j].index;
          }
          if (cellSet[i][j].x == x0 && cellSet[i][j].y == y0 - 1) {
            found2Index = i;
            cell2Index = cellSet[i][j].index;
          }
        }
      }
    }

    if (wall_list[randIndex].x0 == wall_list[randIndex].x1) {
      let x0 = wall_list[randIndex].x0;
      let y0 = wall_list[randIndex].y0;
      for (let i = 0; i < cellSet.length; i++) {
        for (let j = 0; j < cellSet[i].length; j++) {
          if (cellSet[i][j].x == x0 - 1 && cellSet[i][j].y == y0) {
            found1Index = i;
            cell1Index = cellSet[i][j].index;
          }

          if (cellSet[i][j].x == x0 && cellSet[i][j].y == y0) {
            found2Index = i;
            cell2Index = cellSet[i][j].index;
          }
        }
      }
    }

    if (found1Index >= 0 && found2Index >= 0) {
      if (found1Index != found2Index) {
        for (let m = 0; m < cellSet[found2Index].length; m++) {
          cellSet[found1Index][cellSet[found1Index].length] = {
            ...cellSet[found2Index][m],
          };
        }

        let removedWallString1 = cell1Index + "_" + cell2Index;
        let removedWallString2 = cell2Index + "_" + cell1Index;

        removedWallSet[removedWallString1] = true;
        removedWallSet[removedWallString2] = true;

        wall_list.splice(randIndex, 1);
        cellSet.splice(found2Index, 1);
      }
    }
  }
}

function update(time) {
  let startIndex = player.x + player.y * cols;
  path = [];
  if (startIndex == endIndex) {
    gameOver = true;
    return;
  }
  findShortestPath(startIndex, endIndex);
}
function show() {
  for (let i = 0; i < wall_list.length; i++) {
    start = [wall_list[i].x0 * w, wall_list[i].y0 * w];
    end = [wall_list[i].x1 * w, wall_list[i].y1 * w];
    drawLine(ctx, start, end, "#6b789e", 2);
  }
}

function drawLine(ctx, begin, end, stroke = "white", width = 1) {
  if (stroke) {
    ctx.strokeStyle = stroke;
  }

  if (width) {
    ctx.lineWidth = width;
  }

  ctx.beginPath();
  ctx.moveTo(...begin);
  ctx.lineTo(...end);
  ctx.stroke();
}

function spriteLoad() {
  let characterURL = "./sprites/player.png";
  let destinationURL = "./sprites/destination.png";
  playerImage = new Image();
  playerImage.src = characterURL;
  destinationImage = new Image();
  destinationImage.src = destinationURL;
  playerImage.onload = function () {
    ctx.drawImage(playerImage, player.x * w, player.y * w);
  };
  destinationImage.onload = function () {
    console.log(cellSet[0][endPosition].x * w, cellSet[0][endPosition].y * w);
    ctx.drawImage(
      destinationImage,
      cellSet[0][endPosition].x * w,
      cellSet[0][endPosition].y * w,
      w,
      w
    );
  };
}

function init() {
  setup();
  mazeGeneration();
  do {
    startPosition = randInt(cellSet[0].length);
    endPosition = randInt(cellSet[0].length);
  } while (startPosition == endPosition);

  spriteLoad();

  startIndex = cellSet[0][startPosition].index;
  endIndex = cellSet[0][endPosition].index;

  let trackValue = findShortestLength(startIndex, endIndex);

  player = {
    x: cellSet[0][startPosition].x,
    y: cellSet[0][startPosition].y,
  };

  findShortestPath(startIndex, endIndex);
}

let timeDiv = document.getElementById("elapsedTime");
let scoreBoard = document.getElementById("scoreBoard");

let highscoreBoard = document.getElementById("highscoreBoard");
let gameOverBoard = document.getElementById("gamOverBoard");

function gameLoop(timeStamp) {
  if (first) {
    first = false;
    init();
  }
  let elapsedTime = timeStamp - lastRender;
  processInput(elapsedTime);
  update(elapsedTime);
  render(elapsedTime);
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}
let lastRender = 0;
