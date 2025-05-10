// src/utils/roadmapUtils.ts
import type { LeetCodeProblem, SubTopic, Topic } from "@/shared/types";
import { initialRoadmapData as defaultInitialRoadmapData } from "@/features/Roadmap/data"; // Assuming this is the path

// Helper to merge a single problem, prioritizing saved data
function mergeProblem(
  initialProblem: LeetCodeProblem,
  savedProblem?: Partial<LeetCodeProblem> // Saved problem might be partial or have different structure over time
): LeetCodeProblem {
  if (!savedProblem) return initialProblem;
  return {
    ...initialProblem,
    ...savedProblem,
    description:
      savedProblem.description !== undefined
        ? savedProblem.description
        : initialProblem.description,
    problemSpecificNotes:
      savedProblem.problemSpecificNotes !== undefined
        ? savedProblem.problemSpecificNotes
        : initialProblem.problemSpecificNotes,
    solutionLinks:
      savedProblem.solutionLinks || initialProblem.solutionLinks || [],
    attempts: savedProblem.attempts || initialProblem.attempts || [],
    subTasks: savedProblem.subTasks || initialProblem.subTasks || [],
    status: savedProblem.status || initialProblem.status || "Not Started",
    customTags: savedProblem.customTags || initialProblem.customTags || [],
    isPriority:
      savedProblem.isPriority !== undefined
        ? savedProblem.isPriority
        : initialProblem.isPriority || false,
    deadline:
      savedProblem.deadline !== undefined
        ? savedProblem.deadline
        : initialProblem.deadline || "",
  };
}

// Helper to merge a single sub-topic
function mergeSubTopic(
  initialSubTopic: SubTopic,
  savedSubTopicsList: SubTopic[] | undefined
): SubTopic {
  const savedSubTopic = savedSubTopicsList?.find(
    (st) => st.id === initialSubTopic.id
  );
  if (!savedSubTopic) return initialSubTopic;

  const mergedLeetCodeProblems = initialSubTopic.leetcodeProblems.map(
    (initialProblem) => {
      const savedProblem = savedSubTopic.leetcodeProblems?.find(
        (p) => p.name === initialProblem.name
      );
      return mergeProblem(initialProblem, savedProblem);
    }
  );

  // Ensure new problems from initialData are added if not in saved data
  const newProblemsInInitial = initialSubTopic.leetcodeProblems.filter(
    initialProblem => !mergedLeetCodeProblems.find(p => p.name === initialProblem.name)
  );

  return {
    ...initialSubTopic,
    notes:
      savedSubTopic.notes !== undefined
        ? savedSubTopic.notes
        : initialSubTopic.notes,
    completed:
      savedSubTopic.completed !== undefined
        ? savedSubTopic.completed
        : initialSubTopic.completed,
    leetcodeProblems: [...mergedLeetCodeProblems, ...newProblemsInInitial],
  };
}

// Helper to merge a single topic
function mergeTopic(
  initialTopic: Topic,
  savedTopicsList: Topic[] | undefined
): Topic {
  const savedTopic = savedTopicsList?.find((t) => t.id === initialTopic.id);
  if (!savedTopic) return initialTopic;

  const mergedSubTopics = initialTopic.subTopics.map((initialSubTopic) =>
    mergeSubTopic(initialSubTopic, savedTopic.subTopics)
  );

   // Ensure new subtopics from initialData are added
  const newSubTopicsInInitial = initialTopic.subTopics.filter(
    initialSubTopic => !mergedSubTopics.find(st => st.id === initialSubTopic.id)
  );


  return {
    ...initialTopic,
    isExpanded:
      savedTopic.isExpanded !== undefined
        ? savedTopic.isExpanded
        : initialTopic.isExpanded,
    subTopics: [...mergedSubTopics, ...newSubTopicsInInitial],
  };
}

export function initializeRoadmap(
  initialData: Topic[] = defaultInitialRoadmapData
): Topic[] {
  const savedRoadmapJson = localStorage.getItem("leetcodeRoadmap");
  if (savedRoadmapJson) {
    try {
      const parsedSavedRoadmap = JSON.parse(savedRoadmapJson) as Topic[];
      if (
        Array.isArray(parsedSavedRoadmap) &&
        (parsedSavedRoadmap.length === 0 ||
          (parsedSavedRoadmap[0] && "id" in parsedSavedRoadmap[0]))
      ) {
        // Deep merge initial data with saved data
        const mergedRoadmap = initialData.map((initialTopic) =>
          mergeTopic(initialTopic, parsedSavedRoadmap)
        );

        // Add any topics that might be in saved data but not in initial (e.g. user created)
        // This part depends on whether users can create new top-level topics.
        // For now, assuming initialData is the source of truth for topic structure.
        // If not, you'd need to merge the other way or reconcile.
        return mergedRoadmap;
      }
    } catch (error) {
      console.error(
        "Failed to parse or merge roadmap from localStorage:",
        error
      );
      localStorage.removeItem("leetcodeRoadmap"); // Clear potentially corrupted data
    }
  }
  return initialData.map(topic => ({ ...topic })); // Return a fresh copy of initial data
}