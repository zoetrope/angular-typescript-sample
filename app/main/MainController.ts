/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Item.ts" />

'use strict';

module main {
  export interface MainScope extends ng.IScope {
    content: string;
    items: Item[];
    add(item:string): void;
  }
  export class MainController {

    constructor(private $scope:MainScope) {
      $scope.items = [];
      $scope.add = function (item:string):void {
        $scope.items.push(new Item(item));
      }
    }
  }
}

angular.module('app').controller("MainController",
  ($scope:main.MainScope):main.MainController => {
    return new main.MainController($scope)
  });
