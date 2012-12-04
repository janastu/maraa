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
    this.set({id: M.sanitize(this.get('name'))});
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
      _.each(this.model.get('content'), function(data) {
        var elem = $(this.types[data['type']]);
        if(data['src']) {
          elem.attr('src', data['src']);
        }
        if(data['id']) {
          elem.attr('id', data['id']);
        }
        if(data['type'] === 'rss') {
          var template = _.template($('#news-template').html());
          $('#'+this.model.id).html(template());
          M.rss_link  = data['data'];
        }
        else {
          elem.html(data['data']);
        }
        elem.appendTo(this.el);
      }, this);
    }
});

var AppView = Backbone.View.extend({
  el: 'body',
  events: {
    'click .nav li a' : 'navClicked'
  },
  initialize: function() {
    _.bindAll(this);
  },
  render: function() {
    M.createNavigation();
    $('#index').show();
  },
  navClicked: function(event) {
    $('.nav li').removeClass('active');
    $(event.currentTarget).parent().addClass('active');
  }
});

var AppRouter = Backbone.Router.extend({
  routes : {
    'index' : 'index',
    ':page' : 'showPage'
  },
  index: function() {
    $('.page').hide();
    $('#index').show();
  },
  showPage: function(page) {
    $('.page').hide();
    if(page === 'news') {
      M.populateFeeds(M.rss_link);
    }
    $('#'+page).show();
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
  var app_router = new AppRouter();
  Backbone.history.start();
};

//create navigational links
M.createNavigation = function() {
  var links = M.pages.get('index').get('children');
  $('<li class="active"><a href="#/index">Home</a></li>').appendTo('.nav');;
  _.each(links, function(link) {
    $('<li><a href="#/' + link + '">' +
      M.humanReadable(link) + '</a></li>').appendTo('.nav');
  });
};

// populate with news feeds in the news section
// gets the feeds from server side script 'feed.py'
M.populateFeeds = function(rss_url) {
  $('#feeds-loader').show();
  $('.news-item-wrapper').remove();
  jQuery.getFeed({
    url: 'feeds',
    type: 'POST',
    data: rss_url,
    success: function(feed) {
      $('#feeds-loader').hide();
      var template = _.template($('#news-item-template').html());
      _.each(feed.items, function(item) {
        x = $('#feeds').append(template({
          title: item.title,
          link: item.link
        }));
      });
    },
    error: function(err) {
      $('#feeds-loader').hide();
      $('#feeds').append('Oops, something went wrong! <br/> Please try again.');
    }
  });
};

/* Other helper functions */

// change all spaces to '-'
M.sanitize = function(str) {
  return '' + str.replace(' ','-');
};

	M.contentList = []; //A list to hold out filtered content objects.

//Check for the tags and return only those "content" objects which match a given tag.
M.checkTags = function(tag){
	if(M.contentList.length > 0)
	{
		M.contentList = [];  //List has to be cleaned before pushing data into it again.
	}
	_.each(M.site_content, function(data){
		_.each(data['content'],function(item){
			for(var i in item['tags'])
			{
				if( item.tags[i] == tag)
				{
					M.contentList.push(item);
					break;
				}
			}
		});
	});
};

// change all '-' to spaces and capitalize first letter of
// every word
M.humanReadable = function(str) {
  return '' + str.replace('-', ' ').replace(/[^\s]+/g, function(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase();
  });
};

})(M);
