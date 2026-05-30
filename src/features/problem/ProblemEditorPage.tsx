// src/pages/ProblemEditorPage.tsx
import ProblemMetadataForm from '@/features/problem/components/ProblemMetadataForm'; // Your new metadata form
import AlgorithmVisualizer from '@/features/problem/components/AlgorithmVisualizer';
import { useRoadmapManager } from '@/features/roadmap/hooks/useRoadmapManager';
import type { LeetCodeProblem, ProgrammingLanguage } from '@/shared/types';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// CodeMirror Imports
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
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "tests" | "visualizer">("details");

  useEffect(() => {
    if (problemId) {
      const foundProblem = roadmap.flatMap(topic => topic.subTopics.flatMap(st => st.leetcodeProblems)).find(p => p.id === problemId);
      if (foundProblem) {
        // Deep clone for local editing
        const problemCopy = JSON.parse(JSON.stringify(foundProblem)) as LeetCodeProblem;
        setProblem(problemCopy);
        const initialLang = problemCopy.currentLanguage ?? "javascript";
        setSelectedLanguage(initialLang);
        setCurrentCode(problemCopy.userSolutions?.[initialLang] ?? getDefaultCode(initialLang, problemCopy.name));
        setEditableProblemData(problemCopy); // Initialize editable data with problem copy
      } else {
        // Handle problem not found, e.g., navigate to a 404 page or back to roadmap
        void navigate("/roadmap");
      }
    }
  }, [problemId, roadmap, navigate]);

  const getDefaultCode = (lang: ProgrammingLanguage, problemName: string): string => {
    const pNameBrief = problemName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '');
    const pNameCamelCase = pNameBrief.charAt(0).toLowerCase() + pNameBrief.slice(1);
    if (lang === "java") {
      return `// Solution for ${problemName} in Java\nclass Solution {\n    public Object ${pNameCamelCase}(/* parameters */) {\n        // Your code here\n        return null;\n    }\n}`;
    }
    if (lang === "python") {
      return `# Solution for ${problemName} in Python\nclass Solution:\n    def ${pNameCamelCase}(self, /* parameters */):\n        # Your code here\n        pass`;
    }
    return `// Solution for ${problemName} in JavaScript\nfunction ${pNameCamelCase}(/* parameters */) {\n    // Your code here\n};`;
  };

  const handleMetadataUpdate = (updates: Partial<LeetCodeProblem>) => {
    setEditableProblemData(prev => ({ ...prev, ...updates }));
  };

  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    if (problem) {
      const currentSolutions = { ...(editableProblemData.userSolutions ?? problem.userSolutions ?? {}), [selectedLanguage]: currentCode };
      setEditableProblemData(prev => ({ ...prev, userSolutions: currentSolutions, currentLanguage: lang }));
      setSelectedLanguage(lang);
      setCurrentCode(currentSolutions[lang] ?? getDefaultCode(lang, problem.name));
    }
  };

  const handleCodeChange = (value: string) => {
    setCurrentCode(value);
  };

  const handleSaveChanges = () => {
    if (problem && problemId) {
      const finalSolutions = { ...(editableProblemData.userSolutions ?? problem.userSolutions ?? {}), [selectedLanguage]: currentCode };
      const problemToSave: LeetCodeProblem = {
        ...problem, // Base original problem structure
        ...(editableProblemData as LeetCodeProblem), // Apply all metadata changes
        userSolutions: finalSolutions, // Ensure latest code and solutions object is used
        currentLanguage: selectedLanguage, // Ensure latest language is saved
        lastTestRun: editableProblemData.lastTestRun ?? problem.lastTestRun, // Persist test run if any
      };
      saveProblemDetails(problem.topicId, problem.subTopicId, problem.name, problemToSave); // Assuming you have topicId/subTopicId on problem, or adjust saveProblemDetails
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


  const handleRunTests = () => {
    if (!problem) {return;}

    if (selectedLanguage !== "javascript") {
      alert("Local test runner only supports JavaScript at this time.");
      return;
    }

    setIsRunningTests(true);
    setTestError(null);

    // Create inline Web Worker code
    const workerBlobCode = `
      // Helper function to compare expected and actual values structurally
      function isEqual(a, b) {
        if (a === b) return true;
        if (typeof a !== typeof b) return false;
        if (a && b && typeof a === 'object' && typeof b === 'object') {
          if (Array.isArray(a) !== Array.isArray(b)) return false;
          if (Array.isArray(a)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
              if (!isEqual(a[i], b[i])) return false;
            }
            return true;
          }
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          if (keysA.length !== keysB.length) return false;
          for (const k of keysA) {
            if (!isEqual(a[k], b[k])) return false;
          }
          return true;
        }
        return false;
      }

      function parseExpectedOutput(expectedStr) {
        const trimmed = expectedStr.trim();
        if (trimmed === 'true') return true;
        if (trimmed === 'false') return false;
        if (trimmed === 'null') return null;
        if (trimmed === 'undefined') return undefined;
        if (!isNaN(Number(trimmed))) return Number(trimmed);
        try {
          return JSON.parse(trimmed);
        } catch {
          return trimmed;
        }
      }

      self.onmessage = function(e) {
        const { code, functionName, testCases } = e.data;
        
        const consoleLogs = [];
        const originalLog = console.log;
        console.log = function(...args) {
          consoleLogs.push(args.map(arg => {
            if (arg === null) return "null";
            if (arg === undefined) return "undefined";
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' '));
        };
        
        try {
          // Evaluate the user's solution code
          eval(code);
          
          let fn;
          try {
            fn = eval(functionName);
          } catch {
            fn = self[functionName];
          }
          
          if (typeof fn !== 'function') {
            throw new Error("Function '" + functionName + "' is not defined in your code. Please check the function name.");
          }
          
          const results = [];
          
          for (const tc of testCases) {
            const { id, input, expectedOutput } = tc;
            
            // Build evaluation sandbox with Proxy and with block
            const sandbox = {};
            const proxy = new Proxy(sandbox, {
              has() { return true; },
              get(target, key) { return target[key]; },
              set(target, key, value) { target[key] = value; return true; }
            });
            
            try {
              const evalInput = new Function('proxy', "with(proxy) { " + input + " }");
              evalInput(proxy);
            } catch (err) {
              throw new Error("Failed to parse test case input '" + input + "': " + err.message);
            }
            
            // Extract parameter names from the user's function
            const fnStr = fn.toString();
            const paramSection = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'));
            const paramNames = paramSection.split(',').map(p => p.trim()).filter(Boolean);
            
            // Map parameter names to variables or fall back to values in assignment order
            const args = paramNames.map(name => sandbox[name]);
            const hasMissingArgs = args.some(val => val === undefined);
            const finalArgs = hasMissingArgs ? Object.values(sandbox) : args;
            
            const startTime = performance.now();
            const actualOutput = fn(...finalArgs);
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            const parsedExpected = parseExpectedOutput(expectedOutput);
            const passed = isEqual(actualOutput, parsedExpected);
            
            results.push({
              testCaseId: id,
              passed: passed,
              actualOutput: typeof actualOutput === 'object' ? JSON.stringify(actualOutput) : String(actualOutput),
              duration: duration,
              error: undefined
            });
          }
          
          console.log = originalLog;
          self.postMessage({
            type: 'success',
            results: results,
            consoleOutput: consoleLogs.join('\\n')
          });
          
        } catch (error) {
          console.log = originalLog;
          self.postMessage({
            type: 'error',
            error: error.message,
            consoleOutput: consoleLogs.join('\\n')
          });
        }
      };
    `;

    const blob = new Blob([workerBlobCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    // Timeout of 2 seconds
    const timeoutId = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      setIsRunningTests(false);
      setTestError("Time Limit Exceeded: The code execution took longer than 2000ms and was terminated.");
      
      const newTestRun = {
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        results: (problem.testCases ?? []).map(tc => ({
          testCaseId: tc.id,
          passed: false,
          error: "Time Limit Exceeded (execution > 2000ms)"
        })),
        consoleOutput: ""
      };
      setEditableProblemData(prev => ({ ...prev, lastTestRun: newTestRun }));
    }, 2000);

    worker.onmessage = (e: MessageEvent<{ 
      type: string; 
      results?: { testCaseId: string; passed: boolean; actualOutput?: string; error?: string; duration?: number }[]; 
      error?: string; 
      consoleOutput: string 
    }>) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      setIsRunningTests(false);

      const { type, results, error, consoleOutput } = e.data;

      if (type === 'error') {
        setTestError(error ?? "Unknown error");
        const errorTestRun = {
          language: selectedLanguage,
          timestamp: new Date().toISOString(),
          results: (problem.testCases ?? []).map(tc => ({
            testCaseId: tc.id,
            passed: false,
            error: error ?? "Execution error"
          })),
          consoleOutput: consoleOutput ?? ""
        };
        setEditableProblemData(prev => ({ ...prev, lastTestRun: errorTestRun }));
      } else {
        const newTestRun = {
          language: selectedLanguage,
          timestamp: new Date().toISOString(),
          results: results ?? [],
          consoleOutput: consoleOutput ?? ""
        };
        setEditableProblemData(prev => ({ ...prev, lastTestRun: newTestRun }));
      }
    };

    worker.onerror = (e) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      setIsRunningTests(false);
      setTestError(e.message ?? "An unexpected error occurred during compilation/execution.");
      
      const errorTestRun = {
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        results: (problem.testCases ?? []).map(tc => ({
          testCaseId: tc.id,
          passed: false,
          error: e.message ?? "Execution error"
        })),
        consoleOutput: ""
      };
      setEditableProblemData(prev => ({ ...prev, lastTestRun: errorTestRun }));
    };

    // Extract camelCase function name from problem.name
    const pNameBrief = problem.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '');
    const functionName = pNameBrief.charAt(0).toLowerCase() + pNameBrief.slice(1);

    worker.postMessage({
      code: currentCode,
      functionName,
      testCases: problem.testCases ?? []
    });
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
                <button 
                  onClick={handleRunTests} 
                  disabled={isRunningTests}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  {isRunningTests ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </>
                  ) : (
                    <>
                      <Play size={18} className="mr-2"/> Run Tests
                    </>
                  )}
                </button>
            </div>
        </div>

        {/* Metadata & Test Results Section (only if not fullscreen editor) */}
        {!isFullScreenEditor && (
            <div className="lg:col-span-2 flex flex-col bg-slate-800 rounded-lg shadow-lg max-h-[calc(100vh-150px)] overflow-hidden border border-slate-700/40">
                {/* Tab Bar */}
                <div className="flex border-b border-slate-700/80 bg-slate-900/40 p-1 gap-1">
                    <button 
                        onClick={() => { setActiveTab("details"); }}
                        className={`flex-grow py-2 px-3 text-xs font-semibold rounded-md transition-all ${activeTab === "details" ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"}`}
                    >
                        Details & Notes
                    </button>
                    <button 
                        onClick={() => { setActiveTab("tests"); }}
                        className={`flex-grow py-2 px-3 text-xs font-semibold rounded-md transition-all ${activeTab === "tests" ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"}`}
                    >
                        Test Runner
                    </button>
                    <button 
                        onClick={() => { setActiveTab("visualizer"); }}
                        className={`flex-grow py-2 px-3 text-xs font-semibold rounded-md transition-all ${activeTab === "visualizer" ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"}`}
                    >
                        Visualizer
                    </button>
                </div>
                
                {/* Tab Content */}
                <div className="p-4 space-y-6 overflow-y-auto flex-grow">
                    {activeTab === "details" && (
                        <>
                            {problem.description && (
                                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/30">
                                    <h3 className="text-sm font-semibold text-sky-500 mb-2">Description</h3>
                                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                                </div>
                            )}
                            <h3 className="text-xl font-semibold text-sky-500 border-b border-slate-700 pb-2">Problem Details & Notes</h3>
                            <ProblemMetadataForm problem={(editableProblemData as LeetCodeProblem) ?? problem} onUpdate={handleMetadataUpdate} />
                        </>
                    )}
                    
                    {activeTab === "tests" && (
                        <>
                            {/* Test Cases Display */}
                            {problem.testCases && problem.testCases.length > 0 && (
                                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/30">
                                    <h3 className="text-lg font-semibold text-sky-500 mb-2">Test Cases (Examples)</h3>
                                    <div className="max-h-40 overflow-y-auto space-y-2 text-sm">
                                        {(problem.testCases ?? []).filter(tc => tc.isExample).map((tc) => (
                                            <div key={tc.id} className="p-2 bg-slate-800 rounded">
                                                <p className="font-mono text-slate-300"><strong>Input:</strong> {tc.input}</p>
                                                <p className="font-mono text-slate-300"><strong>Expected:</strong> {tc.expectedOutput}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Test Run Results */}
                            {(editableProblemData.lastTestRun ?? problem.lastTestRun) && (() => {
                                const lastRun = editableProblemData.lastTestRun ?? problem.lastTestRun;
                                if (!lastRun) {
                                    return null;
                                }
                                
                                const allPassed = lastRun.results.every(r => r.passed);
                                const hasErrors = lastRun.results.some(r => r.error);
                                
                                return (
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700/80 shadow-md">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-lg font-semibold text-sky-400">
                                                Last Test Run 
                                                <span className="text-xs font-normal text-slate-400 ml-2">({lastRun.language})</span>
                                                {lastRun.isSimulated && (
                                                    <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded ml-2 border border-slate-700">Simulated</span>
                                                )}
                                            </h3>
                                            <div>
                                                {hasErrors ? (
                                                    <span className="px-2.5 py-1 text-xs font-bold bg-red-900/60 text-red-300 border border-red-700/50 rounded-full animate-pulse">Error</span>
                                                ) : allPassed ? (
                                                    <span className="px-2.5 py-1 text-xs font-bold bg-green-950 text-green-400 border border-green-700/50 rounded-full">All Passed</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-full">Failed</span>
                                                )}
                                            </div>
                                        </div>

                                        {testError && (
                                            <div className="mb-3 p-2 bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono rounded overflow-x-auto whitespace-pre-wrap">
                                                {testError}
                                            </div>
                                        )}

                                        {/* Individual Test Cases */}
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                            {lastRun.results.map((result, idx) => {
                                                const matchedTestCase = (problem.testCases ?? []).find(tc => tc.id === result.testCaseId);
                                                return (
                                                    <div key={result.testCaseId || idx} className="p-3 bg-slate-800/60 rounded border border-slate-700/40">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-semibold text-slate-400 font-mono">Case {idx + 1}</span>
                                                            <div className="flex items-center space-x-2">
                                                                {result.duration !== undefined && (
                                                                    <span className="text-xs text-slate-500 font-mono">{(result.duration).toFixed(1)}ms</span>
                                                                )}
                                                                {result.passed ? (
                                                                    <span className="text-xs font-medium text-green-400 flex items-center bg-green-950/30 px-2 py-0.5 rounded">Passed</span>
                                                                ) : (
                                                                    <span className="text-xs font-medium text-red-400 flex items-center bg-red-950/30 px-2 py-0.5 rounded">Failed</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {matchedTestCase && (
                                                            <div className="text-xs font-mono text-slate-300 space-y-1">
                                                                <div className="flex"><span className="text-slate-500 w-16 shrink-0">Input:</span><span className="truncate">{matchedTestCase.input}</span></div>
                                                                <div className="flex"><span className="text-slate-500 w-16 shrink-0">Expected:</span><span>{matchedTestCase.expectedOutput}</span></div>
                                                            </div>
                                                        )}

                                                        {result.error ? (
                                                            <div className="text-xs text-red-400 font-mono mt-1 pt-1 border-t border-slate-700/30">
                                                                Error: {result.error}
                                                            </div>
                                                        ) : !result.passed && result.actualOutput !== undefined ? (
                                                            <div className="text-xs text-red-400 font-mono mt-1 pt-1 border-t border-slate-700/30">
                                                                Actual: {result.actualOutput}
                                                            </div>
                                                        ) : result.passed && result.actualOutput !== undefined && (
                                                            <div className="text-xs text-green-400/80 font-mono mt-1 pt-1 border-t border-slate-700/30">
                                                                Actual: {result.actualOutput}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {lastRun.consoleOutput && (
                                            <div className="mt-4 border-t border-slate-700/60 pt-3">
                                                <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Console Output</h4>
                                                <pre className="p-2.5 bg-slate-950 rounded text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-36 leading-relaxed">
                                                    {lastRun.consoleOutput}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </>
                    )}
                    
                    {activeTab === "visualizer" && (
                        <AlgorithmVisualizer problem={problem} />
                    )}
                </div>
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