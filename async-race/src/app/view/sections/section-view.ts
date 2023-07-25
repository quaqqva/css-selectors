import DOMComponent, { ElementParameters } from '../../../components/base-component';
import { Tags } from '../../../types/dom-types';
import EventEmitter from '../../../utils/event-emitter';
import { CarFullData } from '../../model/car-full';

enum SectionElements {
  NoDataMessage = 'section__no-data',
}
export default abstract class SectionView {
  private static NO_DATA_PARAMS: ElementParameters = {
    tag: Tags.Heading2,
    classes: [SectionElements.NoDataMessage],
    textContent: 'No data avaliable',
  };

  protected emitter: EventEmitter;

  protected container: DOMComponent<HTMLElement>;

  protected page: number;

  private noDataMessage: DOMComponent<HTMLHeadingElement>;

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

    this.noDataMessage = new DOMComponent<HTMLHeadingElement>(SectionView.NO_DATA_PARAMS);
  }

  public drawData(cars: CarFullData[]): void {
    if (cars.length) {
      this.removeNoDataMessage();
      this.drawCars(cars);
    } else {
      this.alertNoData();
    }
  }

  protected abstract drawCars(cars: CarFullData[]): void;

  protected alertNoData(): void {
    this.container.append(this.noDataMessage);
  }

  protected removeNoDataMessage(): void {
    this.noDataMessage.destroy();
  }
}
