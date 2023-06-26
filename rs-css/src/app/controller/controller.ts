import levels from '../../data/levels.json';
import { DefaultCallback } from '../../types/default';
import { LevelData } from '../../types/level-types';
import validateSelector from '../../utils/validator';

export default class AppController {
  private levels: LevelData[];

  private currentLevelIndex: number;

  public constructor() {
    this.levels = levels as LevelData[];
    this.currentLevelIndex = 0;
  }

  public get levelIndex() {
    return this.currentLevelIndex;
  }

  public loadLevel(index: number, callback: (level: LevelData) => void): void {
    this.currentLevelIndex = index;
    callback(this.levels[this.currentLevelIndex]);
  }

  public validateSelector(selector: unknown, sucessCallback: DefaultCallback, failCallback: DefaultCallback): void {
    if (typeof selector !== 'string') throw Error('Wrong input data recieved');
    const currentLevel = this.levels[this.levelIndex];
    if (validateSelector(currentLevel.tableItems, selector, currentLevel.solution)) sucessCallback();
    else failCallback();
  }
}
