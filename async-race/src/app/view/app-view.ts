import DOMComponent from '../../components/base-component';
import { Tags } from '../../types/dom-types';
import EventEmitter from '../../utils/event-emitter';
import AppViews from './app-views';
import footer from './footer/footer';
import Header from './header/header';
import GarageView from './sections/garage-view';
import SectionView from './sections/section-view';
import WinnersView from './sections/winners-view';

enum ViewSections {
  GarageSection = 'garage',
  WinnersSection = 'winners',
}

export default class AppView {
  private emitter: EventEmitter;

  private mainElement: DOMComponent<HTMLElement>;

  private sections: Map<AppViews, SectionView>;

  private currentSection: AppViews | undefined;

  public constructor({ emitter, startView }: { emitter: EventEmitter; startView: AppViews }) {
    this.emitter = emitter;

    this.mainElement = this.initializeBody();

    this.sections = new Map<AppViews, SectionView>();
    this.switchTo(startView);
  }

  public switchTo(viewType: AppViews): void {
    this.currentSection = viewType;
    let sectionView = this.sections.get(this.currentSection);

    if (!sectionView) {
      const viewContainer = new DOMComponent<HTMLElement>({
        tag: Tags.Section,
        parent: this.mainElement,
      });
      switch (this.currentSection) {
        case AppViews.GarageView:
          viewContainer.addClass(ViewSections.GarageSection);
          sectionView = new GarageView(this.emitter, viewContainer);
          break;
        case AppViews.WinnersView:
          viewContainer.addClass(ViewSections.WinnersSection);
          sectionView = new WinnersView(this.emitter, viewContainer);
          break;
        default:
          throw Error('View not supported');
      }
      this.sections.set(this.currentSection, sectionView);
    }
  }

  private initializeBody(): DOMComponent<HTMLElement> {
    const body = DOMComponent.fromElement(document.body);

    const header = new Header();
    body.append(header);

    const main = new DOMComponent({
      tag: Tags.Main,
      classes: [Tags.Main],
    });
    body.append(main);

    body.append(footer);

    return main;
  }
}
