import React from "react";
import { Lock } from "lucide-react";

interface NumberDisplayProps {
  number: string;
  targetNumber: string;
  lockedPositions: number[];
  selectedDigit: number | null;
  onDigitClick: (index: number) => void;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = ({
  number,
  targetNumber,
  lockedPositions,
  selectedDigit,
  onDigitClick,
}) => {
  return (
    <div className="relative">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-bColor/5 via-transparent to-bColor/5 rounded-3xl blur-xl"></div>

      <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-bColor/20 p-3 sm:p-8 ">
        {/* Header with Icon */}

        {/* Number Display Grid */}
        <div className="flex items-center justify-center gap-1 sm:gap-4">
          {number.split("").map((digit, index) => {
            const isLocked = lockedPositions.includes(index);
            const isSelected = selectedDigit === index;
            const isCorrect = digit === targetNumber[index];

            return (
              <div key={`digit-container-${index}`} className="relative group">
                {/* Digit Button */}
                <button
                  onClick={() => onDigitClick(index)}
                  disabled={isLocked}
                  className={`
                    relative w-11 h-11 sm:w-16 sm:h-20 text-2xl sm:text-3xl font-bold rounded-2xl transition-all duration-300 transform-gpu
                    ${
                      isLocked
                        ? "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed shadow-inner"
                        : "cursor-pointer"
                    }
                    ${
                      isSelected
                        ? "bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-100 border-3 border-amber-400 -translate-y-3 shadow-2xl ring-4 ring-amber-200/50"
                        : isCorrect
                        ? "bg-gradient-to-br from-green-200 via-green-100 to-emerald-100 border-2 border-green-300"
                        : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-2 border-gray-200"
                    }
                    ${
                      isCorrect
                        ? "text-green-700"
                        : isSelected
                        ? "text-amber-800"
                        : "text-gray-800"
                    }
                    ${
                      !isLocked && !isSelected
                        ? "hover:bg-gradient-to-br hover:from-bColor/20 hover:via-bColor/10 hover:to-purple-100 hover:-translate-y-2 hover:border-bColor/40"
                        : ""
                    }
                  `}
                  aria-label={`Digit ${digit} at position ${index + 1}`}
                >
                  {/* Digit Content */}
                  <span className="relative z-10">{digit}</span>

                  {/* Animated Background for Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-yellow-300/30 rounded-2xl animate-pulse"></div>
                  )}

                  {/* Correct Match Glow */}
                  {isCorrect && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-2xl animate-pulse"></div>
                  )}
                </button>

                {/* Lock Icon */}
                {isLocked && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
                    <div className="absolute top-0 w-3 h-3 bg-amber-600 rounded-full"></div>
                  </div>
                )}

                {/* Hover Effect Glow */}
                {!isLocked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-bColor/10 to-purple-200/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm scale-110"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute top-4 left-8 w-2 h-2 bg-bColor/20 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-12 w-1 h-1 bg-purple-300/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-8 left-16 w-1.5 h-1.5 bg-bColor/15 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-16 right-8 w-1 h-1 bg-purple-200/40 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
};
