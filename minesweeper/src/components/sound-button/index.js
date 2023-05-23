import buttonLayout from './index.html';
import './styles.scss';
import soundImage from '../../assets/img/sound.png';
import noSoundImage from '../../assets/img/no-sound.png';
import createElement from '../../utils/createElement';

let soundOn = true;

export default function createSoundButton() {
  const soundButton = createElement(buttonLayout);
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.querySelector('img').src = soundOn ? soundImage : noSoundImage;
  });
  return soundButton;
}
