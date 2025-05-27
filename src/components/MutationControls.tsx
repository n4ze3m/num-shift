import React from "react";
import { useGame } from "../context/GameContext";
import type { MutationType } from "../types/gameTypes";
import { RefreshCw, ArrowLeftRight, RotateCcw, Hash, Plus } from "lucide-react";

interface MutationControlsProps {
  availableMutations: MutationType[];
  mutationPool: string[];
  flipMap: Record<string, string>;
  selectedDigit: number | null;
  setSelectedDigit: (index: number | null) => void;
  activeMutation: string | null;
  setActiveMutation: (type: string | null) => void;
}

export const MutationControls: React.FC<MutationControlsProps> = ({
  availableMutations,
  mutationPool,
  flipMap,
  selectedDigit,
  setSelectedDigit,
  activeMutation,
  setActiveMutation,
}) => {
  const { currentNumber, performMutation } = useGame();

  const handleMutationClick = (type: MutationType) => {
    if (selectedDigit === null) return;

    //@ts-expect-error
    setActiveMutation((prevActive) => (prevActive === type ? null : type));

    if (type === "swap") {
      return;
    }

    if (type === "flip") {
      const selectedDigitValue = currentNumber[selectedDigit];
      const flippedValue = flipMap[selectedDigitValue];

      if (flippedValue) {
        performMutation({
          type: "flip",
          position: selectedDigit,
          value: flippedValue,
        });
        setSelectedDigit(null);
        setActiveMutation(null);
      }
    }

    if (type === "bump") {
      // Show shift options
    }
  };
  // Replace handleShiftDirection with:
  const handleBumpDirection = (direction: "increment" | "decrement") => {
    if (selectedDigit === null) return;

    performMutation({
      type: "bump",
      position: selectedDigit,
      direction,
    });

    setSelectedDigit(null);
    setActiveMutation(null);
  };

  const handleShiftDirection = (direction: "left" | "right") => {
    if (selectedDigit === null) return;

    performMutation({
      type: "shift",
      position: selectedDigit,
      direction,
    });

    setSelectedDigit(null);
    setActiveMutation(null);
  };

  const handleReplaceWithDigit = (digit: string) => {
    if (selectedDigit === null) return;

    performMutation({
      type: "replace",
      position: selectedDigit,
      value: digit,
    });

    setSelectedDigit(null);
    setActiveMutation(null);
  };

  return (
    <div className="space-y-6">
      {/* Mutation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {availableMutations.includes("swap") && (
          <button
            onClick={() => handleMutationClick("swap")}
            className={`
              group relative flex items-center justify-center gap-2 py-4 px-4 rounded-2xl 
              transition-all duration-200 border-2 font-medium
              ${
                activeMutation === "swap"
                  ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-600 shadow-lg"
                  : "bg-white border-purple-200 text-purple-700 hover:border-purple-400 hover:shadow-md"
              }
              ${selectedDigit === null ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={selectedDigit === null}
            title={
              selectedDigit === null
                ? "Select a digit first"
                : "Select another digit to swap with"
            }
          >
            <RefreshCw
              size={18}
              className="transition-transform group-hover:rotate-180"
            />
            <span className="font-instrument">Swap</span>
          </button>
        )}

        {availableMutations.includes("flip") && (
          <button
            onClick={() => handleMutationClick("flip")}
            className={`
              group relative flex items-center justify-center gap-2 py-4 px-4 rounded-2xl 
              transition-all duration-200 border-2 font-medium
              ${
                activeMutation === "flip"
                  ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white border-teal-600 shadow-lg"
                  : "bg-white border-teal-200 text-teal-700 hover:border-teal-400 hover:shadow-md"
              }
              ${selectedDigit === null ? "opacity-50 cursor-not-allowed" : ""}
              ${
                selectedDigit !== null && !flipMap[currentNumber[selectedDigit]]
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
            disabled={
              selectedDigit === null || !flipMap[currentNumber[selectedDigit]]
            }
            title={
              selectedDigit === null
                ? "Select a digit first"
                : selectedDigit !== null &&
                  !flipMap[currentNumber[selectedDigit]]
                ? `Digit ${currentNumber[selectedDigit]} cannot be flipped`
                : `Flip ${currentNumber[selectedDigit]} to ${
                    flipMap[currentNumber[selectedDigit]]
                  }`
            }
          >
            <RotateCcw
              size={18}
              className="transition-transform group-hover:-rotate-90"
            />
            <span className="font-instrument">Flip</span>
            {selectedDigit !== null &&
              flipMap[currentNumber[selectedDigit]] && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  →{flipMap[currentNumber[selectedDigit]]}
                </span>
              )}
          </button>
        )}

        {availableMutations.includes("shift") && (
          <button
            onClick={() => handleMutationClick("shift")}
            className={`
              group relative flex items-center justify-center gap-2 py-4 px-4 rounded-2xl 
              transition-all duration-200 border-2 font-medium
              ${
                activeMutation === "shift"
                  ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-600 shadow-lg"
                  : "bg-white border-amber-200 text-amber-700 hover:border-amber-400 hover:shadow-md"
              }
              ${selectedDigit === null ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={selectedDigit === null}
            title={
              selectedDigit === null
                ? "Select a digit first"
                : "Choose direction to shift the digit"
            }
          >
            <ArrowLeftRight
              size={18}
              className="transition-transform group-hover:scale-110"
            />
            <span className="font-instrument">Shift</span>
          </button>
        )}

        {availableMutations.includes("replace") && (
          <button
            onClick={() => handleMutationClick("replace")}
            className={`
              group relative flex items-center justify-center gap-2 py-4 px-4 rounded-2xl 
              transition-all duration-200 border-2 font-medium
              ${
                activeMutation === "replace"
                  ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg"
                  : "bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400 hover:shadow-md"
              }
              ${selectedDigit === null ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={selectedDigit === null}
            title={
              selectedDigit === null
                ? "Select a digit first"
                : "Replace with a digit from mutation pool"
            }
          >
            <Hash
              size={18}
              className="transition-transform group-hover:rotate-12"
            />
            <span className="font-instrument">Replace</span>
          </button>
        )}

        {availableMutations.includes("bump") && (
          <button
            onClick={() => handleMutationClick("bump")}
            className={`
      group relative flex items-center justify-center gap-2 py-4 px-4 rounded-2xl 
      transition-all duration-200 border-2 font-medium
      ${
        activeMutation === "bump"
          ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-lg"
          : "bg-white border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:shadow-md"
      }
      ${selectedDigit === null ? "opacity-50 cursor-not-allowed" : ""}
    `}
            disabled={selectedDigit === null}
            title={
              selectedDigit === null
                ? "Select a digit first"
                : "Increment or decrement the digit by 1"
            }
          >
            <Plus
              size={18}
              className="transition-transform group-hover:scale-110"
            />
            <span className="font-instrument">Bump</span>
          </button>
        )}
      </div>

      {selectedDigit !== null && activeMutation === "swap" && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-50/50 border-2 border-purple-200 rounded-2xl p-6">
          <div className="mb-4">
            <h4 className="font-instrument font-semibold text-purple-800 mb-1">
              Swap Digits
            </h4>
            <p className="text-sm text-purple-700">
              Click on the number you want to swap{" "}
              <span className="font-bold bg-purple-100 px-2 py-1 rounded">
                {currentNumber[selectedDigit]}
              </span>{" "}
              from position {selectedDigit + 1} with
            </p>
          </div>
        </div>
      )}

      {selectedDigit !== null && activeMutation === "shift" && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-50/50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="mb-4">
            <h4 className="font-instrument font-semibold text-amber-800 mb-1">
              Shift Position
            </h4>
            <p className="text-sm text-amber-700">
              Move digit{" "}
              <span className="font-bold bg-amber-100 px-2 py-1 rounded">
                {currentNumber[selectedDigit]}
              </span>{" "}
              from position {selectedDigit + 1} to an adjacent position
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleShiftDirection("left")}
              disabled={selectedDigit === 0}
              className={`
                py-3 px-6 rounded-2xl flex items-center gap-2 font-medium
                transition-all duration-200 border-2
                ${
                  selectedDigit === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-amber-700 hover:bg-amber-100 border-amber-300 hover:border-amber-400 hover:shadow-md"
                }
              `}
              title={
                selectedDigit === 0
                  ? "Cannot shift left from first position"
                  : `Move to position ${selectedDigit}`
              }
            >
              ← Left
            </button>
            <button
              onClick={() => handleShiftDirection("right")}
              disabled={selectedDigit === currentNumber.length - 1}
              className={`
                py-3 px-6 rounded-2xl flex items-center gap-2 font-medium
                transition-all duration-200 border-2
                ${
                  selectedDigit === currentNumber.length - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-amber-700 hover:bg-amber-100 border-amber-300 hover:border-amber-400 hover:shadow-md"
                }
              `}
              title={
                selectedDigit === currentNumber.length - 1
                  ? "Cannot shift right from last position"
                  : `Move to position ${selectedDigit + 2}`
              }
            >
              Right →
            </button>
          </div>
        </div>
      )}
      {selectedDigit !== null && activeMutation === "bump" && (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-2 border-emerald-200 rounded-2xl p-6">
          <div className="mb-4">
            <h4 className="font-instrument font-semibold text-emerald-800 mb-1">
              Bump Digit
            </h4>
            <p className="text-sm text-emerald-700">
              Increment or decrement digit{" "}
              <span className="font-bold bg-emerald-100 px-2 py-1 rounded">
                {currentNumber[selectedDigit]}
              </span>{" "}
              at position {selectedDigit + 1} by 1 (wraps around 0-9)
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleBumpDirection("decrement")}
              className="py-3 px-6 rounded-2xl flex items-center gap-2 font-medium transition-all duration-200 border-2 bg-white text-emerald-700 hover:bg-emerald-100 border-emerald-300 hover:border-emerald-400 hover:shadow-md"
              title={`Decrease to ${
                currentNumber[selectedDigit] === "0"
                  ? "9"
                  : (parseInt(currentNumber[selectedDigit]) - 1).toString()
              }`}
            >
              - Decrement
            </button>
            <button
              onClick={() => handleBumpDirection("increment")}
              className="py-3 px-6 rounded-2xl flex items-center gap-2 font-medium transition-all duration-200 border-2 bg-white text-emerald-700 hover:bg-emerald-100 border-emerald-300 hover:border-emerald-400 hover:shadow-md"
              title={`Increase to ${
                currentNumber[selectedDigit] === "9"
                  ? "0"
                  : (parseInt(currentNumber[selectedDigit]) + 1).toString()
              }`}
            >
              + Increment
            </button>
          </div>
        </div>
      )}
      {selectedDigit !== null && activeMutation === "replace" && (
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 border-2 border-indigo-200 rounded-2xl p-6">
          <div className="mb-4">
            <h4 className="font-instrument font-semibold text-indigo-800 mb-1">
              Replace Digit from Mutation Pool
            </h4>
            <p className="text-sm text-indigo-700">
              Replace{" "}
              <span className="font-bold bg-indigo-100 px-2 py-1 rounded">
                {currentNumber[selectedDigit]}
              </span>{" "}
              at position {selectedDigit + 1} with one of these available digits
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {mutationPool
              .filter((digit) => digit !== currentNumber[selectedDigit])
              .map((digit, index) => (
                <button
                  key={`replace-${index}`}
                  onClick={() => handleReplaceWithDigit(digit)}
                  className="w-12 h-12 flex items-center justify-center bg-white text-indigo-700 hover:bg-indigo-100 rounded-2xl border-2 border-indigo-300 hover:border-indigo-400 font-bold text-lg transition-all duration-200 hover:shadow-md"
                  title={`Replace with ${digit}`}
                >
                  {digit}
                </button>
              ))}
          </div>
          {mutationPool.filter(
            (digit) => digit !== currentNumber[selectedDigit]
          ).length === 0 && (
            <p className="text-sm text-indigo-600 italic">
              No different digits available in today's mutation pool for
              replacement.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
