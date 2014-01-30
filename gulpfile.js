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
var imagemin = require('gulp-imagemin');

// default
gulp.task('default', function () {
  gulp.run('compile');
});

// watch
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

  gulp.src('./src/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));

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
 * init - use to create local branches
 **/
gulp.task('init', function () {
  gulp.src('./')
    .pipe(git.branch('dev'))
    .pipe(git.branch('test'));
});

/**
 * Feature - use to create new feature branches
 * 
 * @options --new "branchName"
 * @options --complete "branchName"
 **/
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

/**
 * readyToTest - use to merge `dev` changes into the test branch
 **/
gulp.task('readyToTest', function () {
  gulp.src('./')
    .pipe(git.checkout('test'))
    .pipe(git.pull('origin', 'test'))
    .pipe(git.merge('dev'))
    .pipe(git.push('origin', 'test'))
    .pipe(git.checkout('dev'));
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
    .pipe(git.merge('master'))
    .pipe(git.push('origin', 'dev'));

});

/**
 * hotfix - for fixing bugs on the live branch
 **/
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
      .pipe(git.merge('master'))
      .pipe(git.push('origin', 'dev'));
  } else {
    console.log('Aborting: use [--new "featureName" | --complete "featureName"]');
  }

});
