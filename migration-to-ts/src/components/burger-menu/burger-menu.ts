import './menu-styles.scss';
import buttonLayout from './button-layout.html';

export default class BurgerMenu {
  private showButton: HTMLButtonElement;
  private menuElement: HTMLDivElement;
  private backgroundElement: HTMLDivElement;
  private isHidden: boolean;
  private static TRANSITION_TIME = 500;
  private static ADD_DELAY = 5;

  public constructor() {
    this.isHidden = true;

    const template = document.createElement('template');
    template.insertAdjacentHTML('afterbegin', buttonLayout);
    this.showButton = template.firstChild as HTMLButtonElement;
    this.showButton.addEventListener('click', () => {
      if (this.isHidden) this.showMenu();
      else this.hideMenu();
    });
    document.querySelector('header')?.append(this.showButton);

    this.backgroundElement = document.createElement('div');
    this.backgroundElement.classList.add('burger-menu__background');
    this.backgroundElement.addEventListener('click', () => {
      this.hideMenu();
    });

    this.menuElement = document.createElement('div');
    this.menuElement.classList.add('burger-menu');
  }

  public addElement(element: HTMLElement | DocumentFragment): void {
    this.menuElement.append(element);
  }

  public clearElements(): void {
    this.menuElement.innerHTML = '';
  }

  public showMenu(): void {
    if (!this.isHidden) return;
    const topCoord = `${document.documentElement.scrollTop}px`;
    this.backgroundElement.style.top = topCoord;
    this.menuElement.style.top = topCoord;
    document.body.append(this.backgroundElement);
    document.body.append(this.menuElement);
    document.body.classList.add('no-scroll');
    this.isHidden = false;
    setTimeout(() => {
      this.showButton.classList.add('header__burger-menu_shown');
      this.backgroundElement.classList.add('burger-menu__background_show');
      this.menuElement.classList.add('burger-menu_shown');
    }, BurgerMenu.ADD_DELAY);
  }

  public hideMenu(): void {
    if (this.isHidden) return;
    document.body.classList.remove('no-scroll');
    this.backgroundElement.classList.remove('burger-menu__background_show');
    this.menuElement.classList.remove('burger-menu_shown');
    this.showButton.classList.remove('header__burger-menu_shown');
    this.isHidden = true;
    setTimeout(() => {
      document.body.removeChild(this.backgroundElement);
      document.body.removeChild(this.menuElement);
    }, BurgerMenu.TRANSITION_TIME);
  }
}
