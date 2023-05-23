import Modal from '../components/modal';

export default function showModalInfo({ title, text }) {
  const modalContent = `
    <span class="info-modal__content">${text}</span>
    <button class="info-modal__ok-button">OK</button>
  `;
  const infoModal = new Modal({
    title,
    content: modalContent,
    blockClose: false,
  });
  infoModal.modalElement.classList.add('info-modal');
  infoModal.modalElement.querySelector('button').addEventListener('click', () => {
    infoModal.close();
  });
  infoModal.show();
}
