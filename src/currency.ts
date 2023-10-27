import Phaser from "phaser";

export default abstract class Currency extends Phaser.Physics.Matter.Image {
  private imageData!: ImageData;
  private pixels!: Phaser.Display.Color[][];
  private border: Phaser.Math.Vector2[] = [];
  private limitAlpha: number = 254;

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

  public createVerts(): void {
    let texture = "chaos_orb";
    const source = this.scene.textures.get(texture).getSourceImage();
    const canvas = this.scene.textures.createCanvas(
      texture + "_canvas",
      source.width,
      source.height
    );
    if (canvas == null) return;

    canvas.clear();
    canvas.draw(0, 0, source as HTMLImageElement);
    this.imageData = canvas.imageData;
    canvas.destroy();

    this.pixels = [];
    this.border = [];

    // pixelsの初期化
    for (let i = 0; i < this.imageData.height; i++) {
      this.pixels[i] = [];
      for (let j = 0; j < this.imageData.width; j++) {
        this.pixels[i].push(new Phaser.Display.Color(0, 0, 0, 0));
      }
    }

    // ピクセルデータの取得
    let pixelX = 0;
    let pixelY = 0;

    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.pixels[pixelY][pixelX] = new Phaser.Display.Color(
        this.imageData.data[i],
        this.imageData.data[i + 1],
        this.imageData.data[i + 2],
        this.imageData.data[i + 3]
      );
      pixelX++;
      if (pixelX >= this.imageData.width) {
        pixelX = 0;
        pixelY++;
      }
    }

    let originX: number = 0;
    let originY: number = 0;
    let isOrigin: boolean = false;

    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        if (this.pixels[y][x].alpha >= this.limitAlpha) {
          originX = x;
          originY = y;
          isOrigin = true;
          break;
        }
      }
      if (isOrigin) break;
    }

    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        let pic = this.scene.add.graphics();
        pic.x = this.x + x;
        pic.y = this.y + y;
        pic.fillStyle(this.pixels[y][x].color, 255 / this.pixels[y][x].alpha);
        pic.fillPointShape(new Phaser.Math.Vector2(0, 0), 1);
      }
    }
    let mov = new Phaser.Math.Vector2(0, 0);
    let premov = new Phaser.Math.Vector2(0, 0);
    let tmp = this.GetBorder(new Phaser.Math.Vector2(originX, originY), mov);
    let calc = 0;

    while (!(tmp!.x === originX && tmp!.y === originY) && calc < 1000) {
      tmp = this.GetBorder(tmp!, mov);
      if (tmp === null) {
        break;
      }
      if (!(premov.x === mov.x && premov.y === mov.y)) {
        if (this.border.indexOf(tmp) !== -1) {
          break;
        }
        this.border.push(new Phaser.Math.Vector2(tmp.x, tmp.y));
      }
      premov.set(mov.x, mov.y);
      calc++;
    }

    calc = 0;

    // 頂点の描画
    for (let p of this.border) {
      let dx = this.x + p.x;
      let dy = this.y + p.y;

      let pic = this.scene.add.graphics();
      pic.x = dx;
      pic.y = dy;
      if (calc === 0) {
        pic.fillStyle(0xffffff, 1);
      } else if (calc === this.border.length - 1) {
        pic.fillStyle(0xff0000, 1);
      } else {
        pic.fillStyle(0xffffff, 1);
      }
      pic.fillPointShape(new Phaser.Math.Vector2(0, 0), 3);
      calc++;
    }

    let verts = "";
    for (let p of this.border) {
      verts += p.x + this.x + " " + (p.y + this.y) + " ";
    }

    var poly = this.scene.add.polygon(400, 300, verts, 0x0000ff, 0.2);

    this.scene.matter.add.gameObject(poly, {
      shape: { type: "fromVerts", verts: verts, flagInternal: false },
    });

    // 縁の描画
    // while (tmp != null && calc < 200) {
    //   console.log(tmp);
    //   let pic = this.scene.add.graphics();
    //   pic.x = this.x + tmp.x;
    //   pic.y = this.y + tmp.y;
    //   pic.fillStyle(0xff0000, 1);
    //   pic.fillPointShape(new Phaser.Math.Vector2(0, 0), 2);
    //
    //   tmp = this.GetBorder(tmp, mov);
    //   calc++;
    // }
  }
  public GetBorder(
    v: Phaser.Math.Vector2,
    m: Phaser.Math.Vector2
  ): Phaser.Math.Vector2 | null {
    let r: Phaser.Math.Vector2 | null = null;

    //左下
    const left_down = () => {
      if (v.x > 0 && v.y < this.imageData.height - 1) {
        if (this.pixels[v.y + 1][v.x - 1].alpha >= this.limitAlpha) {
          m.set(-1, 1);
          return new Phaser.Math.Vector2(v.x - 1, v.y + 1);
        }
      }
      return null;
    };
    const down = () => {
      if (v.y < this.imageData.height - 1 && !(m.x == 0 && m.y == -1)) {
        if (this.pixels[v.y + 1][v.x].alpha >= this.limitAlpha) {
          m.set(0, 1);
          return new Phaser.Math.Vector2(v.x, v.y + 1);
        }
      }
      return null;
    };
    const right_down = () => {
      if (v.x < this.imageData.width - 1 && v.y < this.imageData.height - 1) {
        if (this.pixels[v.y + 1][v.x + 1].alpha >= this.limitAlpha) {
          m.set(1, 1);
          return new Phaser.Math.Vector2(v.x + 1, v.y + 1);
        }
      }
      return null;
    };
    const right = () => {
      if (v.x < this.imageData.width - 1) {
        if (this.pixels[v.y][v.x + 1].alpha >= this.limitAlpha) {
          m.set(1, 0);
          return new Phaser.Math.Vector2(v.x + 1, v.y);
        }
      }
      return null;
    };
    const right_up = () => {
      if (v.x < this.imageData.width - 1 && v.y > 0) {
        if (this.pixels[v.y - 1][v.x + 1].alpha >= this.limitAlpha) {
          m.set(1, -1);
          return new Phaser.Math.Vector2(v.x + 1, v.y - 1);
        }
      }
      return null;
    };
    const up = () => {
      if (v.y > 0) {
        if (this.pixels[v.y - 1][v.x].alpha >= this.limitAlpha) {
          m.set(0, -1);
          return new Phaser.Math.Vector2(v.x, v.y - 1);
        }
      }
      return null;
    };
    const left_up = () => {
      if (v.x > 0 && v.y > 0) {
        if (this.pixels[v.y - 1][v.x - 1].alpha >= this.limitAlpha) {
          m.set(-1, -1);
          return new Phaser.Math.Vector2(v.x - 1, v.y - 1);
        }
      }
      return null;
    };
    const left = () => {
      if (v.x > 0) {
        if (this.pixels[v.y][v.x - 1].alpha >= this.limitAlpha) {
          m.set(-1, 0);
          return new Phaser.Math.Vector2(v.x - 1, v.y);
        }
      }
      return null;
    };

    if (m.x === -1 && m.y === 1) {
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === 0 && m.y === 1) {
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === 1 && m.y === 1) {
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === 1 && m.y === 0) {
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === 1 && m.y === -1) {
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === 0 && m.y === -1) {
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === -1 && m.y === -1) {
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === -1 && m.y === 0) {
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
    }
    if (m.x === 0 && m.y === 0) {
      r = left_down();
      if (r !== null) {
        return r;
      }
      r = down();
      if (r !== null) {
        return r;
      }
      r = right_down();
      if (r !== null) {
        return r;
      }
      r = right();
      if (r !== null) {
        return r;
      }
      r = right_up();
      if (r !== null) {
        return r;
      }
      r = up();
      if (r !== null) {
        return r;
      }
      r = left_up();
      if (r !== null) {
        return r;
      }
      r = left();
      if (r !== null) {
        return r;
      }
    }

    return null;
  }
}
