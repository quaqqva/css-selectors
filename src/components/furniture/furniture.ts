import { ElementParameters } from '../../types/default';
import { Events, Tags } from '../../types/dom-types/enums';
import BaseComponent from '../base-component';
import Pet from '../pet/pet';
import HighlightableComponent from '../highlight/highlightable';
import FakeComponent from '../pet/fake-component';
import { MarkupClasses } from '../../types/markup-classes';
import MarkupText from '../highlight/markup-text';
import { AnimationParams } from '../../types/dom-types/types';

enum FurnitureClasses {
  Markup = 'markup',
  Target = 'target',
}

type DOMEnviroment = {
  furnitureElement: FakeComponent;
  fakePets: FakeComponent[];
  petsMap: Map<FakeComponent, Pet>;
};

type SelectorEnviroment = {
  selector: string;
  body: BaseComponent<HTMLElement>;
};

export default class Furniture extends BaseComponent<HTMLDivElement> {
  private pets: Pet[];

  private name: string;

  private markupText: MarkupText | null;

  private static MARKUP_PARAMS = {
    tag: Tags.Code,
    classList: [FurnitureClasses.Markup],
  };

  public constructor(params: Partial<ElementParameters> & { name: string }) {
    super(params);
    this.name = params.name;
    this.pets = [];
    this.markupText = null;
  }

  public getMarkup(appearingTextPlaceholder: BaseComponent<HTMLElement>): HighlightableComponent<HTMLElement> {
    const markupComponent = new HighlightableComponent<HTMLElement>(Furniture.MARKUP_PARAMS);

    const spanElement = new HighlightableComponent<HTMLSpanElement>({
      tag: Tags.Span,
      classList: [MarkupClasses.Element],
    });
    spanElement.addText(`<${this.name}>\n`);
    spanElement.append(...this.pets.map((pet) => pet.getMarkup(1, appearingTextPlaceholder)));
    spanElement.addText(`</${this.name}>`);

    markupComponent.append(spanElement);

    const { x, y } = this.element.getBoundingClientRect();
    this.markupText = new MarkupText(`<${this.name}></${this.name}>`, { x, y }, appearingTextPlaceholder);

    const highlightHandler = () => {
      spanElement.addClass(MarkupClasses.SpanHighlighted);
      this.addClass(MarkupClasses.PlaygroundElementHighlighted);
      this.markupText?.show();
    };

    const removeHighlightHandler = () => {
      spanElement.removeClass(MarkupClasses.SpanHighlighted);
      this.removeClass(MarkupClasses.PlaygroundElementHighlighted);
      this.markupText?.hide();
    };

    spanElement.addEventListener(Events.MouseOver, highlightHandler);
    this.addEventListener(Events.MouseOver, highlightHandler);

    spanElement.addEventListener(Events.MouseOut, removeHighlightHandler);
    this.addEventListener(Events.MouseOut, removeHighlightHandler);
    return markupComponent;
  }

  public animatePets(animation: AnimationParams, selectorEnviroment?: SelectorEnviroment): void {
    if (!selectorEnviroment) this.pets.forEach((pet) => pet.showAnimation(animation));
    else {
      const { selector, body } = selectorEnviroment;
      this.searchForSelector(this.recreateEnvironment(body), selector, (element) => {
        element.showAnimation(animation);
      });
    }
  }

  public highlightTargets({ selector, body }: SelectorEnviroment): void {
    this.searchForSelector(this.recreateEnvironment(body), selector, (element) => {
      element.addClass(FurnitureClasses.Target);
    });
  }

  public override clear(): void {
    super.clear();
    this.pets = [];
  }

  private recreateEnvironment(bodyEnviroment: BaseComponent<HTMLElement>): DOMEnviroment {
    const fakeComponent = new FakeComponent({ tag: this.name });
    bodyEnviroment.append(fakeComponent);

    const petComponents = this.pets.map((pet) => pet.fakeComponent);

    const fakePets = petComponents.map((component) => component[0]);
    fakeComponent.append(...fakePets);

    const componentsMap = new Map(petComponents.map((component) => [...component[1]]).flat());
    return {
      furnitureElement: fakeComponent,
      fakePets,
      petsMap: componentsMap,
    };
  }

  private searchForSelector(
    enviroment: DOMEnviroment,
    selector: string,
    callback: (element: BaseComponent<HTMLElement>) => void
  ) {
    const { furnitureElement, fakePets, petsMap } = enviroment;
    if (furnitureElement.checkSelectorMatch(selector)) callback(this);
    const searchCallback = (fakePet: FakeComponent) => {
      const pet = petsMap.get(fakePet);
      if (fakePet.checkSelectorMatch(selector) && pet) callback(pet);
      fakePet.forEachChild((child) => searchCallback(child));
    };
    fakePets.forEach((fakePet) => searchCallback(fakePet));
  }

  public override append(...elements: Pet[]): void {
    super.append(...elements);
    this.pets.push(...elements);
  }
}
