describe('Application', function () {
  var input;
  var button;
  var items;

  beforeEach(function () {
    browser.get('/index.html');
    input = element(by.model('data'));
    button = element(by.buttonText('add'));
    items = element.all(by.repeater('item in items'));
  });

  it('Itemが追加できる', function () {
    expect(items.count()).toEqual(0);
    input.sendKeys('new item!');
    button.click();
    expect(items.count()).toEqual(1);
  });
});
