# Patient Notes — implementation handoff

Canonical source: `main`. The approved section is published through the existing GitHub Pages workflow.

## Local review

Run `node scripts/preview-patient-notes.mjs` and serve `dist` with any static web server. Open `review.html` to switch Desktop / Mobile (390px) and Armenian / English. Public routes: `/hy/patients/notes/`, `/en/patients/notes/`; legacy `#/patients/notes` also works. The existing patient menu and a link below the clinic cards lead here.

## Data and moderation

`js/patient-notes-data.js` owns the registry and the contribution-form release flag. Entries use `id`, `language` (`hy`/`en`), `type` (`text`/`handwriting`), `image`, `text` (or image description), `year`, `displayName`, `published` and `sortOrder`.

The visible registry contains only the approved 2015 handwritten note; the earlier demonstration cards and assets were removed. The same original note is available through the separate Armenian and English page states with localised image descriptions. No browser submission changes this registry. Approved items must be added manually after review and documented publication consent. Keep identity/consent records out of the public repository.

The contribution form is active. It sends a typed note or processed handwritten image to the existing clinic inbox for moderation and shows the confirmation state only after FormSubmit returns success. Drafts and selected images remain in memory only; no local storage is used and no submission changes the public registry automatically.

## Submission service

The existing contact form uses FormSubmit with FormData, timeout and explicit success checks. Patient Notes follows the same active pattern. FormSubmit documents native multipart attachments up to 10 MB: https://formsubmit.co/documentation#file-uploads .

The smallest fallback, if AJAX attachments are not delivered, is the same provider's documented native multipart form POST with `attachment` and a return page. No new backend, package or service is required. Typed and photo submissions go to the existing clinic inbox for manual moderation; nothing publishes automatically.

Photo selection has separate file-library and camera controls after choosing Upload handwriting. JPEG, PNG and WebP up to 10 MB are accepted. HEIC is not decoded by this implementation; the interface asks for JPEG export. Re-encoding to JPEG removes EXIF/location and filenames, limits the long edge to 3000px, and preserves a full-size viewing path. Visible names, signatures and medical details must still be cropped/redacted before approval. Re-encoding is not anonymisation of visible content.

## Checks

Passed: static build; existing localized route/relative asset/FAQ alias checks; existing contact response checks. DOM interaction checks passed in AM and EN for isolated language, unified registry, single active card, image viewer/full-size toggle, two-choice initial sheet, empty-input validation, typed flow, anonymous default, name/initial choice, consent gate, literal rendering of markup, success/error handling with a stubbed service response, picker/camera attributes, invalid file rejection and moderation-only submission.

CSS review: responsive service-style desktop grid, one mobile column, 75% content opacity, readable independent metadata, 3px active lift and subtle shadow, focus-visible outline, reduced-motion rule, roughly 25dvh initial mobile sheet with content-driven expansion and safe-area padding.

Not verified from this environment: receipt of the first live FormSubmit email and its attachment. Confirm this from the clinic inbox after the first technical or real submission.

Additional upload-flow check: selecting an unsupported file while an earlier photo is processing no longer leaves Continue disabled. Both languages passed asynchronous replacement/stale-result checks and the complete photo → anonymous name → consent → review → success-confirmation flow, with decoding/canvas and the service response stubbed. This verifies form state; it does not substitute for actual inbox attachment receipt or device camera testing.

## Ongoing moderation

1. Review each received note and image for publication consent, unintended identifiers and medical details.
2. Add only approved notes to the public registry; receiving a submission never publishes it automatically.
3. Retain consent records outside the public repository.
