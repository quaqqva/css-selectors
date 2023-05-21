import './styles.scss';

function getRandomInt({ min, max }) {
  return min + Math.floor(Math.random() * max);
}

function getCoordinates(button) {
  const { row, column } = button.dataset;
  return [Number(row), Number(column)];
}

export default class Minefield {
  constructor({ size, mineCount }) {
    this.size = size;
    this.mineCount = mineCount;

    this.field = new Array(size);
    for (let i = 0; i < size; i += 1) this.field[i] = new Array(size);
    this.createLayout();

    this.addHandlers();
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
        this.field[i][j] = button;
      }
    }
  }

  addHandlers() {
    const generateMinesHandler = (event) => {
      if (event.target !== event.currentTarget) {
        this.generateMines({ pressed: event.target, count: this.mineCount });
        this.layout.removeEventListener('click', generateMinesHandler);
      }
    };
    this.layout.addEventListener('click', generateMinesHandler);

    const showHandler = (event) => {
      this.revealButton({ pressedButton: event.target, revealMine: true });
    };
    this.addClickHandler(showHandler.bind(this));
    this.layout.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  addClickHandler(handler) {
    const clickHandler = (event) => {
      if (event.target !== event.currentTarget) handler(event);
    };
    this.layout.addEventListener('click', clickHandler);
  }

  generateMines({ pressed, count }) {
    this.mines = [];
    while (this.mines.length !== count) {
      const row = getRandomInt({ min: 0, max: this.size - 1 });
      const column = getRandomInt({ min: 0, max: this.size - 1 });
      const pair = [row, column];
      const [pressedRow, pressedColumn] = getCoordinates(pressed);
      if (!(this.mineIsPresent(pair))
       && (row !== pressedRow || column !== pressedColumn)) this.mines.push(pair);
    }
  }

  mineIsPresent(pair) {
    for (let i = 0; i < this.mines.length; i += 1) {
      if (pair[0] === this.mines[i][0] && pair[1] === this.mines[i][1]) return true;
    }
    return false;
  }

  revealButton({ pressedButton, revealMine, visited = null }) {
    const button = pressedButton;
    if (!button) return;
    if (visited && visited.includes(pressedButton)) return;
    if (visited) visited.push(pressedButton);
    else visited = [pressedButton];
    button.disabled = true;
    if (revealMine
       && this.mineIsPresent(getCoordinates(pressedButton))) {
      const loseEvent = new Event('lose', { bubbles: true });
      this.layout.dispatchEvent(loseEvent);
      this.revealAllMines();
    } else {
      const adjacentMinesCount = this.calculateAdjacentMines(pressedButton);
      if (adjacentMinesCount > 0) button.innerHTML = adjacentMinesCount;
      else {
        const revealMine = false;
        const [row, column] = getCoordinates(pressedButton);
        if (row) {
          this.revealButton({
            pressedButton: this.field[row - 1][column - 1],
            revealMine,
            visited,
          });
          this.revealButton({
            pressedButton: this.field[row - 1][column],
            revealMine,
            visited,
          });
          this.revealButton({
            pressedButton: this.field[row - 1][column + 1],
            revealMine,
            visited,
          });
        }
        if (row + 1 < this.size) {
          this.revealButton({
            pressedButton: this.field[row + 1][column - 1],
            revealMine,
            visited,
          });
          this.revealButton({
            pressedButton: this.field[row + 1][column],
            revealMine,
            visited,
          });
          this.revealButton({
            pressedButton: this.field[row + 1][column + 1],
            revealMine,
            visited,
          });
        }
        this.revealButton({
          pressedButton: this.field[row][column - 1],
          revealMine,
          visited,
        });
        this.revealButton({
          pressedButton: this.field[row][column + 1],
          revealMine,
          visited,
        });
      }
    }
  }

  calculateAdjacentMines(pressedButton) {
    let result = 0;
    const [row, column] = getCoordinates(pressedButton);
    if (this.mineIsPresent([row - 1, column - 1])) result += 1;
    if (this.mineIsPresent([row - 1, column])) result += 1;
    if (this.mineIsPresent([row - 1, column + 1])) result += 1;
    if (this.mineIsPresent([row, column + 1])) result += 1;
    if (this.mineIsPresent([row + 1, column])) result += 1;
    if (this.mineIsPresent([row + 1, column - 1])) result += 1;
    if (this.mineIsPresent([row, column - 1])) result += 1;
    if (this.mineIsPresent([row + 1, column + 1])) result += 1;
    return result;
  }

  revealAllMines() {
    this.mines.forEach((pair) => {
      this.field[pair[0]][pair[1]].innerHTML = 'X';
    });
  }
}
