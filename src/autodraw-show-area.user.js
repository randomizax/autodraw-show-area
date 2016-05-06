// ==UserScript==
// @id             iitc-plugin-autodraw-show-area@randomizax
// @name           IITC plugin: show CF area in AutoDraw window
// @category       Info
// @version        0.1.0.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Show CF area when selecting three portals in AutoDraw dialog of the Bookmark plugin. Be sure to load after the Bookmark plugin.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

@@PLUGINSTART@@

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

@@PLUGINEND@@
