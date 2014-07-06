'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  // default options
  if (this.options.cache === undefined) {
    this.options.cache = true;
  }
  if (this.options.view === undefined) {
    this.options.view = true;
  }

  // hook view generator
  if (this.options.view) {
    this.hookFor('IBSite:view', {
      options: {
        options: {
          cache: this.options.cache
        }
      }
    });
  }

  this.generatorName = 'directive'
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {

  this.generateSourceAndTest(
    'directive',
    'spec/directive',
    'directives',
    this.options['skip-add'] || false
  );
};
