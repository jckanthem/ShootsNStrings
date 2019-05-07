class Grapple {
  constructor(playerX, playerY, xFinal, yFinal, team) {
    this.x = playerX;
    this.y = playerY;
    this.xCurrent = playerX;
    this.yCurrent = playerY;
    this.dir = Math.atan2(-playerY + yFinal, -playerX + xFinal);
    this.growing = true;
    this.team = team;
  }
  update(playerX, playerY) {
    this.x = playerX;
    this.y = playerY;
    this.xCurrent += 20 * Math.cos(this.dir);
    this.yCurrent += 20 * Math.sin(this.dir);

    if (this.xCurrent > 800 && this.team === 0) {
      this.xCurrent = 800;
      this.growing = false;
      this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
    } else if (this.xCurrent > 1600 && this.team === 1) {
      this.xCurrent = 1600;
      this.growing = false;
      this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
    } else if (this.xCurrent < 0 && this.team === 0) {
      this.xCurrent = 0;
      this.growing = false;
      this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
    } else if (this.xCurrent < 800 && this.team === 1) {
      this.xCurrent = 800;
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
    let xDiff = this.xCurrent - this.x;
    let yDiff = this.yCurrent - this.y;
    let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    let n = Math.floor(dist / 5);
    for (let i = 0; i < n; i++) {
      let x = this.x + (xDiff * i) / n;
      let y = this.y + (yDiff * i) / n;
      if (y > 500 && y < 510 && x > 400 && x < 1200) {
        this.yCurrent = 505;
        this.growing = false;
        this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
        break;
      } else if (y > 300 && y < 310 && x > 400 && x < 1200) {
        this.yCurrent = 305;
        this.growing = false;
        this.dir = Math.atan2(this.yCurrent - this.y, this.xCurrent - this.x);
        break;
      }
    }
  }
}
module.exports = Grapple;
