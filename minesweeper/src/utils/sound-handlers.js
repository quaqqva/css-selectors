import cellRevealSound from '../assets/sounds/cell-reveal.mp3';
import flagToggleSound from '../assets/sounds/flag-toggle.wav';
import loseSound from '../assets/sounds/lose.wav';
import winSound from '../assets/sounds/win.wav';
import clickSound from '../assets/sounds/click.wav';

let soundOn = true;

function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

export default function addSoundHandlers(field) {
  document.body.addEventListener('click', (event) => {
    if (soundOn && (event.target instanceof HTMLButtonElement
        || event.target.parentNode instanceof HTMLButtonElement)
        && !event.target.matches(field.BUTTON_SELECTOR)) {
      playSound(clickSound);
    }
  });
  document.body.addEventListener(field.WIN, () => {
    if (soundOn) playSound(winSound);
  });
  document.body.addEventListener(field.LOSE, () => {
    if (soundOn) playSound(loseSound);
  });
  document.body.addEventListener(field.BUTTON_DOWN_LEFT, () => {
    if (soundOn) playSound(cellRevealSound);
  });
  document.body.addEventListener(field.BUTTON_DOWN_RIGHT, () => {
    if (soundOn) playSound(flagToggleSound);
  });
  document.querySelector('.switch-sound-button').addEventListener('click', () => { soundOn = !soundOn; });
}
