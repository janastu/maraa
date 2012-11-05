(function(M) {
  M.drawMap = function() {
    var map = L.map('map').setView([12.9725, 77.58443],4);
    L.tileLayer('http://{s}.tile.cloudmade.com/157f9082094e402f89d242e9b9144483/997/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â©<a href="http://cloudmade.com">CloudMade</a>'
      }).addTo(map);


    latlng = {
      0:{'lat':28.099, 'lng':76.983,  //GKA
          'stnName': 'Gurgaon ki Awaz (CR)',
'freq': '107.8 MHz',
'power': '10KW',
'distName': 'Gurgaon',
'owner':'TRF(The Restoring Force)',
'content':'folk music and other self generated content',
'licenseType': 'CR',
'licenseCost': '120000000 INR',
'licenseRange': '100 KM',
'url':'#/station/gka',
'effectiveRange': '15 KM'},
      1:{'lat':12.972, 'lng':77.584, //Bangalore
        'stnName': 'Radio Active (CR)',
        'freq': '90.4 MHz',
        'power': '10KW',
        'distName': 'Bangalore Urban',
        'owner':'Jain College',
        'content':'educational broadcast',
        'licenseType': 'CR',
        'licenseCost': '120000000 INR',
        'licenseRange': '100 KM',
        'url':'#/station/rac',
        'effectiveRange': '2 KM'},
      2:{'lat':24.691, 'lng':78.413,  //Lalitpur
        'stnName': 'Lalit lokavani (CR)',
        'freq': '91.1 MHz',
        'power': '10KW',
        'distName': 'Lalitpur',
        'owner':'Unknown',
        'content':'content from EDAA(ek duniya anek awaz)',
        'licenseType': 'CR',
        'licenseCost': '120000000 INR',
        'licenseRange': '100 KM',
        'url':'#/station/llv',
        'effectiveRange': '15 KM'},
      3:{'lat':24.999, 'lng':79.499, //Bundelkhand
        'stnName': 'Radio Bundelkhand (CR)',
        'freq': '91.1 MHz',
        'power': '10KW',
        'distName': 'Bundelkhand',
        'owner':'Unknown',
        'content':'content is downloaded from internet',
        'licenseType': 'CR',
        'licenseCost': '120000000 INR',
        'licenseRange': '100 KM',
        'url':'#/station/rbk',
        'effectiveRange': '35 KM'}
      // 4:{'lat':12.935, 'lng':77.573, //Bangalore
      // 	'stnName': 'Radio City ',
      // 	 'freq': '91.1 MHz',
      // 	 'power': '10KW',
      // 	 'distName': 'Bangalore Urban',
      // 	 'owner':'Private',
      // 	 'content':'Bollywod movie songs',
      // 	 'licenseType': 'Commercial',
      // 	 'licenseCost': '1 Crore',
      // 	 'licenseRange': '100 KM',
      // 	 'effectiveRange': '70 KM'}

    };
    var lg = new L.layerGroup();
    for(var i in latlng)
    {
      var c =	new L.circle([latlng[i]['lat'], latlng[i]['lng']],100000,{
        'color':'blue',
          'fillColor':'blue',
          'fillOpacity':0.5});

      var d = new L.circle([latlng[i]['lat'],latlng[i]['lng']],latlng[i]['effectiveRange'].split(' ')[0]*1000,{  //The second argument is radius in meters.
        'color':'black',
          'fillColor':'black',
          'fillOpacity':0.7});
      lg.addLayer(c);
      lg.addLayer(d);
      c.bindPopup("<a href='"+latlng[i]['url']+"'>"+latlng[i]['stnName']+"</a>")
        c.addEventListener('mousemove',function(e){
          e.target.openPopup();
        });

    }
    map.addLayer(lg);

    /*$("#legend1").css("border-style",'solid');
    $("#legend1").css("width",'150px');
    $("#legend1").css("height",'200px');
    $("#legend1").css("position",'absolute');
    $("#legend1").html("<center><b>Legend</b></center>" + $("#legend1").html())

    $("#bluelegend").css("background-color",'blue');
    $("#bluelegend").css("width",'25px');
    $("#bluelegend").css("height",'15px');
    $("#bluelegend").css("position",'relative');
    $("#bluelegend").css("margin-left",'10px');
    $("#bluelegend").css("margin-top",'20px');

    $("#t1").css("position",'relative');
    $("#t1").css("margin-top",'20px');
    $("#t1").css("margin-left",'30px');
    $("#t1").html("<b>License range</b>");

    $("#blacklegend").css("background-color",'black');
    $("#blacklegend").css("width",'25px');
    $("#blacklegend").css("height",'15px');
    $("#blacklegend").css("position",'relative');
    $("#blacklegend").css("margin-left",'10px');
    $("#blacklegend").css("margin-top",'40px');

    $("#t2").css("position",'relative');
    $("#t2").css("margin-top",'40px');
    $("#t2").css("margin-left",'30px');
    $("#t2").html("<b>Effective range</b>");*/
  };
})(M);
