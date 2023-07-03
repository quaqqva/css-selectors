import BaseComponent from '../base-component';
import { Tags } from '../../types/dom-types';

enum CSSInputClasses {
  CSSInput = 'css-input',
}
export default class CSSInput extends BaseComponent<HTMLInputElement> {
  private static ELEMENT_PARAMS = {
    tag: Tags.Input,
    classes: [CSSInputClasses.CSSInput],
    attributes: {
      type: 'text',
    },
  };

  public constructor(parent: Node | BaseComponent<HTMLElement>) {
    super({ ...CSSInput.ELEMENT_PARAMS, parent });
  }

  public get text() {
    return this.element.value;
  }
}
