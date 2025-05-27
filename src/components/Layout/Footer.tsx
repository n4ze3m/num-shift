import { Twitter } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router';

export const Footer: React.FC = () => {
  const location = useLocation();

  return (
    <footer className="mt-auto">
      <div className="container mx-auto px-2 py-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4">
           
            <a
              href="https://twitter.com/n4ze3m"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://ko-fi.com/n4ze3m"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <img src="https://storage.ko-fi.com/cdn/logomarkLogo.png" alt="Ko-fi" className="w-5 h-5" />
              <span>Support on Ko-fi</span>
            </a>
          </div>
           <Link
              to="/changelogs"
              className={`text-sm font-medium transition-colors hover:text-[#6b4633] ${
                location.pathname === '/changelogs'
                  ? 'text-[#6b4633]'
                  : 'text-gray-600'
              }`}
            >
              Changelogs
            </Link>
        </div>
      </div>
    </footer>
  );
};
