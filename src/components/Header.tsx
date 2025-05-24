import React from "react";
import { Brain } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center font-instrument gap-2">
          <Brain className="text-purple-600" size={28} />
          <h1 className="text-xl font-bold text-gray-900">
            Num<span className="text-purple-600">Shift</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
