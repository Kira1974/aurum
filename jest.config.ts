/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.spec.ts', '<rootDir>/src/**/*.spec.ts'],
  transform: {
    '.+\\.(t|j)s$': 'ts-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  verbose: true,
  testTimeout: 30000,
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/coverage/'],
  clearMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
  forceExit: false,
  cache: true,
  cacheDirectory: '<rootDir>/../node_modules/.cache/jest',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/index.ts',
    '!src/**/*tokens.ts',
    '!src/**/*.module.ts',
    '!src/**/*.domain.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.vo.ts',
    '!src/**/*.config.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.enum.ts',
    '!src/**/*.types.ts',
    '!src/**/*.constants.ts',
    '!src/**/*.tokens.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**'
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'lcov']
};
