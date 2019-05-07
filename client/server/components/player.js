const Grapple = require("./grapple");
class Player {
  constructor(x, y, id, user, team) {
    this.id = id;
    this.user = user;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0.098;
    this.health = 10;
    this.team = team;
  }
  fireGrapple(xFinal, yFinal) {
    if (this.grapple === null) {
      this.grapple = new Grapple(this.x, this.y, xFinal, yFinal, this.team);
    } else {
      this.grapple = null;
    }
  }
  update() {
    this.vx += this.ax;
    this.x += this.vx;
    this.vy += this.ay;
    this.y += this.vy;
    if (this.x + this.health * 10 > 800 && this.team === 0) {
      this.x = 800 - this.health * 10;
      this.vx = -this.vx;
    }
    if (this.x <= 0) {
      this.x = 0;
      this.vx = -this.vx;
    }
    if (this.x + this.health * 10 > 1600) {
      this.x = 1600 - this.health * 10;
      this.vx = -this.vx;
    }
    if (this.x < 800 && this.team === 1) {
      this.x = 800;
      this.vx = -this.vx;
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
    if (
      (this.x + this.health * 10 - 10 < 400 &&
        this.x + this.health * 10 > 400 &&
        this.y < 510 &&
        this.y + this.health * 10 > 500) ||
      (this.x + this.health * 10 - 10 < 400 &&
        this.x + this.health * 10 > 400 &&
        this.y < 310 &&
        this.y + this.health * 10 > 300)
    ) {
      this.vx = -this.vx;
      this.x = 400 - this.health * 10;
    } else if (
      this.x < 800 &&
      this.x + this.health * 10 > 400 &&
      this.y < 510 &&
      this.y + this.health * 10 > 500
    ) {
      if (this.vy > 0) {
        this.y = 500 - this.health * 10;
      } else {
        this.y = 510;
      }
      this.vy = -this.vy;
    } else if (
      this.x < 800 &&
      this.x + this.health * 10 > 400 &&
      this.y < 310 &&
      this.y + this.health * 10 > 300
    ) {
      if (this.vy > 0) {
        this.y = 300 - this.health * 10;
      } else {
        this.y = 310;
      }
      this.vy = -this.vy;
    }
    if (
      (this.x < 1200 &&
        this.x + 10 > 1200 &&
        this.y < 510 &&
        this.y + this.health * 10 > 500) ||
      (this.x < 1200 &&
        this.x + 10 > 1200 &&
        this.y < 310 &&
        this.y + this.health * 10 > 300)
    ) {
      this.vx = -this.vx;
      this.x = 1200;
    } else if (
      this.x < 1200 &&
      this.x + this.health * 10 > 800 &&
      this.y < 510 &&
      this.y + this.health * 10 > 500
    ) {
      if (this.vy > 0) {
        this.y = 500 - this.health * 10;
      } else {
        this.y = 510;
      }
      this.vy = -this.vy;
    } else if (
      this.x < 1200 &&
      this.x + this.health * 10 > 800 &&
      this.y < 310 &&
      this.y + this.health * 10 > 300
    ) {
      if (this.vy > 0) {
        this.y = 300 - this.health * 10;
      } else {
        this.y = 310;
      }
      this.vy = -this.vy;
    }
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
