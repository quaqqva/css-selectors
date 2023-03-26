const mobileQuery = window.matchMedia("(max-width: 767px)"),
      tabletQuery = window.matchMedia("(min-width: 768px) and (max-width:1279px"),
      desktopQuery = window.matchMedia("(min-width:1280px)");
[mobileQuery, tabletQuery, desktopQuery].forEach(
    query => query.addEventListener("change", resetPages)
);

function generateRandoms(petsArr, count, ...prevData) {
    const getRandomNumber = (max) => Math.floor(Math.random() * max);
    let result = [], data = structuredClone(petsArr);
    //Убираем из набора старые
    if (prevData)
        for (let element of prevData)
            data.splice(data.findIndex(pet => pet.name === element.querySelector('h4').innerHTML), 1);
    //Выбираем новые
    for (let i = 0; i < count; i++) {
        let petIndex = getRandomNumber(data.length, null);
        result.push(data[petIndex]);
        //Удаляем элемент, чтобы больше в рандоме его не встретить
        data.splice(petIndex, 1);
    }
    return result;
}

function generatePages(data) {
    let result = []; 
    for (let i = 0; i < 2; i++) {
        let firstPage = getCards(generateRandoms(data, 8));
        let secondPage = getCards(generateRandoms(data, 4, ...firstPage.slice(6)));
        secondPage.push(...getCards(generateRandoms(data, 4, ...secondPage)));
        let thirdPage = getCards(generateRandoms(data, 2, ...secondPage.slice(4)));
        thirdPage.push(...getCards(generateRandoms(data, 6, ...thirdPage)));
        result.push(...firstPage, ...secondPage, ...thirdPage);
    }
    return result;
}

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
    `
    cardNode.addEventListener('click', openModal);
    return cardNode;
}

const getCards = (data) => data.map(pet => getCard(pet));
function getPageCount() {
    let pageCount;
    if (mobileQuery.matches)
        pageCount = 16;
    else if (tabletQuery.matches)
        pageCount = 8;
    else
        pageCount = 6;
    return pageCount;
}

function resetPages() {
    pages = separatePages(cards);
    setPages(pages);
    switchToPage(1);
    pageNum = 1;
}

function separatePages(pages) {
    let pageCount = getPageCount(),
     elemPerPage, result = [];
    elemPerPage = pages.length / pageCount;
    for (let i = 0; i < pageCount; i++) {
        let page = [];
        for (let j = 0; j < elemPerPage; j++) {
            page.push(pages[i*elemPerPage+j]);
        }
        result.push(page);
    }
    return result;
}

function setPages(pages) {
    let slider = document.querySelector(".slider");
    slider.replaceChildren(...pages.map(page => {
        let newPage = document.createElement('div');
        newPage.classList.add('pets-wrapper');
        newPage.append(...page);
        return newPage;
    }));
}

function getOffset(wrapper, page) {
    let gap = window.getComputedStyle(wrapper).getPropertyValue('gap');
    let offset = `calc(-1 * (${page - 1} * ${wrapper.clientWidth}px + ${page - 1} * ${gap}))`;
    return offset;
}

function switchToPage(pageNum) {
    removeListeners();
    let slider = document.querySelector(".slider");
    slider.style.left = getOffset(slider, pageNum);
    setTimeout(() => {
        addListeners();
    }, 1000);
    pageDiv.innerHTML = pageNum;
    applyButtons(pageNum);
}

function applyButtons(pageNum) {
    btnFirstPage.removeAttribute("disabled");
    btnPrevPage.removeAttribute("disabled");
    btnNextPage.removeAttribute("disabled");
    btnLastPage.removeAttribute("disabled");

    if (pageNum === 1) {
        btnFirstPage.setAttribute("disabled", "true");
        btnPrevPage.setAttribute("disabled", "true");
    }
    else if (pageNum === pages.length) {
        btnFirstPage.removeAttribute("disabled");
        btnPrevPage.removeAttribute("disabled");
        btnNextPage.setAttribute("disabled", "true");
        btnLastPage.setAttribute("disabled", "true");
    }
    else {
        btnFirstPage.removeAttribute("disabled");
        btnPrevPage.removeAttribute("disabled");
        btnNextPage.removeAttribute("disabled");
        btnLastPage.removeAttribute("disabled");
    }
}

function addListeners() {
    btnFirstPage.addEventListener('click', firstBtnHandler);
    btnPrevPage.addEventListener('click', prevBtnHandler);
    btnNextPage.addEventListener('click', nextBtnHandler);
    btnLastPage.addEventListener('click', lastBtnHandler);
}

function removeListeners() {
    btnFirstPage.removeEventListener('click', firstBtnHandler);
    btnPrevPage.removeEventListener('click', prevBtnHandler);
    btnNextPage.removeEventListener('click', nextBtnHandler);
    btnLastPage.removeEventListener('click', lastBtnHandler);
}


let btnFirstPage = document.getElementById("btnFirstPage"),
    btnPrevPage = document.getElementById("btnPrevPage"),
    pageDiv = document.getElementById("pageNumber"),
    btnNextPage = document.getElementById("btnNextPage"),
    btnLastPage = document.getElementById("btnLastPage"),
    cards = generatePages(pets), pages,
    pageNum = 1;

const firstBtnHandler = () => {
    switchToPage(1);
    pageNum = 1;
    },
    prevBtnHandler = () => {
        switchToPage(--pageNum);
    },
    nextBtnHandler = () => {
        switchToPage(++pageNum);
    },
    lastBtnHandler = () => {
        switchToPage(pages.length);
    pageNum = pages.length;
    };

addListeners();
resetPages();