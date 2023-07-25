import DOMComponent from '../../components/base-component';
import Slider from '../../components/slider/slider';
import { Tags } from '../../types/dom-types';
import EventEmitter from '../../utils/event-emitter';
import { CarFullData } from '../model/car-full';
import AppViews from './app-views';
import footer from './footer/footer';
import Header from './header/header';
import GarageView from './sections/garage/garage-view';
import SectionView from './sections/section-view';
import WinnersView from './sections/winners/winners-view';
import colorPalette from './color-palette.html';
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

  public currentSection: AppViews;

  public constructor({ appTitle, emitter }: { appTitle: string; emitter: EventEmitter }) {
    document.title = appTitle;

    this.emitter = emitter;

    this.slider = new Slider({ parent: this.initializeBody() });
    this.slider.addClass(ViewSections.SectionSlider);

    this.currentSection = AppViews.GarageView;
    this.sections = new Map<AppViews, SectionView>();
    DOMComponent.fromElement(document.body).append(DOMComponent.fromHTML(colorPalette));
  }

  public get carsPerPage(): number {
    const currentSection = this.sections.get(this.currentSection);
    return currentSection ? currentSection.carsPerPage : -1;
  }

  public get currentPage(): number {
    return this.sections.get(this.currentSection)?.currentPage || -1;
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

  public drawCars(cars: CarFullData[]): void {
    this.sections.get(this.currentSection)?.drawCars(cars);
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
