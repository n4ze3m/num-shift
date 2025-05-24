import React from 'react';

interface GameStatsProps {
  attempts: number;
  remaining: number;
  moves: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ attempts, remaining, moves }) => {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4">
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <div className="text-xl font-bold text-purple-700">{moves}</div>
        <div className="text-xs text-gray-600">Moves Used</div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <div className="text-xl font-bold text-purple-700">{remaining}</div>
        <div className="text-xs text-gray-600">Remaining</div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <div className="text-xl font-bold text-purple-700">{attempts}</div>
        <div className="text-xs text-gray-600">Max Attempts</div>
      </div>
    </div>
  );
};