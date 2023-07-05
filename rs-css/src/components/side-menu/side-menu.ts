import BaseComponent from '../base-component';
import EventEmitter from '../../utils/event-emitter';
import { Tags, Events } from '../../types/dom-types';
import { FontAwesome } from '../../types/font-awesome';
import './menu-styles.scss';
import { NumeratedLevel } from '../../app/model/level-data';
import ToggleInput from '../toggle-input/toggle-input';
import { AppEvents } from '../../types/app-events';

enum MenuClasses {
  Menu = 'side-menu',
  ContentWrapper = 'side-menu__content',
  ContentLabel = 'side-menu__label',
  Description = 'side-menu__description',
  LevelButton = 'side-menu__level',
  CurrentLevelButton = 'side-menu__level_current',
  CompletedLevelButton = 'side-menu__level_completed',
  CloseButton = 'side-menu__close',
  ShowMenu = 'side-menu_shown',
  HideElement = 'side-menu__hidden',
  ResetButton = 'side-menu__reset-progress',
}

export default class SideMenu extends BaseComponent<HTMLDivElement> {
  private static ELEMENT_PARAMS = {
    classes: [MenuClasses.Menu],
  };

  private static CLOSE_BUTTON_PARAMS = {
    tag: Tags.Button,
    classes: [MenuClasses.CloseButton],
  };

  private static CONTENT_LABEL_PARAMS = {
    tag: Tags.Span,
    classes: [MenuClasses.ContentLabel],
  };

  private static CONTENT_WRAPPER_PARAMS = {
    classes: [MenuClasses.ContentWrapper],
  };

  private static LEVEL_BUTTON_PARAMS = {
    tag: Tags.Button,
    classes: [MenuClasses.LevelButton],
  };

  private static RESET_BUTTON_PARAMS = {
    tag: Tags.Button,
    classes: [MenuClasses.ResetButton],
    textContent: 'Reset progress',
  };

  private static SWITCH_TRANSITION = 300;

  public static LEVEL_CHOSEN = 'choose-level';

  private emitter: EventEmitter;

  private isDescription: boolean;

  private currentLevel: number;

  private description?: BaseComponent<HTMLParagraphElement>;

  private switchButton: ToggleInput;

  private resetProgressButton: BaseComponent<HTMLButtonElement>;

  private contentLabel: BaseComponent<HTMLSpanElement>;

  private contentWrapper: BaseComponent<HTMLDivElement>;

  private levelList: BaseComponent<HTMLButtonElement>[];

  private completedLevels: boolean[];

  public constructor(
    parent: BaseComponent<HTMLElement>,
    emitter: EventEmitter,
    completedLevels: boolean[],
    levelNames: string[]
  ) {
    super({ ...SideMenu.ELEMENT_PARAMS, parent });

    this.emitter = emitter;
    this.completedLevels = completedLevels;

    this.isDescription = true;
    this.currentLevel = 0;

    this.switchButton = new ToggleInput({ description: 'Switch content', parent: this });
    this.switchButton.addInputListener(() => {
      this.switchContent();
    });

    const closeButton = SideMenu.createCloseButton();
    this.append(closeButton);
    closeButton.addEventListener(Events.Click, () => {
      this.hide();
    });

    this.contentLabel = new BaseComponent<HTMLSpanElement>({ ...SideMenu.CONTENT_LABEL_PARAMS, parent: this });

    this.contentWrapper = new BaseComponent<HTMLDivElement>({ ...SideMenu.CONTENT_WRAPPER_PARAMS, parent: this });

    this.levelList = this.createLevelList(completedLevels, levelNames);

    this.emitter.subscribe(AppEvents.LevelCompleted, (levelIndex) => {
      const index = levelIndex as number;
      this.completedLevels[index] = true;
      this.levelList[index].addClass(MenuClasses.CompletedLevelButton);
    });

    this.resetProgressButton = new BaseComponent(SideMenu.RESET_BUTTON_PARAMS);
    this.resetProgressButton.addEventListener(Events.Click, () => {
      this.emitter.emit(AppEvents.ResetProgress, null);
    });

    this.emitter.subscribe(AppEvents.ResetProgress, () => {
      this.completedLevels = new Array(this.completedLevels.length).fill(false);
      this.levelList.forEach((button) => button.removeClass(MenuClasses.CompletedLevelButton));
    });
  }

  private static createCloseButton(): BaseComponent<HTMLButtonElement> {
    const closeButton = new BaseComponent<HTMLButtonElement>({ ...SideMenu.CLOSE_BUTTON_PARAMS });
    const crossIcon = new BaseComponent<HTMLElement>({
      tag: Tags.Icon,
      classes: [FontAwesome.Solid, FontAwesome.Times],
    });
    closeButton.append(crossIcon);
    return closeButton;
  }

  private getLabelTemplate() {
    return this.isDescription
      ? `Level ${this.currentLevel + 1} of ${this.levelList.length} ${
          this.completedLevels[this.currentLevel] ? '✅' : ''
        }`
      : 'Levels';
  }

  private createLevelList(completedLevels: boolean[], levelNames: string[]): BaseComponent<HTMLButtonElement>[] {
    return completedLevels.map((levelCompleted, index) => {
      const button = new BaseComponent<HTMLButtonElement>(SideMenu.LEVEL_BUTTON_PARAMS);
      button.textContent = levelNames[index];
      if (levelCompleted) button.addClass(MenuClasses.CompletedLevelButton);
      button.addEventListener(Events.Click, () => {
        this.emitter.emit(SideMenu.LEVEL_CHOSEN, index);
      });
      return button;
    });
  }

  private switchContent(): void {
    this.isDescription = !this.isDescription;

    this.contentLabel.addClass(MenuClasses.HideElement);
    this.contentWrapper.addClass(MenuClasses.HideElement);

    setTimeout(() => {
      this.contentLabel.textContent = this.getLabelTemplate();
      this.contentWrapper.clear();
      if (this.isDescription && this.description) this.contentWrapper.append(this.description);
      else this.contentWrapper.append(...this.levelList, this.resetProgressButton);

      this.contentLabel.removeClass(MenuClasses.HideElement);
      this.contentWrapper.removeClass(MenuClasses.HideElement);
    }, SideMenu.SWITCH_TRANSITION);
  }

  public loadLevel(level: NumeratedLevel): void {
    this.levelList[this.currentLevel].removeClass(MenuClasses.CurrentLevelButton);
    this.currentLevel = level.index;
    this.levelList[this.currentLevel].addClass(MenuClasses.CurrentLevelButton);

    this.contentLabel.textContent = this.getLabelTemplate();
    if (this.description) this.description.destroy();
    this.description = BaseComponent.FromHTML<HTMLParagraphElement>(
      `<p class="${MenuClasses.Description}">${level.description}</p>`
    );
    if (this.isDescription) this.contentWrapper.append(this.description);
  }

  public hide(): void {
    this.removeClass(MenuClasses.ShowMenu);
  }

  public show(): void {
    this.addClass(MenuClasses.ShowMenu);
  }
}
