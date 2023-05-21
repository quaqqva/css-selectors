import './styles.scss';
import flagSrc from '../../assets/img/flag.png';

function getRandomInt({ min, max }) {
  return min + Math.floor(Math.random() * max);
}

function getCoordinates(button) {
  const { row, column } = button.dataset;
  return [Number(row), Number(column)];
}

export default class Minefield {
  BUTTON_SELECTOR = '.minefield__button';

  BUTTON_DOWN_LEFT = 'minefield-mousedown-left';

  BUTTON_DOWN_RIGHT = 'minefield-mousedown-right';

  FLAG_SET = 'minefield-flag-set';

  FLAG_REMOVED = 'minefield-flag-removed';

  BUTTON_UP = 'minefield-mouseup';

  LOSE = 'lose';

  WIN = 'win';

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

    const revealHandler = (event) => {
      const pressedButton = event.target;
      if (!pressedButton.flagged
         && !(this.lost || this.won)) this.revealButton({ pressedButton, revealMine: true });
    };

    this.mouseDownDispatcher = (event) => {
      if (event.target.matches(this.BUTTON_SELECTOR)
       || event.target.parentNode.matches(this.BUTTON_SELECTOR)) {
        const eventType = event.button === 2 ? this.BUTTON_DOWN_RIGHT : this.BUTTON_DOWN_LEFT;
        const mouseDownEvent = new Event(eventType, { bubbles: true });
        mouseDownEvent.clicked = event.target.matches(this.BUTTON_SELECTOR)
          ? event.target
          : event.target.parentNode;
        this.layout.dispatchEvent(mouseDownEvent);
      }
    };

    this.mouseUpDispatcher = (event) => {
      if (event.target.matches(this.BUTTON_SELECTOR)) {
        const mouseUpEvent = new Event(this.BUTTON_UP, { bubbles: true });
        this.layout.dispatchEvent(mouseUpEvent);
      }
    };

    this.flagDispatcher = (event) => {
      const eventType = event.clicked.flagged ? this.FLAG_REMOVED : this.FLAG_SET;
      console.log(event.clicked.flagged, eventType);
      const flagEvent = new Event(eventType, { bubbles: true });
      this.layout.dispatchEvent(flagEvent);
    };

    this.addClickHandler(revealHandler.bind(this));
    this.layout.addEventListener(this.BUTTON_DOWN_RIGHT, this.flagDispatcher);
    this.layout.addEventListener(this.BUTTON_DOWN_RIGHT, (event) => {
      const button = event.clicked;
      if (button.flagged) button.innerHTML = '';
      else {
        const flagImage = new Image();
        flagImage.src = flagSrc;
        button.append(flagImage);
      }
      button.flagged = !button.flagged;
    });
    this.layout.addEventListener('contextmenu', (event) => event.preventDefault());
    this.layout.addEventListener('mousedown', this.mouseDownDispatcher);
    this.layout.addEventListener('mouseup', this.mouseUpDispatcher);
  }

  removeDispatchers() {
    this.layout.removeEventListener('mousedown', this.mouseDownDispatcher);
    this.layout.removeEventListener('mouseup', this.mouseUpDispatcher);
    this.layout.removeEventListener(this.BUTTON_DOWN_RIGHT, this.flagDispatcher);
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
    if (button.flagged) return;

    if (visited && visited.includes(pressedButton)) return;
    if (visited) visited.push(pressedButton);
    else visited = [pressedButton];
    button.disabled = true;
    if (revealMine
       && this.mineIsPresent(getCoordinates(pressedButton)) && !this.won) {
      const loseEvent = new Event(this.LOSE, { bubbles: true });
      this.layout.dispatchEvent(loseEvent);
      this.revealAllMines();
      this.removeDispatchers();
      this.lost = true;
    } else {
      const adjacentMinesCount = this.calculateAdjacentMines(pressedButton);
      if (adjacentMinesCount > 0) button.innerHTML = adjacentMinesCount;
      else this.revealAdjacentFields({ pressedButton, visited });
    }
    if (this.onlyMinesLeft() && !this.won && !this.lost) {
      const winEvent = new Event(this.WIN, { bubbles: true });
      this.layout.dispatchEvent(winEvent);
      this.won = true;
      this.removeDispatchers();
    }
  }

  onlyMinesLeft() {
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (!(this.field[i][j].disabled) && !(this.mineIsPresent([i, j]))) return false;
      }
    }
    return true;
  }

  revealAdjacentFields({ pressedButton, visited }) {
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
