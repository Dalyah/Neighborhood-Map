var map;
var markers = [];
var largeInfowindow;

    function mapIni()
    {
      largeInfowindow = new google.maps.InfoWindow();
      var bounds = new google.maps.LatLngBounds();
      map = new google.maps.Map(document.getElementById("map"),
      {
        center : {lat: 24.798161, lng: 46.768052},
        zoom: 14
      });

    // create default markers
    createMarkers(locations);
    }

    // create markers of locations
    function createMarkers(locs)
    {
      var largeInfowindow = new google.maps.InfoWindow();
      locs.forEach(function(loc){
        // add default markers
        var marker = new google.maps.Marker({
            position: loc.position,
            map: map,
            title: loc.name,
            animation: google.maps.Animation.DROP,
          });
          markers.push(marker);

          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            // animate marker
            toggleBounce(marker)
          });
        });
    }

    // function to handel map loading Error
    function handlError(){
      alert('Error loading Google Map');
    }

    // animate a marker
    function toggleBounce(marker) {
       if (marker.getAnimation() !== null) {
         marker.setAnimation(null);
       } else {
         marker.setAnimation(google.maps.Animation.BOUNCE);
       }
     }

     // show marker infowindow
     function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        infowindow.marker = marker;
        var infowindowTitle = '<div>' + marker.title + '</div>';
        infowindow.open(map, marker);
        var fourSquareContent ="";

        // using FourSquare Api to add more content
        var CLIENT_ID = "DH01K1OPPGDSEFMMWPYKYDYB0X0GY1XKMUBHN0YSNFQWKZD4";
        var CLIENT_SECRET= "T3ESFKYUUTRAZPQGZG5IGOWKENS4QMSPVN21L353JXS55Q1H";
        $.getJSON("https://api.foursquare.com/v2/venues/explore?client_id="
        + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20180323&limit=1&ll="
        + marker.position.lat() + "," + marker.position.lng() + "&query="
        + marker.title).done( function(result) {
            if (result.response.groups[0].items[0]) {
              console.log(result)
              var category = result.response.groups[0].items[0].venue.categories[0].name
              fourSquareContent = fourSquareContent + '<div>'+ category + '</div>';
            }
        }).fail(function() {
            fourSquareContent = fourSquareContent + '<div> Cannot load Foursquare content</div>';
        }).always(function() {
            var attribution = '<div> Powered by Foursquare!</div>';
            infowindow.setContent(infowindowTitle + fourSquareContent + attribution);
        });

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
          infowindow.setMarker = null;
        });
      }
    }


    // clear all markers
    function clearMarkers() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    }

    // to filter locations on the list and on the map
    function filterLoc(){
      // Declare variables
      var filter, ul, li, i, txtValue;
      let filteredLocs = [];
      filter = document.getElementById('filterInput').value.toUpperCase();
      ul = document.getElementById("locUL");
      li = ul.getElementsByTagName('li');

      // filter loc List
      for (i = 0; i < li.length; i++) {
        txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
          const location = locations.find( loc => loc.name === txtValue);
          console.log(location);
          filteredLocs.push(location);
        } else {
          li[i].style.display = "none";
        }
      }
      console.log(filteredLocs);
      // filter markers
      clearMarkers()
      createMarkers(filteredLocs);

    }

var ViewModel = function() {
  let self = this;
  this.title = ko.observable("My Neighborhood Map")
  this.locList = ko.observableArray([]);
  this.filterList = ko.observableArray([]);

  // fill locList
    locations.forEach(function(loc){
      self.locList.push(loc.name);
    });

    self.clickMarker = function(data){
      var locs = [];
      const marker = markers.find( marker => marker.title === data);
      toggleBounce(marker);
      populateInfoWindow(marker, largeInfowindow)
    }


}

ko.applyBindings( new ViewModel());
