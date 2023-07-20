import { Tags } from '../../types/dom-types';
import DOMComponent, { ElementParameters } from '../base-component';

enum SliderClasses {
  SliderWrapper = 'slider-wrapper',
  Slider = 'slider',
}
export default class Slider extends DOMComponent<HTMLDivElement> {
  private static WRAPPER_PARAMS: ElementParameters = {
    tag: Tags.Div,
    classes: [SliderClasses.SliderWrapper],
  };

  private static SLIDER_PARAMS: ElementParameters = {
    tag: Tags.Div,
    classes: [SliderClasses.Slider],
  };

  private components: DOMComponent<HTMLElement>[];

  public constructor(parent?: DOMComponent<HTMLElement>) {
    super(Slider.SLIDER_PARAMS);

    const wrapper = new DOMComponent<HTMLDivElement>({ ...Slider.WRAPPER_PARAMS, parent });
    wrapper.append(this);

    this.components = [];
  }

  public override append(...elements: DOMComponent<HTMLElement>[]): void {
    super.append(...elements);
    this.components.push(...elements);
  }

  public slideTo(component: DOMComponent<HTMLElement>): void {
    const index = this.components.indexOf(component);
    if (index === -1) throw Error('No such element in slider');
    const translate = (index / this.components.length) * 100;
    this.element.style.transform = `translateX(${translate}%)`;
  }
}
