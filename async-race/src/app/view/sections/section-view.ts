import DOMComponent from '../../../components/base-component';
import EventEmitter from '../../../utils/event-emitter';

export default class SectionView {
  protected emitter: EventEmitter;

  protected container: DOMComponent<HTMLElement> | null;

  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    this.emitter = emitter;
    this.container = container || null;
  }
}
