module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'jsdom',
  testRegex: '/tests/.*\\.(test)?\\.(ts)$',
  moduleFileExtensions: ['ts', 'js'],
};
