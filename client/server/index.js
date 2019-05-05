const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bullet = require("./components/bullet");
const player = require("./components/player");
app.use(express.static("../public"));

let sockets = [];
io.on("connection", socket => {
  sockets.push(socket);
  console.log(socket);
  let newPlayer = new player.Player(
    Math.random() * 790,
    Math.random() * 790,
    socket.id
  );
  socket.emit("newPlayer", newPlayer);
  player.players.push(newPlayer);

  socket.on("newBullet", bulletData => {
    bullet.bullets.push(
      new bullet.Bullet(bulletData.x, bulletData.y, bulletData.direction)
    );
  });
  socket.on("leave", id => {
    sockets.splice(sockets.indexOf(socket), 1);
    console.log(sockets);
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
  bullet.bulletLoopUpdate();
  player.playerLoopUpdate();
  for (let socket of sockets) {
    socket.emit("playerUpdate", player.players);
    socket.emit("bulletUpdate", bullet.bulletDataArr);
  }
}, 1000 / 30);
server.listen(8000, () => console.log("http://localhost:8000"));
