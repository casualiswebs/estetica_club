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
			var id_servicio = $("tr.sel > td > a").attr("id");
			var id_tienda = $("#id_tienda").attr("value");
			var id_profesional = $("#profesional option:selected").attr("value");
            $.ajax({
                url: "horas.php",
                type: 'post',
                data: {
                    fecha: dateText,
					id_tienda: id_tienda,
					id_servicio: id_servicio,
					id_profesional: id_profesional
                },
                beforeSend: function () {
                    $("#loading").fadeIn();
                },
                success: function (response) {
                    $("#content_ajax").html(response);
                },
                complete: function () {
                    $("#loading").fadeOut();
                }
            })
        }
	 });//Fin Datepicker
});//close


//Reserva:
	function mos_servicios () {
			$("#servicios").fadeIn();
			$(".cargando").fadeOut();
	}
	 function sel_servicio(idsel) {
		 $('.sel').removeClass('sel');
		 $('#'+idsel).parent().parent().addClass('sel');
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
   
   function desconectarse () {
	$.getJSON("logout.php?callback=?", { }, function(data){
	//console.log('Apuntarse: '+data.resultado);
		if (data.resultado==true) {
			$('#but_logout').hide("slow");
			$('#forms-reservas').hide("slow");
			$('#ico_user_perf').hide("slow");
			$('#perfil').hide("slow");
			
			$('#forms-users').show("slow");
			//Vuelvo a activar el formulario por si se desconecta el usuario:
			$('#us_con').show("slow");
			$('#us_reg').show("slow");
		} else {
			alert ('No se ha podido cerrar la sesión');
		}
	});
   }
   
   function us_conectarse () {
       c = document.getElementById('resultado_con');
	   
       email_ajax=document.us_con.email.value;
       pwd_ajax=document.us_con.pwd.value;
	   
			$('#us_con').hide();
		c.innerHTML = '<p style="text-align:center;"><img src="images/ajax.gif" id="ajax_gif"/></p>';
	$.getJSON("conectarse.php?callback=?", { email_ajax:email_ajax, pwd_ajax:pwd_ajax }, function(data){
	//console.log('Apuntarse: '+data.resultado);
		if (data.resultado==true) {
				//Limpio el formulario:
				$("#us_con")[0].reset();
			$('#ajax_gif').hide();
			$('#msg_json').append(data.respuesta);
			$('#msg_json').show("slow");
			//Activo icono mi perfil:
			$('#ico_user_perf').show("slow");
			if($(window).width() <= 469){
				$('#perfil').show("slow");
			}
			//--
			$('#forms-users').hide("slow");
			$('#forms-reservas').show("slow");
			$('#but_logout').show("slow");
		} else {
			$('#ajax_gif').hide();
			$('#resultado_con').append(data.respuesta);
			$('#resultado_con').show("slow");
			$('#us_con').show();
		}
	});
   }
   
   function us_registrarse () {
       c = document.getElementById('resultado_reg');
	   
       id_tienda=document.us_reg.id_tienda.value;
       nombre_ajax=document.us_reg.nombre.value;
       apellidos_ajax=document.us_reg.apellidos.value;
       tel_ajax=document.us_reg.tel.value;
       email_ajax=document.us_reg.email.value;
       pwd_ajax=document.us_reg.pwd.value;
       genero_ajax=$("#genero_reg option:selected").attr("value");
       provincia_ajax=document.us_reg.provincia.value;
       poblacion_ajax=document.us_reg.poblacion.value;
       cp_ajax=document.us_reg.cp.value;
	   
			$('#us_reg').hide();
		c.innerHTML = '<p style="text-align:center;"><img src="images/ajax.gif" id="ajax_gif"/></p>';
	$.getJSON("registrarse.php?callback=?", { id_tienda:id_tienda, nombre_ajax:nombre_ajax, apellidos_ajax:apellidos_ajax, tel_ajax:tel_ajax, email_ajax:email_ajax, pwd_ajax:pwd_ajax, genero_ajax:genero_ajax, provincia_ajax:provincia_ajax, poblacion_ajax:poblacion_ajax, cp_ajax:cp_ajax }, function(data){
	//console.log('Apuntarse: '+data.resultado);
		if (data.resultado==true) {
				//Limpio el formulario:
				$("#us_con")[0].reset();
			$('#ajax_gif').hide();
			$('#msg_json').append(data.respuesta);
			$('#msg_json').show("slow");
			//Activo icono mi perfil:
			$('#ico_user_perf').show("slow");
			$('#perfil').show("slow");
			//--
			$('#forms-users').hide();
			$('#forms-reservas').show("slow");
			$('#but_logout').show("slow");
		} else {
			$('#ajax_gif').hide();
			$('#resultado_reg').append(data.respuesta);
			$('#resultado_reg').show("slow");
			$('#us_reg').show();
		}
	});
   }
   
   function mis_reservas (id_tienda) {
	   $('#mis-reservas-act').empty();
		$('#mis-reservas-act').append('<p style="text-align:center;"><img src="images/ajax.gif" id="ajax_gif"/></p>');
		$('#mis-reservas-act').show("slow");
			
	$.getJSON("mis_reservas.php?callback=?", { id_tienda:id_tienda }, function(data){
	//console.log('Apuntarse: '+data.resultado);
			$('#ajax_gif').hide();
			$('#mis-reservas-act').append(data.respuesta);
	});
   }