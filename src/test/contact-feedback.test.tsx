import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from '../App';

/**
 * The two pieces of the home page that only appear in response to something the visitor
 * did: the contact form's success banner, and the company-profile download.
 *
 * Both were changed to satisfy accessibility rules a SonarQube scan reported, and both
 * changes are the kind that a type checker and a build cannot tell you went wrong —
 * swapping one element for another that "should" behave the same, and swapping one DOM
 * removal call for another. This suite asserts the BEHAVIOUR each change was supposed to
 * preserve, so the next person to touch them finds out here rather than in a screen reader.
 */
describe('Home page contact feedback and profile download', () => {
  const originalUrl = `${window.location.pathname}${window.location.search}`;

  /**
   * jsdom implements neither `URL.createObjectURL` nor `URL.revokeObjectURL`, so they
   * cannot be spied on — there is no function there to replace. They are INSTALLED for the
   * duration of a case and taken off again below, which is also why the teardown deletes
   * rather than restores: leaving a half-working Blob URL API on the global `URL` would
   * change what a later suite sees.
   */
  type ObjectUrlHost = {
    createObjectURL?: (blob: Blob) => string;
    revokeObjectURL?: (url: string) => void;
  };
  const urlHost = URL as unknown as ObjectUrlHost;

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
    delete urlHost.createObjectURL;
    delete urlHost.revokeObjectURL;
    vi.restoreAllMocks();
  });

  /**
   * The banner is rendered as `<output>` rather than a `<div role="status">`. The point of
   * that swap is that it changes the ELEMENT without changing the SEMANTICS: `<output>`
   * carries an implicit `status` role, so assistive technology announces it as a live
   * region exactly as the explicit role did. Querying by ROLE rather than by tag is what
   * makes this a test of the semantics rather than a test of the markup.
   */
  it('announces a successful contact submission as a live status region', () => {
    window.history.replaceState({}, '', '/?contact=success');

    render(<HomePage />);

    const banner = screen.getByRole('status');
    expect(banner, 'the success banner is a live region').toBeTruthy();
    expect(banner.textContent).toMatch(/Message sent successfully/u);
    expect(banner.textContent).toMatch(/get back to you shortly/u);
  });

  it('shows no status region on an ordinary visit', () => {
    window.history.replaceState({}, '', '/');

    render(<HomePage />);

    expect(
      screen.queryByRole('status'),
      'the banner belongs to a submission, not to every page view',
    ).toBeNull();
  });

  /**
   * The download builds a Blob, hands it to a temporary anchor, clicks it, and then takes
   * the anchor back out of the document. That last step used to be
   * `document.body.removeChild(a)` and is now `a.remove()`; the assertion that matters is
   * not which call is used but that the document is left exactly as it was found. An
   * anchor left behind would accumulate one dangling node per download.
   */
  it('cleans up the temporary anchor and revokes the object URL after a download', () => {
    const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:zero-paper-hub/profile');
    const revokeObjectURL = vi.fn<(url: string) => void>();
    urlHost.createObjectURL = createObjectURL;
    urlHost.revokeObjectURL = revokeObjectURL;

    // jsdom has no navigation, so a real anchor click logs an unimplemented-navigation
    // error. The click itself is not the subject here; what happens around it is.
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<HomePage />);

    const button = screen.getByRole('button', { name: /Download Profile/u });
    button.click();

    expect(click, 'the anchor was clicked once').toHaveBeenCalledTimes(1);
    expect(createObjectURL, 'a blob URL was created for the profile').toHaveBeenCalledTimes(1);
    expect(createObjectURL.mock.calls[0][0], 'from a Blob').toBeInstanceOf(Blob);
    expect(revokeObjectURL, 'and released again').toHaveBeenCalledWith(
      'blob:zero-paper-hub/profile',
    );
    expect(
      document.querySelector('a[download]'),
      'the temporary anchor does not outlive the download',
    ).toBeNull();
  });

  /**
   * The button carries an explicit `type="button"`. A button with no type defaults to
   * `submit`, which is harmless where it sits today and silently wrong the moment anyone
   * moves it inside the contact form below it.
   */
  it('gives the download button an explicit non-submit type', () => {
    render(<HomePage />);

    const button = screen.getByRole('button', { name: /Download Profile/u });
    expect(button.getAttribute('type')).toBe('button');
  });
});
