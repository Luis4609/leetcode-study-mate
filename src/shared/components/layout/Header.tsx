// src/components/layout/Header.tsx
import React from 'react';
import { Activity, Search } from 'lucide-react';
import type { DifficultyLevel } from '@/shared/types'; // Ensure this path is correct

interface HeaderProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedDifficulty: DifficultyLevel;
  onSelectedDifficultyChange: (difficulty: DifficultyLevel) => void;
  difficultyOptions: DifficultyLevel[];
}

export function Header({
  searchTerm,
  onSearchTermChange,
  selectedDifficulty,
  onSelectedDifficultyChange,
  difficultyOptions,
}: HeaderProps) {
  return (
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
              placeholder="Search topics, problems, tags..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchTermChange(e.target.value)
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
                onClick={() => onSelectedDifficultyChange(difficulty)}
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
  );
}