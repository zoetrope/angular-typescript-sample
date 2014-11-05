/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="./Item.ts" />

'use strict';

module app.controller {
    export interface MainScope extends ng.IScope {
        content: string;
        items: app.models.Item[];
        add(item:string): void;
    }
    export class MainController {

        constructor(private $scope:MainScope) {
            $scope.items = [];
            $scope.add = function (item:string):void {
                $scope.items.push(new app.models.Item(item));
            }
        }
    }
}

angular.module('app.controller').controller("MainController", ["$scope",
    ($scope:app.controller.MainScope):app.controller.MainController => {
        return new app.controller.MainController($scope)
    }]);
