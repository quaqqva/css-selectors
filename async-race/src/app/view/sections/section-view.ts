import DOMComponent from '../../../components/base-component';
import EventEmitter from '../../../utils/event-emitter';
import { CarFullData } from '../../model/car-full';

export default abstract class SectionView {
  protected emitter: EventEmitter;

  protected container: DOMComponent<HTMLElement>;

  protected page: number;

  public get section() {
    return this.container;
  }

  public abstract get carsPerPage(): number;

  public get currentPage(): number {
    return this.page;
  }

  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    this.emitter = emitter;
    this.container = container;
    this.page = 1;
  }

  public abstract drawCars(cars: CarFullData[]): void;
}
