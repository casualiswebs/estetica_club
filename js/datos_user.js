$('#config_user').on('pageshow', function(event) {
	//Comprueba si el usuario se ha conectado desde cuenta Urbis o Facebook:
	if (comprueba_usercon () == true) {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
	getListCentros(false, '#form_datos #id_centro', localStorage.getItem("id_centro"));
	getListProvincias(false, '#form_datos #prov_sel');
	sel_pob(localStorage.getItem("provincia"), '#form_datos');
	//Preparo la función para guardar los datos cuando el usuario haga clic en "Guardar":
	clic_guardar_datos();
	
	recuperar_datos_usuario();
	
		if ((localStorage.getItem("id_facebook") == '') || (localStorage.getItem("id_facebook") == null)) {
			$('#descon').attr('onClick', 'logout()');
		} else {
			$('#pass_ocul').hide();
			$('#descon').attr('onClick', 'logout_face()');
		}
	$.mobile.loading( 'hide');
	} else {
		//*****----- No hay usuario conectado: ------******
		$.mobile.changePage( "index.html#inicio", { transition: "slideup"}, true, true );
	}
});

$('#reg_user').on('pageshow', function(event) {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
	clic_guardar_datos(true);
	
	getListCentros(false, '#datos_reg_user #id_centro', $("#id_centro").val());
	getListProvincias(false, '#datos_reg_user #prov_sel');
});

//Registro de usuario o editar datos del perfil:
function clic_guardar_datos(pag_registro_user) {
if (pag_registro_user == true) {
	var form = '#datos_reg_user';
} else {
	var form = '#form_datos';
}
$(form +' #bot_enviar').click(function() {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
	
	//Recojo todos los datos del formulario:
	var nombre = $(form + ' #nombre').val();
	var apellidos = $(form + ' #apellidos').val();
	var tel = $(form + ' #tel').val();
	var email = $(form + ' #email').val();
	var cp = $(form + ' #cp').val();
	var provincia = $(form + ' #prov_sel').val();
	var poblacion = $(form + ' #pob_sel').val();
	var pass = $(form + ' #pass').val();
	var pass_conf = $(form + ' #pass_conf').val();
	var id_centro = $(form + ' #id_centro').val();
	if ((pass == pass_conf) || (pag_registro_user == true)) {
		ok_pass = true;
	} else {
		ok_pass = false;
	}
	// Guardar datos en el teléfono
//Compruebo si la dirección de email es correcta:
var filtro = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
if (filtro.test(email)) {
   ok_email = true;
} else {
   ok_email = false;
}
//Compruebo si faltan datos:
if ((nombre!='') && (apellidos!='') && (tel!='') && (id_centro > 0) && (ok_email==true) && (ok_pass==true)) {
		var id_user_app_movil = localStorage.getItem('id_user_app_movil') || false;
		var user_facebook = localStorage.getItem("id_facebook") || false;
	
	$.getJSON(serviceURL + "guardar_usuario.php?callback=?", { nombre:nombre, apellidos:apellidos, tel:tel, email:email, cp:cp, id_user_app_movil:id_user_app_movil, pass:pass, user_facebook:user_facebook, id_centro:id_centro, provincia:provincia, poblacion:poblacion }, function(data){
	//console.log('Apuntarse: '+data.resultado);
		if (data.resultado == true) {
		localStorage.setItem("nombre", nombre);
		localStorage.setItem("apellidos", apellidos);
		localStorage.setItem("tel", tel);
		localStorage.setItem("email", email);
		localStorage.setItem("cp", cp);
		localStorage.setItem("provincia", provincia);
		localStorage.setItem("poblacion", poblacion);
		localStorage.setItem("id_centro", id_centro);
			if (id_user_app_movil == false) {
				localStorage.setItem("id_user_app_movil", data.id_user_app_movil);
			}
			if (pag_registro_user == true) {
				$.mobile.changePage( "#menu", { transition: "slideup"} );
				//Dejo el fomulario de registro en blanco:
				$(form)[0].reset();
			}
			//Retiro la pantalla inicial donde se pregunta el centro y el registro de usuario:
			$("#cont_inicial").hide();
			$(form + ' #pass').val('');
			$(form + ' #pass_conf').val('');
		}
	alert(data.respuesta);
	//comentario navigator.notification.vibrate(2000);
	//comentario navigator.notification.alert (data.respuesta, null, 'Estética Club', 'Aceptar');
	});
} else if (ok_email == false) {
	alert("La dirección de email no es correcta");
	//comentario navigator.notification.alert ("La dirección de email no es correcta", null, '¡Alerta!', 'Aceptar');
} else if (ok_pass == false) {
	alert("Las contraseñas no coinciden");
	//comentario navigator.notification.alert ("Las contraseñas no coinciden", null, '¡Alerta!', 'Aceptar');
} else {
	alert("Faltan datos");
	//comentario navigator.notification.alert ("Revisa tus datos", null, '¡Alerta!', 'Aceptar');
}
	$.mobile.loading( 'hide');
});
}

function recuperar_datos_usuario() {
	var id_user_app = localStorage.getItem("id_user_app_movil") || false;
		if (id_user_app != false) {
			var nombre = localStorage.getItem("nombre") || '' ;
				$('#form_datos #nombre').val(nombre);
			var apellidos = localStorage.getItem("apellidos") || '' ;
				$('#form_datos #apellidos').val(apellidos);
			var tel = localStorage.getItem("tel") || '' ;
				$('#form_datos #tel').val(tel);
			var email = localStorage.getItem("email") || '' ;
				$('#form_datos #email').val(email);
			var cp = localStorage.getItem("cp") || '' ;
				$('#form_datos #cp').val(cp);
		}
}