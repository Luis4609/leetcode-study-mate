// src/components/ProblemMetadataForm.tsx
import { problemStatuses } from "@/features/problem/constants"; // Corrected path
import type {
    Attempt,
    LeetCodeProblem,
    ProblemStatus,
    SolutionLink,
    SubTask,
} from "@/shared/types";
import {
    Calendar,
    X as CloseIcon // Renamed X to CloseIcon to avoid conflict
    ,
    Link as LinkIcon, ListChecks, PlusCircle,
    Tag, Trash2
} from "lucide-react";
import React, { useState } from "react";

interface ProblemMetadataFormProps {
  problem: LeetCodeProblem; // Expects a non-null problem
  onUpdate: (updatedProblemData: Partial<LeetCodeProblem>) => void; // Callback to signal partial updates
  // onSave is handled by the parent page
}

const ProblemMetadataForm: React.FC<ProblemMetadataFormProps> = ({
  problem,
  onUpdate,
}) => {
  // Local state for form inputs that add new items (links, attempts, etc.)
  // The actual problem data is managed by the parent (ProblemEditorPage)
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newAttemptDate, setNewAttemptDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newAttemptResult, setNewAttemptResult] = useState("Accepted");
  const [newAttemptNotes, setNewAttemptNotes] = useState("");
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [newCustomTag, setNewCustomTag] = useState("");

  // Handlers that call onUpdate with the specific field change
  const handleInputChange = (
    field: keyof LeetCodeProblem,
    value: string | number | boolean
  ) => {
    onUpdate({ [field]: value });
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
    if (newCustomTag.trim() && !(problem.customTags || []).includes(newCustomTag.trim())) {
      onUpdate({ customTags: [...(problem.customTags || []), newCustomTag.trim()] });
      setNewCustomTag("");
    }
  };
  const removeCustomTag = (tagToRemove: string) => {
    onUpdate({ customTags: (problem.customTags || []).filter(tag => tag !== tagToRemove) });
  };

  const addSolutionLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      const newLink: SolutionLink = {
        id: Date.now().toString(), name: newLinkName.trim(), url: newLinkUrl.trim(),
      };
      onUpdate({ solutionLinks: [...(problem.solutionLinks || []), newLink] });
      setNewLinkName(""); setNewLinkUrl("");
    }
  };
  const removeSolutionLink = (linkId: string) => {
    onUpdate({ solutionLinks: (problem.solutionLinks || []).filter(link => link.id !== linkId) });
  };

  const addAttempt = () => {
    if (newAttemptDate && newAttemptResult) {
      const newAttempt: Attempt = {
        id: Date.now().toString(), date: newAttemptDate, result: newAttemptResult, notes: newAttemptNotes.trim(),
      };
      onUpdate({ attempts: [...(problem.attempts || []), newAttempt] });
      setNewAttemptDate(new Date().toISOString().split("T")[0]);
      setNewAttemptResult("Accepted"); setNewAttemptNotes("");
    }
  };
  const removeAttempt = (attemptId: string) => {
    onUpdate({ attempts: (problem.attempts || []).filter(att => att.id !== attemptId) });
  };

  const addSubTask = () => {
    if (newSubTaskText.trim()) {
      const newSubTask: SubTask = {
        id: Date.now().toString(), text: newSubTaskText.trim(), completed: false,
      };
      onUpdate({ subTasks: [...(problem.subTasks || []), newSubTask] });
      setNewSubTaskText("");
    }
  };
  const toggleSubTask = (taskId: string) => {
    onUpdate({
      subTasks: (problem.subTasks || []).map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    });
  };
  const removeSubTask = (taskId: string) => {
    onUpdate({ subTasks: (problem.subTasks || []).filter(task => task.id !== taskId) });
  };

  return (
    // This form no longer needs to be a modal itself, but a section of a page.
    // The parent page (ProblemEditorPage) will handle the overall layout and save button.
    <div className="space-y-6 p-1"> {/* Removed modal background, using simple padding */}
        {/* Status, Priority, Deadline Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="problemStatus" className="block text-sm font-medium text-slate-300 mb-1">Status:</label>
            <select id="problemStatus" value={problem.status || "Not Started"} onChange={handleStatusChange}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 text-sm text-slate-100">
              {problemStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="problemDeadline" className="block text-sm font-medium text-slate-300 mb-1">Deadline (Optional):</label>
            <input type="date" id="problemDeadline" value={problem.deadline || ""} onChange={handleDeadlineChange}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 text-sm text-slate-100" />
          </div>
          <div className="flex items-end pb-1">
            <label htmlFor="problemPriority" className="flex items-center cursor-pointer text-sm font-medium text-slate-300">
              <input type="checkbox" id="problemPriority" checked={!!problem.isPriority} onChange={handlePriorityChange}
                className="form-checkbox h-5 w-5 text-yellow-500 rounded mr-2 border-slate-600 bg-slate-700 focus:ring-yellow-400" />
              High Priority
            </label>
          </div>
        </div>

        {/* Custom Tags */}
        <div className="space-y-2">
          <label htmlFor="customTagsInput" className="block text-sm font-medium text-slate-300">Custom Tags:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(problem.customTags || []).map((tag) => (
              <span key={tag} className="flex items-center bg-sky-700 text-sky-100 text-xs font-medium px-2.5 py-1 rounded-full">
                {tag}
                <button onClick={() => removeCustomTag(tag)} className="ml-1.5 text-sky-300 hover:text-sky-100"><CloseIcon size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <input type="text" id="customTagsInput" value={newCustomTag} onChange={(e) => setNewCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomTag()} placeholder="Add a tag and press Enter"
              className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-1 focus:ring-sky-500" />
            <button onClick={addCustomTag} className="p-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm"><Tag size={18} /></button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="problemDescription" className="block text-sm font-medium text-slate-300 mb-1">Problem Description:</label>
          <textarea id="problemDescription" rows={3} value={problem.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Paste the LeetCode problem description here..."
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 text-sm text-slate-100" />
        </div>

        {/* Problem Specific Notes */}
        <div>
          <label htmlFor="problemSpecificNotes" className="block text-sm font-medium text-slate-300 mb-1">Problem Specific Notes:</label>
          <textarea id="problemSpecificNotes" rows={3} value={problem.problemSpecificNotes || ""}
            onChange={(e) => handleInputChange("problemSpecificNotes", e.target.value)} placeholder="Your ideas, approaches, key points..."
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 text-sm text-slate-100" />
        </div>

        {/* Solution Links */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold text-slate-300 flex items-center"><LinkIcon size={18} className="mr-2" />Solution Links:</h3>
          {(problem.solutionLinks || []).map((link) => (
            <div key={link.id} className="flex items-center justify-between bg-slate-700 p-2 rounded-md text-sm">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline truncate" title={link.url}>{link.name}</a>
              <button onClick={() => removeSolutionLink(link.id)} className="text-red-400 hover:text-red-300 ml-2"><Trash2 size={16} /></button>
            </div>
          ))}
          <div className="flex gap-2 items-end">
            <input type="text" value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)} placeholder="Link Name"
              className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-1 focus:ring-sky-500" />
            <input type="url" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="URL"
              className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-1 focus:ring-sky-500" />
            <button onClick={addSolutionLink} className="p-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm"><PlusCircle size={18} /></button>
          </div>
        </div>

        {/* Attempts */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold text-slate-300 flex items-center"><Calendar size={18} className="mr-2" />Attempt Log:</h3>
          {(problem.attempts || []).map((attempt) => (
            <div key={attempt.id} className="bg-slate-700 p-2 rounded-md text-sm">
              <div className="flex justify-between items-center">
                <p className="text-slate-200"><strong>{attempt.date}:</strong> {attempt.result}</p>
                <button onClick={() => removeAttempt(attempt.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
              </div>
              {attempt.notes && (<p className="text-xs text-slate-400 mt-1 pl-2 border-l-2 border-slate-500">{attempt.notes}</p>)}
            </div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
            <input type="date" value={newAttemptDate} onChange={(e) => setNewAttemptDate(e.target.value)}
              className="p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-1 focus:ring-sky-500" />
            <select value={newAttemptResult} onChange={(e) => setNewAttemptResult(e.target.value)}
              className="p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-1 focus:ring-sky-500">
              <option>Accepted</option><option>Wrong Answer</option><option>Time Limit Exceeded</option><option>Memory Limit Exceeded</option><option>Runtime Error</option>
            </select>
            <input type="text" value={newAttemptNotes} onChange={(e) => setNewAttemptNotes(e.target.value)} placeholder="Attempt notes (optional)"
              className="sm:col-span-2 p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-1 focus:ring-sky-500" />
            <button onClick={addAttempt} className="sm:col-span-1 p-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm"><PlusCircle size={18} /></button>
          </div>
        </div>

        {/* Sub-tasks */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold text-slate-300 flex items-center"><ListChecks size={18} className="mr-2" />Sub-tasks/Steps:</h3>
          {(problem.subTasks || []).map((task) => (
            <div key={task.id} className="flex items-center justify-between bg-slate-700 p-2 rounded-md text-sm">
              <label className="flex items-center cursor-pointer text-slate-200">
                <input type="checkbox" checked={task.completed} onChange={() => toggleSubTask(task.id)}
                  className="form-checkbox h-4 w-4 text-sky-500 rounded mr-2 bg-slate-600 border-slate-500" />
                <span className={task.completed ? "line-through text-slate-500" : ""}>{task.text}</span>
              </label>
              <button onClick={() => removeSubTask(task.id)} className="text-red-400 hover:text-red-300 ml-2"><Trash2 size={16} /></button>
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <input type="text" value={newSubTaskText} onChange={(e) => setNewSubTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubTask()} placeholder="New sub-task and press Enter"
              className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-1 focus:ring-sky-500" />
            <button onClick={addSubTask} className="p-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm"><PlusCircle size={18} /></button>
          </div>
        </div>
    </div>
  );
};

export default ProblemMetadataForm;