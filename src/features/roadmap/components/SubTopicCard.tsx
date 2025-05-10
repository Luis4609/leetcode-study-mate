// src/features/Roadmap/components/SubTopicCard.tsx
import type { LeetCodeProblem, SubTopic } from "@/shared/types";
import { BookOpen, Target } from "lucide-react";
import React, { useState } from "react";
import LeetCodeProblemItem from "./LeetCodeProblemItem";
import ResourceItem from "./ResourceItem";

interface SubTopicCardProps {
  subTopic: SubTopic;
  topicId: string;
  onToggleComplete: (topicId: string, subTopicId: string) => void;
  onNotesChange: (topicId: string, subTopicId: string, notes: string) => void;
  onOpenProblemModal: (
    problem: LeetCodeProblem,
    topicId: string,
    subTopicId: string
  ) => void;
}

const SubTopicCard: React.FC<SubTopicCardProps> = ({
  subTopic,
  topicId,
  onToggleComplete,
  onNotesChange,
  onOpenProblemModal,
}) => {
  const [notes, setNotes] = useState<string>(subTopic.notes || "");

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    onNotesChange(topicId, subTopic.id, e.target.value);
  };

  const handleCheckboxChange = () => {
    onToggleComplete(topicId, subTopic.id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-slate-200 mb-4 transform hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
        <h4 className="text-lg font-semibold text-slate-800 mb-2 sm:mb-0">
          {subTopic.title}
        </h4>
        <div className="flex items-center">
          <label
            htmlFor={`complete-${topicId}-${subTopic.id}`}
            className="mr-2 text-sm text-slate-600 select-none"
          >
            Completed:
          </label>
          <input
            type="checkbox"
            id={`complete-${topicId}-${subTopic.id}`}
            checked={subTopic.completed}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {subTopic.resources?.length > 0 && (
        <div className="mb-4">
          <h5 className="text-md font-semibold text-slate-700 mb-2 flex items-center">
            <BookOpen size={16} className="mr-2 text-indigo-500" />
            Learning Resources:
          </h5>
          <ul className="space-y-1 list-inside">
            {subTopic.resources.map((resource) => (
              <ResourceItem key={resource.name} resource={resource} />
            ))}
          </ul>
        </div>
      )}

      {subTopic.leetcodeProblems && (
        <div className="mb-4">
          <h5 className="text-md font-semibold text-slate-700 mb-2 flex items-center">
            <Target size={16} className="mr-2 text-blue-500" />
            LeetCode Problems:
          </h5>
          {subTopic.leetcodeProblems.length > 0 ? (
            <ul className="space-y-1">
              {subTopic.leetcodeProblems.map((problem) => (
                <LeetCodeProblemItem
                  key={problem.name}
                  problem={problem}
                  topicId={topicId}
                  subTopicId={subTopic.id}
                  onOpenModal={onOpenProblemModal}
                />
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm p-3 bg-slate-50 rounded-md italic">
              No problems match the current filters for this sub-topic.
            </p>
          )}
        </div>
      )}

      <div>
        <h5 className="text-md font-semibold text-slate-700 mb-1">
          My Notes (Sub-topic):
        </h5>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add your notes for this sub-topic..."
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150 text-sm"
          rows={3}
        ></textarea>
      </div>
    </div>
  );
};

export default SubTopicCard;
