// src/features/Roadmap/data.ts
import type { Topic } from '@/shared/types';

// All LeetCodeProblem objects in this data now include:
// status, customTags, isPriority, and deadline fields.
export const initialRoadmapData: Topic[] = [
  {
    id: 'arrays_hashing', title: 'Arrays & Hashing', description: 'Fundamental data structures. Learn to manipulate arrays and use hash tables for efficient lookups.', isExpanded: false,
    subTopics: [
      {
        id: 'arrays_intro', title: 'Introduction to Arrays', resources: [ { name: 'GeeksforGeeks: Arrays', url: 'https://www.geeksforgeeks.org/array-data-structure/' }, { name: 'Programiz: Arrays', url: 'https://www.programiz.com/dsa/arrays' }, ],
        leetcodeProblems: [ 
          { name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy', tags: ['Array', 'Hash Table'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
          { name: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', difficulty: 'Easy', tags: ['Array', 'Hash Table'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
        ],
        notes: '', completed: false,
      },
      {
        id: 'hashing_intro', title: 'Introduction to Hashing', resources: [ { name: 'Wikipedia: Hash Table', url: 'https://en.wikipedia.org/wiki/Hash_table' }, ],
        leetcodeProblems: [ 
          { name: 'Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/', difficulty: 'Easy', tags: ['Hash Table', 'String'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
          { name: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', difficulty: 'Medium', tags: ['Array', 'Hash Table', 'String'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
        ],
        notes: '', completed: false,
      }
    ]
  },
   {
    id: 'two_pointers', title: 'Two Pointers', description: 'Efficiently solve problems involving sorted arrays or linked lists by using two pointers.', isExpanded: false,
    subTopics: [
      {
        id: 'two_pointers_sorted', title: 'Two Pointers in Sorted Arrays', resources: [ { name: 'TopCoder: Two Pointers Technique', url: 'https://www.topcoder.com/thrive/articles/Two%20Pointers%20Technique' }, ],
        leetcodeProblems: [ 
            { name: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', difficulty: 'Easy', tags: ['Two Pointers', 'String'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: '3Sum', url: 'https://leetcode.com/problems/3sum/', difficulty: 'Medium', tags: ['Array', 'Two Pointers'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', difficulty: 'Medium', tags: ['Array', 'Two Pointers'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }
        ],
        notes: '', completed: false,
      }
    ]
  },
  {
    id: 'sliding_window', title: 'Sliding Window', description: 'Optimize solutions for problems involving contiguous subarrays or substrings.', isExpanded: false,
    subTopics: [
       {
        id: 'sliding_window_intro', title: 'Introduction to Sliding Window', resources: [ { name: 'GeeksforGeeks: Sliding Window', url: 'https://www.geeksforgeeks.org/window-sliding-technique/' }, ],
        leetcodeProblems: [ 
            { name: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy', tags: ['Array', 'Sliding Window'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Sliding Window'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }
        ],
        notes: '', completed: false,
      }
    ]
  },
  {
    id: 'stack', title: 'Stack', description: 'LIFO data structure. Useful for parsing, expression evaluation, and backtracking problems.', isExpanded: false,
    subTopics: [
      {
        id: 'stack_intro', title: 'Understanding Stacks', resources: [ { name: 'Programiz: Stack', url: 'https://www.programiz.com/dsa/stack'} ],
        leetcodeProblems: [ 
            { name: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', difficulty: 'Easy', tags: ['Stack', 'String'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Min Stack', url: 'https://leetcode.com/problems/min-stack/', difficulty: 'Medium', tags: ['Stack', 'Design'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }
        ],
        notes: '', completed: false,
      }
    ]
  },
  {
    id: 'binary_search_topic', title: 'Binary Search', description: 'Master the binary search algorithm for efficient searching in sorted arrays.', isExpanded: false,
    subTopics: [
      {
        id: 'binary_search_intro', title: 'Introduction to Binary Search', resources: [{ name: 'Khan Academy: Binary Search', url: 'https://www.khanacademy.org/computing/computer-science/algorithms/binary-search/a/binary-search'}],
        leetcodeProblems: [ 
            { name: 'Binary Search', url: 'https://leetcode.com/problems/binary-search/', difficulty: 'Easy', tags: ['Array', 'Binary Search'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Search a 2D Matrix', url: 'https://leetcode.com/problems/search-a-2d-matrix/', difficulty: 'Medium', tags: ['Array', 'Binary Search', 'Matrix'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Find Minimum in Rotated Sorted Array', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', difficulty: 'Medium', tags: ['Array', 'Binary Search'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }
        ],
        notes: '', completed: false,
      }
    ]
  },
  {
    id: 'linked_list', title: 'Linked List', description: 'Understand and implement various types of linked lists and their operations.', isExpanded: false,
    subTopics: [
      {
        id: 'singly_linked_list', title: 'Singly Linked List Basics', resources: [{ name: 'Programiz: Linked List', url: 'https://www.programiz.com/dsa/linked-list' }],
        leetcodeProblems: [ 
            { name: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', difficulty: 'Easy', tags: ['Linked List', 'Recursion', 'Iteration'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', difficulty: 'Easy', tags: ['Linked List', 'Recursion'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
        ],
        notes: '', completed: false,
      },
      {
        id: 'linked_list_cycle', title: 'Detecting Cycles', resources: [{ name: 'GeeksforGeeks: Detect Loop in Linked List', url: 'https://www.geeksforgeeks.org/detect-loop-in-linked-list/'}],
        leetcodeProblems: [ 
            { name: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', difficulty: 'Easy', tags: ['Linked List', 'Two Pointers', 'Hash Table'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
        ],
        notes: '', completed: false,
      }
    ]
  },
  {
    id: 'trees', title: 'Trees', description: 'Explore tree data structures, including binary trees, BSTs, and traversal algorithms.', isExpanded: false,
    subTopics: [
      {
        id: 'binary_tree_traversal', title: 'Binary Tree Traversal (DFS, BFS)', resources: [{ name: 'GeeksforGeeks: Tree Traversal', url: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/' }],
        leetcodeProblems: [ 
            { name: 'Binary Tree Inorder Traversal', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', difficulty: 'Easy', tags: ['Tree', 'DFS', 'Stack'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', difficulty: 'Medium', tags: ['Tree', 'BFS', 'Queue'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', difficulty: 'Easy', tags: ['Tree', 'DFS', 'BFS'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' } 
        ],
        notes: '', completed: false,
      },
      {
        id: 'binary_search_tree', title: 'Binary Search Trees (BST)', resources: [{ name: 'Wikipedia: Binary Search Tree', url: 'https://en.wikipedia.org/wiki/Binary_search_tree'}],
        leetcodeProblems: [ 
            { name: 'Validate Binary Search Tree', url: 'https://leetcode.com/problems/validate-binary-search-tree/', difficulty: 'Medium', tags: ['Tree', 'DFS', 'BST'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
            { name: 'Kth Smallest Element in a BST', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', difficulty: 'Medium', tags: ['Tree', 'BST', 'DFS', 'Inorder Traversal'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' }, 
        ],
        notes: '', completed: false,
      }
    ]
  },
  {
    id: 'heaps_priority_queues', title: 'Heaps / Priority Queues', description: 'Learn about heap data structure and its applications using priority queues.', isExpanded: false,
    subTopics: [
        {
            id: 'heap_intro', title: 'Introduction to Heaps', resources: [{ name: 'Programiz: Heap Data Structure', url: 'https://www.programiz.com/dsa/heap-data-structure'}],
            leetcodeProblems: [
                { name: 'Kth Largest Element in an Array', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', difficulty: 'Medium', tags: ['Heap', 'Divide and Conquer', 'Sorting'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' },
                { name: 'Find Median from Data Stream', url: 'https://leetcode.com/problems/find-median-from-data-stream/', difficulty: 'Hard', tags: ['Heap', 'Design', 'Two Heaps'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' },
            ],
            notes: '', completed: false,
        }
    ]
  },
  {
    id: 'graphs', title: 'Graphs', description: 'Understand graph representations (adjacency list/matrix) and basic traversal algorithms.', isExpanded: false,
    subTopics: [
        {
            id: 'graph_intro_traversal', title: 'Graph Traversal (BFS, DFS)', resources: [{ name: 'GeeksforGeeks: Graph and its representations', url: 'https://www.geeksforgeeks.org/graph-and-its-representations/'}, { name: 'Khan Academy: Graph Representation', url: 'https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs'}],
            leetcodeProblems: [
                { name: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'Medium', tags: ['Graph', 'BFS', 'DFS', 'Matrix'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' },
                { name: 'Clone Graph', url: 'https://leetcode.com/problems/clone-graph/', difficulty: 'Medium', tags: ['Graph', 'BFS', 'DFS', 'Hash Table'], problemSpecificNotes: '', solutionLinks: [], attempts: [], subTasks: [], status: 'Not Started', customTags: [], isPriority: false, deadline: '' },
            ],
            notes: '', completed: false,
        }
    ]
  }
  // Add more topics and sub-topics here, ensuring each LeetCodeProblem
  // has status, customTags, isPriority, and deadline fields.
];
