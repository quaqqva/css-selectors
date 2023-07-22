import DOMComponent from '../../../components/base-component';
import EventEmitter from '../../../utils/event-emitter';
import SectionView from './section-view';

export default class WinnersView extends SectionView {
  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    super(emitter, container);
  }
}
