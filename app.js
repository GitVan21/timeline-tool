"use-strict"

const url = "https://gist.githubusercontent.com/bertez/8e62741154903c35edb3bfb825a7f052/raw/b5cd5137fd168116cc71740f1fbb75819d0fa82e/zelda-timeline.json"
const line = document.querySelector("#line-time")

/**
 * Esta funcion servira como llamada a la api y retorna una promesa resuelta o rechazada
 * que se tratara con un async/await
 * 
 * @direction {String} Url a la que diriges el fetch
 */
const collectData = (direction) => {
    return new Promise((resolve, reject) => {
        fetch(direction)
            .then((resp) => resp.ok ? resp.json() : reject('NO se pudo recuperar JSON'))
            .then((data) => {
                resolve(data)
            })
            .catch(err => reject(err))
    })
}

/**
 * Sirve de entrada para dibujar el contenido de la linea temporal
 */
const drawLine = async() => {

    //Recibimos la promesa de collectData y esperamos a que se resuelva o se rechaze
    const response = await collectData(url)
    
    //Iteramos la cadena resultante siendo E cada elemento e I su indice
    response.map((e, i) => {
        //Creamos los elementos
        const point = document.createElement('li')
        const dialog = document.createElement('div')

        //Si es par le daremos una clase y si es impar otra
        i%2 === 0 ? dialog.classList.add('dialog-left') : dialog.classList.add('dialog-right')
        dialog.innerText = e.text

        //Añadimos el estilo de point al li antes de enlazarlo como hijo de de la line
        point.appendChild(dialog)
        point.classList.add('point-time')
        line.appendChild(point)
    })
}

drawLine();

if(window.onresize){
    console.log(window.innerWidth)
}