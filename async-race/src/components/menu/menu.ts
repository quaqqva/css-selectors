import { Events, Tags } from '../../types/dom-types';
import DOMComponent, { ElementParameters } from '../base-component';

export default class Menu extends DOMComponent<HTMLDivElement> {
  private buttons: DOMComponent<HTMLButtonElement>[];

  private clickHandlers: (() => void)[];

  public constructor({
    params,
    buttonTexts,
    clickHandlers,
  }: {
    params: ElementParameters;
    buttonTexts: string[];
    clickHandlers: (() => void)[];
  }) {
    super(params);
    this.buttons = buttonTexts.map(
      (buttonText) =>
        new DOMComponent<HTMLButtonElement>({
          tag: Tags.Button,
          textContent: buttonText,
          parent: this,
        })
    );
    this.clickHandlers = clickHandlers;

    this.addEventListener(Events.Click, (event) => {
      const clicked = event.target;
      if (clicked instanceof HTMLButtonElement) {
        const index = Array.prototype.indexOf.call(clicked.parentElement?.children, clicked);
        this.clickHandlers[index]();
      }
    });
  }

  public addButton({ buttonText, callback }: { buttonText: string; callback: () => void }): void {
    this.append(
      new DOMComponent<HTMLButtonElement>({
        tag: Tags.Button,
        textContent: buttonText,
      })
    );
    this.clickHandlers.push(callback);
  }

  public forEachButton(callback: (button: DOMComponent<HTMLButtonElement>, index: number) => void): void {
    this.buttons.forEach((button, index) => {
      callback(button, index);
    });
  }
}
