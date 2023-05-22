import menuLayout from './index.html';
import createElement from '../../utils/createElement';
import Counter from '../counter';
import emojiSmile from '../../assets/img/emoji-smile.png';
import emojiWin from '../../assets/img/emoji-win.png';
import emojiScared from '../../assets/img/emoji-scared.png';
import emojiLose from '../../assets/img/emoji-lose.png';
import './styles.scss';

export default class UserMenu {
  FLAG_TOGGLE = 'menu-flag-toggle';

  constructor(field) {
    this.layout = createElement(menuLayout);
    const initValue = 0;

    this.emoji = this.layout.querySelector('.menu__emoji');
    this.emoji.src = emojiSmile;

    this.flagsCounter = new Counter({ description: 'Flags left', initValue });
    this.layout.insertBefore(this.flagsCounter.layout, this.emoji);

    this.secondsCounter = new Counter({ description: 'Total time (seconds)', initValue });
    this.layout.insertBefore(this.secondsCounter.layout, this.emoji);
    this.timer = setInterval(() => { this.secondsCounter.increase(); }, 1000);

    this.clicksCounter = new Counter({ description: 'Total clicks', initValue });
    this.layout.append(this.clicksCounter.layout);

    this.flagBtn = this.layout.querySelector('.menu__flag-button');
    const buttons = Array.from(this.layout.querySelectorAll('.menu__button'));
    [this.newGameBtn] = buttons.filter((button) => button.innerHTML === 'New game');
    [this.viewScoresBtn] = buttons.filter((button) => button.innerHTML === 'Highscores');
    [this.saveGameBtn] = buttons.filter((button) => button.innerHTML === 'Save game');
    [this.loadGameBtn] = buttons.filter((button) => button.innerHTML === 'Load game');

    this.addHandlers(field);
    this.setupFlagButton();
  }

  addHandlers(field) {
    const clickCounterHandler = () => { this.clicksCounter.increase(); };

    document.body.addEventListener(field.BUTTON_DOWN_LEFT, () => { this.emoji.src = emojiScared; });
    document.body.addEventListener(field.BUTTON_DOWN_LEFT, clickCounterHandler);
    document.body.addEventListener(field.BUTTON_DOWN_RIGHT, clickCounterHandler);
    document.body.addEventListener(field.BUTTON_UP, () => { this.emoji.src = emojiSmile; });

    document.body.addEventListener(field.FLAG_SET, () => { this.flagsCounter.decrease(); });
    document.body.addEventListener(field.FLAG_REMOVED, () => { this.flagsCounter.increase(); });

    document.body.addEventListener(field.LOSE, () => {
      this.emoji.src = emojiLose;
      clearInterval(this.timer);
    });
    document.body.addEventListener(field.WIN, () => {
      this.emoji.src = emojiWin;
      clearInterval(this.timer);
    });
  }

  setupFlagButton() {
    this.flagBtn.addEventListener('click', () => {
      this.flagBtn.toggled = !this.flagBtn.toggled;
      this.flagBtn.style = this.flagBtn.toggled ? 'background-color: green' : '';

      const flagToggleEvent = new Event(this.FLAG_TOGGLE, { bubbles: true });
      this.layout.dispatchEvent(flagToggleEvent);
    });
  }
}
