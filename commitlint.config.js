module.exports = {
  // 
  extends: ['@commitlint/config-conventional'],
  // 
  rules: {
    // type ， git  type 
    'type-enum': [
      2, // 
      'always', // 
      [
        'feat', //  feature
        'fix', //  bug
        'docs', // 
        'style', // ()
        'refactor', // (，bug)
        'perf', // 
        'test', // 
        'chore', // 
        'revert', // 
        'build', // 
      ],
    ],
    // subject 
    'subject-case': [0],
  },
};
