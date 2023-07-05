import { DefaultCallback, ElementParameters } from '../../types/default';
import { Events, Tags } from '../../types/dom-types';
import BaseComponent from '../base-component';

export default class TextInput extends BaseComponent<HTMLInputElement> {
  private static DEFAULT_PARAMS = {
    tag: Tags.Input,
    attributes: {
      type: 'text',
    },
  };

  public constructor(params: Partial<ElementParameters>) {
    super({ ...TextInput.DEFAULT_PARAMS, ...params });
  }

  public get text(): string {
    return this.element.value;
  }

  public set text(value: string) {
    this.element.value = value;
  }

  public addEnterListener(handler: DefaultCallback): void {
    this.addEventListener(Events.KeyDown, (event) => {
      const keyEvent = event as KeyboardEvent;
      if (keyEvent.key === 'Enter') handler();
    });
  }

  public focus(): void {
    this.element.focus();
  }
}
