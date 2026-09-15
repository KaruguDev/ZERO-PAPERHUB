import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '../..');

/**
 * `scripts/assert-phase1-contracts.mjs` decides whether the Phase 1 behaviour contracts
 * ran, and ran GREEN. Until this suite existed, nothing imported it: the gate that judges
 * the other suites was the one file no suite judged, and a SonarQube scan measuring the
 * repository put its coverage at zero.
 *
 * The gate is built to be probed. `phase1ContractFailure` is documented in that file as
 * "Pure, so the decision can be probed against a recorded run without spawning Vitest" —
 * every case below hands it a RECORDED run and checks the sentence it returns, so the
 * suite never shells out and never depends on the real suites' current state.
 *
 * WHAT IS BEING PROTECTED. A gate has exactly one way to fail badly, and it is not
 * throwing when it should not: it is staying silent when it should speak. Each case below
 * is a way a run could be broken while still LOOKING finished — no harness, a harness that
 * imploded, a non-zero exit, a marker that never appeared, a marker that appeared on a
 * line that was not green. The green case is last, and it is the only input that may
 * return null.
 *
 * The gate is imported as a MODULE, not shelled out to. Its `import.meta.url` guard exists
 * precisely so the decision function is reachable without running `main()`; under Vitest
 * `process.argv[1]` is the runner, so the guard does not match and nothing is spawned.
 */
describe('Phase 1 contract gate', () => {
  const GATE_PATH = resolve(ROOT, 'scripts/assert-phase1-contracts.mjs');

  /**
   * A COMPUTED specifier, for the same reason the auditor's suite uses one:
   * `tsconfig.app.json` includes only `src`, so a literal `../../scripts/*.mjs` specifier
   * would be an unresolved module to `tsc --noEmit`. The computed form resolves at run
   * time and still imports the real module.
   */
  const loadGate = async () => await import(pathToFileURL(GATE_PATH).href);

  /**
   * ZERO-PAPER HUB's side of the gate carries ONE suite and ONE marker — the parent site's
   * product grid. The three other pairs live in the HAOO repository's copy. Spelled
   * literally here rather than imported, because the marker is the gate's subject: a test
   * that read the expectation from the code under test could not notice it changing.
   */
  const MARKER = '[phase1-red:products]';
  const GREEN_RUN = ` ✓ src/test/products-section.test.tsx > renders every product card ${MARKER} 4ms\n`;

  it('names a harness that never started, rather than reading its empty output', async () => {
    const { phase1ContractFailure } = await loadGate();

    expect(
      phase1ContractFailure({
        status: null,
        error: new Error('spawn npm ENOENT'),
        output: '',
      }),
    ).toMatch(/could not start Vitest: spawn npm ENOENT/u);
  });

  it('rejects an infrastructure failure BEFORE it reads the exit status', async () => {
    const { phase1ContractFailure } = await loadGate();

    // The ordering is the point, and it is why this case pairs a broken harness with a
    // non-zero exit. Both are true at once; reporting "exited 1" would be accurate and
    // useless, because the reader would go looking for a failing assertion that does not
    // exist. A run that resolved no imports is named as what it is.
    const verdict = phase1ContractFailure({
      status: 1,
      error: undefined,
      output: 'Error: Failed to resolve import "./nowhere"\n',
    });

    expect(verdict, 'the broken harness is named').toMatch(/rejected an infrastructure failure/u);
    expect(verdict, 'and the exit status is not what gets reported').not.toMatch(/exited 1/u);

    // The empty run is the signature that matters most: zero suites collected exits 1 and
    // reports no failing case, which is indistinguishable from success to a naive gate.
    expect(
      phase1ContractFailure({ status: 1, error: undefined, output: 'No test files found\n' }),
    ).toMatch(/No test files found/u);
  });

  it('reports a non-zero exit, and a signal when there is no status to report', async () => {
    const { phase1ContractFailure } = await loadGate();

    expect(phase1ContractFailure({ status: 1, error: undefined, output: GREEN_RUN })).toMatch(
      /the contract suites exited 1\./u,
    );

    // A killed process carries a signal and a null status. Reporting "exited null" would
    // lose the one fact that explains the run.
    expect(
      phase1ContractFailure({
        status: null,
        signal: 'SIGKILL',
        error: undefined,
        output: GREEN_RUN,
      }),
    ).toMatch(/exited on signal SIGKILL\./u);
  });

  it('requires the marker to appear, and to appear on a GREEN case line', async () => {
    const { phase1ContractFailure } = await loadGate();

    // Absent entirely: the suite ran and passed, but not the named contract.
    expect(
      phase1ContractFailure({
        status: 0,
        error: undefined,
        output: ' ✓ src/test/products-section.test.tsx > some other case 2ms\n',
      }),
      'a run without the marker is not a green contract',
    ).toMatch(/did not observe the named behavior contract \[phase1-red:products\]/u);

    // Present, but on a FAILING line. This is the subtle one: a substring search over the
    // whole output would find the marker here and pass the gate on a red contract.
    expect(
      phase1ContractFailure({
        status: 0,
        error: undefined,
        output: ` × src/test/products-section.test.tsx > renders every product card ${MARKER} 4ms\n`,
      }),
      'a marker on a failing case must not count as green',
    ).toMatch(/did not observe the named behavior contract/u);
  });

  it('returns null for a run that is green, complete and uneventful', async () => {
    const { phase1ContractFailure } = await loadGate();

    expect(
      phase1ContractFailure({ status: 0, error: undefined, output: GREEN_RUN }),
      'the only input that may pass',
    ).toBeNull();
  });
});
