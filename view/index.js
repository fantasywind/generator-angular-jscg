'use strict';
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var angularUtils = require('../util.js');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  this.sourceRoot(path.join(__dirname, '../templates/common'));

  if (typeof this.env.options.appPath === 'undefined') {
    this.env.options.appPath = this.options.appPath;

    if (!this.env.options.appPath) {
      try {
        this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
      } catch (e) {}
    }
    this.env.options.appPath = this.env.options.appPath || 'src';
    this.options.appPath = this.env.options.appPath;
  }
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createViewFiles = function createViewFiles() {
  this.template(
    'src/views/view.jade',
    path.join(
      this.env.options.appPath,
      'views',
      this.name.toLowerCase() + '.jade'
    )
  );
};

Generator.prototype.createViewCacheFlag = function createViewCacheFlag() {
  if (this.options.cache) {
    try {
      var appPath = this.env.options.appPath;
      var fullPath = path.join(appPath, 'index.jade');
      angularUtils.rewriteFile({
        file: fullPath,
        needle: '// endtemplatecache',
        splicable: [
          'script(type="text/ng-template", id="' + this.name.toLowerCase().replace(/\\/g, '/') + '")',
        ]
      });
    } catch (e) {
      this.log.error(chalk.yellow(
        '\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
      ));
    }
  }
}