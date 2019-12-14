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
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
    preset: 'ts-jest',
};