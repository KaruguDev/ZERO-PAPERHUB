# ZERO-PAPERHUB

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-qh3qzu6i)

## Contact form

The contact form posts to FormSubmit and delivers enquiries to `info@zero-paperhub.com`. FormSubmit provides server-side reCAPTCHA filtering, and the form also includes a honeypot field and browser validation.

After deploying the form for the first time:

1. Submit one test enquiry from `https://www.zero-paperhub.com/#contact`.
2. Open the activation message sent by FormSubmit to `info@zero-paperhub.com` and confirm the form.
3. Submit a second enquiry and verify that it is delivered. Check the spam folder if the activation message does not appear in the inbox.

Activation is required only once for this domain and recipient address.

## HAOO

HAOO is a ZERO-PAPER HUB product and lives in its own repository, published at
<https://www.haoo.online/>. Its qualification form, its endpoint variable and its
measurement provider are documented in that repository's README, not here.

This repository builds the company site only. It ships no measurement code, no ingestion
origin and no analytics dependency; `src/test/build-output.test.ts` asserts that at the
source, dependency and configuration levels. The home page's Products section links out
to the HAOO domain from an inline card record in `src/products/registry.ts` — a
build-time literal, deliberately not a build-time dependency on the other repository.

The retired `https://www.zero-paperhub.com/products/haoo/` path and the four brochure
asset URLs beneath it are not retained; they return 404. That was a deliberate choice
recorded in the phase 04.2 split contract, not an oversight.
