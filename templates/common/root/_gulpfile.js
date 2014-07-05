var gulp = require('gulp');
var clean = require('rimraf');
var wiredep = require('wiredep').stream;
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var stylus = require('gulp-stylus');
var prefix = require('gulp-autoprefixer');
var connect = require('gulp-connect');

var DIST_PATH = './dist';
var TMP_PATH = './.tmp';
var SRC_PATH = './src';

var targetPath;

gulp.task('connect', function () {
  connect.server({
    root: TMP_PATH,
    livereload: true,
    port: 9090
  });
});

gulp.task('watchServe', function (){
  gulp.watch([SRC_PATH + '/index.jade', SRC_PATH + '/views/**/*.jade'], 'jade');
});

gulp.task('default', function () {

});

// prepareIndex
gulp.task('prepareIndex', function () {
  gulp.src(SRC_PATH + '/index.jade')
    .pipe(wiredep({
      optional: 'configuration',
      gose: 'here'
    }))
    .pipe(jade())
    .pipe(gulp.dest(targetPath))
    .pipe(connect.reload());
});

// watch
gulp.task('watch', function () {
  gulp.watch([SRC_PATH + '/scripts/**/*.coffee'], ['coffee']);
  gulp.watch([SRC_PATH + '/styles/**/*.styl'], ['stylus']);
  gulp.watch([SRC_PATH + '/views/**/*.jade'], ['jade']);
  gulp.watch([SRC_PATH + '/index.jade'], ['prepareIndex']);
});

// clean files
gulp.task('clean', function () {
  clean.sync(targetPath);
});

// copy files
gulp.task('copy', function () {
  gulp.src([
    SRC_PATH + '/404.html',
    SRC_PATH + '/favicon.ico',
    SRC_PATH + '/robots.txt'
  ])
    .pipe(gulp.dest(targetPath));

  gulp.src('./bower_components/**/*')
    .pipe(gulp.dest(targetPath + '/bower_components'));
});

// images
gulp.task('images', function () {
  gulp.src(SRC_PATH + '/images/**/*')
    .pipe(gulp.dest(targetPath + '/images'));
});

// stylus
gulp.task('stylus', function () {
  gulp.src(SRC_PATH + '/styles/**/*.styl')
    .pipe(stylus())
    .pipe(prefix("last 1 version", "> 1%"))
    .pipe(gulp.dest(targetPath + '/styles'))
    .pipe(connect.reload());
});

// scripts
gulp.task('coffee', function () {
  gulp.src(SRC_PATH + '/scripts/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest(targetPath + '/scripts'))
    .pipe(connect.reload());
});

// views
gulp.task('jade', function () {
  gulp.src(SRC_PATH + '/views/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(targetPath + '/views'))
    .pipe(connect.reload());
});

gulp.task('serveConcurrent', [
  'copy',
  'images',
  'jade',
  'prepareIndex',
  'stylus',
  'coffee'
]);

gulp.task('setServePath', function () {
  targetPath = TMP_PATH;
});

gulp.task('serve', ['setServePath', 'clean', 'serveConcurrent', 'connect', 'watch']);