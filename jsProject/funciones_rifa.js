const firebaseConfig = {
  apiKey: "AIzaSyAw1sq90UL2F7BcO-09yReRjrM3ZNxl5S4",
  authDomain: "irianaapp-9bc0d.firebaseapp.com",
  projectId: "irianaapp-9bc0d",
  storageBucket: "irianaapp-9bc0d.appspot.com",
  messagingSenderId: "312569676343",
  appId: "1:312569676343:web:8859150f2944f487ebb5b2",
  measurementId: "G-3F93T8WH5K"
};

firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging()
//messaging.getToken({vapidkey:"BB8cAgwWoHuPG73WfMr2bZK8CziDVyGQrVN1BZ0Mc0jUsHiPVo8WDRTV5Ns9yXkBUHatw6ebFo8Xgw5V1jM8Uvc"})
//messaging.onMessage()


const db = firebase.firestore();


messaging.onMessage((payload) => {
  console.log('Mensaje recibido. ', payload);
  // Muestra la notificación usando el payload recibido
});


$(function () {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const idRifa = params.get("id");
  console.log("ID:", idRifa);



 
  $("#nequi").click(function(e){
    // Evita que se abra el enlace
    e.preventDefault();
    // Obtiene el número de teléfono (puedes cambiar este valor por el que necesites)
    var telefono = "3005128840";
    // Muestra el cuadro de diálogo con el número de teléfono y un botón para copiar
    alertify.confirm('Número de NEQUI de Iriana Meléndez', 'Teléfono: ' + telefono + '<br><button id="copyButton" class="btn btn-secondary">Copiar</button>', 
    function(){
        // Acción al hacer clic en Aceptar (no es necesario en este caso)
    },
    function(){
        // Acción al hacer clic en Cancelar (no es necesario en este caso)
    }).set({ 
        'labels': {
            ok: null, // Oculta el botón "Aceptar"
            cancel: 'Cerrar' // Cambia el texto del botón "Cancelar" a "Cerrar"
        },
        'closable': false, // Evita que el cuadro de diálogo se cierre haciendo clic fuera de él
        'type': 'none' // Oculta todos los botones
    });
    
    // Función para copiar el número de teléfono al portapapeles
    $("#copyButton").click(function(){
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(telefono).select();
        document.execCommand("copy");
        $temp.remove();
        alertify.success('Número de teléfono copiado al portapapeles');
        alertify.confirm().close();
    });
});


  detectarClic()
  obtenerNumeros(idRifa)
  generarAleatorio()
  obtenerRifa(idRifa)
  modalFotos()
})
var idNumero = ""
var miNombre = ""
var misNumeros = []
var numerosDisponibles = []
var numeroSeleccionado = ""
var intervalId=null


// Llamar a la función para enviar la notificación



var animation = lottie.loadAnimation({
  container: document.getElementById('lottie-animation-loading'), // Contenedor donde se mostrará la animación
  renderer: 'svg', // Tipo de renderizado (svg, canvas, html)
  loop: true, // Indica si la animación debe repetirse
  autoplay: true, // Indica si la animación debe empezar automáticamente
  path: 'img/loading.json' // Ruta al archivo JSON de la animación
})
// Función para obtener un documento por ID


function modalFotos(){
  $("#verFotos").click(function () {   
    $('.fotos').modal('show');
  })
}
function generarAleatorio() {
  $("#lottie-animation").click(function () {
    $("#availableNumbersCount").html( numerosDisponibles.length)
    $("#randomNumber").text("");
    $('.aleatorio').modal('show');




  })
  // Función para generar el número aleatorio
  function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  $("#stop").click(function () {
if (intervalId!=null) {
 // clearInterval(intervalId);
    ///    intervalId = null;
} else {
  
}
  })
  // Evento click del botón "Generar Aleatorio"
  $("#generateRandom").click(function () {
    if (intervalId === null) {
        // Iniciar la generación de números aleatorios
        $("#generateRandom").text("STOP").removeClass("btn-primary").addClass("btn-danger");
        if (numerosDisponibles.length > 0) {
            intervalId = setInterval(function () {
                var indexAleatorio = generarNumeroAleatorio(0, numerosDisponibles.length - 1);
                var numeroAleatorio = numerosDisponibles[indexAleatorio];
                $("#randomNumber").text(numeroAleatorio);
            }, 30);
            // Reproducir el sonido de la ruleta
            document.getElementById("rouletteSound").play();
        } else {
            $("#randomNumber").text("No hay números disponibles.");
        }
    } else {
        // Detener la generación de números aleatorios
        clearInterval(intervalId);
        intervalId = null;
        $("#generateRandom").text("PLAY").removeClass("btn-danger").addClass("btn-primary");
        // Pausar el sonido de la ruleta
        document.getElementById("rouletteSound").pause();
        document.getElementById("rouletteSound").currentTime = 0;
    }
});
$('.aleatorio').on('hidden.bs.modal', function () {
  // Detener el sonido de la ruleta
  document.getElementById("rouletteSound").pause();
  document.getElementById("rouletteSound").currentTime = 0;

  // Detener la generación de números aleatorios
  clearInterval(intervalId);
  intervalId = null;
  $("#generateRandom").text("PLAY").removeClass("btn-danger").addClass("btn-primary");
});

}
function obtenerRifa(idRifa) {
 // $(".menu--wrapper").empty();
  // Realiza una consulta en la colección "rifa" donde el campo "id" coincida con el ID proporcionado
  db.collection("rifa").where("id", "==", idRifa)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const rifa = doc.data();
        // const fechaRifa = rifa.fechaRifa.toDate().toLocaleDateString();

        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

       
        $("#valor").text(`Valor: ${rifa.valor}`);
        $("#loteria").text(`Lotería: ${rifa.loteria}`);
        $("#titulo").text(rifa.titulo);
        const fecha = new Date(rifa.fechaRifa);
        const fechaFormateada = fecha.toLocaleDateString('es-CO');
        $("#fecha").text(`Fecha: ${fechaFormateada}`);

        agregarImagenesAlCarrusel(rifa.fotos)
      });
    }, (error) => {
      console.log("Error obteniendo los datos de la rifa:", error);
    });
}


function obtenerNumeros(idRifa) {
  // Primero consulta la rifa para verificar si tiene un ganador
  db.collection("rifa").doc(idRifa).get().then((docRifa) => {
    if (docRifa.exists) {
      const rifa = docRifa.data();
      const ganador = rifa.ganador && rifa.ganador.trim() !== "" ? rifa.ganador.trim() : "";

      // Luego realiza una consulta en la colección "numeroRifa" para obtener los números
      db.collection("numeroRifa").where("idRifa", "==", idRifa).orderBy("numero", "asc")
        .onSnapshot((querySnapshot) => {
          let plantilla = "";

          // Itera sobre los documentos encontrados
          querySnapshot.forEach((doc) => {
            const numeros = doc.data();
            let color;
            let estado;
            let seleccionado="";
            var claseEfecto=""
            let tarjetaClass = ganador ? "" : "tarjeta"; // Si hay un ganador definido, quita la clase 'tarjeta' para que no sea cliccable

            // Si es el ganador, asigna el color rojo, de lo contrario, asigna colores según el estado del número
            if (ganador !== "" && numeros.numero === ganador) {           
              color = "bg-danger";
              estado = "Ganador";
              seleccionado=""
              tarjetaClass = ""; // Quita la clase 'tarjeta' para que no sea cliccable
            } else {            
              if(ganador !== ""){               
                color = "bg-secondary";
                estado = "Desconocido";
              }else{               
                switch (numeros.estado) {
                case "seleccionado":
                  seleccionado = "nombreCliente";
                  color = "bg-warning";
                  estado = "seleccionado";
                  break;
                case "pagado":
                  seleccionado = "nombreClienteBlanco";
                  color = "bg-danger";
                  estado = "pagado";
                  break;
                case "disponible":
                  claseEfecto="custom-glow-effect"
                  seleccionado = "nombreClienteBlanco";
                  numerosDisponibles.push(numeros.numero)
                  color = "bg-success";
                  estado = "disponible";
                  break;
                default:
                  seleccionado = "nombreClienteBlanco";
                  color = "bg-secondary";
                  estado = "Desconocido";
              }
              }
            
              
            }
            
            let nombreClienteFormateado = capitalizeWords(numeros.nombreCliente);
            // Construye la plantilla de la tarjeta con el color y el estado determinados
            plantilla += `
            <div class="${tarjetaClass} col-2 col-sm-4 col-md-2 mb-3 mx-1" style="padding: 0; cursor: ${ganador ? "default" : "pointer"};" data-id="${numeros.id}" data-numero="${numeros.numero}" data-estado="${estado}" >
              <div class="card  ${color} ${claseEfecto}" style="border-radius: 10px;" >
                <div class="card-body p-0 text-center " style="padding: 0;">
                  <h3 class="${seleccionado}" class="card-title mb-0">${numeros.numero}</h3>
                </div>
                <p class="${seleccionado}" style="font-size: 10px; line-height: 1; text-align: center;">${nombreClienteFormateado}</p>
              </div>
            </div>
            `;
          });

          // Actualiza el contenido del elemento con el id "listadoNumeros" en el DOM
          $("#listadoNumeros").html(plantilla);
        }, (error) => {
          console.log("Error obteniendo números de la rifa:", error);
        });
    } else {
      console.log("La rifa con el ID proporcionado no existe.");
    }
  }).catch((error) => {
    console.log("Error obteniendo los datos de la rifa:", error);
  });
}


function capitalizeWords(str) {
  return str.replace(/(?:^|\s)\S/g, function(char) {
    return char.toUpperCase();
  });
}





// data-toggle="modal" data-target=".bd-example-modal-sm"

function detectarClic() {
  $("#listadoNumeros").on('click', '.tarjeta', function () {
    numeroSeleccionado = $(this).data("numero");
    var estado = $(this).data("estado");
    idNumero = $(this).data("id");

    // Verificar el estado y mostrar la alerta correspondiente
    if (estado === "seleccionado" || estado === "pagado") {
      mostrarAlertaError(estado);
    } else {

      mostrarAlertify();
    }
  });
}
function mostrarAlertaError(estado) {
  var mensaje = "";

  if (estado === "seleccionado") {
    mensaje = "Este número ya ha sido seleccionado.";

  } else if (estado === "pagado") {
    mensaje = "Este número ya ha sido pagado.";
  
  } else {
    mensaje = "Este número ya ha sido seleccionado o pagado.";
  }

  // Cambiar el título predeterminado de AlertifyJS directamente en el método alert
  alertify.alert("Mensaje de Error", mensaje);
}



function mostrarAlertify() {
  // Crear un formulario personalizado dentro del alertify
  alertify.prompt('Nombre', 'Ingresa tu nombre', miNombre,
    function (evt, value) {
      // Acción al hacer clic en el botón de guardar
      var nombre = value;
      miNombre = value
      if (nombre==="") {
        alertify.error('No se puede guardar nombre vacío');
        setTimeout(mostrarAlertify, 1000);
      } else {
         if (idNumero) {
        db.collection("numeroRifa").doc(idNumero).update({
          nombreCliente: nombre.toLowerCase(),
          estado: "seleccionado"
        })
          .then(() => {
            var numerosSeleccionadosHTML = $("#numerosSeleccionados").html();
            // Concatenar el número seleccionado al contenido existente
            numerosSeleccionadosHTML += numeroSeleccionado + ", ";
            // Establecer el nuevo contenido en el elemento
            $("#numerosSeleccionados").html(numerosSeleccionadosHTML);
            alertify.message('Guardado el número');
          })
          .catch((error) => {
            console.error("Error actualizando el nombre del cliente: ", error);
          });
      } else {
        console.error("ID del número no encontrado.");
      }
      }
     
    },
    function () {
      // Acción al hacer clic en el botón de cancelar
      console.log('Cancelado');
    }
  ).set('labels', { ok: 'Guardar', cancel: 'Cancelar' }); // Cambiar etiquetas de los botones
}

// Asignar el evento click a las tarjetas



function mostrarImagenes(valor) {
  const multimediaUrl = String(valor);
  console.log(`llll: ${multimediaUrl}`);
  const imagenes = multimediaUrl.split(",");
  const primeraImagen = imagenes[0]; // Obtenemos la primera imagen del array

  // Cambia el estilo de fondo del banner existente
  $("#bgBanner").css({
    "background-image": `url(${primeraImagen})`,
    "background-size": "cover",  // Por ejemplo, puedes agregar más propiedades aquí
    "background-position": "center",
    "background-repeat": "no-repeat",
    "filter": "contrast(40%);"
  });


  // Genera la plantilla de las imágenes
  var plantilla = "";
  imagenes.forEach(imagen => {
    plantilla += `
          <div class="card">
              <div class="card-body">
                  <img src="${imagen}" class="card-img-top" alt="Imagen">
              </div>
          </div>`;
  });

  // Agrega la plantilla al contenedor
  $("#fotosPublicacion").html(plantilla);

  // Inicializa Owl Carousel después de cargar las imágenes
  $("#id").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
  });
}

function agregarImagenesAlCarrusel(urls) {
  const $menuWrapper = $(".menu--wrapper");
  $menuWrapper.empty(); // Vacía el contenedor del carrusel antes de agregar nuevas imágenes

  urls.forEach(url => {
    const $menu_item = $("<div>").addClass("menu--item");
    const $figure = $("<figure>");
    const $img = $("<img>").attr("src", url).attr("alt", "");
    $figure.append($img);
    $menu_item.append($figure);
    $menuWrapper.append($menu_item);
  });

  
}




