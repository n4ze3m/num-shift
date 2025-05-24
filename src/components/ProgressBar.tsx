import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const isComplete = progress === 100;
  
  return (
    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-500 ease-out ${
          isComplete ? 'bg-green-500' : 'bg-amber-500'
        }`}
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};