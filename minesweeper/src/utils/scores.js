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
    let modalContent = `
    <table class='scores-modal__content'>
      <thead>
        <tr>
          <td>Result</td>
          <td>Difficulty</td>
          <td>Mines Count</td>
          <td>Time (s)</td>
          <td>Clicks</td>
        </tr>
      </thead>
      <tbody>`;
    if (!highscores) modalContent = '<span class="info-modal__content">No data avaliable</span>';
    else {
      highscores.forEach((record) => {
        modalContent += `<tr class=${record.result.toLowerCase()}>`;
        modalContent += `<td>${record.result}</td>`;
        modalContent += `<td>${record.difficulty}</td>`;
        modalContent += `<td>${record.minesCount}</td>`;
        modalContent += `<td>${record.time}</td>`;
        modalContent += `<td>${record.clicks}</td>`;
        modalContent += '</tr>';
      });
      modalContent += '</tbody></table>';
    }
    modalContent += '<button class="info-modal__ok-button">OK</button>';
    const scoresModal = new Modal({
      title: 'Highscores',
      content: modalContent,
      blockClose: false,
    });
    scoresModal.modalElement.classList.add('scores-modal');
    scoresModal.modalElement.querySelector('button').addEventListener('click', () => scoresModal.close());
    scoresModal.showTransform = '10vh';
    scoresModal.show();
  },
};
