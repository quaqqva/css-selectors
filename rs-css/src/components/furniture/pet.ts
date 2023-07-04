import BaseComponent from '../base-component';
import { ElementParameters } from '../../types/default';
import { PetElement } from '../../app/model/level-data';
import { Tags } from '../../types/dom-types';

export default class Pet extends BaseComponent<HTMLDivElement> {
  private fakeMarkupParams: PetElement;

  private static createMarkup(data: PetElement): Partial<ElementParameters> {
    const classes = structuredClone(data.classes) || [];
    classes.push(data.tag);
    if (data.id) classes.push(data.id);
    const markup: Partial<ElementParameters> = {
      tag: Tags.Div,
      classes,
      attributes: data.attributes,
    };
    return markup;
  }

  public constructor(fakeMarkup: PetElement, markup?: Partial<ElementParameters>) {
    super(markup || Pet.createMarkup(fakeMarkup));
    this.fakeMarkupParams = fakeMarkup;
  }

  public getMarkup(indentLevel: number): BaseComponent<HTMLSpanElement> {
    const component = new BaseComponent(this.fakeMarkupParams);
    const componentHTML = component.HTML.replace(/<\/.+>/, '');

    let indents = '';
    for (let i = 0; i < indentLevel; i += 1) indents += '  ';

    const resultComponent = new BaseComponent<HTMLSpanElement>({
      tag: Tags.Span,
      textContent: `${indents}${componentHTML}`,
    });

    resultComponent.addText('\n');

    if (this.fakeMarkupParams.children)
      resultComponent.append(
        ...this.fakeMarkupParams.children.map((child) => new Pet(child, child).getMarkup(indentLevel + 1))
      );

    resultComponent.addText(`${indents}</${this.fakeMarkupParams.tag}>\n`);
    return resultComponent;
  }
}
