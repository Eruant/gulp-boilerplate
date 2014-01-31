/**
 * gulpTasks_compile
 **/
/*globals require, exports, console */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var compass = require('gulp-compass');
var minifyHTML = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var jasmine = require('gulp-jasmine');

exports.addTasks = function () {

  /**
   * compile - compiles the whole src folder
   */
  gulp.task('compile', function () {
    gulp.run('scripts', 'styles', 'markup', 'assets');
  });

  /**
   * scripts - parse and compile all javaScript files
   */
  gulp.task('scripts', function () {

    gulp.src('./src/js/**/*.js')
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'));

    gulp.src('./tests/*.js')
      .pipe(jasmine());

    gulp.src(['./src/js/base.js']).pipe(browserify({
      debug: true
    }))
      .pipe(concat('bundle.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./bin/js'));

  });

  /**
   * styles - parse and compile all stylesheets
   */
  gulp.task('styles', function () {
    gulp.src('./src/scss/*.scss')
      .pipe(compass({
        css: 'bin/css',
        sass: 'src/scss'
      }))
      .pipe(gulp.dest('bin/css'));
  });

  /**
   * markup - parse and compile all html / templates
   */
  gulp.task('markup', function () {
    gulp.src('./src/html/*.html')
      .pipe(minifyHTML({
        comments: false
      }))
      .pipe(gulp.dest('./bin'));
  });

  /**
   * assets - compress all images
   */
  gulp.task('assets', function () {
    gulp.src('./src/img/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./bin/img'));
  });

  /**
   * watch - watches for changes
   **/
  gulp.task('watch', function () {

    gulp.watch('./src/js/**/*.js', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('scripts');
    });

    gulp.watch('./src/scss/**/*.scss', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('styles');
    });

    gulp.watch('./src/html/*.html', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('markup');
    });

    gulp.watch('./src/img/**/*', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('assets');
    });

  });
};
