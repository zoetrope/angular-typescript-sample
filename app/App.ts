/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
'use strict';

angular.module('app', [
  'ngRoute'
]);

angular.module('app')
  .config(function routes($routeProvider:ng.route.IRouteProvider) {
    $routeProvider.when('/', {templateUrl: 'main/main.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }
);
