import Entity from '../models/Entity';
import params from '../../data/params';
import { METER } from '../../constants';

const bg = require('../../assets/background/bg_all.png');
const regeneratorRuntime = require('regenerator-runtime');

const StartScreen = function (engine) {
  this.engine = engine;
};

StartScreen.prototype = {
  async init() {
    await this.loadBg();
    this.drawBg();
  },

  async loadBg() {
    const images = [];

    this.bg = new Image();
    this.bg.src = bg;
    images.push(this.bg);

    await Promise.all(
      images
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener('load', resolve);
            })
        )
    );
  },

  ready() {
    this.drawText();
    this.drawBird();
  },

  drawBg() {
    new Entity(this.engine, params.backgroundLoad, null, 0, 0, this.bg);
  },

  drawText() {
    let opacity = 1;
    let speed = 0.05;

    this.node = this.engine
      .createNode(params.startScreenText, () => {
        opacity -= speed;
        if (opacity <= 0 || opacity >= 1) speed *= -1;
        this.node.params.color = `rgba(255, 244, 220, ${opacity})`;
      })
      .addTo('loader');
  },

  drawBird() {
    let startPosY = METER * 20;
    let dy = 1.5;

    new Entity(
      this.engine,
      params.monsterLoad,
      function () {
        if (startPosY - this.node.posY <= -METER * 7) dy *= -1;
        if (startPosY - this.node.posY >= METER * 7) dy *= -1;
        this.node.moveY(dy);
      },
      METER * 75,
      startPosY
    );
  },
};

export default StartScreen;
