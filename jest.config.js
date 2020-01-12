module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
        },
    },
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
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