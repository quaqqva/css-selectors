import { MarkupParameters } from '../types/default';

export default class BaseComponent<T extends HTMLElement> {
  protected element: T;

  public static From<T extends HTMLElement>(html: string): BaseComponent<T> {
    const template = document.createElement('template');
    template.insertAdjacentHTML('afterbegin', html);
    const element = template.firstChild as T;
    const component = new BaseComponent<T>({ tag: element.tagName });
    component.element = element;
    return component;
  }

  public constructor({ tag = 'div', textContent, classes, attributes, parent }: Partial<MarkupParameters>) {
    const candidate = document.createElement(tag);
    try {
      this.element = candidate as T;
    } catch (e: unknown) {
      throw Error('Error: wrong tag value passed');
    }

    if (textContent) this.element.innerText = textContent;

    if (classes) this.addClass(...classes);

    if (attributes) {
      for (const attribute in attributes) this.setAttribute(attribute, attributes.get(attribute) as string);
    }

    if (parent instanceof Node) parent.appendChild(this.element);
    if (parent instanceof BaseComponent) parent.append(this.element);
  }

  public get HTML(): string {
    return this.element.outerHTML;
  }

  public append(...elements: (HTMLElement | BaseComponent<HTMLElement>)[]): void {
    elements.forEach((element) => {
      if (element instanceof BaseComponent) this.element.append(element.element);
      else this.element.append(element);
    });
  }

  public clear(): void {
    this.element.innerHTML = '';
  }

  public addClass(...classNames: string[]): void {
    classNames.forEach((className) => this.element.classList.add(className));
  }

  public removeClass(...classNames: string[]): void {
    classNames.forEach((className) => this.element.classList.remove(className));
  }

  public setAttribute(attributeName: string, attributeValue: string): void {
    this.element.setAttribute(attributeName, attributeValue);
  }

  public removeAttribute(attributeName: string) {
    this.element.removeAttribute(attributeName);
  }

  public addEventListener(event: string, listener: (e: Event) => void) {
    this.element.addEventListener(event, listener);
  }

  public destroy(): void {
    this.element.remove();
  }
}
