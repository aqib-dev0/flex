module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'backend/src/**/*.ts',
    'frontend/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
  ],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  coverageDirectory: './coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/backend/src/$1',
    '^@frontend/(.*)$': '<rootDir>/frontend/src/$1',
  }
};
