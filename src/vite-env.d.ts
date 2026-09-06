/// <reference types="vite/client" />

/**
 * Public build-time configuration declarations — currently NONE, and that emptiness is
 * the point rather than an omission.
 *
 * Until plan `04.2-06` this file declared four optional browser-prefixed product keys on
 * `ImportMetaEnv` and one build-time approved-ingestion-host constant. Every reader of
 * all five left this repository in the same commit as the declarations, which is not
 * tidiness but a hard requirement: `src/test/build-output.test.ts` asserts the
 * bidirectional exhaustiveness invariant — every declared public build variable is read
 * by some production source, and every variable a production source reads is declared —
 * so a declaration outliving its reader fails the first half.
 *
 * This repository now reads no `import.meta.env.VITE_*` key at all and declares none.
 * The two exhaustiveness cases still run: they prove the scanned subject is non-empty
 * first and then assert BOTH sides are empty, so the invariant is stated explicitly
 * rather than holding by accident over nothing.
 *
 * The five removed declarations are enumerated by name in the phase's out-of-band record
 * (`04.2-DEFERRED-ITEMS.md`) rather than here, because this repository's own suite now
 * forbids those names appearing anywhere it builds from. Their successors live in the
 * HAOO repository's copy of this file, which owns the qualification endpoint, the
 * measurement provider selector, its two provider values and the ingestion-host constant.
 *
 * The file's own rule is unchanged and still load-bearing: **no `import` and no `export`
 * may be added here.** Either would turn this file into a module and silently drop the
 * global augmentation, so any shape a future declaration needs is written inline rather
 * than imported.
 */
