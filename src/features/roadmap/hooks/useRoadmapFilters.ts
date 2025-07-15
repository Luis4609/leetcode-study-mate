// src/hooks/useRoadmapFilters.ts
import { useMemo, useState } from 'react';

import { difficultyOptions } from '@/features/roadmap/constants'; // Import from constants
import type { DifficultyLevel, SubTopic, Topic } from '@/shared/types';

export function useRoadmapFilters(fullRoadmap: Topic[]) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>('All');

  const filteredRoadmap = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return fullRoadmap
      .map((topic) => {
        const subTopicsWithDifficultyFilteredProblems = topic.subTopics.map(
          (subTopic) => ({
            ...subTopic,
            leetcodeProblems:
              selectedDifficulty === 'All'
                ? subTopic.leetcodeProblems
                : subTopic.leetcodeProblems.filter(
                    (p) => p.difficulty === selectedDifficulty,
                  ),
          }),
        );

        if (!lowerSearchTerm) {
          return {
            ...topic,
            subTopics: subTopicsWithDifficultyFilteredProblems,
            // Keep original isExpanded unless search dictates otherwise
            isExpanded: topic.isExpanded,
          };
        }

        const topicTitleMatchesSearch = topic.title
          .toLowerCase()
          .includes(lowerSearchTerm);

        const searchFilteredSubTopics = subTopicsWithDifficultyFilteredProblems
          .map((subTopic) => {
            const subTopicTitleMatchesSearch = subTopic.title
              .toLowerCase()
              .includes(lowerSearchTerm);
            const problemsInSubTopicMatchSearch =
              subTopic.leetcodeProblems.some(
                (p) =>
                  p.name.toLowerCase().includes(lowerSearchTerm) ||
                  p.customTags?.some((ct) =>
                    ct.toLowerCase().includes(lowerSearchTerm),
                  ),
              );

            if (subTopicTitleMatchesSearch || problemsInSubTopicMatchSearch) {
              return subTopic;
            }
            return null;
          })
          .filter((st): st is SubTopic => st !== null);

        if (topicTitleMatchesSearch || searchFilteredSubTopics.length > 0) {
          return {
            ...topic,
            subTopics: searchFilteredSubTopics,
            isExpanded: true, // Auto-expand if search term yields results
          };
        }
        return null;
      })
      .filter((t): t is Topic => t !== null);
  }, [fullRoadmap, searchTerm, selectedDifficulty]);

  // difficultyOptions is now imported

  return {
    searchTerm,
    setSearchTerm,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredRoadmap,
    difficultyOptions, // Still export it for the Header component
  };
}
