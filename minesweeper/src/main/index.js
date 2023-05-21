import './index.html';
import './styles/main.scss';
import createFooter from '../components/footer';
import createThemeSwitch from '../components/theme-switch';
import initGame from '../utils/game-init';

history.scrollRestoration = 'manual';

const main = document.createElement('main');
main.append(createThemeSwitch());

document.body.append(main);
document.body.append(createFooter());
initGame();
