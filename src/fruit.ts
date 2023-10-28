import * as Phaser from "phaser";
enum FruitType {
  Cherry,
  Strawberry,
  Grape,
  Dekopon,
  Orange,
  Apple,
  Pear,
  Peach,
  Pineapple,
  Melon,
  Watermelon,
}
export default class Fruit extends Phaser.Physics.Matter.Image {
  private readonly fruitType: FruitType;
  private size: number;
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    size: number,
    fruitType: FruitType
  ) {
    super(world, x, y, "fruit", 0, {
      shape: "circle",
      label: "fruit_" + fruitType.toString(),
    });
    this.scene.add.existing(this as Fruit);
    this.setCollisionCategory(1);
    this.setTint(0xff0000);
    this.fruitType = fruitType;
    this.setName(fruitType.toString());
    this.setFruit();
    this.setScale(this.size * 0.3);

    this.setFriction(0);

    this.setOnCollide(
      (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
        if (data.bodyA.gameObject === null) return;
        if (data.bodyB.gameObject === null) return;
        if (this.fruitType === FruitType.Watermelon) return;
        if (
          data.bodyA.label.startsWith("fruit") &&
          data.bodyA.label === data.bodyB.label
        ) {
          const x = (data.bodyA.position.x + data.bodyB.position.x) / 2;
          const y = (data.bodyA.position.y + data.bodyB.position.y) / 2;
          data.bodyA.gameObject.destroy();
          data.bodyB.gameObject.destroy();
          const fruit = new Fruit(this.world, x, y, size, this.fruitType + 1);
          fruit.setVelocity(
            data.bodyA.velocity.x + data.bodyB.velocity.x,
            data.bodyA.velocity.y + data.bodyB.velocity.y
          );
        }
      }
    );
  }

  setFruit() {
    switch (this.fruitType) {
      case FruitType.Cherry:
        this.setTint(0xd93245);
        this.size = 1.0;
        break;
      case FruitType.Strawberry:
        this.setTint(0xd9305c);
        this.size = 1.5;
        break;
      case FruitType.Grape:
        this.setTint(0x56256e);
        this.size = 2.0;
        break;
      case FruitType.Dekopon:
        this.setTint(0xfcb700);
        this.size = 2.1;
        break;
      case FruitType.Orange:
        this.setTint(0xff8a29);
        this.size = 2.5;
        break;
      case FruitType.Apple:
        this.setTint(0xf40d09);
        this.size = 2.8;
        break;
      case FruitType.Pear:
        this.setTint(0xf7f19a);
        this.size = 2.8;
        break;
      case FruitType.Peach:
        this.setTint(0xfdb6ac);
        this.size = 3.5;
        break;
      case FruitType.Pineapple:
        this.setTint(0xf6f044);
        this.size = 4.0;
        break;
      case FruitType.Melon:
        this.setTint(0x98d90f);
        this.size = 5.0;
        break;
      case FruitType.Watermelon:
        this.setTint(0x106d0e);
        this.size = 6.0;
        break;
    }
  }
}
