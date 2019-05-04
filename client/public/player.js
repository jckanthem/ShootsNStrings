class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0.098;
    this.grappleX;
    this.grappleY;
    this.grappleCurrX;
    this.grappleCurrY;
    this.grappling = false;
    this.grappleConnected = false;
    // this.grapple = _.debounce(this.grapple, 500, { leading: true });
  }
  update() {
    if (this.grappleConnected) {
      let dir = atan2(this.grappleCurrY - this.y, this.grappleCurrX - this.x);
      let dist =
        (this.grappleCurrX - this.x) * (this.grappleCurrX - this.x) +
        (this.grappleCurrY - this.y) * (this.grappleCurrY - this.y);
      this.ax = 3 * cos(dir);
      this.ay = 3 * sin(dir) + 0.098;
      console.log(this.x, this.y, this.grappleCurrX, this.grappleCurrY);
      if (
        Math.abs(this.x - this.grappleCurrX) < 40 &&
        Math.abs(this.y - this.grappleCurrY) < 40
      ) {
        this.grappleConnected = false;
        this.ay = 0.098;
        this.ax = 0;
        // this.vx = 0;
        // this.vy = 0;
        console.log("here", this.ax, this.ay, this.vx, this.vy);
      }
    }
    if (!this.grappleConnected) {
      this.ay = 0.098;
      this.ax = 0;
    }
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    this.x = constrain(this.x, 0, width - 10);
    this.y = constrain(this.y, 0, height - 30);
    if (this.vx > 10) {
      this.vx = 10;
    }
    if (this.vy > 10) {
      this.vy = 10;
    }
    if (this.vy < -10) {
      this.vy = -10;
    }
    if (this.vx < -10) {
      this.vx = -10;
    }
    if (this.x > width) {
      this.x = width - 20;
      this.vx = 0;
    }
    if (this.x < 0) {
      this.x = 0;
      this.vx = 0;
    }
    if (this.y > width) {
      this.y = height - 30;
      this.vy = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }
    rect(this.x, this.y, 10, 30);
  }
  move(a, mag) {
    this.x += mag * Math.cos(a);
    this.y += mag * Math.sin(a);
    this.x = constrain(this.x, 0, width - 10);
    this.y = constrain(this.y, 0, height - 30);
  }
  grapple() {
    this.grappling = true;
    this.grappleConnected = false;
    this.grappleX = mouseX;
    this.grappleY = mouseY;
    this.grappleCurrX = this.x + 15;
    this.grappleCurrY = this.y + 15;
  }
  grappleUpdate() {
    let dir = atan2(this.grappleY - this.y - 5, this.grappleX - this.x - 5);
    this.grappleCurrX += 20 * Math.cos(dir);
    this.grappleCurrY += 20 * Math.sin(dir);
    if (
      this.grappleCurrX > width + 20 ||
      this.grappleCurrX < 0 ||
      this.grappleCurrY > height + 20 ||
      this.grappleCurrY < 0
    ) {
      this.grappling = false;
      this.grappleConnected = true;
    }
    line(this.x + 5, this.y + 5, this.grappleCurrX, this.grappleCurrY);
  }
  grappleConnect() {
    line(this.x + 5, this.y + 5, this.grappleCurrX, this.grappleCurrY);
  }
}

// if player hit, make height smaller
