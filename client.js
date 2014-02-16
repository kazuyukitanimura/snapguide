//;
(function(window, document, location, $) {
  /**
   * Constants
   */
  var API_URL = 'http://snapguide.com/api/v1/guide/';
  var STEP_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video'
  };

  /**
   * Utils
   */
  var escapeQuote = function(text) {
    return text.replace(/"/g, '\\"') || '';
  };

  /**
   * Model
   */
  var Step = function(caption, media) {
    if (! (this instanceof Step)) { // enforcing new
      return new Step(caption, media_item_uuid);
    }
    this.caption = caption || '';
    this.media = media || {};
  };

  var Model = function(title, author, steps) {
    if (! (this instanceof Model)) { // enforcing new
      return new Model(title, author, steps);
    }
    this.title = title || 'whatever';
    this.author = author || 'whoever';
    this.steps = steps || [];
  };
  Model.prototype.addStep = function(caption, media) {
    this.steps.push(new Step(caption, media));
  };

  var $spinner = $('#spinner');
  var fetchModel = function(uuid, callback) {
    if ($.isString(uuid) && $.isFunction(callback)) {
      var createModels = function(data) {
        var guide = data.guide;
        if (guide) {
          var title = guide.publish_title;
          var author = guide.author && guide.author.name;
          var model = new Model(title, author);
          var items = guide.items || [];
          var media = guide.media || {};
          for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i];
            var content = item.content;
            if (content && content.media_item_uuid) {
              model.addStep(content.caption, media[content.media_item_uuid]);
            }
          }
          callback(model);
          $spinner.hide();
        }
      };
      $spinner.show();
      if (window.Promise) { // Promise Demo!!
        $.get(API_URL + uuid).then(createModels);
      } else {
        $.get(API_URL + uuid, createModels);
      }
    }
  };

  /**
   * View
   */
  var view1 = '<div id="{{step}}" class="view1" style="display: none;"><h3>{{caption}}</h3><img src="{{url}}"></div>';
  var view2 = '<div id="thumb{{step}}" class="view2"><h3>{{caption}}</h3><img src="{{thumurl}}"></div>';
  var $title = $('#title');
  var $author = $('#author');
  var $gallery = $('#gallery');
  var navigate = function(step, view) {
    $('.view2').css('background-color', '');
    $('#thumb' + step).css('background-color', '#007AFF');
  };
  var render = function(model, step, view) {
    $title.text(model.title);
    $author.text('by ' + model.author);
    var steps = model.steps;
    for (var i = 0, l = steps.length; i < l; i++) {
      var stp = steps[i];
      var url = stp.media.thumb_url || stp.media.url; // TODO video
      var variables = {
        '{{step}}': i,
        '{{caption}}': escapeQuote(stp.caption),
        '{{url}}': escapeQuote(url),
        '{{thumurl}}': escapeQuote(url.replace(/\/original/i, '/100x100_ac'))
      };
      var html = view1 + view2;
      for (var k in variables) {
        if (variables.hasOwnProperty(k)) {
          html = html.replace(new RegExp(k, 'g'), variables[k]);
        }
      }
      $gallery.append($(html));
    }
    navigate(step, view);
  };

  /**
   * Controller
   */
  var guide = '';
  var route = function(obj) {
    var newGuide = obj.guide || 'b995492d5e7943e3b2757a88fe3ef7c6';
    var step = parseInt(obj.step, 10) || 0;
    var view = parseInt(obj.view, 10) || 0;

    if (guide === newGuide) {
      navigate(step, view);
    } else {
      fetchModel(guide, function(model) {
        render(model, step, view);
        guide = newGuide;
      });
    }
  };

  /*
   * Hash change
   */
  var hash = '';
  var hashObj = {};
  var onHashChange = function() {
    // Firefox automatically decode location.hash, so use location.href :(
    // http://stackoverflow.com/questions/4835784/firefox-automatically-decoding-encoded-parameter-in-url-does-not-happen-in-ie/4835922
    var nextHash = location.href.split('#')[1] || '{}'; //location.hash.slice(1);
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
