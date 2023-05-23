import Modal from '../components/modal';
import showModalInfo from './info-modal';
import createButton from '../components/button';
import createSlider from '../components/slider';
import Minefield from '../components/playground';
import UserMenu from '../components/playground-menu';
import createFooter from '../components/footer';
import createThemeSwitch from '../components/theme-switch';
import createSoundButton from '../components/sound-button';
import scoresFuncs from './scores';
import saveFuncs from './save-load';
import addGameHandlers from './game-hadlers';
import addSoundHandlers from './sound-handlers';
import changeTheme from './change-theme';

const { showScores } = scoresFuncs;
const { saveGame, saveIsPresent, loadGame } = saveFuncs;

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

function setupMenu(firstTime) {
  menu = new UserMenu(field);
  document.querySelector('main').prepend(menu.layout);
  menu.flagsCounter.setValue(field.mineCount);

  if (firstTime) document.addEventListener(menu.FLAG_TOGGLE, () => field.toggleFlag());
  menu.newGameBtn.addEventListener('click', startNewGame);
  menu.viewScoresBtn.addEventListener('click', showScores);
  menu.saveGameBtn.addEventListener('click', saveGame.bind(null, { field, menu }));
  const errorHandler = showModalInfo.bind(null, { title: 'Error', text: 'No data to load' });
  menu.loadGameBtn.addEventListener('click', loadGame.bind(null, {
    field, menu, successHandler: () => {}, errorHandler,
  }));
}

function formGamefield({ fieldSize, mineCount, firstTime }) {
  field = new Minefield({ size: fieldSize, mineCount });
  addSoundHandlers(field);
  document.body.querySelector('main').append(field.layout);
  setTimeout(() => { document.body.querySelector('main').style = 'transform: none;'; }, 1000);
  setupMenu(firstTime);
  if (firstTime) addGameHandlers({ menu, field });
  if (document.body.classList.contains('night')) {
    changeTheme(document.body.querySelector('main'));
    document.body.querySelector('.theme-switch').checked = true;
  }
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
  const loadButton = createButton({ mainText: 'Load Game', additionalText: 'From local storage' });
  loadButton.classList.add('start-modal__load-button');

  const startModal = new Modal({
    title: 'Choose difficulty:',
    content,
    blockClose: true,
  });
  startModal.modalElement.append(loadButton);
  startModal.modalElement.append(createSlider(MINE_COUNTS.MIN, MINE_COUNTS.MAX));
  // Add style
  startModal.modalElement.classList.add('modal_start-modal');
  // Add click listener
  startModal.modalElement.addEventListener('click', (event) => {
    if (event.target.dataset.fieldSize || event.target.parentNode.dataset.fieldSize) {
      const button = event.target.parentNode.dataset.fieldSize
        ? event.target.parentNode : event.target;
      startModal.close();
      const slider = startModal.modalElement.lastChild.querySelector('input');
      formGamefield({
        fieldSize: Number(button.dataset.fieldSize),
        mineCount: Number(slider.value),
        firstTime,
      });
    }
  });
  loadButton.addEventListener('click', () => {
    if (saveIsPresent()) formGamefield({ fieldSize: 1, firstTime });
    loadGame({
      field,
      menu,
      successHandler: () => startModal.close(),
      errorHandler: () => { loadButton.querySelector('.button__additional-text').innerHTML = 'No data to load'; },
    });
  });
  startModal.show();
}

function createMain() {
  const main = document.createElement('main');
  main.append(createThemeSwitch());
  main.append(createSoundButton());

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
