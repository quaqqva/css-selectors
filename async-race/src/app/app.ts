import Controller from './controller/controller';
import EventEmitter from '../utils/event-emitter';
import AppEvents from './app-events';
import AppView from './view/app-view';
import AppViews from './view/app-views';

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

  public start(): void {
    this.view.switchTo(this.currentView);
    this.emitter.subscribe(AppEvents.SwitchView, () => {
      this.switchView();
    });
  }

  private switchView(): void {
    this.currentView = this.currentView === AppViews.GarageView ? AppViews.WinnersView : AppViews.GarageView;
    this.view.switchTo(this.currentView);
  }
}
