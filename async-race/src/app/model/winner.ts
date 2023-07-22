export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerViewData = Omit<Winner, 'id'>;
