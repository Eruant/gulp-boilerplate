/*
 * Gulp
 */
/*globals require*/

var gulp = require('gulp');
var compileTasks = require('./gulpTasks_compile');
var gitTasks = require('./gulpTasks_git');

compileTasks.addTasks();
gitTasks.addTasks();

// default
gulp.task('default', function () {
  gulp.run('compile');
});
