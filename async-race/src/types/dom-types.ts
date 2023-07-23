export enum Tags {
  Button = 'button',
  Span = 'span',
  Div = 'div',
  Paragraph = 'p',
  Body = 'body',
  Header = 'header',
  Main = 'main',
  Footer = 'footer',
  Section = 'section',
  Input = 'input',
  Icon = 'i',
  Template = 'template',
  Heading1 = 'h1',
  Heading2 = 'h2',
  Heading3 = 'h3',
  Label = 'label',
  Code = 'code',
  Form = 'form',
}

export enum Events {
  Click = 'click',
  Input = 'input',
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',
  MouseMove = 'mousemove',
  KeyDown = 'keydown',
  MouseOver = 'mouseover',
  MouseOut = 'mouseout',
  Submit = 'submit',
}

export enum InsertPositions {
  Before = 'beforebegin',
  Prepend = 'afterbegin',
  Append = 'beforeend',
  After = 'afterend',
}

export type AnimationParams = {
  name: string;
  duration: number;
  timingFunction?: string;
  repeatCount?: number;
};

export enum InputTypes {
  Text = 'text',
  Checkbox = 'checkbox',
  Submit = 'submit',
  Color = 'color',
}

export enum NodeTypes {
  ElementNode = 1,
  AttributeNode,
  TextNode,
}
