module.exports = {
  globals: {
    'ts-jest': {tsConfig: './test/tsconfig.json'},
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/__setup__.js'],
  testRegex: '/test/.*\\.spec\\.tsx?$',
}
