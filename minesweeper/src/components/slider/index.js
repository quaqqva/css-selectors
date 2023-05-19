import sliderLayout from './index.html';
import './styles.scss';

export default function createSlider(min, max) {
  const template = document.createElement('template');
  template.insertAdjacentHTML('afterbegin', sliderLayout);
  const sliderWrapper = template.firstChild;
  const slider = sliderWrapper.querySelector('input');
  slider.min = min;
  slider.max = max;
  slider.value = min;
  const countView = sliderWrapper.querySelector('span');
  countView.innerHTML = slider.value;
  slider.addEventListener('input', () => { countView.innerHTML = slider.value; });
  return sliderWrapper;
}
