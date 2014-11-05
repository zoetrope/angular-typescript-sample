/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
'use strict';

angular.module('app.controller', []);
angular.module('app.directive', []);
angular.module('app.filter', []);
angular.module('app.service', []);

angular.module('app', [
  'app.controller',
  'app.directive',
  'app.filter',
  'app.service',
  'ngRoute'
]);

angular.module('app')
  .config(['$routeProvider', function routes($routeProvider:ng.route.IRouteProvider) {
    $routeProvider.when('/', {templateUrl: 'main/main.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }
  ]);
