import { FLIP_MAP, NumberGenerator } from "../lib/generator";
import type { GameState, MutationType } from "../types/gameTypes";
import dayjs from "dayjs";
// enable utc
import dayjsUtc from "dayjs/plugin/utc";
dayjs.extend(dayjsUtc);

export const seedRandom = (seed: string): (() => number) => {
  let s = Array.from(seed).reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export const generateDailyPuzzle = (): GameState => {
  const startOfDay = dayjs().utc().startOf("day")
  const seed = startOfDay.unix()
  const generator = new NumberGenerator(seed);
  generator.setDebug(false);
  const puzzle = generator.generatePuzzle();
  
  const specialPatterns = [
    {
      pattern: /(\d)\1{2,}/,
      bonus: 5,
      description: "Three or more identical digits in a row",
    },
    {
      pattern: /(\d)(\d)(\d)\3\2\1/,
      bonus: 10,
      description: "Palindrome sequence",
    },
    {
      pattern: /012|123|234|345|456|567|678|789|890/,
      bonus: 7,
      description: "Sequence of ascending digits",
    },
  ];

  const totalMovements = puzzle.operations.length;
  const maxAttempts = Math.floor(totalMovements * 1.2);

  return {
    baseNumber: puzzle.base,
    targetNumber: puzzle.target,
    mutationPool: puzzle.mutationPool,
    flipMap: FLIP_MAP,
    maxAttempts,
    availableMutations: [
      "swap",
      "flip",
      // "shift",
      "replace",
      "bump"
    ],
    lockedPositions: [],
    specialPatterns,
  };
};

export const isDailyCompleted = (): boolean => {
  const today = dayjs().startOf("day").add(1, "day").format("YYYY-MM-DD");
  const completedDate = localStorage.getItem('dailyChallengeCompleted');
  return completedDate === today;
};

// Mark daily challenge as completed
export const markDailyCompleted = (): void => {
  const today = dayjs().startOf("day").format("YYYY-MM-DD");
  localStorage.setItem('dailyChallengeCompleted', today);
};

// Get time until next daily challenge
export const getTimeUntilNextDaily = (): string => {
  const now = dayjs();
  const nextDay = now.add(1, 'day').startOf('day');
  const diff = nextDay.diff(now);
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const calculateOptimalMoves = (
  baseNumber: string,
  targetNumber: string
): number => {
  let differences = 0;
  for (let i = 0; i < baseNumber.length; i++) {
    if (baseNumber[i] !== targetNumber[i]) {
      differences++;
    }
  }
  return Math.max(1, Math.floor(differences * 0.7));
};

export const getMutationEmoji = (type: MutationType): string => {
  switch (type) {
    case "swap":
      return "🔄";
    case "flip":
      return "🔁";
    case "shift":
      return "↔️";
    case "replace":
      return "🔢";
    case "bump":
      return "🔼";
    default:
      return "❓";
  }
};

export const formatShareText = (
  history: any[],
  baseNumber: string,
  targetNumber: string,
  moves: number
): string => {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const emojiPath = history
    .map((h) => getMutationEmoji(h.mutation.type))
    .join("");

  return `Daily Num Shift (${today})\n${baseNumber} → ${targetNumber}\nSolved in ${moves} moves\n${emojiPath}`;
};


export const hasLabAccess = (): boolean => {
  return localStorage.getItem("labAccess") === "true";
};

export const grantLabAccess = (): void => {
  localStorage.setItem("labAccess", "true");
};

export const revokeLabAccess = (): void => {
  localStorage.removeItem("labAccess");
};