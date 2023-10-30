import * as Phaser from "phaser";
import Scenes from "./scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  pixelArt: false,
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: {
        y: 1,
      },
    },
  },
  scene: Scenes,
};

new Phaser.Game(config);
