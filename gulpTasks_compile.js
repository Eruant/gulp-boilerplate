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
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync');

exports.addTasks = function () {

  /**
   * compile - compiles the whole src folder
   */
  gulp.task('compile', ['scripts', 'styles', 'markup', 'assets']);

  /**
   * scripts - parse and compile all javaScript files
   */
  gulp.task('scripts', ['script-hints', 'script-test', 'script-bundle']);

  gulp.task('script-hints', function () {
    return gulp.src('./src/js/**/*.js')
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .on('error', function () {
        console.warn('Error: JSHint encounted an error');
      });
  });

  gulp.task('script-test', function () {
    return gulp.src('./test/*.js')
      .pipe(mocha());
  });

  gulp.task('script-bundle', function () {
    return gulp.src(['./src/js/base.js']).pipe(browserify({
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
    return gulp.src('./src/scss/*.scss')
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
    return gulp.src('./src/html/*.html')
      .pipe(minifyHTML({
        comments: false
      }))
      .pipe(gulp.dest('./bin'));
  });

  /**
   * assets - compress all images
   */
  gulp.task('assets', function () {
    return gulp.src('./src/img/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./bin/img'));
  });

  /**
   * watch - watches for changes
   **/
  gulp.task('watch', ['watch-scripts', 'watch-styles', 'watch-markup', 'watch-assets']);

  gulp.task('watch-scripts', function () {
    return gulp.watch('./src/js/**/*.js', function () {
      gulp.run('scripts');
    });
  });

  gulp.task('watch-styles', function () {
    return gulp.watch('./src/scss/**/*.scss', function () {
      gulp.run('styles');
    });
  });

  gulp.task('watch-markup', function () {
    return gulp.watch('./src/html/*.html', function () {
      gulp.run('markup');
    });
  });

  gulp.task('watch-assets', function () {
    return gulp.watch('./src/img/**/*', function () {
      gulp.run('assets');
    });
  });

  gulp.task('server', ['compile', 'watch'], function () {
    browserSync.init(['bin/css/*.css', 'bin/**/*.js', 'bin/**/*.html'], {
      server: {
        baseDir: './bin'
      },
      injectChanges: false,
      reloadDelay: 2000
    });
  });

};
