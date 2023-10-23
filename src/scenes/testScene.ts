import Phaser from "phaser";

import img_chaos_orb from "/src/img/chaos_orb.png";
import img_ex_orb from "/src/img/exalted_orb.png";
import img_div_orb from "/src/img/divine_orb.png";
import img_mirror from "/src/img/mirror.png";

import shape_currency from "/src/img/currency.json";

import ChaosOrb from "../chaosOrb.ts";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super("testScene");
  }

  preload() {
    this.load.image("chaos_orb", img_chaos_orb);
    this.load.image("ex_orb", img_ex_orb);
    this.load.image("div_orb", img_div_orb);
    this.load.image("mirror", img_mirror);

    this.load.json("shapes", shape_currency);
  }

  create(): void {
    // const shapes = this.cache.json.get("shapes");
    const scene = this;

    console.log(this.game.config.maxWidth, this.game.config.maxHeight);

    this.matter.world.setBounds(
      0,
      0,
      Number(this.game.config.width),
      Number(this.game.config.height)
    );

    this.input.on(
      "pointerdown",
      function (pointer: Phaser.Input.Pointer) {
        new ChaosOrb(scene, pointer.x, pointer.y);
      },
      this
    );

    // this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
    //   console.log("collisionstart", bodyA, bodyB);
    //   if (bodyA.gameObject === null) return;
    //   if (bodyA.gameObject.label === bodyB?.gameObject.label) {
    //     const x = (bodyA.position.x + bodyB.position.x) / 2;
    //     const y = (bodyA.position.y + bodyB.position.y) / 2;
    //     const ex_ob = this.scene.matter.add.image(x, y, "ex_orb", 0, {
    //       shape: shapes.exalted_orb,
    //     });
    //     ex_ob.setCollisionGroup(2);
    //     ex_ob.label = "exalted_orb";
    //     bodyA.gameObject.destroy();
    //     bodyB.gameObject.destroy();
    //   }
    // });
  }
}
