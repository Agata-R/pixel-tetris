import "./styles/styles.scss";

// document.getElementById("app").innerHTML = `
// <h1>Hello Vanilla!</h1>
// <div>
//   We use the same configuration as Parcel to bundle this sandbox, you can find more
//   info about Parcel
//   <a href="shttps://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
// </div>
// `;

class Tetris {
  constructor() {
    this.plane = document.getElementById("game");
    this.allSquares = [];
    this.shapes = ["L", "J", "O", "I", "S", "Z", "T"];
    // this.shapes = ["L", "S"];
    this.squareSize = 40;
    this.shape = [];
    this.rotation = 0;
    this.position = { top: 0, left: 0 };
    this.intervalPlay = null;
    this.intervalStep = 500;
    this.play = false;
    this.lost = false;
    // this.origin = { top: 0, left: 0 };

    this.makeShape(this.shapes[this.getRandom(0, this.shapes.length - 1)]);
    this.onSquares();
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
      square.className = "square square_" + i + " shape_" + type;
      this.allSquares.push(square);
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
      if (!this.onFloor()) {
        this.moveEach();
      } else {
        // leave shape at this position and create next shape
        // clearInterval(this.intervalPlay);

        this.makeShape(this.shapes[this.getRandom(0, this.shapes.length - 1)]);
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
  slide(direction) {
    if (direction === "left") {
      this.slideEach(-this.squareSize);
    } else {
      this.slideEach(this.squareSize);
    }
  }
  slideEach(val) {
    if (!this.onWall(val)) {
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
  onSquares() {
    for (let i = 0; i < this.shape.length; i++) {
      let newTopOffset = this.shape[i].offsetTop; // + this.squareSize;
      console.log(
        document.elementFromPoint(
          this.plane.offsetLeft + this.shape[i].offsetLeft + 20,
          this.plane.offsetTop + newTopOffset + 20
        )
      );
    }
    // return false;
  }
  rotate(rotation) {
    if (rotation === "left") {
      this.rotation = this.rotation + 90 === 360 ? 0 : this.rotation + 90;
    } else {
      this.rotation = this.rotation - 90 === -90 ? 270 : this.rotation - 90;
    }
    this.shape.style.transform = "rotate(" + this.rotation + "deg)";
    // var x = termin.top + Math.cos(angle) * div.height;
    // var y = div.left + Math.sin(angle) * div.height;
    // console.log(this.shape.style.transform);
    // console.log(this.position, this.origin);
    console.log(this.shape.offsetLeft, this.shape.offsetTop);
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

let tetris = new Tetris();
// tetris.makeShape("T");

document.addEventListener("keydown", event => {
  // change snake's direction
  if (["ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault(); // don't scroll page
    let rotation = event.key === "ArrowUp" ? "left" : "right";
    tetris.rotate(rotation);
  }
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault(); // don't scroll page
    let rotation = event.key === "ArrowLeft" ? "left" : "right";
    tetris.slide(rotation);
  }
  // start + restart + pausa: spacja
  if (event.key === " ") {
    event.preventDefault(); // don't scroll page
    tetris.togglePlay();
  }
});
