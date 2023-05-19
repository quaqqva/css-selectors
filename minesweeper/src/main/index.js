import './index.html';
import './styles/main.scss';
import createHeader from '../components/header';
import init from '../utils/game-init';

document.body.append(createHeader());
init();
