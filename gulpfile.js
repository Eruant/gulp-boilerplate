/*
 * Gulp
 */
/*globals require, console */

var gulp = require('gulp');
//var gutil = require('gulp-util');
var bump = require('gulp-bump');
var git = require('gulp-git');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var compass = require('gulp-compass');
var minifyHTML = require('gulp-minify-html');

//var pkg = require('./package.json');
var config = require('./config.json');

// default
gulp.task('default', function () {
  gulp.run('compile');
});

// watch
gulp.watch(config.scripts.src.all, function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.run('scripts');
});

/* === Tasks ================================================================ */

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

  gulp.src(config.scripts.src.all)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));

  gulp.src([config.scripts.src.root]).pipe(browserify({
    debug: true
  }))
    .pipe(concat(config.scripts.dest.bundle))
    .pipe(uglify())
    .pipe(gulp.dest(config.scripts.dest.all));

});

/**
 * styles - parse and compile all stylesheets
 */
gulp.task('styles', function () {
  gulp.src(config.styles.src.root)
    .pipe(compass({
      config_file: config.styles.config,
      css: 'stylesheets'
    }))
    .pipe(gulp.dest(config.styles.dest.bundle));
});

/**
 * markup - parse and compile all html / templates
 */
gulp.task('markup', function () {
  gulp.src(config.markup.src.all)
    .pipe(minifyHTML({
      comments: false
    }))
    .pipe(gulp.dest(config.markup.dest.all));
});

/**
 * assets - compress all images
 */
gulp.task('assets', function () {
  // TODO complete assets
});

/**
 * Release - Use to publish the code
 *
 * @options --type [major|minor|patch]
 */
gulp.task('release', ['compile'], function () {
  // TODO refine and complete this function - see notes at end of function

  // set up options
  var bumpOptions = {};
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
    .pipe(git.checkout('master'))
    .pipe(git.merge('test'))
    .pipe(git.pull('origin', 'master'))
    .pipe(git.add())
    .pipe(git.commit(message))
    .pipe(git.push('origin', 'master'))
    .pipe(git.checkout('dev'))
    .pipe(git.merge('master'));

});

gulp.task('feature', function () {

  if (gulp.env.new && gulp.env.new !== true) {
    gulp.src('./')
      .pipe(git.checkout('dev'))
      .pipe(git.pull('origin', 'dev'))
      .pipe(git.branch("f_" + gulp.env.new))
      .pipe(git.checkout("f_" + gulp.env.new));
  } else if (gulp.env.complete && gulp.env.complete !== true) {
    gulp.src('./')
      .pipe(git.checkout('dev'))
      .pipe(git.merge("f_" + gulp.env.complete))
      .pipe(git.branch("f_" + gulp.env.complete, '-d'))
      .pipe(git.push('origin', 'dev'));
  } else {
    console.log('Aborting: use [--new "featureName" | --complete "featureName"]');
  }

});

gulp.task('readyToTest', function () {
  gulp.src('./')
    .pipe(git.checkout('test'))
    .pipe(git.pull('origin', 'test'))
    .pipe(git.merge('dev'))
    .pipe(git.push('origin', 'test'))
    .pipe(git.checkout('dev'));
});

gulp.task('init', function () {
  gulp.src('./')
    .pipe(git.branch('dev'))
    .pipe(git.branch('test'));
});

gulp.task('hotfix', function () {

  var message = gulp.env.msg;

  if (gulp.env.new && gulp.env.new !== true) {
    gulp.src('./')
      .pipe(git.checkout('master'))
      .pipe(git.pull('origin', 'master'))
      .pipe(git.branch("hf_" + gulp.env.new))
      .pipe(git.checkout("hf_" + gulp.env.new));
  } else if (gulp.env.complete && gulp.env.complete !== true) {

    if (!message) {
      console.log('Aborting: commit message must be set (--msg "message")');
      return;
    }

    gulp.src('./package.json')
      .pipe(bump({ type: 'patch' }))
      .pipe(gulp.dest('./'));

    gulp.src('./')
      .pipe(git.add())
      .pipe(git.commit(message))
      .pipe(git.checkout('master'))
      .pipe(git.merge("hf_" + gulp.env.complete))
      .pipe(git.branch("hf_" + gulp.env.complete, '-d'))
      .pipe(git.push('origin', 'master'))
      .pipe(git.checkout('dev'))
      .pipe(git.merge('master'));
  } else {
    console.log('Aborting: use [--new "featureName" | --complete "featureName"]');
  }

});
