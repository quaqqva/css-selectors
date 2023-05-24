import './styles.scss';
import flagSrc from '../../assets/img/flag.png';
import bombSrc from '../../assets/img/bomb.png';

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
    this.resizeArray(size);
    this.createLayout();
    this.addHandlers(true);
  }

  resizeArray(size) {
    this.size = size;
    this.field = new Array(size);
    for (let i = 0; i < size; i += 1) this.field[i] = new Array(size);
  }

  loadState({ mines, buttons }) {
    this.mines = mines;
    this.resizeArray(buttons.length);
    this.createLayout();
    for (let i = 0; i < buttons.length; i += 1) {
      for (let j = 0; j < buttons[i].length; j += 1) {
        const buttonData = buttons[i][j];
        const curButton = this.field[i][j];
        if (buttonData.disabled) {
          curButton.disabled = true;
          curButton.innerHTML = buttonData.content;
          curButton.classList.add(`minefield__button_${buttonData.content}`);
        }
        if (buttonData.flagged) {
          const flagImage = new Image();
          flagImage.src = flagSrc;
          curButton.append(flagImage);
          curButton.flagged = true;
        }
      }
    }
    this.won = false;
    this.lost = false;
    this.addHandlers(false);
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

  addHandlers(withMinesGenerator) {
    if (withMinesGenerator) {
      const generateMinesHandler = (event) => {
        if (event.target !== event.currentTarget) {
          this.generateMines({ pressed: event.target, count: this.mineCount });
          this.layout.removeEventListener('click', generateMinesHandler);
        }
      };
      this.layout.addEventListener('click', generateMinesHandler);
    }

    this.revealHandler = ((event) => {
      if (event.target !== event.currentTarget) {
        const pressedButton = event.target;
        if (!pressedButton.flagged
           && !(this.lost || this.won)) this.revealButton({ pressedButton, revealMine: true });
      }
    });

    this.mouseDownDispatcher = (event) => {
      if (event.target.matches(this.BUTTON_SELECTOR)
       || event.target.parentNode.matches(this.BUTTON_SELECTOR)) {
        const eventType = event.button === 2 ? this.BUTTON_DOWN_RIGHT : this.BUTTON_DOWN_LEFT;
        const mouseDownEvent = new Event(eventType, { bubbles: true });
        mouseDownEvent.clicked = event.target.matches(this.BUTTON_SELECTOR)
          ? event.target
          : event.target.parentNode;
        mouseDownEvent.flagSet = mouseDownEvent.clicked.flagged;
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
      const flagEvent = new Event(eventType, { bubbles: true });
      this.layout.dispatchEvent(flagEvent);
    };

    this.layout.addEventListener('click', this.revealHandler);
    this.layout.addEventListener(this.BUTTON_DOWN_RIGHT, this.flagDispatcher);

    this.flagSetHandler = (event) => {
      const button = event.clicked;
      if (button.flagged) button.innerHTML = '';
      else {
        event.flagSet = true;
        const flagImage = new Image();
        flagImage.src = flagSrc;
        button.append(flagImage);
      }
      button.flagged = !button.flagged;
    };
    this.layout.addEventListener(this.BUTTON_DOWN_RIGHT, this.flagSetHandler);
    this.layout.addEventListener('contextmenu', (event) => event.preventDefault());
    this.layout.addEventListener('mousedown', this.mouseDownDispatcher);
    this.layout.addEventListener('mouseup', this.mouseUpDispatcher);
  }

  removeDispatchers() {
    this.layout.removeEventListener('mousedown', this.mouseDownDispatcher);
    this.layout.removeEventListener('mouseup', this.mouseUpDispatcher);
    this.layout.removeEventListener(this.BUTTON_DOWN_RIGHT, this.flagDispatcher);
  }

  toggleFlag() {
    this.flagLeftClick = !this.flagLeftClick;
    if (this.flagLeftClick) {
      this.layout.removeEventListener('click', this.revealHandler);
      this.layout.addEventListener(this.BUTTON_DOWN_LEFT, this.flagDispatcher);
      this.layout.addEventListener(this.BUTTON_DOWN_LEFT, this.flagSetHandler);
    } else {
      this.layout.removeEventListener(this.BUTTON_DOWN_LEFT, this.flagDispatcher);
      this.layout.removeEventListener(this.BUTTON_DOWN_LEFT, this.flagSetHandler);
      this.layout.addEventListener('click', this.revealHandler);
    }
  }

  generateMines({ pressed, count }) {
    this.mines = [];
    const [pressedRow, pressedColumn] = getCoordinates(pressed);
    let options = this.field
      .reduce((arr, row) => arr.concat(row.map((button) => getCoordinates(button))), []);
    options = options.filter((record) => record[0] !== pressedRow || record[1] !== pressedColumn);
    for (let i = 0; i < count; i += 1) {
      const index = getRandomInt({ min: 0, max: options.length - 1 });
      this.mines.push(options.splice(index, 1)[0]);
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
      if (adjacentMinesCount > 0) { button.innerHTML = adjacentMinesCount; button.classList.add(`minefield__button_${adjacentMinesCount}`); }
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
      const button = this.field[pair[0]][pair[1]];
      button.innerHTML = '';
      button.classList.add('minefield__button_releaved');
      const image = new Image();
      image.src = bombSrc;
      button.append(image);
    });
  }
}
