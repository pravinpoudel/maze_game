"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var rows = 15;
var cols = 15;
var w;
var cellSet = [];
var path = [];
var wall_list = [];
var canvas, ctx, IMG;
var removedWallSet = {};
var player;
var startPosition;
var endPosition;
var startIndex, endIndex;
var previousTime = new Date();
var first = true;
var keyDown = {};
var history = [];
var isBreadcumbVisible = true;
var isHintVisible = false;
var isPathVisible = false;
var score = 0;
var gameOver = false;
var scoreList = [];
var playerImage;
var destinationImage;
var buttonDiv = document.getElementById("maze_size");

buttonDiv.onclick = function (event) {
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

window.addEventListener("keydown", function (e) {
  var key = e.key;

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
      y: player.y
    });
    player.y = player.y - 1;
    updateScore();
  }

  if (keyDown.a && canMove("a") && player.x > 0) {
    history.push({
      x: player.x,
      y: player.y
    });
    player.x = player.x - 1;
    updateScore();
  }

  if (keyDown.s && canMove("s") && player.y < rows - 1) {
    history.push({
      x: player.x,
      y: player.y
    });
    player.y = player.y + 1;
    updateScore();
  }

  if (keyDown.d && canMove("d") && player.x < cols - 1) {
    history.push({
      x: player.x,
      y: player.y
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
  var checkWall = {};

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

  for (var i = 0; i < wall_list.length; i++) {
    if (wall_list[i].x0 == checkWall.x0 && wall_list[i].y0 == checkWall.y0 && wall_list[i].x1 == checkWall.x1 && wall_list[i].y1 == checkWall.y1) {
      return false;
    }
  }

  return true;
} //[0, n)


function updateScore() {
  var playerIndex = player.x + player.y * cols;

  if (playerIndex != endIndex) {
    var correctPosition = path[path.length - 2].x + path[path.length - 2].y * cols;

    if (playerIndex == correctPosition) {
      score += 5;
    } else {
      score -= 2;
    }
  }
}

function drawSprite() {
  ctx.drawImage(playerImage, player.x * w, player.y * w, w, w);
  ctx.drawImage(destinationImage, cellSet[0][endPosition].x * w, cellSet[0][endPosition].y * w, w, w); // ctx.fillStyle = "rgba(0, 255, 0, 1)";
  // ctx.fillRect(player.x * w, player.y * w, w, w);
}

function showTrack(cellList, color) {
  var centerX, centerY;
  ctx.fillStyle = color;
  cellList.forEach(function (element, index) {
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
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#4aa1b0cc";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // something in the background
}

function render(time) {
  timeDiv.innerText = Math.floor(time / 1000) + " sec";
  scoreBoard.innerText = score;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // putBackground();

  drawStartAndEnd(startPosition, endPosition);

  if (isPathVisible) {
    showTrack(path, "#939ea0");
  }

  if (isBreadcumbVisible) {
    showTrack(history, "#556611");
  }

  if (isHintVisible) {
    if (path.length > 1) {
      var hint = [path[path.length - 2]];
      showTrack(hint, "#939ea0");
    }
  }

  show();
  drawSprite();
  scoreList.push(score);

  if (gameOver) {
    gameOverBoard.innerText = "You Won !!!!";
    highscoreBoard.innerText = Math.max.apply(Math, scoreList);
  }
}

function drawStartAndEnd(startPosition, endPosition) {
  var startX = cellSet[0][startPosition].x;
  var startY = cellSet[0][startPosition].y;
  var endX = cellSet[0][endPosition].x;
  var endY = cellSet[0][endPosition].y; // ctx.drawImage(characterImage, startX.x * w, startY.y * w, w, w);
  // ctx.fillStyle = "rgba(255, 0, 0, 1)";
  // ctx.fillRect(endX * w, endY * w, w, w);
}

function findShortestLength(startIndex, endIndex) {
  var queue = [];
  var distances = new Array(rows * cols).fill(-1);
  queue.push(startIndex);
  distances[startIndex] = 0;
  var comb1, comb2;

  while (queue.length > 0) {
    var cellIndex = queue.shift();
    var neighbours = [cellIndex - cols, cellIndex + cols];

    if (cellIndex % cols == 0) {
      neighbours.push(cellIndex + 1);
    } else if (cellIndex % cols == cols - 1) {
      neighbours.push(cellIndex - 1);
    } else {
      neighbours.push(cellIndex + 1);
      neighbours.push(cellIndex - 1);
    }

    for (var i = 0; i < neighbours.length; i++) {
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

    for (var _i = 0; _i < neighbours.length; _i++) {
      if (distances[neighbours[_i]] == -1) {
        distances[neighbours[_i]] = distances[cellIndex] + 1;
        queue.push(neighbours[_i]);

        if (neighbours[_i] == endIndex) {
          return distances;
        }
      }
    }
  }
}

function findShortestPath(startIndex, endIndex) {
  var distances = findShortestLength(startIndex, endIndex);
  var cellIndex = endIndex;
  path.push(endIndex);
  var currentDistance = distances[endIndex];

  while (currentDistance > 0) {
    currentDistance = distances[cellIndex];
    var neighbours = [cellIndex - cols, cellIndex + cols];

    if (cellIndex % cols == 0) {
      neighbours.push(cellIndex + 1);
    } else if (cellIndex % cols == cols - 1) {
      neighbours.push(cellIndex - 1);
    } else {
      neighbours.push(cellIndex + 1);
      neighbours.push(cellIndex - 1);
    }

    for (var i = 0; i < neighbours.length; i++) {
      comb1 = neighbours[i] + "_" + cellIndex;
      comb2 = cellIndex + "_" + neighbours[i];

      if (!(removedWallSet.hasOwnProperty(comb1) || removedWallSet.hasOwnProperty(comb2))) {
        neighbours.splice(i, 1);
        i--;
      } else if (!(neighbours[i] < rows * cols && neighbours[i] >= 0)) {
        neighbours.splice(i, 1);
        i--;
      }
    }

    currentDistance--;

    for (var _i2 = 0; _i2 < neighbours.length; _i2++) {
      if (distances[neighbours[_i2]] == currentDistance) {
        path.push(neighbours[_i2]);
        break;
      }
    }

    cellIndex = path[path.length - 1];
  }

  for (var _i3 = 0, length = path.length; _i3 < length; _i3++) {
    var y = Math.floor(path[_i3] / cols);
    var x = path[_i3] % cols;
    path[_i3] = {
      x: x,
      y: y
    };
  }
}

function setup() {
  canvas = document.getElementById("mazecanvas");
  ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  w = Math.floor(width / rows);
  h = Math.floor(height / cols);
  img = new Image();
  img.src = "./background.jpg";

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      cellSet.push([{
        index: i + j * cols,
        x: i,
        y: j
      }]);
    }
  }

  for (var _i4 = 0; _i4 < rows; _i4++) {
    for (var _j = 0; _j < cols; _j++) {
      var x0 = _i4;
      var y0 = _j;
      var x1 = _i4 + 1;
      var y1 = _j;
      wall_list.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1
      });
      x1 = _i4;
      y1 = _j + 1;
      wall_list.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1
      });
    }
  }

  for (var _i5 = 0, _j2 = cols; _i5 < rows; _i5++) {
    var _x = _i5;
    var _y = _j2;

    var _x2 = _i5 + 1;

    var _y2 = _j2;
    wall_list.push({
      x0: _x,
      y0: _y,
      x1: _x2,
      y1: _y2
    });
  }

  for (var _j3 = 0, _i6 = rows; _j3 < cols; _j3++) {
    var _x3 = _i6;
    var _y3 = _j3;
    var _x4 = _i6;

    var _y4 = _j3 + 1;

    wall_list.push({
      x0: _x3,
      y0: _y3,
      x1: _x4,
      y1: _y4
    });
  }
}

function mazeGeneration() {
  while (cellSet.length > 1) {
    var n = wall_list.length;
    var found1Index = -1;
    var found2Index = -1;
    var randIndex = randInt(n);
    var cell1Index = void 0;
    var cell2Index = void 0;
    var removedWallString1 = void 0;
    var removedWallString2 = void 0; // console.log(randIndex, n, cellSet)

    if (wall_list[randIndex].y0 == wall_list[randIndex].y1) {
      var x0 = wall_list[randIndex].x0;
      var y0 = wall_list[randIndex].y0;

      for (var i = 0; i < cellSet.length; i++) {
        for (var j = 0; j < cellSet[i].length; j++) {
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
      var _x5 = wall_list[randIndex].x0;
      var _y5 = wall_list[randIndex].y0;

      for (var _i7 = 0; _i7 < cellSet.length; _i7++) {
        for (var _j4 = 0; _j4 < cellSet[_i7].length; _j4++) {
          if (cellSet[_i7][_j4].x == _x5 - 1 && cellSet[_i7][_j4].y == _y5) {
            found1Index = _i7;
            cell1Index = cellSet[_i7][_j4].index;
          }

          if (cellSet[_i7][_j4].x == _x5 && cellSet[_i7][_j4].y == _y5) {
            found2Index = _i7;
            cell2Index = cellSet[_i7][_j4].index;
          }
        }
      }
    }

    if (found1Index >= 0 && found2Index >= 0) {
      if (found1Index != found2Index) {
        for (var m = 0; m < cellSet[found2Index].length; m++) {
          cellSet[found1Index][cellSet[found1Index].length] = _objectSpread({}, cellSet[found2Index][m]);
        }

        var _removedWallString = cell1Index + "_" + cell2Index;

        var _removedWallString2 = cell2Index + "_" + cell1Index;

        removedWallSet[_removedWallString] = true;
        removedWallSet[_removedWallString2] = true;
        wall_list.splice(randIndex, 1);
        cellSet.splice(found2Index, 1);
      }
    }
  }
}

function update(time) {
  var startIndex = player.x + player.y * cols;
  path = [];

  if (startIndex == endIndex) {
    gameOver = true;
    return;
  }

  findShortestPath(startIndex, endIndex);
}

function show() {
  for (var i = 0; i < wall_list.length; i++) {
    start = [wall_list[i].x0 * w, wall_list[i].y0 * w];
    end = [wall_list[i].x1 * w, wall_list[i].y1 * w];
    drawLine(ctx, start, end, "#6b789e", 2);
  }
}

function drawLine(ctx, begin, end) {
  var stroke = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "white";
  var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

  if (stroke) {
    ctx.strokeStyle = stroke;
  }

  if (width) {
    ctx.lineWidth = width;
  }

  ctx.beginPath();
  ctx.moveTo.apply(ctx, _toConsumableArray(begin));
  ctx.lineTo.apply(ctx, _toConsumableArray(end));
  ctx.stroke();
}

function spriteLoad() {
  var characterURL = "./sprites/player.png";
  var destinationURL = "./sprites/destination.png";
  playerImage = new Image();
  playerImage.src = characterURL;
  destinationImage = new Image();
  destinationImage.src = destinationURL;

  playerImage.onload = function () {
    ctx.drawImage(playerImage, player.x * w, player.y * w);
  };

  destinationImage.onload = function () {
    console.log(cellSet[0][endPosition].x * w, cellSet[0][endPosition].y * w);
    ctx.drawImage(destinationImage, cellSet[0][endPosition].x * w, cellSet[0][endPosition].y * w, w, w);
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
  var trackValue = findShortestLength(startIndex, endIndex);
  player = {
    x: cellSet[0][startPosition].x,
    y: cellSet[0][startPosition].y
  };
  findShortestPath(startIndex, endIndex);
}

var timeDiv = document.getElementById("elapsedTime");
var scoreBoard = document.getElementById("scoreBoard");
var highscoreBoard = document.getElementById("highscoreBoard");
var gameOverBoard = document.getElementById("gamOverBoard");

function gameLoop(timeStamp) {
  if (first) {
    first = false;
    init();
  }

  var elapsedTime = timeStamp - lastRender;
  processInput(elapsedTime);
  update(elapsedTime);
  render(elapsedTime);

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

var lastRender = 0;
//# sourceMappingURL=maze_generator.dev.js.map
