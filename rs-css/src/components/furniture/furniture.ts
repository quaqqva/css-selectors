import { ElementParameters } from '../../types/default';
import { AnimationParams, Tags } from '../../types/dom-types';
import BaseComponent from '../base-component';
import Pet from '../pet/pet';
import HighlightableComponent from '../highlight/highlightable';
import FakeComponent from '../pet/fake-component';

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

  private static MARKUP_PARAMS = {
    tag: Tags.Code,
    classes: [FurnitureClasses.Markup],
  };

  public constructor(params: Partial<ElementParameters> & { name: string }) {
    super(params);
    this.name = params.name;
    this.pets = [];
  }

  public getMarkup(): HighlightableComponent<HTMLElement> {
    const markupComponent = new HighlightableComponent<HTMLElement>(Furniture.MARKUP_PARAMS);
    markupComponent.addText(`<${this.name}>\n`);
    markupComponent.append(...this.pets.map((pet) => pet.getMarkup(1)));
    markupComponent.addText(`</${this.name}>`);
    return markupComponent;
  }

  public animatePets(animation: AnimationParams, selectorEnviroment?: SelectorEnviroment): void {
    if (!selectorEnviroment) this.pets.forEach((pet) => pet.showAnimation(animation));
    else {
      const { selector, body } = selectorEnviroment;
      this.searchForSelector(this.recreateEnviroment(body), selector, (element) => {
        element.showAnimation(animation);
      });
    }
  }

  public highlightTargets({ selector, body }: SelectorEnviroment): void {
    this.searchForSelector(this.recreateEnviroment(body), selector, (element) => {
      element.addClass(FurnitureClasses.Target);
    });
  }

  private recreateEnviroment(bodyEnviroment: BaseComponent<HTMLElement>): DOMEnviroment {
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

  public override clear(): void {
    super.clear();
    this.pets = [];
  }
}
