import SpriteNode from './display/nodes/SpriteNode';
import ImageNode from './display/nodes/ImageNode';
import TextNode from './display/nodes/TextNode';

import Layer from './display/Layer';
import Scene from './display/Scene';

import GameLoop from './core/GameLoop';
import Controller from './core/Controller';

import Loader from './utils/Loader';

import { WIDTH, HEIGHT } from '../constants/index';

const Engine = function (container, config) {
  this.self = this;
  this.container = container;

  this.size = { x: WIDTH, y: HEIGHT };

  this.container.style.width = `${this.size.x}px`;
  this.container.style.height = `${this.size.y}px`;

  this.scenes = {};
  this.layers = {};
  this.screens = {};

  this.activeScreen = null;
  this.activeScene = null;

  this.isRunning = false;
  this.isPause = false;

  this.gameLoop = new GameLoop(
    1000 / 30,
    this.update.bind(this),
    this.render.bind(this)
  );
  this.controller = new Controller();

  this.init(config);
};

Engine.prototype = {
  // INIT
  init(config) {
    if (!Array.isArray(config)) {
      Object.keys(config).forEach((screen) => {
        const layers = config[screen];

        if (!layers || layers.length <= 0) return;

        layers.forEach((layer) => this.createLayer(layer));

        this.createScreen(screen, layers);
      });

      const topScreen = Object.keys(this.screens)[
        Object.keys(this.screens).length - 1
      ];
      this.setScreen(topScreen);
    } else if (config.length > 0) {
      config.forEach((layer, i) => {
        this.createLayer(layer, i);
      });
    }
  },

  // SCENES
  createScene(name, Construct) {
    if (this.scenes[name]) return;
    this.scenes[name] = new Scene(Construct ? new Construct() : {});
    this.activeScene = this.scenes[name];
  },

  setScene(name) {
    if (!name || !this.scenes[name]) return false;
    this.activeScene = this.scenes[name];
    return true;
  },

  clearScene(name) {
    this.scenes[name].scene.nodes.forEach((node) => node.destroy());
    this.scenes[name].scene.nodes = [];
  },

  // LAYERS
  createLayer(name, index) {
    if (this.layers[name]) return;

    const idx = index && index !== 0 ? index : Object.keys(this.layers).length;
    const layer = new Layer(idx, this.size, this.container);
    this.layers[name] = layer;
  },

  createScreen(name, layersNames) {
    if (this.screens[name] || !layersNames || layersNames.length <= 0) return;

    const layers = layersNames.map((layerName) => {
      const layer = this.layers[layerName];
      layer.screen = name;
      return layer;
    });

    this.screens[name] = layers;
  },

  setScreen(name) {
    if (!this.screens[name]) return;
    if (this.activeScreen) {
      const lastLayers = this.screens[this.activeScreen];

      lastLayers.forEach((item) => {
        const { layer } = item;
        layer.style.zIndex = (+item.layer.style.zIndex - 100).toString();
      });
    }

    const layers = this.screens[name];

    layers.forEach((item) => {
      const { layer } = item;
      layer.style.zIndex = (+item.layer.style.zIndex + 100).toString();
    });

    this.activeScreen = name;
  },

  // NODES
  createNodeType(params, update) {
    switch (params.type) {
      case 'ImageNode': {
        return new ImageNode(params, update);
      }
      case 'SpriteNode': {
        return new SpriteNode(params, update);
      }
      case 'TextNode': {
        return new TextNode(params, update);
      }
      default:
        break;
    }
    return null;
  },

  createNode(params, update) {
    if (!this.layers[params.layer]) return;
    const layer = this.layers[params.layer];
    const config = { ...params, layer };
    const node = this.createNodeType(config, update);

    if (!node) return null;
    layer.nodes.push(node);

    node.context = this.layers[params.layer].context;

    function addTo(sceneName) {
      if (!sceneName) return null;

      if (node.sceneName) {
        const sceneNodes = this.scenes[node.sceneName].scene.nodes;
        const sceneIdx = sceneNodes.indexOf(node);

        if (sceneIdx !== -1) {
          sceneNodes.splice(sceneIdx, 1);
        }
      }

      const curScene = this.scenes[sceneName];

      if (!curScene) return null;
      curScene.scene.nodes.push(node);
      return node;
    }

    function destroy() {
      if (node.sceneName) {
        const sceneNodes = this.scenes[node.sceneName].scene.nodes;
        const sceneIdx = sceneNodes.indexOf(node);

        if (sceneIdx !== -1) {
          sceneNodes.splice(sceneIdx, 1);
          return true;
        }
      }
      const layerIdx = node.layer.nodes.indexOf(node);

      if (layerIdx !== -1) {
        node.layer.nodes.splice(layerIdx, 1);
        node.clearLayer();
        return true;
      }

      return false;
    }

    node.addTo = addTo.bind(this);
    node.destroy = destroy.bind(this);

    return node;
  },

  // KEYBOARD EVENTS
  keyDownUp(event) {
    this.controller.keyDownUp(event.type, event.key);
  },

  addEventListeners(fn) {
    document.addEventListener('keydown', this.keyDownUp.bind(this.self));
    document.addEventListener('keyup', this.keyDownUp.bind(this.self));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.isPause = !this.isPause;
        fn(this.isPause);
      }
    });
  },

  isUpActive() {
    return this.controller.up.active;
  },

  isDownActive() {
    return this.controller.down.active;
  },

  isRightActive() {
    return this.controller.right.active;
  },

  // LOADER
  preloadFiles(beforeLoadCB, loadedOneCB, afterLoadCB) {
    this.loader = new Loader(beforeLoadCB, loadedOneCB, afterLoadCB);
    this.loader.init();
  },

  // RENDER AND UPDATE
  render() {
    this.screens[this.activeScreen].forEach((layer) => {
      layer.clear();
      layer.drawNodes();
    });
  },

  update() {
    if (!this.isRunning) return;
    this.activeScene.update();
    this.activeScene.updateNodes();
  },

  // ENGINE START/STOP
  start(scene) {
    if (this.isRunning) return;
    this.setScene(scene);
    this.isRunning = true;
    this.gameLoop.start();
  },

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.gameLoop.stop();
  },
};

export default Engine;
