let columns = 10;
let lines = 10;
let numOfmines = 8;
let tilesClicked = 0;
let minesLocation = [];
let table = [];
let gameover = false;
let numbOfflags = 0;
let x = [];
let y = [];

window.onload = function() {
  let board = document.getElementById('board');
  for (let i = 0; i < lines; ++i) {
    let row = [];
    for (let j = 0; j < columns; ++j) {
      let cell = document.createElement('div');
      cell.id = i.toString() + "-" + j.toString();
      cell.addEventListener("click", clickCell);
      board.appendChild(cell);
      cell.className = 'myclass';
      row.push(cell);

      cell.oncontextmenu = function(e) {
        e.preventDefault();
        addFlags(cell);
      };
    }
    let stopping = document.createElement('div');
    board.appendChild(stopping);
    stopping.className = 'clear';
    table.push(row);
  }
}

setMines();

function reload() {
  window.location.reload();
}

function clickCell() {
  let cell = this;
  if (minesLocation.includes(cell.id)) {
    gameOver();
    showMines();
    return;
  }

  let coordinates = cell.id.split("-");
  let row = parseInt(coordinates[0]);
  let column = parseInt(coordinates[1]);

  x = [row, row, row - 1, row - 1, row - 1, row + 1, row + 1, row + 1];
  y = [column - 1, column + 1, column - 1, column, column + 1, column - 1, column, column + 1];

  verifyMine(row, column);
}

function addFlags(cell) {
  if (gameover) {
    return;
  }
  if (!cell.classList.contains('checked')) {
    if (!cell.classList.contains('flag') && numbOfflags < numOfmines) {
      cell.classList.add('flag');
      cell.innerHTML = "🚩";
      numbOfflags++;
    } else {
      cell.classList.remove('flag');
      cell.innerHTML = "";
      numbOfflags--;
    }
  }
}

function setMines() {
  let randomMines = numOfmines;
  while (randomMines > 0) {
    let randomLines = Math.floor(Math.random() * lines);
    let randomColumns = Math.floor(Math.random() * columns);
    let id = randomLines.toString() + "-" + randomColumns.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      randomMines -= 1;
    }
  }
}

function showMines() {
  for (let i = 0; i < lines; ++i) {
    for (let j = 0; j < columns; ++j) {
      let cell = table[i][j];
      if (minesLocation.includes(cell.id)) {
        cell.innerHTML = "💣";
        cell.style.backgroundColor = "orange";
      }
    }
  }
}

function verifyMine(row, column) {
  if (table[row][column].classList.contains('tile-clicked')) {
    return;
  }
  if (row < 0 || row >= lines || column < 0 || column >= columns) {
    return;
  }

  table[row][column].classList.add('tile-clicked');
  tilesClicked += 1;

  let minesFound = 0;

  for (let i = 0; i < 7; ++i) {
    minesFound += verifyCell(x[i], y[i]);
  }

  if (minesFound > 0) {
    table[row][column].innerText = minesFound;
    table[row][column].classList.add("x" + minesFound.toString());
  } else {

    for (let i = 0; i < 7; ++i) {
      verifyMine(x[i], y[i]);
    }
  }
  if (tilesClicked == lines * columns - numOfmines) {
    youWon();
  }
}

function verifyCell(row, column) {
  if (row < 0 || row >= lines || column < 0 || column >= columns) {
    return 0;
  } else if (minesLocation.includes(row.toString() + "-" + column.toString())) {
    return 1;
  }
  return 0;
}


function gameOver() {
  gameover = true;
  document.getElementById('text').innerHTML = "Game Over!";
}

function youWon() {
  document.getElementById('text').innerHTML = "You won!";
}
