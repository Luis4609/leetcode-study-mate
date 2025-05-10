// src/features/Problem/components/ProblemDetailModal.tsx
import type {
  Attempt,
  LeetCodeProblem,
  ProblemStatus,
  SolutionLink,
  SubTask,
} from "@/shared/types"; // Adjusted path
import {
  Calendar,
  ExternalLink,
  Link as LinkIcon,
  ListChecks,
  PlusCircle,
  Save,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { problemStatuses } from "../constants"; // Adjusted path

interface ProblemDetailModalProps {
  problem: LeetCodeProblem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProblemData: LeetCodeProblem) => void;
}

const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editableProblem, setEditableProblem] =
    useState<LeetCodeProblem | null>(null);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newAttemptDate, setNewAttemptDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newAttemptResult, setNewAttemptResult] = useState("Accepted");
  const [newAttemptNotes, setNewAttemptNotes] = useState("");
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [newCustomTag, setNewCustomTag] = useState("");

  useEffect(() => {
    if (problem) {
      // Deep copy and ensure all potentially undefined arrays/fields are initialized
      setEditableProblem(
        JSON.parse(
          JSON.stringify({
            ...problem,
            description: problem.description || "",
            problemSpecificNotes: problem.problemSpecificNotes || "",
            solutionLinks: problem.solutionLinks || [],
            attempts: problem.attempts || [],
            subTasks: problem.subTasks || [],
            status: problem.status || "Not Started",
            customTags: problem.customTags || [],
            isPriority: problem.isPriority || false,
            deadline: problem.deadline || "",
          })
        )
      );
    } else {
      setEditableProblem(null);
    }
  }, [problem, isOpen]); // Re-initialize when problem or isOpen changes

  if (!isOpen || !editableProblem) return null;

  const handleInputChange = (
    field: keyof LeetCodeProblem,
    value: string | boolean | string[] | undefined
  ) => {
    setEditableProblem((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange("status", e.target.value as ProblemStatus);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("isPriority", e.target.checked);
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("deadline", e.target.value);
  };

  const addCustomTag = () => {
    if (
      newCustomTag.trim() &&
      editableProblem &&
      !(editableProblem.customTags || []).includes(newCustomTag.trim())
    ) {
      setEditableProblem({
        ...editableProblem,
        customTags: [
          ...(editableProblem.customTags || []),
          newCustomTag.trim(),
        ],
      });
      setNewCustomTag("");
    }
  };
  const removeCustomTag = (tagToRemove: string) => {
    if (editableProblem) {
      setEditableProblem({
        ...editableProblem,
        customTags: (editableProblem.customTags || []).filter(
          (tag) => tag !== tagToRemove
        ),
      });
    }
  };

  const handleSave = () => {
    if (editableProblem) {
      onSave(editableProblem);
    }
    onClose(); // Close modal after saving
  };

  // Solution Links handlers
  const addSolutionLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim() && editableProblem) {
      const newLink: SolutionLink = {
        id: Date.now().toString(),
        name: newLinkName.trim(),
        url: newLinkUrl.trim(),
      };
      setEditableProblem({
        ...editableProblem,
        solutionLinks: [...(editableProblem.solutionLinks || []), newLink],
      });
      setNewLinkName("");
      setNewLinkUrl("");
    }
  };
  const removeSolutionLink = (linkId: string) => {
    if (editableProblem) {
      setEditableProblem({
        ...editableProblem,
        solutionLinks: (editableProblem.solutionLinks || []).filter(
          (link) => link.id !== linkId
        ),
      });
    }
  };

  // Attempts handlers
  const addAttempt = () => {
    if (newAttemptDate && newAttemptResult && editableProblem) {
      const newAttempt: Attempt = {
        id: Date.now().toString(),
        date: newAttemptDate,
        result: newAttemptResult,
        notes: newAttemptNotes.trim(),
      };
      setEditableProblem({
        ...editableProblem,
        attempts: [...(editableProblem.attempts || []), newAttempt],
      });
      setNewAttemptDate(new Date().toISOString().split("T")[0]);
      setNewAttemptResult("Accepted");
      setNewAttemptNotes("");
    }
  };
  const removeAttempt = (attemptId: string) => {
    if (editableProblem) {
      setEditableProblem({
        ...editableProblem,
        attempts: (editableProblem.attempts || []).filter(
          (att) => att.id !== attemptId
        ),
      });
    }
  };

  // SubTasks handlers
  const addSubTask = () => {
    if (newSubTaskText.trim() && editableProblem) {
      const newSubTask: SubTask = {
        id: Date.now().toString(),
        text: newSubTaskText.trim(),
        completed: false,
      };
      setEditableProblem({
        ...editableProblem,
        subTasks: [...(editableProblem.subTasks || []), newSubTask],
      });
      setNewSubTaskText("");
    }
  };
  const toggleSubTask = (taskId: string) => {
    if (editableProblem) {
      setEditableProblem({
        ...editableProblem,
        subTasks: (editableProblem.subTasks || []).map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      });
    }
  };
  const removeSubTask = (taskId: string) => {
    if (editableProblem) {
      setEditableProblem({
        ...editableProblem,
        subTasks: (editableProblem.subTasks || []).filter(
          (task) => task.id !== taskId
        ),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center p-4 z-[100] transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            {editableProblem.isPriority && (
              <Star
                size={22}
                className="mr-2 text-yellow-500 fill-yellow-400"
              />
            )}
            {editableProblem.name}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-6 mb-6">
          {/* Status, Priority, Deadline Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="problemStatus"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Status:
              </label>
              <select
                id="problemStatus"
                value={editableProblem.status}
                onChange={handleStatusChange}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {problemStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="problemDeadline"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Deadline (Optional):
              </label>
              <input
                type="date"
                id="problemDeadline"
                value={editableProblem.deadline}
                onChange={handleDeadlineChange}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-end pb-1">
              <label
                htmlFor="problemPriority"
                className="flex items-center cursor-pointer text-sm font-medium text-slate-700"
              >
                <input
                  type="checkbox"
                  id="problemPriority"
                  checked={!!editableProblem.isPriority}
                  onChange={handlePriorityChange}
                  className="form-checkbox h-5 w-5 text-yellow-500 rounded mr-2 border-slate-300 focus:ring-yellow-400"
                />
                High Priority
              </label>
            </div>
          </div>

          {/* Custom Tags */}
          <div className="space-y-2">
            <label
              htmlFor="customTagsInput"
              className="block text-sm font-medium text-slate-700"
            >
              Custom Tags:
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(editableProblem.customTags || []).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center bg-sky-100 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeCustomTag(tag)}
                    className="ml-1.5 text-sky-500 hover:text-sky-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                id="customTagsInput"
                value={newCustomTag}
                onChange={(e) => setNewCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                placeholder="Add a tag and press Enter"
                className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addCustomTag}
                className="p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm"
              >
                <Tag size={18} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="problemDescription"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Problem Description (paste here):
            </label>
            <textarea
              id="problemDescription"
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              value={editableProblem.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Paste the LeetCode problem description here..."
            />
          </div>

          {/* Problem Specific Notes */}
          <div>
            <label
              htmlFor="problemSpecificNotes"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Problem Specific Notes:
            </label>
            <textarea
              id="problemSpecificNotes"
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              value={editableProblem.problemSpecificNotes}
              onChange={(e) =>
                handleInputChange("problemSpecificNotes", e.target.value)
              }
              placeholder="Your ideas, approaches, key points..."
            />
          </div>

          {/* Solution Links */}
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-slate-700 flex items-center">
              <LinkIcon size={18} className="mr-2" />
              Solution Links:
            </h3>
            {(editableProblem.solutionLinks || []).map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between bg-slate-50 p-2 rounded-md text-sm"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={link.url}
                >
                  {link.name}
                </a>
                <button
                  onClick={() => removeSolutionLink(link.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 items-end">
              <input
                type="text"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                placeholder="Link Name"
                className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="URL"
                className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addSolutionLink}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>

          {/* Attempts */}
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-slate-700 flex items-center">
              <Calendar size={18} className="mr-2" />
              Attempt Log:
            </h3>
            {(editableProblem.attempts || []).map((attempt) => (
              <div
                key={attempt.id}
                className="bg-slate-50 p-2 rounded-md text-sm"
              >
                <div className="flex justify-between items-center">
                  <p>
                    <strong>{attempt.date}:</strong> {attempt.result}
                  </p>
                  <button
                    onClick={() => removeAttempt(attempt.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {attempt.notes && (
                  <p className="text-xs text-slate-600 mt-1 pl-2 border-l-2 border-slate-300">
                    {attempt.notes}
                  </p>
                )}
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <input
                type="date"
                value={newAttemptDate}
                onChange={(e) => setNewAttemptDate(e.target.value)}
                className="p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
              />
              <select
                value={newAttemptResult}
                onChange={(e) => setNewAttemptResult(e.target.value)}
                className="p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
              >
                <option>Accepted</option> <option>Wrong Answer</option>{" "}
                <option>Time Limit Exceeded</option>{" "}
                <option>Memory Limit Exceeded</option>{" "}
                <option>Runtime Error</option>
              </select>
              <input
                type="text"
                value={newAttemptNotes}
                onChange={(e) => setNewAttemptNotes(e.target.value)}
                placeholder="Attempt notes (optional)"
                className="sm:col-span-2 p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addAttempt}
                className="sm:col-span-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>

          {/* Sub-tasks */}
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-slate-700 flex items-center">
              <ListChecks size={18} className="mr-2" />
              Sub-tasks/Steps:
            </h3>
            {(editableProblem.subTasks || []).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-slate-50 p-2 rounded-md text-sm"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleSubTask(task.id)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
                  />
                  <span
                    className={
                      task.completed ? "line-through text-slate-500" : ""
                    }
                  >
                    {task.text}
                  </span>
                </label>
                <button
                  onClick={() => removeSubTask(task.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newSubTaskText}
                onChange={(e) => setNewSubTaskText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubTask()}
                placeholder="New sub-task and press Enter"
                className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addSubTask}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center pt-6 border-t border-slate-200 space-x-3 mt-auto">
          {" "}
          {/* mt-auto pushes footer to bottom */}
          <a
            href={editableProblem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors flex items-center"
          >
            <ExternalLink size={16} className="mr-2" />
            Open in LeetCode
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailModal;
