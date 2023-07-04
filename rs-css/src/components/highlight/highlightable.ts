import { ElementParameters } from '../../types/default';
import BaseComponent from '../base-component';
import './highlight-theme.scss';

type Replacer = (match: string) => string;

enum HighlightClasses {
  TagSpan = 'tag-highlight',
  AttributeSpan = 'attribute-highlight',
  ValueSpan = 'value-highlight',
}

export default class HighlightableComponent<T extends HTMLElement> extends BaseComponent<T> {
  public constructor(params: Partial<ElementParameters>) {
    super(params);
    this.highlight();
  }

  public override addText(text: string): void {
    super.addText(text);
    this.highlight();
  }

  public override set textContent(value: string) {
    this.element.innerText = value;
    this.highlight();
  }

  public override append(...elements: (HTMLElement | BaseComponent<HTMLElement>)[]): void {
    super.append(...elements);
    this.highlight();
  }

  private highlight(): void {
    const content = this.element.innerText;
    if (content.includes('<')) this.element.innerHTML = this.highlightHTML();
  }

  private highlightHTML(): string {
    const content = this.element.innerText;
    console.log(content);
    const tagReplacer: Replacer = (tag) => {
      const components = tag.split(' ');
      let tagName = components[0];

      let rest = components.slice(1).join(' ');
      rest = rest.substring(0, rest.length - 1);
      if (rest) rest = ' ' + rest;

      const isClosing = tagName.includes('/');

      if (tagName.includes('>')) tagName = tagName.substring(1, tagName.length - 1);
      else tagName = tagName.substring(1);
      if (isClosing) tagName = tagName.substring(1);

      return `&lt;${isClosing ? '/' : ''}<span class="${HighlightClasses.TagSpan}">${tagName}</span>${rest}&gt;`;
    };

    const attributeValueReplacer: Replacer = (attributeValue) => {
      if (attributeValue === `class="${HighlightClasses.TagSpan}"`) return attributeValue;
      const [attribute, value] = attributeValue.split('=');
      return `<span class="${HighlightClasses.AttributeSpan}">${attribute}</span>=<span class="${HighlightClasses.ValueSpan}">${value}</span>`;
    };

    return content.replace(/<[^<]+>/g, tagReplacer).replace(/\w+="\w+"/g, attributeValueReplacer);
  }
}
