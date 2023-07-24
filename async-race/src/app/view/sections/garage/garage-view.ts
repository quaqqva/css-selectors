import DOMComponent, { ElementParameters } from '../../../../components/base-component';
import Menu from '../../../../components/menu/menu';
import InfoModal from '../../../../components/modals/info-modal';
import EventEmitter from '../../../../utils/event-emitter';
import getMapKeys from '../../../../utils/get-map-keys';
import AppEvents from '../../../app-events';
import { Car } from '../../../model/car';
import { DriveData, EngineStatus } from '../../../model/drive';
import SectionView from '../section-view';
import Track from './car-track';
import SubmitCarModal from './submit-car-modal';

enum GarageClasses {
  GarageMenu = 'garage__menu',
  MenuAddButton = 'garage-menu__add',
  MenuGenerateButton = 'garage-menu__generate',
  MenuRaceButton = 'garage-menu__race',
  MenuResetButton = 'garage-menu__reset',
  TracksWrapper = 'garage__tracks',
}
export default class GarageView extends SectionView {
  private static MENU_PARAMS: ElementParameters = {
    classes: [GarageClasses.GarageMenu],
  };

  private static RANDOM_CARS_COUNT = 100;

  private static MENU_BUTTONS: string[] = ['Add new', `Generate ${GarageView.RANDOM_CARS_COUNT}`, 'Race', 'Reset'];

  private static TRACKS_WRAPPER_PARAMS: ElementParameters = {
    classes: [GarageClasses.TracksWrapper],
  };

  private static CARS_PER_PAGE = 7;

  private menu: DOMComponent<HTMLDivElement>;

  private tracksWrapper: DOMComponent<HTMLDivElement>;

  private tracks: Map<number, Track>;

  public constructor(emitter: EventEmitter, container: DOMComponent<HTMLElement>) {
    super(emitter, container);

    this.menu = this.createMenu();
    this.tracksWrapper = new DOMComponent<HTMLDivElement>({
      ...GarageView.TRACKS_WRAPPER_PARAMS,
      parent: this.container,
    });
    this.tracks = new Map();
    this.addEventHandlers();
  }

  public get carsPerPage(): number {
    return GarageView.CARS_PER_PAGE;
  }

  public drawCars(cars: Car[]): void {
    this.tracks.clear();
    this.tracksWrapper.clear();
    cars.forEach((car) => {
      const track = new Track(this.emitter, car);
      this.tracks.set(car.id, track);
      this.tracksWrapper.append(track);
    });
  }

  private addEventHandlers(): void {
    const handler = {
      [AppEvents.CarCreated]: (data: unknown) => {
        this.createCar(data as Car);
      },
      [AppEvents.CarUpdated]: (data: unknown) => {
        this.updateCar(data as Car);
      },
      [AppEvents.CarDeleted]: (id: unknown) => {
        if (getMapKeys(this.tracks).length === this.carsPerPage) this.requestPage();
        else {
          this.tracks.get(id as number)?.destroy();
          this.tracks.delete(id as number);
        }
      },
      [AppEvents.CarsGenerated]: () => {
        this.requestPage();
      },
      [AppEvents.CarEngineToggled]: (data: unknown) => {
        const { id, engineStatus, driveData } = data as {
          id: number;
          engineStatus: EngineStatus;
          driveData: DriveData;
        };
        const track = this.tracks.get(id);
        if (engineStatus === EngineStatus.Started) track?.launchCar(driveData);
        else track?.resetCar();
      },
      [AppEvents.ResponseCarDrive]: (data: unknown) => {
        const { id, isDriving } = data as {
          id: number;
          isDriving: boolean;
        };
        if (!isDriving) this.tracks.get(id)?.stopCar();
      },
    };
    this.emitter.addHandlers(handler);
  }

  private createMenu(): Menu {
    const params: ElementParameters = {
      ...GarageView.MENU_PARAMS,
      parent: this.container,
    };

    const clickHandlers = [
      () => {
        const inputModal = new SubmitCarModal(this.emitter);
        inputModal.show();
      },
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

    const menu = new Menu({
      params,
      buttonTexts: GarageView.MENU_BUTTONS,
      buttonClasses: [
        GarageClasses.MenuAddButton,
        GarageClasses.MenuGenerateButton,
        GarageClasses.MenuRaceButton,
        GarageClasses.MenuResetButton,
      ],
      clickHandlers,
    });
    return menu;
  }

  private createCar(car: Car): void {
    const ids = getMapKeys(this.tracks);
    if (ids.length < this.carsPerPage) {
      const newTrack = new Track(this.emitter, car);
      this.tracksWrapper.append(newTrack);
      this.tracks.set(car.id, newTrack);
    }
  }

  private updateCar(car: Car): void {
    const carTrack = this.tracks.get(car.id);
    if (carTrack) carTrack.updateCar(car);
  }

  private requestPage(): void {
    this.emitter.emit(AppEvents.CarsPageLoad, this.currentPage);
  }

  private launchRace(): void {
    this.tracks.forEach((track) => {
      track.startEngine();
      track.disableMenuButton(Track.STOP_BUTTON_INDEX);
    });

    const firstFinishHandler = (carData: unknown) => {
      const { car, time } = carData as { car: Car; time: number };
      const infoModal = new InfoModal({
        params: {},
        info: `${car.name} finished first in ${time}s!`,
      });
      infoModal.show();
      this.emitter.unsubscribe(AppEvents.CarFinished, firstFinishHandler);
    };
    this.emitter.subscribe(AppEvents.CarFinished, firstFinishHandler);
  }

  private resetRace(): void {
    this.tracks.forEach((track) => {
      track.stopEngine();
    });
  }
}
