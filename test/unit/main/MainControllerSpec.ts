/// <reference path="../../../typings/tsd.d.ts"/>
/// <reference path="../../../app/main/MyService.ts"/>

describe('MyService', function () {
  beforeEach(module('app'));
  it('サービスを呼んでみる', inject(function (myService:main.MyService) {
    expect(myService.add(1, 2)).toEqual(3);
  }));
});