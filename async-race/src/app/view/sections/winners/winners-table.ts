import TableComponent from '../../../../components/table-component';
import { CarFullData } from '../../../model/car-full';
import CarImage from '../../car';

enum WinnersTableElements {
  Table = 'winners-table',
  TableHidden = 'winners-table_hidden',
}
export default class WinnersTable extends TableComponent {
  private static PAGE_TRANSITION = 150;

  private static COLUMN_NAMES = ['number', 'car', 'name', 'wins', 'best time(s)'];

  private carsPerPage: number;

  public constructor(carsPerPage: number) {
    super(WinnersTable.COLUMN_NAMES);
    this.addClass(WinnersTableElements.Table);
    this.carsPerPage = carsPerPage;
  }

  public addCars(cars: CarFullData[], pageNum: number) {
    this.addClass(WinnersTableElements.TableHidden);
    setTimeout(() => {
      this.clearRows();

      const startNumber = (pageNum - 1) * this.carsPerPage + 1;
      cars.forEach((car, index) => {
        const carImage = new CarImage();
        carImage.setColor(car.color);

        const row = [(startNumber + index).toString(), carImage, car.name, car.wins.toString(), car.time.toString()];
        this.addRow(row);
      });
      this.removeClass(WinnersTableElements.TableHidden);
    }, WinnersTable.PAGE_TRANSITION);
  }
}
