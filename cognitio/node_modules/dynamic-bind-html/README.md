# dynamic-bind-html [![npm](https://img.shields.io/npm/v/dynamic-bind-html.svg?maxAge=2592000)](https://www.npmjs.com/package/dynamic-bind-html) [![CircleCI](https://img.shields.io/circleci/project/rachael/dynamic-bind-html.svg?maxAge=2592000)](https://circleci.com/gh/rachael/dynamic-bind-html)

A directive inspired by `ng-bind-html` that accepts uncompiled angular code in addition to raw html.

You can also manually trigger a re-`$compile` of its contents with an `"updateDynamicBindHtml"` event.

### Installation

Install via npm:
```shell
npm install dynamic-bind-html
```

Then include the dependency on your Angular module.
```javascript
var app = angular.module('myapp', ['dynamic-bind-html']);
```

### Usage

In the template:
```html
<div dynamic-bind-html='{{dynamicHtml}}'></div>
```

In the controller:
```javascript
$scope.dynamicHtml = "<span ng-bind-html='html'></span>";
$scope.html = "<h1>Expected Content</h1>";
```

Compiled result:
```html
<div dynamic-bind-html="<span ng-bind-html='html'></span>">
    <span ng-bind-html="html">
        <h1>Expected Content</h1>
    </span>
</div>
```

### Development

Install Gulp via npm if you don't have it
```shell
npm install -g gulp
```

Install npm and bower dev dependencies
```shell
npm install
bower install
```

### Available commands

* `gulp`: build and test the project; equivalent to `gulp test`
* `gulp build`: build the project and make new files in `dist`
* `gulp serve`: start a server to serve the demo page and launch a browser then watches for changes in `src` files to reload the page
* `gulp test`: runs tests
* `gulp serve-test`: runs tests and keep test browser open for development. Watches for changes in source and test files to re-run the tests

### License
MIT
