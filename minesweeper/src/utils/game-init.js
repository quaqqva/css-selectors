import Modal from '../components/modal';
import createButton from '../components/button';
import createSlider from '../components/slider';
import Minefield from '../components/playground';
import UserMenu from '../components/playground-menu';
import createFooter from '../components/footer';
import createThemeSwitch from '../components/theme-switch';
import scoresFuncs from './scores';

const { writeScore, showScores } = scoresFuncs;

const DIFFICULTY_PARAMS = {
  // Field sizes
  EASY: 10,
  MEDIUM: 15,
  HARD: 25,
};

const MINE_COUNTS = {
  MIN: 10,
  MAX: 99,
};

let field = null;
let menu = null;

function getDifficulty() {
  let difficulty = 'Easy';
  if (field.mineCount === 15) difficulty = 'Medium';
  if (field.mineCount === 20) difficulty = 'Hard';
  return difficulty;
}

function addGameHandlers() {
  const winHandler = () => {
    const modalContent = `
    <span class = "win-modal__content">
    You found all mines in ${menu.secondsCounter.value} seconds and ${menu.clicksCounter.value} moves!
    </span>
    <button class="win-modal__button">OK</button>`;
    const modal = new Modal({
      title: 'Hooray!',
      content: modalContent,
      blockClose: false,
    });
    modal.show();
    writeScore(
      {
        result: 'Win', difficulty: getDifficulty(), clicks: menu.clicksCounter.value, time: menu.secondsCounter.value,
      },
    );
  };
  document.body.addEventListener(field.WIN, winHandler);

  const loseHandler = () => {
    const modalContent = `
    <span class = "lose-modal__content">
    Game over. Try again
    </span>
    <button class="lose-modal__button">OK</button>`;
    const modal = new Modal({
      title: ':(',
      content: modalContent,
      blockClose: false,
    });
    modal.show();
    writeScore(
      {
        result: 'Lose', difficulty: getDifficulty(), clicks: menu.clicksCounter.value, time: menu.secondsCounter.value,
      },
    );
  };
  document.body.addEventListener(field.LOSE, loseHandler);
}

function setupMenu(firstTime) {
  menu = new UserMenu(field);
  document.querySelector('main').prepend(menu.layout);
  menu.flagsCounter.setValue(field.mineCount);

  if (firstTime) document.addEventListener(menu.FLAG_TOGGLE, () => field.toggleFlag());
  menu.newGameBtn.addEventListener('click', startNewGame);
  menu.viewScoresBtn.addEventListener('click', showScores);
}

function formGamefield({ fieldSize, mineCount, firstTime }) {
  field = new Minefield({ size: fieldSize, mineCount });
  document.body.querySelector('main').append(field.layout);
  setTimeout(() => { document.body.querySelector('main').style = 'transform: none;'; }, 1000);
  if (firstTime) addGameHandlers();
  setupMenu(firstTime);
}

function showStartDialog(firstTime) {
  // Form content
  let content = '';
  Object.keys(DIFFICULTY_PARAMS).forEach((difficulty) => {
    const size = DIFFICULTY_PARAMS[difficulty];
    const button = createButton({ mainText: difficulty, additionalText: `${size}x${size} field` });
    button.classList.add(`button__${difficulty.toLowerCase()}`);
    button.dataset.fieldSize = size;
    content += button.outerHTML;
  });
  const startModal = new Modal({
    title: 'Choose difficulty:',
    content,
    blockClose: true,
  });
  startModal.modalElement.append(createSlider(MINE_COUNTS.MIN, MINE_COUNTS.MAX));
  // Add style
  startModal.modalElement.classList.add('modal_start-modal');
  // Add click listener
  startModal.modalElement.addEventListener('click', (event) => {
    if (event.target.dataset.fieldSize) {
      startModal.close();
      const slider = startModal.modalElement.lastChild.querySelector('input');
      formGamefield({
        fieldSize: Number(event.target.dataset.fieldSize),
        mineCount: Number(slider.value),
        firstTime,
      });
    }
  });
  startModal.show();
}

function createMain() {
  const main = document.createElement('main');
  main.append(createThemeSwitch());

  document.body.append(main);
  document.body.append(createFooter());
}

export default function initGame(firstTime) {
  createMain();
  showStartDialog(firstTime);
}

function startNewGame() {
  const main = document.querySelector('main');
  main.style = 'transform: translateY(100%)';
  const footer = document.querySelector('footer');
  setTimeout(() => {
    document.body.removeChild(main);
    document.body.removeChild(footer);
  }, 2000);
  setTimeout(() => { initGame(false); }, 1000);
}
