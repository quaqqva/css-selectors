import Controller from './controller/controller';
import EventEmitter from '../utils/event-emitter';
import AppEvents from './app-events';
import AppView from './view/app-view';
import AppViews from './view/app-views';
import { CarFullData } from './model/car-full';

export type AppConfig = {
  title: string;
  connection: {
    url: string;
  };
};
export class App {
  currentView: AppViews;

  view: AppView;

  controller: Controller;

  emitter: EventEmitter;

  public constructor(config: AppConfig) {
    this.emitter = new EventEmitter();
    this.currentView = AppViews.GarageView;
    this.view = new AppView({ appTitle: config.title, emitter: this.emitter });
    this.controller = new Controller(config.connection.url);
  }

  public async start(): Promise<void> {
    this.view.switchTo(this.currentView);
    const carsData = await this.controller.getCars({ pageNum: 1, carsPerPage: this.view.carsPerPage });
    this.view.drawCars(carsData as CarFullData[]);
    this.emitter.subscribe(AppEvents.SwitchView, () => {
      this.switchView();
    });
  }

  private switchView(): void {
    this.currentView = this.currentView === AppViews.GarageView ? AppViews.WinnersView : AppViews.GarageView;
    this.view.switchTo(this.currentView);
  }
}
