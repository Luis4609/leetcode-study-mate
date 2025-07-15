// src/pages/ProblemEditorPage.tsx
import ProblemMetadataForm from '@/features/problem/components/ProblemMetadataForm'; // Your new metadata form
import { useRoadmapManager } from '@/features/roadmap/hooks/useRoadmapManager';
import type { LeetCodeProblem, ProgrammingLanguage } from '@/shared/types';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// CodeMirror Imports (same as your previous ProblemDetailModal with CodeMirror)
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import CodeMirror from '@uiw/react-codemirror';
import { ArrowLeft, ExternalLink, Maximize2, Minimize2, Play, Save, Star } from 'lucide-react';

const availableLanguages: ProgrammingLanguage[] = ["javascript", "python", "java"];

const ProblemEditorPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { roadmap, saveProblemDetails } = useRoadmapManager();

  const [problem, setProblem] = useState<LeetCodeProblem | null>(null);
  // State for editor and its related functionalities
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>("javascript");
  const [currentCode, setCurrentCode] = useState<string>("");
  const [isFullScreenEditor, setIsFullScreenEditor] = useState(false);
  // State to track local changes before saving everything
  const [editableProblemData, setEditableProblemData] = useState<Partial<LeetCodeProblem>>({});

  console.log("Problem ID from URL:", problemId);
  console.log("Roadmap Data:", roadmap);
  
  useEffect(() => {
    if (problemId) {
      const foundProblem = roadmap.flatMap(topic => topic.subTopics.flatMap(st => st.leetcodeProblems)).find(p => p.id === problemId);
      if (foundProblem) {
        // Deep clone for local editing
        const problemCopy = JSON.parse(JSON.stringify(foundProblem)) as LeetCodeProblem;
        setProblem(problemCopy);
        const initialLang = problemCopy.currentLanguage || "javascript";
        setSelectedLanguage(initialLang);
        setCurrentCode(problemCopy.userSolutions?.[initialLang] || getDefaultCode(initialLang, problemCopy.name));
        setEditableProblemData(problemCopy); // Initialize editable data with problem copy
      } else {
        // Handle problem not found, e.g., navigate to a 404 page or back to roadmap
        navigate("/roadmap");
      }
    }
  }, [problemId, roadmap, navigate]);

  const getDefaultCode = (lang: ProgrammingLanguage, problemName: string): string => {
    const pNameBrief = problemName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '');
    const pNameCamelCase = pNameBrief.charAt(0).toLowerCase() + pNameBrief.slice(1);
    if (lang === "java") return `// Solution for ${problemName} in Java\nclass Solution {\n    public Object ${pNameCamelCase}(/* parameters */) {\n        // Your code here\n        return null;\n    }\n}`;
    if (lang === "python") return `# Solution for ${problemName} in Python\nclass Solution:\n    def ${pNameCamelCase}(self, /* parameters */):\n        # Your code here\n        pass`;
    return `// Solution for ${problemName} in JavaScript\nfunction ${pNameCamelCase}(/* parameters */) {\n    // Your code here\n};`;
  };

  const handleMetadataUpdate = (updates: Partial<LeetCodeProblem>) => {
    setEditableProblemData(prev => ({ ...prev, ...updates }));
  };

  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    if (problem) {
      const currentSolutions = { ...(editableProblemData.userSolutions || problem.userSolutions || {}), [selectedLanguage]: currentCode };
      setEditableProblemData(prev => ({ ...prev, userSolutions: currentSolutions, currentLanguage: lang }));
      setSelectedLanguage(lang);
      setCurrentCode(currentSolutions?.[lang] || getDefaultCode(lang, problem.name));
    }
  };

  const handleCodeChange = (value: string) => {
    setCurrentCode(value);
  };

  const handleSaveChanges = () => {
    if (problem && problemId) {
      const finalSolutions = { ...(editableProblemData.userSolutions || problem.userSolutions || {}), [selectedLanguage]: currentCode };
      const problemToSave: LeetCodeProblem = {
        ...problem, // Base original problem structure
        ...(editableProblemData as LeetCodeProblem), // Apply all metadata changes
        userSolutions: finalSolutions, // Ensure latest code and solutions object is used
        currentLanguage: selectedLanguage, // Ensure latest language is saved
        lastTestRun: editableProblemData.lastTestRun || problem.lastTestRun, // Persist test run if any
      };
      saveProblemDetails(problem.topicId!, problem.subTopicId!, problem.name, problemToSave); // Assuming you have topicId/subTopicId on problem, or adjust saveProblemDetails
      // Or, if saveProblemDetails uses problemId:
      // saveProblemDetailsById(problemId, problemToSave); // You'd need to add this to useRoadmapManager
      alert("Changes saved!"); // Or a more subtle notification
    }
  };
  
  // This is a placeholder; you'll need to adapt `saveProblemDetails` or add a new method
  // in `useRoadmapManager` that can update a problem using its unique `problemId`.
  // For now, assuming `saveProblemDetails` takes `topicId`, `subTopicId`, `problemName`.
  // If your problem object on `useRoadmapManager` doesn't have topicId/subTopicId,
  // you'll need a way to find and update it using `problemId`.


  const handleRunTests = () => { // (Simulated test run logic from before)
    if (!problem) return;
    const simulatedResults = (problem.testCases || []).map(tc => ({
      testCaseId: tc.id, passed: Math.random() > 0.3,
      actualOutput: Math.random() > 0.5 ? tc.expectedOutput : "Simulated different output",
      error: Math.random() > 0.8 ? "Runtime Error" : undefined,
    }));
    const newTestRun = {
      language: selectedLanguage, timestamp: new Date().toISOString(),
      results: simulatedResults, consoleOutput: "Simulated console output..."
    };
    setEditableProblemData(prev => ({ ...prev, lastTestRun: newTestRun }));
  };


  const languageExtension = useMemo(() => {
    switch (selectedLanguage) {
      case "python": return [python()];
      case "java": return [java()];
      case "javascript": default: return [javascript({ jsx: false })];
    }
  }, [selectedLanguage]);

  if (!problem) {
    return <div className="text-center p-10">Loading problem or problem not found...</div>;
  }

  const editorHeight = isFullScreenEditor ? "calc(100vh - 150px)" : "400px"; // Adjust height for page context

  return (
    <div className={`p-4 sm:p-6 bg-slate-900 min-h-screen text-slate-100 ${isFullScreenEditor ? 'fixed inset-0 z-[200]' : 'relative'}`}>
      {/* Page Header */}
      <div className={`mb-6 flex justify-between items-center ${isFullScreenEditor ? 'p-4 bg-slate-800' : ''}`}>
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center text-sky-400 hover:text-sky-300 mb-2">
                <ArrowLeft size={20} className="mr-2" /> Back to Roadmap
            </button>
            <h1 className="text-3xl font-bold text-sky-400 flex items-center">
            {(editableProblemData.isPriority ?? problem.isPriority) && <Star size={28} className="mr-3 text-yellow-400 fill-yellow-400" />}
            {problem.name}
            </h1>
            <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-500 hover:underline flex items-center mt-1">
                View on LeetCode <ExternalLink size={12} className="ml-1" />
            </a>
        </div>
        <div className="flex items-center space-x-2">
            {!isFullScreenEditor && (
                 <button onClick={handleSaveChanges} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md flex items-center">
                    <Save size={18} className="mr-2"/> Save All Changes
                </button>
            )}
            <button onClick={() => setIsFullScreenEditor(!isFullScreenEditor)} className="p-2 rounded-md hover:bg-slate-700 transition-colors" title={isFullScreenEditor ? "Exit Fullscreen" : "Fullscreen Editor"}>
              {isFullScreenEditor ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
        </div>
      </div>

      {/* Main Content: Editor on left, Metadata/Tests on right (or stacked on small screens) */}
      <div className={`grid ${isFullScreenEditor ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5 gap-6'}`}>
        {/* Editor Section */}
        <div className={`${isFullScreenEditor ? 'col-span-1' : 'lg:col-span-3'} bg-slate-800 p-1 rounded-lg shadow-lg flex flex-col`}>
            <div className="flex justify-between items-center mb-2 px-3 pt-2">
                <label htmlFor="language-select" className="text-sm font-medium text-slate-400 mr-2">Language:</label>
                <select id="language-select" value={selectedLanguage} onChange={(e) => handleLanguageChange(e.target.value as ProgrammingLanguage)}
                className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-md focus:ring-sky-500 focus:border-sky-500 p-2">
                {availableLanguages.map(lang => (<option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>))}
                </select>
            </div>
            <div className="relative border border-slate-700 rounded-md overflow-hidden flex-grow">
                <CodeMirror value={currentCode} height={editorHeight} theme={okaidia} extensions={languageExtension} onChange={handleCodeChange}
                className="text-sm" style={{ fontSize: '14px', transition: 'height 0.3s ease-in-out' }}
                basicSetup={{ lineNumbers: true, foldGutter: true, autocompletion: true, bracketMatching: true, indentOnInput: true, highlightActiveLine: true, highlightActiveLineGutter: true }} />
            </div>
             <div className="p-3 mt-2 flex justify-start">
                <button onClick={handleRunTests} className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md">
                    <Play size={18} className="mr-2"/> Run Tests (Simulated)
                </button>
            </div>
        </div>

        {/* Metadata & Test Results Section (only if not fullscreen editor) */}
        {!isFullScreenEditor && (
            <div className="lg:col-span-2 space-y-6 bg-slate-800 p-4 rounded-lg shadow-lg max-h-[calc(100vh-150px)] overflow-y-auto">
                {/* Test Cases Display */}
                {problem.testCases && problem.testCases.length > 0 && (
                    <div className="bg-slate-900 p-3 rounded-lg">
                    <h3 className="text-lg font-semibold text-sky-500 mb-2">Test Cases (Examples)</h3>
                    <div className="max-h-40 overflow-y-auto space-y-2 text-sm">
                        {problem.testCases.filter(tc => tc.isExample).map((tc) => (
                        <div key={tc.id} className="p-2 bg-slate-800 rounded"><p className="font-mono text-slate-300"><strong>Input:</strong> {tc.input}</p><p className="font-mono text-slate-300"><strong>Expected:</strong> {tc.expectedOutput}</p></div>
                        ))}
                    </div>
                    </div>
                )}
                 {/* Test Run Results */}
                {(editableProblemData.lastTestRun || problem.lastTestRun) && (
                    <div className="bg-slate-900 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-sky-500 mb-1">Last Test Run ({(editableProblemData.lastTestRun || problem.lastTestRun)?.language})</h3>
                        {/* ... (rest of test run display logic) ... */}
                    </div>
                )}

                <h3 className="text-xl font-semibold text-sky-500 border-b border-slate-700 pb-2">Problem Details & Notes</h3>
                <ProblemMetadataForm problem={editableProblemData as LeetCodeProblem || problem} onUpdate={handleMetadataUpdate} />
            </div>
        )}
      </div>
      {isFullScreenEditor && (
           <div className="fixed bottom-4 right-4 z-[210]">
                 <button onClick={handleSaveChanges} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md flex items-center">
                    <Save size={18} className="mr-2"/> Save Changes
                </button>
           </div>
      )}
    </div>
  );
};

export default ProblemEditorPage;