import BaseComponent from '../base-component';
import EventEmitter from '../../utils/event-emitter';
import { Tags, Events } from '../../types/dom-types';
import { FontAwesome } from '../../types/font-awesome';
import './menu-styles.scss';
import { CompletionState, NumeratedLevel } from '../../app/model/level-data';
import ToggleInput from '../checkbox-input/toggle-input/toggle-input';
import { AppEvents } from '../../types/app-events';

enum MenuClasses {
  Menu = 'side-menu',
  ContentWrapper = 'side-menu__content',
  ContentLabel = 'side-menu__label',
  Description = 'side-menu__description',
  LevelButton = 'side-menu__level',
  CurrentLevelButton = 'side-menu__level_current',
  CompletedWithHelpLevelButton = 'side-menu__level_completed-with-help',
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

  private static WIN_INFO_INDEX = -1;

  private static SWITCH_BUTTON_LABEL = 'Switch content';

  private static WIN_HEADER = 'You win!';

  private static WIN_CONTENT = 'Congratulations!! Thanks for finding my super big hamster...';

  private static MARK_COMPLETED = '✅';

  private static MARK_WITH_HELP = '☑️';

  private emitter: EventEmitter;

  private isDescription: boolean;

  private currentLevel: number;

  private description?: BaseComponent<HTMLParagraphElement>;

  private switchButton: ToggleInput;

  private resetProgressButton: BaseComponent<HTMLButtonElement>;

  private contentLabel: BaseComponent<HTMLSpanElement>;

  private contentWrapper: BaseComponent<HTMLDivElement>;

  private levelList: BaseComponent<HTMLButtonElement>[];

  private completedLevels: CompletionState[];

  public constructor(
    parent: BaseComponent<HTMLElement>,
    emitter: EventEmitter,
    completedLevels: CompletionState[],
    levelNames: string[]
  ) {
    super({ ...SideMenu.ELEMENT_PARAMS, parent });

    this.emitter = emitter;
    this.completedLevels = completedLevels;

    this.isDescription = true;
    this.currentLevel = 0;

    this.switchButton = new ToggleInput({ description: SideMenu.SWITCH_BUTTON_LABEL, parent: this });
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

    this.emitter.subscribe(AppEvents.LevelCompleted, (levelData) => {
      const [index, helpUsed] = levelData as [number, boolean];
      this.completedLevels[index] = helpUsed ? CompletionState.CompletedWithHelp : CompletionState.Completed;
      this.levelList[index].addClass(
        helpUsed ? MenuClasses.CompletedWithHelpLevelButton : MenuClasses.CompletedLevelButton
      );
    });

    this.resetProgressButton = new BaseComponent(SideMenu.RESET_BUTTON_PARAMS);
    this.resetProgressButton.addEventListener(Events.Click, () => {
      this.emitter.emit(AppEvents.ResetProgress, null);
    });

    this.emitter.subscribe(AppEvents.ResetProgress, () => {
      this.completedLevels = new Array(this.completedLevels.length).fill(false);
      this.levelList.forEach((button) => {
        button.removeClass(MenuClasses.CompletedLevelButton);
        button.removeClass(MenuClasses.CompletedWithHelpLevelButton);
      });
    });
  }

  public showWinText(): void {
    this.levelList[this.currentLevel].removeClass(MenuClasses.CurrentLevelButton);
    this.currentLevel = SideMenu.WIN_INFO_INDEX;
    if (!this.isDescription) {
      this.switchButton.toggle();
      this.switchContent();
    } else {
      this.switchContent(true);
    }
  }

  public loadLevel(level: NumeratedLevel): void {
    if (this.currentLevel !== SideMenu.WIN_INFO_INDEX)
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
    const completionState = this.completedLevels[this.currentLevel];
    return this.isDescription
      ? `Level ${this.currentLevel + 1} of ${this.levelList.length} ${
          completionState === CompletionState.Completed
            ? SideMenu.MARK_COMPLETED
            : completionState === CompletionState.CompletedWithHelp
            ? SideMenu.MARK_WITH_HELP
            : ''
        }`
      : 'Levels';
  }

  private createLevelList(
    completedLevels: CompletionState[],
    levelNames: string[]
  ): BaseComponent<HTMLButtonElement>[] {
    return completedLevels.map((levelCompleted, index) => {
      const button = new BaseComponent<HTMLButtonElement>(SideMenu.LEVEL_BUTTON_PARAMS);
      button.textContent = levelNames[index];
      if (levelCompleted === CompletionState.Completed) button.addClass(MenuClasses.CompletedLevelButton);
      else if (levelCompleted === CompletionState.CompletedWithHelp)
        button.addClass(MenuClasses.CompletedWithHelpLevelButton);
      button.addEventListener(Events.Click, () => {
        this.emitter.emit(AppEvents.LevelChoose, index);
      });
      return button;
    });
  }

  private switchContent(toDescription?: boolean): void {
    this.isDescription = toDescription || !this.isDescription;

    this.contentLabel.addClass(MenuClasses.HideElement);
    this.contentWrapper.addClass(MenuClasses.HideElement);

    setTimeout(() => {
      if (this.currentLevel !== SideMenu.WIN_INFO_INDEX || !this.isDescription) {
        this.contentLabel.textContent = this.getLabelTemplate();
        this.contentWrapper.clear();
        if (this.isDescription && this.description) this.contentWrapper.append(this.description);
        else this.contentWrapper.append(...this.levelList, this.resetProgressButton);
      } else {
        this.contentLabel.textContent = SideMenu.WIN_HEADER;
        this.contentWrapper.textContent = SideMenu.WIN_CONTENT;
      }

      this.contentLabel.removeClass(MenuClasses.HideElement);
      this.contentWrapper.removeClass(MenuClasses.HideElement);
    }, SideMenu.SWITCH_TRANSITION);
  }
}
