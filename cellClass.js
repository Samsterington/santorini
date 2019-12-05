class Cell {
  constructor(x, y) {
    this.occ = [false, 0];
    this.toMove = false;
    this.selected = false;
    // this.stack = Math.floor(random(0, 5));
    this.stack = 0;
    this.used = false;
    this.x = x;
    this.y = y;
    this.x2 = x + cellSize;
    this.y2 = y + cellSize;
    this.highlighting = 40;
    this.colour = color(random(200, 230));
    this.highlight = this.colour.levels.map(x => x + this.highlighting);
  }

  over() {
    return (
      mouseX < this.x2 && mouseX > this.x && mouseY < this.y2 && mouseY > this.y
    );
  }

  drawCell() {
    if (this.toMove) {
      fill(0, 255, 0, 5);
    } else if (this.selected || this.over()) {
      fill(this.highlight);
    } else {
      fill(this.colour);
    }
    rect(this.x, this.y, cellSize, cellSize);
    this.drawTowers();
  }

  updateHighlight() {
    this.highlight = this.colour.levels.map(x => x + this.highlighting);
  }

  canMoveTo(i, j) {
    let difference = this.stack - grid[i][j].stack;
    return (
      difference >= -1 && grid[i][j].occ[0] === false && grid[i][j].stack != 4
    );
  }

  searchMoveTo(i, j) {
    stage++;
    grid[i][j].toMove = true;
    let xSearch = [0, 1, 0, 0, -1, -1, 0, 0];
    let ySearch = [-1, 0, 1, 1, 0, 0, -1, -1];
    grid[i][j].selected = true;
    grid[i][j].used = true;
    for (let k = 0; k < 8; k++) {
      i += xSearch[k];
      j += ySearch[k];
      if (i >= 0 && i <= 4 && j >= 0 && j <= 4) {
        if (this.canMoveTo(i, j)) {
          grid[i][j].selected = true;
          grid[i][j].used = true;
        }
      }
    }
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        if (grid[x][y].used === false) {
          grid[x][y].selected = false; // Makes any previously selected cells unselected
        }
      }
    }
  }

  searchBuildOn(i, j) {
    stage++;
    let xSearch = [0, 1, 0, 0, -1, -1, 0, 0];
    let ySearch = [-1, 0, 1, 1, 0, 0, -1, -1];
    grid[i][j].selected = true;
    grid[i][j].used = true;
    for (let k = 0; k < 8; k++) {
      i += xSearch[k];
      j += ySearch[k];
      if (i >= 0 && i <= 4 && j >= 0 && j <= 4) {
        if (this.canBuildOn(i, j)) {
          grid[i][j].selected = true;
          grid[i][j].used = true;
        }
      }
    }
  }

  canBuildOn(i, j) {
    return grid[i][j].stack < 4 && !grid[i][j].occ[0];
  }

  selectable(i, j) {
    if (this.over()) {
      if (stage < 1 && !this.occ[0]) {
        this.choose();
        changeTurn();
        stage++;
      } else if (stage === 1) {
        if (this.occ[0] && this.occ[1] === turn) {
          this.searchMoveTo(i, j);
        }
      } else if (stage === 2) {
        this.move(i, j);
      } else if (stage === 3) {
        this.build();
      }
      // else {
      //   this.selected = !this.selected;
      //   this.used = true;
      //   for (let x = 0; x < 5; x++) {
      //     for (let y = 0; y < 5; y++) {
      //       if (grid[x][y].used === false) {
      //         grid[x][y].selected = false;
      //       }
      //     }
      //   }
      //   this.used = false;
      // }
    }
  }

  drawTowers() {
    for (let i = 0; i <= this.stack; i++) {
      if (i < 4) {
        if (i === this.stack && this.occ[0] === true) {
          let c = 200;
          let d = 0;
          if (this.occ[1] === 1) {
            fill(c, d, d);
          } else if (this.occ[1] === 2) {
            fill(d, d, c);
          }
        } else if (i != 0) {
          fill(0, 0, 0, 20);
        }
        let shift = i * (cellSize / 8.3);
        if (i === 0) {
          if (this.occ[0] && this.stack === 0) {
            let extra = 4;
            rect(
              this.x + shift + extra,
              this.y + shift + extra,
              cellSize - 2 * shift - extra * 2,
              cellSize - 2 * shift - extra * 2,
              10
            );
          } else {
            rect(
              this.x + shift,
              this.y + shift,
              cellSize - 2 * shift,
              cellSize - 2 * shift
            );
          }
        } else {
          if (i === 3 && this.stack === 4) {
            fill(0);
          }
          rect(
            this.x + shift,
            this.y + shift,
            cellSize - 2 * shift,
            cellSize - 2 * shift,
            10 //Tower curves
          );
        }
      }
    }
  }

  move(i, j) {
    if (grid[i][j].used && !grid[i][j].occ[0]) {
      grid[i][j].occ[0] = true;
      grid[i][j].selected = true;
      // Make previous square not occupied
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          if (!grid[x][y].occ[0] || grid[x][y].toMove) {
            if (grid[x][y].toMove) {
              grid[i][j].occ[1] = grid[x][y].occ[1];
              grid[x][y].occ[1] = 0;
            }
            grid[x][y].occ[0] = false;
            grid[x][y].selected = false;
            grid[x][y].toMove = false;
            grid[x][y].used = false;
          }
        }
      }
      if (grid[i][j].stack === 3) {
        fill(50);
        textSize(24);
        let player;
        if (grid[i][j].occ[1] === 1) {
          player = "Red";
        } else {
          player = "Blue";
        }
        text("The " + player + " player wins!", 8, cellSize * 5.25);
        won = true;
      } else {
        this.searchBuildOn(i, j);
      }
    } else {
      stage--;
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          grid[x][y].selected = false;
          grid[x][y].toMove = false;
          grid[x][y].used = false;
        }
      }
    }
  }

  build() {
    if (this.used && !this.occ[0]) {
      stage = 1;
      this.stack++;
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          grid[x][y].selected = false;
          grid[x][y].used = false;
        }
      }
      changeTurn();
    }
  }

  choose() {
    this.occ[0] = true;
    if (stage === -3 || stage === -1) {
      this.occ[1] = 1;
    } else {
      this.occ[1] = 2;
    }
  }
}
