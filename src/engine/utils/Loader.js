const Loader = function (
  beforeLoadCallback,
  loadedOneCallback,
  loadedAllCallback
) {
  this.beforeLoadCallback = beforeLoadCallback;
  this.loadedOneCallback = loadedOneCallback;
  this.loadedAllCallback = loadedAllCallback;
  this.filesLoadedCount = 0;
  this.loadingFinished = false;
  this.files = null;
  this.fileList = null;
};

// NOTE: this loader is just for images for now)

Loader.prototype = {
  init: function () {
    this.beforeLoadCallback().then(() => {
      this.load();
    });
  },

  createFileList: function (paths) {
    let fileList = {};
    let temp = paths.keys();
    temp = temp.slice(0, temp.length / 2).map((path) => {
      fileList[path.replace('./', '')] = paths(path);
    });

    return fileList;
  },

  load: function () {
    this.fileList = this.createFileList(
      require.context('assets/', true, /\.(png|jpg)$/)
    );

    const filesObj = {};

    for (let path in this.fileList) {
      filesObj[path] = new Image();
      filesObj[path].addEventListener('load', () => this.fileLoaded());
      filesObj[path].src = this.fileList[path];
    }

    this.files = filesObj;
  },

  fileLoaded: function () {
    const fileListLength = Object.keys(this.fileList).length;
    if (!this.loadingFinished) {
      this.filesLoadedCount++;
      this.loadedOneCallback();

      if (this.filesLoadedCount >= fileListLength) {
        this.loadedAllCallback();
        this.loadingFinished = true;
      }
    }
  },
};

export default Loader;
