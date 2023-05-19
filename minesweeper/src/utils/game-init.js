import Modal from '../components/modal';
import createButton from '../components/button';

const DIFFICULTY_PARAMS = {
  EASY: 10,
  MEDIUM: 15,
  HARD: 25,
};

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
  // Add style
  startModal.modalElement.classList.add('modal_start-modal');
  // Add click listener
  startModal.modalElement.addEventListener('click', (event) => {
    if (event.target.dataset.fieldSize) startModal.hide();
  });
  startModal.show();
}

export default function init() {
  formGamefield();
  showStartDialog();
}
