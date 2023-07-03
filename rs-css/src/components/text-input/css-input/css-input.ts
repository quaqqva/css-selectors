import { DefaultCallback } from '../../../types/default';
import { Events, Tags } from '../../../types/dom-types';
import EventEmitter from '../../../utils/event-emitter';
import BaseComponent from '../../base-component';
import TextInput from '../text-input';

enum CSSInputClasses {
  Wrapper = 'css-input',
  CSSInput = 'css-input__input',
  EnterButton = 'css-input__enter',
}

export default class CSSInput extends BaseComponent<HTMLDivElement> {
  private static ELEMENT_PARAMS = {
    classes: [CSSInputClasses.Wrapper],
  };

  private static INPUT_PARAMS = {
    classes: [CSSInputClasses.CSSInput],
    attributes: {
      placeholder: '/*Type in selector*/',
    },
  };

  private static BUTTON_PARAMS = {
    tag: Tags.Button,
    classes: [CSSInputClasses.EnterButton],
    textContent: 'Enter',
  };

  public static INPUT_EVENT = 'selector-input';

  private input: TextInput;

  private enterButton: BaseComponent<HTMLButtonElement>;

  public constructor({ parent, emitter }: { parent: BaseComponent<HTMLElement>; emitter: EventEmitter }) {
    super({ ...CSSInput.ELEMENT_PARAMS, parent });

    this.input = new TextInput({ ...CSSInput.INPUT_PARAMS, parent: this });
    this.enterButton = new BaseComponent<HTMLButtonElement>({ ...CSSInput.BUTTON_PARAMS, parent: this });

    const enterHandler: DefaultCallback = () => {
      emitter.emit(CSSInput.INPUT_EVENT, this.input.text);
    };

    this.input.addEnterListener(enterHandler);
    this.enterButton.addEventListener(Events.Click, enterHandler);
  }
}
