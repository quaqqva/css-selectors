import buttonLayout from './index.html';
import createElement from '../../utils/createElement';
import './styles.scss';

export default function createButton({ mainText, additionalText }) {
  const button = createElement(buttonLayout);
  button.querySelector('.button__main-text').innerHTML = mainText;
  button.querySelector('.button__additional-text').innerHTML = additionalText;
  return button;
}
