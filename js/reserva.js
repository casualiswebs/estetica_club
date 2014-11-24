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
            $.getJSON(serviceURL + "horas.php?callback=?", {
                    fecha: dateText,
					id_tienda: id_tienda,
					id_servicio: id_servicio
            }, function(data){
	if (data.resultado === true) {
		$("#content_ajax").html(data.datos).text();
	} else {
		alert (data.respuesta);
		//comentario navigator.notification.alert (data.respuesta, null, '¡Alerta!', 'Aceptar');
	}
	//Refresco el listado y le asigno un tema:
	$('#lista_trats').listview({ theme:'a' });
}).fail(function() {
	alert ("No hay conexión, inténtalo de nuevo más tarde");
	//comentario navigator.notification.alert ("No hay conexión, inténtalo de nuevo más tarde", null, '¡Alerta!', 'Aceptar');
});
        }
	 });//Fin Datepicker
});//close

$('#sec_calendar').on('pageshow', function(event) {
	getListTratamientos('#list_tratamientos');
});


//Listado Servicios tratamientos:
function getListTratamientos(div_id) {
	ur = 'sel_tratamientos.php?callback=?';
	console.log(localStorage.getItem("id_centro"));
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
	//comentario navigator.notification.alert ("No hay conexión, inténtalo de nuevo más tarde", null, '¡Alerta!', 'Aceptar');
});
}

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
	   $('#mis-reservas-act').empty();
		$('#mis-reservas-act').append('<p style="text-align:center;"><img src="images/ajax.gif" id="ajax_gif"/></p>');
		$('#mis-reservas-act').show("slow");
			
	$.getJSON(serviceURL + "mis_reservas.php?callback=?", { id_tienda:id_tienda }, function(data){
	//console.log('Apuntarse: '+data.resultado);
			$('#ajax_gif').hide();
			$('#mis-reservas-act').append(data.respuesta);
	});
   }