let player;
let bullets = [];
let players = [];
let createBullet;
let socket;
let id;
function setup() {
  createCanvas(800, 800);
  background(100, 100, 255);
  fill(0);
  rect(0, 790, 800, 10);
  // player = new Player(width / 2, height / 2);
  socket = io.connect("http://localhost:8000");
  socket.on("connect", () => {
    id = socket.id;
  });
  socket.on("newPlayer", newPlayer => (player = newPlayer));
  socket.on("playerUpdate", updatedPlayers => (players = updatedPlayers));
  socket.on("bulletUpdate", updatedBullets => (bullets = updatedBullets));
  window.onbeforeunload = () => {
    socket.emit("leave", socket.id);
    console.log("SOCKET ID LEAVE", socket.id);
    socket.disconnect();
  };
}
function draw() {
  background(100, 100, 255);
  // if (player.grappling && !player.grappleConnected) {
  //   player.grappleUpdate();
  // }
  // if (player.grappleConnected) {
  //   player.grappleConnect();
  // }
  // console.log(players);
  // console.log(player);

  // console.log(bullets);
  for (let bullet of bullets) {
    fill(255);
    circle(bullet.x, bullet.y, 10);
    fill(0);
  }
  // if (keyIsPressed) {
  //   if (keyCode === 32) {
  //     player.grapple();
  //   }
  // }
  for (let currPlayer of players) {
    if ((currPlayer.id = id)) {
      player = currPlayer;
    }
    fill(0);
    rect(player.x, player.y, 10, 30);
  }
  if (mouseIsPressed) {
    let dir = atan2(mouseY - player.y, mouseX - player.x);
    sendBulletRequest(dir, player.x, player.y);
  }
}
const sendBulletRequest = _.debounce(
  (dir, playerX, playerY) => {
    socket.emit("newBullet", { direction: dir, x: playerX, y: playerY });
  },
  50,
  { leading: true }
);
