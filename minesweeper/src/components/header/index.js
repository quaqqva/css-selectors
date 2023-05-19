import headerLayout from './index.html';
import './styles.scss';

export default function createHeader() {
  const template = document.createElement('template');
  template.insertAdjacentHTML('afterbegin', headerLayout);
  return template.firstChild;
}
