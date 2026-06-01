// ============================================
// PROBLEMS DATA – Go-Epic Backend
// 10 real DSA / Concurrency problems
// ============================================

const problems = [
  {
    id: 'prob_001',
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    difficulty: 'easy',
    topic: 'arrays',
    source: 'leetcode',
    tags: ['arrays', 'hash-map', 'two-pointers'],
    constraints: '2 <= nums.length <= 10^4 | -10^9 <= nums[i] <= 10^9 | Only one valid answer exists.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6',     output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'prob_002',
    title: 'Longest Common Subsequence',
    description:
      'Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence derived from the original string by deleting some characters without changing relative order.',
    difficulty: 'medium',
    topic: 'dynamic-programming',
    source: 'leetcode',
    tags: ['dp', 'strings', 'subsequence', 'tabulation'],
    constraints: '1 <= text1.length, text2.length <= 1000 | Characters are lowercase English letters.',
    examples: [
      { input: "text1 = 'abcde', text2 = 'ace'", output: '3', explanation: "LCS is 'ace'" },
      { input: "text1 = 'abc', text2 = 'abc'",   output: '3', explanation: "LCS is 'abc'" }
    ],
    isActive: true,
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 'prob_003',
    title: 'Mutex-Based Worker Pool',
    description:
      'Implement a concurrent worker pool using mutex locks. Multiple workers must pick tasks from a shared queue safely without race conditions. Each worker must log its ID and the task it processed.',
    difficulty: 'advanced',
    topic: 'concurrency',
    source: 'ultimate',
    tags: ['concurrency', 'mutex', 'worker', 'threading', 'race-condition'],
    constraints: 'Pool size: 1-100 workers | Task queue: up to 10000 tasks | No race conditions allowed.',
    examples: [
      {
        input: "workers=4, tasks=['task1','task2','task3','task4']",
        output: 'All 4 tasks completed safely by 4 workers',
        explanation: 'Each worker locks the mutex before accessing the shared queue'
      }
    ],
    isActive: true,
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 'prob_004',
    title: 'Binary Tree Level Order Traversal',
    description:
      'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
    difficulty: 'medium',
    topic: 'trees',
    source: 'leetcode',
    tags: ['trees', 'bfs', 'queue', 'traversal'],
    constraints: '0 <= number of nodes <= 2000 | -1000 <= Node.val <= 1000',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'BFS level by level' },
      { input: 'root = [1]', output: '[[1]]', explanation: 'Single node' }
    ],
    isActive: true,
    createdAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: 'prob_005',
    title: "Dijkstra's Shortest Path",
    description:
      "Implement Dijkstra's algorithm to find the shortest path between a source and destination node in a weighted directed graph. Return the minimum distance.",
    difficulty: 'hard',
    topic: 'graphs',
    source: 'ultimate',
    tags: ['graphs', 'dijkstra', 'shortest-path', 'priority-queue', 'greedy'],
    constraints: '1 <= V <= 10^4 | 1 <= E <= 10^5 | All edge weights are non-negative.',
    examples: [
      {
        input: 'V=5, edges=[[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,3,5]], src=0, dest=3',
        output: '4',
        explanation: 'Shortest path: 0 -> 2 -> 1 -> 3 with cost 1+2+1=4'
      }
    ],
    isActive: true,
    createdAt: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 'prob_006',
    title: 'Reverse a Linked List',
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'easy',
    topic: 'linked-lists',
    source: 'leetcode',
    tags: ['linked-list', 'recursion', 'iteration', 'pointers'],
    constraints: '0 <= number of nodes <= 5000 | -5000 <= Node.val <= 5000',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed using three-pointer technique' },
      { input: 'head = [1,2]',       output: '[2,1]',       explanation: '' }
    ],
    isActive: true,
    createdAt: '2024-01-06T00:00:00.000Z'
  },
  {
    id: 'prob_007',
    title: 'Sliding Window Maximum',
    description:
      'You are given an array of integers nums and a sliding window of size k. Return an array of the maximum value in each window as it slides from left to right.',
    difficulty: 'hard',
    topic: 'arrays',
    source: 'leetcode',
    tags: ['arrays', 'sliding-window', 'deque', 'monotonic-queue'],
    constraints: '1 <= nums.length <= 10^5 | 1 <= k <= nums.length | -10^4 <= nums[i] <= 10^4',
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Monotonic deque tracks the max for each window' }
    ],
    isActive: true,
    createdAt: '2024-01-07T00:00:00.000Z'
  },
  {
    id: 'prob_008',
    title: 'Producer-Consumer with Bounded Buffer',
    description:
      'Implement a thread-safe producer-consumer pattern with a bounded buffer of size N. Producers add items and consumers remove items. Use semaphores or mutexes to prevent buffer overflow/underflow.',
    difficulty: 'advanced',
    topic: 'concurrency',
    source: 'ultimate',
    tags: ['concurrency', 'producer-consumer', 'semaphore', 'mutex', 'worker', 'buffer'],
    constraints: 'Buffer size: 1-1000 | Producers: 1-50 | Consumers: 1-50',
    examples: [
      {
        input: 'producers=2, consumers=3, bufferSize=10, items=20',
        output: 'All 20 items produced and consumed safely',
        explanation: 'Semaphores control access to prevent race conditions'
      }
    ],
    isActive: true,
    createdAt: '2024-01-08T00:00:00.000Z'
  },
  {
    id: 'prob_009',
    title: 'Valid Parentheses',
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[', and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
    difficulty: 'easy',
    topic: 'stacks',
    source: 'leetcode',
    tags: ['stacks', 'strings', 'matching', 'brackets'],
    constraints: '1 <= s.length <= 10^4 | s consists of parentheses only.',
    examples: [
      { input: "s = '()[]{}'", output: 'true',  explanation: 'All brackets properly matched' },
      { input: "s = '(]'",     output: 'false', explanation: 'Mismatched bracket types' }
    ],
    isActive: true,
    createdAt: '2024-01-09T00:00:00.000Z'
  },
  {
    id: 'prob_010',
    title: 'Merge K Sorted Lists',
    description:
      'You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    difficulty: 'hard',
    topic: 'linked-lists',
    source: 'ultimate',
    tags: ['linked-list', 'heap', 'divide-conquer', 'merge-sort', 'priority-queue'],
    constraints: '0 <= k <= 10^4 | 0 <= nodes per list <= 500 | -10^4 <= Node.val <= 10^4',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'Merged using min-heap or divide & conquer' }
    ],
    isActive: true,
    createdAt: '2024-01-10T00:00:00.000Z'
  }
];

module.exports = problems;
