/*
 * Gulp
 */

/*globals require, console*/

var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var git = require('gulp-git');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var pkg = require('./package.json');

var files = {
  scripts: {
    src: {
      root: './src/js/base.js',
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

/**
 * Tasks
 * - compile
 * - scripts
 * - release
 */

/**
 * compile - compiles the whole src folder
 */
gulp.task('compile', function () {
  gulp.run('scripts');
});

/**
 * scripts - parse and compile all javaScript files
 */
gulp.task('scripts', function () {

  gulp.src(files.scripts.src.all)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));

  gulp.src([files.scripts.src.root]).pipe(browserify({
    debug: true
  }))
    .pipe(concat(files.scripts.dest.bundle))
    .pipe(uglify())
    .pipe(gulp.dest(files.scripts.dest.all));

});

/**
 * Release - Use to publish the code
 *
 * @options --type [major|minor|patch]
 */
gulp.task('release', ['compile'], function () {

  // set up options
  var bumpOptions = {};
  var versionNumber = pkg.version;
  var message = gulp.env.msg;

  if (!message) {
    console.log('Aborting: commit message must be set (--msg "message")');
    return;
  }

  switch (gulp.env.type) {
    case 'major':
      bumpOptions.type = 'major';
      break;
    case 'minor':
      bumpOptions.type = 'minor';
      break;
    case 'patch':
      bumpOptions.type = 'patch';
      break;
    default:
      bumpOptions.type = 'patch';
      break;
  }

  // release the files
  gulp.src('./package.json')
    .pipe(bump(bumpOptions))
    .pipe(gulp.dest('./'));

  gulp.src('./')
    .pipe(git.pull('origin', 'master'))
    .pipe(git.add())
    .pipe(git.commit(message))
    .pipe(git.push('origin', 'master'));

});

/**
 * TODO create tasks for
 * - new feature
 * - complete feature
 * - new test branch
 * - push to dev
 *
 * awaiting pull request for commands git.branch() git.merge() git.checkout()
 */
