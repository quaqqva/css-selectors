import { LevelData, PetElement } from '../../app/model/level-data';
import { Tags } from '../../types/dom-types';
import EventEmitter from '../../utils/event-emitter';
import BaseComponent from '../base-component';
import CSSInput from '../text-input/css-input/css-input';
import DragNDropComponent from '../draggables/drag-n-drop-component';
import Furniture from '../furniture/furniture';
import Pet from '../furniture/pet';

enum PlaygroundClasses {
  Playground = 'playground',
  TaskHeading = 'playground__task',
  CSSDraggable = 'css-input-wrapper',
  HTMLDraggable = 'html-wrapper',
  Couch = 'playground__couch',
  Table = 'playground__table',
  Floor = 'playground__floor',
}

export default class Playground extends BaseComponent<HTMLElement> {
  private static ELEMENT_PARAMS = {
    tag: Tags.Main,
    classes: [PlaygroundClasses.Playground],
  };

  private static HEADING_PARAMS = {
    tag: Tags.Heading2,
    classes: [PlaygroundClasses.TaskHeading],
  };

  private static COUCH_PARAMS = {
    tag: Tags.Div,
    classes: [PlaygroundClasses.Couch],
    name: 'couch',
  };

  private static TABLE_PARAMS = {
    tag: Tags.Div,
    classes: [PlaygroundClasses.Table],
    name: 'table',
  };

  private static FLOOR_PARAMS = {
    tag: Tags.Div,
    classes: [PlaygroundClasses.Floor],
    name: 'floor',
  };

  private taskHeader: BaseComponent<HTMLHeadingElement>;
  private couch: Furniture;
  private table: Furniture;
  private floor: Furniture;
  private cssInput: CSSInput;
  private htmlView: DragNDropComponent;

  public constructor({ parent, emitter }: { parent: BaseComponent<HTMLElement>; emitter: EventEmitter }) {
    super({ ...Playground.ELEMENT_PARAMS, parent });
    this.taskHeader = new BaseComponent<HTMLHeadingElement>({ ...Playground.HEADING_PARAMS, parent: this });

    this.table = new Furniture(Playground.TABLE_PARAMS);
    this.couch = new Furniture(Playground.COUCH_PARAMS);
    this.floor = new Furniture(Playground.FLOOR_PARAMS);

    const CSSDraggable = new DragNDropComponent({ parent: this, panelTitle: 'styles.css' });
    CSSDraggable.addClass(PlaygroundClasses.CSSDraggable);
    this.cssInput = new CSSInput({ parent: CSSDraggable, emitter });

    this.htmlView = new DragNDropComponent({ parent: this, panelTitle: 'index.html' });
    this.htmlView.addClass(PlaygroundClasses.HTMLDraggable);
  }

  public get INPUT_EVENT(): string {
    return CSSInput.INPUT_EVENT;
  }

  public changeLevel(level: LevelData): void {
    this.taskHeader.textContent = level.task;

    const furnitureDataPairs = new Map();
    furnitureDataPairs.set(this.couch, level.couchPets);
    furnitureDataPairs.set(this.table, level.tablePets);
    furnitureDataPairs.set(this.floor, level.floorPets);

    this.updateFurniture(furnitureDataPairs);
  }

  private updateFurniture(data: Map<Furniture, PetElement[]>): void {
    this.htmlView.clear();
    data.forEach((pets, furniture) => {
      furniture.clear();
      if (pets) {
        this.append(furniture);
        furniture.append(...pets.map((pet) => new Pet(pet)));
        this.htmlView.append(furniture.getMarkup());
      } else furniture.destroy();
    });
  }
}
