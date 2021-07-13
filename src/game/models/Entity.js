const Entity = function (
  engine,
  params,
  update = null,
  x = 0,
  y = 0,
  img = null
) {
  this.engine = engine;
  this.params = params;
  this.update = update;
  this.img = img;

  if (this.params.image) {
    this.image = this.engine.loader.files[this.params.image];
  } else {
    this.image = this.img;
  }

  this.node = null;

  this.x = x;
  this.y = y;

  if (params.position) {
    this.x = params.position.x;
    this.y = params.position.y;
  }

  this.dx = 0;
  this.dy = 0;

  if (params.size) {
    this.width = params.size.x;
    this.height = params.size.y;
  } else {
    this.width = this.image.width / 4;
    this.height = this.image.height / 4;
  }

  if (params.name !== 'pause') {
    this.init();
  }
};

Entity.prototype = {
  init() {
    if (this.params.type === 'ImageNode') {
      this.node = this.engine
        .createNode(
          {
            type: this.params.type,
            layer: this.params.layer,
            image: this.image,
            position: {
              x: this.x,
              y: this.y,
            },
            size: {
              x: this.width,
              y: this.height,
            },
          },
          () => {
            if (!this.update) return;
            this.update();
          }
        )
        .addTo(this.params.scene);
    }
    if (this.params.type === 'SpriteNode') {
      this.node = this.engine
        .createNode(
          {
            type: this.params.type,
            layer: this.params.layer,
            image: this.image,
            position: {
              x: this.x,
              y: this.y,
            },
            size: {
              x: this.width,
              y: this.height,
            },
            frameWidth: this.params.frameWidth,
            frameHeight: this.params.frameHeight,
            frameSpeed: this.params.frameSpeed,
            frames: this.params.frames,
            dh: this.params.dh,
          },
          () => {
            if (!this.update) return;
            this.update();
          }
        )
        .addTo(this.params.scene);
    }
  },

  destroy() {
    this.node.destroy();
  },

  checkCollision(vec) {
    let minDist = Infinity;

    const max = Math.max(
      Math.abs(this.dx),
      Math.abs(this.dy),
      Math.abs(vec.dx),
      Math.abs(vec.dy)
    );

    const slice = 1 / max;
    let x;
    let y;
    let distSquared;

    const vec1 = {};
    const vec2 = {};

    vec1.x = this.node.posX + this.width / 2;
    vec1.y = this.node.posY + this.height / 2;

    vec2.x = vec.node.posX + vec.width / 2;
    vec2.y = vec.node.posY + vec.height / 2;

    for (let percent = 0; percent < 1; percent += slice) {
      x = vec1.x + this.dx * percent - (vec2.x + vec.dx * percent);
      y = vec1.y + this.dy * percent - (vec2.y + vec.dy * percent);

      distSquared = x ** 2 + y ** 2;

      minDist = Math.min(minDist, distSquared);
    }

    return Math.sqrt(minDist);
  },
};

export default Entity;
