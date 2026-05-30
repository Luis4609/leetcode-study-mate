// src/features/Roadmap/components/SubTopicCard.tsx
import React, { memo, useState } from 'react'; // Import memo

import { BookOpen, Target } from 'lucide-react';

import type { LeetCodeProblem, SubTopic } from '@/shared/types';

import LeetCodeProblemItem from './LeetCodeProblemItem';
import ResourceItem from './ResourceItem';

interface SubTopicCardProps {
  subTopic: SubTopic;
  topicId: string;
  onToggleComplete: (topicId: string, subTopicId: string) => void;
  onNotesChange: (topicId: string, subTopicId: string, notes: string) => void;
  onViewProblem: (
    problem: LeetCodeProblem,
    topicId: string,
    subTopicId: string,
  ) => void;
}

const SubTopicCard: React.FC<SubTopicCardProps> = memo(
  ({
    // Wrap with memo
    subTopic,
    topicId,
    onToggleComplete,
    onNotesChange,
    onViewProblem,
  }) => {
    const [notes, setNotes] = useState<string>(subTopic.notes || '');

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(e.target.value);
      onNotesChange(topicId, subTopic.id, e.target.value);
    };

    const handleCheckboxChange = () => {
      onToggleComplete(topicId, subTopic.id);
    };

    const checkboxId = `complete-${topicId}-${subTopic.id}`;

    return (
      <div className="bg-slate-900/30 border border-slate-800/85 p-5 rounded-xl mb-4 hover:border-slate-700/30 transition-all shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
          <h4 className="text-md font-bold text-slate-100 mb-2 sm:mb-0">
            {subTopic.title}
          </h4>
          <div className="flex items-center">
            <label
              htmlFor={checkboxId}
              className="mr-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none cursor-pointer"
            >
              Completado:
            </label>
            <input
              type="checkbox"
              id={checkboxId}
              checked={subTopic.completed}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4.5 w-4.5 text-sky-500 rounded bg-slate-950 border-slate-800 focus:ring-sky-500 focus:ring-opacity-50 cursor-pointer"
            />
          </div>
        </div>

        {(subTopic.resources ?? []).length > 0 && (
          <div className="mb-4">
            <h5 className="text-[10px] font-bold text-slate-400 mb-2 flex items-center uppercase tracking-wider">
              <BookOpen
                size={14}
                className="mr-2 text-indigo-400"
                aria-hidden="true"
              />
              Recursos de Aprendizaje:
            </h5>
            <ul className="space-y-1 list-inside bg-slate-950/20 rounded-lg p-2 border border-slate-900/40">
              {(subTopic.resources ?? []).map((resource) => (
                <ResourceItem key={resource.name} resource={resource} />
              ))}
            </ul>
          </div>
        )}

        {subTopic.leetcodeProblems && (
          <div className="mb-4">
            <h5 className="text-[10px] font-bold text-slate-400 mb-2 flex items-center uppercase tracking-wider">
              <Target
                size={14}
                className="mr-2 text-sky-400"
                aria-hidden="true"
              />
              Problemas de LeetCode:
            </h5>
            {subTopic.leetcodeProblems.length > 0 ? (
              <ul className="space-y-1 bg-slate-950/20 rounded-lg p-2 border border-slate-900/40">
                {subTopic.leetcodeProblems.map((problem) => (
                  <LeetCodeProblemItem
                    key={problem.name}
                    problem={problem}
                    topicId={topicId}
                    subTopicId={subTopic.id}
                    onViewProblem={onViewProblem}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-xs p-3 bg-slate-950/50 rounded-lg border border-slate-900/50 italic">
                No hay problemas disponibles para los filtros actuales.
              </p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor={`notes-${topicId}-${subTopic.id}`}
            className="text-[10px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider"
          >
            Mis Notas de Estudio:
          </label>
          <textarea
            id={`notes-${topicId}-${subTopic.id}`}
            value={notes}
            onChange={handleNotesChange}
            placeholder="Añade tus notas o apuntes para este sub-tema..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-350 placeholder-slate-700 transition-all text-xs font-sans leading-relaxed"
            rows={2}
          ></textarea>
        </div>
      </div>
    );
  },
);

SubTopicCard.displayName = 'SubTopicCard'; // Add display name

export default SubTopicCard;
