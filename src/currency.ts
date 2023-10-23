import Phaser from "phaser";

export default abstract class Currency extends Phaser.Physics.Matter.Image {
  protected constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: number,
    options: {}
  ) {
    super(scene.matter.world, x, y, texture, frame, options);
    scene.add.existing(this);
    this.setCollisionGroup(-1);
  }

  public update(...args: any[]): void {
    super.update(...args);
  }

  public onCollisionStart(...args: any[]): void {
    console.log("collisionstart", args);
  }
}
