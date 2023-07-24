import DOMComponent from '../../../components/base-component';
import EventEmitter from '../../../utils/event-emitter';
import { CarFullData } from '../../model/car-full';
import SectionView from './section-view';

export default class WinnersView extends SectionView {
  private static CARS_PER_PAGE = 10;

  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    super(emitter, container);
  }

  public get carsPerPage(): number {
    return WinnersView.CARS_PER_PAGE;
  }

  public drawCars(cars: CarFullData[]): void {
    cars.push();
  }
}
