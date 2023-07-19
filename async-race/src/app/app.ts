import Controller from './controller/controller';
import GarageController from './controller/garage-controller';
import WinnersController from './controller/winners-controller';
import EventEmitter from '../utils/event-emitter';
import AppEvents from './app-events';
import AppView from './view/app-view';
import AppViews from './view/app-views';

export default class App {
  view: AppView;

  controller: Controller;

  emitter: EventEmitter;

  public constructor() {
    this.emitter = new EventEmitter();
    this.view = new AppView({ emitter: this.emitter, startView: AppViews.GarageView });
    this.controller = new GarageController();
  }

  public start(): void {
    this.emitter.subscribe(AppEvents.SwitchView, () => {
      this.switchView();
    });
  }

  private switchView(): void {
    const isGarage = this.controller instanceof GarageController;
    this.view.switchTo(isGarage ? AppViews.WinnersView : AppViews.GarageView);
    this.controller = isGarage ? new WinnersController() : new GarageController();
  }
}
