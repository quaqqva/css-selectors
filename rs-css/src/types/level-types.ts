import { MarkupParameters } from './default';

export type LevelData = {
  task: string;
  tableItems: TableItemData[];
};

export type TableItemData = {
  tag: string;
  id: string;
  classes: string[];
  attributes: { [attribute: string]: string };
  children: TableItemData[];
};

export type TableItemMarkup = Omit<MarkupParameters, 'parentNode'>;
