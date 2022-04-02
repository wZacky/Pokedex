let initialOffSet = 0;
let initialLimit = 20;
let data = [initialOffSet, initialLimit]

let inputPokemonName = document.getElementById("inputPokemon");
inputPokemonName.placeholder = "e.g.: Charmander";

let container = document.getElementById("container");
let listOptions = document.getElementById("pokemons");

let modal = document.getElementById("modal");
let buttonCloseModal = document.getElementById("confirmBtn");

let listTypes = document.getElementById("listTypes");
let listMoves = document.getElementById("listMoves");
let listAbilities = document.getElementById("listAbilities");

let namePokemon = document.getElementById("namePokemon");
let experiencePokemon = document.getElementById("experiencePokemon");
let heightPokemon = document.getElementById("heightPokemon");
let weightPokemon = document.getElementById("weightPokemon");
let imageModal = document.getElementById("imageModal");

let nextButton = document.getElementById('buttonNext');
let previusButton = document.getElementById('buttonPrevius');

nextButton.addEventListener('click', () => {
    initialOffSet += 20

    if (initialOffSet !== 0) {
        previusButton.style.display = "inline"
    }

    data[0] = initialOffSet
    data[1] = initialLimit

    paginatePokemons()
})

previusButton.addEventListener('click', () => {
    initialOffSet -= 20

    if (initialOffSet !== 1120) {
        previusButton.style.display = "inline";
        nextButton.style.display = "inline";
    }

    data[0] = initialOffSet

    paginatePokemons()
})

function paginatePokemons() {
    let promises = []

    if (initialOffSet === 0) {
        previusButton.style.display = "none";
    } else if (initialOffSet === 1120) {
        nextButton.style.display = "none"
    }

    let config = {
        method: 'get',
        url: `https://pokeapi.co/api/v2/pokemon?offset=${(data[0])}&limit=${(data[1])}`,
        headers: {}
    }

    axios(config)
        .then(response => {
            let page = response.data;
            console.log(page)
            console.log(data[0])

            for (let i = 0; i < page.results.length; i++) {
                let conf = {
                    method: 'get',
                    url: page.results[i].url,
                    headers: {}
                }

                promises.push(axios(conf));
            }

            Promise.all(promises)
                .then(responses => {
                    container.innerHTML = "";
                    for (let i = 0; i < responses.length; i++) {
                        let pokemon = responses[i].data;

                        let imagePokemon = pokemon.sprites.other["official-artwork"].front_default;
                        let pathImage = "";

                        if(imagePokemon === null){
                            pathImage = "./images/unknownPokemon.png"
                        }else{
                            pathImage = imagePokemon;
                        }

                        let htmlContent = `
                            <div id="pokemonCard" onclick="displayModal('${pokemon.name}','div')">
                                <h3>${pokemon.name}</h3>
                                <img src="${pathImage}">
                            </div>
                        `

                        container.innerHTML += htmlContent
                    }
                })

        })
}

function search(name, array) {
    console.log(name)

    for (let i = 0; i < array.length; i++) {
        if (array[i].name === name) {
            return array[i]
        }
    }
}

inputPokemonName.addEventListener('keypress', (event) => {
    let keyPressed = event.key;

    if ((keyPressed === "Enter") && (inputPokemonName.value !== "")) {
        displayModal(inputPokemonName, "input");
    } else {
        inputPokemonName.placeholder = "Enter a valid name";
    }
})

paginatePokemons()

function listAllPokemons() {
    let config = {
        method: 'get',
        url: `https://pokeapi.co/api/v2/pokemon?limit=1126`,
        headers: {}
    }

    axios(config)
        .then(response => {
            console.log(response.data)
            let pokemons = response.data;

            for (let i = 0; i < pokemons.results.length; i++) {
                let option = document.createElement('option');
                option.innerText = pokemons.results[i].name
                listOptions.insertAdjacentElement('beforeend', option)
            }
        }).catch(error => {
            console.log("el error: " + error)
            alert("A problem has occurred 🤔")
        })
}

listAllPokemons()

function displayModal(pokemon, typeTag) {
    let url = ""
    if (typeTag === "input") {
        url = `https://pokeapi.co/api/v2/pokemon/${(pokemon.value.toLowerCase())}`;
        pokemon.value = "";
        pokemon.placeholder = "e.g.: Meowth";
    } else if (typeTag === "div") {
        url = `https://pokeapi.co/api/v2/pokemon/${(pokemon.toLowerCase())}`
    }

    let config = {
        method: 'get',
        url: url,
        headers: {}
    }

    modal.style.display = "none";

    console.log(config)

    axios(config)
        .then(response => {
            console.log("el name: ->>" + response.data.name)
            modal.style.display = "flex";
            //pokemon.value = "";
            //pokemon.placeholder = "e.g.: Meowth";
            let foundPokemon = response.data;
            let imagePokemon = foundPokemon.sprites.other["official-artwork"].front_default;
            let pathImage = "";

            if(imagePokemon === null){
                pathImage = "./images/unknownPokemon.png"
            }else{
                pathImage = imagePokemon;
            }
            imageModal.innerHTML = `<img src="${pathImage}">`

            namePokemon.innerText = `Name: ${(foundPokemon.name)}`;
            experiencePokemon.innerText = `Base Experience: ${(foundPokemon["base_experience"])}`
            heightPokemon.innerText = `Height: ${(foundPokemon.height)}`;
            weightPokemon.innerText = `Weight: ${(foundPokemon.weight)}`;

            foundPokemon.types.forEach(element => {
                listTypes.innerHTML += `<li>${element.type.name}</li>`
            });
            console.log(response.data)

            foundPokemon.moves.forEach(element => {
                listMoves.innerHTML += `<li>${element.move.name}</li>`
            })

            foundPokemon.abilities.forEach(element => {
                listAbilities.innerHTML += `<li>${element.ability.name}</li>`
            })

            modal.showModal();

            buttonCloseModal.addEventListener('click', () => {
                listTypes.innerHTML = "";
                listAbilities.innerHTML = "";
                listMoves.innerHTML = "";
                modal.close();
                modal.style.display = "none";
            })
        }).catch(error => {
            console.log("el error: " + error)
            alert("A problem has occurred 🤔")
        })
}