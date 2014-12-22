$('#contacto').on('pageshow', function(event, data) {
	$('#form_contact').show();
});


   //*****----- CONTACTO -----*****
   function contactar() {
	ur = 'reservas/contacto.php?callback=?';
	var user_activo = localStorage.getItem("id_user_app_movil");
	var id_tienda = localStorage.getItem("id_centro");
	
	/*--RECOGIDA DE DATOS--*/
	var nombre = $('#form_contact #nombre').val();
	var telefono = $('#form_contact #telefono').val();
	var email = $('#form_contact #email').val();
	var mensaje = $('#form_contact #mensaje').val();
	
		$.getJSON(serviceURL + ur, { id_tienda:id_tienda, user_activo:user_activo, nombre:nombre, telefono:telefono, email:email, mensaje:mensaje }, function(data){
			if (data.resultado === true) {
	$('#form_contact').hide();
	$('#res_contacto').html(data.respuesta);
			} else {
				alert (data.respuesta);
			}
		});
   }