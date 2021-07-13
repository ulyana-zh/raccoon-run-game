const Layer = function (index, size, container) {
  this.index = index;
  this.container = container;
  this.size = size;

  this.nodes = [];
  this.screen = '';

  this.layer = document.createElement('canvas');
  this.layer.width = 0;
  this.layer.height = 0;

  this.context = null;

  this.init();
};

Layer.prototype = {
  init() {
    this.container.append(this.layer);
    this.layer.width = this.size.x;
    this.layer.height = this.size.y;
    this.layer.style.zIndex = this.index.toString();

    this.context = this.layer.getContext('2d');
  },

  clear() {
    this.context.clearRect(0, 0, this.layer.width, this.layer.height);
  },

  drawNodes() {
    this.nodes.forEach((node) => node.render(this.context));
  },
};

export default Layer;
