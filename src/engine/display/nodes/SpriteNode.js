import Node from './Node';

const SpriteNode = function (params) {
  Node.apply(this, arguments);
  this.type = 'SpriteNode';

  this.image = params.image;

  this.frameWidth = params.frameWidth;
  this.frameHeight = params.frameHeight;

  const self = this;
  self.framesPerRow = Math.floor(self.image.width / self.frameWidth);

  this.currentFrame = 0;
  this.counter = 0;

  this.frameSpeed = params.frameSpeed || 1;
  this.frames = params.frames;

  this.dh = params.dh || this.frameHeight;
  this.dw = params.dw || this.frameWidth;
};

SpriteNode.prototype = Object.create(Node.prototype);
SpriteNode.prototype.constructor = SpriteNode;

SpriteNode.prototype = {
  update() {
    if (this.counter === this.frameSpeed - 1) {
      this.currentFrame = (this.currentFrame + 1) % this.frames;
    }
    this.counter = (this.counter + 1) % this.frameSpeed;
  },

  startOver() {
    this.currentFrame = 0;
  },

  render() {
    const setDwDH = () => {
      if (this.dh) {
        const ratio = (this.dh * 100) / this.frameHeight;
        this.dw = Math.ceil((this.frameWidth * ratio) / 100);
      } else {
        this.dh = this.frameHeight;
        this.dw = this.frameWidth;
      }
    };
    setDwDH();

    const row = Math.floor(this.currentFrame / this.framesPerRow);
    const col = Math.floor(this.currentFrame % this.framesPerRow);

    this.context.drawImage(
      this.image,
      col * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.posX,
      this.posY,
      this.dw,
      this.dh
    );
  },
};

export default SpriteNode;
