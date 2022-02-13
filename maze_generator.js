const rows = 3;
const cols = 3;
let w;
let cellSet = [];
let wall_list = [];
let canvas, ctx, isBreadcumbVisible, IMG;
let removedWallSet = {};

let keyDown = {};
let history = [];
window.addEventListener("keydown", (e) => {
  let key = e.key;
  keyDown[key] = true;
});

function processInput(elapsedTime) {
  if (keyDown.w && canMove("w") && player.y > 0) {
    history.push({ x: player.x, y: player.y });
    player.y = player.y - 1;
  }
  if (keyDown.a && canMove("a") && player.x > 0) {
    history.push(player.x * cols + player.y);
    player.x = player.x - 1;
  }
  if (keyDown.s && canMove("s") && player.y < rows - 1) {
    history.push({ x: player.x, y: player.y });
    player.y = player.y + 1;
  }
  if (keyDown.d && canMove("d") && player.x < cols - 1) {
    history.push({ x: player.x, y: player.y });
    player.x = player.x + 1;
  }
  if (keyDown.b) {
    isBreadcumbVisible = !isBreadcumbVisible;
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

function drawPlayer() {
  ctx.fillStyle = "rgba(0, 255, 0, 1)";
  ctx.fillRect(player.x * w, player.y * w, w, w);
}

function showTrack(cellList) {
  let centerX, centerY;
  ctx.fillStyle = "#df7a12";
  cellList.forEach((element, index) => {
    ctx.beginPath();
    centerX = element.x * w + w / 2;
    centerY = element.y * w + w / 2;
    ctx.arc(centerX, centerY, w / 3, 2 * Math.PI, false);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // putBackground();
  if (isBreadcumbVisible) {
    showTrack(history);
  }
  drawPlayer();
  drawStartAndEnd(startIndex, endIndex);
  findShortestPath(startPosition, endPosition);
  show();
}

function drawStartAndEnd(startPosition, endPosition) {
  let startY = Math.floor(startPosition / cols);
  let startX = startPosition % cols;

  console.log(startX, startY);
  let endY = Math.floor(endPosition / cols);
  let endX = endPosition % cols;
  // let startX = cellSet[0][startPosition].x;
  // let startY = cellSet[0][startPosition].y;
  // let endX = cellSet[0][endPosition].x;
  // let endY = cellSet[0][endPosition].y;

  console.log(startPosition, endPosition);
  console.log(startX, startY, endX, endY);

  ctx.fillStyle = "rgba(255, 0, 0, 1)";
  ctx.fillRect(endX * w, endY * w, w, w);

  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(startX * w, startY * w, w, w);
}

function findShortestLength(startIndex, endIndex) {
  let queue = [];
  let distances = new Array(rows * cols).fill(-1);
  console.log(startIndex);
  queue.push(startIndex);
  distances[startIndex] = 0;
  let comb1, comb2;
  while (queue.length > 0) {
    let cellIndex = queue.shift();
    let neighbours = [
      cellIndex - 1,
      cellIndex + 1,
      cellIndex - cols,
      cellIndex + cols,
    ];

    neighbours.filter((element, index) => {
      comb1 = element + "_" + cellIndex;
      comb2 = cellIndex + "_" + element;
      if (
        (removedWallSet.hasOwnProperty(comb1) ||
          removedWallSet.hasOwnProperty(comb2)) &&
        element < rows &&
        element < cols &&
        element >= 0
      ) {
        console.log(comb1, comb2);
        return true;
      }
    });

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
  console.log(distances);
  let currentIndex = endIndex;
  let path = [endIndex];
  let currentDistance = distances[endIndex];
  console.log(startIndex, endIndex);
  while (currentDistance > 0) {
    currentDistance = distances[currentIndex];
    let neighbours = [
      currentIndex - 1,
      currentIndex + 1,
      currentIndex - cols,
      currentIndex + cols,
    ];

    neighbours.filter((element, index) => {
      comb1 = element + "_" + currentIndex;
      comb2 = currentIndex + "_" + element;
      console.log(
        comb1 +
          "and" +
          comb2 +
          "doesnot have wall" +
          removedWallSet.hasOwnProperty(comb1) ||
          removedWallSet.hasOwnProperty(comb2)
      );
      return (
        (removedWallSet.hasOwnProperty(comb1) ||
          removedWallSet.hasOwnProperty(comb2)) &&
        element < rows &&
        element < cols &&
        element >= 0
      );
    });

    for (let i = 0; i < neighbours.length; i++) {
      currentDistance--;
      if (distances[neighbours[i]] == currentDistance) {
        path.push(neighbours[i]);
        break;
      }
    }
    currentIndex = path[path.length - 1];
  }

  for (let i = 0, length = path.length; i < length; i++) {
    let y = Math.floor(path[i] / cols);
    let x = path[i] % cols;
    path[i] = { x, y };
  }

  showTrack(path);
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
      cellSet.push([{ index: i * cols + j, x: i, y: j }]);
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
            cell1Index = cellSet[i][j].index;
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

function show() {
  for (let i = 0; i < wall_list.length; i++) {
    start = [wall_list[i].x0 * w, wall_list[i].y0 * w];
    end = [wall_list[i].x1 * w, wall_list[i].y1 * w];
    drawLine(ctx, start, end, "white", 6);
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

setup();
mazeGeneration();
show();

let startPosition;
let endPosition;

do {
  startPosition = randInt(cellSet[0].length);
  endPosition = randInt(cellSet[0].length);
} while (startPosition == endPosition);

console.log(startPosition, endPosition);
let startIndex = cellSet[0][startPosition].index;
let endIndex = cellSet[0][endPosition].index;

console.log("starting cell is " + startPosition + "end cell is " + endIndex);
let trackValue = findShortestLength(startIndex, endIndex);

console.log(startIndex);
let playerY = Math.floor(startIndex / cols);
let playerX = startIndex % cols;

const player = {
  x: playerX,
  y: playerY,
};

console.log(player);
ctx.fillStyle = "rgba(0, 255, 0, 1)";
ctx.fillRect(player.x * w, player.y * w, w, w);

let startingTime;
let previousTime;
let timeDiv = document.getElementById("elapsedTime");
function gameLoop(currentTime) {
  if (!startingTime) {
    startingTime = currentTime;
  }
  let elapsedTime = currentTime - startingTime;
  // update(elapsedTime);
  processInput(elapsedTime);
  render(elapsedTime);
  // requestAnimationFrame(gameLoop);
}

gameLoop();
