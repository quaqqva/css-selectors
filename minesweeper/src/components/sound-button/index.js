import buttonLayout from './index.html';
import './styles.scss';
import soundImage from '../../assets/img/sound.png';
import noSoundImage from '../../assets/img/no-sound.png';
import createElement from '../../utils/createElement';

export default {
  createSoundButton() {
    const soundButton = createElement(buttonLayout);
    return soundButton;
  },
  changeButtonImage({ button, soundOn }) {
    button.querySelector('img').src = soundOn ? soundImage : noSoundImage;
  },
};
