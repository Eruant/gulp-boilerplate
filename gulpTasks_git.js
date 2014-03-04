/**
 * gulpTasks_git
 **/
/*globals require, exports, console*/

var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');

exports.addTasks = function () {

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
      .pipe(git.pull('origin', 'master'))
      .pipe(git.merge('test'))
      .pipe(git.add())
      .pipe(git.commit(message))
      .pipe(git.push('origin', 'master'))
      .pipe(git.checkout('dev'))
      .pipe(git.pull('origin', 'dev'))
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

};
