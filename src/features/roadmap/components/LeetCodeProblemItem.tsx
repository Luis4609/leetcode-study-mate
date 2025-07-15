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
  onOpenModal: (
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
    onOpenModal,
  }) => {
    const statusInfo = getStatusIndicator(problem.status);
    return (
      <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 hover:bg-slate-100 rounded-md transition-colors duration-150 border-b border-slate-200 last:border-b-0">
        <div className="flex-grow mb-2 sm:mb-0">
          <button
            onClick={() => onOpenModal(problem, topicId, subTopicId)}
            className="flex items-center text-left w-full group mb-1"
            aria-label={`View details for ${problem.name}`}
          >
            {problem.isPriority && (
              <Star
                size={16}
                className="mr-2 text-yellow-500 fill-yellow-400 flex-shrink-0"
                aria-hidden="true" // Decorative
              />
            )}
            <Target
              size={18}
              className="mr-2 text-blue-500 flex-shrink-0 group-hover:text-blue-700"
              aria-hidden="true" // Decorative
            />
            <span className="text-slate-800 font-medium text-sm sm:text-base break-words group-hover:text-blue-700">
              {problem.name}
            </span>
          </button>
          <div className="flex items-center text-xs text-slate-500 ml-1 sm:ml-7">
            <div
              className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} mr-1.5`}
              aria-hidden="true" // Decorative
            ></div>
            <span>{statusInfo.text}</span>
            {problem.deadline && (
              <Clock
                size={12}
                className="ml-2 mr-0.5 text-rose-500"
                aria-hidden="true"
              />
            )}    
            {problem.deadline && (
              <span className="text-rose-600">{problem.deadline}</span>
            )}
          </div>
          {problem.customTags && problem.customTags.length > 0 && (
            <div className="mt-1.5 ml-1 sm:ml-7 flex flex-wrap gap-1">
              {problem.customTags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-auto sm:ml-2 flex-shrink-0 self-start sm:self-center">
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyColor(
              problem.difficulty === "All" ? "Easy" : problem.difficulty,
            )}`}
          >
            {problem.difficulty}
          </span>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-150"
            aria-label={`Open LeetCode problem: ${problem.name} in new tab`}
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </li>
    );
  },
);

LeetCodeProblemItem.displayName = 'LeetCodeProblemItem'; // Add display name

export default LeetCodeProblemItem;
