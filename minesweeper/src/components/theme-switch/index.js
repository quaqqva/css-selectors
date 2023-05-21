import './styles.scss';

export default function createThemeSwitch() {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'theme-switch';
  return input;
}
