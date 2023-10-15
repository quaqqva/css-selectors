import { InputTypes, Tags } from '../../types/dom-types/enums';
import BaseComponent from '../base-component';

export default class CheckboxComponent extends BaseComponent<HTMLInputElement> {
  private static ELEMENT_PARAMS = {
    tag: Tags.Input,
    attributes: {
      type: InputTypes.Checkbox,
    },
  };

  public constructor(parent: BaseComponent<HTMLElement>) {
    super({ ...CheckboxComponent.ELEMENT_PARAMS, parent });
  }

  public toggle(): void {
    this.element.checked = !this.element.checked;
  }
}
