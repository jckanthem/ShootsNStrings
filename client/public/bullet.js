class Bullet {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }
  update() {
    this.x += 20 * Math.cos(this.dir);
    this.y += 20 * Math.sin(this.dir);
    fill(255);
    circle(this.x, this.y, 10);
    fill(0);
  }
  isOutOfBounds() {
    if (this.x > width || this.x < 0 || this.y > width || this.y < 0) {
      return true;
    }
    return false;
  }
}
