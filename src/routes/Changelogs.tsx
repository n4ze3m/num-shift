import React from "react";
import ReactMarkdown from "react-markdown";
import { changelogContent } from "../changelogs";


const Changelogs: React.FC = () => {
  return (
    <div className="flex justify-center min-h-screen py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-12">
            <article className="prose prose-slate max-w-none prose-headings:text-[#6b4633] prose-h1:text-center prose-h1:text-4xl prose-h1:mb-12 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-semibold prose-p:text-gray-600 prose-em:text-gray-500 prose-em:text-sm prose-ul:mt-4 prose-li:my-2">
              <ReactMarkdown>{changelogContent}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelogs;
