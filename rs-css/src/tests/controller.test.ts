import AppController from '../app/controller/controller';
import CompletionState from '../app/model/completion-state';
import { UserData } from '../app/model/level-data';

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

describe('controller', () => {
  localStorage.clear();
  const controller = new AppController();
  it('creates new user data if no avaliable', () => {
    expect(controller.completedLevels).toEqual(
      new Array(controller.completedLevels.length).fill(CompletionState.NotCompleted)
    );
  });
  it('reloads local storage if levels count are not equal', () => {
    const mockData: UserData = {
      currentLevel: 0,
      completedLevels: [CompletionState.Completed],
    };
    localStorage.setItem('css-pets-quaqva', JSON.stringify(mockData));
    const controllerNew = new AppController();
    expect(controllerNew.completedLevels).toEqual(
      new Array(controllerNew.completedLevels.length).fill(CompletionState.NotCompleted)
    );
  });
  it('loads levels', () => {
    controller.loadLevel(controller.completedLevels.length - 1, (level) => {
      expect(level).toBeDefined();
    });
  });
  describe('When user inputs selector', () => {
    it('validates it and calls appropriate callback', () => {
      const markup = `
        <couch>
          <cat>
          </cat>
          <dog>
            <cat class="small">
            </cat>
          </dog>
        </couch>
      `;
      const selector = '.small';
      let succeed = false;
      let won = false;
      controller.loadLevel(1, () => {
        succeed = false;
      });
      controller.checkInput({
        viewData: [markup, selector],
        sucessCallback: () => {
          succeed = true;
        },
        failCallback: () => {
          succeed = false;
        },
        winCallback: () => {
          won = true;
        },
      });
      expect(succeed).toBe(true);
      expect(won).toBe(false);
    });
  });
});
