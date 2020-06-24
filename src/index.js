import "./styles/styles.scss";

import { getRandom, createDimArr } from "./functions.js";

class Tetris {
  constructor() {
    this.plane = document.getElementById("game");
    this.allSquares = createDimArr(15, 10);
    this.shapes = ["L", "J", "O", "I", "S", "Z", "T"];
    this.shapeType = null;
    this.squareSize = 40;
    this.shape = [];
    this.intervalPlay = null;
    this.intervalStep = 1000;
    this.intervalStepQuick = 50;
    this.play = false;
    this.lost = false;
    this.ArrowDownPressed = false;
    this.rotationPair = {
      "0,-1": { left: this.squareSize, top: this.squareSize },
      "1,0": { left: -this.squareSize, top: this.squareSize },
      "0,1": { left: -this.squareSize, top: -this.squareSize },
      "-1,0": { left: this.squareSize, top: -this.squareSize },
      "1,1": { left: -2 * this.squareSize, top: 0 },
      "-1,1": { left: 0, top: -2 * this.squareSize },
      "-1,-1": { left: 2 * this.squareSize, top: 0 },
      "1,-1": { left: 0, top: 2 * this.squareSize },
      "0,-2": { left: 2 * this.squareSize, top: 2 * this.squareSize },
      "2,0": { left: -2 * this.squareSize, top: 2 * this.squareSize },
      "0,2": { left: -2 * this.squareSize, top: -2 * this.squareSize },
      "-2,0": { left: 2 * this.squareSize, top: -2 * this.squareSize }
    };

    this.makeShape(this.shapes[getRandom(0, this.shapes.length - 1)]);
  }
  makeShape(type) {
    this.shapeType = type;
    this.shape = [];
    for (let i = 1; i <= 4; i++) {
      let square = document.createElement("div");
      square.className = "square square_" + i + " shape_" + type;
      this.shape.push(square);
      this.plane.appendChild(square);
    }
  }
  togglePlay() {
    if (!this.play && !this.lost) {
      this.start();
    } else if (this.play && !this.lost) {
      this.pause();
    } else {
      this.restart();
    }
  }
  start() {
    this.play = true;
    this.intervalPlay = setInterval(
      this.playGame.bind(this),
      this.intervalStep
    );
  }
  playGame() {
    if (
      !this.shapeOutside(this.shape, { left: 0, top: this.squareSize }) &&
      !this.shapeOnSquares(this.shape, { left: 0, top: this.squareSize })
    ) {
      this.moveEach();
    } else {
      this.addToAllSquares();
      this.makeShape(this.shapes[getRandom(0, this.shapes.length - 1)]);
    }
  }
  pause() {
    this.play = false;
    clearInterval(this.intervalPlay);
  }
  restart() {
    this.play = false;
    clearInterval(this.intervalPlay);
  }
  moveEach() {
    if (true) {
      for (let i = 0; i < this.shape.length; i++) {
        this.shape[i].style.top =
          this.shape[i].offsetTop + this.squareSize + "px";
      }
    }
  }
  moveDown() {
    if (this.play === true && !this.ArrowDownPressed) {
      clearInterval(this.intervalPlay);
      this.intervalPlay = setInterval(
        this.playGame.bind(this),
        this.intervalStepQuick
      );
    }
    this.ArrowDownPressed = true;
  }
  stopMoveDown() {
    if (this.play === true) {
      clearInterval(this.intervalPlay);
      this.intervalPlay = setInterval(
        this.playGame.bind(this),
        this.intervalStep
      );
    }
    this.ArrowDownPressed = false;
  }
  addToAllSquares() {
    for (let i = 0; i < this.shape.length; i++) {
      let rowIndex = this.shape[i].offsetTop / this.squareSize; // top
      let columnIndex = this.shape[i].offsetLeft / this.squareSize; // left
      this.allSquares[rowIndex][columnIndex] = this.shape[i];
    }
  }
  slide(direction) {
    if (this.play === true) {
      if (direction === "left") {
        this.slideEach(-this.squareSize);
      } else {
        this.slideEach(this.squareSize);
      }
    }
  }
  slideEach(val) {
    if (
      !this.shapeOutside(this.shape, { left: val, top: 0 }) &&
      !this.shapeOnSquares(this.shape, { left: val, top: 0 })
    ) {
      // if (!this.onWall(val) & !this.onSquares(val)) {
      for (let i = 0; i < this.shape.length; i++) {
        this.shape[i].style.left = this.shape[i].offsetLeft + val + "px";
      }
    }
  }
  rotate() {
    if (this.play === true && this.shapeType !== "O" && this.allowRotate()) {
      let pivot = this.shape[1];
      for (let i = 0; i < this.shape.length; i++) {
        if (i !== 1) {
          let relPos = [
            (this.shape[i].offsetLeft - pivot.offsetLeft) / this.squareSize,
            (this.shape[i].offsetTop - pivot.offsetTop) / this.squareSize
          ];
          let key = relPos[0].toString() + "," + relPos[1];

          this.shape[i].style.left =
            this.shape[i].offsetLeft + this.rotationPair[key].left + "px";
          this.shape[i].style.top =
            this.shape[i].offsetTop + this.rotationPair[key].top + "px";
        }
      }
    }
  }
  allowRotate() {
    let pivot = this.shape[1];
    for (let i = 0; i < this.shape.length; i++) {
      if (i !== 1) {
        let relPos = [
          (this.shape[i].offsetLeft - pivot.offsetLeft) / this.squareSize,
          (this.shape[i].offsetTop - pivot.offsetTop) / this.squareSize
        ];
        let key = relPos[0].toString() + "," + relPos[1];
        if (
          this.squareOutside(this.shape[i], this.rotationPair[key]) ||
          this.squareOnSquares(this.shape[i], this.rotationPair[key])
        ) {
          return false;
        }
      }
    }
    return true;
  }

  squareOnSquares(tmpSquare, offset) {
    let newRowIndex = (tmpSquare.offsetTop + offset.top) / this.squareSize;
    let newColumnIndex = (tmpSquare.offsetLeft + offset.left) / this.squareSize;
    if (this.allSquares[newRowIndex][newColumnIndex] != null) {
      return true;
    }
    return false;
  }

  squareOutside(tmpSquare, offset) {
    if (
      tmpSquare.offsetLeft + offset.left < 0 ||
      tmpSquare.offsetLeft + offset.left >
        this.plane.offsetWidth - this.squareSize
    ) {
      return true;
    }
    if (
      tmpSquare.offsetTop + offset.top < 0 ||
      tmpSquare.offsetTop + offset.top >
        this.plane.offsetHeight - this.squareSize
    ) {
      return true;
    }
    return false;
  }
  shapeOutside(tmpShape, offset) {
    for (let i = 0; i < tmpShape.length; i++) {
      if (this.squareOutside(tmpShape[i], offset)) {
        return true;
      }
    }
    return false;
  }
  shapeOnSquares(tmpShape, offset) {
    for (let i = 0; i < tmpShape.length; i++) {
      if (this.squareOnSquares(tmpShape[i], offset)) {
        return true;
      }
    }
    return false;
  }
}

let tetris = new Tetris();

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    tetris.rotate();
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    tetris.moveDown();
  }
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    let rotation = event.key === "ArrowLeft" ? "left" : "right";
    tetris.slide(rotation);
  }
  if (event.key === " ") {
    event.preventDefault();
    tetris.togglePlay();
  }
});
document.addEventListener("keyup", event => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    tetris.stopMoveDown();
  }
});
