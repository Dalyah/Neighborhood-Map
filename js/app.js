var map;
var markers = [];
var largeInfowindow;
var filterLocs = locations;
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
      clearMarkers()
      // var largeInfowindow = new google.maps.InfoWindow();
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
            toggleBounce(marker);
          });
        });
    }

    // the function displays only the passed filterMarkers
    function displayMarker(filterMarkers)
    {
        for (i = 0; i < markers.length; i++) {
            if (filterMarkers.includes(markers[i]))
            {
                markers[i].setMap(map);
            }
            else
            {
                markers[i].setMap(null);
            }
        }

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
         setTimeout(function () {
         marker.setAnimation(null);
            }, 3000);
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

var ViewModel = function() {
  let self = this;
  this.title = ko.observable("My Neighborhood Map")
  this.locList =  ko.observableArray([]);
  this.filterList = ko.observableArray([]);
  this.currentFilter = ko.observable();

  // fill locList
    locations.forEach(function(loc){
      self.locList.push(loc.name);
    });

    self.filterList = ko.computed(function() {
        if(!self.currentFilter()) {
            return self.locList();
        } else {
            return ko.utils.arrayFilter(self.locList(), function(loc) {
                return loc.toUpperCase().indexOf(self.currentFilter().toUpperCase()) !== -1;
            });
        }
    });

    // called when a marker is clicked
    self.clickMarker = function(data){
      const marker = markers.find( marker => marker.title === data);
      toggleBounce(marker);
      populateInfoWindow(marker, largeInfowindow)
    };

    // called when filter button is clicked
    self.filter = function(name) {
        console.log("filter Function is being executed");
        var filterMarkers = [];
        ko.utils.arrayForEach(self.filterList(), function(loc){
          const marker = markers.find( marker => marker.title === loc);
          filterMarkers.push(marker);
        });
        // console.log(filterMarkers);
        // console.log(markers);
        // console.log(locations);
        displayMarker(filterMarkers);
    }

}

ko.applyBindings( new ViewModel());
