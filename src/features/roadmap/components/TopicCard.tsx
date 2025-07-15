// src/features/Roadmap/components/TopicCard.tsx
import React, { memo } from 'react'; // Import memo

import { ChevronDown, ChevronRight } from 'lucide-react';

import type { LeetCodeProblem, Topic } from '@/shared/types';

import ProgressBar from './ProgressBar';
import SubTopicCard from './SubTopicCard';

interface TopicCardProps {
  topic: Topic;
  onToggle: (topicId: string) => void;
  onToggleCompleteSubTopic: (topicId: string, subTopicId: string) => void;
  onNotesChangeSubTopic: (
    topicId: string,
    subTopicId: string,
    notes: string,
  ) => void;
  onViewProblem: (
    problem: LeetCodeProblem,
    topicId: string,
    subTopicId: string,
  ) => void;
}

const TopicCard: React.FC<TopicCardProps> = memo(
  ({
    // Wrap with memo
    topic,
    onToggle,
    onToggleCompleteSubTopic,
    onNotesChangeSubTopic,
    onViewProblem,
  }) => {
    const completedSubTopics = topic.subTopics.filter(
      (st) => st.completed,
    ).length;
    const totalSubTopics = topic.subTopics.length;
    const progressPercentage =
      totalSubTopics > 0 ? (completedSubTopics / totalSubTopics) * 100 : 0;

    return (
      <div className="mb-6 bg-slate-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
        <button
          onClick={() => onToggle(topic.id)}
          className="w-full flex flex-col sm:flex-row items-center justify-between p-5 sm:p-6 text-left bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-75"
          aria-expanded={topic.isExpanded}
          aria-controls={`topic-content-${topic.id}`}
        >
          <div className="w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-xl sm:text-2xl font-bold">{topic.title}</h3>
              {topic.isExpanded ? (
                <ChevronDown
                  size={28}
                  className="flex-shrink-0 ml-2 hidden sm:block"
                  aria-hidden="true"
                />
              ) : (
                <ChevronRight
                  size={28}
                  className="flex-shrink-0 ml-2 hidden sm:block"
                  aria-hidden="true"
                />
              )}
            </div>
            <p className="text-sm text-indigo-100 mt-1 pr-8 sm:pr-0">
              {topic.description}
            </p>
            <ProgressBar percentage={progressPercentage} />
            <div className="text-xs text-indigo-200 mt-1">
              {`${completedSubTopics} / ${totalSubTopics} sub-topics completed (${Math.round(
                progressPercentage,
              )}%)`}
            </div>
          </div>
          {topic.isExpanded ? (
            <ChevronDown
              size={24}
              className="flex-shrink-0 ml-2 sm:hidden self-center mt-2"
              aria-hidden="true"
            />
          ) : (
            <ChevronRight
              size={24}
              className="flex-shrink-0 ml-2 sm:hidden self-center mt-2"
              aria-hidden="true"
            />
          )}
        </button>
        {topic.isExpanded && (
          <div
            id={`topic-content-${topic.id}`}
            className="p-4 sm:p-6 bg-white border-t border-slate-200"
            role="region" // Added role for better semantics
            aria-labelledby={`topic-title-${topic.id}`} // Assuming h3 gets an id like this
          >
            {topic.subTopics?.length > 0 ? (
              topic.subTopics.map((sub) => (
                <SubTopicCard
                  key={sub.id}
                  subTopic={sub}
                  topicId={topic.id}
                  onToggleComplete={onToggleCompleteSubTopic}
                  onNotesChange={onNotesChangeSubTopic}
                  onViewProblem={onViewProblem}
                />
              ))
            ) : (
              <p className="text-slate-500 text-sm p-3 bg-slate-50 rounded-md italic">
                No sub-topics available for this topic based on current filters.
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

TopicCard.displayName = 'TopicCard'; // Add display name for memoized component

export default TopicCard;
