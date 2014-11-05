var gulp = require('gulp');
var path = require('path');
var del = require('del');
var bower = require('bower');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files']
});

var config = {
  dir: {
    app: 'app',
    build: 'build',
    build_libs: 'build/libs',
    public: 'public'
  },
  file: {
    compiled: 'app-compiled.js',
    concatenated: 'app-concatenated.js',
    compressed: 'app-compressed.js',
    deployed: 'app.js'
  },
  libs: [
    'jquery.js',
    'angular.js',
    'angular-route.js',
    'angular-resource.js'
  ]
};

gulp.task('clean', function (callback) {
  del([config.dir.build, config.dir.public], callback);
});

gulp.task('copy:ts', [], function () {
  return gulp.src(path.join(config.dir.app, '**/*.ts'))
    .pipe(gulp.dest(config.dir.build));
});

gulp.task('copy:view', [], function () {
  return gulp.src(path.join(config.dir.app, '**/*.html'))
    .pipe(gulp.dest(config.dir.public));
});

gulp.task('tsc', ['copy:ts'], function () {
  return gulp.src(path.join(config.dir.build, '**/*.ts'))
    .pipe($.plumber())
    .pipe($.tsc({
      out: config.file.compiled,
      target: 'ES5'
    }))
    .pipe(gulp.dest(config.dir.build));
});

gulp.task('bower', function (callback) {
  bower.commands.install()
    .on('end', function () {
      callback()
    });
});

gulp.task('tsd', function (callback) {
  $.tsd({
    command: 'reinstall',
    config: './tsd.json'
  }, callback);
});

gulp.task('copy:lib', function () {
  return gulp.src($.mainBowerFiles())
    .pipe(gulp.dest(config.dir.build_libs));
});

gulp.task('concat', ['tsc', 'copy:lib'], function () {
  return gulp.src(config.libs.map(function (lib) {
    return path.join(config.dir.build_libs, lib);
  }).concat(path.join(config.dir.build, config.file.compiled)))
    .pipe($.concat(config.file.concatenated))
    .pipe(gulp.dest(config.dir.build));
});

gulp.task('uglify', ['concat'], function () {
  return gulp.src(path.join(config.dir.build, config.file.concatenated))
    .pipe($.uglify())
    .pipe($.rename(config.file.compressed))
    .pipe(gulp.dest(config.dir.build));
});

gulp.task('watch', [], function () {
  gulp.watch(path.join(config.dir.app, '**/*.ts'), ['deploy:dev']);
  gulp.watch(path.join(config.dir.app, '**/*.html'), ['copy:view']);
});

gulp.task('serve', ['watch'], function () {
  return gulp.src(config.dir.public)
    .pipe($.webserver());
});

gulp.task('deploy:dev', ['concat'], function () {
  return gulp.src(path.join(config.dir.build, config.file.concatenated))
    .pipe($.rename(config.file.deployed))
    .pipe(gulp.dest(config.dir.public));
});

gulp.task('deploy:rel', ['uglify'], function () {
  return gulp.src(path.join(config.dir.build, config.file.compressed))
    .pipe($.rename(config.file.deployed))
    .pipe(gulp.dest(config.dir.public));
});

gulp.task('build:dev', ['copy:view', 'deploy:dev']);
gulp.task('build:rel', ['copy:view', 'deploy:rel']);

gulp.task('init', ['tsd', 'bower']);

gulp.task('default', ['build:dev']);