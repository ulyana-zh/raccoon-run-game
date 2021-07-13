import params from '../../data/params';

import Entity from './Entity';
import {
  GRAVITY,
  PLAYER_STATES,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../../constants/index';

const Player = function (engine) {
  this.engine = engine;
  this.params = params.player;

  this.states = {};

  PLAYER_STATES.forEach((state) => {
    this.states[state] = this.engine.loader.files[`raccoon/${state}.png`];
  });

  this.params.image =
    this.engine.loader.files[params.player.image] || this.states.run;
  this.node = null;

  this.gravity = GRAVITY;

  this.dy = 0;
  this.dx = 0;

  this.x = 0;
  this.y = 0;

  this.width = PLAYER_WIDTH;
  this.height = PLAYER_HEIGHT;

  this.jumpDy = -20;
  this.jumpCounter = 0;

  this.isFalling = false;
  this.isJumping = false;
  this.isSlide = false;

  this.up = null;
  this.down = null;
  this.right = null;

  this.isWin = false;
};

Player.prototype = {
  draw() {
    this.createStates();
  },

  createStates() {
    this.node = this.engine
      .createNode(this.params, () => {
        this.update();
      })
      .addTo('game');
  },

  update() {
    this.up = this.engine.isUpActive();
    this.down = this.engine.isDownActive();
    this.right = this.engine.isRightActive();

    this.jump();
    this.slide();
    this.crouch();
    this.getPosition();
  },

  trackPosition() {
    this.x = this.node.posX;
    this.y = this.node.posY;
  },

  getPosition() {
    this.trackPosition();
    return [this.x, this.y];
  },

  jump() {
    if (this.up && this.dy === 0 && !this.isJumping) {
      this.isJumping = true;
      this.dy = this.jumpDy;
      this.jumpCounter = 12;

      if (!this.isWin) {
        this.node.image = this.states.jump;
      }
    }

    if (!this.down && !this.right && !this.isJumping) {
      if (!this.isWin) {
        this.node.image = this.states.run;
        this.node.frameSpeed = 3;
      }
      this.isSlide = false;
    }

    if (this.up && this.jumpCounter) {
      this.dy = this.jumpDy;
    }

    this.jumpCounter = Math.max(this.jumpCounter - 1, 0);

    this.node.posY += this.dy;
    this.node.posX += this.dx;

    if (this.isJumping || this.isFalling) {
      this.dy += this.gravity;
    }
  },

  slide() {
    if (this.down && !this.isSlide && !this.isJumping && !this.slideCounter) {
      this.node.image = this.states.slide;
      this.node.startOver();
      this.node.frameSpeed = 5;
      this.isSlide = true;
    }

    if (this.node.currentFrame === 5 && !this.isWin) {
      this.node.image = this.states.run;
    }
  },

  crouch() {
    if (this.right) {
      this.node.image = this.states.crouch;
    }
  },

  win() {
    this.isWin = true;
    this.node.image = this.states.win;
    this.node.frameSpeed = 5;
  },
};

Player.prototype = Object.assign(Player.prototype, Entity.prototype);
Player.prototype.constructor = Player;

export default Player;
