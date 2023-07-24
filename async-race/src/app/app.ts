import Controller from './controller/controller';
import EventEmitter from '../utils/event-emitter';
import AppEvents from './app-events';
import AppView from './view/app-view';
import AppViews from './view/app-views';
import { CarFullData } from './model/car-full';
import { Car, CarViewData } from './model/car';
import { EngineStatus } from './model/drive';

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
    this.addEventHandlers();
  }

  private addEventHandlers(): void {
    const handlers = {
      [AppEvents.SwitchView]: () => {
        this.switchView();
      },
      [AppEvents.CarCreate]: async (carViewData: unknown) => {
        const car = await this.controller.createCar(carViewData as CarViewData);
        this.emitter.emit(AppEvents.CarCreated, car);
      },
      [AppEvents.CarUpdate]: async (carData: unknown) => {
        const updatedCar = await this.controller.updateCar(carData as Car);
        this.emitter.emit(AppEvents.CarUpdated, updatedCar);
      },
      [AppEvents.CarDelete]: async (carId: unknown) => {
        await this.controller.deleteCar(carId as number);
        this.emitter.emit(AppEvents.CarDeleted, carId);
      },
      [AppEvents.CarsPageLoad]: async (pageNumber: unknown) => {
        this.loadPage(pageNumber as number);
      },
      [AppEvents.GenerateCars]: async (carsCount: unknown) => {
        await this.controller.createRandomCars(carsCount as number);
        this.emitter.emit(AppEvents.CarsGenerated, null);
      },
      [AppEvents.CarToggleEngine]: async (requestData: unknown) => {
        const { id, engineStatus } = requestData as {
          id: number;
          engineStatus: EngineStatus.Started | EngineStatus.Stopped;
        };
        const driveData = await this.controller.toggleEngine({ carId: id, engineStatus });
        this.emitter.emit(AppEvents.CarEngineToggled, { id, engineStatus, driveData });
      },
      [AppEvents.RequestCarDrive]: async (id: unknown) => {
        const isDriving = await this.controller.switchToDrive(id as number);
        this.emitter.emit(AppEvents.ResponseCarDrive, { id, isDriving });
      },
    };
    this.emitter.addHandlers(handlers);
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
