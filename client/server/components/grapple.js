class Grapple {
  constructor(playerX, playerY, xFinal, yFinal) {
    this.x = playerX;
    this.y = playerY;
    this.xCurrent = playerX;
    this.yCurrent = playerY;
    this.dir = Math.atan2(-playerY + yFinal, -playerX + xFinal);
    this.growing = true;
  }
  update(playerX, playerY) {
    this.x = playerX;
    this.y = playerY;
    this.xCurrent += 20 * Math.cos(this.dir);
    this.yCurrent += 20 * Math.sin(this.dir);

    if (this.xCurrent > 800) {
      this.xCurrent = 800;
      this.growing = false;
      this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
    } else if (this.xCurrent < 0) {
      this.xCurrent = 0;
      this.growing = false;
      this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
    } else if (this.yCurrent > 800) {
      this.yCurrent = 800;
      this.growing = false;
      this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
    } else if (this.yCurrent < 0) {
      this.yCurrent = 0;
      this.growing = false;
      this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
    }
    // this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
  }
}
module.exports = Grapple;
