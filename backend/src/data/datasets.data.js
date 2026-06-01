// ============================================
// DATASETS DATA – Go-Epic Backend
// 4 datasets for go-epic learning platform
// ============================================

const datasets = [
  {
    id: 'ds_001',
    name: 'Go Concurrency Patterns',
    description:
      'A comprehensive dataset of Go concurrency patterns including goroutines, channels, mutexes, and worker pools. Ideal for learning concurrent programming.',
    type: 'advanced',
    category: 'concurrency',
    size: 5,
    source: 'ultimate',
    tags: ['go', 'goroutines', 'channels', 'mutex', 'worker'],
    data: [
      { pattern: 'Worker Pool',     description: 'Distributes work across N workers using buffered channels', complexity: 'O(n/w)', useCase: 'Parallel task execution' },
      { pattern: 'Fan-Out Fan-In',  description: 'Splits work to multiple goroutines and collects results', complexity: 'O(n)',   useCase: 'Parallel data processing' },
      { pattern: 'Pipeline',        description: 'Chains operations using channels for stream processing',  complexity: 'O(n)',   useCase: 'ETL pipelines, data streams' },
      { pattern: 'Done Channel',    description: 'Cancels goroutines gracefully using a shared done chan', complexity: 'O(1)',   useCase: 'Cancellation propagation' },
      { pattern: 'Error Group',     description: 'Manages goroutines and collects first error',            complexity: 'O(n)',   useCase: 'Safe parallel API calls' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ds_002',
    name: 'Algorithm Complexity Reference',
    description:
      'Reference dataset containing time and space complexity for the most commonly used algorithms in competitive programming and system design.',
    type: 'basic',
    category: 'algorithms',
    size: 7,
    source: 'custom',
    tags: ['algorithms', 'complexity', 'big-o', 'reference', 'cheatsheet'],
    data: [
      { algorithm: 'Binary Search', time: 'O(log n)',        space: 'O(1)',      category: 'searching' },
      { algorithm: 'Bubble Sort',   time: 'O(n²)',           space: 'O(1)',      category: 'sorting' },
      { algorithm: 'Merge Sort',    time: 'O(n log n)',      space: 'O(n)',      category: 'sorting' },
      { algorithm: 'Quick Sort',    time: 'O(n log n) avg',  space: 'O(log n)', category: 'sorting' },
      { algorithm: 'DFS',           time: 'O(V+E)',          space: 'O(V)',      category: 'graph' },
      { algorithm: 'BFS',           time: 'O(V+E)',          space: 'O(V)',      category: 'graph' },
      { algorithm: "Dijkstra's",    time: 'O((V+E) log V)', space: 'O(V)',      category: 'graph' }
    ],
    isActive: true,
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 'ds_003',
    name: 'DSA Problem Bank',
    description:
      'Collection of categorized DSA problems from LeetCode, Codeforces, and Go-Epic platform. Includes difficulty ratings, acceptance rates, and topic coverage.',
    type: 'advanced',
    category: 'problems',
    size: 6,
    source: 'ultimate',
    tags: ['dsa', 'problems', 'leetcode', 'competitive-programming', 'categorized'],
    data: [
      { category: 'Arrays',   count: 45, avgDifficulty: 'medium', acceptanceRate: '62%' },
      { category: 'Trees',    count: 30, avgDifficulty: 'medium', acceptanceRate: '55%' },
      { category: 'Graphs',   count: 25, avgDifficulty: 'hard',   acceptanceRate: '42%' },
      { category: 'DP',       count: 40, avgDifficulty: 'hard',   acceptanceRate: '38%' },
      { category: 'Strings',  count: 35, avgDifficulty: 'easy',   acceptanceRate: '70%' },
      { category: 'Stacks',   count: 20, avgDifficulty: 'easy',   acceptanceRate: '68%' }
    ],
    isActive: true,
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 'ds_004',
    name: 'Mutex Operations Benchmark',
    description:
      'Performance benchmark dataset for mutex, semaphore, and channel operations under different concurrency loads. Measured on a 4-core machine.',
    type: 'advanced',
    category: 'concurrency',
    size: 4,
    source: 'ultimate',
    tags: ['mutex', 'benchmark', 'concurrency', 'worker', 'performance', 'profiling'],
    data: [
      { operation: 'Mutex Lock/Unlock',   avgTimeNs: 25,  threads: 4,  contention: 'low'    },
      { operation: 'RWMutex RLock',       avgTimeNs: 12,  threads: 8,  contention: 'low'    },
      { operation: 'Channel Send',        avgTimeNs: 45,  threads: 4,  contention: 'medium' },
      { operation: 'Channel Receive',     avgTimeNs: 43,  threads: 4,  contention: 'medium' }
    ],
    isActive: true,
    createdAt: '2024-01-04T00:00:00.000Z'
  }
];

module.exports = datasets;
