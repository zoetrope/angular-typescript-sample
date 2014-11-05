/// <reference path="../../typings/tsd.d.ts" />

module main {
  export class MyService {
    add(a:number, b:number):number {
      return a + b;
    }
  }
}

angular.module("app")
  .factory("myService", ():main.MyService=> {
    return new main.MyService();
  });