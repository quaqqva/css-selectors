export default function createElement(html) {
  const template = document.createElement('template');
  template.insertAdjacentHTML('afterbegin', html);
  return template.firstChild;
}
