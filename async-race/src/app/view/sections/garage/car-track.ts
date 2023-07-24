import DOMComponent, { ElementParameters } from '../../../../components/base-component';
import { Car } from '../../../model/car';
import trackSprite from '../../../../assets/img/track_sprite.svg';
import SVGComponent from '../../../../components/svg-component';
import { AnimationFillMode, Events, Tags } from '../../../../types/dom-types';
import Menu from '../../../../components/menu/menu';
import FontAwesome from '../../../../types/font-awesome';
import EventEmitter from '../../../../utils/event-emitter';
import SubmitCarModal from './submit-car-modal';
import ConfirmModal from '../../../../components/modals/confirm-modal';
import AppEvents from '../../../app-events';
import { DriveData, EngineStatus } from '../../../model/drive';

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

  public static START_BUTTON_INDEX = 2;

  public static STOP_BUTTON_INDEX = 3;

  private static DELETE_ICON_PARAMS: ElementParameters = {
    tag: Tags.Icon,
    classes: [FontAwesome.Solid, FontAwesome.Times],
  };

  private static CAR_DRIVE_ANIMATION = 'car-drive';

  private static CAR_STOP_ANIMATION = 'car-stop';

  private static CAR_STOP_COORDS = '--car-stop-at'; // for CSS

  private static CAR_COLOR_VAR = '--car-color'; // for CSS

  private emitter: EventEmitter;

  private carSVG: SVGComponent;

  private flagSVG: SVGComponent;

  private carTitle: DOMComponent<HTMLSpanElement>;

  private car: Car;

  private engineStatus: EngineStatus;

  private menu: Menu;

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
    this.engineStatus = EngineStatus.Stopped;

    this.menu = this.createMenu();
    this.disableMenuButton(Track.STOP_BUTTON_INDEX);
  }

  public updateCar(car: Car): void {
    this.car = car;
    this.carSVG.setColor(car.color);
    this.carTitle.textContent = car.name;

    this.menu.getButton(Track.START_BUTTON_INDEX).setCSSProperty(Track.CAR_COLOR_VAR, car.color);
  }

  public startEngine(): void {
    this.disableMenuButton(Track.START_BUTTON_INDEX);
    this.enableMenuButton(Track.STOP_BUTTON_INDEX);

    this.emitter.emit(AppEvents.CarToggleEngine, { id: this.car.id, engineStatus: EngineStatus.Started });
  }

  public launchCar(driveData: DriveData): void {
    this.engineStatus = EngineStatus.Started;
    const travelTime: number = driveData.distance / driveData.velocity;

    const startTime = Date.now();

    this.carSVG.showAnimation({
      name: Track.CAR_DRIVE_ANIMATION,
      duration: travelTime,
      fillMode: AnimationFillMode.Forwards,
    });
    this.emitter.emit(AppEvents.RequestCarDrive, this.car.id);

    const finishHandler = () => {
      if (this.engineStatus !== EngineStatus.Stopped) {
        const time = +((Date.now() - startTime) / 1000).toFixed(2);
        this.emitter.emit(AppEvents.CarFinished, { car: this.car, time });
      }
      this.carSVG.removeEventListener(Events.AnimationEnd, finishHandler);
    };
    this.carSVG.addEventListener(Events.AnimationEnd, finishHandler);
  }

  public stopEngine(): void {
    this.enableMenuButton(Track.START_BUTTON_INDEX);
    this.disableMenuButton(Track.STOP_BUTTON_INDEX);

    this.emitter.emit(AppEvents.CarToggleEngine, { id: this.car.id, engineStatus: EngineStatus.Stopped });
  }

  public resetCar(): void {
    this.carSVG.setCSSProperty('animation', '');
    this.carSVG.setCSSProperty(Track.CAR_STOP_COORDS, '');
    this.engineStatus = EngineStatus.Stopped;
  }

  public stopCar(): void {
    this.engineStatus = EngineStatus.Stopped;
    const left = this.carSVG.getCSSProperty('left');
    this.carSVG.setCSSProperty('animation', '');

    const stopDuration = 500;
    this.carSVG.setCSSProperty(Track.CAR_STOP_COORDS, left);
    this.carSVG.showAnimation({
      name: Track.CAR_STOP_ANIMATION,
      duration: stopDuration,
      fillMode: AnimationFillMode.Forwards,
    });
  }

  private enableMenuButton(index: number): void {
    const button = this.menu.getButton(index);
    button.removeAttribute('disabled');
  }

  public disableMenuButton(index: number): void {
    const button = this.menu.getButton(index);
    button.setAttribute('disabled', true.toString());
  }

  private createMenu(): Menu {
    const menu = new Menu({
      params: { ...Track.MENU_PARAMS, parent: this },
      buttonTexts: ['update', '', 'a', 'b'],
      buttonClasses: [
        TrackElements.UpdateButton,
        TrackElements.DeleteButton,
        TrackElements.StartButton,
        TrackElements.BreakButton,
      ],
      clickHandlers: [
        () => this.changeCar(),
        () => this.deleteCar(),
        () => this.startEngine(),
        () => this.stopEngine(),
      ],
    });

    const deleteButtonIndex = 1;
    menu.getButton(deleteButtonIndex).append(new DOMComponent<HTMLElement>(Track.DELETE_ICON_PARAMS));

    const startButtonIndex = 2;
    menu.getButton(startButtonIndex).setCSSProperty(Track.CAR_COLOR_VAR, this.car.color);
    return menu;
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
