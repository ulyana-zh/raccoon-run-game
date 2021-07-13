const Node = function (params, innerUpdate) {
  this.posX = params.position.x;
  this.posY = params.position.y;
  this.layer = params.layer;
  this.context = null;
  this.name = params.name || '';

  this.addTo = null;
  this.destroy = null;

  if (params.size) {
    this.sizeX = params.size.x;
    this.sizeY = params.size.y;
  }

  if (innerUpdate) {
    this.innerUpdate = innerUpdate;
  }

  (this.moveX = function (n) {
    this.posX -= n;
  }),
    (this.moveY = function (n) {
      this.posY += n;
    });

  this.clearLayer = function () {
    this.layer.clear();
  };
};

export default Node;
