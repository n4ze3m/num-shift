import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { NumberDisplay } from "./NumberDisplay";
import { MutationControls } from "./MutationControls";
import { ProgressBar } from "./ProgressBar";
import { ShareResults } from "./ShareResults";
import { RefreshCw, RotateCcw, Calendar } from "lucide-react";

export const GameBoard: React.FC = () => {
  const {
    currentNumber,
    gameState,
    mutationHistory,
    undoLastMove,
    resetGame,
    progress,
    attemptsRemaining,
    isComplete,
    performMutation,
  } = useGame();

  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [activeMutation, setActiveMutation] = useState<string | null>(null);
  
  const handleSecondDigitForSwap = (index: number) => {
    if (selectedDigit === null || index === selectedDigit) return;

    performMutation({
      type: "swap",
      positions: [selectedDigit, index],
    });

    setSelectedDigit(null);
    setActiveMutation(null);
  };
  
  const handleDigitClick = (index: number) => {
    if (gameState.lockedPositions?.includes(index)) {
      return; // Don't select locked positions
    }

    if (activeMutation === "swap") {
      handleSecondDigitForSwap(index);
      return;
    }

    setSelectedDigit((prevSelected) => {
      // If we have an active mutation and a selected digit
      if (
        activeMutation === "swap" &&
        prevSelected !== null &&
        prevSelected !== index
      ) {
        return index; // Store the second digit for swap
      }
      return prevSelected === index ? null : index;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto sm:px-4">
      {/* Header Section */}
      <div className="mb-4 sm:mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-bColor/20 p-3 sm:p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-2xl font-instrument font-semibold text-gray-800 mb-1">
                  Daily Num Shift
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <p className="text-xs sm:text-sm font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 self-end sm:self-auto">
              {mutationHistory.length > 0 && (
                <button
                  onClick={undoLastMove}
                  className="group p-2 sm:p-3 bg-white border-2 border-gray-200 hover:border-bColor/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Undo last move"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-bColor transition-colors" />
                </button>
              )}
              <button
                onClick={resetGame}
                className="group p-2 sm:p-3 bg-white border-2 border-gray-200 hover:border-bColor/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md"
                title="Reset game"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-bColor transition-colors" />
              </button>
            </div>
          </div>

          {/* Game Stats in Header - Less Prominent */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-200/50 gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Moves:</span>
                <span className="px-2 py-1 bg-gray-100 rounded-lg font-semibold">
                  {mutationHistory.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Attempts Left:</span>
                <span
                  className={`px-2 py-1 rounded-lg font-semibold ${
                    attemptsRemaining <= 2
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {attemptsRemaining}
                </span>
              </div>
            </div>
            <div
              className={`text-xs sm:text-sm font-medium ${
                isComplete ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isComplete
                ? "🎉 Complete!"
                : `${Math.round(progress)}% Complete`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Board */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-bColor/30 shadow-xl overflow-hidden">
        {/* Target Section */}
        <div className="bg-gradient-to-r from-bColor/10 via-bColor/5 to-transparent p-2 sm:p-6 border-b border-bColor/20">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-instrument font-semibold text-gray-800 mb-1">
                Target Number
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Transform your number to match this target
              </p>
            </div>
          </div>

          <div className="flex justify-center sm:justify-start items-center mb-3 sm:mb-4">
            <div className="flex gap-2 sm:gap-3">
              {gameState.targetNumber.split("").map((digit, i) => (
                <div
                  key={`target-${i}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-gradient-to-br from-bColor/20 to-bColor/10 text-bColor rounded-xl sm:rounded-2xl border border-bColor/20 shadow-sm"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>

          <ProgressBar progress={progress} />
        </div>

        {/* Current Number Display */}
        <div className="p-1 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-instrument font-semibold text-gray-800 mb-2 sm:mb-3">
              Current Number
            </h3>
            <NumberDisplay
              number={currentNumber}
              targetNumber={gameState.targetNumber}
              lockedPositions={gameState.lockedPositions || []}
              selectedDigit={selectedDigit}
              onDigitClick={handleDigitClick}
            />
          </div>

          {isComplete ? (
             
              <ShareResults
                history={mutationHistory}
                baseNumber={gameState.baseNumber}
                targetNumber={gameState.targetNumber}
              />
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Mutation Controls */}
              <div className="bg-gray-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
                  <h3 className="text-base sm:text-lg font-instrument font-semibold text-gray-800">
                    Available Mutations
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Select a number to apply mutations.
                  </p>
                </div>
                <MutationControls
                  availableMutations={gameState.availableMutations}
                  mutationPool={gameState.mutationPool}
                  flipMap={gameState.flipMap}
                  selectedDigit={selectedDigit}
                  setSelectedDigit={setSelectedDigit}
                  activeMutation={activeMutation}
                  setActiveMutation={setActiveMutation}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements - Hidden on mobile for performance */}
      <div className="hidden sm:block fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-bColor/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-bColor/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bColor/2 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
