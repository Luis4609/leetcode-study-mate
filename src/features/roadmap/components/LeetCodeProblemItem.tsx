// src/features/Roadmap/components/LeetCodeProblemItem.tsx
import { Clock, ExternalLink, Star, Target } from 'lucide-react';
import React, { memo } from 'react'; // Import memo

import type { LeetCodeProblem } from '@/shared/types/index';
import {
  getDifficultyColor,
  getStatusIndicator,
} from '@/shared/utils/styleHelpers';

interface LeetCodeProblemItemProps {
  problem: LeetCodeProblem;
  topicId: string;
  subTopicId: string;
  onViewProblem: (
    problem: LeetCodeProblem,
    topicId: string,
    subTopicId: string,
  ) => void;
}

const LeetCodeProblemItem: React.FC<LeetCodeProblemItemProps> = memo(
  ({
    // Wrap with memo
    problem,
    topicId,
    subTopicId,
    onViewProblem,
  }) => {
    const statusInfo = getStatusIndicator(problem.status);
    return (
      <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 hover:bg-slate-950/45 rounded-lg transition-all duration-150 border-b border-slate-900/50 last:border-b-0">
        <div className="flex-grow mb-2 sm:mb-0">
          <button
            onClick={() => onViewProblem(problem, topicId, subTopicId)}
            className="flex items-center text-left w-full group mb-1 focus:outline-none"
            aria-label={`View details for ${problem.name}`}
          >
            {problem.isPriority && (
              <Star
                size={14}
                className="mr-2 text-amber-500 fill-amber-400 flex-shrink-0"
                aria-hidden="true" // Decorative
              />
            )}
            <Target
              size={15}
              className="mr-2 text-sky-400 flex-shrink-0 group-hover:text-sky-300"
              aria-hidden="true" // Decorative
            />
            <span className="text-slate-300 font-semibold text-xs sm:text-sm break-words group-hover:text-sky-400 transition-colors">
              {problem.name}
            </span>
          </button>
          <div className="flex items-center text-[10px] text-slate-500 ml-1 sm:ml-6">
            <div
              className={`w-2 h-2 rounded-full ${statusInfo.color} mr-1.5`}
              aria-hidden="true" // Decorative
            ></div>
            <span>{statusInfo.text}</span>
            {problem.deadline && (
              <Clock
                size={10}
                className="ml-2 mr-0.5 text-rose-400"
                aria-hidden="true"
              />
            )}    
            {problem.deadline && (
              <span className="text-rose-400/80">{problem.deadline}</span>
            )}
          </div>
          {problem.customTags && problem.customTags.length > 0 && (
            <div className="mt-1.5 ml-1 sm:ml-6 flex flex-wrap gap-1">
              {problem.customTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[9px] bg-slate-950/60 text-slate-400 border border-slate-800/80 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 ml-auto sm:ml-2 flex-shrink-0 self-start sm:self-center">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getDifficultyColor(
              problem.difficulty === "All" ? "Easy" : problem.difficulty,
            )}`}
          >
            {problem.difficulty}
          </span>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 hover:text-sky-400 transition-colors duration-150"
            aria-label={`Open LeetCode problem: ${problem.name} in new tab`}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </li>
    );
  },
);

LeetCodeProblemItem.displayName = 'LeetCodeProblemItem'; // Add display name

export default LeetCodeProblemItem;
