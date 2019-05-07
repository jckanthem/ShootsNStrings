// (() => {
let player;
let bullets = [];
let players = [];
let createBullet;
let socket;
let id;
let username;
let team;
let health1;
let health2;
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
    socket.on("newPlayer", newPlayer => {
      player = newPlayer;
      team = player.team;
    });
    socket.on("playerUpdate", updatedPlayers => {
      players = updatedPlayers;
    });
    socket.on("bulletUpdate", updatedBullets => (bullets = updatedBullets));
    socket.on("healthUpdate", healthData => {
      [health1, health2] = healthData.healthPacks;
    });
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
    if (i >= 300 && i < 510) {
      continue;
    }
    line(800, i, 800, i + 10);
  }
  line(400, 300, 800, 300);
  line(400, 310, 790, 310);
  line(790, 310, 790, 375);
  line(810, 310, 810, 375);
  line(790, 425, 790, 500);
  line(810, 425, 810, 500);
  line(790, 375, 810, 375);
  line(790, 425, 810, 425);
  line(400, 500, 790, 500);
  line(400, 510, 800, 510);
  line(400, 300, 400, 310);
  line(400, 500, 400, 510);
  line(800, 300, 1200, 300);
  line(810, 310, 1200, 310);
  line(810, 500, 1200, 500);
  line(800, 510, 1200, 510);
  line(1200, 500, 1200, 510);
  line(1200, 300, 1200, 310);
  for (let bullet of bullets) {
    fill(255);
    circle(bullet.x, bullet.y, bullet.width);
    fill(0);
  }
  if (health1) {
    fill(255, 0, 0);
    beginShape();
    vertex(700, 385);
    vertex(710, 385);
    vertex(710, 400);
    vertex(725, 400);
    vertex(725, 410);
    vertex(710, 410);
    vertex(710, 425);
    vertex(700, 425);
    vertex(700, 410);
    vertex(685, 410);
    vertex(685, 400);
    vertex(700, 400);
    vertex(700, 385);
    endShape();
  }
  if (health2) {
    fill(255, 0, 0);
    beginShape();
    vertex(900, 385);
    vertex(910, 385);
    vertex(910, 400);
    vertex(925, 400);
    vertex(925, 410);
    vertex(910, 410);
    vertex(910, 425);
    vertex(900, 425);
    vertex(900, 410);
    vertex(885, 410);
    vertex(885, 400);
    vertex(900, 400);
    vertex(900, 385);
    endShape();
  }
  if (player && player.health <= 1) {
    background(255, 0, 0);
    socket.emit("newPlayer", { id: socket.id, user: username, team });
    socket.on("newPlayer", newPlayer => (player = newPlayer));
  }
  for (let currPlayer of players) {
    let vel = Math.sqrt(
      currPlayer.vx * currPlayer.vx + currPlayer.vy * currPlayer.vy
    );
    if (currPlayer.id === id) {
      player = currPlayer;
      fill(100, 225, 100);
    } else {
      fill(0);
    }
    rect(
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
    socket.emit("newBullet", {
      direction: dir,
      x: playerX,
      y: playerY,
      id,
      team
    });
  },
  20,
  { leading: true }
);
