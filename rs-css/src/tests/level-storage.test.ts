import CompletionState from '../app/model/completion-state';
import { UserData } from '../app/model/level-data';
import LevelStorage from '../app/model/level-storage/level-storage';

// Copied from https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
class LocalStorageMock {
  private store: { [key: string]: string };

  public get length() {
    return Object.keys(this.store).length;
  }

  public constructor() {
    this.store = {};
  }

  public key(index: number): string {
    return Object.keys(this.store)[index];
  }

  public clear(): void {
    this.store = {};
  }

  public getItem(key: string): string | null {
    return this.store[key] || null;
  }

  public setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

describe('level storage', () => {
  localStorage.clear();
  const levelStorage = new LevelStorage();
  it('creates new user data if no avaliable', () => {
    expect(levelStorage.completedLevels).toEqual(
      new Array(levelStorage.completedLevels.length).fill(CompletionState.NotCompleted)
    );
  });
  it('reloads local storage if levels count are not equal', () => {
    const mockData: UserData = {
      currentLevel: 0,
      completedLevels: [CompletionState.Completed],
    };
    localStorage.setItem('css-pets-quaqva', JSON.stringify(mockData));
    const controllerNew = new LevelStorage();
    expect(controllerNew.completedLevels).toEqual(
      new Array(controllerNew.completedLevels.length).fill(CompletionState.NotCompleted)
    );
  });
  it('loads levels', () => {
    levelStorage.loadLevel(levelStorage.completedLevels.length - 1, (level) => {
      expect(level).toBeDefined();
    });
  });
});
