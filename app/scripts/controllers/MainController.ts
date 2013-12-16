/// <reference path="../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../models/Item.ts" />

'use strict';

module app.controller {
    export class MainController {
        content: string;
        items: app.models.Item[];

        constructor(private $scope:ng.IScope) {
            this.items = []
        }
        add(item:string): void {
            this.items.push(new app.models.Item(item));
        }
    }
}

angular.module('app.controller').controller("MainController", ["$scope",
    ($scope:ng.IScope):app.controller.MainController => {
        return new app.controller.MainController($scope)
    }]);
