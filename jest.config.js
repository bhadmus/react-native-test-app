module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    '<rootDir>/node_modules/@react-native/jest-preset/jest/setup.js',
    './jest.setup.js',
  ],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-async-storage|@react-navigation|react-native-gesture-handler)/)',
  ],
};
