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

  public showPets(animation: AnimationParams): void {
    this.pets.forEach((pet) => pet.showAnimation(animation));
  }

  public highlightTargets(targetSelector: string, bodyEnviroment: BaseComponent<HTMLElement>): void {
    const fakeComponent = new FakeComponent({ tag: this.name });
    bodyEnviroment.append(fakeComponent);

    const petComponents = this.pets.map((pet) => pet.fakeComponent);

    const fakePets = petComponents.map((component) => component[0]);
    const componentsMap: Map<FakeComponent, Pet> = new Map(petComponents.map((component) => [...component[1]]).flat());

    fakeComponent.append(...fakePets);

    const searchCallback = (fakePet: FakeComponent) => {
      const pet = componentsMap.get(fakePet);
      if (fakePet.checkSelectorMatch(targetSelector) && pet) pet.addClass(FurnitureClasses.Target);
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
