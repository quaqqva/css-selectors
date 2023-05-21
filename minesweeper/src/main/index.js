import './index.html';
import './styles/main.scss';
import createFooter from '../components/footer';
import initGame from '../utils/game-init';
import setupMenu from '../utils/menu-setup';

window.scrollTo(0, 0);

document.body.append(document.createElement('main'));
document.body.append(createFooter());
initGame();
setupMenu();
