import levels from '../../data/levels.json';
import { DefaultCallback } from '../../types/default';
import { LevelData } from '../../types/level-types';
import validateSelector from '../../utils/validator';

export default class AppController {
  private levels: LevelData[];

  private currentLevel: LevelData;

  public constructor() {
    this.levels = levels as LevelData[];
    this.currentLevel = this.levels[0];
  }

  public loadLevel(index: number, callback: (level: LevelData) => void): void {
    this.currentLevel = this.levels[index];
    callback(this.currentLevel);
  }

  public validateSelector(selector: string, sucessCallback: DefaultCallback, failCallback: DefaultCallback): void {
    if (validateSelector(this.currentLevel.tableItems, selector)) sucessCallback();
    else failCallback();
  }
}
