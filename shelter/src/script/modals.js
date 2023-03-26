function openModal(event) {
    let modalElement = document.createElement('div');
    modalElement.classList.add('menu-screen');
    modalElement.style.justifyContent = 'center';
    modalElement.style.alignItems = 'center';

    let petName = event.currentTarget.querySelector('h4').innerHTML,
        pet = pets.filter(pet => pet.name === petName)[0];
    let modalHTML = 
    `
        <div class = 'modal-wrapper'>
            <div class = 'modal'>
                <button class = 'button-round'>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.42618 6.00003L11.7046 1.72158C12.0985 1.32775 12.0985 0.689213 11.7046 0.295433C11.3108 -0.0984027 10.6723 -0.0984027 10.2785 0.295433L5.99998 4.57394L1.72148 0.295377C1.32765 -0.098459 0.68917 -0.098459 0.295334 0.295377C-0.0984448 0.689213 -0.0984448 1.32775 0.295334 1.72153L4.57383 5.99997L0.295334 10.2785C-0.0984448 10.6723 -0.0984448 11.3108 0.295334 11.7046C0.68917 12.0985 1.32765 12.0985 1.72148 11.7046L5.99998 7.42612L10.2785 11.7046C10.6723 12.0985 11.3108 12.0985 11.7046 11.7046C12.0985 11.3108 12.0985 10.6723 11.7046 10.2785L7.42618 6.00003Z" fill="#292929"/>
                    </svg>
                </button>
                <img src="${pet.img}" alt="${pet.name} photo">
                <div class = 'text-wrapper'>
                    <div class = 'header'>
                        <h3>${pet.name}</h3>
                        <h4>${pet.type} - ${pet.breed}</h4>
                    </div>
                    <h5>${pet.description}</h5>
                    <ul>
                        <li><span class="h5-modal-window">Age</span><span class="modal-list-item">${pet.age}</span></li> 
                        <li><span class="h5-modal-window">Inoculations</span><span class="modal-list-item">${pet.inoculations}</span></li>
                        <li><span class="h5-modal-window">Diseases</span><span class="modal-list-item">${pet.diseases}</span></li>
                        <li><span class="h5-modal-window">Parasites</span><span class="modal-list-item">${pet.parasites}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    modalElement.innerHTML = modalHTML;
    modalElement.querySelector('.modal-wrapper').style.top = '-100%';

    document.body.prepend(modalElement);
    setTimeout(() => {
        modalElement.classList.toggle('show-menu-screen');
        modalElement.querySelector('.modal-wrapper').style.top = '0';
        document.body.style.overflow = 'hidden';
    }, 5);
    
    modalElement.querySelector('button').addEventListener('click', cancelModal);
    setTimeout(() => {
        modalElement.addEventListener('click', (event) => {
            if (event.currentTarget === event.target)
                cancelModal();
        });
    }, 1000);
}

function cancelModal() {
    let modalElement = document.querySelector('.menu-screen');
    modalElement.querySelector('.modal-wrapper').style.top = '-100%';
    modalElement.classList.toggle('show-menu-screen');
    setTimeout(() => {
        modalElement.remove();
        document.body.style.overflow = '';
    }, 1000);
}