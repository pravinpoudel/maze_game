"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var rows = 3;
var cols = 3;
var w;
var cellSet = [];
var wall_list = [];
var canvas, ctx, isBreadcumbVisible, IMG;
var removedWallSet = {};
var keyDown = {};
var history = [];
window.addEventListener("keydown", function (e) {
  var key = e.key;
  keyDown[key] = true;
});

function processInput(elapsedTime) {
  if (keyDown.w && canMove("w") && player.y > 0) {
    history.push({
      x: player.x,
      y: player.y
    });
    player.y = player.y - 1;
  }

  if (keyDown.a && canMove("a") && player.x > 0) {
    history.push(player.x * cols + player.y);
    player.x = player.x - 1;
  }

  if (keyDown.s && canMove("s") && player.y < rows - 1) {
    history.push({
      x: player.x,
      y: player.y
    });
    player.y = player.y + 1;
  }

  if (keyDown.d && canMove("d") && player.x < cols - 1) {
    history.push({
      x: player.x,
      y: player.y
    });
    player.x = player.x + 1;
  }

  if (keyDown.b) {
    isBreadcumbVisible = !isBreadcumbVisible;
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


function drawPlayer() {
  ctx.fillStyle = "rgba(0, 255, 0, 1)";
  ctx.fillRect(player.x * w, player.y * w, w, w);
}

function showTrack(cellList) {
  var centerX, centerY;
  ctx.fillStyle = "#df7a12";
  cellList.forEach(function (element, index) {
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
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#4aa1b0cc";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // something in the background
}

function render(time) {
  timeDiv.innerText = Math.floor(time / 1000) + " sec";
  ctx.clearRect(0, 0, canvas.width, canvas.height); // putBackground();

  if (isBreadcumbVisible) {
    showTrack(history);
  }

  drawPlayer();
  drawStartAndEnd(startIndex, endIndex);
  findShortestPath(startPosition, endPosition);
  show();
}

function drawStartAndEnd(startPosition, endPosition) {
  var startY = Math.floor(startPosition / cols);
  var startX = startPosition % cols;
  console.log(startX, startY);
  var endY = Math.floor(endPosition / cols);
  var endX = endPosition % cols; // let startX = cellSet[0][startPosition].x;
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
  var queue = [];
  var distances = new Array(rows * cols).fill(-1);
  console.log(startIndex);
  queue.push(startIndex);
  distances[startIndex] = 0;
  var comb1, comb2;

  var _loop = function _loop() {
    var cellIndex = queue.shift();
    var neighbours = [cellIndex - 1, cellIndex + 1, cellIndex - cols, cellIndex + cols];
    neighbours.filter(function (element, index) {
      comb1 = element + "_" + cellIndex;
      comb2 = cellIndex + "_" + element;

      if ((removedWallSet.hasOwnProperty(comb1) || removedWallSet.hasOwnProperty(comb2)) && element < rows && element < cols && element >= 0) {
        console.log(comb1, comb2);
        return true;
      }
    });

    for (var i = 0; i < neighbours.length; i++) {
      if (distances[neighbours[i]] == -1) {
        distances[neighbours[i]] = distances[cellIndex] + 1;
        queue.push(neighbours[i]);

        if (neighbours[i] == endIndex) {
          return {
            v: distances
          };
        }
      }
    }
  };

  while (queue.length > 0) {
    var _ret = _loop();

    if (_typeof(_ret) === "object") return _ret.v;
  }
}

function findShortestPath(startIndex, endIndex) {
  var distances = findShortestLength(startIndex, endIndex);
  console.log(distances);
  var currentIndex = endIndex;
  var path = [endIndex];
  var currentDistance = distances[endIndex];
  console.log(startIndex, endIndex);

  while (currentDistance > 0) {
    currentDistance = distances[currentIndex];
    var neighbours = [currentIndex - 1, currentIndex + 1, currentIndex - cols, currentIndex + cols];
    neighbours.filter(function (element, index) {
      comb1 = element + "_" + currentIndex;
      comb2 = currentIndex + "_" + element;
      console.log(comb1 + "and" + comb2 + "doesnot have wall" + removedWallSet.hasOwnProperty(comb1) || removedWallSet.hasOwnProperty(comb2));
      return (removedWallSet.hasOwnProperty(comb1) || removedWallSet.hasOwnProperty(comb2)) && element < rows && element < cols && element >= 0;
    });

    for (var i = 0; i < neighbours.length; i++) {
      currentDistance--;

      if (distances[neighbours[i]] == currentDistance) {
        path.push(neighbours[i]);
        break;
      }
    }

    currentIndex = path[path.length - 1];
  }

  for (var _i = 0, length = path.length; _i < length; _i++) {
    var y = Math.floor(path[_i] / cols);
    var x = path[_i] % cols;
    path[_i] = {
      x: x,
      y: y
    };
  }

  showTrack(path);
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
        index: i * cols + j,
        x: i,
        y: j
      }]);
    }
  }

  for (var _i2 = 0; _i2 < rows; _i2++) {
    for (var _j = 0; _j < cols; _j++) {
      var x0 = _i2;
      var y0 = _j;
      var x1 = _i2 + 1;
      var y1 = _j;
      wall_list.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1
      });
      x1 = _i2;
      y1 = _j + 1;
      wall_list.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1
      });
    }
  }

  for (var _i3 = 0, _j2 = cols; _i3 < rows; _i3++) {
    var _x = _i3;
    var _y = _j2;

    var _x2 = _i3 + 1;

    var _y2 = _j2;
    wall_list.push({
      x0: _x,
      y0: _y,
      x1: _x2,
      y1: _y2
    });
  }

  for (var _j3 = 0, _i4 = rows; _j3 < cols; _j3++) {
    var _x3 = _i4;
    var _y3 = _j3;
    var _x4 = _i4;

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

      for (var _i5 = 0; _i5 < cellSet.length; _i5++) {
        for (var _j4 = 0; _j4 < cellSet[_i5].length; _j4++) {
          if (cellSet[_i5][_j4].x == _x5 - 1 && cellSet[_i5][_j4].y == _y5) {
            found1Index = _i5;
            cell1Index = cellSet[_i5][_j4].index;
          }

          if (cellSet[_i5][_j4].x == _x5 && cellSet[_i5][_j4].y == _y5) {
            found2Index = _i5;
            cell1Index = cellSet[_i5][_j4].index;
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

function show() {
  for (var i = 0; i < wall_list.length; i++) {
    start = [wall_list[i].x0 * w, wall_list[i].y0 * w];
    end = [wall_list[i].x1 * w, wall_list[i].y1 * w];
    drawLine(ctx, start, end, "white", 6);
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

setup();
mazeGeneration();
show();
var startPosition;
var endPosition;

do {
  startPosition = randInt(cellSet[0].length);
  endPosition = randInt(cellSet[0].length);
} while (startPosition == endPosition);

console.log(startPosition, endPosition);
var startIndex = cellSet[0][startPosition].index;
var endIndex = cellSet[0][endPosition].index;
console.log("starting cell is " + startPosition + "end cell is " + endIndex);
var trackValue = findShortestLength(startIndex, endIndex);
console.log(startIndex);
var playerY = Math.floor(startIndex / cols);
var playerX = startIndex % cols;
var player = {
  x: playerX,
  y: playerY
};
console.log(player);
ctx.fillStyle = "rgba(0, 255, 0, 1)";
ctx.fillRect(player.x * w, player.y * w, w, w);
var startingTime;
var previousTime;
var timeDiv = document.getElementById("elapsedTime");

function gameLoop(currentTime) {
  if (!startingTime) {
    startingTime = currentTime;
  }

  var elapsedTime = currentTime - startingTime; // update(elapsedTime);

  processInput(elapsedTime);
  render(elapsedTime); // requestAnimationFrame(gameLoop);
}

gameLoop();
//# sourceMappingURL=maze_generator.dev.js.map
