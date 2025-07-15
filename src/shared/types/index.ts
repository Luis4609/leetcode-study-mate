export type ProblemStatus =
  | "Not Started"
  | "Attempted"
  | "Solved"
  | "Solved with Help"
  | "Review Later"
  | "In Progress"
  | "Stuck"
  | "Skipped";

export interface SolutionLink {
  id: string;
  name: string;
  url: string;
}

export interface Attempt {
  id: string;
  date: string;
  result: string;
  notes?: string;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Resource {
  name: string;
  url: string;
}

export interface SubTopic {
  id: string;
  title: string;
  resources?: Resource[];
  leetcodeProblems: LeetCodeProblem[];
  notes: string;
  completed: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  subTopics: SubTopic[];
}

export type DifficultyLevel = "All" | "Easy" | "Medium" | "Hard";

export type ProgrammingLanguage = "javascript" | "python" | "java"; // Add more as needed

export interface TestCase {
  id: string; // Or number
  input: string; // Could be JSON string, or a more structured type
  expectedOutput: string; // Same as input
  description?: string;
  isExample?: boolean; // To differentiate example tests from hidden tests
}

export interface UserSolution {
  code: string;
  language: ProgrammingLanguage;
}

export interface LeetCodeProblem {
  topicId: string;
  subTopicId: string;
  id: string; // Unique ID for the problem
  name: string;
  url: string;
  difficulty: DifficultyLevel;
  tags: string[]; // Predefined tags
  status: ProblemStatus;
  isPriority: boolean;
  deadline?: string; // ISO date string
  description?: string; // Brief description or personal notes on the problem itself
  problemSpecificNotes?: string; // Notes on how to approach, common pitfalls
  solutionLinks?: SolutionLink[]; // Links to external solutions/discussions
  attempts?: Attempt[];
  subTasks?: SubTask[];
  customTags?: string[]; // User-defined tags
  timeSpent?: number; // in minutes or seconds
  lastPracticedDate?: string; // ISO date string

  // New fields for code editor and unit tests
  userSolutions?: Partial<Record<ProgrammingLanguage, string>>; // Stores code for each language
  currentLanguage?: ProgrammingLanguage; // Last selected language for this problem
  testCases?: TestCase[];
  // To store results of a (simulated) test run
  lastTestRun?: {
    language: ProgrammingLanguage;
    timestamp: string;
    results: Array<{
      testCaseId: string;
      passed: boolean;
      actualOutput?: string;
      error?: string;
    }>;
    consoleOutput?: string;
  };
}

// ... (Topic, SubTopic, etc. remain the same but contain LeetCodeProblem)
export interface SubTopic {
  id: string;
  title: string;
  leetcodeProblems: LeetCodeProblem[];
  notes: string;
  completed: boolean;
  resources?: Resource[];
}

export interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
  isExpanded: boolean;
}
