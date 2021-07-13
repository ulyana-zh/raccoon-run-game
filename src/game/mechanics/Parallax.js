const OFFSET = 6;

const Parallax = function (engine, bgArray) {
  this.engine = engine;
  this.bgArray = bgArray;
  this.images = [[], []];
  this.isSpeed = 1;
};

Parallax.prototype = {
  draw() {
    const positions = [0, this.engine.size.x];

    for (let i = 0; i < positions.length; i++) {
      for (let j = 0; j < this.bgArray.length; j++) {
        const bg = this.bgArray[j];
        let images = this.images[i][j];
        const image = this.engine.loader.files[`${bg.image}`];

        images = this.engine
          .createNode(
            {
              type: 'ImageNode',
              layer: bg.layer,
              image,
              position: {
                x: positions[i],
                y: 0,
              },
              size: {
                x: this.engine.size.x,
                y: this.engine.size.y,
              },
              name: `${j + 1}`,
            },
            () => {
              if (!bg.speed) return;
              if (
                images.name === '1' ||
                images.name === '2' ||
                images.name === '4'
              ) {
                images.moveX(bg.speed);
              } else {
                images.moveX(bg.speed * this.isSpeed);
              }

              if (images.posX < -this.engine.size.x + OFFSET) {
                images.posX = this.engine.size.x;
              }
            }
          )
          .addTo('game');
      }
    }
  },

  stop() {
    this.isSpeed = 0;
  },
};

export default Parallax;
