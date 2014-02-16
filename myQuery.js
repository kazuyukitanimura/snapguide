//;
(function(window, document) {
  var isString = function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
  };
  var isFunction = function isFunction(obj) {
    return typeof obj === 'function';
  };
  var isObject = function isObject(obj) {
    return typeof obj === 'object' && obj instanceof Object;
  };

  var get = function get(url, callback) {
    if (isString(url) && isFunction(callback)) {
      // TODO write ajax call once proxy is set up
      callback(window.testdata);
    }
  };

  var extend = function extend() {
    var to = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
      var from = arguments[i];
      for (var prop in from) {
        if (from.hasOwnProperty(prop)) {
          to[prop] = from[prop];
        }
      }
    }
  };

  var myQuery = window.myQuery = function myQuery(selector) {
    var results = [];
    if (isString(selector)) {
      var isId = selector[0] === '#';
      var isClass = selector[0] === '.';
      var name = selector.slice(1);
      if (isId) {
        var result = document.getElementById(name);
        if (result) {
          results = [result];
        }
      } else if (document.getElementsByClassName || document.querySelectorAll) {
        results = isClass ? document.getElementsByClassName(name) : document.querySelectorAll(selector);
      } else {
        console.error('Are you using IE?');
      }
    }
    return results;
  };

  myQuery.isString = isString;
  myQuery.isFunction = isFunction;
  myQuery.isObject = isObject;
  myQuery.get = get;
  myQuery.extend = extend;

  window.$ = myQuery;
})(window, window.document);
