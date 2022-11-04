module.exports = {
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsConfig: 'tsconfig.json',
        }],
    },
    testMatch: [
        '**/test/**/*.test.ts',
    ],
    testEnvironment: 'node',
    coverageReporters: ['lcovonly', 'text'],
    collectCoverageFrom: [
        'src/{!(bin/amp-css),**/}.ts',
    ],
    preset: 'ts-jest',
};
