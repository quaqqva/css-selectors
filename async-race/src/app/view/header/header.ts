import { Tags } from '../../../types/dom-types';
import DOMComponent, { ElementParameters } from '../../../components/base-component';
import ToggleInput from '../../../components/checkbox-input/toggle-input/toggle-input';

enum HeaderClasses {
  Header = 'header',
}

export default class Header extends DOMComponent<HTMLElement> {
  private static ELEMENT_PARAMS: ElementParameters = {
    tag: Tags.Header,
    classes: [HeaderClasses.Header],
  };

  private viewOptions: [string, string] = ['garage', 'winners'];

  private viewsSwitch: ToggleInput;

  public constructor(parent?: DOMComponent<HTMLElement>) {
    super({ ...Header.ELEMENT_PARAMS, parent });
    this.viewsSwitch = new ToggleInput({ options: this.viewOptions, parent: this });
  }
}
