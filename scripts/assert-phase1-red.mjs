import { spawnSync } from 'node:child_process';

/**
 * NARROWED by plan `04.2-06`: 4 suites -> 1, and 4 markers -> 1.
 *
 * `haoo-page.test.tsx` and `haoo-content.test.ts` left this repository with the HAOO
 * product, and the build marker left `build-output.test.ts` with the physical-HAOO-
 * document case it named. The counterpart gate in the HAOO repository — narrowed by plan
 * `04.2-02` to three suites and three markers — carries exactly the three removed pairs,
 * so the original inventory of four still adds up across the two repositories.
 *
 * The entries were removed rather than left in place because this gate rejects
 * `'No test files found'` as an infrastructure failure: a suite named here but absent
 * from the tree would fail the gate for a reason that has nothing to do with the RED
 * contract it exists to assert.
 *
 * `forbiddenInfrastructureFailures`, the non-zero-exit requirement and the marker check
 * below are byte-unchanged, so both halves still reject the same class of false red.
 */
const suites = [
  'src/test/products-section.test.tsx',
];

const expectedMarkers = [
  '[phase1-red:products]',
];

const forbiddenInfrastructureFailures = [
  'Failed to resolve import',
  'Cannot find module',
  'React is not defined',
  'SyntaxError',
  'Unhandled Error',
  'No test files found',
  'failed to load config',
  'Transform failed',
];

const result = spawnSync(
  'npm',
  ['test', '--', '--run', ...suites, '--reporter=verbose'],
  {
    encoding: 'utf8',
    env: {
      ...process.env,
      NO_COLOR: '1',
    },
  },
);

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
process.stdout.write(output);

if (result.error) {
  console.error(`Expected-red gate could not start Vitest: ${result.error.message}`);
  process.exit(1);
}

if (result.status === 0) {
  console.error('Expected-red gate failed: the Phase 1 contract suites unexpectedly passed.');
  process.exit(1);
}

const infrastructureFailure = forbiddenInfrastructureFailures.find((signature) =>
  output.includes(signature),
);

if (infrastructureFailure) {
  console.error(
    `Expected-red gate rejected an infrastructure failure: ${infrastructureFailure}`,
  );
  process.exit(1);
}

const missingMarker = expectedMarkers.find((marker) => !output.includes(marker));

if (missingMarker) {
  console.error(`Expected-red gate did not observe the named behavior failure ${missingMarker}.`);
  process.exit(1);
}

console.log('Phase 1 RED confirmed: the Products contract suite fails on its named behavior contract.');
