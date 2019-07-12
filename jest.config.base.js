const { defaults } = require('jest-config');

module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: null,
  // testRegex: '/__tests__/.*\\.(spec|test)\\.(js|ts)$',
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  // moduleNameMapper: {
  //   '@kapmug/((?!class-transformer).+)$': '<rootDir>packages/$1/src',
  //   '@kapmug/class-transformer': '@kapmug/class-transformer'
  // },
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json',
      diagnostics: false,
      astTransformers: ['ts-nameof']
    },
  },
};
