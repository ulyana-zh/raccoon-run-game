import {
  METER,
  PLATFORM_WIDTH,
  PLATFORM_HEIGHT,
  PLATFORM_BASE,
  WIDTH,
  HEIGHT,
  FONT_COLOR,
  FONT,
} from '../constants/index';

const PARAMS = {
  player: {
    name: 'player',
    image: 'raccoon/run.png',
    type: 'SpriteNode',
    layer: 'top',
    position: {
      x: METER * 2,
      y: PLATFORM_BASE - 400,
    },
    size: { x: METER * 2, y: METER * 2 },
    frameWidth: 800,
    frameHeight: 800,
    frameSpeed: 3,
    frames: 11,
    dh: METER * 22,
    scene: 'game',
  },

  monster: {
    name: 'monster',
    image: 'enemies/monster.png',
    type: 'SpriteNode',
    layer: 'top',
    size: {
      x: METER * 3,
      y: METER * 3,
    },
    frameWidth: 401,
    frameHeight: 249,
    frameSpeed: 3,
    frames: 5,
    dh: METER * 8,
    scene: 'game',
  },

  pause: {
    name: 'pause',
    image: 'ui/paused.png',
    type: 'ImageNode',
    layer: 'top',
    scene: 'pause',
  },

  complete: {
    name: 'complete',
    image: 'ui/complete.png',
    type: 'ImageNode',
    layer: 'top',
    size: {
      x: (METER * 77.6) / 2,
      y: (METER * 9.45) / 2,
    },
    scene: 'game',
  },

  platform: {
    name: 'platform',
    image: 'environment/platform.png',
    type: 'ImageNode',
    layer: 'platform',
    size: {
      x: PLATFORM_WIDTH,
      y: PLATFORM_HEIGHT,
    },
    scene: 'game',
  },

  bonus: {
    name: 'bonus',
    image: 'bonus/star_gold.png',
    type: 'ImageNode',
    layer: 'main',
    size: {
      x: METER * 3,
      y: METER * 3,
    },
    scene: 'game',
  },

  mushroom: {
    name: 'mushroom',
    image: 'environment/mushroom.png',
    type: 'ImageNode',
    layer: 'main',
    size: {
      x: METER * 8,
      y: METER * 8,
    },
    scene: 'game',
  },

  plate: {
    name: 'plate',
    image: 'environment/plate.png',
    type: 'ImageNode',
    layer: 'main',
    size: {
      x: METER * 8,
      y: METER * 8,
    },
    scene: 'game',
  },

  backgroundLoad: {
    name: 'background',
    type: 'ImageNode',
    layer: 'loader',
    size: {
      x: WIDTH,
      y: HEIGHT,
    },
    scene: 'game',
  },

  monsterLoad: {
    name: 'monster',
    image: 'enemies/monster.png',
    type: 'SpriteNode',
    layer: 'loader',
    size: {
      x: METER * 3,
      y: METER * 3,
    },
    frameWidth: 401,
    frameHeight: 249,
    frameSpeed: 3,
    frames: 5,
    dh: METER * 8,
    scene: 'loader',
  },

  startScreenText: {
    type: 'TextNode',
    position: {
      x: METER * 30,
      y: METER * 28,
    },
    text: 'PRESS ENTER TO START',
    font: FONT,
    size: '50',
    color: FONT_COLOR,
    layer: 'loader',
    scene: 'loader',
  },

  winText: {
    type: 'TextNode',
    position: {
      x: WIDTH / 2 - 40,
      y: HEIGHT / 2 - 80,
    },
    text: 'YOU WIN!',
    font: FONT,
    size: '80',
    color: FONT_COLOR,
    layer: 'top',
    scene: 'game',
  },

  count: {
    type: 'TextNode',
    position: {
      x: WIDTH - 100,
      y: 20,
    },
    text: '0',
    font: FONT,
    size: '50',
    color: FONT_COLOR,
    layer: 'top',
    scene: 'game',
  },
};

export default PARAMS;
