import headerLayout from './header-layout.html';
import BaseComponent from '../base-component';
import { Tags, Events } from '../../types/dom-types';
import './header-styles.scss';
import SideMenu from '../side-menu/side-menu';

enum HeaderClasses {
  Header = 'header',
  MenuButton = 'header__open-menu',
}
export default class Header extends BaseComponent<HTMLElement> {
  private static ELEMENT_PARAMS = {
    tag: Tags.Header,
    classes: [HeaderClasses.Header],
  };

  private static MENU_BUTTON_PARAMS = {
    tag: Tags.Button,
    classes: [HeaderClasses.MenuButton],
    textContent: 'open menu',
  };

  public constructor() {
    super(Header.ELEMENT_PARAMS);
    this.element.innerHTML = headerLayout;
  }

  public addMenuButton(menu: SideMenu): void {
    const menuButton = new BaseComponent<HTMLButtonElement>({ ...Header.MENU_BUTTON_PARAMS, parent: this });
    menuButton.addEventListener(Events.Click, () => {
      menu.show();
    });
  }
}
