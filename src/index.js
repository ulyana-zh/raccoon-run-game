import './styles/index.scss';

import Engine from './engine/index';
import Game from './game/index';
import BG from './data/background.json';

const container = document.createElement('div');
container.id = 'game';
document.body.append(container);

const numOfBgLayers = BG.length;
const bgLayers = new Array(numOfBgLayers).fill(0).map((_, idx) => `bg-layer-${idx + 1}`);

const engine = new Engine(container, {
  loader: ['loader'],
  game: [...bgLayers, 'main', 'platform', 'top'],
});

const game = new Game(engine);
game.init();