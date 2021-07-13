import StartScreen from './screens/StartScreen';

import Parallax from './mechanics/Parallax';
import backgrounds from '../data/background.json';

import Player from './models/Player';
import Entity from './models/Entity';

import {
  HEIGHT,
  WIDTH,
  SPEED,
  PLATFORM_WIDTH,
  PLATFORM_BASE,
  GAP_LENGTH_MIN,
  GAP_LENGTH_MAX,
  PLATFORM_LENGTH_MIN,
  PLATFORM_LENGTH_MAX,
  STARS_COUNT,
} from '../constants/index';

import { random } from '../helpers/index';
import params from '../data/params';

let dy = 4;
let speed = SPEED;

const Game = function (engine) {
  this.engine = engine;
  this.player = null;

  this.platforms = [];
  this.bonus = [];
  this.monsters = [];

  this.ticker = 0;
  this.platformLength = 20;
  this.gapLength = 0;

  this.isPause = false;
  this.isOver = false;

  this.count = 0;
  this.textCount = null;
};

Game.prototype = {
  init() {
    this.loadGame();
  },

  loadGame() {
    this.engine.createScene('loader');
    this.engine.start('loader');
    this.engine.setScreen('loader');

    const startScreen = new StartScreen(this.engine);

    this.engine.preloadFiles(
      () => startScreen.init(),
      () => {
        console.log('LOAD');
      },
      () => {
        console.log('AFTER');
        startScreen.ready();
        this.handler = this.firstLaunchOfTheGame.bind(this);
        document.addEventListener('keydown', this.handler);
      }
    );
  },

  firstLaunchOfTheGame(e) {
    if (e.key === 'Enter') {
      this.engine.setScreen('game');
      this.createScenes();
      this.startGame();
      this.engine.stop();
      this.engine.start('game');
      this.engine.addEventListeners(this.setPaused.bind(this));

      document.removeEventListener('keydown', this.handler);
    }
  },

  startGame() {
    this.clearArrays();
    this.resetTick();
    this.initBackground();
    this.initPlatform();
    this.initTopStar();
    this.initPlayer();
    this.initPause();
  },

  createScenes() {
    const game = this;

    this.engine.createScene('game', function Scene() {
      this.update = function () {
        // UPDATE
        game.update(game.player);
      };
    });

    this.engine.createScene('pause');
  },

  initPause() {
    this.pause = new Entity(
      this.engine,
      params.pause,
      null,
      WIDTH / 3,
      HEIGHT / 3
    );
  },

  setPaused(pause) {
    if (this.isPause) return;

    if (pause) {
      this.pause.init();
      this.engine.stop();
      this.engine.start('pause');
    }

    if (!pause) {
      this.pause.destroy();
      this.engine.stop();
      this.engine.start('game');
    }
  },

  initBackground() {
    this.background = new Parallax(this.engine, backgrounds);
    this.background.draw();
  },

  initPlayer() {
    this.player = new Player(this.engine, params.player);
    this.player.draw();
  },

  initPlatform() {
    // for first screen
    for (let i = 0; i < 25; i++) {
      this.platforms.push(
        new Entity(
          this.engine,
          params.platform,
          this.setSpeed,
          i * PLATFORM_WIDTH,
          PLATFORM_BASE
        )
      );
    }
  },

  drawCount(count) {
    this.textCount = this.engine.createNode(params.count).addTo('game');
    this.textCount.params.text = `${count}`;
  },

  initCount(count) {
    if (this.textCount) this.textCount.destroy();
    this.drawCount(count);
  },

  initTopStar() {
    new Entity(this.engine, params.bonus, null, WIDTH - 140, 27);
  },

  checkCollisionWithPlatforms(player) {
    let angle = 0;
    player.isFalling = true;

    for (let i = 0; i < this.platforms.length; i++) {
      angle = Math.atan2(
        player.node.posY - this.platforms[i].node.posY,
        player.node.posX - this.platforms[i].node.posX
      );
      if (
        player.checkCollision(this.platforms[i]) <=
          player.height / 2 + PLATFORM_WIDTH / 2 + 40 &&
        (angle = (angle * 180) / Math.PI) > -130 &&
        angle < -120
      ) {
        player.isJumping = false;
        player.isFalling = false;
        player.node.posY = this.platforms[i].node.posY - player.height;
        player.dy = 0;
      }
    }

    return player.isFalling;
  },

  pushNewEnemies() {
    let startPosY = random(300, 100);

    this.monsters.push(
      new Entity(
        this.engine,
        params.monster,
        function () {
          this.node.moveX(speed);
          if (startPosY - this.node.posY <= -200) dy *= -1;
          if (startPosY - this.node.posY >= 200) dy *= -1;
          this.node.moveY(dy);
        },
        WIDTH + PLATFORM_WIDTH - 30,
        startPosY
      )
    );
  },

  pushNewEnvironment() {
    Math.random() > 0.5
      ? new Entity(
          this.engine,
          params.mushroom,
          this.setSpeed,
          WIDTH + PLATFORM_WIDTH - 30,
          PLATFORM_BASE - params.mushroom.size.y + 15
        )
      : new Entity(
          this.engine,
          params.plate,
          this.setSpeed,
          WIDTH + PLATFORM_WIDTH - 20,
          PLATFORM_BASE - params.plate.size.y + 10
        );
  },

  pushNewPlatforms() {
    this.platforms.push(
      new Entity(
        this.engine,
        params.platform,
        this.setSpeed,
        WIDTH + PLATFORM_WIDTH - 10,
        PLATFORM_BASE
      )
    );
  },

  pushNewBonus() {
    this.bonus.push(
      new Entity(
        this.engine,
        params.bonus,
        this.setSpeed,
        WIDTH + PLATFORM_WIDTH - 10,
        PLATFORM_BASE - 100 - random(10, 200)
      )
    );
  },

  update(player) {
    // COUNT
    this.initCount(this.count);

    // GRAVITY
    let isFalling = this.checkCollisionWithPlatforms(player);

    // PUSH NEW OBJECTS
    if (this.ticker % Math.floor(PLATFORM_WIDTH / SPEED) === 0) {
      if (this.gapLength > 0) {
        this.gapLength--;
      } else if (this.platformLength > 0) {
        this.pushNewPlatforms();

        if (this.ticker % 40 === 0) {
          this.pushNewEnemies();
          this.pushNewEnvironment();
        }
        this.platformLength--;
      } else {
        this.gapLength = random(GAP_LENGTH_MIN, GAP_LENGTH_MAX);

        this.platformLength = random(
          Math.floor(PLATFORM_LENGTH_MIN),
          PLATFORM_LENGTH_MAX
        );
      }
    }

    if (this.ticker % Math.floor(PLATFORM_WIDTH / 2.5) === 0) {
      this.pushNewBonus();
    }

    // CHECK COLLISION
    for (let i = 0; i < this.bonus.length; i++) {
      if (
        player.checkCollision(this.bonus[i]) > 30 &&
        player.checkCollision(this.bonus[i]) < 70
      ) {
        let isDestroy = this.destroy(this.bonus[i]);
        this.countBonus(isDestroy);
      }
    }

    for (let i = 0; i < this.monsters.length; i++) {
      if (
        player.checkCollision(this.monsters[i]) > 30 &&
        player.checkCollision(this.monsters[i]) < 80
      ) {
        this.isOver = true;
      }
    }

    if (player.node.posY > HEIGHT) {
      this.isOver = true;
    }

    // Clear the array with entities that go out of screen
    this.clearArrayOutOfScreen(this.monsters);
    this.clearArrayOutOfScreen(this.platforms);
    this.clearArrayOutOfScreen(this.bonus);

    // GAME OVER
    if (this.isOver) {
      this.gameOver();
    }

    // WIN
    if (this.count > STARS_COUNT && !isFalling) {
      this.win();
    }

    this.ticker++;
  },

  clearArrayOutOfScreen(array) {
    if (array[0] && array[0].node.posX < -50) {
      array.splice(0, 1);
    }
  },

  resetTick() {
    this.ticker = 0;
  },

  clearArrays() {
    this.platforms = [];
    this.monsters = [];
    this.bonus = [];
  },

  setSpeed() {
    this.node.moveX(speed);
  },

  destroy(bonus) {
    return bonus.node.destroy();
  },

  countBonus(destroy) {
    if (destroy) this.count++;
  },

  drawWin() {
    new Entity(
      this.engine,
      params.complete,
      null,
      WIDTH / 2 - 160,
      HEIGHT / 2 - 60
    );
  },

  win() {
    this.isPause = true;
    speed = 0;
    this.player.win();
    this.background.stop();
    this.drawWin();
    this.restartGameEventListener();
  },

  // temporarily
  restartGameEventListener() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.gameOver();
      }
    });
  },

  gameOver() {
    speed = SPEED;
    this.count = 0;
    this.isOver = false;
    this.isPause = false;

    this.engine.clearScene('game');
    this.startGame();
  },
};

export default Game;
