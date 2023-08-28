const autoRoutes = require('./autoRoutes.js');
const path = require("path");
const chokidar = require("chokidar");
const { calculateExecutionTime } = require('./utils/tools');

class AutoRoutePlugin {
  constructor(options) {
    this.options = options;
    this.watcher = null;
  }
  apply(compiler) {
    compiler.hooks.afterPlugins.tap("afterPlugins", params => {
      this.start();
    });
    compiler.hooks.emit.tapAsync("emit", (compilation, done) => {
      // 非生产环境，监测文件变化
      if (process.env.NODE_ENV === "local") {
        if (!this.watcher) {
          this.watcher = chokidar
            .watch(path.join(process.cwd(), this.options.routePageRelative || "src/views"), {
              persistent: true,
            })
            .on("all", (event, path) => {
              this.start();
            });
        }
      }

      done();
    });
    compiler.hooks.watchClose.tap("watchClose", params => {
      // 非生产环境，监测文件变化
      if (process.env.NODE_ENV === "local") {
        if (this.watcher) {
          this.watcher.close();
          this.watcher = null;
        }
      }
    });
  }

  start() {
    calculateExecutionTime(autoRoutes, this.options)
  }
}
module.exports = AutoRoutePlugin;