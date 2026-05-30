// src/features/problem/components/AlgorithmVisualizer.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { LeetCodeProblem } from "@/shared/types";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle
} from "lucide-react";

interface AlgorithmVisualizerProps {
  problem: LeetCodeProblem;
}

// -------------------------------------------------------------
// TYPES & SCHEMAS FOR SIMULATIONS
// -------------------------------------------------------------
interface CDStep {
  index: number;
  nums: number[];
  set: number[];
  status: string;
  codeLine: number;
  action: "init" | "check" | "add" | "duplicate" | "finish";
  val?: number;
}

interface VPStep {
  left: number;
  right: number;
  chars: string[];
  status: string;
  codeLine: number;
  action: "init" | "check_left" | "check_right" | "compare_match" | "compare_fail" | "skip_left" | "skip_right" | "finish_ok";
  compareResult?: boolean;
}

interface VAStep {
  i: number;
  s: string;
  t: string;
  countS: Record<string, number>;
  countT: Record<string, number>;
  status: string;
  codeLine: number;
  action: "init" | "length_check" | "loop" | "loop_done" | "verify" | "verify_fail" | "finish_ok";
  verifyChar?: string;
  isSameLength?: boolean;
}

// -------------------------------------------------------------
// HELPER: PARSING UTILITIES FOR CUSTOM INPUT
// -------------------------------------------------------------
const parseArrayInput = (inputStr: string): number[] => {
  const clean = inputStr.replace(/nums\s*=\s*/, "").trim();
  try {
    const parsed: unknown = JSON.parse(clean);
    if (Array.isArray(parsed)) {
      return (parsed as unknown[]).map(Number).filter(n => !isNaN(n));
    }
  } catch {
    // ignore parsing errors
  }
  return clean
    .replace(/\[|\]/g, "")
    .split(",")
    .map(s => Number(s.trim()))
    .filter(n => !isNaN(n));
};

const parseAnagramInputs = (inputStr: string): { s: string; t: string } => {
  // Try parsing something like: s = "anagram", t = "nagaram"
  try {
    const sMatch = /s\s*=\s*"([^"]+)"/.exec(inputStr);
    const tMatch = /t\s*=\s*"([^"]+)"/.exec(inputStr);
    if (sMatch && tMatch) {
      return { s: sMatch[1], t: tMatch[1] };
    }
  } catch {
    // ignore parsing errors
  }
  // Split on commas/semicolons and extract
  const parts = inputStr.split(/,|;/).map(p => p.trim());
  let s = "anagram";
  let t = "nagaram";
  for (const part of parts) {
    if (part.startsWith("s=")) {
      s = part.substring(2).replace(/"/g, "");
    } else if (part.startsWith("t=")) {
      t = part.substring(2).replace(/"/g, "");
    }
  }
  return { s, t };
};

const cleanPalindromeInput = (inputStr: string): string => {
  return inputStr.replace(/s\s*=\s*"/, "").replace(/"$/, "").trim();
};

const isAlphanumeric = (char: string): boolean => {
  return /^[a-zA-Z0-9]$/.test(char);
};

const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({ problem }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms
  
  // Custom Input States
  const [customInput, setCustomInput] = useState("");
  const [resolvedInput, setResolvedInput] = useState<number[] | string | { s: string; t: string } | null>(null);

  // Playback timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load default inputs based on problem
  useEffect(() => {
    if (problem.id === "lc217") {
      const defaultVal = "[1, 2, 3, 1]";
      setCustomInput(defaultVal);
      setResolvedInput(parseArrayInput(defaultVal));
    } else if (problem.id === "lc125") {
      const defaultVal = '"A man, a plan, a canal: Panama"';
      setCustomInput(defaultVal);
      setResolvedInput(cleanPalindromeInput(defaultVal));
    } else if (problem.id === "lc242") {
      const defaultVal = 's = "anagram", t = "nagaram"';
      setCustomInput(defaultVal);
      setResolvedInput(parseAnagramInputs(defaultVal));
    } else {
      setCustomInput("");
      setResolvedInput(null);
    }
    setCurrentStep(0);
    setIsPlaying(false);
  }, [problem.id]);

  // -------------------------------------------------------------
  // SIMULATION GENERATORS
  // -------------------------------------------------------------
  
  // 1. Contains Duplicate LC217
  const cdSteps = useMemo<CDStep[]>(() => {
    if (problem.id !== "lc217" || !Array.isArray(resolvedInput)) {
      return [];
    }
    const nums = resolvedInput;
    const steps: CDStep[] = [];
    
    // Step 0: Init
    steps.push({
      index: -1,
      nums,
      set: [],
      status: "Initialize an empty HashSet to keep track of elements we've seen so far.",
      codeLine: 2,
      action: "init"
    });

    const set = new Set<number>();
    
    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      
      // Step 1: Check
      steps.push({
        index: i,
        nums,
        set: Array.from(set),
        status: `Checking element at index ${i} (value: ${val}). Does our HashSet contain ${val}?`,
        codeLine: 4,
        action: "check",
        val
      });

      if (set.has(val)) {
        // Step 2: Duplicate found
        steps.push({
          index: i,
          nums,
          set: Array.from(set),
          status: `HashSet already contains value ${val}! We found a duplicate element. Returning true.`,
          codeLine: 5,
          action: "duplicate",
          val
        });
        return steps;
      }
      
      set.add(val);
      // Step 3: Added
      steps.push({
        index: i,
        nums,
        set: Array.from(set),
        status: `${val} is not in our HashSet. Adding ${val} to the set and continuing scan.`,
        codeLine: 7,
        action: "add",
        val
      });
    }

    // Step 4: Finish
    steps.push({
      index: nums.length,
      nums,
      set: Array.from(set),
      status: "Scanned the entire array and found no duplicates. Returning false.",
      codeLine: 9,
      action: "finish"
    });

    return steps;
  }, [problem.id, resolvedInput]);

  // 2. Valid Palindrome LC125
  const vpSteps = useMemo<VPStep[]>(() => {
    if (problem.id !== "lc125" || typeof resolvedInput !== "string") {
      return [];
    }
    const s = resolvedInput;
    const chars = s.split("");
    const steps: VPStep[] = [];

    // Step 0: Init
    steps.push({
      left: 0,
      right: chars.length - 1,
      chars,
      status: "Initialize left pointer at the start (index 0) and right pointer at the end.",
      codeLine: 2,
      action: "init"
    });

    let left = 0;
    let right = chars.length - 1;

    while (left < right) {
      const leftChar = chars[left];
      const rightChar = chars[right];

      // Check left non-alphanumeric
      if (!isAlphanumeric(leftChar)) {
        steps.push({
          left,
          right,
          chars,
          status: `s[${left}] ('${leftChar}') is not alphanumeric. Incrementing left pointer to skip it.`,
          codeLine: 5,
          action: "skip_left"
        });
        left++;
        continue;
      }

      // Check right non-alphanumeric
      if (!isAlphanumeric(rightChar)) {
        steps.push({
          left,
          right,
          chars,
          status: `s[${right}] ('${rightChar}') is not alphanumeric. Decrementing right pointer to skip it.`,
          codeLine: 7,
          action: "skip_right"
        });
        right--;
        continue;
      }

      // Both are alphanumeric, check comparison
      steps.push({
        left,
        right,
        chars,
        status: `Both pointers point to alphanumeric characters. Comparing s[${left}] ('${leftChar}') and s[${right}] ('${rightChar}') (ignoring case).`,
        codeLine: 10,
        action: "check_left" // highlight comparison
      });

      if (leftChar.toLowerCase() !== rightChar.toLowerCase()) {
        steps.push({
          left,
          right,
          chars,
          status: `Character mismatch! s[${left}] ('${leftChar}') and s[${right}] ('${rightChar}') are not equal. Returning false.`,
          codeLine: 11,
          action: "compare_fail",
          compareResult: false
        });
        return steps;
      }

      steps.push({
        left,
        right,
        chars,
        status: `Characters match! Incrementing left pointer and decrementing right pointer.`,
        codeLine: 13,
        action: "compare_match",
        compareResult: true
      });

      left++;
      right--;
    }

    // Finish
    steps.push({
      left,
      right,
      chars,
      status: "Pointers met or crossed. The string is a valid palindrome! Returning true.",
      codeLine: 17,
      action: "finish_ok"
    });

    return steps;
  }, [problem.id, resolvedInput]);

  // 3. Valid Anagram LC242
  const vaSteps = useMemo<VAStep[]>(() => {
    if (problem.id !== "lc242" || !resolvedInput || typeof resolvedInput !== "object") {
      return [];
    }
    const { s, t } = resolvedInput as { s: string; t: string };
    const steps: VAStep[] = [];

    // Step 0: Init
    steps.push({
      i: -1,
      s,
      t,
      countS: {},
      countT: {},
      status: "Initialize character count frequency maps for s and t.",
      codeLine: 3,
      action: "init"
    });

    // Step 1: Length check
    steps.push({
      i: -1,
      s,
      t,
      countS: {},
      countT: {},
      status: `Check if strings have equal length. Length of s is ${s.length}, length of t is ${t.length}.`,
      codeLine: 2,
      action: "length_check",
      isSameLength: s.length === t.length
    });

    if (s.length !== t.length) {
      steps.push({
        i: -1,
        s,
        t,
        countS: {},
        countT: {},
        status: "Lengths are different! An anagram must have the exact same character count. Returning false.",
        codeLine: 2,
        action: "verify_fail"
      });
      return steps;
    }

    const countS: Record<string, number> = {};
    const countT: Record<string, number> = {};

    for (let i = 0; i < s.length; i++) {
      const charS = s[i];
      const charT = t[i];

      countS[charS] = (countS[charS] ?? 0) + 1;
      countT[charT] = (countT[charT] ?? 0) + 1;

      steps.push({
        i,
        s,
        t,
        countS: { ...countS },
        countT: { ...countT },
        status: `Step ${i + 1}: Increment frequency counts for s[${i}] ('${charS}') in countS, and t[${i}] ('${charT}') in countT.`,
        codeLine: 5,
        action: "loop"
      });
    }

    steps.push({
      i: s.length,
      s,
      t,
      countS: { ...countS },
      countT: { ...countT },
      status: "Built count frequency maps for both strings. Now comparing counts character by character.",
      codeLine: 9,
      action: "loop_done"
    });

    // Verify key counts
    const sKeys = Object.keys(countS);
    for (const key of sKeys) {
      steps.push({
        i: s.length,
        s,
        t,
        countS: { ...countS },
        countT: { ...countT },
        status: `Checking character '${key}'. Frequency in s: ${countS[key]}, in t: ${countT[key] ?? 0}.`,
        codeLine: 10,
        action: "verify",
        verifyChar: key
      });

      if (countS[key] !== countT[key]) {
        steps.push({
          i: s.length,
          s,
          t,
          countS: { ...countS },
          countT: { ...countT },
          status: `Character count mismatch for '${key}'! Frequency in s is ${countS[key]} but in t is ${countT[key] ?? 0}. Returning false.`,
          codeLine: 10,
          action: "verify_fail",
          verifyChar: key
        });
        return steps;
      }
    }

    steps.push({
      i: s.length,
      s,
      t,
      countS: { ...countS },
      countT: { ...countT },
      status: "All character frequencies match exactly! Strings are valid anagrams. Returning true.",
      codeLine: 12,
      action: "finish_ok"
    });

    return steps;
  }, [problem.id, resolvedInput]);

  // Current active steps list
  const steps = useMemo(() => {
    if (problem.id === "lc217") {
      return cdSteps;
    }
    if (problem.id === "lc125") {
      return vpSteps;
    }
    if (problem.id === "lc242") {
      return vaSteps;
    }
    return [];
  }, [problem.id, cdSteps, vpSteps, vaSteps]);

  // -------------------------------------------------------------
  // ANIMATION PLAYBACK CONTROLS
  // -------------------------------------------------------------
  const totalSteps = steps.length;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, totalSteps]);

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, playbackSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, handleNext]);

  // Handle building input
  const handleRebuild = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (problem.id === "lc217") {
      setResolvedInput(parseArrayInput(customInput));
    } else if (problem.id === "lc125") {
      setResolvedInput(cleanPalindromeInput(customInput));
    } else if (problem.id === "lc242") {
      setResolvedInput(parseAnagramInputs(customInput));
    }
  };

  // -------------------------------------------------------------
  // PSEUDO-CODES DEFINITIONS
  // -------------------------------------------------------------
  const pseudocode = useMemo(() => {
    if (problem.id === "lc217") {
      return [
        "function containsDuplicate(nums) {",
        "  const set = new Set();",
        "  for (let i = 0; i < nums.length; i++) {",
        "    if (set.has(nums[i])) {",
        "      return true;",
        "    }",
        "    set.add(nums[i]);",
        "  }",
        "  return false;",
        "}"
      ];
    }
    if (problem.id === "lc125") {
      return [
        "function isPalindrome(s) {",
        "  let left = 0, right = s.length - 1;",
        "  while (left < right) {",
        "    if (!isAlphanumeric(s[left])) {",
        "      left++;",
        "    } else if (!isAlphanumeric(s[right])) {",
        "      right--;",
        "    } else {",
        "      if (s[left].toLowerCase() !== s[right].toLowerCase()) {",
        "        return false;",
        "      }",
        "      left++; right--;",
        "    }",
        "  }",
        "  return true;",
        "}"
      ];
    }
    if (problem.id === "lc242") {
      return [
        "function isAnagram(s, t) {",
        "  if (s.length !== t.length) return false;",
        "  const countS = {}, countT = {};",
        "  for (let i = 0; i < s.length; i++) {",
        "    countS[s[i]] = (countS[s[i]] || 0) + 1;",
        "    countT[t[i]] = (countT[t[i]] || 0) + 1;",
        "  }",
        "  for (let key in countS) {",
        "    if (countS[key] !== countT[key]) return false;",
        "  }",
        "  return true;",
        "}"
      ];
    }
    return [];
  }, [problem.id]);

  const activeLine = totalSteps > 0 && steps[currentStep] ? steps[currentStep].codeLine : -1;
  const currentAction = totalSteps > 0 && steps[currentStep] ? steps[currentStep].action : "";

  // Helper render placeholder if problem not supported
  if (!["lc217", "lc125", "lc242"].includes(problem.id)) {
    return (
      <div className="text-center p-8 bg-slate-900 rounded-lg border border-slate-700/30">
        <HelpCircle size={44} className="mx-auto text-slate-500 mb-4 animate-pulse" />
        <h4 className="text-md font-semibold text-slate-300 mb-2">Simulación visual no disponible</h4>
        <p className="text-xs text-slate-400">
          Las simulaciones interactivas paso a paso están disponibles actualmente para **Contains Duplicate**, **Valid Palindrome** y **Valid Anagram**. ¡Pronto añadiremos más algoritmos!
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LAYOUT RENDERING PANELS
  // -------------------------------------------------------------
  const visualizerContent = (
    <div className="flex flex-col gap-6 h-full select-none">
      
      {/* 1. Canvas simulation area */}
      <div className="flex-grow flex flex-col justify-center items-center p-6 bg-slate-950/60 border border-slate-800 rounded-xl min-h-[220px] relative overflow-hidden">
        
        {/* Maximum Button */}
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)} 
          className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors shadow"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen visualizer"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {totalSteps === 0 ? (
          <div className="text-slate-400 text-xs italic">Loading simulation canvas...</div>
        ) : (
          <>
            {/* LC217 Simulation Rendering */}
            {problem.id === "lc217" && (() => {
              const step = steps[currentStep] as CDStep;
              return (
                <div className="flex flex-col items-center gap-8 w-full">
                  {/* Array Row */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {step.nums.map((n, idx) => {
                      const isActive = step.index === idx;
                      const isPast = idx < step.index;
                      const isAdded = isPast && step.set.includes(n);
                      const isCollision = isActive && currentAction === "duplicate";
                      
                      return (
                        <div key={idx} className="flex flex-col items-center relative">
                          <div className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-sm rounded-lg border-2 transition-all duration-300 ${
                            isCollision ? 'bg-red-950/50 border-red-500 text-red-300 shadow-lg shadow-red-500/10 scale-105' :
                            isActive ? 'bg-sky-950/50 border-sky-400 text-sky-200 scale-105' :
                            isAdded ? 'bg-slate-900 border-slate-700/60 text-slate-400 opacity-60' :
                            'bg-slate-900 border-slate-800 text-slate-300'
                          }`}>
                            {n}
                          </div>
                          <span className="text-[10px] text-slate-600 font-mono mt-1">[{idx}]</span>
                          {/* Pointer arrow */}
                          {isActive && (
                            <div className="absolute -top-7 text-sky-400 animate-bounce flex flex-col items-center">
                              <span className="text-[10px] font-bold font-mono">i</span>
                              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21l-12-18h24z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* HashSet box visualizer */}
                  <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl min-w-[200px] max-w-sm transition-all">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HashSet</span>
                    <div className="flex gap-1.5 flex-wrap justify-center min-h-[40px] items-center p-2 rounded bg-slate-950/80 border border-slate-800/40 w-full">
                      {step.set.length === 0 ? (
                        <span className="text-[10px] text-slate-600 italic">Empty</span>
                      ) : (
                        step.set.map((n, idx) => {
                          const isNew = step.val === n && currentAction === "add";
                          const isCollision = step.val === n && currentAction === "duplicate";
                          return (
                            <div key={idx} className={`w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold border transition-all duration-300 ${
                              isCollision ? 'bg-red-950/60 border-red-500 text-red-300 animate-ping' :
                              isNew ? 'bg-green-950/60 border-green-500 text-green-300 scale-110 shadow shadow-green-500/10' :
                              'bg-slate-800 border-slate-700 text-slate-300'
                            }`}>
                              {n}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* LC125 Palindrome Simulation */}
            {problem.id === "lc125" && (() => {
              const step = steps[currentStep] as VPStep;
              return (
                <div className="flex flex-col items-center gap-10 w-full overflow-x-auto p-2">
                  <div className="flex items-center gap-1 justify-center relative min-h-[80px]">
                    {step.chars.map((char, idx) => {
                      const isL = idx === step.left;
                      const isR = idx === step.right;
                      const isMiddle = idx > step.left && idx < step.right;
                      const isSkip = (isL && currentAction === "skip_left") || (isR && currentAction === "skip_right");
                      const isMismatch = (isL || isR) && currentAction === "compare_fail";
                      const isMatch = (isL || isR) && currentAction === "compare_match";
                      
                      return (
                        <div key={idx} className="flex flex-col items-center relative">
                          <div className={`w-9 h-9 flex items-center justify-center font-mono font-semibold text-xs border rounded-md transition-all duration-300 ${
                            isMismatch ? 'bg-red-950 border-red-500 text-red-300 font-bold scale-105' :
                            isMatch ? 'bg-green-950 border-green-500 text-green-300 scale-105 font-bold' :
                            isSkip ? 'bg-slate-950 border-dashed border-slate-800 text-slate-600 scale-95' :
                            isL ? 'bg-sky-950 border-sky-400 text-sky-200' :
                            isR ? 'bg-indigo-950 border-indigo-400 text-indigo-200' :
                            isMiddle ? 'bg-slate-900/40 border-slate-800 text-slate-400' :
                            'bg-slate-900/10 border-slate-900 text-slate-600 opacity-30'
                          }`}>
                            {char === " " ? "␣" : char}
                          </div>
                          
                          {/* Left pointer */}
                          {isL && (
                            <div className="absolute -top-7 text-sky-400 flex flex-col items-center">
                              <span className="text-[9px] font-bold font-mono">L</span>
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21l-12-18h24z"/>
                              </svg>
                            </div>
                          )}
                          {/* Right pointer */}
                          {isR && (
                            <div className="absolute -bottom-7 text-indigo-400 flex flex-col items-center">
                              <svg className="w-2.5 h-2.5 fill-current rotate-180" viewBox="0 0 24 24">
                                <path d="M12 21l-12-18h24z"/>
                              </svg>
                              <span className="text-[9px] font-bold font-mono">R</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* LC242 Anagram Simulation */}
            {problem.id === "lc242" && (() => {
              const step = steps[currentStep] as VAStep;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                  {/* String S Frequency Card */}
                  <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">String S: "{step.s}"</span>
                    {/* Display S string split */}
                    <div className="flex gap-1 justify-center flex-wrap">
                      {step.s.split("").map((char, idx) => {
                        const isActive = idx === step.i && currentAction === "loop";
                        return (
                          <div key={idx} className={`w-8 h-8 rounded flex items-center justify-center font-mono text-xs border ${
                            isActive ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold scale-115' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}>
                            {char}
                          </div>
                        );
                      })}
                    </div>

                    <div className="w-full mt-2 p-2 bg-slate-950/80 border border-slate-900 rounded-lg min-h-[80px]">
                      <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">countS map</span>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {Object.keys(step.countS).length === 0 ? (
                          <span className="text-[10px] text-slate-600 italic">Empty</span>
                        ) : (
                          Object.entries(step.countS).map(([char, val]) => {
                            const isCheck = step.verifyChar === char && currentAction === "verify";
                            const isFail = step.verifyChar === char && currentAction === "verify_fail";
                            const isNew = step.s[step.i] === char && currentAction === "loop";
                            return (
                              <div key={char} className={`flex items-center gap-1 text-[10px] font-mono px-2 py-1 border rounded transition-all duration-300 ${
                                isFail ? 'bg-red-950/50 border-red-500 text-red-300' :
                                isCheck ? 'bg-sky-950/50 border-sky-400 text-sky-200 scale-105' :
                                isNew ? 'bg-green-950/40 border-green-500/50 text-green-300 scale-105' :
                                'bg-slate-800/40 border-slate-800 text-slate-400'
                              }`}>
                                <span className="font-bold text-slate-300">'{char}':</span>
                                <span>{val}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* String T Frequency Card */}
                  <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">String T: "{step.t}"</span>
                    {/* Display T string split */}
                    <div className="flex gap-1 justify-center flex-wrap">
                      {step.t.split("").map((char, idx) => {
                        const isActive = idx === step.i && currentAction === "loop";
                        return (
                          <div key={idx} className={`w-8 h-8 rounded flex items-center justify-center font-mono text-xs border ${
                            isActive ? 'bg-indigo-950 border-indigo-400 text-indigo-200 font-bold scale-115' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}>
                            {char}
                          </div>
                        );
                      })}
                    </div>

                    <div className="w-full mt-2 p-2 bg-slate-950/80 border border-slate-900 rounded-lg min-h-[80px]">
                      <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">countT map</span>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {Object.keys(step.countT).length === 0 ? (
                          <span className="text-[10px] text-slate-600 italic">Empty</span>
                        ) : (
                          Object.entries(step.countT).map(([char, val]) => {
                            const isCheck = step.verifyChar === char && (currentAction === "verify" || currentAction === "verify_fail");
                            const isNew = step.t[step.i] === char && currentAction === "loop";
                            return (
                              <div key={char} className={`flex items-center gap-1 text-[10px] font-mono px-2 py-1 border rounded transition-all duration-300 ${
                                isCheck ? (step.countS[char] === val ? 'bg-green-950/40 border-green-500/50 text-green-300' : 'bg-red-950/50 border-red-500 text-red-300 scale-105') :
                                isNew ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 scale-105' :
                                'bg-slate-800/40 border-slate-800 text-slate-400'
                              }`}>
                                <span className="font-bold text-slate-300">'{char}':</span>
                                <span>{val}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* 2. Interactive Control deck */}
      <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-col gap-4">
        {/* Progress track slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold font-mono text-slate-500">STEP</span>
          <input 
            type="range" 
            min={0} 
            max={totalSteps > 0 ? totalSteps - 1 : 0} 
            value={currentStep} 
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStep(Number(e.target.value));
            }}
            className="flex-grow accent-sky-500 h-1 rounded-lg bg-slate-800 appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-sky-400 shrink-0 w-12 text-right">
            {currentStep + 1} / {totalSteps || 1}
          </span>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="p-2 hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-slate-200 rounded-lg transition-all" title="Reset Simulation">
              <RotateCcw size={16} />
            </button>
            <button onClick={handlePrev} disabled={currentStep === 0} className="p-2 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 rounded-lg transition-all" title="Previous step">
              <SkipBack size={16} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="p-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-95 text-white rounded-full shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all"
              title={isPlaying ? "Pause autoplay" : "Play step-by-step"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button onClick={handleNext} disabled={totalSteps === 0 || currentStep === totalSteps - 1} className="p-2 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 rounded-lg transition-all" title="Next step">
              <SkipForward size={16} />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <Settings size={12} className="text-slate-500" />
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Speed:</span>
            <select 
              value={playbackSpeed} 
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 rounded p-1 focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value={2000}>Slow (2s)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={500}>Fast (0.5s)</option>
              <option value={250}>Turbo (0.25s)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Splitting pseudo-code and description card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Explanatory notes card */}
        <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-col min-h-[140px] justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-1.5 mb-2">
            Step Explanation
          </span>
          <p className="text-xs text-slate-300 leading-relaxed flex-grow">
            {totalSteps > 0 && steps[currentStep] ? steps[currentStep].status : "Loading step details..."}
          </p>
        </div>

        {/* Pseudocode code highlights */}
        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col font-mono text-[10px] max-h-[160px] overflow-y-auto leading-normal">
          {pseudocode.map((line, idx) => {
            const isHighlighted = idx + 1 === activeLine;
            return (
              <div 
                key={idx} 
                className={`py-0.5 px-1.5 rounded transition-all duration-150 ${
                  isHighlighted ? "bg-sky-950/70 border-l-2 border-sky-400 text-sky-200 font-bold shadow" : "text-slate-500"
                }`}
              >
                <span className="inline-block w-4 shrink-0 text-slate-700 mr-2 text-right">{idx + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Custom Parameter input box */}
      <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-col gap-2">
        <label htmlFor="visualizerCustomInput" className="text-xs font-semibold text-slate-400">Custom Input Parameters:</label>
        <div className="flex gap-2 items-center">
          <input 
            type="text" 
            id="visualizerCustomInput"
            value={customInput} 
            onChange={(e) => setCustomInput(e.target.value)} 
            placeholder={
              problem.id === "lc217" ? "[1, 2, 3, 4, 1]" :
              problem.id === "lc125" ? '"race car"' :
              's = "anagram", t = "nagaram"'
            }
            className="flex-grow p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 placeholder-slate-600 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all"
          />
          <button 
            onClick={handleRebuild}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-300 transition-all shrink-0 active:scale-95"
          >
            Build Step Track
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Regular visualizer */}
      {visualizerContent}

      {/* Full-screen visualizer overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex flex-col p-6 sm:p-10 text-slate-100 overflow-y-auto animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Interactive Simulation Canvas</span>
              <h2 className="text-2xl font-bold text-slate-200 mt-1">{problem.name}</h2>
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg shadow border border-slate-700 flex items-center gap-1.5 transition-all text-xs"
            >
              <Minimize2 size={14} /> Close Fullscreen
            </button>
          </div>

          {/* Large scale layout wrapper */}
          <div className="flex-grow flex flex-col gap-6 max-w-5xl mx-auto w-full">
            {visualizerContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AlgorithmVisualizer;
