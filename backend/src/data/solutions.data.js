// ============================================
// SOLUTIONS DATA – Go-Epic Backend
// 5 optimized solutions for sample problems
// ============================================

const solutions = [
  {
    id: 'sol_001',
    problemId: 'prob_001',
    problemTitle: 'Two Sum',
    title: 'One-pass Hash Map',
    approach: 'For each element, check if its complement (target - element) already exists in the map.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    difficulty: 'easy',
    language: 'javascript',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    explanation:
      'We iterate once. For each number, we compute the complement. If complement exists in map, we found the pair. Otherwise, add current number to map.',
    isOptimal: true,
    votes: 245,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'sol_002',
    problemId: 'prob_002',
    problemTitle: 'Longest Common Subsequence',
    title: '2D DP Table (Bottom-up)',
    approach: 'Build a 2D table where dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1].',
    timeComplexity: 'O(m*n)',
    spaceComplexity: 'O(m*n)',
    difficulty: 'medium',
    language: 'javascript',
    code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    explanation:
      'If characters match, extend the LCS by 1. Otherwise, take the max from either excluding a character from text1 or text2.',
    isOptimal: true,
    votes: 189,
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 'sol_003',
    problemId: 'prob_006',
    problemTitle: 'Reverse a Linked List',
    title: 'Iterative Three-pointer',
    approach: 'Maintain three pointers: prev, curr, next. Reverse the link direction one node at a time.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    difficulty: 'easy',
    language: 'javascript',
    code: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    explanation:
      'We traverse the list once. At each step, we reverse the current node\'s next pointer to point to the previous node, then advance all pointers.',
    isOptimal: true,
    votes: 312,
    createdAt: '2024-01-06T00:00:00.000Z'
  },
  {
    id: 'sol_004',
    problemId: 'prob_009',
    problemTitle: 'Valid Parentheses',
    title: 'Stack with Hash Map',
    approach: 'Push opening brackets onto stack. For closing brackets, check if top of stack is the matching opening bracket.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    difficulty: 'easy',
    language: 'javascript',
    code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if ('({['.includes(ch)) {
      stack.push(ch);
    } else {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
    explanation:
      'Opening brackets are pushed to stack. Closing brackets pop from stack and check match. Final stack must be empty.',
    isOptimal: true,
    votes: 428,
    createdAt: '2024-01-09T00:00:00.000Z'
  },
  {
    id: 'sol_005',
    problemId: 'prob_007',
    problemTitle: 'Sliding Window Maximum',
    title: 'Monotonic Deque',
    approach: 'Maintain a deque of indices in decreasing order of their values. The front always holds the index of the window\'s maximum.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    difficulty: 'hard',
    language: 'javascript',
    code: `function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // stores indices
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    // Remove smaller elements from the back
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    // Window is fully formed
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
    explanation:
      'The deque stores indices in decreasing value order. We remove out-of-window indices from front, and smaller elements from back before adding current index.',
    isOptimal: true,
    votes: 156,
    createdAt: '2024-01-07T00:00:00.000Z'
  }
];

module.exports = solutions;
