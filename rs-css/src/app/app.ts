import AppController from './controller/controller';
import AppView from './view/view';

export default class App {
  private controller: AppController;

  private view: AppView;

  public constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    this.controller.loadLevel(0, (level) => this.view.drawLevel(level));
  }
}
