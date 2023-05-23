import './styles.scss';
import changeTheme from '../../utils/change-theme';

export default function createThemeSwitch() {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'theme-switch';
  input.addEventListener('input', changeTheme.bind(null, document.body));
  return input;
}
