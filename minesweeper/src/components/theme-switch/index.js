import './styles.scss';

function changeTheme(element) {
  element.classList.toggle('night');
  Array.from(element.children).forEach((child) => changeTheme(child));
}

export default function createThemeSwitch() {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'theme-switch';
  input.addEventListener('input', changeTheme.bind(null, document.body));
  return input;
}
