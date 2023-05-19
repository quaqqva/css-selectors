import './index.html';
import './styles/main.scss';
import createHeader from '../components/header';
import initGame from '../utils/game-init';

document.body.append(createHeader());
initGame();
