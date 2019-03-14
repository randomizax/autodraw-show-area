// ==UserScript==
// @id             iitc-plugin-autodraw-show-area@randomizax
// @name           IITC plugin: show CF area in AutoDraw window
// @category       Info
// @version        1.0.1.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Show CF area when selecting three portals in AutoDraw dialog of the Bookmark plugin. Be sure to load after the Bookmark plugin.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
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
        var lls = [];
        var distances = latlngs.map(function(ll1, i, latlngs) {
          var ll2 = latlngs[(i+1)%3];
          var l = L.latLng(ll1);
          lls.push(l);
          var d = l.distanceTo(ll2);
          dst.push(d);
          return formatDistance(d);
        });
        text = 'Distances: ' + distances.join(", ");
        var area = L.GeometryUtil.geodesicArea(lls);
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
