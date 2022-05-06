"use-strict";

const url =
  "https://gist.githubusercontent.com/bertez/8e62741154903c35edb3bfb825a7f052/raw/b5cd5137fd168116cc71740f1fbb75819d0fa82e/zelda-timeline.json";
const line = document.querySelector("#line-time");

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
  let info = [];

  if (info.length > 0) {
    info = JSON.parse(localStorage.getItem("info"));
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

const createLiAndCard = (element, index) => {
  const li = document.createElement("li");
  li.classList.add("point-time");

  li.innerHTML = `
    <div class="body-card dialog ${
      index % 2 === 0 ? "dialog-left" : "dialog-right"
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
