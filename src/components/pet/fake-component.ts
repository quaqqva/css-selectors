import { PetElement } from '../../app/model/level-data';
import BaseComponent from '../base-component';
import Pet from './pet';

export default class FakeComponent extends BaseComponent<HTMLElement> {
  private children: FakeComponent[];

  public constructor(markupParams: PetElement) {
    super(markupParams);

    this.children = markupParams.children?.map((child) => new FakeComponent(child)) || [];
    this.append(...this.children);
  }

  public forEachChild(callback: (child: FakeComponent) => void): void {
    this.children.forEach((child) => callback(child));
  }

  public mapComponents(realChildren: Pet[]): Map<FakeComponent, Pet> {
    let componentsMap = new Map<FakeComponent, Pet>();

    this.children.forEach((child, index) => {
      componentsMap.set(child, realChildren[index]);
      componentsMap = new Map([...componentsMap, ...child.mapComponents(realChildren[index].children)]);
    });

    return componentsMap;
  }
}
