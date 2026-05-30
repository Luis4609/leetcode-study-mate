// src/components/layout/Header.tsx
import React from 'react';
import { Activity, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { DifficultyLevel } from '@/shared/types'; // Ensure this path is correct

interface HeaderProps {
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
  selectedDifficulty?: DifficultyLevel;
  onSelectedDifficultyChange?: (difficulty: DifficultyLevel) => void;
  difficultyOptions?: DifficultyLevel[];
}

export function Header({
  searchTerm = "",
  onSearchTermChange = () => undefined,
  selectedDifficulty = "All",
  onSelectedDifficultyChange = () => undefined,
  difficultyOptions = [],
}: HeaderProps) {
  const location = useLocation();
  const isRoadmap = location.pathname === "/roadmap" || location.pathname === "/";

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 sm:p-6 shadow-xl sticky top-0 z-50 border-b border-slate-700/30">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
          <div className="flex items-center">
            <Activity size={32} className="mr-3 text-sky-400 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              LeetCode Study Mate
            </h1>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex items-center bg-slate-950/40 p-1 rounded-lg border border-slate-800/80">
            <Link
              to="/roadmap"
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
                isRoadmap
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              Ruta de Estudio
            </Link>
            <Link
              to="/learn"
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
                location.pathname === "/learn"
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              Aprender Algoritmos
            </Link>
          </nav>
        </div>

        {isRoadmap && (
          <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-3">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar temas, problemas, tags..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSearchTermChange(e.target.value)
                }
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-slate-600 transition-colors duration-150 text-sm border border-slate-600/30"
              />
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              {difficultyOptions.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => onSelectedDifficultyChange(difficulty)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75
                    ${
                      selectedDifficulty === difficulty
                        ? "bg-sky-500 text-white shadow-md focus:ring-sky-300"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-300 focus:ring-slate-500 border border-slate-600/30"
                    }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}