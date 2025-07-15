// src/features/Roadmap/data/index.ts
import type { LeetCodeProblem, ProgrammingLanguage, Topic } from "@/shared/types";

const defaultLanguage: ProgrammingLanguage = "javascript";

// Helper to create problem objects with all necessary default fields
// Ensure problemData ALWAYS includes an 'id'
const createProblem = (
  topicId: string,
  subTopicId: string,
  // This type now makes 'id' and 'name' mandatory in the input problemData
  problemData: { id: string; name: string; url: string; difficulty: LeetCodeProblem['difficulty']; tags: string[]; } &
                 Partial<Omit<LeetCodeProblem, 'id' | 'name' | 'url' | 'difficulty' | 'tags' | 'topicId' | 'subTopicId'>>
): LeetCodeProblem => {
  if (!problemData.id || !problemData.name) {
    throw new Error(`Problem definition is missing required 'id' or 'name': ${JSON.stringify(problemData)}`);
  }
  return {
    // Core fields from problemData - id, name, url, difficulty, tags are now guaranteed by the type
    id: problemData.id,
    name: problemData.name,
    url: problemData.url,
    difficulty: problemData.difficulty,
    tags: problemData.tags || [], // Ensure tags is at least an empty array

    // Contextual IDs for potential use in save logic or breadcrumbs
    topicId: topicId,
    subTopicId: subTopicId,

    // Defaulted fields if not provided in problemData
    status: problemData.status || "Not Started",
    isPriority: problemData.isPriority || false,
    userSolutions: problemData.userSolutions || {
      javascript: `// Start JavaScript for ${problemData.name}`,
      python: `# Start Python for ${problemData.name}`,
      java: `// Start Java for ${problemData.name}\nclass Solution {\n    // Code for ${problemData.name}\n}`,
    },
    currentLanguage: problemData.currentLanguage || defaultLanguage,
    testCases: problemData.testCases || [],
    description: problemData.description || "",
    problemSpecificNotes: problemData.problemSpecificNotes || "",
    solutionLinks: problemData.solutionLinks || [],
    attempts: problemData.attempts || [],
    subTasks: problemData.subTasks || [],
    customTags: problemData.customTags || [],
    deadline: problemData.deadline || "",
    lastTestRun: problemData.lastTestRun || undefined,
    // Add any other optional fields from LeetCodeProblem with their defaults here
    timeSpent: problemData.timeSpent || 0,
    lastPracticedDate: problemData.lastPracticedDate || "",
  };
};


export const initialRoadmapData: Topic[] = [
  {
    id: "arrays_hashing", // Topic ID
    title: "Arrays & Hashing",
    isExpanded: true,
    subTopics: [
      {
        id: "arrays_hashing_intro", // SubTopic ID
        title: "Introduction to Arrays & Hashing",
        completed: false,
        leetcodeProblems: [
          // Each object passed to createProblem MUST have an 'id' and 'name'
          createProblem("arrays_hashing", "arrays_hashing_intro", {
            id: "lc217", // This is the CRUCIAL unique problem ID
            name: "Contains Duplicate",
            url: "https://leetcode.com/problems/contains-duplicate/",
            difficulty: "Easy",
            tags: ["Array", "Hash Table", "Sorting"],
            // Optional: Override other defaults if needed
            status: "Not Started",
            isPriority: false,
            userSolutions: {
              javascript: "// Specific JavaScript code for Contains Duplicate",
              python: "# Specific Python code for Contains Duplicate",
              java: "// Specific Java code for Contains Duplicate\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Implement here\n    }\n}",
            },
            testCases: [
              { id: "tc217-1", input: "nums = [1,2,3,1]", expectedOutput: "true", isExample: true },
              { id: "tc217-2", input: "nums = [1,2,3,4]", expectedOutput: "false", isExample: true },
            ],
            problemSpecificNotes: "Use a HashSet for O(n) time complexity.",
            description: "Given an integer array nums, return true if any value appears at least twice...",
          }),
          createProblem("arrays_hashing", "arrays_hashing_intro", {
            id: "lc242", // CRUCIAL unique problem ID
            name: "Valid Anagram",
            url: "https://leetcode.com/problems/valid-anagram/",
            difficulty: "Easy",
            tags: ["Hash Table", "String", "Sorting"],
            description: "Given two strings s and t, return true if t is an anagram of s...",
            testCases: [
              { id: "tc242-1", input: 's = "anagram", t = "nagaram"', expectedOutput: "true", isExample: true },
              { id: "tc242-2", input: 's = "rat", t = "car"', expectedOutput: "false", isExample: true },
            ],
          }),
        ],
        notes: ""
      },
      {
        id: "arrays_hashing_two_pointers", // SubTopic ID
        title: "Two Pointers",
        completed: false,
        leetcodeProblems: [
          createProblem("arrays_hashing", "arrays_hashing_two_pointers", {
            id: "lc125", // CRUCIAL unique problem ID
            name: "Valid Palindrome",
            url: "https://leetcode.com/problems/valid-palindrome/",
            difficulty: "Easy",
            tags: ["Two Pointers", "String"],
            description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters...",
            testCases: [
              { id: "tc125-1", input: "s = \"A man, a plan, a canal: Panama\"", expectedOutput: "true", isExample: true },
            ],
          }),
        ],
        notes: ""
      }
    ],
    description: ""
  },
  // Define ALL other topics, subtopics, and problems using the createProblem helper
  // ensuring each problemData object has a unique 'id'.
];