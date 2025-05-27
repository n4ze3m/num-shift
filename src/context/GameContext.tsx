import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  generateDailyPuzzle,
  isDailyCompleted,
  markDailyCompleted,
  getTimeUntilNextDaily,
  hasLabAccess,
  grantLabAccess,
} from "../utils/gameUtils";
import type { Mutation, GameState, MutationHistory } from "../types/gameTypes";
import dayjs from "dayjs";

interface GameContextType {
  gameState: GameState;
  mutationHistory: MutationHistory[];
  currentNumber: string;
  performMutation: (mutation: Mutation) => void;
  undoLastMove: () => void;
  resetGame: () => void;
  progress: number;
  attemptsRemaining: number;
  isComplete: boolean;
  isDailyCompleted: boolean;
  timeUntilNextDaily: string;
  canPlayToday: boolean;
  hasLabAccess: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const today = dayjs().startOf("day").format("YYYY-MM-DD");
    const savedState = localStorage.getItem("evolveNumberGameState");

    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Check if the saved state is from today
      if (parsed.date === today) {
        return parsed;
      }
    }
    return generateDailyPuzzle();
  });

  const [mutationHistory, setMutationHistory] = useState<MutationHistory[]>(
    () => {
      const today = dayjs().startOf("day").format("YYYY-MM-DD");
      const savedHistory = localStorage.getItem("dailyMutationHistory");

      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (parsed.date === today) {
          return parsed.history || [];
        }
      }
      return [];
    }
  );

  const [currentNumber, setCurrentNumber] = useState(() => {
    const today = dayjs().startOf("day").format("YYYY-MM-DD");
    const savedCurrent = localStorage.getItem("dailyCurrentNumber");

    if (savedCurrent) {
      const parsed = JSON.parse(savedCurrent);
      if (parsed.date === today) {
        return parsed.number;
      }
    }
    return gameState.baseNumber;
  });

  const [isComplete, setIsComplete] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState(isDailyCompleted());
  const [timeUntilNextDaily] = useState(getTimeUntilNextDaily());
  const [canPlayToday, setCanPlayToday] = useState(!isDailyCompleted());
  const [labAccess, setLabAccess] = useState(hasLabAccess());

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
  const [attemptsRemaining, setAttemptsRemaining] = useState(() => {
    const today = dayjs().startOf("day").format("YYYY-MM-DD");
    const savedAttempts = localStorage.getItem("dailyAttemptsRemaining");

    if (savedAttempts) {
      const parsed = JSON.parse(savedAttempts);
      if (parsed.date === today) {
        return gameState.maxAttempts;
      }
    }
    return gameState.maxAttempts;
  });

  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
    const gameComplete = currentNumber === gameState.targetNumber;
    setIsComplete(gameComplete);

    // If game is completed, mark daily as completed and grant lab access
    if (gameComplete && !dailyCompleted) {
      markDailyCompleted();
      setDailyCompleted(true);
      setCanPlayToday(false);

      // Grant lab access when daily is completed
      if (!labAccess) {
        grantLabAccess();
        setLabAccess(true);
      }
    }

    // Save state to localStorage
    const today = dayjs().startOf("day").format("YYYY-MM-DD");

    localStorage.setItem(
      "evolveNumberGameState",
      JSON.stringify({
        ...gameState,
        date: today,
      })
    );

    localStorage.setItem(
      "dailyMutationHistory",
      JSON.stringify({
        history: mutationHistory,
        date: today,
      })
    );

    localStorage.setItem(
      "dailyCurrentNumber",
      JSON.stringify({
        number: currentNumber,
        date: today,
      })
    );

    localStorage.setItem(
      "dailyAttemptsRemaining",
      JSON.stringify({
        attempts: attemptsRemaining,
        date: today,
      })
    );
  }, [
    currentNumber,
    gameState,
    calculateProgress,
    mutationHistory,
    attemptsRemaining,
    dailyCompleted,
    labAccess,
  ]);

  const performMutation = useCallback(
    (mutation: Mutation) => {
      console.log(
        "Performing mutation:",
        mutation,
        isComplete,
        attemptsRemaining,
        canPlayToday
      );
      if (isComplete || attemptsRemaining <= 0 || !canPlayToday) {
        console.log(
          "Cannot perform mutation - game complete, no attempts remaining, or cannot play today"
        );
        return;
      }

      let newNumber = currentNumber;
      console.log("Current number:", currentNumber);

      switch (mutation.type) {
        case "swap":
          if (mutation.positions && mutation.positions.length === 2) {
            const [pos1, pos2] = mutation.positions;
            const chars = newNumber.split("");
            [chars[pos1], chars[pos2]] = [chars[pos2], chars[pos1]];
            newNumber = chars.join("");
            console.log("Performed swap mutation:", {
              pos1,
              pos2,
              result: newNumber,
            });
          }
          break;
        case "flip":
          if (mutation.position !== undefined && mutation.value !== undefined) {
            const chars = newNumber.split("");
            chars[mutation.position] = mutation.value;
            newNumber = chars.join("");
            console.log("Performed flip mutation:", {
              position: mutation.position,
              value: mutation.value,
              result: newNumber,
            });
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
              console.log("Performed shift mutation:", {
                position: posToMove,
                direction: mutation.direction,
                result: newNumber,
              });
            }
          }
          break;
        case "replace":
          if (mutation.position !== undefined && mutation.value !== undefined) {
            const chars = newNumber.split("");
            chars[mutation.position] = mutation.value;
            newNumber = chars.join("");
            console.log("Performed replace mutation:", {
              position: mutation.position,
              value: mutation.value,
              result: newNumber,
            });
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
            console.log("Performed bump mutation:", {
              position: mutation.position,
              direction: mutation.direction,
              from: currentDigit,
              to: newDigit,
              result: newNumber,
            });
          }
          break;
        default:
          console.log("Unknown mutation type:", mutation.type);
          break;
      }

      setMutationHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            mutation,
            before: currentNumber,
            after: newNumber,
          },
        ];
        console.log("Updated mutation history:", newHistory);
        return newHistory;
      });

      setCurrentNumber(newNumber);
      setAttemptsRemaining((prev) => {
        const newAttempts = prev - 1;
        console.log("Attempts remaining:", newAttempts);
        return newAttempts;
      });
    },
    [currentNumber, isComplete, attemptsRemaining, canPlayToday]
  );

  const undoLastMove = useCallback(() => {
    if (mutationHistory.length > 0 && canPlayToday && !isComplete) {
      const lastMove = mutationHistory[mutationHistory.length - 1];
      setCurrentNumber(lastMove.before);
      setMutationHistory((prev) => prev.slice(0, -1));
      setAttemptsRemaining((prev) => prev + 1);
    }
  }, [mutationHistory, canPlayToday, isComplete]);

  const resetGame = useCallback(() => {
    // Only allow reset if it's a new day or daily not completed
    if (!canPlayToday && dailyCompleted) return;

    const newGame = generateDailyPuzzle();
    setGameState(newGame);
    setCurrentNumber(newGame.baseNumber);
    setMutationHistory([]);
    setAttemptsRemaining(newGame.maxAttempts);
    setIsComplete(false);

    const today = dayjs().startOf("day").format("YYYY-MM-DD");
    localStorage.setItem(
      "evolveNumberGameState",
      JSON.stringify({
        ...newGame,
        date: today,
      })
    );
  }, [canPlayToday, dailyCompleted]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        mutationHistory,
        currentNumber,
        performMutation,
        undoLastMove,
        resetGame,
        progress,
        attemptsRemaining,
        isComplete,
        isDailyCompleted: dailyCompleted,
        timeUntilNextDaily,
        canPlayToday,
        hasLabAccess: isComplete,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
