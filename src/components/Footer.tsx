import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-4 text-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} EvolveNumber • Daily Number Evolution Game</p>
    </footer>
  );
};