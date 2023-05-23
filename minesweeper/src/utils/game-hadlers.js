import showModalInfo from './info-modal';
import scoresFuncs from './scores';

const { writeScore } = scoresFuncs;

function getDifficulty(field) {
  let difficulty = 'Easy';
  if (field.size === 15) difficulty = 'Medium';
  if (field.size === 20) difficulty = 'Hard';
  return difficulty;
}

export default function addGameHandlers({ menu, field }) {
  const winHandler = () => {
    showModalInfo({ title: 'Hooray!', text: `You found all mines in ${menu.secondsCounter.value} seconds and ${menu.clicksCounter.value} moves!` });
    writeScore(
      {
        result: 'Win', difficulty: getDifficulty(field), minesCount: field.mineCount, clicks: menu.clicksCounter.value, time: menu.secondsCounter.value,
      },
    );
  };
  document.body.addEventListener(field.WIN, winHandler);

  const loseHandler = () => {
    showModalInfo({ title: 'You Lose :(', text: 'Game over. Try again' });
    writeScore(
      {
        result: 'Lose', difficulty: getDifficulty(field), minesCount: field.mineCount, clicks: menu.clicksCounter.value, time: menu.secondsCounter.value,
      },
    );
  };
  document.body.addEventListener(field.LOSE, loseHandler);
  return () => {
    document.body.removeEventListener(field.WIN, winHandler);
    document.body.removeEventListener(field.LOSE, loseHandler);
  };
}
