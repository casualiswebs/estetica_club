$('#config_user').live('pageshow', function(event) {
	//Comprueba si el usuario se ha conectado desde cuenta Urbis o Facebook:
	if (comprueba_usercon () == true) {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
	
	var existen_datos_anteriores = comprueba_datos_user();
	clic_guardar_datos(existen_datos_anteriores);
	
	recuperar_datos_usuario();
	
	/*var con_face = localStorage.getItem("id_facebook") || '';
	if (con_face == '') {
		$('#descon').attr('onClick', 'logout()');
	} else {
		$('#pass_ocul').hide();
		$('#descon').attr('onClick', 'logout_face()');
	}*/
	$.mobile.loading( 'hide');
	}
});
$('#reg_user').live('pageshow', function(event) {
	clic_guardar_datos(false, true);
});

//Registro de usuario o editar datos del perfil:
function clic_guardar_datos(existen_datos_anteriores, pag_registro_user) {
if (pag_registro_user == true) {
	var form = '#datos_reg_user';
} else {
	var form = '#form_datos';
}
$(form +' #bot_enviar').click(function() {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
if (pag_registro_user == true) {
	//Recojo todos los datos del formulario:
	var nombre = $('#datos_reg_user #nombre').val();
	var apellidos = $('#datos_reg_user #apellidos').val();
	var tel = $('#datos_reg_user #tel').val();
	var email = $('#datos_reg_user #email').val();
	var cp = $('#datos_reg_user #cp').val();
	var pass = $('#datos_reg_user #pass').val();
	var pass_conf = $('#datos_reg_user #pass_conf').val();
	if (pass == pass_conf) {
		ok_pass = true;
	} else {
		ok_pass = false;
	}
} else {
	ok_pass = true;
	//Recojo todos los datos del formulario:
	var nombre = $('#form_datos #nombre').val();
	var apellidos = $('#form_datos #apellidos').val();
	var tel = $('#form_datos #tel').val();
	var email = $('#form_datos #email').val();
	var cp = $('#form_datos #cp').val();
	var pass = $('#form_datos #pass').val();
	var pass_conf = $('#form_datos #pass_conf').val();
}
	// Guardar datos en el teléfono
//Compruebo si la dirección de email es correcta:
var filtro = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
if (filtro.test(email)) {
   ok_email = true;
} else {
   ok_email = false;
}
if ((nombre!='') && (apellidos!='') && (ok_email==true) && (ok_pass==true)){
		if (existen_datos_anteriores == true) {
			var id_user_app_movil = localStorage.getItem('id_user_app_movil') || '';
		} else {
			var id_user_app_movil = false;
		}
		/*var id_user_face = localStorage.getItem("id_facebook") || '';
		if (id_user_face != '') {
			var user_facebook = id_user_face;
		} else {
			var user_facebook = false;
		}*/
	
	$.getJSON(serviceURL + "guardar_usuario.php?callback=?", { nombre:nombre, apellidos:apellidos, tel:tel, email:email, cp:cp, id_user_app_movil:id_user_app_movil, pass:pass, user_facebook:user_facebook }, function(data){
	//console.log('Apuntarse: '+data.resultado);
		if (data.resultado==true) {
		localStorage.setItem("nombre", nombre);
		localStorage.setItem("apellidos", apellidos);
		localStorage.setItem("tel", tel);
		localStorage.setItem("email", email);
		localStorage.setItem("cp", cp);
			if (existen_datos_anteriores == false) {
				localStorage.setItem("id_user_app_movil", data.id_user_app_movil);
				existen_datos_anteriores = true;
				if (form=='#form_datos') {
					$('#bot_config_datos').hide("slow");
					$('#apuntarme').show("slow");
					$('#reserva_promocion').show("slow");
					$('#bot_config_datos_act').show("slow");
				}
			}
			if (pag_registro_user == true) {
				$.mobile.changePage( "#menu", { transition: "slideup"} );
			}
		}
	navigator.notification.vibrate(2000);
	$.mobile.loading( 'hide');
	//alert(data.respuesta);
	navigator.notification.alert (data.respuesta, null, 'Estética Club', 'Aceptar');
	});
} else if (ok_email == false) {
	$.mobile.loading( 'hide');
	//alert("La dirección de email no es correcta");
	navigator.notification.alert ("La dirección de email no es correcta", null, '¡Alerta!', 'Aceptar');
} else if (ok_pass == false) {
	$.mobile.loading( 'hide');
	//alert("Las contraseñas no coinciden");
	navigator.notification.alert ("Las contraseñas no coinciden", null, '¡Alerta!', 'Aceptar');
} else {
	$.mobile.loading( 'hide');
	//alert("Revisa tus datos");
	navigator.notification.alert ("Revisa tus datos", null, '¡Alerta!', 'Aceptar');
}
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