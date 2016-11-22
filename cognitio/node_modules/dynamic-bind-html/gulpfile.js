/**
 * Credit goes to angular-directive-boilerplate
 * https://www.npmjs.com/package/angular-directive-boilerplate
 * Heavily modified.
 *
 * In some cases commands must be run twice to succeed.
 * TODO: Replace Gulp with webpack and update dev dependencies.
 */

var del = require('del');
var fs = require('fs');

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var babel = require("gulp-babel");
var connect = require('gulp-connect');
var header = require('gulp-header');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var open = require('gulp-open');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var karma = require('karma').Server;

var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
};

gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});

gulp.task('html-reload', function () {
  gulp.src(['./demo/src/*.html', '.src/*.html'])
    .pipe(connect.reload());
});

gulp.task('sass-demo', function () {
  return gulp.src('./demo/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./demo'));
});

gulp.task('css-demo', ['sass-demo'], function () {
  gulp.src(['./demo/src/*.css'])
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./demo'))
    .pipe(connect.reload());
  del(['demo/**/*.css']);
});

gulp.task('build-demo', function () {
  gulp.src('./demo/src/*.js')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(babel({presets:['es2015']}))
    .pipe(uglify({
      preserveComments: 'none',
      mangle: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./demo'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./**/*.html'], ['html-reload']);
  gulp.watch(['./demo/src/*.scss'], ['css-demo']);
  gulp.watch(['./demo/src/*.js'], ['build-demo']);
  gulp.watch(['./src/*.js'], ['build']);
});

gulp.task('clean', function(cb) {
  del(['dist/**/*'], cb);
});

gulp.task('build', ['clean'], function() {
  gulp.src('src/dynamic-bind-html.js')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(jshint({esversion: 6}))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(babel({presets:['es2015']}))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify({
      preserveComments: 'some',
      mangle: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('open', function() {
  gulp.src('./demo/src/demo.html')
  .pipe(open('', {url: 'http://localhost:8080/demo/src/demo.html'}));
});

gulp.task('jshint-test', function() {
  gulp.src('./test/**/*.js')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(jshint({esversion: 6}))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('karma', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
      done(); // anonymous function fixes formatError
  });
});

gulp.task('karma-serve', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function() {
      done(); // anonymous function fixes formatError
  });
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
};

gulp.task('test', ['build', 'jshint-test', 'karma']);
gulp.task('serve', ['build', 'build-demo', 'css-demo', 'connect', 'watch', 'open']);
gulp.task('serve-test', ['build', 'watch', 'jshint-test', 'karma-serve']);
gulp.task('default', ['test']);
