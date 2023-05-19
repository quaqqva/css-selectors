import buttonLayout from './index.html';
import './styles.scss';

export default function createButton({ mainText, additionalText }) {
  const template = document.createElement('template');
  template.insertAdjacentHTML('afterbegin', buttonLayout);
  const button = template.firstChild;
  button.querySelector('.button__main-text').innerHTML = mainText;
  button.querySelector('.button__additional-text').innerHTML = additionalText;
  return button;
}
