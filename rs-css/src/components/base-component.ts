type ComponentParameters = {
  tag: string;
  textContent?: string;
  classes?: string[];
  attributes?: Map<string, string>;
  parentNode?: Node;
};

export default class BaseComponent {
  private element: HTMLElement;

  public static From(html: string): BaseComponent {
    const template = document.createElement('template');
    template.insertAdjacentHTML('afterbegin', html);
    const element = template.firstChild as HTMLElement;
    const component = new BaseComponent({ tag: element.tagName });
    component.element = element;
    return component;
  }

  public constructor({ tag = 'div', textContent, classes, attributes, parentNode }: ComponentParameters) {
    this.element = document.createElement(tag);

    if (textContent) this.element.innerText = textContent;

    if (classes) this.addClass(...classes);

    if (attributes) {
      for (const attribute in attributes) this.setAttribute(attribute, attributes.get(attribute) as string);
    }

    if (parentNode) parentNode.appendChild(this.element);
  }

  public append(...elements: (HTMLElement | BaseComponent)[]): void {
    elements.forEach((element) => {
      if (element instanceof BaseComponent) this.element.append(element.element);
      else this.element.append(element);
    });
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

  public destroy(): void {
    this.element.remove();
  }
}
