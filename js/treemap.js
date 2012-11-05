(function(M) {
M.drawTreemap = function(station) {
  var width = 950,
height = 500,
colour = d3.scale.category20c();

var parent_url = '#/station/' + station + '/';

var tmap = d3.layout.treemap()
  .size([width,height])
  .sticky(true)
  .value(function(d){return d.size;});

var div = d3.select("#tmap").append("div")
  .style("position","relative")
  .style("width",width+"px")
  .style("height",height+"px");

d3.json('./data/data.json',function(json) {
  div.data([json]).selectAll('div')
  .data(tmap.nodes)
  .enter().append("a")
  .attr("href",function(d){ return d.children ? null : parent_url + d.name; })
  .attr("class","cell")
  .style("background", function(d) { return d.children ? colour(d.name) : null;})
  .call(cell)
  .text(function(d) { return d.children ? null : d.name; });
});

function cell() {
  this
    .style("left", function(d) { return d.x + "px"; })
    .style("top", function(d) { return d.y + "px"; })
    .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
    .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
};
})(M);
