// Game Types

export type MutationType = 'swap' | 'flip' | 'shift' | 'replace' | 'bump';

export interface Mutation {
  type: MutationType;
  positions?: number[];
  position?: number;
  value?: string;
  direction?: 'left' | 'right' | "increment" | "decrement";
}

export interface MutationHistory {
  mutation: Mutation;
  before: string;
  after: string;
}

export interface GameState {
  baseNumber: string;
  targetNumber: string;
  mutationPool: string[];
  flipMap: Record<string, string>;
  maxAttempts: number;
  date?: string;
  availableMutations: MutationType[];
  lockedPositions?: number[];
  specialPatterns?: Array<{
    pattern: RegExp;
    bonus: number;
    description: string;
  }>;
}

export interface GameScore {
  moves: number;
  optimalMoves: number;
  streakDays: number;
  usedAllMutationTypes: boolean;
  bonusPoints: number;
  totalScore: number;
  date: string;
}