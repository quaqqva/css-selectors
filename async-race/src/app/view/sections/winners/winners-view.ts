import DOMComponent from '../../../../components/base-component';
import EventEmitter from '../../../../utils/event-emitter';
import { CarFullData } from '../../../model/car-full';
import SectionView from '../section-view';
import WinnersTable from './winners-table';

export default class WinnersView extends SectionView {
  private static CARS_PER_PAGE = 10;

  private table: WinnersTable;

  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    super(emitter, container);
    this.table = new WinnersTable(WinnersView.CARS_PER_PAGE);
  }

  public get carsPerPage(): number {
    return WinnersView.CARS_PER_PAGE;
  }

  protected drawCars(cars: CarFullData[]): void {
    this.table.addCars(cars, this.currentPage);
  }

  protected alertNoData(): void {
    this.table.destroy();
    super.alertNoData();
  }

  protected removeNoDataMessage(): void {
    super.removeNoDataMessage();
    this.container.append(this.table);
  }
}
