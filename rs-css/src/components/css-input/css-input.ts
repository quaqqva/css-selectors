import BaseComponent from '../base-component';

export default class CSSInput extends BaseComponent<HTMLInputElement> {
  private static ELEMENT_PARAMS = {
    tag: 'input',
    classes: ['css-input'],
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
