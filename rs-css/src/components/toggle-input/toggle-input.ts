import { DefaultCallback } from '../../types/default';
import { Events, Tags } from '../../types/dom-types';
import BaseComponent from '../base-component';
import './toggle-input-styles.scss';

enum ToggleInputClasses {
  ToggleInput = 'toggle-input',
  Checkbox = 'toggle-input__checkbox',
  SwitchButton = 'toggle-input__button',
  Label = 'toggle-input__description-label',
}

export default class ToggleInput extends BaseComponent<HTMLDivElement> {
  private static ELEMENT_PARAMS = {
    classes: [ToggleInputClasses.ToggleInput],
  };

  private static CHECKBOX_PARAMS = {
    tag: Tags.Input,
    classes: [ToggleInputClasses.Checkbox],
    attributes: {
      type: 'checkbox',
    },
  };

  private static SWITCH_BUTTON_PARAMS = {
    tag: Tags.Div,
    classes: [ToggleInputClasses.SwitchButton],
  };

  private static LABEL_PARAMS = {
    tag: Tags.Label,
    classes: [ToggleInputClasses.Label],
  };

  private checkbox: BaseComponent<HTMLInputElement>;

  private label: BaseComponent<HTMLLabelElement>;

  private button: BaseComponent<HTMLDivElement>;

  public constructor({ description, parent }: { description: string; parent?: BaseComponent<HTMLElement> }) {
    super({ ...ToggleInput.ELEMENT_PARAMS, parent });
    this.checkbox = new BaseComponent<HTMLInputElement>({ ...ToggleInput.CHECKBOX_PARAMS, parent: this });
    this.button = new BaseComponent<HTMLDivElement>({
      ...ToggleInput.SWITCH_BUTTON_PARAMS,
      parent: this,
    });
    this.label = new BaseComponent<HTMLLabelElement>({
      ...ToggleInput.LABEL_PARAMS,
      textContent: description,
      parent,
    });
  }

  public addInputListener(handler: DefaultCallback): void {
    this.checkbox.addEventListener(Events.Input, handler);
  }
}
