import type { PartialStrykerOptions } from '@stryker-mutator/api/core';

const config: PartialStrykerOptions = {
  packageManager: 'yarn',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.config.ts',
  },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  mutate: [
    'lib/scoring.ts',
    'lib/tokenCounter.ts',
    'lib/questionDedup.ts',
    'lib/silenceDetector.ts',
    'store/sessionStore.ts',
  ],
  thresholds: {
    high: 80,
    low: 70,
    break: 60,
  },
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },
  tempDirName: 'stryker-tmp',
  cleanTempDir: 'always',
};

export default config;
