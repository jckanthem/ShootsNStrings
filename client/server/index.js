const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bullet = require("./components/bullet");
const player = require("./components/player");
const checkCollisions = require("./utils/checkCollisions");
const { checkHealthGrab, healthPacks } = require("./utils/checkHealthGrab");
const { findTop50 } = require("./scoreboard/scoreboard");
app.use(express.static("../public"));

let sockets = [];
let team = 0;
io.on("connection", socket => {
  sockets.push(socket);
  let xPos;
  if (team === 0) {
    xPos = Math.random() * 300;
  } else {
    xPos = Math.random() * 300 + 1300;
  }
  socket.on("newPlayer", newPlayerData => {
    newTeam = team;
    if (newPlayerData.team !== undefined) {
      newTeam = newPlayerData.team;
      console.log(newPlayerData);
    }
    let newPlayer = new player.Player(
      xPos,
      Math.random() * 700,
      newPlayerData.id,
      newPlayerData.user,
      newTeam
    );
    team === 0 ? (team = 1) : (team = 0);
    socket.emit("newPlayer", newPlayer);
    player.players.push(newPlayer);
    for (let i = 0; i < player.players.length; i++) {
      if (
        player.players[i] !== newPlayer &&
        player.players[i].id === newPlayer.id
      ) {
        player.players.splice(i, 1);
        break;
      }
    }
  });

  socket.on("newBullet", bulletData => {
    bullet.bullets.push(
      new bullet.Bullet(
        bulletData.x,
        bulletData.y,
        bulletData.direction,
        bulletData.id,
        bulletData.team
      )
    );
  });
  socket.on("fireGrapple", grappleData => {
    for (let user of player.players) {
      if (user.id === grappleData.id) {
        user.fireGrapple(grappleData.xFinal, grappleData.yFinal);
      }
    }
  });
  socket.on("leave", id => {
    if (sockets.length === 1) {
      sockets = [];
    }
    sockets.splice(sockets.indexOf(socket), 1);

    for (let i = 0; i < player.players.length; i++) {
      if (player.players[i].id === id) {
        if (player.players.length === 1) {
          player.players = [];
          break;
        }
        player.players.splice(i, 1);
        break;
      }
    }
  });
  socket.on("healthGrab", grabData => {
    for (let socket of sockets) {
      socket.emit("healthGrab", { id: grabData.team });
    }
    for (let player of players) {
      if (player.id === grabData.id) {
        player.health = 10;

        break;
      }
    }
  });
});
setInterval(() => {
  for (let socket of sockets) {
    bullet.bulletLoopUpdate(socket);
    player.playerLoopUpdate(socket);
    checkHealthGrab(socket);
    checkCollisions();
    socket.emit("healthUpdate", { healthPacks });
  }
}, 1000 / 60);

app.get("/scoreboard", (req, res) => {
  findTop50((err, docs) => {
    if (err) res.sendStatus(500);
    else res.send(docs);
  });
});
server.listen(8000, () => console.log("http://localhost:8000"));
