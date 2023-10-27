import Phaser from "phaser";
import Currency from "./currency.ts";

export default class ChaosOrb extends Currency {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "chaos_orb", 0, {
      shape: scene.cache.json.get("shapes").chaos_orb,
    });
    scene.add.existing(this);
    this.setCollisionGroup(1);
    this.name = "chaos_orb";
    this.createVerts();
  }

  public update(...args: any[]): void {
    super.update(...args);
  }

  public onCollisionStart(...args: any[]): void {
    console.log("collisionstart", args);
  }
}
