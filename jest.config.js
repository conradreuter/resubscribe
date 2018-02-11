module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/test/__setup__.js'],
  testRegex: '/test/.*\\.spec\\.tsx?$',
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
}
