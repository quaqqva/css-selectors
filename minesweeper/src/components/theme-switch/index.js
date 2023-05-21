import './styles.scss';

export default function createThemeSwitch() {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'menu__theme-switch';
  return input;
}
