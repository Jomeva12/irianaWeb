const firebaseConfig = {
  apiKey: "AIzaSyAw1sq90UL2F7BcO-09yReRjrM3ZNxl5S4",
  authDomain: "irianaapp-9bc0d.firebaseapp.com",
  projectId: "irianaapp-9bc0d",
  storageBucket: "irianaapp-9bc0d.appspot.com",
  messagingSenderId: "312569676343",
  appId: "1:312569676343:web:8859150f2944f487ebb5b2",
  measurementId: "G-3F93T8WH5K"
};
var idNumero = ""
var miNombre = ""
var misNumeros = []
var numerosDisponibles = []
var numeroSeleccionado = ""
var intervalId=null

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

$(function () {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const idRifa = params.get("id");
  console.log("ID:", idRifa);

  detectarClic()
  obtenerNumeros(idRifa)
  generarAleatorio()
  obtenerRifa(idRifa)
  modalFotos()
})
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

        const valorFormateado = rifa.valor.toLocaleString('es-CO', options);
        $("#valor").text(`Valor: ${valorFormateado}`);
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
            let tarjetaClass = ganador ? "" : "tarjeta"; // Si hay un ganador definido, quita la clase 'tarjeta' para que no sea cliccable

            // Si es el ganador, asigna el color rojo, de lo contrario, asigna colores según el estado del número
            if (ganador !== "" && numeros.numero === ganador) {
              console.log(numeros.numero +"-"+ ganador)
              color = "bg-danger";
              estado = "Ganador";
              tarjetaClass = ""; // Quita la clase 'tarjeta' para que no sea cliccable
            } else {            
              if(ganador !== ""){
                console.log(numeros.numero +"-"+ ganador)
                color = "bg-secondary";
                estado = "Desconocido";
              }else{
                console.log(numeros.numero +"-"+ ganador)
                switch (numeros.estado) {
                case "seleccionado":
                  color = "bg-warning";
                  estado = "seleccionado";
                  break;
                case "pagado":
                  color = "bg-danger";
                  estado = "pagado";
                  break;
                case "disponible":
                  color = "bg-success";
                  estado = "disponible";
                  break;
                default:
                  color = "bg-secondary";
                  estado = "Desconocido";
              }
              }
            
              
            }

            // Construye la plantilla de la tarjeta con el color y el estado determinados
            plantilla += `
            <div class="${tarjetaClass} col-2 col-sm-4 col-md-2 mb-3 mx-1" style="padding: 0; cursor: ${ganador ? "default" : "pointer"};" data-id="${numeros.id}" data-numero="${numeros.numero}" data-estado="${estado}" >
              <div class="card text-white ${color}" style="border-radius: 10px;" >
                <div class="card-body p-0 text-center" style="padding: 0;">
                  <h3 class="card-title mb-0">${numeros.numero}</h3>
                </div>
                <p style="font-size: 10px; line-height: 1; text-align: center;">${numeros.nombreCliente}</p>
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
      if (idNumero) {
        db.collection("numeroRifa").doc(idNumero).update({
          nombreCliente: nombre,
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




