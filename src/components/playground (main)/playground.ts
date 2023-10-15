import { LevelData, PetElement } from '../../app/model/level-data';
import { Events, Tags } from '../../types/dom-types/enums';
import EventEmitter from '../../utils/event-emitter';
import BaseComponent from '../base-component';
import CSSInput from '../text-input/css-input/css-input';
import DragNDropComponent from '../draggables/drag-n-drop-component';
import Furniture from '../furniture/furniture';
import Pet from '../pet/pet';
import { AppEvents } from '../../types/app-events';
import './animations.scss';
import HTMLView from '../draggables/html-view/html-view';
import { AnimationParams } from '../../types/dom-types/types';

enum PlaygroundClasses {
  Playground = 'playground',
  TaskHeading = 'playground__task',
  WinHeading = 'playground__task_win',
  HelpButton = 'playground__help',
  CSSDraggable = 'css-input-wrapper',
  Couch = 'playground__couch',
  Table = 'playground__table',
  Floor = 'playground__floor',
}

export default class Playground extends BaseComponent<HTMLElement> {
  private static ELEMENT_PARAMS = {
    tag: Tags.Main,
    classList: [PlaygroundClasses.Playground],
  };

  private static HEADING_PARAMS = {
    tag: Tags.Heading2,
    classList: [PlaygroundClasses.TaskHeading],
  };

  private static HELP_BUTTON_PARAMS = {
    tag: Tags.Button,
    classList: [PlaygroundClasses.HelpButton],
    textContent: "Help, I'm stuck!",
  };

  private static COUCH_PARAMS = {
    tag: Tags.Div,
    classList: [PlaygroundClasses.Couch],
    name: 'couch',
  };

  private static TABLE_PARAMS = {
    tag: Tags.Div,
    classList: [PlaygroundClasses.Table],
    name: 'table',
  };

  private static FLOOR_PARAMS = {
    tag: Tags.Div,
    classList: [PlaygroundClasses.Floor],
    name: 'floor',
  };

  private static SHOW_ANIMATION_PARAMS = {
    name: 'pet-appear',
    duration: 100,
  };

  public static WIN_ANIMATION_PARAMS = {
    name: 'pet-win',
    duration: 500,
  };

  private static CSS_INPUT_PANEL_TITLE = 'styles.css';

  private static WIN_HEADER_TEXT = "Hooray!\nYou saved everyone!!\nAnd now you're CSS pro!\nThanks for playing!";

  private taskHeader: BaseComponent<HTMLHeadingElement>;

  private helpButton: BaseComponent<HTMLButtonElement>;

  private couch: Furniture;

  private table: Furniture;

  private floor: Furniture;

  private cssInputWrapper: DragNDropComponent;

  private cssInput: CSSInput;

  private htmlView: HTMLView;

  private furniturePetPairs: Map<Furniture, PetElement[] | undefined>;

  public constructor({ parent, emitter }: { parent: BaseComponent<HTMLElement>; emitter: EventEmitter }) {
    super({ ...Playground.ELEMENT_PARAMS, parent });
    this.furniturePetPairs = new Map();

    this.taskHeader = new BaseComponent<HTMLHeadingElement>({ ...Playground.HEADING_PARAMS, parent: this });

    this.helpButton = new BaseComponent<HTMLButtonElement>({ ...Playground.HELP_BUTTON_PARAMS, parent: this });
    this.helpButton.addEventListener(Events.Click, () => {
      emitter.emit(AppEvents.GetSelector, null);
    });

    this.table = new Furniture(Playground.TABLE_PARAMS);
    this.couch = new Furniture(Playground.COUCH_PARAMS);
    this.floor = new Furniture(Playground.FLOOR_PARAMS);

    this.cssInputWrapper = new DragNDropComponent({ parent: this, panelTitle: Playground.CSS_INPUT_PANEL_TITLE });
    this.cssInputWrapper.addClass(PlaygroundClasses.CSSDraggable);
    this.cssInput = new CSSInput({ parent: this.cssInputWrapper, emitter });

    this.htmlView = new HTMLView(this);

    emitter.subscribe(AppEvents.LevelCompleted, () => {
      this.cssInput.clearInput();
    });

    emitter.subscribe(CSSInput.INPUT_EVENT, (selector) => {
      emitter.emit(AppEvents.SelectorInput, [this.htmlView.textContent, selector]);
    });

    emitter.subscribe(AppEvents.PostSelector, async (selector) => {
      this.helpButton.setAttribute('disabled', 'true');
      await this.cssInput.inputText(selector as string);
      this.helpButton.removeAttribute('disabled');
    });
  }

  public changeLevel(level: LevelData): void {
    this.clear();
    this.append(this.taskHeader);
    this.append(this.cssInputWrapper);
    this.append(this.htmlView);
    this.append(this.helpButton);
    this.taskHeader.removeClass(PlaygroundClasses.WinHeading);

    this.taskHeader.textContent = level.task;

    this.furniturePetPairs.set(this.couch, level.couchPets);
    this.furniturePetPairs.set(this.table, level.tablePets);
    this.furniturePetPairs.set(this.floor, level.floorPets);
    this.updateFurniture();
    this.showPets(level.solution);
  }

  public async animate(selector: string, animationParams: AnimationParams): Promise<void> {
    const bodyEnviroment = new BaseComponent<HTMLElement>({ tag: Tags.Body });
    this.furniturePetPairs.forEach((_, furniture) => {
      furniture.animatePets(animationParams, { selector, body: bodyEnviroment });
    });
    await new Promise((resolve) => setTimeout(resolve, animationParams.duration));
  }

  public animateCSSInput(animationParams: AnimationParams): void {
    this.cssInputWrapper.showAnimation(animationParams);
  }

  public signalWin(): void {
    this.furniturePetPairs.forEach((_, furniture) => {
      furniture.destroy();
    });
    this.htmlView.destroy();
    this.cssInputWrapper.destroy();
    this.helpButton.destroy();

    this.taskHeader.textContent = Playground.WIN_HEADER_TEXT;
    this.taskHeader.addClass(PlaygroundClasses.WinHeading);
  }

  private updateFurniture(): void {
    this.htmlView.clear();
    this.furniturePetPairs.forEach((pets, furniture) => {
      furniture.clear();
      if (pets) {
        this.append(furniture);
        furniture.append(...pets.map((pet) => new Pet(pet)));
        this.htmlView.append(furniture.getMarkup(this));
      }
    });
  }

  private showPets(targetSelector: string): void {
    const bodyEnviroment = new BaseComponent<HTMLElement>({ tag: Tags.Body });
    this.furniturePetPairs.forEach((_, furniture) => {
      furniture.animatePets(Playground.SHOW_ANIMATION_PARAMS);
      furniture.highlightTargets({ selector: targetSelector, body: bodyEnviroment });
    });
  }
}
