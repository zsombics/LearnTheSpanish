module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(axios)/)',
    ],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
  };
  