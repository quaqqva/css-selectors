import headerLayout from './header-layout.html';
import BaseComponent from '../base-component';
import './header-styles.scss';

export default class Header extends BaseComponent<HTMLElement> {
  private static ELEMENT_PARAMS = {
    tag: 'header',
    classes: ['header'],
  };
  //TODO: Add side menu support (pass it as argument and add button)
  public constructor() {
    super(Header.ELEMENT_PARAMS);
    this.element.innerHTML = headerLayout;
  }
}
