import AppController from '../controller/controller';
import AppView from '../view/appView';

export default class App {
  private controller: AppController;
  private view: AppView;

  public constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    document.body.addEventListener('click', (e: MouseEvent) =>
      this.controller.getNews(e, (data) => this.view.drawNews(data))
    );
    this.controller.getSources((data) => this.view.drawSources(data));
  }
}
