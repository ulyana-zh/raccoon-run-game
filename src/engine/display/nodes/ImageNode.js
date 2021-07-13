import Node from './Node';

const ImageNode = function (params) {
  Node.apply(this, arguments);
  this.type = 'ImageNode';

  this.image = params.image;
};

ImageNode.prototype = Object.create(Node.prototype);
ImageNode.prototype.constructor = ImageNode;

ImageNode.prototype = {
  render() {
    this.context.drawImage(
      this.image,
      this.posX,
      this.posY,
      this.sizeX,
      this.sizeY
    );
  },
};

export default ImageNode;
