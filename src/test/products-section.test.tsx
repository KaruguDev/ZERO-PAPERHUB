import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from '../App';
import ProductsSection from '../components/ProductsSection';
import { PRODUCTS, PRODUCTS_NAV_LABEL, PRODUCTS_SECTION_ID } from '../products/registry';
import type { ProductCard } from '../products/registry';

/**
 * RE-POINTED by plan `04.2-06`, not rewritten.
 *
 * This suite used to build its fixtures from `HAOO_PRODUCT` in `src/products/haoo.ts`
 * and type them as `ProductDefinition` from `src/products/types.ts`. Both modules moved
 * to the HAOO repository and D-06 forbids importing across the split, so the fixtures now
 * come from the shipped card record itself. Every case below is preserved — a case lost
 * here is a case lost from the Products contract Phase 1 established.
 *
 * Taking the base fixture from `PRODUCTS[0]` rather than restating its fields is
 * deliberate: the card is the only source of these strings in this repository, so a copy
 * change that did not reach the section would fail here rather than agreeing with a
 * second hand-typed copy.
 */
const HAOO_CARD = PRODUCTS[0];

/** The HAOO site, as an absolute origin. Pinned: D-06 makes this a build-time literal. */
const HAOO_SITE_URL = 'https://www.haoo.online/';

function product(overrides: Partial<ProductCard>): ProductCard {
  return {
    ...HAOO_CARD,
    ...overrides,
  };
}

describe('Phase 1 Products collection contracts', () => {
  it('[phase1-red:products] omits the Products landmark when the collection is empty', () => {
    render(<ProductsSection products={[]} />);

    expect(screen.queryByRole('region', { name: 'Products' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Products' })).toBeNull();
  });

  /**
   * RENAMED by plan `04.2-06`. Predecessor: `renders one product as a featured HAOO card
   * with a native route`. The name outlived its subject — the route is no longer native.
   * Under D-06 the card carries an absolute link to the product's own domain, because
   * this repository publishes no document for it and the retired same-origin path
   * deliberately 404s. Everything else the case asserted is unchanged.
   */
  it('renders one product as a featured HAOO card linking to the HAOO domain', () => {
    render(<ProductsSection products={[HAOO_CARD]} />);

    const products = screen.getByRole('region', { name: 'Products' });
    expect(within(products).getByRole('heading', { name: 'HAOO' })).toBeTruthy();
    expect(within(products).getByText('Run the business—not the paperwork.')).toBeTruthy();
    expect(within(products).getByText(/landlords and property managers/i)).toBeTruthy();

    const href = within(products).getByRole('link', { name: 'Explore HAOO' })
      .getAttribute('href');
    expect(href).toBe(HAOO_SITE_URL);
    // Absolute and off-site, asserted as such rather than only as a string match: a
    // root-relative path would resolve against this site, where nothing serves it.
    expect(new URL(href ?? '').origin).toBe('https://www.haoo.online');
  });

  it('renders many products as a semantic collection without changing HAOO', () => {
    const secondProduct = product({
      slug: 'future-product',
      name: 'Future product',
      outcome: 'A future product outcome',
      href: 'https://example.invalid/future-product/',
    });

    render(<ProductsSection products={[HAOO_CARD, secondProduct]} />);

    const products = screen.getByRole('region', { name: 'Products' });
    expect(within(products).getAllByRole('article')).toHaveLength(2);
    expect(within(products).getByRole('link', { name: 'Explore HAOO' }).getAttribute('href'))
      .toBe(HAOO_SITE_URL);
    expect(within(products).getByRole('heading', { name: 'Future product' })).toBeTruthy();
  });

  it('keeps required featured copy and navigation available without preview media', () => {
    const withoutPreview = product({
      brochure: {
        ...HAOO_CARD.brochure,
        previewImageHref: '',
      },
    });

    render(<ProductsSection products={[withoutPreview]} />);

    expect(screen.getByRole('heading', { name: 'HAOO' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Explore HAOO' })).toBeTruthy();
  });
});

describe('Phase 1 featured product card contract', () => {
  it('renders the locked featured card order, supplied preview, and one native action', () => {
    render(<ProductsSection products={[HAOO_CARD]} />);

    const card = screen.getByRole('article');

    const order = Array.from(card.querySelectorAll('h3, p, a'))
      .map((element) => element.textContent?.trim());
    expect(order).toEqual([
      'Featured product',
      HAOO_CARD.name,
      HAOO_CARD.relationship,
      HAOO_CARD.outcome,
      HAOO_CARD.audienceLead,
      `Explore ${HAOO_CARD.name}`,
    ]);

    expect(within(card).getAllByRole('link')).toHaveLength(1);
    expect(card.querySelectorAll('button')).toHaveLength(0);
    expect(card.getAttribute('onclick')).toBeNull();

    // The preview is the HAOO site's own copy. Under split contract decision (d) the four
    // retired assets under `/products/haoo/` are let go and that path 404s, so a
    // root-relative source here would render a broken image on this site.
    expect(HAOO_CARD.brochure.previewImageHref)
      .toBe('https://www.haoo.online/brochure/brochure-preview.png');
    const preview = within(card).getByRole('img', {
      name: 'HAOO property-management brochure preview',
    });
    expect(preview.getAttribute('src')).toBe(HAOO_CARD.brochure.previewImageHref);
    expect(preview.getAttribute('width')).toBe('1287');
    expect(preview.getAttribute('height')).toBe('909');
  });
});

describe('Phase 1 Products discovery navigation contracts', () => {
  function openMobileMenu() {
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const mobileNavigation = document.getElementById(toggle.getAttribute('aria-controls')!);
    expect(mobileNavigation).not.toBeNull();
    return { toggle, mobileNavigation: mobileNavigation! };
  }

  function linkLabels(scope: HTMLElement) {
    return within(scope)
      .getAllByRole('link')
      .map((link) => link.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  }

  it('exposes Products between Services and Values in desktop and mobile navigation', () => {
    render(<HomePage products={[HAOO_CARD]} />);

    const desktopNavigation = screen.getByRole('navigation', { name: 'Primary' });
    const { mobileNavigation } = openMobileMenu();

    for (const navigation of [desktopNavigation, mobileNavigation]) {
      const link = within(navigation).getByRole('link', { name: PRODUCTS_NAV_LABEL });
      expect(link.getAttribute('href')).toBe('#products');
      expect(link.className).toContain('min-h-11');
      expect(link.className).not.toMatch(/truncate|line-clamp|whitespace-nowrap/);

      const labels = linkLabels(navigation);
      expect(labels.indexOf(PRODUCTS_NAV_LABEL)).toBe(labels.indexOf('Services') + 1);
      expect(labels.indexOf('Values')).toBe(labels.indexOf(PRODUCTS_NAV_LABEL) + 1);
    }
  });

  it('places the Products landmark after Services and before Values', () => {
    render(<HomePage products={[HAOO_CARD]} />);

    const sectionIds = Array.from(document.querySelectorAll('section[id]'))
      .map((section) => section.id);
    expect(sectionIds.indexOf('products')).toBe(sectionIds.indexOf('services') + 1);
    expect(sectionIds.indexOf('values')).toBe(sectionIds.indexOf('products') + 1);
    expect(screen.getByRole('region', { name: PRODUCTS_NAV_LABEL })).toBeTruthy();
  });

  it('omits the Products navigation item and section together for an empty collection', () => {
    render(<HomePage products={[]} />);

    openMobileMenu();

    expect(screen.queryByRole('link', { name: PRODUCTS_NAV_LABEL })).toBeNull();
    expect(screen.queryByRole('region', { name: PRODUCTS_NAV_LABEL })).toBeNull();
    expect(document.querySelector('#products')).toBeNull();
    expect(screen.getAllByRole('link', { name: 'Services' }).length).toBeGreaterThan(0);
  });

  it('lands the Products heading below the fixed home header rather than behind it', () => {
    render(<HomePage products={[HAOO_CARD]} />);

    const products = document.getElementById(PRODUCTS_SECTION_ID);
    expect(products).not.toBeNull();

    // The fixed home header measures up to 80px below md and up to 120px at md+,
    // so the anchor target reserves 96px and 128px of scroll margin respectively.
    expect(products!.className).toContain('scroll-mt-24');
    expect(products!.className).toContain('md:scroll-mt-32');
  });

  it('closes the mobile menu after a visitor selects Products', () => {
    render(<HomePage products={[HAOO_CARD]} />);

    const { toggle, mobileNavigation } = openMobileMenu();

    fireEvent.click(within(mobileNavigation).getByRole('link', { name: PRODUCTS_NAV_LABEL }));

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  });
});
