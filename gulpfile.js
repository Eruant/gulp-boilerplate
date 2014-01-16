/*
 * Gulp
 */

/*globals require, console*/

var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

var files = {
  scripts: {
    src: {
      root: 'src/js/base.js',
      all: './src/js/**/*.js'
    },
    dest: {
      bundle: 'base.min.js',
      all: './build/js'
    }
  }
};

// default
gulp.task('default', function () {

  gulp.run('compile');

});

// watch
gulp.watch(files.scripts.src.all, function (event) {

  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.run('scripts');

});

/*
 * Tasks
 **/

// compile all files
gulp.task('compile', function () {

  gulp.run('scripts');

});

// javaScript
gulp.task('scripts', function () {

  gulp.src([files.scripts.src.root]).pipe(browserify({
    debug: true
  }))
    .pipe(concat(files.scripts.dest.bundle))
    .pipe(uglify())
    .pipe(gulp.dest(files.scripts.dest.all));

});

// update the package number
gulp.task('release-patch', function () {

  gulp.run('compile');

  gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));

});

gulp.task('release', function () {

  gulp.run('release-patch');

});

gulp.task('release-minor', function () {

  gulp.run('compile');

  gulp.src('./package.json')
    .pipe(bump({
      type: 'minor'
    }))
    .pipe(gulp.dest('./'));

});

gulp.task('release-major', function () {

  gulp.run('compile');

  gulp.src('./package.json')
    .pipe(bump({
      type: 'major'
    }))
    .pipe(gulp.dest('./'));

});
