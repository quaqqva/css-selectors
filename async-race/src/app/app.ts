import Controller from './controller/controller';
import GarageController from './controller/garage-controller';
import WinnersController from './controller/winners-controller';

import View from './view/view';
import GarageView from './view/garage-view';
import WinnersView from './view/winners-view';
import EventEmitter from '../utils/event-emitter';
import { AppEvents } from './app-events';

export default class App {
  view: View;

  controller: Controller;

  emitter: EventEmitter;

  public constructor() {
    this.emitter = new EventEmitter();
    this.view = new GarageView();
    this.controller = new GarageController();
  }

  public start(): void {
    this.emitter.subscribe(AppEvents.SwitchView, () => {
      this.switchView();
    });
  }

  private switchView(): void {
    const isGarage: boolean = this.view instanceof GarageView;
    this.view = isGarage ? new WinnersView() : new GarageView();
    this.controller = isGarage ? new WinnersController() : new GarageController();
  }
}
