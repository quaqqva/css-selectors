import DOMComponent, { ElementParameters } from '../../../components/base-component';
import Menu from '../../../components/menu/menu';
import { Tags } from '../../../types/dom-types';
import FontAwesome from '../../../types/font-awesome';
import EventEmitter from '../../../utils/event-emitter';
import AppEvents from '../../app-events';
import { CarFullData } from '../../model/car-full';

enum SectionElements {
  NoDataMessage = 'section__no-data',
  PageTitle = 'section__page-title',
  Navigation = 'section__navigation',
  NavigationButton = 'navigation__button',
}
export default abstract class SectionView {
  private static NO_DATA_PARAMS: ElementParameters = {
    tag: Tags.Heading2,
    classes: [SectionElements.NoDataMessage],
    textContent: 'No data avaliable',
  };

  private static PAGE_TITLE_PARAMS: ElementParameters = {
    tag: Tags.Heading2,
    classes: [SectionElements.PageTitle],
  };

  private static NAVIGATION_PARAMS: ElementParameters = {
    classes: [SectionElements.Navigation],
  };

  private static LEFT_NAV_BUTTON_INDEX = 0;

  private static RIGHT_NAV_BUTTON_INDEX = 1;

  private static BUTTON_ACTIVE_TRANSITION = 300;

  protected emitter: EventEmitter;

  protected container: DOMComponent<HTMLElement>;

  protected page: number;

  private noDataMessage: DOMComponent<HTMLHeadingElement>;

  private pageTitle: DOMComponent<HTMLHeadingElement>;

  protected totalCarCount: number;

  public get section() {
    return this.container;
  }

  public abstract get carsPerPage(): number;

  private navigation: Menu;

  public get currentPage(): number {
    return this.page;
  }

  private get totalPageCount(): number {
    return Math.ceil(this.totalCarCount / this.carsPerPage);
  }

  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    this.emitter = emitter;
    this.container = container;

    this.page = 1;
    this.totalCarCount = 0;
    this.navigation = this.createNavigation();

    this.noDataMessage = new DOMComponent<HTMLHeadingElement>(SectionView.NO_DATA_PARAMS);
    this.pageTitle = new DOMComponent<HTMLHeadingElement>({ ...SectionView.PAGE_TITLE_PARAMS, parent: this.container });
  }

  public drawData(cars: CarFullData[]): void {
    this.requestTotalCount();
    this.navigation.destroy();
    if (cars.length) {
      this.removeNoDataMessage();
      this.drawCars(cars);

      this.container.append(this.navigation);
    } else {
      this.pageTitle.textContent = '';
      this.alertNoData();
    }
  }

  protected abstract drawCars(cars: CarFullData[]): void;

  protected requestPage(): void {
    this.emitter.emit(AppEvents.PageLoad, this.currentPage);
  }

  protected alertNoData(): void {
    this.container.append(this.noDataMessage);
  }

  protected removeNoDataMessage(): void {
    this.noDataMessage.destroy();
  }

  protected updatePageTitle(): void {
    this.pageTitle.textContent = `Page ${this.page} of ${this.totalPageCount}\nTotal: ${this.totalCarCount} cars`;
  }

  private requestTotalCount(): void {
    const responseHandler = (count: unknown) => {
      this.totalCarCount = count as number;
      if (this.totalPageCount === 1) this.navigation.disableButton(SectionView.RIGHT_NAV_BUTTON_INDEX);
      else if (this.page !== this.totalPageCount) this.navigation.enableButton(SectionView.RIGHT_NAV_BUTTON_INDEX);

      this.updatePageTitle();
      this.emitter.unsubscribe(AppEvents.ResponseTotalCars, responseHandler);
    };
    this.emitter.subscribe(AppEvents.ResponseTotalCars, responseHandler);
    this.emitter.emit(AppEvents.RequestTotalCars, null);
  }

  private createNavigation(): Menu {
    const menu = new Menu({
      params: SectionView.NAVIGATION_PARAMS,
      buttonTexts: ['', ''],
      clickHandlers: [() => this.switchToPreviousPage(), () => this.switchToNextPage()],
      buttonClasses: [SectionElements.NavigationButton, SectionElements.NavigationButton],
    });

    menu.disableButton(SectionView.LEFT_NAV_BUTTON_INDEX);

    menu.getButton(SectionView.LEFT_NAV_BUTTON_INDEX).append(
      new DOMComponent<HTMLElement>({
        tag: Tags.Icon,
        classes: [FontAwesome.Solid, FontAwesome.LessThan],
      })
    );

    menu.getButton(SectionView.RIGHT_NAV_BUTTON_INDEX).append(
      new DOMComponent<HTMLElement>({
        tag: Tags.Icon,
        classes: [FontAwesome.Solid, FontAwesome.GreaterThan],
      })
    );

    return menu;
  }

  private switchToPreviousPage(): void {
    this.page -= 1;
    setTimeout(() => {
      this.requestPage();
    }, SectionView.BUTTON_ACTIVE_TRANSITION);

    if (this.page === 1) this.navigation.disableButton(SectionView.LEFT_NAV_BUTTON_INDEX);
    this.navigation.enableButton(SectionView.RIGHT_NAV_BUTTON_INDEX);
  }

  private switchToNextPage(): void {
    this.page += 1;
    setTimeout(() => {
      this.requestPage();
    }, SectionView.BUTTON_ACTIVE_TRANSITION);

    if (this.page === this.totalPageCount) this.navigation.disableButton(SectionView.RIGHT_NAV_BUTTON_INDEX);
    this.navigation.enableButton(SectionView.LEFT_NAV_BUTTON_INDEX);
  }
}
