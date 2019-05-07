const { players } = require("../components/player");
const { bullets } = require("../components/bullet");
const { incrementScore } = require("../scoreboard/scoreboard.js");
module.exports = checkCollisions = () => {
  for (let player of players) {
    for (let bullet of bullets) {
      if (
        (bullet.x + 5 <= player.x + player.health * 10 &&
          bullet.x + 5 >= player.x &&
          bullet.y + 5 <= player.y + player.health * 10 &&
          bullet.y + 5 >= player.y) ||
        (bullet.x - 5 <= player.x + player.health * 10 &&
          bullet.x - 5 >= player.x &&
          bullet.y - 5 <= player.y + player.health * 10 &&
          bullet.y - 5 >= player.y)
      ) {
        if (bullet.id !== player.id) {
          bullet.x = 1000;
          bullet.y = 1000;
          player.health--;
          if (player.health <= 1) {
            for (let i = 0; i < players.length; i++) {
              if (players[i].id === bullet.id) {
                if (players[i.user] !== "") {
                  incrementScore(players[i].user);
                }
              }
            }
          }
        }
      }
    }
  }
};
