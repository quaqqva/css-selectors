import levels from '../../data/levels.json';
import { DefaultCallback } from '../../types/default';
import { CompletionState, LevelData, NumeratedLevel } from '../model/level-data';
import validateSelector from '../../utils/validator';
import { UserData } from '../model/level-data';
import parseMarkdown from '../../utils/parse-markdown';

export default class AppController {
  private levels: LevelData[];

  private currentLevelIndex: number;

  private userData: UserData;

  private helpUsed: boolean;

  private static STORAGE_KEY = 'css-pets-quaqva';

  public constructor() {
    this.levels = levels as LevelData[];
    this.levels.forEach((levelData) => {
      const data = levelData;
      data.description = parseMarkdown(data.description);
    });

    this.userData = this.loadUserData();
    this.currentLevelIndex = this.userData.currentLevel;

    this.helpUsed = false;
  }

  private loadUserData(): UserData {
    const data: string | null = localStorage.getItem(AppController.STORAGE_KEY);
    if (!data) {
      this.clearUserData();
      return this.userData;
    }
    return JSON.parse(data);
  }

  public saveUserData(): void {
    localStorage.setItem(AppController.STORAGE_KEY, JSON.stringify(this.userData));
  }

  public clearUserData(): void {
    const emptyData: UserData = {
      currentLevel: 0,
      completedLevels: new Array(this.levels.length).fill(CompletionState.NotCompleted),
    };
    localStorage.setItem(AppController.STORAGE_KEY, JSON.stringify(emptyData));
    this.currentLevelIndex = emptyData.currentLevel;
    this.userData = emptyData;
  }

  public get currentLevel(): number {
    return this.currentLevelIndex;
  }

  public get completedLevels(): CompletionState[] {
    return this.userData.completedLevels;
  }

  public get names(): string[] {
    return this.levels.map((levelData) => levelData.name);
  }

  public get descriptions(): string[] {
    return this.levels.map((levelData) => levelData.description);
  }

  public get currentSolution(): string {
    return this.levels[this.currentLevelIndex].solution;
  }

  public get help(): string {
    this.helpUsed = true;
    return this.currentSolution;
  }

  public get helped(): boolean {
    return this.helpUsed;
  }

  public loadLevel(index: number, callback: (level: NumeratedLevel) => void): void {
    this.helpUsed = false;

    this.currentLevelIndex = index;
    this.userData.currentLevel = this.currentLevelIndex;
    this.saveUserData();

    const level = this.levels[this.currentLevelIndex] as NumeratedLevel;
    level.index = index;
    callback(level);
  }

  public loadNextLevel(callback: (level: NumeratedLevel) => void) {
    this.loadLevel(this.currentLevelIndex + 1, callback);
  }

  public checkInput({
    viewData,
    sucessCallback,
    failCallback,
    winCallback,
  }: {
    viewData: unknown;
    sucessCallback: DefaultCallback;
    failCallback: DefaultCallback;
    winCallback: DefaultCallback;
  }): void {
    const [markup, selector] = viewData as [markup: string, selector: string];
    const isValid = validateSelector({ markup, selector, solution: this.levels[this.currentLevelIndex].solution });
    if (isValid) {
      this.userData.completedLevels[this.currentLevelIndex] = this.helpUsed
        ? CompletionState.CompletedWithHelp
        : CompletionState.Completed;
      this.saveUserData();
      if (this.currentLevelIndex === this.levels.length - 1) winCallback();
      else sucessCallback();
    } else failCallback();
  }

  public getUserInput(viewData: unknown) {
    const selector = (viewData as [markup: string, selector: string])[1];
    return selector;
  }
}
