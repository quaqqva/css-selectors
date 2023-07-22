import DOMComponent from '../../components/base-component';
import Slider from '../../components/slider/slider';
import { Tags } from '../../types/dom-types';
import EventEmitter from '../../utils/event-emitter';
import AppViews from './app-views';
import footer from './footer/footer';
import Header from './header/header';
import GarageView from './sections/garage-view';
import SectionView from './sections/section-view';
import WinnersView from './sections/winners-view';
import './styles/main.scss';

enum ViewSections {
  SectionSlider = 'section-slider',
  GarageSection = 'garage',
  WinnersSection = 'winners',
}

export default class AppView {
  private emitter: EventEmitter;

  private slider: Slider;

  private sections: Map<AppViews, SectionView>;

  private currentSection: AppViews | undefined;

  public constructor({ appTitle, emitter }: { appTitle: string; emitter: EventEmitter }) {
    document.title = appTitle;

    this.emitter = emitter;

    this.slider = new Slider(this.initializeBody());
    this.slider.addClass(ViewSections.SectionSlider);

    this.sections = new Map<AppViews, SectionView>();
  }

  public switchTo(viewType: AppViews): void {
    this.currentSection = viewType;
    let sectionView = this.sections.get(this.currentSection);

    if (!sectionView) {
      const viewContainer = new DOMComponent<HTMLElement>({
        tag: Tags.Section,
        parent: this.slider,
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

    this.slider.slideTo(sectionView.section);
  }

  private initializeBody(): DOMComponent<HTMLElement> {
    const body = DOMComponent.fromElement(document.body);

    const header = new Header({ emitter: this.emitter });
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
