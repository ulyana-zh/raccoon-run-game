const Controller = function () {
  this.up = new Controller.ButtonInput();
  this.down = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();

  this.keyDownUp = function (type, key) {
    const down = type === 'keydown';

    switch (key) {
      case ' ':
        this.up.getInput(down);
        break;
      case 'ArrowUp':
        this.up.getInput(down);
        break;
      case 'ArrowDown':
        this.down.getInput(down);
        break;
      case 'ArrowRight':
        this.right.getInput(down);
        break;
      default:
        break;
    }
  };
};

Controller.ButtonInput = function () {
  this.active = this.down = false;
};

Controller.ButtonInput.prototype.getInput = function (down) {
  if (this.down !== down) this.active = down;

  this.down = down;
};

export default Controller;
