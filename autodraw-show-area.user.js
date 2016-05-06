// ==UserScript==
// @id             iitc-plugin-autodraw-show-area@randomizax
// @name           IITC plugin: show CF area in AutoDraw window
// @category       Info
// @version        0.1.0.20160506.70310
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://rawgit.com/randomizax/autodraw-show-area/latest/autodraw-show-area.meta.js
// @downloadURL    https://rawgit.com/randomizax/autodraw-show-area/latest/autodraw-show-area.user.js
// @description    [randomizax-2016-05-06-070310] Show CF area when selecting three portals in AutoDraw dialog of the Bookmark plugin. Be sure to load after the Bookmark plugin.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
// plugin_info.buildName = 'randomizax';
// plugin_info.dateTimeVersion = '20160506.70310';
// plugin_info.pluginId = 'autodraw-show-area';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

var setup =  function() {
  if (window.plugin.bookmarks) {
    window.plugin.bookmarks.autoDrawOnSelect = function() {
      var latlngs = [];
      var uuu = $('#bkmrksAutoDrawer a.bkmrk.selected').each(function(i) {
        var tt = $(this).data('latlng');
        latlngs[i] = tt;
      });

      var text = "You must select 2 or 3 portals!";
      var color = "red";

      function formatDistance(distance) {
        var text = digits(distance > 10000 ? (distance/1000).toFixed(2) + "km" : (Math.round(distance) + "m"));
        return distance >= 200000
          ? '<em title="Long distance link" class="help longdistance">'+text+'</em>'
          : text;
      }

      if(latlngs.length == 2) {
        var distance = L.latLng(latlngs[0]).distanceTo(latlngs[1]);
        text = 'Distance between portals: ' + formatDistance(distance);
        color = "";
      } else if(latlngs.length == 3) {
        var longdistance = false;
        var dst = [];
        var distances = latlngs.map(function(ll1, i, latlngs) {
          var ll2 = latlngs[(i+1)%3];
          var d = L.latLng(ll1).distanceTo(ll2);
          dst.push(d);
          return formatDistance(d);
        });
        text = 'Distances: ' + distances.join(", ");
        var s = (dst[0] + dst[1] + dst[2]) / 2.0;
        var area = Math.sqrt(s * (s - dst[0]) * (s - dst[1]) * (s - dst[2]));
        var areatext = (area/1000000).toPrecision(4) + "km²";
        text += "<br/>Area: " + areatext;
        color = "";
      }

      $('#bkmrksAutoDrawer p')
        .html(text)
        .css("color", color);
    };
  }
};

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


