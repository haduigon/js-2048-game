"use strict";

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = "idle";
    this.cells = document.getElementsByClassName("field-row");
    this.scoreElement = document.getElementsByClassName("game-score");
    this.count = 0;
  }

  moveLeft() {
    if (this._checkNextStep(this.board, "left")) {
      for (let row = 0; row <= this.board.length - 1; row++) {
        this._compress(this.board[row]);
        this._merge(this.board[row]);
        this._compress(this.board[row]);
      }
      this._renderBoard();
      this._generateNumbers();
    }
  }

  moveRight() {
    if (this._checkNextStep(this.board, "right")) {
      for (let row = 0; row <= this.board.length - 1; row++) {
        this._compressDown(this.board[row]);
        this._mergeDown(this.board[row]);
        this._compressDown(this.board[row]);
      }
      this._renderBoard();
      this._generateNumbers();
    }
  }

  moveUp() {
    if (this._checkNextStep(this.board, "up")) {
      for (let col = 0; col < this.board[0].length; col++) {
        const column = this.board.map((row) => row[col]);

        this._compress(column);
        this._merge(column);
        this._compress(column);

        for (let row = 0; row < this.board.length; row++) {
          this.board[row][col] = column[row];
        }
      }
      this._generateNumbers();

      this._renderBoard();
    }
  }

  moveDown() {
    if (this._checkNextStep(this.board, "down")) {
      for (let col = 0; col < this.board[0].length; col++) {
        const column = this.board.map((row) => row[col]);

        this._compressDown(column);
        this._mergeDown(column);
        this._compressDown(column);

        for (let row = 0; row < this.board.length; row++) {
          this.board[row][col] = column[row];
        }
      }
      this._generateNumbers();

      this._renderBoard();
    }
  }

  _checkMoveDown(array) {
    for (let col = 0; col < array[0].length; col++) {
      const column = array.map((row) => row[col]);

      this._compressDown(column);
      this._mergeDown(column);
      this._compressDown(column);

      for (let row = 0; row < array.length; row++) {
        array[row][col] = column[row];
      }
    }
  }
  _checkMoveUp(array) {
    for (let col = 0; col < array[0].length; col++) {
      const column = array.map((row) => row[col]);

      this._compress(column);
      this._merge(column);
      this._compress(column);

      for (let row = 0; row < array.length; row++) {
        array[row][col] = column[row];
      }
    }
  }
  _checkMoveLeft(array) {
    for (let row = 0; row <= array.length - 1; row++) {
      this._compress(array[row]);
      this._merge(array[row]);
      this._compress(array[row]);
    }
  }
  _checkMoveRight(array) {
    for (let row = 0; row <= array.length - 1; row++) {
      this._compressDown(array[row]);
      this._mergeDown(array[row]);
      this._compressDown(array[row]);
    }
  }

  _checkNextStep(copy, direction) {
    const copyBoard = copy.map((subArray) => subArray.slice());

    switch (direction) {
      case "down":
        this._checkMoveDown(copyBoard);
        break;
      case "up":
        this._checkMoveUp(copyBoard);
        break;
      case "left":
        this._checkMoveLeft(copyBoard);
        break;
      case "right":
        this._checkMoveRight(copyBoard);
        break;
      default:
        break;
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== copyBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  _merge(column) {
    for (let i = 0; i <= column.length - 1; i++) {
      if (column[i] === column[i + 1] && column[i] > 0) {
        column[i] *= 2;

        column[i + 1] = 0;
        this.score += column[i] / 2;
      }
    }
  }

  _mergeDown(column) {
    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1] && column[i] > 0) {
        column[i] *= 2;
        column[i - 1] = 0;
        this.score += column[i] / 2;
      }
    }
  }

  _compress(col) {
    const compressedColumn = col.filter((cell) => cell !== 0);

    while (compressedColumn.length < 4) {
      compressedColumn.push(0);
    }

    col.forEach(function (part, index, array) {
      array[index] = compressedColumn[index];
    });
  }

  _compressDown(col) {
    const compressedColumn = col.filter((cell) => cell !== 0);

    while (compressedColumn.length < 4) {
      compressedColumn.unshift(0);
    }

    col.forEach(function (_part, index, array) {
      array[index] = compressedColumn[index];
    });
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === "idle") {
      this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] =
        2;

      this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] =
        2;
    }

    if (this._getEmptyCells().length !== 14) {
      this.start();
    }

    this.status = "playing";
    this._renderBoard();
  }

  _getEmptyCells() {
    const empty = [];

    for (let line = 0; line <= this.board.length - 1; line++) {
      for (let col = 0; col <= this.board[line].length - 1; col++) {
        if (this.board[line][col] === 0) {
          empty.push([line, col]);
        }
      }
    }

    return empty;
  }

  restart() {
    this.score = 0;

    if (this.count > 0) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.status = "playing";

      this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] =
        2;

      this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] =
        2;
      this._renderBoard();
    }
    this.count = 0;
    this.score = 0;
  }

  _generateNumbers() {
    const empty = this._getEmptyCells();

    this.count++;

    const coords = Math.floor(Math.random() * empty.length);

    const emptyCell = empty[coords];

    if (emptyCell !== undefined) {
      this.board[emptyCell[0]][emptyCell[1]] = this._getNumber();
    }

    this._renderBoard();
  }

  _renderBoard() {
    const startButton = document.getElementById("start-button");
    const messageContainer = document.getElementById("message-container");

    for (let line = 0; line <= this.board.length - 1; line++) {
      for (let col = 0; col <= this.board[line].length - 1; col++) {
        this.cells[line].cells[col].innerText = this.board[line][col];

        this.cells[line].cells[col].classList.value =
          `field-cell field-cell--${this.cells[line].cells[col].innerText}`;

        if (this.board[line][col] === 0) {
          this.cells[line].cells[col].innerText = "";
        }
      }
    }

    if (this.status === "playing") {
      startButton.innerText = "Restart";
      startButton.classList.add("restart");
    }

    if (this.status === "playing") {
      messageContainer.children[2].classList.add("hidden");
      messageContainer.children[1].classList.add("hidden");
      messageContainer.children[0].classList.add("hidden");
    }

    if (this.board.some((row) => row.some((cell) => cell === 2048))) {
      messageContainer.children[1].classList.remove("hidden");
    }

    if (!this._checkLoose()) {
      this.status = "lose";
      messageContainer.children[0].classList.remove("hidden");
    }
    this.scoreElement[0].innerText = this.score;
  }

  _getNumber() {
    const numbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const index = Math.floor(Math.random() * numbers.length);

    return numbers[index];
  }

  _checkLoose() {
    if (this.board.some((row) => row.some((cell) => cell === 0))) {
      return true;
    }

    for (let x = 0; x < this.board.length; x++) {
      for (let i = 0; i < this.board[x].length; i++) {
        if (
          i < this.board[x].length - 1 &&
          this.board[x][i] === this.board[x][i + 1]
        ) {
          return true;
        }

        if (
          x < this.board[x].length - 1 &&
          this.board[x][i] === this.board[x + 1][i]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
