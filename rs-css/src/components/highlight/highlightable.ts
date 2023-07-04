import { ElementParameters } from '../../types/default';
import BaseComponent from '../base-component';
import wrapInSpan from '../../utils/wrap-in-span';
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
    this.element.innerHTML = content.includes('<') ? this.highlightHTML() : this.highlightCSS();
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

      return `&lt;${isClosing ? '/' : ''}${wrapInSpan(tagName, HighlightClasses.TagSpan)}${rest}&gt;`;
    };

    const attributeValueReplacer: Replacer = (attributeValue) => {
      if (attributeValue === `class="${HighlightClasses.TagSpan}"`) return attributeValue;
      const [attribute, value] = attributeValue.split('=');
      return `${wrapInSpan(attribute, HighlightClasses.AttributeSpan)}=${wrapInSpan(
        value,
        HighlightClasses.ValueSpan
      )}`;
    };

    return content.replace(/<[^<]+>/g, tagReplacer).replace(/\w+="\w+"/g, attributeValueReplacer);
  }

  private highlightCSS(): string {
    const content = this.element.innerText;

    return content;
  }
}
