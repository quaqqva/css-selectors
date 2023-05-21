import './styles.scss';

export default class Minefield {
  constructor({ size, mineCount }) {
    this.size = size;
    this.createLayout();

    this.field = new Array(size);
    for (let i = 0; i < size; i += 1) this.field[i] = new Array(size);

    const generateMinesHandler = (event) => {
      if (event.target !== event.currentTarget) {
        this.generateMines({ pressed: event.target, count: mineCount });
        this.layout.removeEventListener('click', generateMinesHandler);
      }
    };
    this.layout.addEventListener('click', generateMinesHandler);
  }

  createLayout() {
    this.layout = document.createElement('div');
    this.layout.classList.add('minefield');
    this.layout.dataset.size = this.size;
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        const button = document.createElement('button');
        button.classList.add('minefield__button');
        button.dataset.row = i;
        button.dataset.column = j;
        this.layout.append(button);
      }
    }
  }

  generateMines({ pressed, count }) {
    
  }
}
