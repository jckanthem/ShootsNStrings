const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bullet = require("./components/bullet");
const player = require("./components/player");
const checkCollisions = require("./utils/checkCollisions");
const { findTop50 } = require("./scoreboard/scoreboard");
app.use(express.static("../public"));

let sockets = [];
io.on("connection", socket => {
  sockets.push(socket);

  socket.on("newPlayer", newPlayerData => {
    let newPlayer = new player.Player(
      Math.random() * 790,
      Math.random() * 790,
      newPlayerData.id,
      newPlayerData.user
    );
    console.log(newPlayer);
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
        bulletData.id
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
});
setInterval(() => {
  for (let socket of sockets) {
    bullet.bulletLoopUpdate(socket);
    player.playerLoopUpdate(socket);
    checkCollisions();
  }
}, 1000 / 60);
app.get("/scoreboard", (req, res) => {
  findTop50((err, docs) => {
    if (err) res.sendStatus(500);
    else res.send(docs);
  });
});
server.listen(8000, () => console.log("http://localhost:8000"));
