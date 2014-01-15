var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');

var scriptSrc = './src/js/*.js';
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
  gulp.src(scriptSrc)
    .pipe(uglify())
    .pipe(gulp.dest(scriptDest));
});
