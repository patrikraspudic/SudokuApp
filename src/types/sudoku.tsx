export type LeaderboardEntry = {
  id: string;
  name: string;
  seconds: number;
  date: string;
  puzzleId: string;
};

export type Puzzle = {
  id: string;
  puzzle: number[];
  solution: number[];
};
