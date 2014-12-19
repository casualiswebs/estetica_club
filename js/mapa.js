$('#mapa').on('pageshow', function(event, data) {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
});


function abrirGoogleMaps_map (id_centro) {
	ur = 'mapa.php';
	var direccion = localStorage.getItem("direccion_centro");
	var poblacion = localStorage.getItem("poblacion_centro");
	var provincia = localStorage.getItem("provincia_centro");
	var direccion_comp = (direccion + ',' + poblacion + ',' + provincia);
		console.log(direccion_comp);
		
	//window.plugins.childBrowser.close();
	//window.plugins.childBrowser.showWebPage ('http://maps.google.com/maps?q=' + coord + '&z=14&sensor=false',{ showLocationBar: true });
	
	var geocoder = new google.maps.Geocoder();
geocoder.geocode( { 'address': direccion_comp}, function(results, status) {

if (status == google.maps.GeocoderStatus.OK) {
    var lat = results[0].geometry.location.lat();
    var long = results[0].geometry.location.lng();
    console.log(lat);
	
  var myLatlng = new google.maps.LatLng(lat,long);

  var mapOptions = {
    zoom: 18,
    center: myLatlng,
	streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  
	var marker = new google.maps.Marker({
	position: myLatlng,
	map: map,
	title: 'Marca'
  });
	$.mobile.loading( 'hide');
    } 
}); 


}