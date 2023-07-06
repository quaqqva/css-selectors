import BaseComponent from '../base-component';
import { ElementParameters } from '../../types/default';
import { PetElement } from '../../app/model/level-data';
import { Tags, AnimationParams } from '../../types/dom-types';
import FakeComponent from './fake-component';

export default class Pet extends BaseComponent<HTMLDivElement> {
  private fakeMarkupParams: PetElement;

  public children: Pet[];

  private static createMarkup(data: PetElement): Partial<ElementParameters> {
    const classes = structuredClone(data.classes) || [];
    classes.push(data.tag);
    if (data.attributes && data.attributes['id']) classes.push(data.attributes['id']);
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

    this.children = fakeMarkup.children?.map((petData) => new Pet(petData)) || [];
    this.append(...this.children);
  }

  public get fakeComponent(): [FakeComponent, Map<FakeComponent, Pet>] {
    const component = new FakeComponent(this.fakeMarkupParams);
    const map = component.mapComponents(this.children);
    map.set(component, this);
    return [component, map];
  }

  public getMarkup(indentLevel: number): BaseComponent<HTMLSpanElement> {
    const [component] = this.fakeComponent;
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

  public showAnimation({ name, duration, timingFunction = 'ease-in-out' }: AnimationParams): void {
    this.element.style.transformOrigin = 'center';
    this.element.style.animation = `${name} ${duration}ms ${timingFunction}`;
    setTimeout(() => {
      this.element.style.animation = '';
      this.element.style.transformOrigin = '';
    }, duration);
  }
}
