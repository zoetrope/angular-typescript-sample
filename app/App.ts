/// <reference path="../typings/tsd.d.ts" />
'use strict';

angular.module('app', [
  'ui.router',
  'ui.bootstrap'
]);

angular.module('app')
  .config(function ($stateProvider:ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
    $stateProvider.state('main', {
      url: '/',
      templateUrl: 'main/main.html'
    });
    $urlRouterProvider.otherwise('/');
  }
);
