class Bullet {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
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
const bulletLoopUpdate = () => {
  if (bullets.length !== 0) {
    // console.log(bullets);
    let copy = bullets.slice();
    bulletDataArr = [];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].isOutOfBounds()) {
        bullets.splice(i, 1);
      } else {
        copy[i].update();
        bulletDataArr.push({ x: copy[i].x, y: copy[i].y });
      }
    }
  }
};

module.exports = {
  Bullet,
  bulletLoopUpdate,
  bullets,
  bulletDataArr
};
