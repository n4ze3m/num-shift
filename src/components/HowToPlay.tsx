import React from "react";
import {
  ArrowLeftRight,
  RefreshCw,
  RotateCcw,
  Hash,
  Target,
  Lightbulb,
} from "lucide-react";

export const HowToPlay: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 mt-8 sm:mt-12">
      {/* Main Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-bColor/30 shadow-xl overflow-hidden">
        {/* Game Objective Section */}
        <div className="bg-gradient-to-r from-bColor/10 via-bColor/5 to-transparent p-4 sm:p-6 border-b border-bColor/20">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-bColor/20 to-bColor/10 text-bColor rounded-xl sm:rounded-2xl border border-bColor/20 shadow-sm">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-instrument font-semibold text-gray-800 mb-2 sm:mb-3">
                Objective
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Transform the base number into the target number using the
                fewest possible mutations. Every day brings a new challenge with
                different numbers and mutation options!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Available Mutations Section */}
          <section>
            <h2 className="text-lg sm:text-xl font-instrument font-semibold text-gray-800 mb-4 sm:mb-6">
              Available Mutations
            </h2>

            <div className="grid gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-purple-25 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-200 to-purple-100 text-purple-700 rounded-lg sm:rounded-xl shadow-sm">
                    <RefreshCw size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-1 sm:mb-2">
                      Swap
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Exchange any two digits in the number. Select one digit, then click another to swap their positions. Perfect for repositioning digits that are in the wrong places.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-teal-25 border-2 border-teal-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-200 to-teal-100 text-teal-700 rounded-lg sm:rounded-xl shadow-sm">
                    <RotateCcw size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-teal-800 mb-1 sm:mb-2">
                      Flip
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Flip a digit to its corresponding pair (e.g., 6→9, 1→7, 3→8, 0→8). Only certain digits can be flipped - digits that can be flipped will show a subtle indicator when you hover over them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-25 border-2 border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-200 to-amber-100 text-amber-700 rounded-lg sm:rounded-xl shadow-sm">
                    <ArrowLeftRight size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-1 sm:mb-2">
                      Shift
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Move a digit one position left or right. Select a digit and choose which direction to shift it. Great for fine-tuning digit positions without affecting other numbers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-indigo-25 border-2 border-indigo-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-200 to-indigo-100 text-indigo-700 rounded-lg sm:rounded-xl shadow-sm">
                    <Hash size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-indigo-800 mb-1 sm:mb-2">
                      Replace
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Replace a digit with one from today's mutation pool. Click the Replace button to reveal the available digits for today's puzzle. The mutation pool is randomly generated daily and contains 3-5 different digits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="bg-gradient-to-r from-bColor/5 to-transparent rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-bColor/20">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-bColor/20 to-bColor/10 text-bColor rounded-lg sm:rounded-xl shadow-sm">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-instrument font-semibold text-gray-800">
                  Pro Tips
                </h2>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-bColor rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-medium">Plan ahead:</span> The order of
                  mutations matters! Think through your strategy before making
                  moves.
                </p>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-bColor rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-medium">Identify matches:</span> Look
                  for digits that are already in the right position to avoid
                  unnecessary moves.
                </p>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-bColor rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-medium">Check available options:</span>{" "}
                  Hover over digits to see if they can be flipped, and click the Replace button to reveal today's mutation pool before planning your moves.
                </p>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-bColor rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-medium">Use replace wisely:</span>{" "}
                  Sometimes it's more efficient to replace a digit than trying
                  multiple swaps or shifts.
                </p>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-bColor rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-medium">Share and compare:</span> Share
                  your results with friends to see who can solve it in fewer
                  moves!
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-24 sm:w-32 h-24 sm:h-32 bg-bColor/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 sm:w-40 h-32 sm:h-40 bg-bColor/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-bColor/2 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
