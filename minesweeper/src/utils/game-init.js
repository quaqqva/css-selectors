import Modal from '../components/modal';
import createButton from '../components/button';

const DIFFICULTY_PARAMS = {
  EASY: 10,
  MEDIUM: 15,
  HARD: 25,
};

export default function showStartDialog() {
  let content = '';
  Object.keys(DIFFICULTY_PARAMS).forEach((difficulty) => {
    const size = DIFFICULTY_PARAMS[difficulty];
    const button = createButton({ mainText: difficulty, additionalText: `${size}x${size} field` });
    button.classList.add(`button__${difficulty.toLowerCase()}`);
    content += button.outerHTML;
  });
  const startModal = new Modal({
    title: 'Choose difficulty:',
    content,
    blockClose: true,
  });
  startModal.modalElement.classList.add('modal_start-modal');
  startModal.show();
}
