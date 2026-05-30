// src/components/ProblemMetadataForm.tsx
import { problemStatuses } from "@/features/problem/constants";
import type {
    Attempt,
    LeetCodeProblem,
    ProblemStatus,
    SolutionLink,
    SubTask,
} from "@/shared/types";
import {
    X as CloseIcon,
    Link as LinkIcon, 
    ListChecks, 
    PlusCircle,
    Tag, 
    Trash2,
    BookOpen,
    Edit3,
    Clock,
    History,
    Plus,
    Activity,
    AlertCircle
} from "lucide-react";
import React, { useState } from "react";

interface ProblemMetadataFormProps {
  problem: LeetCodeProblem;
  onUpdate: (updatedProblemData: Partial<LeetCodeProblem>) => void;
}

const ProblemMetadataForm: React.FC<ProblemMetadataFormProps> = ({
  problem,
  onUpdate,
}) => {
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newAttemptDate, setNewAttemptDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newAttemptResult, setNewAttemptResult] = useState("Accepted");
  const [newAttemptNotes, setNewAttemptNotes] = useState("");
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [newCustomTag, setNewCustomTag] = useState("");

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
    if (newCustomTag.trim() && !(problem.customTags ?? []).includes(newCustomTag.trim())) {
      onUpdate({ customTags: [...(problem.customTags ?? []), newCustomTag.trim()] });
      setNewCustomTag("");
    }
  };

  const removeCustomTag = (tagToRemove: string) => {
    onUpdate({ customTags: (problem.customTags ?? []).filter(tag => tag !== tagToRemove) });
  };

  const addSolutionLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      const newLink: SolutionLink = {
        id: Date.now().toString(), name: newLinkName.trim(), url: newLinkUrl.trim(),
      };
      onUpdate({ solutionLinks: [...(problem.solutionLinks ?? []), newLink] });
      setNewLinkName(""); 
      setNewLinkUrl("");
    }
  };

  const removeSolutionLink = (linkId: string) => {
    onUpdate({ solutionLinks: (problem.solutionLinks ?? []).filter(link => link.id !== linkId) });
  };

  const addAttempt = () => {
    if (newAttemptDate && newAttemptResult) {
      const newAttempt: Attempt = {
        id: Date.now().toString(), date: newAttemptDate, result: newAttemptResult, notes: newAttemptNotes.trim(),
      };
      onUpdate({ attempts: [...(problem.attempts ?? []), newAttempt] });
      setNewAttemptDate(new Date().toISOString().split("T")[0]);
      setNewAttemptResult("Accepted"); 
      setNewAttemptNotes("");
    }
  };

  const removeAttempt = (attemptId: string) => {
    onUpdate({ attempts: (problem.attempts ?? []).filter(att => att.id !== attemptId) });
  };

  const addSubTask = () => {
    if (newSubTaskText.trim()) {
      const newSubTask: SubTask = {
        id: Date.now().toString(), text: newSubTaskText.trim(), completed: false,
      };
      onUpdate({ subTasks: [...(problem.subTasks ?? []), newSubTask] });
      setNewSubTaskText("");
    }
  };

  const toggleSubTask = (taskId: string) => {
    onUpdate({
      subTasks: (problem.subTasks ?? []).map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  const removeSubTask = (taskId: string) => {
    onUpdate({ subTasks: (problem.subTasks ?? []).filter(task => task.id !== taskId) });
  };

  return (
    <div className="space-y-6">
      
      {/* CARD 1: Status & Deadlines */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-sky-500/30 rounded-xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/30">
          <Activity size={18} className="text-sky-400 group-hover:text-indigo-400 transition-colors" />
          <h4 className="text-sm font-semibold text-slate-200">Status & Planning</h4>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="problemStatus" className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <span>Status:</span>
              </label>
              <select id="problemStatus" value={problem.status ?? "Not Started"} onChange={handleStatusChange}
                className="w-full p-2.5 bg-slate-900/60 border border-slate-700/80 rounded-lg focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm text-slate-100 transition-all cursor-pointer">
                {problemStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            
            <div>
              <label htmlFor="problemDeadline" className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <Clock size={12} className="text-slate-500" />
                <span>Deadline:</span>
              </label>
              <input type="date" id="problemDeadline" value={problem.deadline ?? ""} onChange={handleDeadlineChange}
                className="w-full p-2.5 bg-slate-900/60 border border-slate-700/80 rounded-lg focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm text-slate-100 transition-all" />
            </div>
          </div>

          <div className="pt-2">
            <label htmlFor="problemPriority" className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-lg border border-slate-700/30 cursor-pointer select-none w-full">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-500 animate-pulse" />
                Mark as High Priority
              </span>
              <div className="relative inline-flex items-center">
                <input type="checkbox" id="problemPriority" checked={Boolean(problem.isPriority)} onChange={handlePriorityChange}
                  className="sr-only" />
                <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${problem.isPriority ? 'bg-gradient-to-r from-sky-500 to-indigo-500' : 'bg-slate-700'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${problem.isPriority ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* CARD 2: Custom Tags */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-sky-500/30 rounded-xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/30">
          <Tag size={18} className="text-sky-400 group-hover:text-indigo-400 transition-colors" />
          <h4 className="text-sm font-semibold text-slate-200">Custom Tags</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {(problem.customTags ?? []).length === 0 ? (
              <span className="text-xs text-slate-500 italic">No custom tags added yet</span>
            ) : (
              (problem.customTags ?? []).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-sky-950/50 border border-sky-800/40 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-sky-950 transition-colors">
                  {tag}
                  <button onClick={() => removeCustomTag(tag)} className="text-sky-400 hover:text-sky-200 transition-colors" aria-label={`Remove tag ${tag}`}>
                    <CloseIcon size={12} />
                  </button>
                </span>
              ))
            )}
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="relative flex-grow">
              <input type="text" id="customTagsInput" value={newCustomTag} onChange={(e) => setNewCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTag()} placeholder="Add a tag and press Enter"
                className="w-full p-2.5 pl-3 bg-slate-900/60 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all" />
            </div>
            <button onClick={addCustomTag} className="p-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 active:scale-95 transition-all">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* CARD 3: Problem Description */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-sky-500/30 rounded-xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/30">
          <BookOpen size={18} className="text-sky-400 group-hover:text-indigo-400 transition-colors" />
          <h4 className="text-sm font-semibold text-slate-200">Problem Description</h4>
        </div>
        
        <div>
          <textarea id="problemDescription" rows={3} value={problem.description ?? ""}
            onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Paste the LeetCode problem description here..."
            className="w-full p-3 bg-slate-900/60 border border-slate-700/80 rounded-lg focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm text-slate-100 placeholder-slate-500 transition-all font-sans leading-relaxed" />
        </div>
      </div>

      {/* CARD 4: Notes */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-sky-500/30 rounded-xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/30">
          <Edit3 size={18} className="text-sky-400 group-hover:text-indigo-400 transition-colors" />
          <h4 className="text-sm font-semibold text-slate-200">Problem Notes</h4>
        </div>
        
        <div>
          <textarea id="problemSpecificNotes" rows={4} value={problem.problemSpecificNotes ?? ""}
            onChange={(e) => handleInputChange("problemSpecificNotes", e.target.value)} placeholder="Write down your ideas, algorithmic approaches, or pitfalls to avoid..."
            className="w-full p-3 bg-slate-900/60 border border-slate-700/80 rounded-lg focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm text-slate-100 placeholder-slate-500 transition-all font-sans leading-relaxed" />
        </div>
      </div>

      {/* CARD 5: Solution Links */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-sky-500/30 rounded-xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/30">
          <LinkIcon size={18} className="text-sky-400 group-hover:text-indigo-400 transition-colors" />
          <h4 className="text-sm font-semibold text-slate-200">Solution Reference Links</h4>
        </div>
        
        <div className="space-y-3">
          {(problem.solutionLinks ?? []).length > 0 && (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {(problem.solutionLinks ?? []).map((link) => (
                <div key={link.id} className="flex items-center justify-between bg-slate-900/40 border border-slate-700/30 p-2.5 rounded-lg text-sm group-hover:border-slate-600 transition-all">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-medium truncate flex-grow mr-2" title={link.url}>{link.name}</a>
                  <button onClick={() => removeSolutionLink(link.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/30 p-1.5 rounded transition-all opacity-80 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 pt-1 border-t border-slate-800/40">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)} placeholder="Link Name"
                className="p-2.5 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all" />
              <input type="url" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="URL"
                className="p-2.5 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all" />
            </div>
            <button onClick={addSolutionLink} className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium rounded-lg text-xs flex justify-center items-center gap-1.5 shadow-md shadow-sky-500/10 active:scale-[0.98] transition-all">
              <PlusCircle size={14} /> Add Reference Link
            </button>
          </div>
        </div>
      </div>

      {/* CARD 6: Attempt Log */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-sky-500/30 rounded-xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/30">
          <History size={18} className="text-sky-400 group-hover:text-indigo-400 transition-colors" />
          <h4 className="text-sm font-semibold text-slate-200">Attempt History</h4>
        </div>
        
        <div className="space-y-4">
          {(problem.attempts ?? []).length > 0 && (
            <div className="space-y-3 max-h-44 overflow-y-auto pr-1">
              {(problem.attempts ?? []).map((attempt) => (
                <div key={attempt.id} className="bg-slate-900/40 border border-slate-700/30 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono font-medium">{attempt.date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        attempt.result === 'Accepted' ? 'bg-green-950/40 text-green-400 border border-green-900/30' :
                        attempt.result === 'Wrong Answer' ? 'bg-red-950/40 text-red-400 border border-red-900/30' :
                        'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}>
                        {attempt.result}
                      </span>
                    </div>
                    <button onClick={() => removeAttempt(attempt.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/30 p-1.5 rounded transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {attempt.notes && (
                    <p className="text-xs text-slate-400 pl-2.5 border-l border-slate-700 leading-relaxed pt-0.5">
                      {attempt.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 pt-2 border-t border-slate-800/40">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="newAttemptDate" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Date:</label>
                <input type="date" id="newAttemptDate" value={newAttemptDate} onChange={(e) => setNewAttemptDate(e.target.value)}
                  className="w-full p-2 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all" />
              </div>
              <div>
                <label htmlFor="newAttemptResult" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Result:</label>
                <select id="newAttemptResult" value={newAttemptResult} onChange={(e) => setNewAttemptResult(e.target.value)}
                  className="w-full p-2 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all cursor-pointer">
                  <option>Accepted</option>
                  <option>Wrong Answer</option>
                  <option>Time Limit Exceeded</option>
                  <option>Memory Limit Exceeded</option>
                  <option>Runtime Error</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <input type="text" value={newAttemptNotes} onChange={(e) => setNewAttemptNotes(e.target.value)} placeholder="Attempt notes (optional)"
                className="flex-grow p-2.5 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all" />
              <button onClick={addAttempt} className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 shadow-md shadow-sky-500/10 active:scale-[0.97] transition-all">
                <Plus size={14} /> Add Attempt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 7: Checklist / Sub-tasks */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-sky-500/30 rounded-xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/30">
          <ListChecks size={18} className="text-sky-400 group-hover:text-indigo-400 transition-colors" />
          <h4 className="text-sm font-semibold text-slate-200">Sub-tasks / Steps</h4>
        </div>
        
        <div className="space-y-3">
          {(problem.subTasks ?? []).length > 0 && (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {(problem.subTasks ?? []).map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-slate-900/40 border border-slate-700/30 p-2.5 rounded-lg text-sm group-hover:border-slate-600 transition-all">
                  <label className="flex items-center cursor-pointer text-slate-200 flex-grow mr-2">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleSubTask(task.id)}
                      className="form-checkbox h-4 w-4 text-sky-500 rounded mr-2.5 bg-slate-900 border-slate-700 focus:ring-sky-500 focus:ring-offset-slate-900 cursor-pointer" />
                    <span className={`text-xs ${task.completed ? "line-through text-slate-500" : "text-slate-300"}`}>{task.text}</span>
                  </label>
                  <button onClick={() => removeSubTask(task.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/30 p-1.5 rounded transition-all opacity-80 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-center pt-1 border-t border-slate-800/40">
            <input type="text" value={newSubTaskText} onChange={(e) => setNewSubTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubTask()} placeholder="Add new step / sub-task"
              className="flex-1 p-2.5 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all" />
            <button onClick={addSubTask} className="p-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 active:scale-95 transition-all">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProblemMetadataForm;