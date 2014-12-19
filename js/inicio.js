var serviceURL = "http://www.esteticaclub.com/app_centros/";

/*function onDeviceReady() {
	
}
document.addEventListener('deviceready', onDeviceReady, true);*/

document.addEventListener('deviceready', function() {
	navigator.splashscreen.hide();
});

/*---- MOSTRADO DE PÁGINAS ----*/
//Menú:
$('#menu').on('pageshow', function(event) {
	 $("select").addClass("needsclick");
	 new FastClick(document.body);
	//Si el usuario está conectado, recupero sus datos:
	recuperar_datos_inicio();
	//--
	mostrar_inicio();
	
	if (comprueba_usercon () == false) {
		//----***** NO Conectado *****-----
		$.mobile.loading( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
		getListCentros(false, '#sel_ini_centro #id_centro');
	} else {
		//----***** Conectado *****-----
		//Ficha centro:
		ficha_centro ();
	}
	var donde_volver = localStorage.getItem ('donde_volver') || '';
	if (donde_volver != '') {
		localStorage.setItem("donde_volver", '');
	}
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

/*---- FIN DEL MOSTRADO DE PÁGINAS ----*/

function mostrar_inicio () {
	if (comprueba_usercon () === false) {
		//----***** NO Conectado *****-----
		//Activo las opciones sin conexión:
		$('#cont_inicial').show();
		//Desactivo el menú principal:
		$("#menu_princ").hide();
		$("#footer-menu").hide();
	} else {
		//----***** Conectado *****-----
		$("#cont_inicial").hide();
		//Activo los botones de inicio:
		$("#menu_princ").show();
		//Activo el footer:
		$("#footer-menu").show();
	}
}

function comprueba_usercon () {
	var existen_datos_anteriores = localStorage.getItem('id_user_app_movil') || '';
	var con_face = localStorage.getItem("id_facebook") || '';
	console.log ('comprueba_usercon: ' + existen_datos_anteriores);
	
	if ((existen_datos_anteriores == '') && (con_face == '')) {
		return false;
	} else {
		return true;
	}
}

//Login:
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
				localStorage.setItem("id_centro", data.id_centro);
					existen_datos_anteriores = true;
					var donde_volver = localStorage.getItem ('donde_volver') || '';
					if (donde_volver != '') {
						$.mobile.changePage( donde_volver, { transition: "slideup"} );
					} else {
						$.mobile.changePage( '#menu', { transition: "slideup"} );
					}
			}
		$.mobile.loading( 'hide');
		alert(data.respuesta);
		//comentario navigator.notification.alert (data.respuesta, null, '¡Conectado!', 'Aceptar');
		});
	} else if (ok_email == false) {
		$.mobile.loading( 'hide');
		alert("La dirección de email no es correcta");
		//comentario navigator.notification.alert ("La dirección de email no es correcta", null, '¡Alerta!', 'Aceptar');
	} else {
		$.mobile.loading( 'hide');
		alert("Revisa tus datos");
		//comentario navigator.notification.alert ("Revisa tus datos", null, '¡Alerta!', 'Aceptar');
	}
}

//Centro:
function ficha_centro () {
	var id_centro = localStorage.getItem ('id_centro');
	if (id_centro > 0){
		$.getJSON(serviceURL + "sel_centros.php?callback=?", { id_centro:id_centro }, function(data){
			if (data.resultado==true) {
				$.each(data.datos , function( key, value ) {
					localStorage.setItem("nombre_centro", value.nombre);
					localStorage.setItem("subtitulo_centro", value.subtitulo);
					localStorage.setItem("foto_centro", value.foto);
					localStorage.setItem("descripcion_centro", value.descripcion);
					localStorage.setItem("direccion_centro", value.direccion);
					localStorage.setItem("provincia_centro", value.provincia);
					localStorage.setItem("poblacion_centro", value.poblacion);
					localStorage.setItem("telefono_centro", value.telefono);
					localStorage.setItem("web_centro", value.web);
					localStorage.setItem("email_centro", value.email);
					localStorage.setItem("facebook_centro", value.facebook);
				});
			}
		$.mobile.loading( 'hide');
		});
	}
}

//Recuperar Pasword:
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
	alert(data.respuesta);
	//comentario navigator.notification.alert (data.respuesta, null, 'Estetica Club', 'Aceptar');
	});
} else if (ok_email == false) {
	$.mobile.loading( 'hide');
	alert("La dirección de email no es correcta");
	//comentario navigator.notification.alert ("La dirección de email no es correcta", null, '¡Alerta!', 'Aceptar');
} else {
	$.mobile.loading( 'hide');
	alert("Indica tu dirección de email");
	//comentario navigator.notification.alert ("Indica tu dirección de email", null, '¡Alerta!', 'Aceptar');
}
}

//Logout:
function logout () {
	localStorage.clear();
	$.mobile.changePage( "index.html#inicio" );
	alert("¡Te has desconectado!");
	//comentario navigator.notification.alert ("¡Te has desconectado!", null, 'Estetica Club', 'Aceptar');
}

function recuperar_datos_inicio() {
	var id_user_app = localStorage.getItem("id_user_app_movil") || false;
	$.getJSON(serviceURL + "login.php?callback=?", { id_user_app:id_user_app }, function(data){
		if (data.resultado == true) {
			localStorage.setItem("nombre", data.nombre);
			localStorage.setItem("apellidos", data.apellidos);
			localStorage.setItem("tel", data.telefono);
			localStorage.setItem("email", data.email);
			localStorage.setItem("cp", data.cp);
			localStorage.setItem("provincia", data.provincia);
			localStorage.setItem("poblacion", data.poblacion);
			localStorage.setItem("id_centro", data.id_centro);
		}
	});
}

//Listado Centros:
function getListCentros(id, id_sel, marcar_sel) {
	ur = 'sel_centros.php?callback=?';
	var sel = $(id_sel);
	//Comienzo de nuevo el select:
	sel.empty();
	if (id_sel == '#sel_ini_centro #id_centro') {
		texto_sel = '1.- Selecciona un centro';
	} else {
		texto_sel = 'Selecciona un centro';
	}
	sel.append($('<option>', { 
				value: 0,
				text : texto_sel
			}));
//FIN cargando:
$.mobile.loading('hide');
$.getJSON(serviceURL + ur, { id_centro:id }, function(data){
	if (data.resultado === true) {
		$.each(data.datos , function( key, value ) {
			sel.append($('<option>', { 
				value: value.id,
				text : value.nombre 
			}));
		});
	} else {
		alert (data.respuesta);
		//comentario navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
	}
	if (marcar_sel > 0) {
		$(id_sel + ' option[value=' + marcar_sel + ']').attr('selected','selected').prop('selected', true);
	}
	//Refresco el select:
	sel.selectmenu('refresh');
}).fail(function() {
	alert ("No hay conexión, inténtalo de nuevo más tarde");
	//comentario navigator.notification.alert ("No hay conexión, inténtalo de nuevo más tarde", null, '¡Alerta!', 'Aceptar');
});
}


//Listado Provincias:
function getListProvincias(id, id_sel) {
	ur = 'sel_provincias.php?callback=?';
	var sel = $(id_sel);
	//Comienzo de nuevo el select:
	sel.empty();
	sel.append($('<option>', { 
				value: 0,
				text : 'Provincia' 
			}));
$.getJSON(serviceURL + ur, { id_bus:id }, function(data){
	if (data.resultado === true) {
		$.each(data.datos , function( key, value ) {
			sel.append($('<option>', { 
				value: value.id,
				text : value.nombre 
			}));
		});
		if (localStorage.getItem("provincia") > 0) {
			$(id_sel + ' option[value=' + localStorage.getItem("provincia") + ']').attr('selected','selected').prop('selected', true);
		}
	} else {
		alert (data.respuesta);
		//comentario navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
	}
	//Refresco el select:
	sel.selectmenu('refresh');
}).fail(function() {
	alert ("No hay conexión, inténtalo de nuevo más tarde");
	//comentario navigator.notification.alert ("No hay conexión, inténtalo de nuevo más tarde", null, '¡Alerta!', 'Aceptar');
});
}

//////------ SELECCIONAR POBLACIÓN -----//////
function sel_pob(id_prov, form_sel) {
	ur = 'consulta-pob.php?callback=?';
var venvio = {
id_prov: id_prov,
};

$.getJSON(serviceURL + ur, venvio, function (data) {
	if (data.resultado === true) {
	$(form_sel + ' #poblacion_sel').html('<label for="Pob"><b>Población</b></label>' +
	'<select id="pob_sel" class="needsclick">');
    $(form_sel + ' #pob_sel').append($('<option>', {
        value: 0,
        text : 'Selecciona la población'
    }));
$.each(data.datos , function( key, value ) {
    $(form_sel + ' #pob_sel').append($('<option>', {
        value: value.id,
        text : value.nombre
    }));
});
		if (localStorage.getItem("poblacion") > 0) {
			$(form_sel + ' #pob_sel option[value=' + localStorage.getItem("poblacion") + ']').attr('selected','selected').prop('selected', true);
		}
//----- Refresco la apariencia del select con un nuevo tema: -----
$(form_sel + " #pob_sel").selectmenu({ theme: "a" });
	} else {
		$(form_sel + ' #poblacion_sel').html('');
		alert (data.respuesta);
		//comentario
	}
}).fail(function(data) {
		$(form_sel + ' #poblacion_sel').html('');
		alert ("Error en la conexión");
		//comentario
});
}