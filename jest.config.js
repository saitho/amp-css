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
        'src/{!(bin/amp-css),**/}.ts',
    ],
    preset: 'ts-jest',
};