export default function changeTheme(element) {
  element.classList.toggle('night');
  Array.from(element.children).forEach((child) => changeTheme(child));
}
