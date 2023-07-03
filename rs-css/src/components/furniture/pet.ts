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

  public getMarkup(): BaseComponent<HTMLSpanElement> {
    const fakeComponent = new BaseComponent(this.fakeMarkupParams);
    if (this.fakeMarkupParams.children)
      fakeComponent.append(...this.fakeMarkupParams.children.map((child) => new BaseComponent(child)));
    return new BaseComponent<HTMLSpanElement>({ tag: 'span', textContent: fakeComponent.HTML });
  }
}
