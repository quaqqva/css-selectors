import Modal from '../components/modal';
import createButton from '../components/button';
import createSlider from '../components/slider';
import Minefield from '../components/playground';

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

function formGamefield({ fieldSize, mineCount }) {
  const field = new Minefield({ size: fieldSize, mineCount });
  document.body.querySelector('main').append(field.layout);
  setTimeout(() => { document.body.querySelector('main').style = 'transform: none;'; }, 1000);
}

function showStartDialog() {
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
      });
    }
  });
  startModal.show();
}

export default function initGame() {
  showStartDialog();
}
