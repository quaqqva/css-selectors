import TableComponent from '../../../../components/table-component';
import { CarFullData } from '../../../model/car-full';
import CarImage from '../../car';

export default class WinnersTable extends TableComponent {
  private static COLUMN_NAMES = ['number', 'car', 'name', 'wins', 'best time(s)'];

  private static CLASS_NAME = 'winners-table';

  private carsPerPage: number;

  public constructor(carsPerPage: number) {
    super(WinnersTable.COLUMN_NAMES);
    this.addClass(WinnersTable.CLASS_NAME);
    this.carsPerPage = carsPerPage;
  }

  public addCars(cars: CarFullData[], pageNum: number) {
    this.clearRows();

    const startNumber = (pageNum - 1) * this.carsPerPage + 1;
    cars.forEach((car, index) => {
      const carImage = new CarImage();
      carImage.setColor(car.color);

      const row = [(startNumber + index).toString(), carImage, car.name, car.wins.toString(), car.time.toString()];
      this.addRow(row);
    });
  }
}
