class Grapple {
  constructor(x, y, xFinal, yFinal) {
    this.x = x;
    this.y = y;
    this.xCurrent = 0;
    this.yCurrent = 0;
    this.dir = Math.atan2(y - yFinal, x - xFinal);
    this.growing = true;
  }
  update() {
    this.xCurrent += 10 * Math.cos(this.dir);
    this.yCurrent += 10 * Math.sin(this.dir);
  }
}
module.exports = Grapple;
