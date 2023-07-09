import { ElementParameters } from '../../types/default';
import BaseComponent from '../base-component';
import wrapInSpan from '../../utils/wrap-in-span';
import './highlight-theme.scss';
import { NodeTypes } from '../../types/dom-types';

type Replacer = (match: string) => string;

enum HighlightClasses {
  TagSpan = 'html-tag-highlight',
  AttributeSpan = 'attribute-highlight',
  ValueSpan = 'value-highlight',
  IdSpan = 'css-id-highlight',
  BracketSpan = 'css-bracket-highlight',
  ClassSpan = 'css-class-highlight',
  PseudoSpan = 'css-pseudo-highlight',
  TagContent = 'tag-content',
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
    if (content.includes('<')) this.highlightHTML();
    else this.element.innerHTML = this.highlightCSS();
  }

  private highlightHTML(): void {
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

    this.element.childNodes.forEach((node) => {
      if (node.nodeType === NodeTypes.TextNode) {
        const content = node.textContent;
        if (content) {
          let newHTML = content.replace(/<[^<]+>/g, tagReplacer).replace(/(\w|-)+="(\w|-)+"/g, attributeValueReplacer);
          newHTML = `<span>${newHTML}</span>`;
          const newComponent = BaseComponent.FromHTML(newHTML);
          newComponent.addClass(HighlightClasses.TagContent);
          newComponent.insertBeforeNode(node);
          node.remove();
        }
      }
    });
  }

  private highlightCSS(): string {
    const content = this.element.innerText;

    const attributeValueReplacer: Replacer = (attributeValue) => {
      const [attribute, value] = attributeValue.split('=');
      return `${wrapInSpan(attribute, HighlightClasses.AttributeSpan)}=${wrapInSpan(
        value,
        HighlightClasses.ValueSpan
      )}`;
    };

    const cropReplacer = (wrapClass: HighlightClasses, match: string) => {
      let cropped = match;
      const lastSymbol = cropped[cropped.length - 1];
      if (lastSymbol === '.' || lastSymbol === '[' || lastSymbol === ':')
        cropped = cropped.substring(0, cropped.length - 1);
      return wrapInSpan(cropped, wrapClass);
    };

    const idReplacer: Replacer = cropReplacer.bind(null, HighlightClasses.IdSpan);
    const classReplacer: Replacer = cropReplacer.bind(null, HighlightClasses.ClassSpan);
    const pseudoReplacer: Replacer = cropReplacer.bind(null, HighlightClasses.PseudoSpan);

    const bracketReplacer: Replacer = (bracket) => wrapInSpan(bracket, HighlightClasses.BracketSpan);

    return content
      .replace(/(\w|-)+="(\w|-)+"/g, attributeValueReplacer)
      .replace(/#\w+(\.|\[|:)?/g, idReplacer)
      .replace(/\[|\]/g, bracketReplacer)
      .replace(/\.(\w|-)+(\.|\[|:)?/g, classReplacer)
      .replace(/::?(\w|-)+(\.|\[|:)?/g, pseudoReplacer);
  }
}
