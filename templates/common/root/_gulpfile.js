var gulp = require('gulp');
var clean = require('rimraf');
var wiredep = require('wiredep').stream;
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var stylus = require('gulp-stylus');
var prefix = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var ngmin = require('gulp-ngmin');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var es = require('event-stream');

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
    .pipe(wiredep())
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

  if (targetPath === TMP_PATH) {
    gulp.src('./bower_components/**/*')
      .pipe(gulp.dest(targetPath + '/bower_components'));
  }
});

// images
gulp.task('images', function () {
  gulp.src(SRC_PATH + '/images/**/*')
    .pipe(imagemin({
      progressive: true,
      svgPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest(targetPath + '/images'));
});

// stylus
gulp.task('stylus', function (cb) {
  gulp.src(SRC_PATH + '/styles/**/*.styl')
    .pipe(stylus())
    .pipe(prefix("last 1 version", "> 1%"))
    .pipe(gulp.dest(TMP_PATH + '/styles'))
    .pipe(connect.reload())
    .on('end', cb);
});

// scripts
gulp.task('coffee', function (cb) {
  gulp.src(SRC_PATH + '/scripts/**/*.coffee')
    .pipe(coffee())
    .pipe(ngmin({dynamic: true}))
    .pipe(gulp.dest(TMP_PATH + '/scripts'))
    .pipe(connect.reload())
    .on('end', cb);
});

// views
gulp.task('jade', function (cb) {
  if (TMP_PATH === targetPath) {
    gulp.src([SRC_PATH + '/views/*.jade', SRC_PATH + '/views/cached/*.jade'])
      .pipe(jade())
      .pipe(gulp.dest(targetPath + '/views'))
      .pipe(connect.reload())
      .on('end', cb);
  } else if (DIST_PATH === targetPath) {
    es.concat(
      gulp.src(SRC_PATH + '/views/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(targetPath + '/views')),
      gulp.src(SRC_PATH + '/views/cached/**/*.jade')
        .pipe(jade())
        .pipe(templateCache())
        .pipe(gulp.dest(DIST_PATH + '/scripts'))
    ).on('end', cb);
  }
});

gulp.task('serveConcurrent', [
  'copy',
  'images',
  'jade',
  'prepareIndex',
  'stylus',
  'coffee'
]);

gulp.task('distConcurrent', [
  'copy',
  'images',
  'stylus',
  'coffee',
  'jade'
]);

gulp.task('setServePath', function () {
  targetPath = TMP_PATH;
});

gulp.task('setDistPath', function () {
  targetPath = DIST_PATH;
});

gulp.task('build', ['dist']);

gulp.task('dist', ['setDistPath', 'clean', 'distConcurrent'], function () {
  gulp.src(SRC_PATH + '/index.jade')
    .pipe(wiredep())
    .pipe(jade())
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty: true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest(targetPath))
    .pipe(connect.reload());
});

gulp.task('serve', ['setServePath', 'clean', 'serveConcurrent', 'connect', 'watch']);