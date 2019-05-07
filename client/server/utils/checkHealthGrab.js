const { players } = require("../components/player");
let healthPacks = [true, true];
const checkHealthGrab = socket => {
  for (let player of players) {
    if (healthPacks[0]) {
      if (
        ((player.x + player.health * 10 > 685 &&
          player.x + player.health * 10 < 725) ||
          (player.x > 685 && player.x < 725)) &&
        ((player.y > 385 && player.y < 425) ||
          (player.y + player.health * 10 > 385 &&
            player.y + player.health * 10 < 425))
      ) {
        player.health = 10;
        healthPacks[0] = false;
        setTimeout(() => {
          healthPacks[0] = true;
        }, 5000);
      }
    }
    if (healthPacks[1]) {
      if (
        ((player.x + player.health * 10 > 885 &&
          player.x + player.health * 10 < 925) ||
          (player.x > 885 && player.x < 925)) &&
        ((player.y > 385 && player.y < 425) ||
          (player.y + player.health * 10 > 385 &&
            player.y + player.health * 10 < 425))
      ) {
        player.health = 10;
        healthPacks[1] = false;
        setTimeout(() => {
          healthPacks[1] = true;
        }, 5000);
      }
    }
  }
};

module.exports = {
  checkHealthGrab,
  healthPacks
};
