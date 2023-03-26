function showMenu() {
    let pageName = document.location.pathname.split('/').pop();
    let menuHTML = pageName === "index.html"?
`
    <div class = "menu-wrapper">
        <nav class = "mobile-menu">
            <ul>
                <li>
                    <span class="paragraph-mobile-menu initialized">
                        About the shelter
                    </span>
                </li>
                <li>
                    <a class="paragraph-mobile-menu" href="our-pets.html">
                        Our Pets
                    </a>
                </li>
                <li>
                    <a class="paragraph-mobile-menu" href="#help-items">Help the shelter</a>
                </li>
                <li>
                    <a class="paragraph-mobile-menu" href="#footer">Contacts</a>
                </li>
            </ul>
        </nav>
    </div>
`:
`
    <div class = "menu-wrapper">
        <nav class = "mobile-menu">
            <ul>
                <li>
                    <a class="paragraph-mobile-menu" href="index.html">
                        About the shelter
                    </a>
                </li>
                <li>
                    <span class="paragraph-mobile-menu initialized">Our Pets</span>
                </li>
                <li>
                    <a class="paragraph-mobile-menu" href="index.html#help-items">
                        Help the shelter
                    </a>
                </li>
                <li>
                    <a class="paragraph-mobile-menu" href="#footer">Contacts</a>
                </li>
            </ul>
        </nav>
    </div>
`;
    //Запрет прокрутки
    document.body.style.overflow = 'hidden';
    //Создаём меню и добавляем в док
    let menuScreen = document.createElement('div');
    menuScreen.classList.add('menu-screen');
    menuScreen.innerHTML = menuHTML;
    document.body.prepend(menuScreen);
    //Элемент не успевает создаться без нового стиля
    setTimeout(() => {
        //Анимации в ход
        burgerBtn.classList.toggle("rotate90deg");
        document.querySelector('.menu-wrapper').classList.toggle("show-menu");
        menuScreen.classList.toggle('show-menu-screen');
        //Привязка нового события
        burgerBtn.removeEventListener("click", showMenu);
        burgerBtn.addEventListener("click", hideMenu);
    }, 5);
    //Вешаем закрытие на клик в стороне
    menuScreen.addEventListener('click', (event) => {
        if (event.target.classList[0] === 'menu-screen')
            hideMenu();
    });
    //Вешаем закрытие на клик по ссылке
    document.querySelector(".mobile-menu ul").addEventListener("click", (event) => {
        if (event.target !== event.currentTarget)
            hideMenu();
    });
}

function hideMenu() {
    let menuScreen = document.querySelector(".menu-screen");
    burgerBtn.classList.toggle("rotate90deg");
    menuScreen.classList.toggle("show-menu-screen");
    document.querySelector('.menu-wrapper').classList.toggle("show-menu");
    burgerBtn.removeEventListener("click", hideMenu);
    burgerBtn.addEventListener("click", showMenu);
    //Анимация кончится, и тогда...
    setTimeout(() => {
        document.body.removeChild(menuScreen);
        //Вернём прокрутку
        document.body.style.overflow = '';
    }, 1000);
}

let burgerBtn = document.querySelector(".burger-btn");
burgerBtn.addEventListener('click', showMenu);
