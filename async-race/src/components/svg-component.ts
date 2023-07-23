import { Tags } from '../types/dom-types';
import DOMComponent from './base-component';

export default class SVGComponent {
  private static ELEMENT_NAMESPACE = 'http://www.w3.org/2000/svg';

  private static ATTRIBUTE_NAMESPACE = 'http://www.w3.org/1999/xlink';

  private element: Element;

  private useElement: Element;

  public constructor({
    pathToSprite,
    id,
    parent,
  }: {
    pathToSprite: string;
    id: string;
    parent: DOMComponent<HTMLElement>;
  }) {
    this.element = document.createElementNS(SVGComponent.ELEMENT_NAMESPACE, Tags.SVG);
    this.useElement = document.createElementNS(SVGComponent.ELEMENT_NAMESPACE, Tags.SVGUse);
    this.useElement.setAttributeNS(SVGComponent.ATTRIBUTE_NAMESPACE, 'xlink:href', `${pathToSprite}#${id}`);
    this.element.append(this.useElement);
    parent.append(this.element);
  }

  public addClass(className: string): void {
    this.element.classList.add(className);
  }

  public setColor(color: string): void {
    (this.element as HTMLElement).style.setProperty('fill', color);
  }
}
