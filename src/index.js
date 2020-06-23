import "./styles/styles.scss";

import { getRandom, createDimArr } from "./functions.js";

class Tetris {
  constructor() {
    this.plane = document.getElementById("game");
    this.allSquares = createDimArr(15, 10);
    this.shapes = ["L", "J", "O", "I", "S", "Z", "T"];
    // this.shapes = ["L", "S"];
    this.squareSize = 40;
    this.shape = [];
    this.rotation = 0;
    this.position = { top: 0, left: 0 };
    this.intervalPlay = null;
    this.intervalStep = 750;
    this.play = false;
    this.lost = false;
    // this.origin = { top: 0, left: 0 };

    this.makeShape(this.shapes[getRandom(0, this.shapes.length - 1)]);

    // this.onSquares();
    // this.makeShape("Z");
    // for (let i = 0; i < this.allSquares.length; i++) {
    //   console.log(this.allSquares[i].offsetTop, this.allSquares[i].offsetLeft);
    // }
    // console.log(this.plane.offsetLeft, this.plane.offsetTop);
    // console.log(document.elementFromPoint(this.plane.offsetLeft, this.plane.offsetTop));
  }
  makeShape(type) {
    this.shape = [];
    for (let i = 1; i <= 4; i++) {
      let square = document.createElement("div");
      square.className =
        i === 2
          ? "square square_" + i + " shape_" + type + " pivot"
          : "square square_" + i + " shape_" + type;
      this.shape.push(square);
      this.plane.appendChild(square);
    }
  }
  togglePlay() {
    if (!this.play && !this.lost) {
      // start
      this.start();
    } else if (this.play && !this.lost) {
      // pause
      this.pause();
    } else {
      // restart
      this.restart();
    }
  }
  start() {
    this.play = true;
    this.intervalPlay = setInterval(() => {
      this.onSquares();
      if (!this.onFloor() && !this.onSquares(this.squareSize)) {
        this.moveEach();
      } else {
        this.addToAllSquares();
        this.makeShape(this.shapes[getRandom(0, this.shapes.length - 1)]);
      }
    }, this.intervalStep);
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
        this.position.top = this.shape[i].offsetTop + this.squareSize;
        this.shape[i].style.top = this.position.top + "px";
      }
    }
  }
  addToAllSquares() {
    for (let i = 0; i < this.shape.length; i++) {
      let rowIndex = this.shape[i].offsetTop / this.squareSize; // top
      let columnIndex = this.shape[i].offsetLeft / this.squareSize; // left
      this.allSquares[rowIndex][columnIndex] = this.shape[i];
    }
  }
  slide(direction) {
    if (direction === "left") {
      this.slideEach(-this.squareSize);
    } else {
      this.slideEach(this.squareSize);
    }
  }
  slideEach(val) {
    if (!this.onWall(val) & !this.onSquares(0, val)) {
      for (let i = 0; i < this.shape.length; i++) {
        this.position.left = this.shape[i].offsetLeft + val;
        this.shape[i].style.left = this.shape[i].offsetLeft + val + "px";
      }
    }
  }
  onWall(val) {
    for (let i = 0; i < this.shape.length; i++) {
      let newLeftOffset = this.shape[i].offsetLeft + val;
      if (
        newLeftOffset < 0 ||
        newLeftOffset > this.plane.offsetWidth - this.squareSize
      ) {
        return true;
      }
    }
    return false;
  }
  onFloor() {
    for (let i = 0; i < this.shape.length; i++) {
      let newTopOffset = this.shape[i].offsetTop + this.squareSize;
      if (newTopOffset >= this.plane.offsetHeight - this.squareSize) {
        return true;
      }
    }
    return false;
  }
  onSquares(top = 0, left = 0) {
    for (let i = 0; i < this.shape.length; i++) {
      let newRowIndex = (this.shape[i].offsetTop + top) / this.squareSize;
      let newColumnIndex = (this.shape[i].offsetLeft + left) / this.squareSize;
      if (this.allSquares[newRowIndex][newColumnIndex] != null) {
        return true;
      }
    }
    return false;
  }
  rotate(rotation) {
    if (rotation === "left") {
    } else {
    }

    console.log(this.shape.offsetLeft, this.shape.offsetTop);
  }
}

let tetris = new Tetris();

document.addEventListener("keydown", event => {
  if (["ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
    let rotation = event.key === "ArrowUp" ? "left" : "right";
    tetris.rotate(rotation);
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
