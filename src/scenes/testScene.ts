import * as Phaser from "phaser";

import Fruit from "../fruit";
import imgFruit from "../assets/circle.png";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super("testScene");
  }

  preload() {
    this.load.image("fruit", imgFruit);
  }

  create(): void {
    const world = this.matter.world;
    this.matter.world.setBounds(
      0,
      0,
      this.sys.canvas.width,
      this.sys.canvas.height
    );
    this.matter.world.update60Hz();
    this.matter.set60Hz();

    this.input.on(
      "pointerdown",
      function (pointer: Phaser.Input.Pointer) {
        new Fruit(world, pointer.x, pointer.y, 1, Phaser.Math.Between(0, 4));
      },
      this
    );
  }
}
