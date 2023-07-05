export type LevelData = {
  name: string;
  task: string;
  solution: string;
  couchPets?: PetElement[];
  floorPets?: PetElement[];
  tablePets?: PetElement[];
  description: string;
};

export type NumeratedLevel = LevelData & { index: number };

export type PetElement = {
  tag: string;
  classes?: string[];
  attributes?: { [attribute: string]: string };
  children?: PetElement[];
};

export type UserData = {
  currentLevel: number;
  completedLevels: CompletionState[];
};

export enum CompletionState {
  Completed = 'completed',
  CompletedWithHelp = 'completed-with-help',
  NotCompleted = 'not-completed',
}
