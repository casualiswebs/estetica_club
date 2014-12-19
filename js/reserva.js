jQuery(document).ready(function($) {
$('#sel_fecha_j').bind('datebox', function (e, passed) { 
    if ( passed.method === 'close' ) {
  /*var escogida = obby.date;
	console.log(escogida);*/
		if ($('#sel_fecha_j').val() != '') {
			var array_date = $('#sel_fecha_j').val().split("/");
			var fecha_mod = array_date[2] + "-" + array_date[1] + "-" + array_date[0];
			//console.log ('valor: ' + fecha_mod);
			
				$(".cargando").fadeIn();
				var id_servicio = $("li.sel_serv > a").attr("id");
				var id_tienda = localStorage.getItem("id_centro");
				$.getJSON(serviceURL + "reservas/horas.php?callback=?", {
						fecha: fecha_mod,
						id_tienda: id_tienda,
						id_servicio: id_servicio
				}, function(data){
				if (data.resultado === true) {
					datos_deco = jQuery.parseJSON(data.datos);
					$("#content_ajax").html('<h3>3.-Selecciona la hora</h3>');
					$("#content_ajax").append(datos_deco);
				} else {
					alert (data.respuesta);
					//comentario navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
				}
				//Refresco el listado y le asigno un tema:
				$('#lista_trats').listview({ theme:'a' });
			}).fail(function() {
				//alert ("No hay conexión, inténtalo de nuevo más tarde");
				navigator.notification.alert ("No hay conexión a Internet", null, '¡Alerta!', 'Aceptar');
			});
        
		} else {
			//En caso de borrar la fecha, elimino la selección de horas:
			$("#content_ajax").html('');
		}
    
}
});

/*
	//Datepicker:
	$.datepicker.regional['es'] = {
	  closeText: 'Cerrar',
	  prevText: '&lt;Anterior',
	  nextText: 'Siguiente&gt;',
	  currentText: 'Hoy',
	  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	  monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
	  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
	  dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
	  dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
	  weekHeader: 'Sm',
	  dateFormat: 'dd/mm/yy',
	  firstDay: 1,
	  isRTL: false,
	  showMonthAfterYear: false,
	  yearSuffix: ''
	  };
	$.datepicker.setDefaults($.datepicker.regional['es']);
   
	$( "#datepicker" ).datepicker({
		minDate: 0,
		maxDate: "+6M"
		});
	 $( "#calendario" ).datepicker({
		inline: true,
		minDate: 0,
		maxDate: "+6M",
	  	dateFormat: 'yy-mm-dd',
        onSelect: function (dateText, inst) {
			$(".cargando").fadeIn();
			var id_servicio = $("li.sel_serv > a").attr("id");
			var id_tienda = localStorage.getItem("id_centro");
            $.getJSON(serviceURL + "reservas/horas.php?callback=?", {
                    fecha: dateText,
					id_tienda: id_tienda,
					id_servicio: id_servicio
            }, function(data){
	if (data.resultado === true) {
		datos_deco = jQuery.parseJSON(data.datos);
		$("#content_ajax").html(datos_deco);
	} else {
		alert (data.respuesta);
		//comentario navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
	}
	//Refresco el listado y le asigno un tema:
	$('#lista_trats').listview({ theme:'a' });
}).fail(function() {
	alert ("No hay conexión, inténtalo de nuevo más tarde");
	//comentario navigator.notification.alert ("No hay conexión a Internet", null, '¡Alerta!', 'Aceptar');
});
        }
	 });//Fin Datepicker*/
});//close

$('#calendar_ap').on('pageshow', function(event) {
	$('#res_reserva').hide("fast");
	$('#contenido_reserva').show("fast");
	getListTratamientos('#list_tratamientos');
});

$('#reservas_ap').on('pageshow', function(event, data) {
	mis_reservas(localStorage.getItem("id_centro"));
});

$('#ficha_reserva').on('pageshow', function(event, data) {
});

$( document ).on( "pagebeforechange" , function ( event, data ) {
	    if ( data.toPage[0].id == "ficha_reserva" ) {
        var stuff = data.options.id_reserva;
		ficha_reserva(localStorage.getItem("id_centro"), stuff);
    }
	    if ( data.toPage[0].id == "mapa" ) {
        var stuff = data.options.id_centro_sel;
		abrirGoogleMaps_map(stuff);
    }
});



function escoger_hora(obby) {
}

//Listado Servicios tratamientos:
function getListTratamientos(div_id) {
	ur = 'sel_tratamientos.php?callback=?';
	//Comienzo de nuevo listado:
$(div_id).html('<a onClick="mostrar_todo_listado();" id="mostrar_todos" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-left" style="display:none;">Mostrar todos</a>');
	$(div_id).append('<ul id="lista_trats">');
	$(div_id + ' ul').append('<li data-role="list-divider">Selecciona un tratamiento</li>');
//FIN cargando:
$.mobile.loading('hide');
$.getJSON(serviceURL + ur, { id_centro:localStorage.getItem("id_centro") }, function(data){
	if (data.resultado === true) {
		$.each(data.datos , function( key, value ) {
			$(div_id + ' ul').append('<li><a id="serv' + value.id + '" onClick="sel_servicio(\'serv' + value.id + '\');">' + value.tratamiento + ' (' + value.duracion + ' min)</a></li>');
		});
	} else {
		alert (data.respuesta);
		//comentario navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
	}
	//Refresco el listado y le asigno un tema:
	$('#lista_trats').listview({ theme:'a' });
}).fail(function() {
	alert ("No hay conexión, inténtalo de nuevo más tarde");
	//comentario navigator.notification.alert ("No hay conexión a Internet", null, '¡Alerta!', 'Aceptar');
});
}


//*****----- GUARDAR RESERVA: -----******//
function guardar_reserva() {
	ur = 'reservas/guarda_reserva.php?callback=?';
//**-- CARGANDO --**//
$.mobile.loading( 'show', { theme: "b", text: "Cargando", textonly: false, textVisible: true});
var dia_entrada = $('#form_env_res').find('input[name="dia_entrada_env"]').val();
var hora_entrada = $('#form_env_res').find('input[name="hora_env"]').val();
var duracion_entr = $('#form_env_res').find('input[name="duracion_env"]').val();

var dia_entr_calendario = dia_entrada.split("-");
var hora_entr_calendario = hora_entrada.split(":");

fecha_prov = new Date(dia_entr_calendario[0] , dia_entr_calendario[1]-1 , dia_entr_calendario[2], hora_entr_calendario[0], hora_entr_calendario[1], 00);
fecha2 = new Date(fecha_prov.getTime() + duracion_entr * 60000);
Ano_ac = fecha2.getFullYear();
Mes_ac = fecha2.getMonth() + 1;
Dia_ac = fecha2.getDate();
Hora_ac = fecha2.getHours();
Min_ac = fecha2.getMinutes();
console.log ('Acaba: ' + fecha2);

$.getJSON(serviceURL + ur, {
//Variables:
id_cliente_env : localStorage.getItem("id_user_app_movil") || false,
dia_reserva_env : $('#form_env_res').find('input[name="dia_reserva_env"]').val(),
dia_entrada_env : dia_entrada,
hora_env : hora_entrada,
id_tienda_env : $('#form_env_res').find('input[name="id_tienda_env"]').val(),
id_servicio_env : $('#form_env_res').find('input[name="id_servicio_env"]').val(),
duracion_env : duracion_entr,
precio_env : $('#form_env_res').find('input[name="precio_env"]').val(),
postID : $('#form_env_res').find('input[name="postID"]').val()
	}, function(data){
	if (data.resultado === true) {
		deco_dat = jQuery.parseJSON(data.datos);
		$('#res_reserva').show("fast");
		$('#contenido_reserva').hide("slow");
		$('#res_reserva').html(deco_dat);
/*****----- GUARDAR EL EVENTO EN EL CALENDARIO DEL DISPOSITIVO -----*****///
  var startDate = new Date(dia_entr_calendario[0],dia_entr_calendario[1]-1,dia_entr_calendario[2],hora_entr_calendario[0],hora_entr_calendario[1],0,0,0); // beware: month 0 = january, 11 = december
  var endDate = new Date(Ano_ac,Mes_ac-1,Dia_ac,Hora_ac,Min_ac,0,0,0);
  var title = "Cita en " + localStorage.getItem("nombre_centro");
  var location = localStorage.getItem("direccion_centro") + ', ' + localStorage.getItem("poblacion_centro") + ', ' + localStorage.getItem("provincia_centro");
  var notes = "Tel. " + localStorage.getItem("telefono_centro") + ' | Web: ' + localStorage.getItem("web_centro") + ' | Email: ' + localStorage.getItem("email_centro");
  var success = function(message) {
	  //alert("Cita guardada en el calendario del teléfono");
	  navigator.notification.alert ("Cita guardada en el calendario del teléfono", null, '¡Alerta!', 'Aceptar');
	  };
  var error = function(message) {
	  //alert("Error al guardar la cita en el calendario del teléfono. " + message);
	  navigator.notification.alert ("Error al guardar la cita en el calendario del teléfono. " + message, null, '¡Alerta!', 'Aceptar');
	  };

  var calOptions = window.plugins.calendar.getCalendarOptions();
  calOptions.firstReminderMinutes = 120; // default is 60, pass in null for no reminder (alarm)
  //calOptions.secondReminderMinutes = 5;

  // Added these options in version 4.2.4:
  //calOptions.recurrence = "monthly"; // supported are: daily, weekly, monthly, yearly
  //calOptions.recurrenceEndDate = new Date(2015,6,1,0,0,0,0,0); // leave null to add events into infinity and beyond
  calOptions.calendarColor = "#f7931e"; // an optional hex color (with the # char), default is null, so the OS picks a color
  window.plugins.calendar.createEventWithOptions(title,location,notes,startDate,endDate,calOptions,success,error);
//*****----- FIN DE GUARDAR EL EVENTO EN EL CALENDARIO DEL DISPOSITIVO -----*****//
	} else {
		navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
	}
	//Refresco el listado y le asigno un tema:
	$('#lista_trats').listview({ theme:'a' });
}).fail(function() {
	navigator.notification.alert ("No hay conexión a Internet", null, '¡Alerta!', 'Aceptar');
});
//**-- FIN CARGANDO: --**//
$.mobile.loading('hide');
}
//*****----- FIN GUARDAR RESERVA -----*****//

//Reserva:
	 function sel_servicio(idsel) {
		 $('.sel_serv').removeClass('sel_serv');
		 $('#lista_trats li').hide('slow');
		 $('#'+idsel).parent().show('fast');
		 $('#mostrar_todos').show('slow');
		 //$('#'+idsel).parent().append('<a onClick="mostrar_todo_listado();" id="mostrar_todos" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-left">Mostrar todos</a>');
		 //$('#mostrar_todos').button();
		 $('#'+idsel).parent().addClass('sel_serv');
			$("#mostrar_cal").fadeIn();
			$(".cargando").fadeOut();
	 };
	 function mostrar_todo_listado() {
		$('#lista_trats li').show('fast');
		$('#mostrar_todos').hide();
		$("#mostrar_cal").fadeOut();
	 }
	function muestra_capa (capa, oculta_sig) {
			$("#"+capa).fadeIn();
			$("#"+oculta_sig).fadeOut();
	}
	function ocultar_capa (capa) {
			$("#"+capa).fadeOut();
	}
	 
   function muestra_registro() {
		$("#but_reg").hide();
		$("#form_registro_con").show('slow');
   }
   
   
   //*****----- RESERVAS -----*****
   function mis_reservas (id_tienda) {
	ur = 'reservas/mis_reservas.php?callback=?';
	var user_activo = localStorage.getItem("id_user_app_movil");
	var foto_centro = localStorage.getItem("foto_centro");
		$.getJSON(serviceURL + ur, { id_tienda:id_tienda, user_activo:user_activo }, function(data){
			if (data.resultado === true) {
	var div_id = '#mis-reservas-act';
	$(div_id).html('<ul id="lista_mis_reservas">');
					//console.log (data.id_res);
					var cont = 0;
				$.each(data.respuesta, function( key, value ) {
	$(div_id + ' ul').append('<li><a onClick="enviar_url(\'' + data.id_res[cont] + '\');" data-transition="slide"><img src="http://www.esteticaclub.com/web-tienda/images/tiendas/' + foto_centro + '" />' + value + '</a></li>');
	cont ++;
				});
	//Refresco el listado y le asigno un tema:
	$('#lista_mis_reservas').listview({ theme:'a' });
			} else {
				alert (data.respuesta);
			}
		});
   }
   
   function enviar_url(id_reserva) {
	   $.mobile.pageContainer.pagecontainer("change", '#ficha_reserva', { id_reserva: id_reserva });
   }
   function enviar_mapa(id_centro_sel) {
	   $.mobile.pageContainer.pagecontainer("change", '#mapa', { id_centro_sel: id_centro_sel });
   }
   function mostrar_mapa(id_sel) {
	var direccion = localStorage.getItem("direccion_centro");
	var poblacion = localStorage.getItem("poblacion_centro");
	var provincia = localStorage.getItem("provincia_centro");
	var direccion_comp = (direccion + ',' + poblacion + ',' + provincia);
	alert (encodeURIComponent(direccion_comp));
	    window.plugins.ChildBrowser.showWebPage('http://maps.google.es/maps?q=' + encodeURIComponent(direccion_comp),
                                        { showLocationBar: true });
   }
   
   function abrir (url) {
	   window.plugins.ChildBrowser.showWebPage(url,
                                        { showLocationBar: true });
   }
   
   function ficha_reserva (id_tienda, id_reserva) {
	ur = 'reservas/mis_reservas.php?callback=?';
	var user_activo = localStorage.getItem("id_user_app_movil");
		$.getJSON(serviceURL + ur, { id_tienda:id_tienda, user_activo:user_activo, id_reserva:id_reserva }, function(data){
			if (data.resultado === true) {
	var div_id = '#datos_reserva';
	//console.log (data.respuesta);
//Inserto el resultado:
//localStorage.setItem("facebook_centro", value.facebook);
$(div_id).html('<div class="ficha_res">' + data.respuesta);
$(div_id).append('<div class="desc_centro">' +
'<h2>' + localStorage.getItem("nombre_centro") + '</h2><br />' + localStorage.getItem("subtitulo_centro") + '<br />' +
localStorage.getItem("descripcion_centro") + '<br /><br />'+
'<div class="caducidad_ficha no_redondeado"><img src="images/mapa.png" /> <span> <a onClick="mostar_mapa(\'' + id_tienda + '\')">' + localStorage.getItem("direccion_centro") + ' - ' + localStorage.getItem("poblacion_centro") + '(' + localStorage.getItem("provincia_centro") + ')</a></span></div><br />'+
'<div class="caducidad_ficha"><img src="images/llamar.png" /> <span><a href="tel:' + localStorage.getItem("telefono_centro") + '">' + localStorage.getItem("telefono_centro") + '</a></span></div><br />'+
'<div class="caducidad_ficha"><img src="images/web.png" /> <span><a onClick="abrir(\'http://' + localStorage.getItem("web_centro") + '\');">' + localStorage.getItem("web_centro") + '</a></span></div><br />'+
'<div class="caducidad_ficha"><img src="images/email.png" /> <span> <a href="mailto:' + localStorage.getItem("email_centro") + '">' + localStorage.getItem("email_centro") + '</a></span></div></div>' +
'</div>');
$(div_id).append('<div class="foto_centro caducidad_ficha no_margen"><img src="http://www.esteticaclub.com/web-tienda/images/tiendas/' + localStorage.getItem("foto_centro") + '" /></div>');
//--
			} else {
				alert (data.respuesta);
			}
		});
   }
   //*****----- FIN RESERVAS -----*****