(function(M) {
  var self = M;

  var AppRouter = Backbone.Router.extend({
    routes: {
      'index'     : "index",
      'news'      : "news",
      'research'  : "research",
      'resource'  : "resource",
      'directory' : "directory",
      'media'     : "media",
      'contact'   : "contact",
      'station/:x': "station"
    },

    index: function() {
      $('.content').hide();
      $('#frontpage').show();
    },
    news: function() {
      $('.content').hide();
      $('#news-container').show();
    },
    research: function() {
      $('.content').hide();
      $('#research-container').show();
      $('#map-container').show();
      self.drawMap();
    },
    resource: function() {
      $('.content').hide();
      $('#resource-container').show();
    },
    directory: function() {
      $('.content').hide();
      $('#directory-container').show();
    },
    media: function() {
      $('.content').hide();
      $('#media-container').show();
    },
    contact: function() {
      $('.content').hide();
      $('#contact-container').show();
    },
    station: function(x) {
      $('.content').hide();
      $('#research-container').show();
      $('#treemap-container').show();
      self.drawTreemap(x);
    }
  });

  self.init = function() {
    $('ul.thumb li').Zoomer({speedView:200,speedRemove:400,
      altAnim:true,speedTitle:400,debug:false});

    var app_router = new AppRouter();
    Backbone.history.start();
  };

  self.pivotTable = function() {
    $('.content').hide();
    $('#research-container').show();
    $('#pivot-wrapper').show();
    self.drawPivot();
  };

  self.drawPivot = function() {
    var formatPercent = function(value) {
      return value + ' %';
    };
    var fields = [
      {name: 'Radio Station', type: 'string', filterable: true},
      {name: 'Demographic', type: 'string', filterable: true},
      {name: 'Value', type: 'string', filterable: false},
      {name: 'Frequency', type: 'integer', filterable: false},
      {name: 'Percent', type: 'float', filterable: false, displayFunction: formatPercent}
    ];
    var row_labels = ['Radio Station', 'Value', 'Percent'];
    var options = {
      callbacks: {afterUpdateResults: function() {
                   $('#results > table').dataTable({
                     "sDom": "<'row'<'span6'l><'span6'f>>t<'row'<'span6'i><'span6'p>>",
                     "iDisplayLength": 50,
                     "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
                     "oLanguage": {
                      "sLengthMenu": "_MENU_ records per page"
                     }
                   });
                   self.cleanUp();
                 }},
      url: 'data/frequency.csv',
      fields: fields,
      filters: {'Radio Station': 'Gurgaon Ki Awaz', Demographic: 'Age'},
      rowLabels: row_labels,
    };
    if(pivot) {
      console.log('initing pivot');
      if(!$('#pivot-container').html().length) {
        $('#pivot-container').pivot_display('setup', options);
      }
    }
    else {
      console.log('pivot.js not loaded');
    }
  };

  self.cleanUp = function() {
    $('body h2').each(function(idx, elem) {
      if($(elem).html() == "Label Fields" || 
        $(elem).html() == "Summary Fields") {

        $(elem).remove();
      }
      $('#summary-fields').remove();
      $('#label-fields').remove();
    });
  };
})(M);
