import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * REDUCED by plan `04.2-06`, in the one commit that removed this suite's HAOO subjects.
 *
 * This file used to assert 40 cases across two repositories' worth of subject matter.
 * The HAOO product, its published document, its four brochure assets, its qualification
 * form, its measurement facade, its reporting modules, the pinned analytics SDK and the
 * approved-ingestion-host contract all moved to `KaruguDev/HAOO`, and every case whose
 * subject went with them is RETIRED here with its successor named by title in that
 * repository — never deleted silently. The retirement roster is the block immediately
 * below; the narrowings are recorded per inventory at the point of narrowing.
 *
 * What did NOT change: no forbidden regex group was deleted because its subject left.
 * `ALWAYS_FORBIDDEN`, `NETWORK_FORBIDDEN`, `PROVIDER_FORBIDDEN`, `FORM_MARKUP_FORBIDDEN`
 * and `FULL_BOUNDARY` are byte-identical and go on applying, in full, to the two product
 * sources this repository keeps.
 */

/**
 * RETIRED by plan `04.2-06`. Every entry's subject left this repository for
 * `KaruguDev/HAOO`; every successor named below already exists there and is green at the
 * time of writing. A retirement with no reachable successor is the failure this roster
 * exists to prevent, so the successor is named by CASE TITLE and is checkable by
 * `git -C "$HAOO_CHECKOUT" grep -F "<title>" src/test/`.
 *
 * | Retired here | Successor in `KaruguDev/HAOO` |
 * |---|---|
 * | `[phase1-red:build] emits a physical nested HAOO document` | `[phase1-red:build] emits a physical HAOO document at its published path` |
 * | `contains exact source and built canonical/social metadata` | `publishes first-party HAOO root canonical and social metadata` |
 * | `publishes the supplied social/preview image referenced by the product metadata` | same title, `src/test/build-output.test.ts` |
 * | `publishes the original brochure bytes at the public and built paths` | same title |
 * | `declares the original brochure as a static alternate of the product document` | same title |
 * | `publishes centralized onboarding destinations without requiring JavaScript` | same title |
 * | `publishes one truthful no-JavaScript qualification recovery panel` | same title |
 * | `keeps the no-script fallback free of active or tracked markup` | same title |
 * | `copies every referenced product asset into the uploaded artifact` | same title |
 * | `resolves every root-relative product reference inside the artifact` | same title |
 * | `covers every local production dependency imported by QualifyForm` | same title |
 * | `runs every inherited static prohibition against the qualification fallback` | same title |
 * | `grants browser measurement capabilities only to the audited facade` | same title |
 * | `keeps the vendor chunk itself free of every report credential shape` | same title |
 * | `pins the local record and bare tracking call to finite structural shapes` | same title |
 * | `keeps derivation metadata and engagement context out of qualification payloads` | same title |
 * | `keeps this project's own chunks free of identity and ordered-emission channels` | same title |
 * | `partitions the built bundle into a vendor chunk that is the pinned SDK and project chunks that are not` | same title |
 * | `keeps measurement disclosure static, bounded, and fragment-discoverable` | same title |
 * | `injects the approved-host constant only through the provider-gated selector` | same title |
 * | `carries exactly one frozen approved ingestion origin` | same title |
 * | `selects the approved origin for the exact provider value and nothing else` | same title |
 * | `keeps the approved-host contract out of every production module import graph` | same title |
 * | `publishes the approved ingestion origin exactly once in a provider-selected build` | same title |
 * | `keeps the README delivery claim in step with whether a production module loads the SDK` | same title |
 * | `builds a provider-unset probe whose project chunks carry no approved ingestion origin at all` | same title |
 *
 * Three of these could not have been narrowed to a survivor here even in principle, and
 * that is worth stating rather than leaving to inference:
 *
 * - the vendor-chunk and partition cases assert a partition this repository no longer
 *   HAS. Removing the analytics SDK is the point of the reduction, so a case demanding a
 *   non-empty vendor side would demand the very thing SPLT-03 forbids;
 * - the two build probes shell out to build a provider-selected and a provider-unset
 *   bundle. With no provider selector and no approved-host contract, both probes would
 *   build the same bundle and assert nothing;
 * - `keeps the README delivery claim in step…` reads a README section this repository no
 *   longer carries. **Note for a later reader: this repository's `README.md` is now
 *   ungated.** Nothing in this suite asserts against it any more. That is a real loss of
 *   coverage on this side, taken knowingly, because the claim it gated ("is the SDK
 *   loaded?") has no subject here — there is no SDK.
 */

const ROOT = resolve(import.meta.dirname, '../..');
const DIST = resolve(ROOT, 'dist');
const SOURCE_ROOT_HTML = resolve(ROOT, 'index.html');
const BUILT_ROOT_HTML = resolve(ROOT, 'dist/index.html');
const ROOT_TITLE = 'ZERO-PAPER HUB | Strategic Digital Workflows';
const ROOT_DESCRIPTION = 'ZERO-PAPER HUB builds strategic digital products and workflows that help organizations work clearly and grow.';
const ROOT_URL = 'https://www.zero-paperhub.com/';
const ROOT_IMAGE = `${ROOT_URL}zero-paper_hub_hi-def.png`;

/**
 * Static boundary for the product surface, narrowed per file rather than deleted.
 *
 * Phase 1 forbade the same flat regex list in every product source. Phase 2 needs a
 * real provider request, so the boundary is now a per-file map: a file keeps every
 * group that still applies to it, and the two files that gained a capability lose
 * exactly one group each and keep the rest.
 *
 * NARROWED by plan `04.2-06`: 17 keys -> 2. Every removed key named a HAOO product
 * source that left this repository in the same commit; all fifteen are registered in the
 * HAOO repository's own copy of this map. The union of the two maps is still every
 * product source across the two repositories — that union is the invariant, not either
 * half. The two survivors, `src/components/ProductsSection.tsx` and
 * `src/products/registry.ts`, keep the FULL boundary exactly as they had it.
 *
 * The regex groups themselves are byte-unchanged and none was deleted to accommodate the
 * reduction. Deleting a group because its subject left is the anti-pattern Phases 2 and 3
 * established against: it widens what the surviving sources are allowed to do.
 */
const ALWAYS_FORBIDDEN = [
  /dangerouslySetInnerHTML/,
  /localStorage|sessionStorage|document\.cookie|indexedDB/,
  /gtag\(|dataLayer|analytics\./,
  /react-router|createBrowserRouter/,
  /document\.referrer|navigator\.userAgent|window\.location/,
  /supabase/i,
] as const;
const NETWORK_FORBIDDEN = [/\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/] as const;
const PROVIDER_FORBIDDEN = [/formsubmit/] as const;
const FORM_MARKUP_FORBIDDEN = [/FormData|<form\b/] as const;

const FULL_BOUNDARY = [
  ...ALWAYS_FORBIDDEN,
  ...NETWORK_FORBIDDEN,
  ...PROVIDER_FORBIDDEN,
  ...FORM_MARKUP_FORBIDDEN,
] as const;

/**
 * RETIRED by plan `04.2-06`: `MEASUREMENT_PRIVACY_FORBIDDEN` and
 * `MEASUREMENT_FACADE_BOUNDARY`. Successors: both groups, byte-identical, in the HAOO
 * repository's copy of this file.
 *
 * These are the one pair of groups this reduction removed, and the distinction from the
 * prohibition above matters. The four groups retained overhead still have subjects here —
 * two product sources they apply to in full. These two had exactly one subject each
 * (`src/measurement/index.ts`, and the two PostHog adapter modules) and this repository
 * now contains no measurement module at all, so they were retired with a named successor
 * rather than left standing over nothing. A group with no possible subject cannot fail,
 * and a group that cannot fail is decoration.
 */

const PRODUCT_SOURCE_BOUNDARY: Readonly<Record<string, readonly RegExp[]>> = {
  'src/components/ProductsSection.tsx': FULL_BOUNDARY,
  'src/products/registry.ts': FULL_BOUNDARY,
};

function readText(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

const PRODUCTION_SOURCE_INPUTS = listFiles(resolve(ROOT, 'src')).filter(
  (path) => !path.startsWith(`${resolve(ROOT, 'src/test')}/`),
);
/**
 * NARROWED by plan `04.2-06`. Three entries left with their files: the HAOO document
 * (`products/haoo/index.html`, a second Vite input that no longer exists), the
 * approved-ingestion-host contract (`config/approved-analytics-hosts.ts`, moved to the
 * HAOO repository) and the four public HAOO assets — the last by way of
 * `listFiles(public)`, since the whole `public/products/haoo/` directory is gone under
 * split contract decision (d).
 *
 * `statSync` throws on a missing path, so the freshness case is what would have gone red
 * had any of these been left named here — which is exactly why the list had to be
 * narrowed in the same commit as the deletions.
 */
const BUILD_INPUTS = [
  ...PRODUCTION_SOURCE_INPUTS,
  ...listFiles(resolve(ROOT, 'public')),
  resolve(ROOT, 'index.html'),
  resolve(ROOT, 'vite.config.ts'),
  resolve(ROOT, 'package.json'),
];

/**
 * Competitor analytics origins no supported build configuration may ever publish.
 *
 * RETAINED in full by plan `04.2-06`, and it does more work here than it used to. With
 * the measurement half gone, this group and the two below are what make SPLT-03's
 * source-level claim falsifiable in this repository: not "the modules were deleted" but
 * "no module names an ingestion origin, an identity seam or a competitor origin".
 * Applied at BOTH sites — production source and built bundle — because it remains true
 * and falsifiable at both.
 */
const UNCONDITIONAL_ANALYTICS_ORIGINS_FORBIDDEN = [
  /googletagmanager|google-analytics|umami|segment\.com/i,
] as const;

/**
 * The provider's ingestion host literal never enters a module under `src/`.
 *
 * Inherited from `04.1-01`, where it was the successor to the delivery-mechanism half of
 * the guarantee plan `04-08` established. Its scope was always production source only —
 * asserting it over the bundle would have been a claim about the vendor's published
 * artifact rather than about this repository.
 *
 * RETAINED by plan `04.2-06` and, unlike in the HAOO repository, it is now unconditional
 * here: this repository selects no provider, holds no approved-host contract and carries
 * no SDK, so there is no legitimate route by which this literal could appear at all.
 */
export const PROVIDER_INGESTION_HOST_SOURCE_FORBIDDEN = [/us\.i\.posthog\.com/i] as const;

/**
 * Identity, fingerprint and ordered-queue seams — asserted against production source.
 *
 * Relocated here from the built-bundle scan by `04.1-01`, because a minified vendor SDK
 * legitimately contains identifier and queue tokens of its own. RETAINED by `04.2-06`:
 * the claim MEAS-02 and MEAS-03 depended on — that this project derives no stable
 * per-visitor identifier and keeps no ordered emission queue — is one this repository can
 * still make, and after the split it is trivially and demonstrably true rather than
 * carefully maintained.
 */
const MEASUREMENT_IDENTITY_SOURCE_FORBIDDEN = [
  /\b(?:visitor|user|device|session)(?:Id|ID)\b/,
  /\b(?:uuid|fingerprint|clickstream|eventQueue)\b/i,
] as const;

/**
 * Credential-only report shapes must never enter any browser bundle.
 *
 * RETAINED by plan `04.2-06` with its whole-bundle scope intact — and for the first time
 * since `04.1-09` that scope needs no re-justification against a vendor's artifact,
 * because this repository no longer ships one. The measurement that justified the scope
 * (every pattern here no-hit against the emitted `posthog-sdk` chunk at pinned version
 * 1.425.1) and its companion vendor-chunk case both moved to the HAOO repository with the
 * SDK. Here the group is a claim about this project's own output and nothing else.
 *
 * The group is also the DERIVATION source for the deploy-workflow credential gate below,
 * so widening it without widening that gate is impossible — the two cannot drift.
 */
const REPORT_CREDENTIAL_BUNDLE_FORBIDDEN = [
  /POSTHOG_QUERY_API_KEY/,
  /Authorization/,
  /Bearer\s/,
  /\/api\/projects\/[^/]*\/query/,
] as const;

/**
 * NARROWED by plan `04.2-06`: the HAOO document's built output left this list with the
 * document. What remains is this repository's one published document and its assets.
 */
const BUILD_OUTPUTS = [
  BUILT_ROOT_HTML,
  ...listFiles(resolve(DIST, 'assets')),
];

/**
 * Every browser-prefixed workflow assignment, read as a NAME and a VALUE.
 *
 * Added by code-review WR-02. The credential gate below used to read workflow text only
 * for names it already knew to forbid, which is a prohibition an unbounded set of names
 * can walk around: a credential assigned to `VITE_ANYTHING_AT_ALL` carries the forbidden
 * name on the value side, where nothing was looking.
 *
 * Parsed with a line-anchored regex over the file's own text rather than by shelling out
 * to a YAML tool. That is deliberate on two counts: the workflow's text is what a reader
 * and a reviewer see, and — since this file's inputs include repository content — building
 * a command line out of them would put an injection surface inside the very gate that
 * exists to keep credentials out of a build. Nothing here is executed, interpolated into a
 * shell, or passed to a process.
 *
 * `VITE_` is the prefix, because it is Vite's own inlining trigger: a variable carrying it
 * is inlined into world-readable JavaScript, and one that does not is not. The value is
 * captured verbatim to end of line, trailing comment and all, so a rule written against it
 * cannot be dodged by what follows on the same line.
 */
function browserPrefixedAssignments(workflowText: string) {
  return [...workflowText.matchAll(/^ +(VITE_[A-Z0-9_]*): *(.*)$/gmu)]
    .map(([, name, value]) => ({ name, value: value.trim() }));
}

/**
 * The one form a browser-prefixed value may take: a repository VARIABLE expression.
 *
 * An allowlist, not a denylist on `secrets.`. A denylist would pass a literal
 * `VITE_HAOO_ANALYTICS_KEY: phx_liveKey`, which is the same leak with the expression
 * removed, and it would pass `${{ github.event.* }}` — attacker-controlled text inlined
 * into the shipped bundle. `vars.*` is the only source whose contents are world-readable
 * by construction, which is exactly the property `dist` gives everything it carries.
 */
const REPOSITORY_VARIABLE_EXPRESSION = /^\$\{\{ *vars\.[A-Z0-9_]+ *\}\}$/u;

/** A value drawn from the secrets context, in either interpolation spelling. */
const SECRETS_CONTEXT = /\bsecrets\s*[.[]/u;

function newestInput() {
  return BUILD_INPUTS
    .map((path) => ({ path, mtimeMs: statSync(path).mtimeMs }))
    .reduce((newest, input) => (input.mtimeMs > newest.mtimeMs ? input : newest));
}

function oldestOutput() {
  return BUILD_OUTPUTS
    .map((path) => ({ path, mtimeMs: statSync(path).mtimeMs }))
    .reduce((oldest, output) => (output.mtimeMs < oldest.mtimeMs ? output : oldest));
}

/**
 * The built bundle, or a loud failure — never the empty string.
 *
 * `listFiles` returns `[]` for a missing directory, so this helper used to return `''`
 * when `dist/` had not been built. Every prohibition expressed as
 * `expect(bundle).not.toMatch(...)` then PASSED against nothing: the credential-boundary
 * scan and the origin-absence cases all reported green on a build that was never
 * produced. The staleness case fails separately, but it is a different test — a reader
 * scanning results saw the security assertions pass.
 *
 * `npm test` chains `npm run build` first, but `npm run test:unit` (documented and used)
 * does not, so the vacuity was reachable in normal use. Throwing here converts a silent
 * false green into an actionable message naming the command that fixes it.
 */
function builtBundleText() {
  const files = listFiles(resolve(DIST, 'assets')).filter((file) => file.endsWith('.js'));
  if (files.length === 0) {
    throw new Error(
      'No built bundle to scan under dist/assets. Run `npm run build` before asserting against the bundle.',
    );
  }

  return files.map((file) => readFileSync(file, 'utf8')).join('\n');
}

describe('public build-time configuration declarations', () => {
  const DECLARATIONS = resolve(ROOT, 'src/vite-env.d.ts');
  const ENV_KEY = /import\.meta\.env\.(VITE_[A-Z0-9_]+)/gu;

  /**
   * Vite ships `interface ImportMetaEnv { [key: string]: any }`, and the project's own
   * declaration merges with it rather than replacing it. So a renamed or misspelled
   * variable still types as `any`, compiles clean, resolves to `undefined`, and fails
   * closed — analytics silently off with no build-time signal at all. The type system
   * cannot close that hole; this scan is the build-time signal instead.
   *
   * NARROWED by plan `04.2-06`, and the narrowing is the vacuity guard, not the claim.
   * Both halves of the bidirectional invariant now range over EMPTY sets: this repository
   * reads no `import.meta.env.VITE_*` key and declares none, because all four
   * `VITE_HAOO_*` variables left with their readers in the same commit. The predecessor
   * guard `expect(referenced.size).toBeGreaterThan(0)` would fail on that — correctly,
   * for a repository that had lost its variables by accident, and wrongly here.
   *
   * So it is replaced rather than removed: the SUBJECT is proved non-empty (there are
   * production sources to scan, and a declarations file to read), and the referenced set
   * is then asserted EMPTY explicitly. The case therefore proves something — that nothing
   * reads a build variable — instead of iterating nothing. Same discipline the deploy
   * workflow's assignment roster applies below.
   */
  it('declares every public build variable the production sources read', () => {
    const declarations = readFileSync(DECLARATIONS, 'utf8');
    const referenced = new Set<string>();

    for (const path of PRODUCTION_SOURCE_INPUTS) {
      if (path === DECLARATIONS) continue;
      for (const match of readFileSync(path, 'utf8').matchAll(ENV_KEY)) {
        referenced.add(match[1]);
      }
    }

    // Subject before claim: there is real source to scan and a real file to read.
    expect(PRODUCTION_SOURCE_INPUTS.length).toBeGreaterThan(0);
    expect(declarations).not.toBe('');

    // And the claim: this repository reads no public build variable at all.
    expect(
      [...referenced],
      'This repository reads no import.meta.env.VITE_* key. If a production source now '
      + 'reads one, declare it in src/vite-env.d.ts and update this case in the same commit.',
    ).toEqual([]);

    const undeclared = [...referenced].filter(
      (key) => !new RegExp(`readonly ${key}\\?*:`, 'u').test(declarations),
    );

    expect(
      undeclared,
      `Undeclared public build variable(s) ${undeclared.join(', ')}. Add them to src/vite-env.d.ts or fix the spelling; an undeclared key types as \`any\` and silently resolves to undefined.`,
    ).toEqual([]);
  });

  it('declares no public build variable no production source reads', () => {
    const declarations = readFileSync(DECLARATIONS, 'utf8');
    const declared = [
      ...declarations.matchAll(/readonly (VITE_[A-Z0-9_]+)\??:/gu),
    ].map((match) => match[1]);
    const referenced = new Set(
      PRODUCTION_SOURCE_INPUTS
        .filter((path) => path !== DECLARATIONS)
        .flatMap((path) => [...readFileSync(path, 'utf8').matchAll(ENV_KEY)]
          .map((match) => match[1])),
    );

    // Subject before claim, for the same reason as the case above: the predecessor's
    // `expect(declared.length).toBeGreaterThan(0)` guarded against a declarations file
    // that had silently emptied. Here it IS empty, deliberately, so the file's presence
    // is what gets proved and the empty declaration set is asserted outright.
    expect(declarations).not.toBe('');
    expect(
      declared,
      'src/vite-env.d.ts declares no public build variable, and must not gain one without '
      + 'a production source that reads it in the same commit.',
    ).toEqual([]);

    expect(declared.filter((key) => !referenced.has(key))).toEqual([]);
  });
});

describe('Phase 1 build artifact freshness', () => {
  it('requires every production build output to exist', () => {
    const missingOutputs = BUILD_OUTPUTS.filter((path) => !existsSync(path));

    expect(
      missingOutputs,
      `Missing build output ${missingOutputs[0] ?? BUILT_ROOT_HTML}. Run npm run build before asserting against dist/index.html.`,
    ).toEqual([]);
  });

  it('scans a non-empty set of production build inputs', () => {
    expect(BUILD_INPUTS.length).toBeGreaterThan(0);
    expect(BUILD_INPUTS.every((path) => existsSync(path))).toBe(true);
  });

  it('rejects outputs older than the newest production build input', () => {
    const input = newestInput();
    const output = oldestOutput();

    expect(
      output.mtimeMs,
      `Stale build output ${output.path} (${new Date(output.mtimeMs).toISOString()}) is older than build input ${input.path} (${new Date(input.mtimeMs).toISOString()}). Run npm run build.`,
    ).toBeGreaterThanOrEqual(input.mtimeMs);
  });
});

describe('Phase 1 static build contracts', () => {
  it('publishes first-party root canonical and social metadata', () => {
    for (const html of [readText(SOURCE_ROOT_HTML), readText(BUILT_ROOT_HTML)]) {
      expect(html).toContain(ROOT_TITLE);
      expect(html).toContain(`name="description" content="${ROOT_DESCRIPTION}"`);
      expect(html).toContain(`rel="canonical" href="${ROOT_URL}"`);
      expect(html).toContain('property="og:type" content="website"');
      expect(html).toContain(`property="og:title" content="${ROOT_TITLE}"`);
      expect(html).toContain(`property="og:description" content="${ROOT_DESCRIPTION}"`);
      expect(html).toContain(`property="og:url" content="${ROOT_URL}"`);
      expect(html).toContain(`property="og:image" content="${ROOT_IMAGE}"`);
      expect(html).toContain('property="og:site_name" content="ZERO-PAPER HUB"');
      expect(html).toContain('name="twitter:card" content="summary_large_image"');
      expect(html).toContain(`name="twitter:title" content="${ROOT_TITLE}"`);
      expect(html).toContain(`name="twitter:description" content="${ROOT_DESCRIPTION}"`);
      expect(html).toContain(`name="twitter:image" content="${ROOT_IMAGE}"`);
      expect(html).not.toContain('bolt.new');
    }

    expect(existsSync(resolve(ROOT, 'public/zero-paper_hub_hi-def.png'))).toBe(true);
    expect(existsSync(resolve(ROOT, 'dist/zero-paper_hub_hi-def.png'))).toBe(true);
  });

  /**
   * RENAMED by plan `04.2-06`. Predecessor: `references emitted scripts, styles, and
   * product assets from built HTML`. Its subject was `dist/products/haoo/index.html`,
   * which this repository no longer builds, and the "product assets" half of the name
   * described the four brochure files that decision (d) lets go. The claim itself —
   * every emitted asset a published document references actually exists in the uploaded
   * tree — is unchanged and now made about this repository's one document.
   */
  it('references emitted scripts and styles from the built home document', () => {
    const html = readText(BUILT_ROOT_HTML);
    const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
      .map(([, path]) => path);

    expect(assetPaths.length).toBeGreaterThan(0);
    for (const assetPath of assetPaths) {
      expect(existsSync(resolve(ROOT, `dist${assetPath}`))).toBe(true);
    }
  });

  it('uploads exactly the built dist tree that the Pages workflow deploys', () => {
    const workflow = readText(resolve(ROOT, '.github/workflows/deploy.yml'));

    expect(workflow).toContain('path: ./dist');
    expect(readText(resolve(ROOT, 'CNAME')).trim()).toBe('www.zero-paperhub.com');
  });

  it('keeps the product surface inside its narrowed static boundary', () => {
    // The map is down to the two product sources this repository keeps, and both keep
    // the FULL boundary. This first guard is what made the narrowing and the deletions
    // one commit rather than two: `not.toBe('')` goes red the instant a mapped source
    // leaves the tree.
    expect(Object.keys(PRODUCT_SOURCE_BOUNDARY)).toEqual([
      'src/components/ProductsSection.tsx',
      'src/products/registry.ts',
    ]);

    for (const [relativePath, forbiddenGroup] of Object.entries(PRODUCT_SOURCE_BOUNDARY)) {
      const source = readText(resolve(ROOT, relativePath));

      expect(source, relativePath).not.toBe('');
      for (const forbidden of forbiddenGroup) {
        expect(source, `${relativePath} :: ${forbidden}`).not.toMatch(forbidden);
      }
    }

    // Every remaining product source carries the whole always-forbidden group, with NO
    // exemption. The one narrowed entry this map ever had — the audited measurement
    // facade at `src/measurement/index.ts`, which was allowed storage and the current URL
    // — left with the measurement half, so the loop below no longer skips anything and
    // deliberately does not carry a skip. A reinstated exemption must be an explicit edit
    // here, not an inherited `continue`.
    for (const [relativePath, forbiddenGroup] of Object.entries(PRODUCT_SOURCE_BOUNDARY)) {
      for (const forbidden of ALWAYS_FORBIDDEN) {
        expect(forbiddenGroup, relativePath).toContain(forbidden);
      }
      expect(forbiddenGroup, relativePath).toEqual(FULL_BOUNDARY);
    }

    expect(existsSync(resolve(ROOT, 'components.json'))).toBe(false);
    expect(existsSync(resolve(ROOT, 'src/components/ui'))).toBe(false);
  });

  it('keeps analytics origins out of production source modules', () => {
    // Reuse BUILD_INPUTS' exact `src/` scope while excluding `src/test/`: the test
    // sources necessarily contain the forbidden literals that define this contract.
    const forbiddenSourcePatterns = [
      ...UNCONDITIONAL_ANALYTICS_ORIGINS_FORBIDDEN,
      ...PROVIDER_INGESTION_HOST_SOURCE_FORBIDDEN,
      ...MEASUREMENT_IDENTITY_SOURCE_FORBIDDEN,
    ];

    expect(PRODUCTION_SOURCE_INPUTS.length).toBeGreaterThan(0);
    for (const path of PRODUCTION_SOURCE_INPUTS) {
      const source = readText(path);
      const relativePath = relative(ROOT, path).replace(/\\/g, '/');
      for (const forbidden of forbiddenSourcePatterns) {
        expect(source, `${relativePath} :: ${forbidden}`).not.toMatch(forbidden);
      }
    }
  });

  /**
   * RENAMED and WIDENED by plan `04.2-06`. Predecessor: `leaves no superseded
   * approved-script-source module or constant behind`.
   *
   * The predecessor asserted that `04.1-03`'s approved-SCRIPT-SOURCE module, its define
   * and its build-time constant were really gone rather than surviving as dead wiring.
   * That claim is retained verbatim. Added to it, in the commit that removed them, are
   * the approved-INGESTION-HOST module, its define and its build-time constant, plus the
   * four `VITE_HAOO_*` names and the analytics SDK specifier. All of those moved to the
   * HAOO repository under SPLT-03, and this case is what stops any of them being
   * resurrected here — at the source level, the configuration level and the dependency
   * level, which is precisely the three-level claim SPLT-03 makes.
   *
   * Presence before absence throughout: `readText` returns `''` for a missing path and a
   * `.not.toMatch` over `''` passes for the wrong reason, so every subject is asserted
   * non-empty first.
   */
  it('leaves no superseded or migrated analytics module, define or constant behind', () => {
    // The modules themselves, by path.
    expect(existsSync(resolve(ROOT, 'config/approved-analytics-script-sources.ts')))
      .toBe(false);
    expect(existsSync(resolve(ROOT, 'config/approved-analytics-hosts.ts'))).toBe(false);
    expect(existsSync(resolve(ROOT, 'config'))).toBe(false);
    expect(existsSync(resolve(ROOT, 'src/measurement'))).toBe(false);
    expect(existsSync(resolve(ROOT, 'src/reporting'))).toBe(false);

    const superseded = [
      /__HAOO_APPROVED_ANALYTICS_SCRIPT_SOURCES__/,
      /approvedScriptSourcesForProvider/,
      /approved-analytics-script-sources/,
      /__HAOO_APPROVED_ANALYTICS_HOSTS__/,
      /approvedAnalyticsHostsForProvider/,
      /approved-analytics-hosts/,
      /VITE_HAOO_[A-Z0-9_]+/,
      /posthog/i,
    ];
    const retired = [
      resolve(ROOT, 'vite.config.ts'),
      resolve(ROOT, 'src/vite-env.d.ts'),
      resolve(ROOT, 'package.json'),
      resolve(ROOT, '.github/workflows/deploy.yml'),
      ...PRODUCTION_SOURCE_INPUTS,
    ].map((path) => ({ relativePath: relative(ROOT, path).replace(/\\/g, '/'), text: readText(path) }));

    for (const { relativePath, text } of retired) {
      expect(text, relativePath).not.toBe('');
      for (const forbidden of superseded) {
        expect(text, `${relativePath} :: ${forbidden}`).not.toMatch(forbidden);
      }
    }
  });

  /**
   * NARROWED by plan `04.2-06`, on its pattern list only — the whole-bundle SCOPE is
   * retained and, for the first time since `04.1-09`, needs no re-justification against a
   * vendor's minified artifact, because this repository ships none.
   *
   * Removed from the list: `/haoo_page_view[^;]{0,240}(?:properties|payload|formData)/i`.
   * That pattern forbade a HAOO event name carried alongside a property bag; this
   * repository has no event vocabulary, so the pattern had no possible subject and could
   * never fail. Its successor is the same pattern in the same case in the HAOO
   * repository, where the vocabulary lives. Retained here: the competitor-origin group
   * and the four report-credential shapes, both of which remain claims this repository
   * can make and could fail.
   */
  it('ships every built bundle without competitor analytics, property, or credential seams', () => {
    const bundle = builtBundleText();
    const forbiddenBundlePatterns = [
      ...UNCONDITIONAL_ANALYTICS_ORIGINS_FORBIDDEN,
      ...REPORT_CREDENTIAL_BUNDLE_FORBIDDEN,
    ];

    expect(bundle.length).toBeGreaterThan(0);
    for (const forbidden of forbiddenBundlePatterns) {
      expect(bundle, String(forbidden)).not.toMatch(forbidden);
    }
  });

  /**
   * The credential boundary one layer earlier than the bundle scan can reach.
   *
   * `ships every built bundle without competitor analytics, property, or credential seams`
   * reads the built artifact, which is the right place to catch a credential that
   * already leaked. It is the wrong place to catch the leak being ARRANGED: the deploy
   * workflow's Build environment is what Vite inlines from, so a `VITE_POSTHOG_QUERY_API_KEY`
   * exported there would be inside `dist` before any scan of `dist` ran, and the scan would
   * be reporting a fact rather than preventing one. Added by `04.1-11`, the commit that first
   * gave that Build step analytics variables at all (T-04.1-25).
   *
   * The forbidden names are DERIVED from `REPORT_CREDENTIAL_BUNDLE_FORBIDDEN` rather than
   * restated, so widening that group without widening this gate is impossible — the two
   * cannot drift. `POSTHOG_PROJECT_ID` is the one name added by hand, with its reason
   * recorded: it is deliberately absent from that group because a numeric project id is not
   * a credential SHAPE and asserting it over a minified bundle would be noise.
   *
   * NARROWED by plan `04.2-06`, and this is the case step F.7 of that plan singled out.
   * The three per-name "assigned exactly once in the Build step" assertions are gone with
   * the variables they counted, and the Build step now carries no `env:` block at all — so
   * the predecessor's `expect(buildEnv).toContain('env:')` and
   * `expect(assignments.length).toBeGreaterThan(0)` would both fail on a workflow that is
   * correct.
   *
   * They are replaced rather than deleted, and the VACUITY IS MADE EXPLICIT: the case
   * proves the Build step exists and is readable, then asserts that the set of
   * browser-prefixed assignments in the whole file is EMPTY. A value-side rule over an
   * empty list proves nothing on its own, so the parser's ability to find an assignment in
   * THIS file's actual shape is proved by the mutation case immediately below — that is
   * where the emptiness stops being an accident of a parser that no longer matches.
   */
  it('keeps every report credential out of the deploy workflow Build environment', () => {
    const workflow = readText(resolve(ROOT, '.github/workflows/deploy.yml'));
    expect(workflow, '.github/workflows/deploy.yml').not.toBe('');

    const buildStep = workflow.split(/^ {6}- name: Build$/mu)[1] ?? '';
    expect(buildStep, 'the Build step in .github/workflows/deploy.yml').not.toBe('');
    expect(buildStep, "the Build step's run line").toContain('run: npm run build');

    const derivedCredentialNames = REPORT_CREDENTIAL_BUNDLE_FORBIDDEN
      .map((pattern) => pattern.source)
      .filter((source) => /^[A-Z][A-Z0-9_]+$/u.test(source));
    expect(
      derivedCredentialNames,
      'REPORT_CREDENTIAL_BUNDLE_FORBIDDEN no longer yields any environment-variable name, so '
      + 'this gate would assert nothing. Restore the derivation rather than hardcoding names.',
    ).toContain('POSTHOG_QUERY_API_KEY');

    for (const name of [...derivedCredentialNames, 'POSTHOG_PROJECT_ID']) {
      expect(
        workflow,
        `${name} must never appear under a browser prefix in the deploy workflow — Vite would `
        + 'inline it into a world-readable bundle.',
      ).not.toMatch(new RegExp(`VITE[A-Z0-9_]*_${name}|VITE_${name}`, 'u'));
      expect(
        workflow.match(new RegExp(`^ *(?:VITE_[A-Z0-9_]*)?${name}: `, 'gmu')) ?? [],
        `${name} must never be assigned in any step of the deploy workflow.`,
      ).toHaveLength(0);
    }

    // The value side (WR-02), and the roster. Both now range over an empty set, asserted
    // as empty rather than iterated over in silence: this workflow sets NO browser-
    // prefixed variable, so nothing it exports can be inlined into the published bundle.
    // A variable added here without a decision is a red test, which is the property the
    // predecessor's roster assertion had and this one keeps.
    const assignments = browserPrefixedAssignments(workflow);
    expect(
      assignments.map(({ name }) => name),
      'the browser-prefixed variables this workflow may set — none, since plan 04.2-06 '
      + 'removed the four VITE_HAOO_* assignments with the sources that read them',
    ).toEqual([]);

    for (const { name, value } of assignments) {
      expect(value, `${name} carries a secrets-context value.`).not.toMatch(SECRETS_CONTEXT);
      expect(value, `${name} must be exactly one repository variable expression.`)
        .toMatch(REPOSITORY_VARIABLE_EXPRESSION);
    }
  });

  /**
   * The measurement that widened the gate above, pinned so it cannot go stale — and,
   * since plan `04.2-06`, ALSO the proof that the gate's empty roster is a fact about the
   * workflow rather than a parser that has stopped matching it.
   *
   * Code-review WR-02 added the leak line below to a copy of the real workflow and ran the
   * gate's two name-side regexes against it: `browser-prefix match: false | assignment
   * count: 0` — green, with a report credential in the Build environment. This case is that
   * experiment, executable. It asserts BOTH halves of the finding: that the name-side rules
   * are blind to it (so a future reader cannot mistake the value-side rule for a
   * duplicate), and that the value-side rule catches it (so the widening cannot be quietly
   * narrowed back).
   *
   * AMENDED by `04.2-06`. The mutant used to be built by duplicating the workflow's
   * existing `VITE_HAOO_POSTHOG_TOKEN` line; there is no such line any more, so the mutant
   * now synthesises the `env:` block the Build step no longer has. The mutation is still
   * built from the REAL file rather than a hand-written fixture — a fixture would keep
   * passing after the workflow's shape moved out from under the parser, which is the
   * failure mode that let the original gap through, and which an empty roster would
   * otherwise hide completely.
   */
  it('catches a report credential smuggled under an unforbidden browser-prefixed name', () => {
    const workflow = readText(resolve(ROOT, '.github/workflows/deploy.yml'));
    expect(workflow, '.github/workflows/deploy.yml').not.toBe('');

    const smuggled = 'VITE_HAOO_ANALYTICS_KEY: ${{ secrets.POSTHOG_QUERY_API_KEY }}';
    const mutant = workflow.replace(
      /^( +)- name: Build\n\1 {2}run: npm run build$/mu,
      `$1- name: Build\n$1  env:\n$1    ${smuggled}\n$1  run: npm run build`,
    );
    expect(
      mutant,
      'the mutated workflow — if this is unchanged the Build step no longer has the shape '
      + 'this probe mutates, and the empty assignment roster above is unproven',
    ).not.toBe(workflow);

    // What the name-side rules see: nothing. `POSTHOG_QUERY_API_KEY` never appears under a
    // browser prefix, and it is never the name being assigned — it is the value.
    expect(mutant).not.toMatch(/VITE[A-Z0-9_]*_POSTHOG_QUERY_API_KEY|VITE_POSTHOG_QUERY_API_KEY/u);
    expect(mutant.match(/^ *(?:VITE_[A-Z0-9_]*)?POSTHOG_QUERY_API_KEY: /gmu) ?? []).toHaveLength(0);

    // The parser reads this file's real shape: zero assignments before the mutation,
    // exactly one after it. This is what stops the empty roster above from passing because
    // the regex stopped matching rather than because the workflow stopped assigning.
    expect(browserPrefixedAssignments(workflow)).toEqual([]);
    expect(browserPrefixedAssignments(mutant).map(({ name }) => name))
      .toEqual(['VITE_HAOO_ANALYTICS_KEY']);

    // What the value-side rule sees: exactly one offending assignment, by name.
    const offending = browserPrefixedAssignments(mutant)
      .filter(({ value }) => SECRETS_CONTEXT.test(value) || !REPOSITORY_VARIABLE_EXPRESSION.test(value));

    expect(offending.map(({ name }) => name)).toEqual(['VITE_HAOO_ANALYTICS_KEY']);
  });
});
