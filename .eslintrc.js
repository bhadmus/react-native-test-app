module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['tests/appium/**', 'tests/detox/**', 'coverage/**'],
  rules: {
    'no-void': 'off',
  },
  overrides: [
    {
      files: ['jest.setup.js', '**/*.test.ts', '**/*.test.tsx'],
      env: { jest: true },
    },
  ],
};
