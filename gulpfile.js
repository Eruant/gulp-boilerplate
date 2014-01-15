var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

var scriptSrc = './src/js/**/*.js';
var scriptDest = './build/js';

/* === DEFAULT ============================================================== */
gulp.task('default', function () {
  gulp.run('scripts');
});

/* === WATCH ================================================================ */

gulp.watch(scriptSrc, function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.run('scripts');
});

/* ==== TASKS =============================================================== */
gulp.task('scripts', function () {
  gulp.src(['src/js/base.js'])
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest(scriptDest));
});
