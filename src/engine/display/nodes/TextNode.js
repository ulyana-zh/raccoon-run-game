import Node from './Node';

const TextNode = function (params) {
  Node.apply(this, arguments);

  this.params = params;
  this.type = 'TextNode';
};

TextNode.prototype = Object.create(Node.prototype);
TextNode.prototype.constructor = TextNode;

TextNode.prototype = {
  render() {
    this.context.textBaseline = 'top';
    this.context.fillText(this.params.text, this.posX, this.posY);
    this.context.font = `${this.params.size}px ${this.params.font}`;
    if (this.params.color) {
      this.context.fillStyle = this.params.color;
    }
  },
};

export default TextNode;
