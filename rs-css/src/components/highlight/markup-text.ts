import { Tags } from '../../types/dom-types/enums';
import { MarkupClasses } from '../../types/markup-classes';
import BaseComponent from '../base-component';
import HighlightableComponent from './highlightable';

type Position = {
  x: number;
  y: number;
};

export default class MarkupText extends BaseComponent<HTMLDivElement> {
  private text: HighlightableComponent<HTMLSpanElement>;

  private static ELEMENT_PARAMS = {
    classList: [MarkupClasses.TextElement],
  };

  private static TEXT_PARAMS = {
    tag: Tags.Code,
    classList: [MarkupClasses.Element],
  };

  private static OFFSET = 75;

  public constructor(textContent: string, parentPosition: Position, parent: BaseComponent<HTMLElement>) {
    super({ ...MarkupText.ELEMENT_PARAMS, parent });
    this.text = new HighlightableComponent<HTMLSpanElement>({ ...MarkupText.TEXT_PARAMS, parent: this, textContent });

    const headerHeight = 75;
    this.element.style.top = `${Math.max(parentPosition.y - MarkupText.OFFSET, headerHeight)}px`;
    this.element.style.left = `${Math.max(
      0,
      Math.min(
        parentPosition.x - MarkupText.OFFSET,
        document.body.offsetWidth - this.element.offsetWidth - MarkupText.OFFSET / 2
      )
    )}px`;
  }

  public show(): void {
    queueMicrotask(() => {
      this.addClass(MarkupClasses.TextElementVisible);
    });
  }

  public hide(): void {
    this.removeClass(MarkupClasses.TextElementVisible);
  }
}
