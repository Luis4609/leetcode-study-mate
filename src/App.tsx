// src/App.tsx
import { ProblemDetailModal } from "@/features/Problem";
import { TopicCard } from "@/features/Roadmap";
import type {
  DifficultyLevel,
  LeetCodeProblem,
  SubTopic,
  Topic,
} from "@/shared/types"; // Ensure SubTopic is imported if used directly in App.tsx logic
import { Activity, Search, Target } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { initialRoadmapData } from "@/features/Roadmap/data";

function App() {
  const [roadmap, setRoadmap] = useState<Topic[]>(() => {
    const savedRoadmapJson = localStorage.getItem("leetcodeRoadmap");
    if (savedRoadmapJson) {
      try {
        const parsedSavedRoadmap = JSON.parse(savedRoadmapJson) as Topic[];
        // Basic validation
        if (
          Array.isArray(parsedSavedRoadmap) &&
          (parsedSavedRoadmap.length === 0 ||
            (parsedSavedRoadmap[0] && "id" in parsedSavedRoadmap[0]))
        ) {
          // Deep merge with initialRoadmapData to ensure new problems/fields are added
          // and existing ones retain their saved state.
          return initialRoadmapData.map((initialTopic) => {
            const savedTopic = parsedSavedRoadmap.find(
              (t) => t.id === initialTopic.id
            );
            if (savedTopic) {
              const mergedSubTopics = initialTopic.subTopics.map(
                (initialSubTopic) => {
                  const savedSubTopic = savedTopic.subTopics?.find(
                    (st) => st.id === initialSubTopic.id
                  );
                  if (savedSubTopic) {
                    const mergedLeetCodeProblems =
                      initialSubTopic.leetcodeProblems.map((initialProblem) => {
                        const savedProblem =
                          savedSubTopic.leetcodeProblems?.find(
                            (p) => p.name === initialProblem.name
                          );
                        if (savedProblem) {
                          // Merge problem details, prioritizing saved data but falling back to initial for structure
                          return {
                            ...initialProblem, // Start with initial structure (URL, difficulty, tags)
                            ...savedProblem, // Overlay all saved fields
                            // Ensure specific fields that might be empty arrays/strings are correctly handled if not present in savedProblem
                            description:
                              savedProblem.description !== undefined
                                ? savedProblem.description
                                : initialProblem.description,
                            problemSpecificNotes:
                              savedProblem.problemSpecificNotes !== undefined
                                ? savedProblem.problemSpecificNotes
                                : initialProblem.problemSpecificNotes,
                            solutionLinks:
                              savedProblem.solutionLinks ||
                              initialProblem.solutionLinks ||
                              [],
                            attempts:
                              savedProblem.attempts ||
                              initialProblem.attempts ||
                              [],
                            subTasks:
                              savedProblem.subTasks ||
                              initialProblem.subTasks ||
                              [],
                            status:
                              savedProblem.status ||
                              initialProblem.status ||
                              "Not Started",
                            customTags:
                              savedProblem.customTags ||
                              initialProblem.customTags ||
                              [],
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
                        return initialProblem; // No saved version of this specific problem
                      });
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
                      leetcodeProblems: mergedLeetCodeProblems,
                    };
                  }
                  return initialSubTopic; // No saved version of this sub-topic
                }
              );
              return {
                ...initialTopic,
                isExpanded:
                  savedTopic.isExpanded !== undefined
                    ? savedTopic.isExpanded
                    : initialTopic.isExpanded,
                subTopics: mergedSubTopics,
              };
            }
            return initialTopic; // No saved version of this topic
          });
        }
      } catch (error) {
        console.error(
          "Failed to parse or merge roadmap from localStorage:",
          error
        );
        localStorage.removeItem("leetcodeRoadmap"); // Clear potentially corrupted data
      }
    }
    return initialRoadmapData; // Fallback to initial data if nothing in localStorage or if parsing fails
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("All");

  // State for Problem Detail Modal
  const [isProblemModalOpen, setIsProblemModalOpen] = useState<boolean>(false);
  const [currentProblemInModal, setCurrentProblemInModal] =
    useState<LeetCodeProblem | null>(null);
  const [currentProblemPath, setCurrentProblemPath] = useState<{
    topicId: string;
    subTopicId: string;
    problemName: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("leetcodeRoadmap", JSON.stringify(roadmap));
  }, [roadmap]);

  const toggleTopic = (topicId: string): void => {
    setRoadmap((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, isExpanded: !t.isExpanded } : t
      )
    );
  };

  const toggleCompleteSubTopic = (
    topicId: string,
    subTopicId: string
  ): void => {
    setRoadmap((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId ? { ...st, completed: !st.completed } : st
              ),
            }
          : t
      )
    );
  };

  const updateNotesForSubTopic = (
    topicId: string,
    subTopicId: string,
    notes: string
  ): void => {
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
  };

  // Modal handlers
  const handleOpenProblemModal = useCallback(
    (problem: LeetCodeProblem, topicId: string, subTopicId: string) => {
      setCurrentProblemInModal(problem);
      setCurrentProblemPath({ topicId, subTopicId, problemName: problem.name });
      setIsProblemModalOpen(true);
    },
    []
  );

  const handleCloseProblemModal = useCallback(() => {
    setIsProblemModalOpen(false);
    setCurrentProblemInModal(null);
    setCurrentProblemPath(null);
  }, []);

  const handleSaveProblemDetails = useCallback(
    (updatedProblemData: LeetCodeProblem) => {
      if (!currentProblemPath) return;
      const { topicId, subTopicId, problemName } = currentProblemPath;

      setRoadmap((prevRoadmap) =>
        prevRoadmap.map((topic) => {
          if (topic.id === topicId) {
            return {
              ...topic,
              subTopics: topic.subTopics.map((subTopic) => {
                if (subTopic.id === subTopicId) {
                  return {
                    ...subTopic,
                    leetcodeProblems: subTopic.leetcodeProblems.map(
                      (p) => (p.name === problemName ? updatedProblemData : p) // Replace the entire problem object
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
    [currentProblemPath]
  );

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  const filteredRoadmap = roadmap
    .map((topic) => {
      const subTopicsWithDifficultyFilteredProblems = topic.subTopics.map(
        (subTopic) => ({
          ...subTopic,
          leetcodeProblems:
            selectedDifficulty === "All"
              ? subTopic.leetcodeProblems
              : subTopic.leetcodeProblems.filter(
                  (p) => p.difficulty === selectedDifficulty
                ),
        })
      );

      if (!lowerSearchTerm) {
        return {
          ...topic,
          subTopics: subTopicsWithDifficultyFilteredProblems,
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
          // Also search within problem's custom tags
          const problemsInSubTopicMatchSearch = subTopic.leetcodeProblems.some(
            (p) =>
              p.name.toLowerCase().includes(lowerSearchTerm) ||
              (p.customTags &&
                p.customTags.some((ct) =>
                  ct.toLowerCase().includes(lowerSearchTerm)
                ))
          );

          if (subTopicTitleMatchesSearch || problemsInSubTopicMatchSearch) {
            return subTopic;
          }
          return null;
        })
        .filter((st): st is SubTopic => st !== null); // Type guard to filter out nulls and ensure st is SubTopic

      if (topicTitleMatchesSearch || searchFilteredSubTopics.length > 0) {
        return {
          ...topic,
          subTopics: searchFilteredSubTopics,
          isExpanded: true, // Auto-expand if search term yields results for this topic
        };
      }
      return null; // Topic does not match search and has no sub-content matching search
    })
    .filter((t): t is Topic => t !== null); // Type guard to filter out nulls and ensure t is Topic

  const difficultyOptions: DifficultyLevel[] = [
    "All",
    "Easy",
    "Medium",
    "Hard",
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 sm:p-6 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Activity size={32} className="mr-3 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              LeetCode Study Roadmap
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-auto mb-3 sm:mb-0 sm:mr-4">
              <input
                type="text"
                placeholder="Search topics, problems, tags..." // Updated placeholder
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors duration-150 text-sm"
              />
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              {difficultyOptions.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75
                    ${
                      selectedDifficulty === difficulty
                        ? "bg-blue-500 text-white shadow-md focus:ring-blue-300"
                        : "bg-gray-600 hover:bg-gray-500 text-gray-300 focus:ring-gray-400"
                    }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl p-4 sm:p-8">
        {filteredRoadmap.length > 0 ? (
          filteredRoadmap.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onToggle={toggleTopic}
              onToggleCompleteSubTopic={toggleCompleteSubTopic}
              onNotesChangeSubTopic={updateNotesForSubTopic}
              onOpenProblemModal={handleOpenProblemModal}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg p-8">
            <Target size={60} className="mx-auto text-slate-400 mb-6" />
            <p className="text-2xl font-semibold text-slate-700 mb-2">
              No Matches Found
            </p>
            <p className="text-slate-500">
              Try adjusting your search term or difficulty filter.
            </p>
            {(searchTerm || selectedDifficulty !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("All");
                }}
                className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-150 shadow hover:shadow-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      <ProblemDetailModal
        problem={currentProblemInModal}
        isOpen={isProblemModalOpen}
        onClose={handleCloseProblemModal}
        onSave={handleSaveProblemDetails}
      />

      <footer className="text-center p-6 bg-slate-200 text-slate-600 text-sm border-t border-slate-300">
        <p>
          &copy; {new Date().getFullYear()} LeetCode Study Helper. Happy Coding!
        </p>
        <p>Built with React, TypeScript & Tailwind CSS. Icons by Lucide.</p>
      </footer>
    </div>
  );
}

export default App;
