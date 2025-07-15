// src/utils/roadmapUtils.ts
import { initialRoadmapData as defaultInitialRoadmapData } from "@/features/roadmap/data"; // Assuming this is the path
import type { LeetCodeProblem, SubTopic, Topic } from "@/shared/types";

// Helper to merge a single problem, prioritizing saved data
function mergeProblem(
  initialProblem: LeetCodeProblem,
  savedProblem?: Partial<LeetCodeProblem>
): LeetCodeProblem {
  if (!initialProblem.id) {
    // Should not happen if createProblem is used
    console.error(
      "Critical: Initial problem data is missing an ID!",
      initialProblem
    );
  }

  if (!savedProblem) {
    return {
      ...initialProblem,
      userSolutions: initialProblem.userSolutions || {},
      currentLanguage: initialProblem.currentLanguage || "javascript", // Set a default if none
      testCases: initialProblem.testCases || [], // Ensure testCases are present
    };
  }

  // Prioritize saved user solutions, but merge with initial if saved is partial
  const mergedUserSolutions = {
    ...(initialProblem.userSolutions || {}),
    ...(savedProblem.userSolutions || {}),
  };

  return {
    ...initialProblem, // Start with initial structure (URL, difficulty, tags, default test cases)
    ...savedProblem, // Overlay all saved fields (status, notes, etc.)
    id: initialProblem.id,
    // Specific merge for new/complex fields
    userSolutions: mergedUserSolutions,
    currentLanguage:
      savedProblem.currentLanguage ||
      initialProblem.currentLanguage ||
      "javascript",
    testCases: initialProblem.testCases || [], // Test cases usually come from the source, not user-saved
    // lastTestRun can be directly from savedProblem as it's user-specific session data
    lastTestRun: savedProblem.lastTestRun || undefined,

    // Re-apply specific fields from previous merge logic if necessary for your data integrity
    description:
      savedProblem.description !== undefined
        ? savedProblem.description
        : initialProblem.description,
    problemSpecificNotes:
      savedProblem.problemSpecificNotes !== undefined
        ? savedProblem.problemSpecificNotes
        : initialProblem.problemSpecificNotes,
    // ... other fields like status, isPriority, etc., should be covered by ...savedProblem if present
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
    (initialProblem) =>
      !mergedLeetCodeProblems.find((p) => p.name === initialProblem.name)
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
    (initialSubTopic) =>
      !mergedSubTopics.find((st) => st.id === initialSubTopic.id)
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
  return initialData.map((topic) => ({ ...topic })); // Return a fresh copy of initial data
}
