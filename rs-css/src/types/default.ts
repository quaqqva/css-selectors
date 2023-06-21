import BaseComponent from '../components/base-component';

export type MarkupParameters = {
  tag: string;
  textContent?: string;
  classes?: string[];
  attributes?: Map<string, string>;
  parent?: Node | BaseComponent<HTMLElement>;
};

export type DefaultCallback = () => void;
