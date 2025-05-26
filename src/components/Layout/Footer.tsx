import { Twitter } from 'lucide-react';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto">
      <div className="container mx-auto px-2 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        </div>
      </div>
    </footer>
  );
};