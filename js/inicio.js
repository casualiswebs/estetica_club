var serviceURL = "http://www.esteticaclub.com/app_centros/";

/*function onDeviceReady() {
	
}
document.addEventListener('deviceready', onDeviceReady, true);*/

document.addEventListener('deviceready', function() {
	navigator.splashscreen.hide();
	$.mobile.loading( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
	//Listado de centros:
	getListCentros(false, 'select_centros');
	//-- FIN Listado de centros --
	//Si el usuario está conectado, recupero sus datos:
	recuperar_datos_inicio();
	//--
	if (comprueba_datos_user () == false) {
		$('#bot_conectar').show("slow");
	} else {
		$('#bot_conectar').hide("slow");
		//Activo el footer:
		$("#footer-menu").show("slow");
	}
	var donde_volver = localStorage.getItem ('donde_volver') || '';
	if (donde_volver != '') {
		localStorage.setItem("donde_volver", '');
	}
});

/*---- MOSTRADO DE PÁGINAS ----*/
//Menú:
$('#menu').on('pageshow', function(event) {
});
//Menú:
$('#menu').on('pageshow', function(event) {
});
//Inicio:
$('#inicio').on('pageshow', function(event) {
	var donde_volver = localStorage.getItem ('donde_volver') || '';
	if (donde_volver != '') {
		$('#bot_volver').attr ('href', donde_volver);
	} else {
		$('#bot_volver').attr ('href', '#menu');
	}
});
//Login:
$('#login_user').on('pageshow', function(event) {
});
/*---- FIN DEL MOSTRADO DE PÁGINAS ----*/

function comprueba_usercon () {
	var existen_datos_anteriores = comprueba_datos_user();
	var con_face = localStorage.getItem("id_facebook") || '';
	if ((existen_datos_anteriores == false) && (con_face == '') ) {
		$.mobile.changePage( "index.html#inicio", { transition: "slideup"}, true, true );
	} else {
		return true;
	}
}


function login_user () {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
	//Recojo todos los datos del formulario:
	var email = $('#email').val();
	var pass = $('#pass').val();
	// Guardar datos en el teléfono
//Compruebo si la dirección de email es correcta:
var filtro = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
if (filtro.test(email)) {
   ok_email = true;
} else {
   ok_email = false;
}
if ((pass!='') && (ok_email==true)){
	$.getJSON(serviceURL + "login.php?callback=?", { email:email, pass:pass }, function(data){
	//console.log('Apuntarse: '+data.resultado);
		if (data.resultado==true) {
			localStorage.setItem("id_user_app_movil", data.id_user_app_movil);
			localStorage.setItem("nombre", data.nombre);
			localStorage.setItem("apellidos", data.apellidos);
			localStorage.setItem("tel", data.telefono);
			localStorage.setItem("email", data.email);
			localStorage.setItem("cp", data.cp);
				existen_datos_anteriores = true;
				var donde_volver = localStorage.getItem ('donde_volver') || '';
				if (donde_volver != '') {
					$.mobile.changePage( donde_volver, { transition: "slideup"} );
				} else {
					$.mobile.changePage( '#menu', { transition: "slideup"} );
				}
		}
	$.mobile.loading( 'hide');
	//alert(data.respuesta);
	navigator.notification.alert (data.respuesta, null, '¡Conectado!', 'Aceptar');
	});
} else if (ok_email == false) {
	$.mobile.loading( 'hide');
	//alert("La dirección de email no es correcta");
	navigator.notification.alert ("La dirección de email no es correcta", null, '¡Alerta!', 'Aceptar');
} else {
	$.mobile.loading( 'hide');
	//alert("Revisa tus datos");
	navigator.notification.alert ("Revisa tus datos", null, '¡Alerta!', 'Aceptar');
}
}

function recuperar_pass () {
	$.mobile.loading ( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
	//Recojo todos los datos del formulario:
	var email = $('#email_rec').val();
//Compruebo si la dirección de email es correcta:
var filtro = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
if (filtro.test(email)) {
   ok_email = true;
} else {
   ok_email = false;
}
if (ok_email==true){
	$.getJSON(serviceURL + "recuperar_pass.php?callback=?", { email:email }, function(data){
		if (data.resultado==true) {
			$.mobile.changePage( "#menu", { transition: "slideup"} );
		}
	$.mobile.loading( 'hide');
	//alert(data.respuesta);
	navigator.notification.alert (data.respuesta, null, 'Estetica Club', 'Aceptar');
	});
} else if (ok_email == false) {
	$.mobile.loading( 'hide');
	//alert("La dirección de email no es correcta");
	navigator.notification.alert ("La dirección de email no es correcta", null, '¡Alerta!', 'Aceptar');
} else {
	$.mobile.loading( 'hide');
	//alert("Indica tu dirección de email");
	navigator.notification.alert ("Indica tu dirección de email", null, '¡Alerta!', 'Aceptar');
}
}

function logout () {
	localStorage.clear();
	$.mobile.changePage( "index.html#inicio" );
	//alert("¡Te has desconectado!");
	navigator.notification.alert ("¡Te has desconectado!", null, 'Estetica Club', 'Aceptar');
}


function comprueba_datos_user() {
	var comp_datos = localStorage.getItem('id_user_app_movil') || '';
	//console.log('comprueba_datos_user: Usuario activo: '+ comp_datos);
	if (comp_datos!='') {
		return true;
	} else {
		return false;
	}
}

function recuperar_datos_inicio() {
	var id_user_app = localStorage.getItem("id_user_app_movil") || false;
	$.getJSON(serviceURL + "login.php?callback=?", { id_user_app:id_user_app }, function(data){
		if (data.resultado==true) {
			localStorage.setItem("nombre", data.nombre);
			localStorage.setItem("apellidos", data.apellidos);
			localStorage.setItem("tel", data.telefono);
			localStorage.setItem("email", data.email);
			localStorage.setItem("cp", data.cp);
		}
	});
}

//Listado Centros:
function getListCentros(id, id_act) {
	ur = 'sel_centros.php?callback=?';
	$('.' + id_act).empty();
	//ajax = $.getJSON(serviceURL + ur, function(data) {
	$('.'+ id_act).append($('<option>', { 
				value: 0,
				text : '1.- Selecciona un centro' 
			}));
$.getJSON(serviceURL + ur, { id_centro:id }, function(data){
	if (data.resultado === true) {
		$.each(data.datos , function( key, value ) {
				/*console.log(key);
				console.log(value.id_cliente);*/
			$('.' + id_act).append($('<option>', { 
				value: value.id,
				text : value.nombre 
			}));
		});
	} else {
		navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
	}
	$('.'+ id_act).selectmenu('refresh');
	$.mobile.loading( 'hide');
}).fail(function() {
	$.mobile.loading( 'hide');
	navigator.notification.alert ("No hay conexión, inténtalo de nuevo más tarde", null, '¡Alerta!', 'Aceptar');
});
}