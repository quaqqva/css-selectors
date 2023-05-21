import './index.html';
import './styles/main.scss';
import createFooter from '../components/footer';
import initGame from '../utils/game-init';

history.scrollRestoration = 'manual';

document.body.append(document.createElement('main'));
document.body.append(createFooter());
initGame();
