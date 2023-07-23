import DOMComponent, { ElementParameters } from '../../../../components/base-component';
import { Car } from '../../../model/car';
import trackSprite from '../../../../assets/img/track_sprite.svg';
import SVGComponent from '../../../../components/svg-component';
import { Tags } from '../../../../types/dom-types';
import Menu from '../../../../components/menu/menu';
import FontAwesome from '../../../../types/font-awesome';
import EventEmitter from '../../../../utils/event-emitter';
import SubmitCarModal from './submit-car-modal';
import ConfirmModal from '../../../../components/modals/confirm-modal';
import AppEvents from '../../../app-events';

enum TrackElements {
  Track = 'track',
  CarSVG = 'track__car',
  Flag = 'track__flag',
  Title = 'track__title',
  CarMenu = 'track__menu',
  UpdateButton = 'track__update-car',
  DeleteButton = 'track__delete-car',
  StartButton = 'track__start-engine',
  BreakButton = 'track__reset-car',
}

export default class Track extends DOMComponent<HTMLDivElement> {
  private static TRACK_PARAMS: ElementParameters = {
    classes: [TrackElements.Track],
  };

  private static TITLE_PARAMS: ElementParameters = {
    tag: Tags.Span,
    classes: [TrackElements.Title],
  };

  private static MENU_PARAMS: ElementParameters = {
    classes: [TrackElements.CarMenu],
  };

  private static DELETE_ICON_PARAMS: ElementParameters = {
    tag: Tags.Icon,
    classes: [FontAwesome.Solid, FontAwesome.Times],
  };

  private emitter: EventEmitter;

  private carSVG: SVGComponent;

  private flagSVG: SVGComponent;

  private carTitle: DOMComponent<HTMLSpanElement>;

  private car: Car;

  public constructor(emitter: EventEmitter, car: Car) {
    super(Track.TRACK_PARAMS);
    this.emitter = emitter;

    this.carSVG = new SVGComponent({ pathToSprite: trackSprite, id: 'car', parent: this });
    this.carSVG.addClass(TrackElements.CarSVG);
    this.carSVG.setColor(car.color);

    this.flagSVG = new SVGComponent({ pathToSprite: trackSprite, id: 'finish-flag', parent: this });
    this.flagSVG.addClass(TrackElements.Flag);

    this.carTitle = new DOMComponent({ ...Track.TITLE_PARAMS, textContent: car.name, parent: this });

    this.car = car;

    this.createMenu();
  }

  public updateCar(car: Car): void {
    this.car = car;
    this.carSVG.setColor(car.color);
    this.carTitle.textContent = car.name;
  }

  public startEngine(): void {}

  public resetCar(): void {}

  private createMenu(): void {
    const menu = new Menu({
      params: { ...Track.MENU_PARAMS, parent: this },
      buttonTexts: ['update', '', 'a', 'b'],
      buttonClasses: [
        TrackElements.UpdateButton,
        TrackElements.DeleteButton,
        TrackElements.StartButton,
        TrackElements.BreakButton,
      ],
      clickHandlers: [() => this.changeCar(), () => this.deleteCar(), () => this.startEngine(), () => this.resetCar()],
    });

    const deleteButtonIndex = 1;
    menu.getButton(deleteButtonIndex).append(new DOMComponent<HTMLElement>(Track.DELETE_ICON_PARAMS));
  }

  private changeCar(): void {
    const modal = new SubmitCarModal(this.emitter, this.car);
    modal.show();
  }

  private deleteCar(): void {
    const deleteText = `Are you sure you want to delete ${this.car.name}?`;
    const confirmModal = new ConfirmModal({
      params: {},
      info: deleteText,
      yesCallback: () => {
        this.emitter.emit(AppEvents.CarDelete, this.car.id);
      },
      noCallback: () => {},
    });
    confirmModal.show();
  }
}
