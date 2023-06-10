import AppController from '../controller/controller';
import AppView from '../view/appView';
import findElement from '../../utils/find-element';

export default class App {
  private controller: AppController;
  private view: AppView;

  public constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    findElement<HTMLDivElement>({
      parent: document,
      selector: '.sources',
      callback: (sourcesView) => {
        sourcesView.addEventListener('click', (e: MouseEvent) => this.controller.getNews(e, (data) => this.view.drawNews(data)));
        this.controller.getSources((data) => this.view.drawSources(data));
      }
    })
  }
}
