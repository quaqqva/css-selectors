import modalLayout from './index.html';
import './styles.scss';

export default class Modal {
  OPEN_TIME = 2000;

  BUILD_DELAY = 30;

  constructor({ title, content, blockClose }) {
    const template = document.createElement('template');
    template.insertAdjacentHTML('afterbegin', modalLayout);
    this.modalElement = template.firstChild;
    this.modalElement.querySelector('h2').innerHTML = title;
    this.modalElement.insertAdjacentHTML('beforeend', content);

    this.modalBG = document.createElement('div');
    this.modalBG.classList.add('modal__background');
    this.modalBG.prepend(this.modalElement);

    if (!blockClose) this.addListeners();
  }

  show() {
    document.body.prepend(this.modalBG);
    setTimeout(() => {
      this.modalElement.style = 'transform: translateY(20vh)';
      this.modalBG.style = 'background: rgba(0, 0, 0, 0.65)';
    }, 30);
  }

  close() {
    this.modalElement.style = '';
    this.modalBG.style = '';
    setTimeout(() => {
      document.body.removeChild(this.modalBG);
    }, this.OPEN_TIME);
  }

  addListeners() {
    this.modalBG.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) this.close();
    });
  }
}
