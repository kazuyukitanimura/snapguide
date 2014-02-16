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
  var isArray = function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : obj instanceof Array;
  };

  var get = function get(url, callback) {
    if (isString(url)) {
      if (isFunction(callback)) {
        // TODO write ajax call once proxy is set up
        callback(window.testdata);
      } else if (window.Promise) {
        return new Promise(function(resolve, reject) {
          // TODO write ajax call once proxy is set up
          resolve(window.testdata);
        });
      }
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

  var text = function(newText) {
    if (newText) {
      for (var i = this.length || 0; i--;) {
        this[i].textContent = newText;
      }
    } else {
      return (this[0] || {}).textContent;
    }
  };

  var append = function(children) {
    if (!isArray(children)) {
      children = [children];
    }
    for (var i = this.length || 0; i--;) {
      for (var j = 0, l = children.length; j < l; j++) {
        this[i].appendChild(children[j]);
      }
    }
  };

  var show = function() {
    for (var i = this.length || 0; i--;) {
      this[i].style.display = '';
    }
  };

  var hide = function() {
    for (var i = this.length || 0; i--;) {
      this[i].style.display = 'none';
    }
  };

  var css = function(key, val) {
    if (val === undefined) {
      return ((this[0] || {}).style || {})[key];
    } else {
      for (var i = this.length || 0; i--;) {
        this[i].style[key] = val;
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
      } else if (document.getElementsByClassName && document.querySelectorAll) {
        if (isClass) {
          results = document.getElementsByClassName(name);
        } else if (/^\s*<(?:.|\n)*?>\s*$/m.test(selector)) { // isHtml?
          var div = document.createElement('div');
          div.innerHTML = selector;
          results = Array.prototype.slice.call(div.childNodes);
        } else {
          results = document.querySelectorAll(selector);
        }
      } else {
        console.error('Are you using IE?');
      }
    }
    results.text = text;
    results.append = append;
    results.show = show;
    results.hide = hide;
    results.css = css;
    return results;
  };

  myQuery.isString = isString;
  myQuery.isFunction = isFunction;
  myQuery.isObject = isObject;
  myQuery.get = get;
  myQuery.extend = extend;

  window.$ = myQuery;
})(window, window.document);
