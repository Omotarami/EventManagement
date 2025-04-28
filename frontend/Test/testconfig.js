// module.exports = {
//     testEnvironment: 'jsdom',
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//     transform: {
//       '^.+\\.(js|jsx)$': 'babel-jest',
//     },
//     moduleNameMapper: {
//       '\\.(css|less|scss)$': 'identity-obj-proxy',
//       '^@/components/(.*)$': '<rootDir>/src/components/$1',
//       '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
//       '^@/services/(.*)$': '<rootDir>/src/services/$1',
//     },
//     collectCoverageFrom: [
//       'src/**/*.{js,jsx}',
//       '!src/**/*.test.{js,jsx}',
//       '!**/node_modules/**',
//     ],
//     coverageThreshold: {
//       global: {
//         statements: 70,
//         branches: 60,
//         functions: 70,
//         lines: 70,
//       },
//     },
//   };