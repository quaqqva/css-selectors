import parseMarkdown from '../../../utils/parse-markdown';
import CompletionState from '../completion-state';
import { LevelData, UserData, NumeratedLevel } from '../level-data';
import levels from './levels.json';

export default class LevelStorage {
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

  public saveUserData(): void {
    localStorage.setItem(LevelStorage.STORAGE_KEY, JSON.stringify(this.userData));
  }

  public clearUserData(): void {
    const emptyData: UserData = {
      currentLevel: 0,
      completedLevels: new Array(this.levels.length).fill(CompletionState.NotCompleted),
    };
    localStorage.setItem(LevelStorage.STORAGE_KEY, JSON.stringify(emptyData));
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

  public set levelCompletionState(value: CompletionState) {
    this.userData.completedLevels[this.currentLevelIndex] = value;
  }

  public get levelsCount(): number {
    return this.levels.length;
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

  private loadUserData(): UserData {
    const data: string | null = localStorage.getItem(LevelStorage.STORAGE_KEY);
    if (!data || JSON.parse(data).completedLevels.length !== this.levels.length) {
      this.clearUserData();
      return this.userData;
    }
    return JSON.parse(data);
  }
}
