import DOMComponent, { ElementParameters } from '../../../components/base-component';
import Menu from '../../../components/menu/menu';
import Modal from '../../../components/modals/base-modal';
import EventEmitter from '../../../utils/event-emitter';
import AppEvents from '../../app-events';
import SectionView from './section-view';

enum GarageClassess {
  GarageMenu = 'garage__menu',
  MenuAddButton = 'garage-menu__add',
  MenuGenerateButton = 'garage-menu__generate',
  MenuRaceButton = 'garage-menu__race',
  MenuResetButton = 'garage-menu__reset',
}
export default class GarageView extends SectionView {
  private static MENU_PARAMS: ElementParameters = {
    classes: [GarageClassess.GarageMenu],
  };

  private static RANDOM_CARS_COUNT = 100;

  private menu: DOMComponent<HTMLDivElement>;

  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    super(emitter, container);

    this.menu = this.createMenu();
  }

  private createMenu(): Menu {
    const params: ElementParameters = {
      ...GarageView.MENU_PARAMS,
      parent: this.container,
    };

    const buttonTexts = ['Add new', `Generate ${GarageView.RANDOM_CARS_COUNT}`, 'Race', 'Reset'];
    const clickHandlers = [
      () => {
        const inputModal = new Modal({});
        inputModal.show();
      }, // Adding new
      () => {
        this.emitter.emit(AppEvents.GenerateCars, GarageView.RANDOM_CARS_COUNT);
      },
      () => {
        this.launchRace();
      },
      () => {
        this.resetRace();
      },
    ];

    const menu = new Menu({ params, buttonTexts, clickHandlers });
    menu.forEachButton((button, index) => {
      switch (index) {
        case 0:
          button.addClass(GarageClassess.MenuAddButton);
          break;
        case 1:
          button.addClass(GarageClassess.MenuGenerateButton);
          break;
        case 2:
          button.addClass(GarageClassess.MenuRaceButton);
          break;
        case 3:
          button.addClass(GarageClassess.MenuResetButton);
          break;
        default:
          break;
      }
    });
    return menu;
  }

  private launchRace(): void {}

  private resetRace(): void {}
}
