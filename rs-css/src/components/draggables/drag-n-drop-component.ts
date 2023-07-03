import { DefaultCallback } from '../../types/default';
import { Events, Tags } from '../../types/dom-types';
import { FontAwesome } from '../../types/font-awesome';
import BaseComponent from '../base-component';
import './drag-n-drop-styles.scss';

enum DragNDropClasses {
  WRAPPER = 'draggable',
  TopPanel = 'draggable__panel',
  MinimizeButton = 'draggable__minimize',
  Content = 'draggable__content',
  ContentMinimized = 'draggable__content_minimized',
}
export default class DragNDropComponent extends BaseComponent<HTMLDivElement> {
  private static WRAPPER_PARAMS = {
    classes: [DragNDropClasses.WRAPPER],
  };

  private static TOP_PANEL_PARAMS = {
    classes: [DragNDropClasses.TopPanel],
  };

  private static CONTENT_PARAMS = {
    classes: [DragNDropClasses.Content],
  };

  private static MINIMIZE_BUTTON_PARAMS = {
    tag: Tags.Icon,
    classes: [DragNDropClasses.MinimizeButton, FontAwesome.Regular, FontAwesome.WindowMinimize],
  };

  private static MIN_BOTTOM_HEIGHT = 100;

  private shiftX: number;

  private shiftY: number;

  private panel: BaseComponent<HTMLDivElement>;

  private contentWrapper: BaseComponent<HTMLDivElement>;

  public constructor(parent: BaseComponent<HTMLElement>) {
    super({ ...DragNDropComponent.WRAPPER_PARAMS, parent });
    this.shiftX = 0;
    this.shiftY = 0;
    this.addDragHandler();

    this.panel = new BaseComponent<HTMLDivElement>({ ...DragNDropComponent.TOP_PANEL_PARAMS, parent: this.element });
    this.addMinimizeButton();
    this.contentWrapper = new BaseComponent<HTMLDivElement>({
      ...DragNDropComponent.CONTENT_PARAMS,
      parent: this.element,
    });
  }

  private addDragHandler(): void {
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
        this.removeEventListener(Events.MouseMove, mouseMoveHandler);
        this.removeEventListener(Events.MouseUp, mouseUpHandler);
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

  private addMinimizeButton(): void {
    const minimizeButton = new BaseComponent<HTMLElement>({
      ...DragNDropComponent.MINIMIZE_BUTTON_PARAMS,
      parent: this.panel,
    });
    const minimizeHandler: DefaultCallback = () => {
      this.contentWrapper.addClass(DragNDropClasses.ContentMinimized);
      minimizeButton.removeEventListener(Events.Click, minimizeHandler);
      minimizeButton.addEventListener(Events.Click, maximizeHandler);
      minimizeButton.addClass(FontAwesome.WindowMaximize);
      minimizeButton.removeClass(FontAwesome.WindowMinimize);
    };
    const maximizeHandler: DefaultCallback = () => {
      this.contentWrapper.removeClass(DragNDropClasses.ContentMinimized);
      minimizeButton.removeEventListener(Events.Click, maximizeHandler);
      minimizeButton.addEventListener(Events.Click, minimizeHandler);
      minimizeButton.removeClass(FontAwesome.WindowMaximize);
      minimizeButton.addClass(FontAwesome.WindowMinimize);
    };
    minimizeButton.addEventListener(Events.Click, minimizeHandler);
  }

  public override append(...elements: (HTMLElement | BaseComponent<HTMLElement>)[]): void {
    this.contentWrapper.append(...elements);
  }
}
