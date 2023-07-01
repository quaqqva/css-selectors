import BaseComponent from '../components/base-component';

export type DefaultCallback = () => void;

export type ElementParameters = {
  tag: string;
  textContent: string;
  classes: string[];
  attributes: { [attribute: string]: string };
  parent: Node | BaseComponent<HTMLElement>;
};
