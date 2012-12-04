(function(M) {
/* Defining Backbone models, collections and views */
var Page = Backbone.Model.extend({
  defaults: {
    name: "index",
    children: [],
    content: []
  },
  initialize: function() {
    // adding the name of the model as its id.
    // look up of this model through the collection
    // is faster this way.
    this.set({id: this.sanitize(this.get('name'))});
  },
  sanitize: function(str) {
    return str.replace(' ','-');
  }
});

var Pages = Backbone.Collection.extend({
  model: Page
});

var PageView = Backbone.View.extend({
  className: 'page',
    types: {
      'image': '<img/>',
      'text': '<div></div>'
    },
    initialize: function() {
      _.bindAll(this);
      //_.bind(this.render, this);
      $('#container').append(this.el);
      this.render();
      $(this.el).hide();
    },
    render: function() {
      var types = this.types;
      var el = this.el;
      _.each(this.model.get('content'), function(data) {
        var elem = $(types[data['type']]);
        if(data['src']) {
          elem.attr('src', data['src']);
        }
        if(data['id']) {
          elem.attr('id', data['id']);
        }
        elem.html(data['data']);
        elem.appendTo(el);
      });
    }
});

var AppView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this);
  },
  render: function() {
    $('#index').show();
  }
});

/* Defining other necessary functions */
M.init = function() {
  M.pages = new Pages(), page_views = [];
  _.each(M.site_content, function(page) {
    var new_page = new Page(page);
    var new_page_view = new PageView({model: new_page,
      id: new_page.get('id')});
    M.pages.add(new_page);
    page_views.push(new_page_view);
  });
  M.appView = new AppView();
  M.appView.render();
};

M.createNavigation = function() {
};

})(M);
