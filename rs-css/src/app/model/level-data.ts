export type LevelData = {
  task: string;
  solution: string;
  tableItems: TableItemData[];
  description: string;
};

export type NumeratedLevel = LevelData & { index: number };

export type TableItemData = {
  tag: string;
  id?: string;
  classes?: string[];
  attributes?: { [attribute: string]: string };
  children?: TableItemData[];
};

export type TableItemMarkup = Omit<TableItemData, 'children'>;

export type UserData = {
  currentLevel: number;
  completedLevels: boolean[];
};
