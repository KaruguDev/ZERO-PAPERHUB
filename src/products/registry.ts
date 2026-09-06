/**
 * The published product collection, held inline.
 *
 * Until plan `04.2-06` this module imported `HAOO_PRODUCT` from `./haoo` and
 * `ProductDefinition` from `./types`. Both modules moved to the HAOO repository, and
 * D-06 severs the build-time coupling deliberately rather than replacing it with a
 * cross-repository import: nothing in this repository's build may read a file the HAOO
 * repository owns. What remains is the short list of facts a card actually renders,
 * declared here with a type of its own.
 *
 * ACCEPTED COST, named rather than mitigated: the copy below and HAOO's own copy of the
 * same sentences can drift, and **nothing checks that they agree**. There is no shared
 * module, no generated file and no scheduled comparison. That was the price of having no
 * build-time dependency on the other repository, and it was paid on purpose. A future
 * reader who finds the two out of step is looking at the known cost of D-06, not at a
 * broken guarantee.
 */

/**
 * One product card, exactly as the Products section renders it.
 *
 * Declared locally, not imported: this repository publishes no product documents of its
 * own, so a card is all the shape it needs. The nested `brochure` object is kept nested
 * because `ProductsSection` destructures it; flattening it would be a component change
 * bought for nothing.
 */
export interface ProductCard {
  /** Stable key for the rendered list. */
  readonly slug: string;
  readonly name: string;
  /** How the product relates to this company. */
  readonly relationship: string;
  readonly outcome: string;
  readonly audienceLead: string;
  /**
   * Where the card sends a visitor. Absolute and off-site under D-06: the product lives
   * on its own domain, and this repository serves no document for it.
   */
  readonly href: string;
  readonly brochure: {
    /** Empty string means the card renders no preview media at all. */
    readonly previewImageHref: string;
    readonly previewImageAlt: string;
    readonly previewImageWidth: number;
    readonly previewImageHeight: number;
  };
}

/** Anchor target shared by the home navigation entry and the Products landmark. */
export const PRODUCTS_SECTION_ID = 'products';

/** Visible and accessible label for the Products navigation entry and landmark. */
export const PRODUCTS_NAV_LABEL = 'Products';

/**
 * The HAOO card.
 *
 * Every string below was read off `src/products/haoo.ts` in the commit before it left
 * this repository, so the card ships the same words it always did.
 *
 * The preview image is the HAOO site's own copy, addressed absolutely. Under split
 * contract decision (d) the four retired assets under `/products/haoo/` are LET GO and
 * that path returns 404, so a root-relative `src` here would render a broken image on
 * this site. This repository retains no copy of the file and claims no retention of the
 * old URLs.
 */
const HAOO_CARD: ProductCard = {
  slug: 'haoo',
  name: 'HAOO',
  relationship: 'A ZERO-PAPER HUB product',
  outcome: 'Run the business—not the paperwork.',
  audienceLead:
    'For landlords and property managers who want one clear view of their properties, rent, leases, maintenance, and communication.',
  href: 'https://www.haoo.online/',
  brochure: {
    previewImageHref: 'https://www.haoo.online/brochure/brochure-preview.png',
    previewImageAlt: 'HAOO property-management brochure preview',
    previewImageWidth: 1287,
    previewImageHeight: 909,
  },
};

/**
 * The published product collection. This registry only decides which products are live.
 */
export const PRODUCTS: readonly ProductCard[] = [HAOO_CARD];

/**
 * WITHDRAWN by plan `04.2-06`. Successor: the card record's own `href` field, read
 * directly by `ProductsSection`.
 *
 * `productRoute(product)` returned `/products/${product.slug}/` — a same-origin path to a
 * document this repository published itself. Since the split there is no such document:
 * the product is served from its own domain, and the retired path returns 404 under
 * decision (d). A function that derives a route from a slug can only ever produce the
 * dead path, so deriving is exactly the wrong mechanism and no narrowing of it would be
 * truthful.
 *
 * Recorded rather than deleted silently, and the name deliberately NOT reused for a
 * function returning `product.href`. A reader who finds `productRoute` in an old diff,
 * summary or review must be able to see a route that stopped existing rather than assume
 * the derivation is still how the link is built. Nothing calls it any more; the `href`
 * field above is what a card carries now.
 */

/**
 * Navigation entry derived from collection presence so the Products nav item and
 * the Products section can never disagree about whether products exist.
 */
export function productsNavLink(
  products: readonly ProductCard[],
): { readonly label: string; readonly href: string } | null {
  if (products.length === 0) {
    return null;
  }

  return { label: PRODUCTS_NAV_LABEL, href: `#${PRODUCTS_SECTION_ID}` };
}
