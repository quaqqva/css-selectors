import { Tags } from '../../../types/dom-types';
import DOMComponent, { ElementParameters } from '../../../components/base-component';

enum HeaderClasses {
  Header = 'header',
}

export default class Header extends DOMComponent<HTMLElement> {
  private static ELEMENT_PARAMS: ElementParameters = {
    tag: Tags.Header,
    classes: [HeaderClasses.Header],
  };

  public constructor(parent?: DOMComponent<HTMLElement>) {
    super({ ...Header.ELEMENT_PARAMS, parent });
  }
}
