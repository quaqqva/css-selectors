const mobileQuery = window.matchMedia("(max-width: 767px)"),
      tabletQuery = window.matchMedia("(min-width: 768px) and (max-width:1279px"),
      desktopQuery = window.matchMedia("(min-width:1280px");
[mobileQuery, tabletQuery, desktopQuery].forEach(
    query => query.addEventListener("change", () => { retreiveOffset()})
);

function generateRandoms(data, previousData, petsCount) {
    const getRandomNumber = (max) => Math.floor(Math.random() * max);
    let result = [];
    //Исключаем совпадения с прошлыми данными
    if (previousData)
        for (let element of previousData) {
            data.splice(data.findIndex(pet => pet.name === element.querySelector('h4').innerHTML), 1);

        }
        
    //Выбираем новые
    for (let i = 0; i < petsCount; i++) {
        let petIndex = getRandomNumber(data.length);
        result.push(data[petIndex]);
        //Удаляем элемент, чтобы больше в рандоме его не встретить
        data.splice(petIndex, 1);
    }
    return result;
}
//Генерация карточки
function getCard(pet) {
    let cardNode = document.createElement('figure');
    cardNode.classList.add('pet');
    cardNode.innerHTML =
    `
        <img src="${pet.img}" alt="${pet.name} photo">
            <figcaption>
                <h4>${pet.name}</h4>
                <button>Learn more</button>
            </figcaption>
    `;
    cardNode.addEventListener('click', openModal);
    return cardNode;
}

const generateCards = (data) => data.map(pet => getCard(pet));

function refreshCardDisplays() {
    let i = 1;
    for (let element of petsWrapper.children) {
        if (tabletQuery.matches && i%3 === 0)
            element.style.display = 'none';
        else if (mobileQuery.matches && (i%3 !== 1))
            element.style.display = 'none';
        else
            element.style.display = 'block';
        i++;
    }
}

function getOffset(double) {
    refreshCardDisplays();
    let gap = window.getComputedStyle(petsWrapper).getPropertyValue('gap');
    return `calc(${double?"-2 * ":"-1 * "}(${sliderWrapper.clientWidth}px + ${gap}))`;
}

function retreiveOffset() {
    petsWrapper.classList.toggle("no-transition");
    petsWrapper.style.left = getOffset(false);
    setTimeout(() => {
        petsWrapper.classList.toggle("no-transition");
    }, 10);
        
}

function slide(event) {
    let direction = event.currentTarget.classList.value.split(' ')[1];
    if (!direction) return;

    removeListeners();

    if (direction === "left") {
        nextCards = currentCards;
        currentCards = previousCards;
        previousCards = generateCards(generateRandoms(structuredClone(pets), currentCards, 3));

        petsWrapper.style.left = '0';
        setTimeout(() => {
            petsWrapper.prepend(...previousCards);
            for (let i = 0; i < 3; i++)
                petsWrapper.removeChild(petsWrapper.lastChild);
            retreiveOffset();
            setTimeout(() => addListeners(), 10);
        }, 1000);   
    }
    else {
        previousCards = currentCards;
        currentCards = nextCards;
        nextCards = generateCards(generateRandoms(structuredClone(pets), currentCards, 3));

        petsWrapper.style.left = getOffset(true);
        setTimeout(() => {
            petsWrapper.append(...nextCards);
            for (let i = 0; i < 3; i++)
                petsWrapper.removeChild(petsWrapper.firstChild);
            retreiveOffset();
            setTimeout(() => addListeners(), 10);
        }, 1000);
    }
}

function removeListeners() {
    document.querySelector(".button-round.left").removeEventListener('click', slide);
    document.querySelector(".button-round.right").removeEventListener('click', slide);
}

function addListeners() {
    document.querySelector(".button-round.left").addEventListener('click', slide);
    document.querySelector(".button-round.right").addEventListener('click', slide);
}


let previousCards = generateCards(generateRandoms(structuredClone(pets), null, 3)),
    currentCards = generateCards(generateRandoms(structuredClone(pets), previousCards, 3)),
    nextCards = generateCards(generateRandoms(structuredClone(pets), currentCards, 3)),
    petsWrapper = document.querySelector(".pets-wrapper"),
    sliderWrapper = document.querySelector(".slider-wrapper");
petsWrapper.append(...previousCards, ...currentCards, ...nextCards);
petsWrapper.style.left = getOffset(false);
addListeners();

