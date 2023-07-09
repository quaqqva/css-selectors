import BaseComponent from '../base-component';
import { ElementParameters } from '../../types/default';
import { PetElement } from '../../app/model/level-data';
import { Events, Tags } from '../../types/dom-types';
import FakeComponent from './fake-component';
import HighlightableComponent from '../highlight/highlightable';
import { MarkupClasses } from '../../types/markup-classes';
import MarkupText from '../highlight/markup-text';

export default class Pet extends BaseComponent<HTMLDivElement> {
  private fakeMarkupParams: PetElement;

  private markupText: MarkupText | null;

  public children: Pet[];

  public constructor(fakeMarkup: PetElement, markup?: Partial<ElementParameters>) {
    super(markup || Pet.createMarkup(fakeMarkup));
    this.fakeMarkupParams = fakeMarkup;
    this.markupText = null;

    this.children = fakeMarkup.children?.map((petData) => new Pet(petData)) || [];
    this.append(...this.children);
  }

  public get fakeComponent(): [FakeComponent, Map<FakeComponent, Pet>] {
    const component = new FakeComponent(this.fakeMarkupParams);
    const map = component.mapComponents(this.children);
    map.set(component, this);
    return [component, map];
  }

  public getMarkup(
    indentLevel: number,
    appearingTextPlaceholder: BaseComponent<HTMLElement>
  ): HighlightableComponent<HTMLSpanElement> {
    const component = new BaseComponent(this.fakeMarkupParams);
    const componentHTML = component.HTML.replace(/<\/.+>/, '');
    const componentHTMLClosing = `</${this.fakeMarkupParams.tag}>`;

    let indents = '';
    for (let i = 0; i < indentLevel; i += 1) indents += '  ';

    const resultComponent = new HighlightableComponent<HTMLSpanElement>({
      tag: Tags.Span,
      textContent: `${indents}${componentHTML}`,
      classes: [MarkupClasses.Element],
    });
    resultComponent.addText('\n');
    if (this.fakeMarkupParams.children)
      resultComponent.append(...this.children.map((pet) => pet.getMarkup(indentLevel + 1, appearingTextPlaceholder)));
    resultComponent.addText(`${indents}${componentHTMLClosing}\n`);

    const highlightHandler = (event: Event) => {
      event.stopPropagation();
      resultComponent.addClass(MarkupClasses.SpanHighlighted);
      this.addClass(MarkupClasses.PlaygroundElementHighlighted);

      if (this.markupText) this.markupText.addClass(MarkupClasses.TextElementVisible);
      else {
        const { x, y } = this.element.getBoundingClientRect();
        this.markupText = new MarkupText(componentHTML + componentHTMLClosing, { x, y }, appearingTextPlaceholder);
        this.markupText.show();
      }
    };
    resultComponent.addEventListener(Events.MouseOver, highlightHandler);
    this.addEventListener(Events.MouseOver, highlightHandler);

    const removeHighlightHandler = () => {
      resultComponent.removeClass(MarkupClasses.SpanHighlighted);
      this.removeClass(MarkupClasses.PlaygroundElementHighlighted);
      this.markupText?.hide();
    };
    resultComponent.addEventListener(Events.MouseOut, removeHighlightHandler);
    this.addEventListener(Events.MouseOut, removeHighlightHandler);
    return resultComponent;
  }

  private static createMarkup(data: PetElement): Partial<ElementParameters> {
    const classes = JSON.parse(JSON.stringify(data.classes || []));
    classes.push(data.tag);
    const markup: Partial<ElementParameters> = {
      tag: Tags.Div,
      classes,
      attributes: data.attributes,
    };
    return markup;
  }
}
