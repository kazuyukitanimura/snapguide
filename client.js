//;
(function(window, document, location, $) {
  /**
   * Model
   */
  var fetchModel = function(uuid) {

  };

  /**
   * View
   */
  var render = function(model, step, view) {

  };

  /**
   * Controller
   */
  var route = function(obj) {
    var guide = obj.guide || 'b995492d5e7943e3b2757a88fe3ef7c6';
    var step = parseInt(obj.step, 10) || 0;
    var view = parseInt(obj.view, 10) || 0;

    var model = fetchModel(guide);
    render(model, step, view);
  };

  /*
   * Hash change
   */
  var hash;
  var hashObj = {};
  var onHashChange = function() {
    // Firefox automatically decode location.hash, so use location.href :(
    // http://stackoverflow.com/questions/4835784/firefox-automatically-decoding-encoded-parameter-in-url-does-not-happen-in-ie/4835922
    var nextHash = location.href.split('#')[1]; //location.hash.slice(1);
    if (nextHash !== hash) {
      try {
        var nextHashObj = JSON.parse(decodeURIComponent(nextHash));
        route(nextHashObj);
        hash = encodeURIComponent(JSON.stringify($.extend(hashObj, nextHashObj)));
        window.scrollTo(0, 0); // scroll to top
      } catch(err) {
        console.warn(err);
      }
    }
  };
  onHashChange();
  window.onhashchange = onHashChange;

})(window, window.document, window.document.location, window.$);
