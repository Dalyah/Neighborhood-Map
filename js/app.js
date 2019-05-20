var map;
    function mapIni()
    {
      map = new google.maps.Map(document.getElementById("map"),
    {

      center : {lat: 24.798161, lng: 46.768052},
      zoom: 14
    });

    locations.forEach(function(loc){
      // add default markers
      var marker = new google.maps.Marker({
          position: loc.position,
          map: map,
          title: loc.name
        });
      });

    }

    // function to handel map loading Error
    function handlError(){
      alert('Error loading Google Map');
    }
    
var ViewModel = function() {
  let self = this;
  this.title = ko.observable("My Neighborhood Map")
  this.locList = ko.observableArray([]);

  // fill locList
    locations.forEach(function(loc){
      self.locList.push(loc.name);
    });


}

ko.applyBindings( new ViewModel());
