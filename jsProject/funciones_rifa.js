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
const db = firebase.firestore();

$(function () {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const idRifa = params.get("id");
  console.log("ID:", idRifa);
  
  
  obtenerDocumento(idRifa); 
  obtenerNumeros(idRifa)
})
var animation = lottie.loadAnimation({
  container: document.getElementById('lottie-animation-loading'), // Contenedor donde se mostrará la animación
  renderer: 'svg', // Tipo de renderizado (svg, canvas, html)
  loop: true, // Indica si la animación debe repetirse
  autoplay: true, // Indica si la animación debe empezar automáticamente
  path: 'img/loading.json' // Ruta al archivo JSON de la animación
})
// Función para obtener un documento por ID
function obtenerDocumento(id) {
  const docRef = db.collection("rifa").doc(id);
  docRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc;
      var titulo=data.data().titulo
         console.log(titulo)
    } else {
      console.log("Documento no encontrado");
    }
  });
}

function obtenerNumeros(idRifa) {
  // Realiza una consulta en la colección "numeroRifa" donde el campo "idRifa" coincida con el ID proporcionado
  db.collection("numeroRifa").where("idRifa", "==", idRifa).orderBy("numero", "asc")
    .onSnapshot((querySnapshot) => {
      var plantilla = "";
      // Itera sobre los documentos encontrados
      querySnapshot.forEach((doc) => {
        // Obtén los datos del documento
        const numeros = doc.data();
        let color;
        let estado;
        // Determina el color y el estado de la tarjeta según el estado del número
        switch (numeros.estado) {
          case "seleccionado":
            color = "bg-warning";
            estado = "Seleccionado";
            break;
          case "pagado":
            color = "bg-danger";
            estado = "Pagado";
            break;
          case "disponible":
            color = "bg-success";
            estado = "Disponible";
            break;
          default:
            color = "bg-primary";
            estado = "Desconocido";
        }
        // Construye la plantilla de la tarjeta con el color y el estado determinados
        plantilla += `
        <div class="col-2 col-sm-4 col-md-2 mb-3 mx-1" style="padding: 0;">
          <div class="card text-white ${color}" style="border-radius: 10px;">
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
}




// Llama a la función para obtener los números de la rifa



function mostrarResultado(data) {
  // Obtener el objeto con los datos del documento
  const datosDocumento = data.data();
  if (datosDocumento.multimediaUrl) {
    mostrarImagenes(datosDocumento.multimediaUrl);
  }

  $("#nombrePublicacion").html(datosDocumento.nombre)
  $("#categoria").html(datosDocumento.categoria)
  $("#descripcion").html(datosDocumento.descripcion)
  $("#telefono").html(datosDocumento.celularContacto)
  $("#direcccion").html(datosDocumento.lugarDelEventoMapa)
  $("#valorAgregado").html(datosDocumento.valorAgregado)
  $("#tipoEventos").html(datosDocumento.tipoEvento)
  $("#lugar").html(datosDocumento.lugar)
  $("#Categoria").html(datosDocumento.categoria)
  
  //$("#validoHasta").html(datosDocumento.fechaVigencia)
  var validoHastaElement = document.getElementById("validoHasta");
  var fechaVigencia = datosDocumento.fechaVigencia;
  var fecha = new Date(fechaVigencia);
  var fechaFormateada = fecha.toLocaleDateString();
  validoHastaElement.innerHTML = fechaFormateada;
  
  var fechaDelEventoElement = document.getElementById("fechaDelEvento");
  var fechaDelEvento = datosDocumento.fechaDeEvento;
  var fechaEvento = new Date(fechaDelEvento);
  var fechaEventoFormateada = fechaEvento.toLocaleDateString();
  fechaDelEventoElement.innerHTML = fechaEventoFormateada;

  //$("#cantidadPersonas").html(datosDocumento.cantidadDePersonas)
  var cantidadPersonasElement = document.getElementById("cantidadPersonas");
  var cantidadPersonas = datosDocumento.cantidadDePersonas;
  if (cantidadPersonas === "") {
    cantidadPersonasElement.innerHTML = "0";
  } else {
    cantidadPersonasElement.innerHTML = cantidadPersonas;
  }

  var LugarElement = document.getElementById("lugar");
  var lugar = datosDocumento.lugar;
  if (lugar === "") {
    LugarElement.innerHTML = "-";
  } else {
    LugarElement.innerHTML = lugar;
  }
  
  // $("#costoFirma").html(datosDocumento.costoParaFirmar)
  // $("#precio").html("$"+datosDocumento.costoPaquete)
  // $("#anticipo").html(datosDocumento.anticipo)
  var anticipoElement = document.getElementById("anticipo");
  var costoanticipo = datosDocumento.anticipo;
  var costoanticipoFormateado = formatoConComas(costoanticipo);
  anticipoElement.innerHTML = "$" + costoanticipoFormateado;

  var precioElement = document.getElementById("precio");
  var costoPaquete = datosDocumento.costoPaquete;
  var costoFormateado = formatoConComas(costoPaquete);
  precioElement.innerHTML = "$" + costoFormateado;

  var costoFirmaElement = document.getElementById("costoFirma");
  var costoFirma = datosDocumento.costoParaFirmar;
  var costoFormateadocostoFirma = formatoConComas(costoFirma);
  costoFirmaElement.innerHTML = "$" + costoFormateadocostoFirma;
  // Función para formatear un número con comas cada tres dígitos
  function formatoConComas(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
}
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
  $("#fotosPublicacion").owlCarousel({
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




