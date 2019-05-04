let player;
let bullets = [];
let createBullet;
let socket;
function setup() {
  createCanvas(800, 800);
  background(100, 100, 255);
  fill(0);
  rect(0, 790, 800, 10);
  player = new Player(width / 2, height / 2);
  createBullet = _.debounce(
    dir => {
      bullets.push(new Bullet(player.x + 5, player.y + 10, dir));
    },
    50,
    { leading: true }
  );
  // socket = io.connect("http://localhost:8000");
  // socket.on("test", data => console.log(data));
}
function draw() {
  background(100, 100, 255);
  if (player.grappling && !player.grappleConnected) {
    player.grappleUpdate();
  }
  if (player.grappleConnected) {
    player.grappleConnect();
  }
  bulletsCopy = bullets.slice();
  for (let i = 0; i < bulletsCopy.length; i++) {
    if (bulletsCopy[i].isOutOfBounds()) {
      bullets.splice(i, 1);
    } else {
      bulletsCopy[i].update();
    }
  }
  if (keyIsPressed) {
    console.log(keyCode);
    if (keyCode === 87 || keyCode === 119) {
      // up
      player.move((3 * Math.PI) / 2, 2);
    }
    if (keyCode === 68 || keyCode === 100) {
      // right
      player.move(0, 2);
    }
    if (keyCode === 83 || keyCode === 115) {
      // down
      player.move(Math.PI / 2, 2);
    }
    if (keyCode === 65 || keyCode === 97) {
      // left
      player.move(Math.PI, 2);
    }
    if (keyCode === 32) {
      player.grapple();
    }
  }
  if (mouseIsPressed) {
    let dir = atan2(mouseY - player.y, mouseX - player.x);
    createBullet(dir);
  }
  player.update();
}
