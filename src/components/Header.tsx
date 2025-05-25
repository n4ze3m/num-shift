import React from "react";
import { RefreshCw } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex text-[#6b4633] items-center font-instrument gap-2">
          <RefreshCw className="size-4 sm:size-5" />
          <h1 className="text-lg sm:text-xl font-bold">
            Num Shift 
          </h1>
        </div>
      </div>
    </header>
  );
};
