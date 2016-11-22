'use strict';

describe('dynamic-bind-html', function () {
  var $scope, $compile, $rootScope, element;

  function compileDirective(template, scope) {
    var elm;

    elm = angular.element(template);
    angular.element(document.body).prepend(elm);

    $scope = angular.extend($scope, scope);

    $compile(elm)($scope);
    $scope.$digest();

    return elm;
  }

  beforeEach(module('ngSanitize', 'dynamicBindHtml'));
  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $scope = $rootScope.$new();
  }));

  afterEach(function () {
    if (element) element.remove();
  });

  it('should compile nested angular directive', function() {
    let template = "<div dynamic-bind-html='{{dynamicHtml}}'></div>";
    let scope = {
      dynamicHtml: "<div ng-bind-html='html'></div>",
      html: "<h1>Expected Content</h1>"
    };
    element = compileDirective(template, scope);
    expect(element.text()).toContain("Expected Content");
  });

  it('should work with generator functions, too', function() {
    let template = "<div dynamic-bind-html='{{dynamicHtml()}}'></div>";
    let scope = {
      dynamicHtml: () => "<div ng-bind-html='html()'></div>",
      html: () => "<h1>Expected Content</h1>"
    };
    element = compileDirective(template, scope);
    expect(element.text()).toContain("Expected Content");
  });

  it('should react to updateDynamicBindHtml $broadcast event', function() {
    let template = "<div dynamic-bind-html='{{dynamicHtml}}'></div>";
    let scope = {
      dynamicHtml: "<div ng-bind-html='html'></div>",
      html: "<h1>Expected Content</h1>"
    };
    element = compileDirective(template, scope);
    expect(element.text()).toContain("Expected Content");

    $scope.html = "<h1>Updated Content</h1>";
    $scope.$broadcast('updateDynamicBindHtml');
    $scope.$digest();
    expect(element.text()).toContain('Updated Content');
  });

});
