export type ProblemStatus = 
  | 'Not Started' 
  | 'Attempted' 
  | 'Solved' 
  | 'Solved with Help' 
  | 'Review Later' 
  | 'Skipped';

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

export interface LeetCodeProblem {
  name: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[]; // Pre-defined tags from LeetCode
  description?: string;
  problemSpecificNotes?: string;
  solutionLinks?: SolutionLink[];
  attempts?: Attempt[];
  subTasks?: SubTask[];
  status: ProblemStatus;
  customTags?: string[];
  isPriority?: boolean;
  deadline?: string;
}

export interface Resource {
  name: string;
  url: string;
}

export interface SubTopic {
  id: string;
  title: string;
  resources: Resource[];
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

export type DifficultyLevel = 'All' | 'Easy' | 'Medium' | 'Hard';