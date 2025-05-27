import React, { useState } from "react";
import { useLab } from "../context/LabContext";
import { useGame } from "../context/GameContext";
import { NumberDisplay } from "./NumberDisplay";
import { MutationControls } from "./MutationControls";
import { ProgressBar } from "./ProgressBar";
import { RefreshCw, RotateCcw, ArrowRight, Lock, Zap } from "lucide-react";
import { Link } from "react-router";

export const LabBoard: React.FC = () => {
  const { hasLabAccess } = useGame();
  const {
    currentNumber,
    gameState,
    mutationHistory,
    undoLastMove,
    resetLevel,
    nextLevel,
    progress,
    attemptsRemaining,
    isComplete,
    performMutation,
    currentLevel,
  } = useLab();

  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [activeMutation, setActiveMutation] = useState<string | null>(null);

  if (!hasLabAccess) {
    return (
      <div className="w-full max-w-4xl mx-auto sm:px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-purple-200 shadow-xl p-8 text-center">
          <div className="mb-6">
            <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-instrument font-bold text-gray-800 mb-2">
              🧪 Mutation Lab Locked
            </h2>
            <p className="text-gray-600 mb-6">
              Complete a daily challenge to unlock the endless Mutation Lab and
              test your skills across infinite generations!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5" />
              Play Daily Challenge
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      return;
    }

    if (activeMutation === "swap") {
      handleSecondDigitForSwap(index);
      return;
    }

    setSelectedDigit((prevSelected) => {
      if (
        activeMutation === "swap" &&
        prevSelected !== null &&
        prevSelected !== index
      ) {
        return index;
      }
      return prevSelected === index ? null : index;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto sm:px-4">
      {/* Header Section */}
      <div className="mb-4 sm:mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-purple-200 p-3 sm:p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-2xl font-instrument font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  🧪 Mutation Lab
                  <span className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-lg">
                    Gen {currentLevel}
                  </span>
                </h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 self-end sm:self-auto">
              {mutationHistory.length > 0 && (
                <button
                  onClick={undoLastMove}
                  className="group p-2 sm:p-3 bg-white border-2 border-gray-200 hover:border-purple-300 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Undo last move"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-500 transition-colors" />
                </button>
              )}
              <button
                onClick={resetLevel}
                className="group p-2 sm:p-3 bg-white border-2 border-gray-200 hover:border-purple-300 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md"
                title="Reset generation"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-200/50 gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Moves:</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                  {mutationHistory.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Attempts Left:</span>
                <span
                  className={`px-2 py-1 rounded-lg font-semibold ${
                    attemptsRemaining <= 2
                      ? "bg-red-100 text-red-700"
                      : "bg-purple-100 text-purple-700"
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
                ? "🎉 Generation Complete!"
                : `${Math.round(progress)}% Complete`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Board */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-purple-200 shadow-xl overflow-hidden">
        {/* Target Section */}
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 p-2 sm:p-6 border-b border-purple-200">
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
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-gradient-to-br from-purple-200 to-blue-200 text-purple-700 rounded-xl sm:rounded-2xl border border-purple-300 shadow-sm"
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
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 text-center">
              <div className="mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-instrument font-bold text-green-800 mb-2">
                  Generation {currentLevel} Complete!
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={nextLevel}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Next Generation
                  </button>
                  <button
                    onClick={resetLevel}
                    className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                  >
                    Retry Generation
                  </button>
                </div>
              </div>
            </div>
          ) : attemptsRemaining === 0 ? (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200 text-center">
              <div className="mb-4">
                <div className="text-4xl mb-2">💥</div>
                <h3 className="text-xl font-instrument font-bold text-red-800 mb-2">
                  Generation Failed!
                </h3>
                <p className="text-red-700 mb-4">
                  No attempts remaining. Try again!
                </p>
                <button
                  onClick={resetLevel}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-5 h-5 inline mr-2" />
                  Try Again
                </button>
              </div>
            </div>
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
                  currentNumber={currentNumber}
                  performMutation={performMutation}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="hidden sm:block fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
