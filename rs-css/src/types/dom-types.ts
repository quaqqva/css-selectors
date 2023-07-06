export enum Tags {
  Button = 'button',
  Span = 'span',
  Div = 'div',
  Paragraph = 'p',
  Body = 'body',
  Header = 'header',
  Main = 'main',
  Footer = 'footer',
  Input = 'input',
  Icon = 'i',
  Template = 'template',
  Heading1 = 'h1',
  Heading2 = 'h2',
  Heading3 = 'h3',
  Label = 'label',
  Code = 'code',
}

export enum Events {
  Click = 'click',
  Input = 'input',
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',
  MouseMove = 'mousemove',
  KeyDown = 'keydown',
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
