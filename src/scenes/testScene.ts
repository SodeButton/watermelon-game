import Phaser from "phaser";

import img_chaos_orb from "/src/img/chaos_orb.png";
import img_ex_orb from "/src/img/exalted_orb.png";
import shape_currency from "/src/img/currency.json";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super("testScene");
  }

  preload() {
    this.load.image("chaos_orb", img_chaos_orb);
    this.load.image("ex_orb", img_ex_orb);
    this.load.image("div_orb", img_div_orb);

    this.load.json("shapes", shape_currency);
  }

  create(): void {
    const shapes = this.cache.json.get("shapes");
    console.log(shapes);

    this.matter.world.setBounds(
      0,
      0,
      this.game.config.width,
      this.game.config.height
    );

    this.input.on(
      "pointerdown",
      function (pointer) {
        const chaos_orb = this.matter.add.image(
          pointer.x,
          pointer.y,
          "chaos_orb",
          0,
          { shape: shapes.chaos_orb }
        );
        chaos_orb.setCollisionGroup(1);
        chaos_orb.label = "chaos_orb";
      },
      this
    );

    this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
      console.log("collisionstart", bodyA, bodyB);
      if (bodyA.gameObject === null) return;
      if (bodyA.gameObject.label === bodyB?.gameObject.label) {
        const x = (bodyA.position.x + bodyB.position.x) / 2;
        const y = (bodyA.position.y + bodyB.position.y) / 2;
        const ex_ob = this.scene.matter.add.image(x, y, "ex_orb", 0, {
          shape: shapes.exalted_orb,
        });
        ex_ob.setCollisionGroup(2);
        ex_ob.label = "exalted_orb";
        bodyA.gameObject.destroy();
        bodyB.gameObject.destroy();
      }
    });
  }
}
