const Scene = function (scene) {
  this.scene = scene;
  if (!this.scene.nodes) {
    this.scene.nodes = [];
  }
};

Scene.prototype = {
  drawNodes: function () {
    this.scene.nodes.forEach((node) => {
      if (node && 'render' in node) {
        node.render();
      }
    });
  },

  updateNodes: function () {
    this.scene.nodes.forEach((node) => {
      if (!node) return;
      if ('innerUpdate' in node) node.innerUpdate();
      if ('update' in node) node.update(node);
      if (node.posX < -node.layer.size.x) {
        node.destroy();
      }
    });
  },

  update: function () {
    if ('update' in this.scene) {
      this.scene.update();
    }
  },

  clear: function () {
    this.scene.nodes.forEach((node) => node.clearLayer());
  },
};

export default Scene;
