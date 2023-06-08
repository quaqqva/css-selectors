import { Tags } from '../../../types/dom-types/enums';
import BaseComponent from '../../base-component';
import DragNDropComponent from '../drag-n-drop-component';
import './line-styles.scss';

enum HTMLViewClasses {
  Element = 'html-wrapper',
  LinesWrapper = 'html-wrapper__lines',
  LineNumber = 'html-wrapper-lines__number',
}

export default class HTMLView extends DragNDropComponent {
  private static PANEL_TITLE = 'index.html';

  private static LINES_VIEW_PARAMS = {
    classList: [HTMLViewClasses.LinesWrapper],
  };

  private static LINE_ELEMENTS_PARAMS = {
    tag: Tags.Span,
    classList: [HTMLViewClasses.LineNumber],
  };

  private linesView: BaseComponent<HTMLDivElement>;
  private linesCount: number;

  public constructor(parent: BaseComponent<HTMLElement>) {
    super({ parent, panelTitle: HTMLView.PANEL_TITLE });
    this.addClass(HTMLViewClasses.Element);

    this.linesCount = 0;
    this.linesView = new BaseComponent<HTMLDivElement>(HTMLView.LINES_VIEW_PARAMS);
    this.append(this.linesView);
  }

  public override append(...elements: (HTMLElement | BaseComponent<HTMLElement>)[]): void {
    super.append(...elements);
    this.linesView.destroy();

    const textContent = this.contentWrapper.textContent;
    const newLines = textContent?.split('\n').length || 0;

    this.linesView.clear();
    for (let i = 1; i <= newLines; i += 1) {
      this.linesView.append(
        new BaseComponent<HTMLSpanElement>({
          ...HTMLView.LINE_ELEMENTS_PARAMS,
          textContent: `${i + this.linesCount}`,
        })
      );
    }
    super.append(this.linesView);
  }

  public override clear(): void {
    super.clear();
    this.linesCount = 0;
    this.linesView.clear();
  }
}
