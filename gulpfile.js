var gulp = require('gulp');
var gutil = require('gulp-util');
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
      bundle: 'bundle.js',
      all: './build/js'
    }
  }
};

/* === DEFAULT ============================================================== */
gulp.task('default', function () {
  gulp.run('scripts');
});

/* === WATCH ================================================================ */

gulp.watch(files.scripts.src.all, function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.run('scripts');
});

/* ==== TASKS =============================================================== */
gulp.task('scripts', function () {
  gulp.src([files.scripts.src.root])
    .pipe(browserify({
      debug: true
    }))
    .pipe(concat(files.scripts.dest.bundle))
    .pipe(uglify())
    .pipe(gulp.dest(files.scripts.dest.all));
});
