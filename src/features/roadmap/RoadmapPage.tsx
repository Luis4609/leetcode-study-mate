// src/pages/RoadmapPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopicCard } from "@/features/roadmap";
import RoadmapProgressMap from "@/features/roadmap/components/RoadmapProgressMap";
import { Target } from "lucide-react";

import { useRoadmapManager } from "@/features/roadmap/hooks/useRoadmapManager";
import { useRoadmapFilters } from "@/features/roadmap/hooks/useRoadmapFilters";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
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
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  // Focus topic selection handler
  const handleSelectTopic = (topicId: string | null) => {
    setActiveTopicId(topicId);
    if (topicId) {
      // Find and make sure the selected topic is expanded in manager state if not already
      const topic = roadmap.find(t => t.id === topicId);
      if (topic && !topic.isExpanded) {
        toggleTopic(topicId);
      }
    }
  };

  // Navigates to the problem's editor page.
  const handleViewProblem = (problem: LeetCodeProblem) => {
    navigate(`/problem/${problem.id}`);
  };

  // Filter display by map selection
  const displayedRoadmap = activeTopicId
    ? filteredRoadmap.filter(t => t.id === activeTopicId)
    : filteredRoadmap;

  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedDifficulty={selectedDifficulty}
        onSelectedDifficultyChange={setSelectedDifficulty}
        difficultyOptions={difficultyOptions}
      />
      <main className="container mx-auto max-w-5xl p-4 sm:p-8 flex-grow space-y-8">
        
        {/* Banner Principal de la Ruta */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-950/80 p-6 sm:p-10 border border-slate-700/40 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950/60 text-sky-400 border border-sky-800/40">
              <Target size={12} /> Ruta de Preparación
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Tu Ruta de Estudio de Algoritmos
            </h2>
            <p className="text-sm sm:text-md text-slate-400 leading-relaxed">
              Haz un seguimiento detallado de tu progreso a través de los temas clave de LeetCode. 
              Despliega cada sección para estudiar recursos externos recomendados, registrar notas personalizadas de repaso y practicar con problemas seleccionados.
            </p>
          </div>
        </div>

        {/* Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Progress Map */}
          <div className="md:col-span-4 md:sticky md:top-28">
            <RoadmapProgressMap 
              topics={roadmap} 
              activeTopicId={activeTopicId}
              onSelectTopic={handleSelectTopic}
            />
          </div>

          {/* Right Column: Detailed Topic List */}
          <div className="md:col-span-8 space-y-6">
            {displayedRoadmap.length > 0 ? (
              displayedRoadmap.map((topic) => {
                // If a topic is focused, force its card to render expanded
                const topicWithExpansion = activeTopicId && topic.id === activeTopicId
                  ? { ...topic, isExpanded: true }
                  : topic;
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topicWithExpansion}
                    onToggle={toggleTopic}
                    onToggleCompleteSubTopic={toggleCompleteSubTopic}
                    onNotesChangeSubTopic={updateNotesForSubTopic}
                    onViewProblem={handleViewProblem}
                  />
                );
              })
            ) : (
              <div className="text-center py-12 bg-slate-800/40 border border-slate-800/80 rounded-xl shadow-lg p-8">
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
                    className="mt-6 px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors duration-150 shadow hover:shadow-md"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default RoadmapPage;