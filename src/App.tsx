// src/App.tsx
import { ProblemDetailModal } from "@/features/problem";
import { TopicCard } from "@/features/roadmap";
import type { LeetCodeProblem } from "@/shared/types";
import { Target } from "lucide-react";

import { useProblemModalManager } from "@/features/roadmap/hooks/useProblemModalManager"; // Adjust path
import { useRoadmapFilters } from "@/features/roadmap/hooks/useRoadmapFilters"; // Adjust path
import { useRoadmapManager } from "@/features/roadmap/hooks/useRoadmapManager"; // Adjust path if needed
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";

function App() {
  const {
    roadmap,
    toggleTopic,
    toggleCompleteSubTopic,
    updateNotesForSubTopic,
    saveProblemDetails,
  } = useRoadmapManager();

  const {
    isProblemModalOpen,
    currentProblemInModal,
    currentProblemPath,
    openProblemModal,
    closeProblemModal,
  } = useProblemModalManager();

  const {
    searchTerm,
    setSearchTerm,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredRoadmap,
    difficultyOptions,
  } = useRoadmapFilters(roadmap);

  const handleSaveProblemDetailsCallback = (
    updatedProblemData: LeetCodeProblem
  ) => {
    if (currentProblemPath) {
      saveProblemDetails(
        currentProblemPath.topicId,
        currentProblemPath.subTopicId,
        currentProblemPath.problemName,
        updatedProblemData
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedDifficulty={selectedDifficulty}
        onSelectedDifficultyChange={setSelectedDifficulty}
        difficultyOptions={difficultyOptions}
      />

      <main className="container mx-auto max-w-5xl p-4 sm:p-8 flex-grow">
        {filteredRoadmap.length > 0 ? (
          filteredRoadmap.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onToggle={toggleTopic}
              onToggleCompleteSubTopic={toggleCompleteSubTopic}
              onNotesChangeSubTopic={updateNotesForSubTopic}
              onOpenProblemModal={openProblemModal}
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
        onClose={closeProblemModal}
        onSave={handleSaveProblemDetailsCallback}
      />

      <Footer />
    </div>
  );
}

export default App;
