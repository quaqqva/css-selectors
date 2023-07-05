import { ElementParameters } from '../../types/default';
import { AnimationParams, Tags } from '../../types/dom-types';
import BaseComponent from '../base-component';
import Pet from '../pet/pet';
import HighlightableComponent from '../highlight/highlightable';

enum FurnitureClasses {
  Markup = 'markup',
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

  public override append(...elements: Pet[]): void {
    super.append(...elements);
    this.pets.push(...elements);
  }

  public override clear(): void {
    super.clear();
    this.pets = [];
  }
}
