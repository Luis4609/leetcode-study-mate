// src/pages/RoadmapPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { TopicCard } from "@/features/roadmap"; // Assuming path
import { Target } from "lucide-react"; // For "No Matches Found"

import { useRoadmapManager } from "@/features/roadmap/hooks/useRoadmapManager";
import { useRoadmapFilters } from "@/features/roadmap/hooks/useRoadmapFilters";
import { Header } from "@/shared/components/layout/Header"; // Path to your Header
import { Footer } from "@/shared/components/layout/Footer"; // Path to your Footer
import type { LeetCodeProblem } from "@/shared/types";

const RoadmapPage: React.FC = () => {
  const {
    roadmap,
    toggleTopic,
    toggleCompleteSubTopic,
    updateNotesForSubTopic,
  } = useRoadmapManager();

  const {
    searchTerm,
    setSearchTerm,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredRoadmap,
    difficultyOptions,
  } = useRoadmapFilters(roadmap);

  const navigate = useNavigate();

  // Renamed for clarity: This function handles navigating to the problem's editor page.
  const handleViewProblem = (problem: LeetCodeProblem) => {
    // The problem.id should be the unique ID used in the route.
    navigate(`/problem/${problem.id}`);
  };


  return (
    <>
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
              onViewProblem={handleViewProblem} // UPDATED PROP NAME
            />
          ))
        ) : (
          // ... (No Matches Found JSX)
          <div className="text-center py-12 bg-slate-800 rounded-xl shadow-lg p-8">
            <Target size={60} className="mx-auto text-slate-500 mb-6" />
            <p className="text-2xl font-semibold text-slate-200 mb-2">
              No Matches Found
            </p>
            <p className="text-slate-400">
              Try adjusting your search term or difficulty filter.
            </p>
            {(searchTerm || selectedDifficulty !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("All");
                }}
                className="mt-6 px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors duration-150 shadow hover:shadow-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default RoadmapPage;