import Controller from './controller/controller';
import EventEmitter from '../utils/event-emitter';
import AppEvents from './app-events';
import AppView from './view/app-view';
import AppViews from './view/app-views';
import { CarFullData } from './model/car-full';
import { Car, CarViewData } from './model/car';

export type AppConfig = {
  title: string;
  connection: {
    url: string;
  };
};
export class App {
  view: AppView;

  controller: Controller;

  emitter: EventEmitter;

  public constructor(config: AppConfig) {
    this.emitter = new EventEmitter();
    this.view = new AppView({ appTitle: config.title, emitter: this.emitter });
    this.controller = new Controller(config.connection.url);
  }

  public async start(): Promise<void> {
    this.view.switchTo(AppViews.GarageView);
    this.loadPage(1);

    this.emitter.subscribe(AppEvents.SwitchView, () => {
      this.switchView();
    });

    this.emitter.subscribe(AppEvents.CarCreate, async (carViewData) => {
      const car = await this.controller.createCar(carViewData as CarViewData);
      this.emitter.emit(AppEvents.CarCreated, car);
    });

    this.emitter.subscribe(AppEvents.CarUpdate, async (carData) => {
      const updatedCar = await this.controller.updateCar(carData as Car);
      this.emitter.emit(AppEvents.CarUpdated, updatedCar);
    });

    this.emitter.subscribe(AppEvents.CarDelete, async (carId) => {
      await this.controller.deleteCar(carId as number);
      this.emitter.emit(AppEvents.CarDeleted, carId);
    });

    this.emitter.subscribe(AppEvents.CarsPageLoad, async (pageNumber) => {
      this.loadPage(pageNumber as number);
    });

    this.emitter.subscribe(AppEvents.GenerateCars, async (carsCount) => {
      await this.controller.createRandomCars(carsCount as number);
      this.emitter.emit(AppEvents.CarsGenerated, null);
    });
  }

  private async loadPage(pageNumber: number): Promise<void> {
    if (this.view.currentSection === AppViews.GarageView) {
      const carsPage = await this.controller.getCars({ pageNum: pageNumber, carsPerPage: this.view.carsPerPage });
      this.view.drawCars(carsPage as CarFullData[]);
    }
  }

  private switchView(): void {
    this.view.switchTo(this.view.currentSection === AppViews.GarageView ? AppViews.WinnersView : AppViews.GarageView);
  }
}
