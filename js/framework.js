(function(M) {
/* Defining Backbone models, collections and views */

var Text = Backbone.Model.extend({
	defaults: {
		data:"",
		tags:[]
	},
	initialize: function() {
	}
});

var TextView = Backbone.View.extend({
  tagName: 'div',
  className: '',

  initialize: function() {
    _.bindAll(this);
    _.bind(this.render, this);
  },
  render: function(el) {
    $(el).append(this.el);
    $(this.el).html(this.model.get('data'));
  }
});

var Table = Backbone.Model.extend({
  defaults: {
    tags: [],
    data : {
      th: [],
      tr:[]
    }
  },
  initialize: function() {
  }
});

var TableView = Backbone.View.extend({
  tagName: 'table',
  className: 'table',
  initialize: function() {
    _.bindAll(this);
    _.bind(this.render, this);
  },
  render: function(el) {
    var heading = this.model.get('data').th;
    var str = '<tr>';

    for(var i = 0; i < heading.length; i++) {
      str += '<th>' + heading[i] + '</th>';
    }
    str += '</tr>';

    _.each(this.model.get('data').tr, function(row) {
      str += '<tr>';
      for(var i = 0; i < row.length; i++) {
        if(row[i].match(/http.?:/)) {
          console.log(row[i].match(/http:/))
        }
        str += '<td>'+ row[i] + '</td>';
      }
      str += '</tr>';
    });

    $(el).append(this.el);
    $(this.el).html(str);
  }
});

var Image = Backbone.Model.extend({
	defaults: {
		src:"",
		tags:[]
	},
	initialize:function() {
	}
});

var ImageView = Backbone.View.extend({
  tagName: 'image',
  className: '',

  initialize: function() {
    _.bindAll(this);
    _.bind(this.render, this);
  },
  render: function(el) {
    $(el).append(this.el);
    $(this.el).attr('src', this.model.get('src'));
  }
});


var Video = Backbone.Model.extend({
	defaults: {
		src:"",
		tags:[]
	},
	initialize:function() {
	}
});

var VideoView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this);
    _.bind(this.render, this);
    // assuming cross-domain urls will have http in the src,
    // so also assuming they are embedded flash urls,
    // hence iframe
    if(this.model.get('src').match('http')) {
      this.tagName = 'iframe';
    }
    // otherwise, use html5 video tag, if the video is served
    // from the same domain
    else {
      this.tagName = 'video';
    }
  },
  render: function(el) {
    $(el).append(this.el);
    $(this.el).attr('src', this.model.get('src'));
  }
});

var RSS = Backbone.Model.extend({
	defaults: {
		src:"",
		tags:[]
	},
	initialize:function() {
	}
});

var RSSView = Backbone.View.extend({
  el: '#feeds',
  initialize: function() {
    _.bindAll(this);
    _.bind(this.render, this);
  },
  render: function() {
    M.populateFeeds(this.model.get('src'));
  }
});

var type_map;
M.type_map = type_map = {
  model : {
    'text': Text,
    'image': Image,
    'video': Video,
    'rss': RSS
  },
  view: {
    'text': TextView,
    'image': ImageView,
    'video': VideoView,
    'rss': RSSView
  }
};

// var Media = Backbone.Model.extend({
// 	defaults:{
// 		"audio": new Audio() ,
// 		"video": new Video(),
// 		"image": new Image()
// }

// });

var Texts = Backbone.Collection.extend({model: Text});
var Images = Backbone.Collection.extend({model: Image});
var Videos = Backbone.Collection.extend({model: Video});
var RSSs = Backbone.Collection.extend({model: RSS});


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
  tagName: 'div',
  className: 'page',
  initialize: function() {
    _.bindAll(this);
    _.bind(this.render, this);
    this.render();
    $(this.el).hide();
  },
  render: function() {
    $('#content-container').append(this.el);
    var self = this;
    _.each(this.model.get('content'), function(item) {
      var view = type_map.view[item.get('type')];
      if(!view) {
        console.log('Error initing view', item);
        return;
      }
      if(item.get('type') === 'rss') {
        M.rss_view = new view({model: item});
        $(self.el).append(_.template($('#news-template').html()));
      }
      else {
        var item_view = new view({model: item});
        item_view.render(self.el);
      }
    });
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
      M.rss_view.render();
    }
    $('#'+page).show();
  }
});

/* Defining other necessary functions */
M.init = function() {
	M.tags = {}; //global tag cache
  M.pages = new Pages(); //global collection of all pages

  // iterate through the JSON to intialize models and views
	_.each(M.site_content, function(page) {
    var new_page = new Page({
      'name': page.name,
      'children': page.children
    });
    var contents = [];
		_.each(page.content, function(content) {
      var Item = type_map.model[content.type];
      if(!Item) {
        console.log('Error initing item: ', content);
        return;
      }
      var item = new Item(content);
      contents.push(item);
		});
    new_page.set({content: contents});
    var new_page_view = new PageView({model: new_page,
      id: new_page.get('id')});
    M.pages.add(new_page);
	});
 
  M.appView = new AppView();
  M.appView.render();
  var app_router = new AppRouter();
  Backbone.history.start();
  // start with index page
  app_router.index();
};

//Helper method for making a list of id associated to tag
	M.createTagList = function(item,x)
	{

		for(var i in item['tags'])
		{
			if( M.tags[item['tags'][i]] === undefined)
			{
				M.tags[item['tags'][i]] = [];
				M.tags[item['tags'][i]].push(x);
			}
			else
				M.tags[item['tags'][i]].push(x);
		}
	};

//create navigational links
M.createNavigation = function() {
  var top_level = M.pages.get('index').get('children');
  $('<li class="active"><a href="#/index">Home</a></li>').appendTo('.nav');;
  _.each(top_level, function(child) {
    child = M.sanitize(child);
    console.log(child);
    var page = M.pages.get(child).get('children');
    console.log(page);
    if(!page) {
      li = '<li><a href="#/"' + page + '<a/></li>';
    }
    else {
      li = '<li class="dropdown"';
    }
    //$('<li><a href="#/' + link + '">' +
      //M.humanReadable(link) + '</a></li>').appendTo('.nav');
  });
};

// populate with news feeds in the news section
// gets the feeds from server side script 'feed.py'
M.populateFeeds = function(rss_url) {
  $('#feeds-loader').show();
  $('.news-item-wrapper').remove();
  jQuery.getFeed({
    url: 'feeds',
    type: 'GET',
    data: "rss_url="+encodeURIComponent(rss_url),
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

M.contentList = []; //A list to hold out filtered content objects.

//Check for the tags and return only those "content" objects which match a given tag.
M.checkTags = function(tags){
	if(_.isArray(tags))
	{
		var list = [];
		_.each(tags,function(item){
			list.push(M.tags[item]);
		});
		return _.uniq(list);
	}
	else
		return false; //Failure code, the function will only accept a list as input
};

// change all '-' to spaces and capitalize first letter of
// every word
M.humanReadable = function(str) {
  if(typeof str !== "string") {
    str = '';
  }
  return '' + str.replace(/[-]+/g, ' ').replace(/[^\s]+/g, function(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase();
  });
};

// change all spaces to '-' and everything to lowercase
M.sanitize = function(str) {
  if(typeof str !== "string") {
    str = '';
  }
  return '' + str.replace(/[\s]+/g,'-').replace(/[^\s]+/g, function(str) {
    return str.toLowerCase();
  });
};

})(M);
