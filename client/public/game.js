// (() => {
let player;
let bullets = [];
let players = [];
let createBullet;
let socket;
let id;
let username;
function setup() {
  createCanvas(1600, 800);
  background(100, 100, 255);
  fill(0);
  rect(0, 790, 800, 10);
  buildTable([]);

  username = window.prompt("Enter your username");
  socket = io();
  socket.on("connect", () => {
    id = socket.id;
    socket.emit("newPlayer", { id: socket.id, user: username });
    socket.on("newPlayer", newPlayer => (player = newPlayer));
    socket.on("playerUpdate", updatedPlayers => {
      players = updatedPlayers;
    });
    socket.on("bulletUpdate", updatedBullets => (bullets = updatedBullets));
  });

  window.onbeforeunload = () => {
    socket.emit("leave", socket.id);
    socket.disconnect();
  };
}
window.addEventListener("keypress", e => {
  if (e.charCode === 32) {
    sendGrappleRequest(mouseX, mouseY, id);
  }
});
function draw() {
  background(100, 100, 255);
  for (let i = 0; i < 800; i += 20) {
    line(800, i, 800, i + 10);
  }
  line(400, 300, 800, 300);
  line(400, 310, 790, 310);
  line(800, 300, 800, 500);
  line(790, 310, 790, 500);
  line(400, 500, 790, 500);
  line(400, 510, 800, 510);
  line(400, 300, 400, 310);
  line(400, 500, 400, 510);
  line(800, 300, 1200, 300);
  line(810, 310, 1200, 310);
  line(810, 310, 810, 500);
  line(810, 500, 1200, 500);
  line(800, 510, 1200, 510);
  line(1200, 500, 1200, 510);
  line(1200, 300, 1200, 310);
  for (let bullet of bullets) {
    fill(255);
    circle(bullet.x, bullet.y, bullet.width);
    fill(0);
  }
  if (player && player.health <= 1) {
    background(255, 0, 0);
    socket.emit("newPlayer", { id: socket.id, user: username });
    socket.on("newPlayer", newPlayer => (player = newPlayer));
  }
  for (let currPlayer of players) {
    let vel = Math.sqrt(
      currPlayer.vx * currPlayer.vx + currPlayer.vy * currPlayer.vy
    );
    let angle = map(vel, -8, 8, 0, 2 * Math.PI);
    if (currPlayer.id === id) {
      player = currPlayer;
      fill(100, 225, 100);
    } else {
      fill(0);
    }
    let playerRect = rect(
      currPlayer.x,
      currPlayer.y,
      currPlayer.health * 10,
      currPlayer.health * 10
    );
    if (currPlayer.grapple) {
      line(
        currPlayer.x + 5,
        currPlayer.y + 5,
        currPlayer.grapple.xCurrent,
        currPlayer.grapple.yCurrent
      );
    }
  }
  if (mouseIsPressed) {
    let dir = atan2(mouseY - player.y, mouseX - player.x);
    sendBulletRequest(
      dir,
      player.x + (player.health * 10) / 2,
      player.y + (player.health * 10) / 2,
      id
    );
  }
}
setInterval(() => {
  fetch("/scoreboard")
    .then(res => res.json())
    .then(scores => {
      buildTable(scores);
    });
}, 1000);
const buildTable = scores => {
  let table = document.createElement("table");
  let header = document.createElement("tr");
  let nameHeader = document.createElement("th");
  let scoreHeader = document.createElement("th");
  nameHeader.innerHTML = "Player";
  scoreHeader.innerHTML = "Score";
  header.appendChild(nameHeader);
  header.appendChild(scoreHeader);
  table.appendChild(header);
  scores.forEach(score => {
    let row = document.createElement("tr");
    let user = document.createElement("td");
    let userScore = document.createElement("td");
    user.innerHTML = score.user;
    userScore.innerHTML = score.score;
    row.appendChild(user);
    row.appendChild(userScore);
    if (score.user !== "") {
      table.appendChild(row);
    }
  });
  document.getElementById("tableDiv").innerHTML = table.outerHTML;
};
const sendGrappleRequest = _.debounce(
  (xFinal, yFinal, id) => {
    socket.emit("fireGrapple", { xFinal, yFinal, id });
  },
  50,
  { leading: true }
);
const sendBulletRequest = _.debounce(
  (dir, playerX, playerY, id) => {
    socket.emit("newBullet", { direction: dir, x: playerX, y: playerY, id });
  },
  20,
  { leading: true }
);
// })();
