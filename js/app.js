var map;
var markers = [];

    function mapIni()
    {
      var largeInfowindow = new google.maps.InfoWindow();
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
     function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
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


}

ko.applyBindings( new ViewModel());
