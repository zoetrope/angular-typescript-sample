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
    libraries: 'lib.js',
    compiled: 'app-compiled.js',
    deployed: 'app.js'
  },
  // 依存ライブラリを依存順に並べる
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

gulp.task('copy:ts', [], function () {
  return gulp.src(path.join(config.paths.app, '**/*.ts'))
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('deploy:font', [], function () {
  return gulp.src('./bower_components/bootstrap/dist/fonts/*', {base: './bower_components/bootstrap/dist/'})
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('deploy:css', [], function () {
  return gulp.src(
    [
      './bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/bootstrap/dist/css/bootstrap-theme.css'
    ],
    {base: './bower_components/bootstrap/dist/'})
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('deploy:index', [], function () {
  return gulp.src(path.join(config.paths.app, 'index.html'))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('deploy:static-file', ['deploy:font', 'deploy:css', 'deploy:index']);

gulp.task('deploy:template', function () {
  return gulp.src([path.join(config.paths.app, '**/*.html'), '!' + path.join(config.paths.app, 'index.html')])
    .pipe($.angularTemplatecache({
      module: config.moduleName
    }))
    .pipe($.rename(config.files.template))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('tsc', ['copy:ts'], function () {
  return gulp.src(path.join(config.paths.build, '**/*.ts'))
    .pipe($.plumber())
    .pipe($.tsc({
      out: config.files.compiled,
      target: 'ES5',
      noImplicitAny: true,
      sourcemap: true,
      sourceRoot: './',
      mapRoot: ''
    }))
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('deploy:ts', [], function () {
  return gulp.src(path.join(config.paths.app, '**/*.ts'))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('deploy:app', ['tsc'], function () {
  return gulp.src(path.join(config.paths.build, config.files.compiled))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.ngAnnotate({
      sourcemap: true,
      sourceroot: './',
      remove: true,
      add: true
    }))
    .pipe($.if(gulp.env.production, $.uglify()))
    .pipe($.rename(config.files.deployed))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('copy:lib', function () {
  return gulp.src($.mainBowerFiles())
    .pipe(gulp.dest(config.paths.build_libs));
});

gulp.task('deploy:lib', ['copy:lib'], function () {
  return gulp.src(
    config.libraries.map(function (lib) { return path.join(config.paths.build_libs, lib); })
  )
    .pipe($.concat(config.files.libraries))
    .pipe($.if(gulp.env.production, $.uglify()))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('deploy', ['deploy:static-file', 'deploy:template', 'deploy:ts', 'deploy:app','deploy:lib']);

gulp.task('watch', [], function () {
  gulp.watch(path.join(config.paths.public, 'index.html'), ['deploy:index']);
  gulp.watch(path.join(config.paths.app, '**/*.html'), ['deploy:template']);
  gulp.watch(path.join(config.paths.app, '**/*.ts'), ['deploy:ts', 'deploy:app']);
});

gulp.task('serve', ['watch'], function () {
  return gulp.src(config.paths.public)
    .pipe($.webserver());
});

gulp.task('unittest', function (callback) {
  karma.start({
    configFile: 'test/unit/karma.conf.js',
    singleRun: true
  }, callback);
});

var webdriver_update = $.protractor.webdriver_update;
var webdriver_standalone = $.protractor.webdriver_standalone;
gulp.task('webdriver:update', webdriver_update);
gulp.task('webdriver:start', webdriver_standalone);

gulp.task('e2etest', function (callback) {
  gulp.src(['test/e2e/*.js'])
    .pipe($.protractor.protractor({
      configFile: './test/e2e/protractor.conf.js'
    })).on('error', function (e) {
      console.log(e)
    }).on('end', callback);
});

gulp.task('init', ['tsd', 'bower']);

gulp.task('default', ['deploy']);