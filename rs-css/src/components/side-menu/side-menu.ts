import BaseComponent from '../base-component';
import EventEmitter from '../../utils/event-emitter';
import { Tags, Events } from '../../types/dom-types';
import { FontAwesome } from '../../types/font-awesome';
import './menu-styles.scss';
import { NumeratedLevel } from '../../app/model/level-data';

enum MenuClasses {
  Menu = 'side-menu',
  ContentWrapper = 'side-menu__content',
  ContentLabel = 'side-menu__label',
  Description = 'side-menu__description',
  LevelButton = 'side-menu__level',
  CompletedLevelButton = 'side-menu__level_completed',
  SwitchButton = 'side-menu__switch-content',
  PressedSwitchButton = 'side-menu__switch-content_switched',
  CloseButton = 'side-menu__close',
  ShowMenu = 'side-menu_shown',
  HideElement = 'side-menu__hidden',
}

export default class SideMenu extends BaseComponent<HTMLDivElement> {
  private static ELEMENT_PARAMS = {
    classes: [MenuClasses.Menu],
  };

  private static SWITCH_BUTTON_PARAMS = {
    tag: Tags.Icon,
    classes: [MenuClasses.SwitchButton, FontAwesome.Solid, FontAwesome.Bars],
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

  private static DESCRIPTION_PARAMS = {
    tag: Tags.Paragraph,
    classes: [MenuClasses.Description],
  };

  private static LEVEL_BUTTON_PARAMS = {
    tag: Tags.Button,
    classes: [MenuClasses.LevelButton],
  };

  private static SWITCH_TRANSITION = 300;

  public static LEVEL_CHOSEN = 'choose-level';

  private emitter: EventEmitter;

  private isDescription: boolean;

  private currentLevel: number;

  private description: BaseComponent<HTMLParagraphElement>;

  private switchButton: BaseComponent<HTMLButtonElement>;

  private contentLabel: BaseComponent<HTMLSpanElement>;

  private contentWrapper: BaseComponent<HTMLDivElement>;

  private levelList: BaseComponent<HTMLButtonElement>[];

  public constructor(parent: BaseComponent<HTMLElement>, emitter: EventEmitter, completedLevels: boolean[]) {
    super({ ...SideMenu.ELEMENT_PARAMS, parent });

    this.emitter = emitter;

    this.isDescription = true;
    this.currentLevel = 0;

    this.switchButton = new BaseComponent<HTMLButtonElement>({ ...SideMenu.SWITCH_BUTTON_PARAMS, parent: this });
    this.switchButton.addEventListener(Events.Click, () => {
      this.switchContent();
    });

    const closeButton = SideMenu.createCloseButton();
    this.append(closeButton);
    closeButton.addEventListener(Events.Click, () => {
      this.hide();
    });

    this.contentLabel = new BaseComponent<HTMLSpanElement>({ ...SideMenu.CONTENT_LABEL_PARAMS, parent: this });

    this.contentWrapper = new BaseComponent<HTMLDivElement>({ ...SideMenu.CONTENT_WRAPPER_PARAMS, parent: this });
    this.description = new BaseComponent<HTMLParagraphElement>({
      ...SideMenu.DESCRIPTION_PARAMS,
      parent: this.contentWrapper,
    });

    this.levelList = this.createLevelList(completedLevels);
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
    return this.isDescription ? `Level ${this.currentLevel + 1} of ${this.levelList.length}` : 'Levels';
  }

  private createLevelList(completedLevels: boolean[]): BaseComponent<HTMLButtonElement>[] {
    return completedLevels.map((levelCompleted, index) => {
      const button = new BaseComponent<HTMLButtonElement>(SideMenu.LEVEL_BUTTON_PARAMS);
      button.textContent = `Level ${index + 1}`;
      if (levelCompleted) button.addClass(MenuClasses.CompletedLevelButton);
      button.addEventListener(Events.Click, () => {
        this.emitter.emit(SideMenu.LEVEL_CHOSEN, index);
      });
      return button;
    });
  }

  private switchContent(): void {
    this.isDescription = !this.isDescription;

    if (this.isDescription) this.switchButton.removeClass(MenuClasses.PressedSwitchButton);
    else this.switchButton.addClass(MenuClasses.PressedSwitchButton);

    this.contentLabel.addClass(MenuClasses.HideElement);
    this.contentWrapper.addClass(MenuClasses.HideElement);

    setTimeout(() => {
      this.contentLabel.textContent = this.getLabelTemplate();
      this.contentWrapper.clear();
      if (this.isDescription) this.contentWrapper.append(this.description);
      else this.contentWrapper.append(...this.levelList);

      this.contentLabel.removeClass(MenuClasses.HideElement);
      this.contentWrapper.removeClass(MenuClasses.HideElement);
    }, SideMenu.SWITCH_TRANSITION);
  }

  public loadLevel(level: NumeratedLevel): void {
    this.currentLevel = level.index;
    this.contentLabel.textContent = this.getLabelTemplate();
    this.description.textContent = level.description;
  }

  public hide(): void {
    this.removeClass(MenuClasses.ShowMenu);
  }

  public show(): void {
    this.addClass(MenuClasses.ShowMenu);
  }
}
