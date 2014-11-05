module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      '../../bower_components/jquery/dist/jquery.js',
      '../../bower_components/angular/angular.js',
      '../../bower_components/angular-resource/angular-resource.js',
      '../../bower_components/angular-sanitize/angular-sanitize.js',
      '../../bower_components/angular-ui-router/release/angular-ui-router.js',
      '../../bower_components/bootstrap/dist/js/bootstrap.js',
      '../../bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      '../../bower_components/angular-mocks/angular-mocks.js',
      '../../app/**/*.ts',
      './**/*.ts'
    ],
    frameworks: ['jasmine'],
    reporters: ['progress'],
    preprocessors: {
      '../../app/**/*.ts': ['typescript'],
      './**/*.ts': ['typescript']
    },
    typescriptPreprocessor: {
      options: {
        target: 'ES5',
        noImplicitAny: true
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
