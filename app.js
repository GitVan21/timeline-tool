"use-strict";

const url =
  "https://gist.githubusercontent.com/bertez/8e62741154903c35edb3bfb825a7f052/raw/b5cd5137fd168116cc71740f1fbb75819d0fa82e/zelda-timeline.json";
const line = document.querySelector("#line-time");
const closeButton = document.querySelector("#close-button");
const openButton = document.querySelector("#open-button");
const formData = document.querySelector("#form-data")
const modal = document.querySelector("#form-modal");
const coverInput = document.querySelector("#cover")

/**
 * Esta funcion servira como llamada a la api y retorna una promesa resuelta o rechazada
 * que se tratara con un async/await
 *
 * @direction {String} Url a la que diriges el fetch
 */
const collectData = (direction) => {
  return new Promise((resolve, reject) => {
    fetch(direction)
      .then((resp) =>
        resp.ok ? resp.json() : reject("NO se pudo recuperar JSON")
      )
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err));
  });
};

/**
 * Sirve de entrada para dibujar el contenido de la linea temporal
 */
const drawLine = async () => {

  //Primero obtenemos algo si es que lo hay y luego comprobamos su length, el || evitara que llege al if un info sin valor
  let info = localStorage.getItem("info") || [];

  if (info.length > 0) {
    info = JSON.parse(info);
  } else {
    info = await collectData(url);
    localStorage.setItem("info", JSON.stringify(info));
    console.log("Conectando a GitHub");
  }

  //Iteramos la cadena resultante siendo E cada elemento e I su indice
  info.map((e, i) => {
    /*      //Creamos los elementos
        const point = document.createElement('li')
        const dialog = document.createElement('div')

        //Si es par le daremos una clase y si es impar otra
        i%2 === 0 ? dialog.classList.add('dialog-left') : dialog.classList.add('dialog-right')
        dialog.innerText = e.text
        point.classList.add('point-time')
        dialog.classList.add('dialog')

        //Añadimos el estilo de point al li antes de enlazarlo como hijo de de la line
        point.appendChild(dialog)
        line.appendChild(point) */
    createLiAndCard(e, i);
  });
};

const addInfo = () => {
  let info = JSON.parse(localStorage.getItem("info"));
};

const createLiAndCard = (element, index) => {
  const li = document.createElement("li");
  li.classList.add("point-time");

  li.innerHTML = `
    <div class="body-card dialog ${index % 2 === 0 ? "dialog-left" : "dialog-right"
    }">
      <figure class="frame">
        <img
          src=${element.image}
          alt="The Legend Of Zelda Game Cover"
        />
      </figure>
      <div class="text-card">
        <h2>${element.title}</h2>
        <h3>${element.date}</h3>
        <p>${element.text}</p>
      </div>
    </div>
    `;

  line.append(li);
};

//Cerrara el modal
const closeModal = () => {
  modal.classList.remove("form-modal");
  modal.classList.add("form-modal-close");
}

//Abrira el modal
const openModal = () => {
  modal.classList.remove("form-modal-close");
  modal.classList.add("form-modal");
}

/**
 * Esta funcion convertira el objeto en un arr y lo recorrera buscando un intento de colar una etiqueta script
 * 
 * @param {Object} game 
 * @returns boolean, true si se intento una inyeccion de scripts
 */
const validate = (game) => {
  let err = false
  Object.values(game).map((e, i) => {
    if (e.includes("script")) {
      err = true
    }
  })

  return err
}

const saveNewGame = (game) => {
  //Recogemos todos los lis para obtener el length que pedimos para crear y enganchar la etiqueta
  const lis = document.getElementsByTagName('li')

  //Recogemos el arr que tenemos guardado en el localstorage, pusheamos el nuevo objeto y volvemos a guardarlo
  let info = JSON.parse(localStorage.getItem("info"))
  info.push(game)
  localStorage.setItem("info", JSON.stringify(info));

  //Ahora con todo hecho ya si enganchamos el nuevo juego
  createLiAndCard(game, lis.length)

  //Y cerramos el modal
  closeModal();

  line.lastChild.scrollIntoView()
}

drawLine();

//Añadimos a la ventana un 'escuchador' para el evento scroll
window.addEventListener("scroll", () => {
  //Recogemos todos los dialogs y los convertimos a un Array para poder manipularlos
  const dialogs = Array.prototype.slice.call(
    document.querySelectorAll(".dialog")
  );
  //Recogemos la altura total de la ventana para usarla de referencia
  const screenSize = window.innerHeight;

  //Iteramos: getBoundingClientRect().top sacara la altura a la que se encuentra la pantalla y screenSize recogera su altura total
  dialogs.map((e, i) => {
    if (e.getBoundingClientRect().top < screenSize) {
      e.classList.add("visible");
      e.classList.remove("no-visible");
    } else {
      e.classList.add("no-visible");
      e.classList.remove("visible");
    }
  });
});

//Ambos eventos de control para botones
closeButton.addEventListener("click", closeModal);
openButton.addEventListener("click", openModal);

coverInput.addEventListener("change", (e) => {
  const coverImage = document.querySelector('#coverImage')
  coverImage.src = e.target.value
})

//Se captura el submit para aprovechar la validacion por el lado del HTML
formData.addEventListener("submit", (e) => {
  e.preventDefault();

  //Partimos con la idea de que no existe ningun error
  let hasError = false

  //Creamos un objeto que contendra todos los campos
  const game = {
    title: formData.title.value,
    date: formData.date.value,
    text: formData.description.value,
    image: formData.cover.value
  }

  //Se limpia el form
  formData.title.value = ''
  formData.date.value = ''
  formData.description.value = ''
  formData.cover.value = ''

  //Pasamos el objeto a validate que procedera a descomponerlo y repasarlo para ver si encuentra algun intento de inyeccion
  hasError = validate(game)

  //Si lo encuentra avisara, si no procedera a hacer el push del objeto
  hasError ? alert('Intento de inyeccion Javascript') : saveNewGame(game)
})