export default class Minefield {
  constructor({ size, mineCount }) {
    this.field = new Array(size);
    for (let i = 0; i < size; i += 1) this.field[i] = new Array(size);

    const generateMinesHandler = (event) => {
      if (event.target !== event.currentTarget) generateMines(event.target, mineCount);
    };
  }
}
