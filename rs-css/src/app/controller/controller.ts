import levels from '../../data/levels.json';
import { DefaultCallback } from '../../types/default';
import { LevelData } from '../model/level-data';
import validateSelector from '../../utils/validator';

export default class AppController {
  private levels: LevelData[];

  private currentLevelIndex: number;

  public constructor() {
    this.levels = levels as LevelData[];
    this.currentLevelIndex = 0;
  }

  public loadLevel(index: number, callback: (level: LevelData) => void): void {
    this.currentLevelIndex = index;
    callback(this.levels[this.currentLevelIndex]);
  }

  public loadNextLevel(callback: (level: LevelData) => void) {
    this.loadLevel(this.currentLevelIndex + 1, callback);
  }

  public checkInput({
    selector,
    sucessCallback,
    failCallback,
    winCallback,
  }: {
    selector: unknown;
    sucessCallback: DefaultCallback;
    failCallback: DefaultCallback;
    winCallback: DefaultCallback;
  }): void {
    if (typeof selector !== 'string') throw Error('Wrong input data recieved');
    const currentLevel = this.levels[this.currentLevelIndex];
    const isValid = validateSelector(currentLevel.tableItems, selector, currentLevel.solution);
    if (isValid && this.currentLevelIndex === this.levels.length - 1) winCallback();
    else if (isValid) sucessCallback();
    else failCallback();
  }
}
