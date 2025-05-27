import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { generateLabPuzzle } from "../utils/labUtils";
import type { Mutation, GameState, MutationHistory } from "../types/gameTypes";

interface LabContextType {
  gameState: GameState;
  mutationHistory: MutationHistory[];
  currentNumber: string;
  performMutation: (mutation: Mutation) => void;
  undoLastMove: () => void;
  nextLevel: () => void;
  resetLevel: () => void;
  progress: number;
  attemptsRemaining: number;
  isComplete: boolean;
  currentLevel: number;
  totalScore: number;
  levelScore: number;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error("useLab must be used within a LabProvider");
  }
  return context;
};

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem("labCurrentLevel");
    return saved ? parseInt(saved) : 1;
  });

  const [totalScore, setTotalScore] = useState(() => {
    const saved = localStorage.getItem("labTotalScore");
    return saved ? parseInt(saved) : 0;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    return generateLabPuzzle(currentLevel);
  });

  const [mutationHistory, setMutationHistory] = useState<MutationHistory[]>([]);
  const [currentNumber, setCurrentNumber] = useState(gameState.baseNumber);
  const [isComplete, setIsComplete] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(gameState.maxAttempts);

  // Calculate progress based on digit matches
  const calculateProgress = useCallback(() => {
    const target = gameState.targetNumber;
    const current = currentNumber;

    let matches = 0;
    for (let i = 0; i < current.length; i++) {
      if (current[i] === target[i]) {
        matches++;
      }
    }
    return (matches / target.length) * 100;
  }, [currentNumber, gameState.targetNumber]);

  const [progress, setProgress] = useState(calculateProgress());

  // Calculate level score based on efficiency
  const calculateLevelScore = useCallback(() => {
    if (!isComplete) return 0;
    
    const baseScore = currentLevel * 100;
    const efficiencyBonus = Math.max(0, (attemptsRemaining / gameState.maxAttempts) * 50);
    const moveBonus = Math.max(0, 50 - mutationHistory.length * 2);
    
    return Math.round(baseScore + efficiencyBonus + moveBonus);
  }, [isComplete, currentLevel, attemptsRemaining, gameState.maxAttempts, mutationHistory.length]);

  const [levelScore, setLevelScore] = useState(0);

  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
    const gameComplete = currentNumber === gameState.targetNumber;
    setIsComplete(gameComplete);

    if (gameComplete && levelScore === 0) {
      const score = calculateLevelScore();
      setLevelScore(score);
    }

    // Save progress to localStorage
    localStorage.setItem("labCurrentLevel", currentLevel.toString());
    localStorage.setItem("labTotalScore", totalScore.toString());
  }, [currentNumber, gameState.targetNumber, calculateProgress, calculateLevelScore, levelScore, currentLevel, totalScore]);

  const performMutation = useCallback(
    (mutation: Mutation) => {
      if (isComplete || attemptsRemaining <= 0) {
        return;
      }

      let newNumber = currentNumber;

      switch (mutation.type) {
        case "swap":
          if (mutation.positions && mutation.positions.length === 2) {
            const [pos1, pos2] = mutation.positions;
            const chars = newNumber.split("");
            [chars[pos1], chars[pos2]] = [chars[pos2], chars[pos1]];
            newNumber = chars.join("");
          }
          break;
        case "flip":
          if (mutation.position !== undefined && mutation.value !== undefined) {
            const chars = newNumber.split("");
            chars[mutation.position] = mutation.value;
            newNumber = chars.join("");
          }
          break;
        case "shift":
          if (
            mutation.position !== undefined &&
            mutation.direction !== undefined
          ) {
            const chars = newNumber.split("");
            const posToMove = mutation.position;
            const newPos =
              mutation.direction === "left"
                ? Math.max(0, posToMove - 1)
                : Math.min(chars.length - 1, posToMove + 1);

            if (posToMove !== newPos) {
              const digit = chars[posToMove];
              chars.splice(posToMove, 1);
              chars.splice(newPos, 0, digit);
              newNumber = chars.join("");
            }
          }
          break;
        case "replace":
          if (mutation.position !== undefined && mutation.value !== undefined) {
            const chars = newNumber.split("");
            chars[mutation.position] = mutation.value;
            newNumber = chars.join("");
          }
          break;
        case "bump":
          if (
            mutation.position !== undefined &&
            mutation.direction !== undefined
          ) {
            const chars = newNumber.split("");
            const currentDigit = parseInt(chars[mutation.position]);

            let newDigit: number;
            if (mutation.direction === "decrement") {
              newDigit = currentDigit === 0 ? 9 : currentDigit - 1;
            } else {
              newDigit = currentDigit === 9 ? 0 : currentDigit + 1;
            }

            chars[mutation.position] = newDigit.toString();
            newNumber = chars.join("");
          }
          break;
      }

      setMutationHistory((prev) => [
        ...prev,
        {
          mutation,
          before: currentNumber,
          after: newNumber,
        },
      ]);

      setCurrentNumber(newNumber);
      setAttemptsRemaining((prev) => prev - 1);
    },
    [currentNumber, isComplete, attemptsRemaining]
  );

  const undoLastMove = useCallback(() => {
    if (mutationHistory.length > 0 && !isComplete) {
      const lastMove = mutationHistory[mutationHistory.length - 1];
      setCurrentNumber(lastMove.before);
      setMutationHistory((prev) => prev.slice(0, -1));
      setAttemptsRemaining((prev) => prev + 1);
    }
  }, [mutationHistory, isComplete]);

  const nextLevel = useCallback(() => {
    if (!isComplete) return;

    const newLevel = currentLevel + 1;
    const newTotalScore = totalScore + levelScore;
    
    setCurrentLevel(newLevel);
    setTotalScore(newTotalScore);
    
    const newGame = generateLabPuzzle(newLevel);
    setGameState(newGame);
    setCurrentNumber(newGame.baseNumber);
    setMutationHistory([]);
    setAttemptsRemaining(newGame.maxAttempts);
    setIsComplete(false);
    setLevelScore(0);
  }, [isComplete, currentLevel, totalScore, levelScore]);

  const resetLevel = useCallback(() => {
    const newGame = generateLabPuzzle(currentLevel);
    setGameState(newGame);
    setCurrentNumber(newGame.baseNumber);
    setMutationHistory([]);
    setAttemptsRemaining(newGame.maxAttempts);
    setIsComplete(false);
    setLevelScore(0);
  }, [currentLevel]);

  return (
    <LabContext.Provider
      value={{
        gameState,
        mutationHistory,
        currentNumber,
        performMutation,
        undoLastMove,
        nextLevel,
        resetLevel,
        progress,
        attemptsRemaining,
        isComplete,
        currentLevel,
        totalScore,
        levelScore,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};