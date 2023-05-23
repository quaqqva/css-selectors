import cellRevealSound from '../assets/sounds/cell-reveal.mp3';
import flagToggleSound from '../assets/sounds/flag-toggle.wav';
import loseSound from '../assets/sounds/lose.wav';
import winSound from '../assets/sounds/win.wav';
import clickSound from '../assets/sounds/click.wav';
import soundButtonFuncs from '../components/sound-button';

const { changeButtonImage } = soundButtonFuncs;

function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

let sound = true;

export default function addSoundHandlers(field) {
  document.body.addEventListener('click', (event) => {
    if (sound && (event.target instanceof HTMLButtonElement
        || event.target.parentNode instanceof HTMLButtonElement)
        && !event.target.matches(field.BUTTON_SELECTOR)) {
      playSound(clickSound);
    }
  });
  document.body.addEventListener(field.WIN, () => {
    if (sound) playSound(winSound);
  });
  document.body.addEventListener(field.LOSE, () => {
    if (sound) playSound(loseSound);
  });
  document.body.addEventListener(field.BUTTON_DOWN_LEFT, () => {
    if (sound) playSound(cellRevealSound);
  });
  document.body.addEventListener(field.BUTTON_DOWN_RIGHT, () => {
    if (sound) playSound(flagToggleSound);
  });
  const button = document.querySelector('.switch-sound-button');
  button.addEventListener('click', () => { sound = !sound; changeButtonImage({ button, soundOn: sound }); });
  document.body.addEventListener('formField', () => {
    if (!sound) changeButtonImage({ button, soundOn: sound });
  });
}
