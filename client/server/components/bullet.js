class Bullet {
  constructor(x, y, dir, id) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.id = id;
    this.width = 10;
  }
  update() {
    this.x += 20 * Math.cos(this.dir);
    this.y += 20 * Math.sin(this.dir);
  }
  isOutOfBounds() {
    if (this.x > 800 || this.x < 0 || this.y > 800 || this.y < 0) {
      return true;
    }
    return false;
  }
}
let bullets = [];
let bulletDataArr = [];
const bulletLoopUpdate = socket => {
  if (bullets.length !== 0) {
    let copy = bullets.slice();
    bulletDataArr = [];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].isOutOfBounds()) {
        bullets.splice(i, 1);
      } else {
        copy[i].update();
        bulletDataArr.push({
          x: copy[i].x,
          y: copy[i].y,
          width: copy[i].width
        });
      }
    }
    socket.emit("bulletUpdate", bulletDataArr);
  }
};

module.exports = {
  Bullet,
  bulletLoopUpdate,
  bullets,
  bulletDataArr
};
