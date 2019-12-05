let grid = [];
let cellSize = 100;

// Game situation variables
// 0: new go
// 1: about to move
// 2: move and about to build
// 3: build
let stage = -3;
let turn = 1;
let won = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 5; i++) {
    grid[i] = [];
    for (let j = 0; j < 5; j++) {
      grid[i][j] = new Cell(j * cellSize, i * cellSize);
    }
  }

  // // This makes two random starting squares
  // for (let i = 0; i < 4; i++) {
  //   let picked = false;
  //   while (!picked) {
  //     let x = Math.floor(Math.random() * 5);
  //     let y = Math.floor(Math.random() * 5);
  //     if (!grid[x][y].occ[0]) {
  //       grid[x][y].occ[0] = true;
  //       picked = true;
  //       if (i === 0 || i === 1) {
  //         grid[x][y].occ[1] = 1;
  //       } else {
  //         grid[x][y].occ[1] = 2;
  //       }
  //     }
  //   }
  // }
}

function draw() {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      grid[i][j].drawCell();
    }
  }
  // Which players turn
  let indent = cellSize * 5.2;
  noStroke();
  fill(0);
  textSize(15);
  text("Next move:", indent + 2, 20);
  if (turn === 1) {
    fill(200, 0, 0);
  } else if (turn === 2) {
    fill(0, 0, 200);
  }
  if (won) {
    fill(255);
    stroke(255);
  }
  rect(indent, 30, cellSize * 0.8, cellSize * 0.8, 10);
  stroke(0);
}

function mouseClicked() {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      grid[i][j].selectable(i, j);
    }
  }
}

function changeTurn() {
  if (turn === 1) {
    turn = 2;
  } else {
    turn = 1;
  }
}
