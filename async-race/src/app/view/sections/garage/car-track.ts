import DOMComponent, { ElementParameters } from '../../../../components/base-component';
import { Car } from '../../../model/car';
import trackSprite from '../../../../assets/img/track_sprite.svg';
import SVGComponent from '../../../../components/svg-component';
import { AnimationFillMode, Events, Tags, TransformOrigin } from '../../../../types/dom-types';
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

  private static START_BUTTON_INDEX = 2;

  private static STOP_BUTTON_INDEX = 3;

  private static DELETE_ICON_PARAMS: ElementParameters = {
    tag: Tags.Icon,
    classes: [FontAwesome.Solid, FontAwesome.Times],
  };

  private static MAX_FAST_TIME = 3500;

  private static CAR_DRIVE_ANIMATION = 'car-drive';

  private static CAR_DRIVE_FAST_ANIMATION = 'car-drive-fast';

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
    this.disableStopButton();
  }

  public updateCar(car: Car): void {
    this.car = car;
    this.carSVG.setColor(car.color);
    this.carTitle.textContent = car.name;

    this.menu.getButton(Track.START_BUTTON_INDEX).setCSSProperty(Track.CAR_COLOR_VAR, car.color);
  }

  public startEngine(): void {
    this.menu.disableButton(Track.START_BUTTON_INDEX);
    this.menu.enableButton(Track.STOP_BUTTON_INDEX);

    this.emitter.emit(AppEvents.CarToggleEngine, { id: this.car.id, engineStatus: EngineStatus.Started });
  }

  public launchCar(driveData: DriveData): void {
    this.engineStatus = EngineStatus.Started;
    const travelTime: number = driveData.distance / driveData.velocity;

    const startTime = Date.now();

    const isFast = travelTime <= Track.MAX_FAST_TIME;
    const animationName = isFast ? Track.CAR_DRIVE_FAST_ANIMATION : Track.CAR_DRIVE_ANIMATION;
    const transformOrigin = isFast ? TransformOrigin.BottomLeft : TransformOrigin.Center;

    this.carSVG.showAnimation(
      {
        name: animationName,
        duration: travelTime,
        fillMode: AnimationFillMode.Forwards,
      },
      transformOrigin
    );
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
    this.menu.enableButton(Track.START_BUTTON_INDEX);
    this.disableStopButton();

    this.emitter.emit(AppEvents.CarToggleEngine, { id: this.car.id, engineStatus: EngineStatus.Stopped });
  }

  public resetCar(): void {
    this.carSVG.setCSSProperty('opacity', '0');

    const opacityTransitionTime = 300;
    setTimeout(() => {
      this.carSVG.setCSSProperty('animation', '');
      this.carSVG.setCSSProperty(Track.CAR_STOP_COORDS, '');
      this.carSVG.setCSSProperty('opacity', '');
    }, opacityTransitionTime);

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

  public disableStopButton(): void {
    this.menu.disableButton(Track.STOP_BUTTON_INDEX);
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
