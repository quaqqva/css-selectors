import { DefaultCallback, ElementParameters } from '../../types/default';
import { Events } from '../../types/dom-types';
import BaseComponent from '../base-component';

export default class DragNDropComponent<T extends HTMLElement> extends BaseComponent<T> {
  private static MIN_BOTTOM_HEIGHT = 100;

  private static CLASS_NAME = 'draggable';

  private shiftX: number;

  private shiftY: number;

  public constructor(params: Partial<ElementParameters>) {
    super(params);
    this.addClass(DragNDropComponent.CLASS_NAME);

    this.shiftX = 0;
    this.shiftY = 0;

    this.element.ondragstart = () => false;

    this.addEventListener(Events.MouseDown, (event) => {
      const mouseEvent = event as MouseEvent;
      this.shiftX = mouseEvent.clientX - this.element.getBoundingClientRect().left;
      this.shiftY = mouseEvent.clientY - this.element.getBoundingClientRect().top;

      this.element.style.position = 'absolute';

      const mouseMoveHandler: (event: Event) => void = (event) => {
        const mouseEvent = event as MouseEvent;
        this.moveAt(mouseEvent.pageX, mouseEvent.pageY);
      };

      const mouseUpHandler: DefaultCallback = () => {
        this.element.removeEventListener(Events.MouseMove, mouseMoveHandler);
        this.element.removeEventListener(Events.MouseUp, mouseUpHandler);
      };

      this.addEventListener(Events.MouseMove, mouseMoveHandler);
      this.addEventListener(Events.MouseUp, mouseUpHandler);
    });
  }

  private moveAt(x: number, y: number): void {
    const top = Math.min(
      Math.max(0, y - this.shiftY),
      document.body.scrollHeight + DragNDropComponent.MIN_BOTTOM_HEIGHT
    );
    const left = Math.min(Math.max(0, x - this.shiftX), document.body.offsetWidth - this.element.offsetWidth);
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
  }
}
