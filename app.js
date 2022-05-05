"use strict";

//Games constants

const ul = document.querySelector("ul");

async function getZeldaGames() {
  const response = await fetch("./zelda-timeline.json");

  const zeldaGames = await response.json();

  console.log(zeldaGames);

  for (const zelda of zeldaGames) {
    const li = document.createElement("li");

    li.innerHTML = `
    <div class="body-card">
      <figure>
        <img
          src=${zelda.image}
          alt="The Legend Of Zelda Game Cover"
        />
      </figure>
      <div class="text-card">
        <h2>${zelda.title}</h2>
        <h3>${zelda.date}</h3>
        <p>${zelda.text}</p>
      </div>
    </div>
    `;

    ul.append(li);
  }
}

getZeldaGames();

console.log(ul);
