var gulp = require('gulp');
var path = require('path');
var del = require('del');
var bower = require('bower');
var karma = require('karma').server;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files']
});

var config = {
  paths: {
    app: 'app',
    build: 'build',
    build_libs: 'build/libs',
    public: 'public'
  },
  files: {
    template: 'template.js',
    compiled: 'app-compiled.js',
    annotated: 'app-annotated.js',
    concatenated: 'app-concatenated.js',
    compressed: 'app-compressed.js',
    deployed: 'app.js'
  },
  libraries: [
    'jquery.js',
    'angular.js',
    'angular-resource.js',
    'angular-sanitize.js',
    'angular-ui-router.js',
    'bootstrap.js',
    'ui-bootstrap-tpls.js'
  ],
  moduleName: 'app'
};

gulp.task('clean', function (callback) {
  del([config.paths.build, config.paths.public], callback);
});

gulp.task('copy:ts', [], function () {
  return gulp.src(path.join(config.paths.app, '**/*.ts'))
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('copy:font', [], function () {
  return gulp.src('./bower_components/bootstrap/dist/fonts/*', {base: './bower_components/bootstrap/dist/'})
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('copy:css', [], function () {
  return gulp.src(
    [
      './bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/bootstrap/dist/css/bootstrap-theme.css'
    ],
    {base: './bower_components/bootstrap/dist/'})
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('copy:view', [], function () {
  return gulp.src(path.join(config.paths.app, 'index.html'))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('copy:static-file', ['copy:font', 'copy:css', 'copy:view']);

gulp.task('template-cache', function () {
  return gulp.src([path.join(config.paths.app, '**/*.html'), '!' + path.join(config.paths.app, 'index.html')])
    .pipe($.angularTemplatecache({
      module: config.moduleName
    }))
    .pipe($.rename(config.files.template))
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('tsc', ['copy:ts'], function () {
  return gulp.src(path.join(config.paths.build, '**/*.ts'))
    .pipe($.plumber())
    .pipe($.tsc({
      out: config.files.compiled,
      target: 'ES5'
    }))
    .pipe(gulp.dest(config.paths.build));
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
    .pipe(gulp.dest(config.paths.build_libs));
});

gulp.task('annotate', ['tsc'], function () {
  return gulp.src(path.join(config.paths.build, config.files.compiled))
    .pipe($.ngAnnotate())
    .pipe($.rename(config.files.annotated))
    .pipe(gulp.dest(path.join(config.paths.build)));
});

gulp.task('concat', ['annotate', 'template-cache', 'copy:lib'], function () {
  return gulp.src(config.libraries.map(function (lib) {
    return path.join(config.paths.build_libs, lib);
  }).concat(path.join(config.paths.build, config.files.annotated))
    .concat(path.join(config.paths.build, config.files.template)))
    .pipe($.concat(config.files.concatenated))
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('uglify', ['concat'], function () {
  return gulp.src(path.join(config.paths.build, config.files.concatenated))
    .pipe($.uglify())
    .pipe($.rename(config.files.compressed))
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('watch', [], function () {
  gulp.watch(path.join(config.paths.public, 'index.html'), ['copy:view']);
  gulp.watch([
      path.join(config.paths.app, '**/*.ts'),
      path.join(config.paths.app, '**/*.html')
    ],
    ['deploy:dev']);
});

gulp.task('serve', ['watch'], function () {
  return gulp.src(config.paths.public)
    .pipe($.webserver());
});

gulp.task('deploy:dev', ['concat'], function () {
  return gulp.src(path.join(config.paths.build, config.files.concatenated))
    .pipe($.rename(config.files.deployed))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('deploy:rel', ['uglify'], function () {
  return gulp.src(path.join(config.paths.build, config.files.compressed))
    .pipe($.rename(config.files.deployed))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('unittest', function (callback) {
  karma.start({
    configFile: 'karma.conf.js',
    singleRun: true
  }, callback);
});

gulp.task('build:dev', ['copy:static-file', 'deploy:dev']);
gulp.task('build:rel', ['copy:static-file', 'deploy:rel']);

gulp.task('init', ['tsd', 'bower']);

gulp.task('default', ['build:dev']);