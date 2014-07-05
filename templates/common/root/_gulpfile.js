var gulp = require('gulp');
var clean = require('rimraf');
var wiredep = require('wiredep').stream;
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var stylus = require('gulp-stylus');

var DIST_PATH = './dist';
var TMP_PATH = './.tmp';
var SRC_PATH = './src';

gulp.task('default', function () {

});

gulp.task('serve', function () {
  // clean files
  clean.sync(TMP_PATH);

  // copy files
  gulp.src([
    SRC_PATH + '/404.html',
    SRC_PATH + '/favicon.ico',
    SRC_PATH + '/robots.txt'
  ])
    .pipe(gulp.dest(TMP_PATH));

  // images
  gulp.src(SRC_PATH + '/images/**/*')
    .pipe(gulp.dest(TMP_PATH + '/images'));

  // stylus
  gulp.src(SRC_PATH + '/styles/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(TMP_PATH + '/styles'));

  // scripts
  gulp.src(SRC_PATH + '/scripts/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest(TMP_PATH + '/scripts'));

  // views
  gulp.src(SRC_PATH + '/views/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(TMP_PATH + '/views'));

  // index.html
  gulp.src(SRC_PATH + '/index.jade')
    .pipe(wiredep({
      optional: 'configuration',
      gose: 'here'
    }))
    .pipe(jade())
    .pipe(gulp.dest(TMP_PATH));
});