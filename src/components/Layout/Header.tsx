import React from "react";
import { RefreshCw } from "lucide-react";
import { Link, useLocation } from "react-router";

export const Header: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: "🧪 Endless Lab", href: "/lab" },
  ];

  return (
    <header>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex text-[#6b4633] items-center font-instrument gap-2"
          >
            <RefreshCw className="size-4 sm:size-5" />
            <h1 className="text-lg sm:text-xl font-bold">Num Shift</h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center">
            <ul className="flex space-x-6">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`text-base font-medium transition-colors hover:text-[#6b4633] ${
                      location.pathname === item.href
                        ? "text-[#6b4633]"
                        : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
