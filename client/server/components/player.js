const Grapple = require("./grapple");
class Player {
  constructor(x, y, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0.098;
  }
  fireGrapple(xFinal, yFinal) {
    this.grapple = new Grapple(this.x, this.y, xFinal, yFinal);
  }
  update() {
    this.vx += this.ax;
    this.x += this.vx;
    this.vy += this.ay;
    this.y += this.vy;
    if (this.x > 800) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = 800;
    }
    if (this.y < 0) {
      this.y = 800;
    }
    if (this.y > 800) {
      this.y = 0;
    }
    if (this.vx > 10) {
      this.vx = 10;
    }
    if (this.vx < -10) {
      this.vx = -10;
    }
    if (this.vy > 10) {
      this.vy = 10;
    }
    if (this.vy < -10) {
      this.vy = 10;
    }
    if (this.grapple && this.grapple.growing) {
      this.grapple.update();
    }
  }
}
let players = [];
const playerLoopUpdate = () => {
  for (let player of players) {
    player.update();
  }
};
module.exports = {
  Player,
  players,
  playerLoopUpdate
};
