// App.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Target, ExternalLink, Search } from 'lucide-react';

// TypeScript Interfaces
interface LeetCodeProblem {
  name: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

interface Resource {
  name: string;
  url: string;
}

interface SubTopic {
  id: string;
  title: string;
  resources: Resource[];
  leetcodeProblems: LeetCodeProblem[];
  notes: string;
  completed: boolean;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  subTopics: SubTopic[];
}

// Placeholder data for roadmap
const initialRoadmapData: Topic[] = [
  {
    id: 'arrays_hashing',
    title: 'Arrays & Hashing',
    description: 'Fundamental data structures. Learn to manipulate arrays and use hash tables for efficient lookups.',
    isExpanded: false,
    subTopics: [
      {
        id: 'arrays_intro',
        title: 'Introduction to Arrays',
        resources: [
          { name: 'GeeksforGeeks: Arrays', url: 'https://www.geeksforgeeks.org/array-data-structure/' },
          { name: 'Programiz: Arrays', url: 'https://www.programiz.com/dsa/arrays' },
        ],
        leetcodeProblems: [
          { name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
          { name: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
        ],
        notes: '',
        completed: false,
      },
      {
        id: 'hashing_intro',
        title: 'Introduction to Hashing',
        resources: [
          { name: 'Wikipedia: Hash Table', url: 'https://en.wikipedia.org/wiki/Hash_table' },
        ],
        leetcodeProblems: [
          { name: 'Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/', difficulty: 'Easy', tags: ['Hash Table', 'String'] },
          { name: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', difficulty: 'Medium', tags: ['Array', 'Hash Table', 'String'] },
        ],
        notes: '',
        completed: false,
      }
    ]
  },
  {
    id: 'two_pointers',
    title: 'Two Pointers',
    description: 'Efficiently solve problems involving sorted arrays or linked lists by using two pointers.',
    isExpanded: false,
    subTopics: [
      {
        id: 'two_pointers_sorted',
        title: 'Two Pointers in Sorted Arrays',
        resources: [
          { name: 'TopCoder: Two Pointers Technique', url: 'https://www.topcoder.com/thrive/articles/Two%20Pointers%20Technique' },
        ],
        leetcodeProblems: [
          { name: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', difficulty: 'Easy', tags: ['Two Pointers', 'String'] },
          { name: '3Sum', url: 'https://leetcode.com/problems/3sum/', difficulty: 'Medium', tags: ['Array', 'Two Pointers'] },
          { name: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', difficulty: 'Medium', tags: ['Array', 'Two Pointers'] },
        ],
        notes: '',
        completed: false,
      }
    ]
  },
  {
    id: 'sliding_window',
    title: 'Sliding Window',
    description: 'Optimize solutions for problems involving contiguous subarrays or substrings.',
    isExpanded: false,
    subTopics: [
       {
        id: 'sliding_window_intro',
        title: 'Introduction to Sliding Window',
        resources: [
          { name: 'GeeksforGeeks: Sliding Window', url: 'https://www.geeksforgeeks.org/window-sliding-technique/' },
        ],
        leetcodeProblems: [
          { name: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy', tags: ['Array', 'Sliding Window'] },
          { name: 'Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Sliding Window'] },
        ],
        notes: '',
        completed: false,
      }
    ]
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'LIFO data structure. Useful for parsing, expression evaluation, and backtracking problems.',
    isExpanded: false,
    subTopics: [
      {
        id: 'stack_intro',
        title: 'Understanding Stacks',
        resources: [
           { name: 'Programiz: Stack', url: 'https://www.programiz.com/dsa/stack'}
        ],
        leetcodeProblems: [
          { name: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', difficulty: 'Easy', tags: ['Stack', 'String'] },
          { name: 'Min Stack', url: 'https://leetcode.com/problems/min-stack/', difficulty: 'Medium', tags: ['Stack', 'Design'] },
        ],
        notes: '',
        completed: false,
      }
    ]
  },
  // Add more topics like:
  // - Binary Search
  // - Linked List
  // - Trees (BFS, DFS, Traversals)
  // - Tries
  // - Heaps / Priority Queues
  // - Backtracking
  // - Graphs (BFS, DFS, Shortest Path)
  // - Dynamic Programming (1D, 2D)
  // - Greedy Algorithms
  // - Bit Manipulation
];

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard'): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'hard':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

interface LeetCodeProblemItemProps {
  problem: LeetCodeProblem;
}

const LeetCodeProblemItem: React.FC<LeetCodeProblemItemProps> = ({ problem }) => (
  <li className="flex items-center justify-between p-3 hover:bg-slate-100 rounded-md transition-colors duration-150">
    <div className="flex items-center">
      <Target size={18} className="mr-3 text-blue-500" />
      <span className="text-slate-700">{problem.name}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
        {problem.difficulty}
      </span>
      <a
        href={problem.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 transition-colors duration-150"
        aria-label={`Open LeetCode problem: ${problem.name}`}
      >
        <ExternalLink size={18} />
      </a>
    </div>
  </li>
);

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => (
  <li className="flex items-center p-3 hover:bg-slate-100 rounded-md transition-colors duration-150">
    <BookOpen size={18} className="mr-3 text-indigo-500" />
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-150"
    >
      {resource.name}
    </a>
  </li>
);

interface SubTopicCardProps {
  subTopic: SubTopic;
  topicId: string;
  onToggleComplete: (topicId: string, subTopicId: string) => void;
  onNotesChange: (topicId: string, subTopicId: string, notes: string) => void;
}

const SubTopicCard: React.FC<SubTopicCardProps> = ({ subTopic, topicId, onToggleComplete, onNotesChange }) => {
  const [notes, setNotes] = useState<string>(subTopic.notes || '');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    onNotesChange(topicId, subTopic.id, e.target.value);
  };
  
  const handleCheckboxChange = () => {
    onToggleComplete(topicId, subTopic.id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-slate-200 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-slate-800">{subTopic.title}</h4>
        <div className="flex items-center">
          <label htmlFor={`complete-${subTopic.id}`} className="mr-2 text-sm text-slate-600">Completed:</label>
          <input
            type="checkbox"
            id={`complete-${subTopic.id}`}
            checked={subTopic.completed}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>

      {subTopic.resources && subTopic.resources.length > 0 && (
        <div className="mb-4">
          <h5 className="text-md font-semibold text-slate-700 mb-2">Learning Resources:</h5>
          <ul className="space-y-1 list-inside">
            {subTopic.resources.map(resource => <ResourceItem key={resource.name} resource={resource} />)}
          </ul>
        </div>
      )}

      {subTopic.leetcodeProblems && subTopic.leetcodeProblems.length > 0 && (
        <div className="mb-4">
          <h5 className="text-md font-semibold text-slate-700 mb-2">LeetCode Problems:</h5>
          <ul className="space-y-1">
            {subTopic.leetcodeProblems.map(problem => <LeetCodeProblemItem key={problem.name} problem={problem} />)}
          </ul>
        </div>
      )}
      
      <div>
        <h5 className="text-md font-semibold text-slate-700 mb-1">My Notes:</h5>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add your notes for this sub-topic..."
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
          rows={3}
        ></textarea>
      </div>
    </div>
  );
};

interface TopicCardProps {
  topic: Topic;
  onToggle: (topicId: string) => void;
  onToggleCompleteSubTopic: (topicId: string, subTopicId: string) => void;
  onNotesChangeSubTopic: (topicId: string, subTopicId: string, notes: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onToggle, onToggleCompleteSubTopic, onNotesChangeSubTopic }) => (
  <div className="mb-6 bg-slate-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
    <button
      onClick={() => onToggle(topic.id)}
      className="w-full flex items-center justify-between p-6 text-left bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
      aria-expanded={topic.isExpanded}
      aria-controls={`topic-content-${topic.id}`}
    >
      <div>
        <h3 className="text-2xl font-bold">{topic.title}</h3>
        <p className="text-sm text-indigo-100 mt-1">{topic.description}</p>
      </div>
      {topic.isExpanded ? <ChevronDown size={28} /> : <ChevronRight size={28} />}
    </button>
    {topic.isExpanded && (
      <div id={`topic-content-${topic.id}`} className="p-6 bg-white border-t border-slate-200">
        {topic.subTopics && topic.subTopics.map(sub => (
          <SubTopicCard 
            key={sub.id} 
            subTopic={sub} 
            topicId={topic.id}
            onToggleComplete={onToggleCompleteSubTopic}
            onNotesChange={onNotesChangeSubTopic}
          />
        ))}
      </div>
    )}
  </div>
);

function App() {
  const [roadmap, setRoadmap] = useState<Topic[]>(() => {
    const savedRoadmap = localStorage.getItem('leetcodeRoadmap');
    if (savedRoadmap) {
      try {
        // Basic validation before parsing
        const parsed = JSON.parse(savedRoadmap);
        if (Array.isArray(parsed) && parsed.every(topic => topic.id && topic.title && Array.isArray(topic.subTopics))) {
          return parsed as Topic[];
        }
      } catch (error) {
        console.error("Failed to parse roadmap from localStorage:", error);
        // Fallback to initial data if parsing fails or data is invalid
        localStorage.removeItem('leetcodeRoadmap'); // Clear corrupted data
      }
    }
    return initialRoadmapData;
  });
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Effect to save roadmap to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leetcodeRoadmap', JSON.stringify(roadmap));
  }, [roadmap]);


  // Function to toggle topic expansion
  const toggleTopic = (topicId: string): void => {
    setRoadmap(prevRoadmap =>
      prevRoadmap.map(topic =>
        topic.id === topicId ? { ...topic, isExpanded: !topic.isExpanded } : topic
      )
    );
  };

  // Function to toggle sub-topic completion
  const toggleCompleteSubTopic = (topicId: string, subTopicId: string): void => {
    setRoadmap(prevRoadmap =>
      prevRoadmap.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            subTopics: topic.subTopics.map(sub =>
              sub.id === subTopicId ? { ...sub, completed: !sub.completed } : sub
            )
          };
        }
        return topic;
      })
    );
  };
  
  // Function to update notes for a sub-topic
  const updateNotesForSubTopic = (topicId: string, subTopicId: string, notes: string): void => {
     setRoadmap(prevRoadmap =>
      prevRoadmap.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            subTopics: topic.subTopics.map(sub =>
              sub.id === subTopicId ? { ...sub, notes: notes } : sub
            )
          };
        }
        return topic;
      })
    );
  };

  // Filter roadmap based on search term
  const filteredRoadmap = roadmap.map(topic => {
    // If search term is empty, return original topic
    if (!searchTerm.trim()) return topic;

    // Filter subTopics
    const filteredSubTopics = topic.subTopics.filter(subTopic => 
      subTopic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subTopic.leetcodeProblems.some(problem => problem.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // If topic title matches or any subtopic matches, include the topic
    if (topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || filteredSubTopics.length > 0) {
      // When filtering, ensure subTopics array is the filtered one
      // and expand the topic if there are matching subtopics or if the topic itself matches
      return { 
        ...topic, 
        subTopics: filteredSubTopics, 
        isExpanded: topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || filteredSubTopics.length > 0
      };
    }
    return null; // This topic and its subtopics don't match
  }).filter((topic): topic is Topic => topic !== null); // Type guard to filter out nulls

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4 sm:mb-0">LeetCode Study Roadmap</h1>
          <div className="relative w-full sm:w-auto">
            <input 
              type="text"
              placeholder="Search topics or problems..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors duration-150"
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl p-4 sm:p-8">
        {filteredRoadmap.length > 0 ? (
          filteredRoadmap.map(topic => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              onToggle={toggleTopic} 
              onToggleCompleteSubTopic={toggleCompleteSubTopic}
              onNotesChangeSubTopic={updateNotesForSubTopic}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-xl text-slate-600">No topics or problems found matching your search.</p>
            <p className="text-slate-500">Try a different search term or clear the search.</p>
          </div>
        )}
      </main>

      <footer className="text-center p-6 bg-slate-200 text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} LeetCode Study Helper. Happy Coding!</p>
        <p>Built with React, TypeScript & Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;
