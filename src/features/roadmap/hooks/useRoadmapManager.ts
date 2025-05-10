// src/hooks/useRoadmapManager.ts
import { initialRoadmapData } from "@/features/roadmap/data";
import { initializeRoadmap } from "@/features/roadmap/utils/roadmapUtils";
import type { LeetCodeProblem, Topic } from "@/shared/types";
import { useCallback, useEffect, useState } from "react";

export function useRoadmapManager() {
  const [roadmap, setRoadmap] = useState<Topic[]>(() =>
    initializeRoadmap(initialRoadmapData)
  );

  useEffect(() => {
    localStorage.setItem("leetcodeRoadmap", JSON.stringify(roadmap));
  }, [roadmap]);

  const toggleTopic = useCallback((topicId: string): void => {
    setRoadmap((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, isExpanded: !t.isExpanded } : t
      )
    );
  }, []);

  const toggleCompleteSubTopic = useCallback(
    (topicId: string, subTopicId: string): void => {
      setRoadmap((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId
                    ? { ...st, completed: !st.completed }
                    : st
                ),
              }
            : t
        )
      );
    },
    []
  );

  const updateNotesForSubTopic = useCallback(
    (topicId: string, subTopicId: string, notes: string): void => {
      setRoadmap((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId ? { ...st, notes: notes } : st
                ),
              }
            : t
        )
      );
    },
    []
  );

  const saveProblemDetails = useCallback(
    (
      topicId: string,
      subTopicId: string,
      problemName: string,
      updatedProblemData: LeetCodeProblem
    ) => {
      setRoadmap((prevRoadmap) =>
        prevRoadmap.map((topic) => {
          if (topic.id === topicId) {
            return {
              ...topic,
              subTopics: topic.subTopics.map((subTopic) => {
                if (subTopic.id === subTopicId) {
                  return {
                    ...subTopic,
                    leetcodeProblems: subTopic.leetcodeProblems.map((p) =>
                      p.name === problemName ? updatedProblemData : p
                    ),
                  };
                }
                return subTopic;
              }),
            };
          }
          return topic;
        })
      );
    },
    []
  );

  return {
    roadmap,
    toggleTopic,
    toggleCompleteSubTopic,
    updateNotesForSubTopic,
    saveProblemDetails,
  };
}
