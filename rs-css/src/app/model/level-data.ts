export type LevelData = {
  task: string;
  solution: string;
  tableItems: TableItemData[];
};

export type TableItemData = {
  tag: string;
  id?: string;
  classes?: string[];
  attributes?: { [attribute: string]: string };
  children?: TableItemData[];
};

export type TableItemMarkup = Omit<TableItemData, 'children'>;
