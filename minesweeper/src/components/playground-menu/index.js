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
  constructor(field) {
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

    this.addHandlers(field);
  }

  addHandlers(field) {
    this.leftBtnHandler = () => { this.emoji.src = emojiScared; };
    this.clickCounterHandler = () => { this.clicksCounter.increase(); };
    this.mouseUpHandler = () => { this.emoji.src = emojiSmile; };

    document.body.addEventListener(field.BUTTON_DOWN_LEFT, this.leftBtnHandler);
    document.body.addEventListener(field.BUTTON_DOWN_LEFT, this.clickCounterHandler);
    document.body.addEventListener(field.BUTTON_DOWN_RIGHT, this.clickCounterHandler);
    document.body.addEventListener(field.BUTTON_UP, this.mouseUpHandler);

    document.body.addEventListener(field.LOSE, () => { this.emoji.src = emojiLose; });
    document.body.addEventListener(field.WIN, () => { this.emoji.src = emojiWin; });
  }
}
