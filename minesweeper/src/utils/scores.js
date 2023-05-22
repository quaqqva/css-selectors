import Modal from '../components/modal';

const RECORD_NAME = 'minesweeper-records';

export default {
  writeScore(record) {
    let prevScore = JSON.parse(localStorage.getItem(RECORD_NAME));
    if (!prevScore) prevScore = [record];
    else if (prevScore.length < 10) prevScore.push(record);
    else { prevScore.shift(); prevScore.push(record); }
    localStorage.setItem(RECORD_NAME, JSON.stringify(prevScore));
  },
  showScores() {
    const highscores = JSON.parse(localStorage.getItem(RECORD_NAME));
    console.log(highscores);
    let modalContent = `
    <table class='hightscores-modal__content'>
      <thead>
        <tr>
          <td>Result</td>
          <td>Difficulty</td>
          <td>Time (s)</td>
          <td>Clicks</td>
        </tr>
      </thead>
      <tbody>`;
    if (!highscores) modalContent = '<span class="highscores-modal__span">No data avaliable</span>';
    else {
      highscores.forEach((record) => {
        modalContent += '<tr>';
        modalContent += `<td>${record.result}</td>`;
        modalContent += `<td>${record.difficulty}</td>`;
        modalContent += `<td>${record.time}</td>`;
        modalContent += `<td>${record.clicks}</td>`;
        modalContent += '</tr>';
      });
      modalContent += '</tbody></table>';
    }
    modalContent += '<button class="modal__button">OK</button>';
    const scoresModal = new Modal({
      title: 'Highscores',
      content: modalContent,
      blockClose: false,
    });
    scoresModal.show();
  },
};
