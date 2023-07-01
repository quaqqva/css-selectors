import headerLayout from './header-layout.html';
import BaseComponent from '../base-component';
import { Tags } from '../../types/dom-types';
import './header-styles.scss';

enum HeaderClasses {
  Header = 'header',
}
export default class Header extends BaseComponent<HTMLElement> {
  private static ELEMENT_PARAMS = {
    tag: Tags.Header,
    classes: [HeaderClasses.Header],
  };
  //TODO: Add side menu support (pass it as argument and add button)
  public constructor() {
    super(Header.ELEMENT_PARAMS);
    this.element.innerHTML = headerLayout;
  }
}
