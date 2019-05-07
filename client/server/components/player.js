const Grapple = require("./grapple");
class Player {
  constructor(x, y, id, user) {
    this.id = id;
    this.user = user;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0.098;
    this.health = 10;
  }
  fireGrapple(xFinal, yFinal) {
    if (this.grapple === null) {
      this.grapple = new Grapple(this.x, this.y, xFinal, yFinal);
    } else {
      this.grapple = null;
    }
  }
  update() {
    this.vx += this.ax;
    this.x += this.vx;
    this.vy += this.ay;
    this.y += this.vy;
    if (this.x + this.health * 10 > 800) {
      this.x = 800 - this.health * 10;
      this.vx = -this.vx;
      // this.ax = -this.ax
    }
    if (this.x <= 0) {
      this.x = 0;
      this.vx = -this.vx;
      // this.ax = -this.ax
    }
    if (this.y <= 0) {
      this.y = 0;
      this.vy = -this.vy;
    }
    if (this.y + this.health * 10 > 800) {
      this.y = 800 - this.health * 10;
      this.vy = -this.vy;
    }
    if (this.vx > 8) {
      this.vx = 8;
    }
    if (this.vx < -8) {
      this.vx = -8;
    }
    if (this.vy > 8) {
      this.vy = 8;
    }
    if (this.vy < -8) {
      this.vy = -8;
    }
    // if(this.)
    // if (this.x + this.health * 10 > 400 && (this.y   )
    if (this.grapple && this.grapple.growing) {
      this.grapple.update(this.x, this.y);
    } else if (this.grapple && !this.grapple.growing) {
      this.ax = 6 * Math.cos(this.grapple.dir);
      this.ay = 6 * Math.sin(this.grapple.dir);
    }
    if (!this.grapple) {
      this.ax = 0;
      this.ay = 0.098;
    }
  }
}
let players = [];
const playerLoopUpdate = socket => {
  for (let i = 0; i < players.length; i++) {
    players[i].update();
    if (players[i].health <= 0) {
      players.splice(i, 1);
    }
  }
  socket.emit("playerUpdate", players);
};
module.exports = {
  Player,
  players,
  playerLoopUpdate
};
