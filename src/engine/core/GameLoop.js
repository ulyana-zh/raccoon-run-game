const GameLoop = function (timeStep, update, render) {
  this.accumulatedTime = 0;
  this.animationFrameRequest = undefined;
  this.time = undefined;
  this.timeStep = timeStep;
  this.updated = false;

  this.update = update; 
  this.render = render; 

  this.run = function (timeStamp) {
    this.accumulatedTime += timeStamp - this.time;
    this.time = timeStamp;

    if (this.accumulatedTime >= this.timeStep * 3) {
      this.accumulatedTime = this.timeStep;
    }

    while (this.accumulatedTime >= this.timeStep) {
      this.accumulatedTime -= this.timeStep;

      this.update(timeStamp);
      this.updated = true;
    }

    if (this.updated) {
      this.updated = false;
      this.render(timeStamp);
    }
    this.animationFrameRequest = window.requestAnimationFrame(this.handleRun);
  };

  this.handleRun = (step) => {
    this.run(step);
  };
};

GameLoop.prototype = {
  start () {
    this.accumulatedTime = this.timeStep;
    this.time = performance.now();
    this.animationFrameRequest = window.requestAnimationFrame(this.handleRun);
  },

  stop () {
    window.cancelAnimationFrame(this.animationFrameRequest);
  },
};

export default GameLoop;
