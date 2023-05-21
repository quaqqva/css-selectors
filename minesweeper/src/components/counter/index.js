import counterLayout from './index.html';
import createElement from '../../utils/createElement';
import './styles.scss';

export default class Counter {
  constructor({ description, initValue }) {
    this.layout = createElement(counterLayout);
    this.counter = this.layout.querySelector('.counter');
    this.counter.innerHTML = initValue;
    this.value = initValue;
    this.layout.querySelector('.counter__description').setAttribute('title', description);
  }

  increase() {
    this.value += 1;
    this.update();
  }

  decrease() {
    this.value -= 1;
    this.update();
  }

  setValue(value) {
    this.value = value;
    this.update();
  }

  update() {
    this.counter.innerHTML = this.value;
  }
}
