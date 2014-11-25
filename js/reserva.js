jQuery(document).ready(function($) {
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
	 });//Fin Datepicker
});//close

$('#calendar_ap').on('pageshow', function(event) {
	$('#res_reserva').hide("fast");
	$('#contenido_reserva').show("fast");
	getListTratamientos('#list_tratamientos');
});

$('#reservas_ap').on('pageshow', function(event) {
	mis_reservas(localStorage.getItem("id_centro"));
});


//Listado Servicios tratamientos:
function getListTratamientos(div_id) {
	ur = 'sel_tratamientos.php?callback=?';
	//Comienzo de nuevo listado:
	$(div_id).html('<ul id="lista_trats">');
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

$.getJSON(serviceURL + ur, {
//Variables:
id_cliente_env : localStorage.getItem("id_user_app_movil") || false,
dia_reserva_env : $('#form_env_res').find('input[name="dia_reserva_env"]').val(),
dia_entrada_env : $('#form_env_res').find('input[name="dia_entrada_env"]').val(),
hora_env : $('#form_env_res').find('input[name="hora_env"]').val(),
id_tienda_env : $('#form_env_res').find('input[name="id_tienda_env"]').val(),
id_servicio_env : $('#form_env_res').find('input[name="id_servicio_env"]').val(),
duracion_env : $('#form_env_res').find('input[name="duracion_env"]').val(),
precio_env : $('#form_env_res').find('input[name="precio_env"]').val(),
postID : $('#form_env_res').find('input[name="postID"]').val()
	}, function(data){
	if (data.resultado === true) {
		deco_dat = jQuery.parseJSON(data.datos);
		$('#res_reserva').show("fast");
		$('#contenido_reserva').hide("slow");
		$('#res_reserva').html(deco_dat);
/*****----- GUARDAR EL EVENTO EN EL CALENDARIO DEL DISPOSITIVO -----*****/// prep some variables
  var startDate = new Date(2014,10,26,18,30,0,0,0); // beware: month 0 = january, 11 = december
  var endDate = new Date(2014,10,26,19,30,0,0,0);
  var title = "Cita en " + localStorage.getItem("nombre_centro");
  var location = localStorage.getItem("direccion_centro") + ' ' + localStorage.getItem("poblacion_centro") + ' (' + localStorage.getItem("provincia_centro") + ')';
  var notes = "Tel. " + localStorage.getItem("telefono_centro") + ' | Web: ' + localStorage.getItem("web_centro") + ' | Email: ' + localStorage.getItem("email_centro");
  var success = function(message) { alert("Cita guardada en el calendario: " + JSON.stringify(message)); };
  var error = function(message) { alert("Error al guardar la cita en el calendario: " + message); };

  // create a calendar (iOS only for now)
  //window.plugins.calendar.createCalendar(calendarName,success,error);
  // if you want to create a calendar with a specific color, pass in a JS object like this:
  //var createCalOptions = window.plugins.calendar.getCreateCalendarOptions();
  //createCalOptions.calendarName = "Cita en " + localStorage.getItem("nombre_centro");
  //createCalOptions.calendarColor = "#f7931e"; // an optional hex color (with the # char), default is null, so the OS picks a color
  //window.plugins.calendar.createCalendar(createCalOptions,success,error);
alert ('Calendario: ' + location);
  // create an event silently (on Android < 4 an interactive dialog is shown)
  window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);

  // create an event silently (on Android < 4 an interactive dialog is shown which doesn't use this options) with options:
  //var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
  //calOptions.firstReminderMinutes = 120; // default is 60, pass in null for no reminder (alarm)
  //calOptions.secondReminderMinutes = 5;

  // Added these options in version 4.2.4:
  //calOptions.recurrence = "monthly"; // supported are: daily, weekly, monthly, yearly
  //calOptions.recurrenceEndDate = new Date(2015,6,1,0,0,0,0,0); // leave null to add events into infinity and beyond
  //calOptions.calendarName = "MyCreatedCalendar"; // iOS only
  //calOptions.calendarColor = "#f7931e"; // an optional hex color (with the # char), default is null, so the OS picks a color
  //window.plugins.calendar.createEventWithOptions(title,location,notes,startDate,endDate,calOptions,success,error);

  // create an event interactively (only supported on Android)
  //window.plugins.calendar.createEventInteractively(title,location,notes,startDate,endDate,success,error);

  // create an event in a named calendar (iOS only for now)
  //window.plugins.calendar.createEventInNamedCalendar(title,location,notes,startDate,endDate,calendarName,success,error);
//*****----- FIN DE GUARDAR EL EVENTO EN EL CALENDARIO DEL DISPOSITIVO -----*****//
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
//**-- FIN CARGANDO: --**//
$.mobile.loading('hide');
}
//*****----- FIN GUARDAR RESERVA -----*****//

//Reserva:
	 function sel_servicio(idsel) {
		 $('.sel_serv').removeClass('sel_serv');
		 $('#'+idsel).parent().addClass('sel_serv');
			$("#mostrar_cal").fadeIn();
			$(".cargando").fadeOut();
	 };
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
   
   function mis_reservas (id_tienda) {
	ur = 'reservas/mis_reservas.php?callback=?';
	var user_activo = localStorage.getItem("id_user_app_movil");
	var foto_centro = localStorage.getItem("foto_centro");
		$.getJSON(serviceURL + ur, { id_tienda:id_tienda, user_activo:user_activo }, function(data){
			if (data.resultado === true) {
	var div_id = '#mis-reservas-act';
	$(div_id).html('<ul id="lista_mis_reservas">');
				$.each(data.respuesta, function( key, value ) {
	$(div_id + ' ul').append('<li><a><img src="http://www.esteticaclub.com/web-tienda/images/tiendas/' + foto_centro + '" />' + value + '</a></li>');
				});
				
	//Refresco el listado y le asigno un tema:
	$('#lista_mis_reservas').listview({ theme:'a' });
			} else {
				alert (data.respuesta);
			}
		});
   }