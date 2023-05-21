import UserMenu from '../components/playground-menu';

export default function setupMenu() {
  const menu = new UserMenu();
  document.querySelector('main').prepend(menu.layout);
}
