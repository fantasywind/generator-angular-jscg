'use strict';
var path = require('path');
var chalk = require('chalk');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  var bower = require(path.join(process.cwd(), 'bower.json'));
  var match = require('fs').readFileSync(path.join(
    this.env.options.appPath,
    'scripts/app.coffee'
  ), 'utf-8').match(/\.when/);

  if (
    bower.dependencies['angular-route'] ||
    bower.devDependencies['angular-route'] ||
    match !== null
  ) {
    this.foundWhenForRoute = true;
  }

  this.hookFor('IBSite:controller');

  if (this.options.cache === undefined) {
    this.options.cache = false
  }
  this.hookFor('IBSite:view', {
    options: {
      options: {
        cache: this.options.cache
      }
    }
  });
};

util.inherits(Generator, ScriptBase);

Generator.prototype.rewriteAppJs = function () {

  if (!this.foundWhenForRoute) {
    this.on('end', function () {
      this.log(chalk.yellow(
        '\nangular-route is not installed. Skipping adding the route to ' +
        'scripts/app.coffee'
      ));
    });
    return;
  }

  this.uri = this.name;
  if (this.options.uri) {
    this.uri = this.options.uri;
  }

  var config = {
    file: path.join(
      this.env.options.appPath,
      'scripts/app.coffee'
    ),
    needle: '.otherwise',
    splicable: [
      "  templateUrl: 'views/" + this.name.toLowerCase() + ".html'",
      "  controller: '" + this.classedName + "Ctrl'"
    ]
  };

  config.splicable.unshift(".when '/" + this.uri + "',");

  angularUtils.rewriteFile(config);
};
