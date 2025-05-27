import React, { useState } from 'react';
import { formatShareText } from '../utils/gameUtils';
import { Share2, Check, Copy, Clock,  } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface ShareResultsProps {
  history: any[];
  baseNumber: string;
  targetNumber: string;
}

export const ShareResults: React.FC<ShareResultsProps> = ({ 
  history, 
  baseNumber, 
  targetNumber 
}) => {
  const [copied, setCopied] = useState(false);
  const [shareAttempted, setShareAttempted] = useState(false);
  const { timeUntilNextDaily, canPlayToday, hasLabAccess } = useGame();
  
  const shareText = formatShareText(history, baseNumber, targetNumber, history.length);
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Num Shift',
          text: shareText,
        });
        setShareAttempted(true);
        setTimeout(() => setShareAttempted(false), 2000);
      } catch (err) {
        console.error('Error sharing:', err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="text-3xl sm:text-4xl mb-2">🎉</div>
        <h3 className="text-lg sm:text-xl font-instrument font-semibold text-green-800 mb-2">
          Shifted Successfully!
        </h3>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200/50">
          <p className="text-sm sm:text-base text-green-700 font-medium">
            You transformed <span className="font-bold text-green-800">{baseNumber}</span> into{' '}
            <span className="font-bold text-green-800">{targetNumber}</span> in{' '}
            <span className="font-bold text-green-800">{history.length}</span> moves!
          </p>
        </div>
      </div>

   
      
      {/* Next Challenge Timer */}
      {!canPlayToday && (
        <div className="mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/60 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h4 className="text-sm sm:text-base font-instrument font-semibold text-blue-800">
                Next Challenge Available In
              </h4>
            </div>
            <div className="text-center">
              <span className="text-lg sm:text-xl font-bold text-blue-700 font-mono">
                {timeUntilNextDaily}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-600/80 text-center mt-1">
              Come back tomorrow for a new daily challenge!
            </p>
          </div>
        </div>
      )}
      
      {/* Share Preview */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-sm sm:text-base font-instrument font-semibold text-green-800 mb-3">
          Share Your Victory
        </h4>
        <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200/50 rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="font-mono text-xs sm:text-sm text-gray-700 overflow-x-auto">
            {shareText.split('\n').map((line, i) => (
              <div key={i} className="mb-1 whitespace-nowrap">
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex-1 group py-3 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          {shareAttempted ? (
            <>
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Shared!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base">Share Results</span>
            </>
          )}
        </button>
        
        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="flex-1 group py-3 px-4 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-green-700 border-2 border-green-200 hover:border-green-300 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-sm sm:text-base text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base">Copy Text</span>
            </>
          )}
        </button>
      </div>
      
      {/* Subtle decoration */}
      <div className="mt-4 pt-4 border-t border-green-200/50">
        <p className="text-xs sm:text-sm text-green-600/80 text-center font-medium">
          {canPlayToday ? 
            "Challenge your friends with Daily Num Shift!" : 
            hasLabAccess ? 
              "Daily challenge completed! Try the Endless Lab for more fun! 🧪" :
              "Daily challenge completed! See you tomorrow! 🌅"
          }
        </p>
      </div>
    </div>
  );
};
