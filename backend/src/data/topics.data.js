// ============================================
// TOPICS DATA – Go-Epic Backend
// 7 DSA / Concurrency topics
// ============================================

const topics = [
  {
    id: 'topic_001',
    name: 'arrays',
    displayName: 'Arrays',
    description:
      'Arrays are linear data structures that store elements at contiguous memory locations. They support O(1) random access and are the building block of most algorithms.',
    difficulty: 'easy',
    problemCount: 2,
    tags: ['fundamental', 'linear', 'indexing', 'two-pointers', 'sliding-window'],
    isPopular: true,
    prerequisites: [],
    resources: ['https://leetcode.com/tag/array/', 'https://www.geeksforgeeks.org/array-data-structure/'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'topic_002',
    name: 'dynamic-programming',
    displayName: 'Dynamic Programming',
    description:
      'Dynamic Programming is an optimization technique that solves complex problems by breaking them into overlapping subproblems, storing results to avoid recomputation (memoization/tabulation).',
    difficulty: 'medium',
    problemCount: 1,
    tags: ['optimization', 'memoization', 'tabulation', 'subproblems', 'recursion'],
    isPopular: true,
    prerequisites: ['arrays', 'recursion'],
    resources: ['https://leetcode.com/tag/dynamic-programming/'],
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 'topic_003',
    name: 'concurrency',
    displayName: 'Concurrency',
    description:
      'Concurrency involves managing multiple computations happening simultaneously. Key concepts include threads, goroutines, mutexes, semaphores, channels, and worker pools.',
    difficulty: 'advanced',
    problemCount: 2,
    tags: ['threads', 'mutex', 'semaphore', 'worker', 'goroutines', 'channels', 'race-condition'],
    isPopular: false,
    prerequisites: ['operating-systems', 'data-structures'],
    resources: ['https://go.dev/tour/concurrency/'],
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 'topic_004',
    name: 'trees',
    displayName: 'Trees',
    description:
      'Trees are hierarchical non-linear data structures with a root node and subtrees of children. Common types include BST, AVL, Segment Trees, and Tries.',
    difficulty: 'medium',
    problemCount: 1,
    tags: ['hierarchical', 'bst', 'traversal', 'dfs', 'bfs', 'recursion'],
    isPopular: true,
    prerequisites: ['arrays', 'recursion'],
    resources: ['https://leetcode.com/tag/tree/'],
    createdAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: 'topic_005',
    name: 'graphs',
    displayName: 'Graphs',
    description:
      'Graphs are non-linear data structures consisting of nodes (vertices) and edges. Algorithms include BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, and topological sort.',
    difficulty: 'hard',
    problemCount: 1,
    tags: ['bfs', 'dfs', 'shortest-path', 'weighted', 'dijkstra', 'topological-sort'],
    isPopular: true,
    prerequisites: ['arrays', 'trees', 'queues'],
    resources: ['https://leetcode.com/tag/graph/'],
    createdAt: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 'topic_006',
    name: 'linked-lists',
    displayName: 'Linked Lists',
    description:
      'Linked lists are linear data structures where elements are stored in nodes, with each node pointing to the next. Types include singly, doubly, and circular linked lists.',
    difficulty: 'easy',
    problemCount: 2,
    tags: ['pointers', 'singly', 'doubly', 'circular', 'fast-slow-pointer'],
    isPopular: true,
    prerequisites: [],
    resources: ['https://leetcode.com/tag/linked-list/'],
    createdAt: '2024-01-06T00:00:00.000Z'
  },
  {
    id: 'topic_007',
    name: 'stacks',
    displayName: 'Stacks',
    description:
      'Stacks are linear data structures that follow the LIFO (Last In, First Out) principle. They are used in expression evaluation, backtracking, parsing, and function call management.',
    difficulty: 'easy',
    problemCount: 1,
    tags: ['lifo', 'push', 'pop', 'recursion', 'expression-evaluation', 'monotonic-stack'],
    isPopular: true,
    prerequisites: ['arrays'],
    resources: ['https://leetcode.com/tag/stack/'],
    createdAt: '2024-01-07T00:00:00.000Z'
  }
];

module.exports = topics;
