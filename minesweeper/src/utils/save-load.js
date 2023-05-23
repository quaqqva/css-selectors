import showModalInfo from './info-modal';

export default {
  saveGame({ field, menu }) {
    if (!field.won && !field.lost) {
      const { mines } = field;
      const buttons = field.field.map((row) => row.map((button) => ({ disabled: button.disabled, flagged: button.innerHTML.includes('img'), content: button.innerHTML })));
      const seconds = menu.secondsCounter.value;
      const clicks = menu.clicksCounter.value;
      const state = JSON.stringify({
        mines, buttons, seconds, clicks,
      });
      localStorage.setItem('minesweeper-save', state);
      showModalInfo({ title: 'Succeed', text: 'Game was saved successfully' });
    } else showModalInfo({ title: 'Not avaliable', text: 'You can\'t save finished game' });
  },

  saveIsPresent() {
    const state = JSON.parse(localStorage.getItem('minesweeper-save'));
    return state !== null;
  },

  loadGame({
    field, menu, successHandler, errorHandler,
  }) {
    const state = JSON.parse(localStorage.getItem('minesweeper-save'));
    if (state) {
      field.loadState({ mines: state.mines, buttons: state.buttons });
      document.querySelector('.minefield').replaceWith(field.layout);
      menu.clicksCounter.setValue(state.clicks);
      menu.secondsCounter.setValue(state.seconds);
      menu.flagsCounter.setValue(state.mines.length
    - state.buttons.reduce((sum, row) => sum + row.filter((button) => button.flagged).length, 0));
      menu.resetEmoji();
      successHandler();
      return true;
    }
    errorHandler();
    return false;
  },
};
