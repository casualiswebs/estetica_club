$('#promociones').on('pageshow', function(event, data) {
	mostrar_promocion();
});


   //*****----- CONTACTO -----*****
   function mostrar_promocion() {
	ur = 'promociones.php?callback=?';
	var id_tienda = localStorage.getItem("id_centro");
	
		$.getJSON(serviceURL + ur, { id_tienda:id_tienda }, function(data){
			if (data.resultado === true) {
	$('#promos-centro').html(data.respuesta);
			} else {
				alert (data.respuesta);
			}
		});
   }