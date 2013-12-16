/// <reference path="../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts" />

console.log("ignite!");

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
        $routeProvider.when('/', { templateUrl: 'views/main.html'})
        $routeProvider.otherwise({ redirectTo: '/'});
    }
    ]);
