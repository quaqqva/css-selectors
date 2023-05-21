import menuLayout from './index.html';
import createElement from '../../utils/createElement';
import Counter from '../counter';
import createThemeSwitch from '../theme-switch';
import emojiSmile from '../../assets/img/emoji-smile.png';
import emojiWin from '../../assets/img/emoji-win.png';
import emojiScared from '../../assets/img/emoji-scared.png';
import emojiLose from '../../assets/img/emoji-lose.png';
import './styles.scss';

export default class UserMenu {
  constructor() {
    this.layout = createElement(menuLayout);
    const initValue = 0;

    this.emoji = this.layout.querySelector('.menu__emoji');
    this.emoji.src = emojiSmile;

    this.themeSwitch = createThemeSwitch();
    this.layout.append(this.themeSwitch);

    this.flagsCounter = new Counter({ description: 'Flags left', initValue });
    this.layout.insertBefore(this.flagsCounter.layout, this.emoji);

    this.minesCounter = new Counter({ description: 'Mines left', initValue });
    this.layout.insertBefore(this.minesCounter.layout, this.emoji);

    this.clicksCounter = new Counter({ description: 'Total clicks', initValue });
    this.layout.append(this.clicksCounter.layout);

    this.addListeners();
  }

  addListeners() {
    document.body.addEventListener('mousedown', (event) => {
      if (event.target instanceof HTMLButtonElement) this.emoji.src = emojiScared;
    });
    document.body.addEventListener('mouseup', (event) => {
      if (event.target instanceof HTMLButtonElement) this.emoji.src = emojiSmile;
    });
    document.body.addEventListener('lose', () => { this.emoji.src = emojiLose; });
    document.body.addEventListener('win', () => { this.emoji.src = emojiWin; });
  }
}
