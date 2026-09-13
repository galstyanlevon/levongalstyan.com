# Patient Notes — preview handoff

Canonical source: `feature/patient-notes-preview`, based on main `c167153a8389f3b8948d17bde9c085e204563075`. Do not merge without visual approval.

## Review

Run `node scripts/preview-patient-notes.mjs` and serve `dist` with any static web server. Open `review.html` to switch Desktop / Mobile (390px) and Armenian / English. Direct routes: `/hy/patients/notes/`, `/en/patients/notes/`; legacy `#/patients/notes` also works. The existing patient menu and a link below the clinic cards lead here.

GitHub Pages rejected deployment from this branch due to its environment protection rules before any job steps ran. Those rules and production have not been changed. The review is hosted as a separate private snapshot, not a replacement production site. Production deployments remain the existing main workflow.

## Data and moderation

`js/patient-notes-data.js` owns the registry and the preview flag. Entries use `id`, `language` (`hy`/`en`), `type` (`text`/`handwriting`), `image`, `text` (or image description), `year`, `displayName`, `published`, `sortOrder`; fixtures additionally have `demo: true`.

All fixtures are labelled demonstration content and `published: false`. Demo entries are visible only when preview mode is on. Outside preview, only non-demo entries with `published: true` can appear. No browser submission changes this registry. Approved items must be added manually after review and documented publication consent. Keep identity/consent records out of the public repository.

The preview flag is on. Finish preview sends nothing and clears the draft. Drafts and selected images remain in memory only; no local storage, messenger screenshots or patient identifiers are collected automatically.

## Submission service

The existing contact form uses FormSubmit with FormData, timeout and explicit success checks. Patient Notes follows that pattern in its inactive release adapter. FormSubmit documents native multipart attachments up to 10 MB: https://formsubmit.co/documentation#file-uploads . A real end-to-end inbox check is still required for attachment receipt through the AJAX endpoint before turning preview mode off. No test email was sent.

The smallest fallback, if AJAX attachments are not delivered, is the same provider's documented native multipart form POST with `attachment` and a return page. No new backend, package or service is required. Typed and photo submissions go to the existing clinic inbox for manual moderation; nothing publishes automatically.

Photo selection has separate file-library and camera controls after choosing Upload handwriting. JPEG, PNG and WebP up to 10 MB are accepted. HEIC is not decoded by this implementation; the interface asks for JPEG export. Re-encoding to JPEG removes EXIF/location and filenames, limits the long edge to 3000px, and preserves a full-size viewing path. Visible names, signatures and medical details must still be cropped/redacted before approval. Re-encoding is not anonymisation of visible content.

## Checks

Passed: static build; existing localized route/relative asset/FAQ alias checks; existing contact response checks. DOM interaction checks passed in AM and EN for isolated language, unified registry, single active card, image viewer/full-size toggle, two-choice initial sheet, empty-input validation, typed flow, anonymous default, name/initial choice, consent gate, literal rendering of markup, preview completion without network requests or publication, picker/camera attributes, invalid file rejection, hidden pending/demo entries outside preview.

CSS review: three desktop columns, two mobile columns (one below 341px), 75% content opacity, readable independent metadata, 3px active lift and subtle shadow, focus-visible outline, reduced-motion rule, roughly 25dvh initial mobile sheet with content-driven expansion and safe-area padding.

Not visually verified: actual desktop/mobile rendering, hover paint, native dialog scroll/keyboard behaviour, mobile camera/photo decoding and zoom gestures. The managed browser preview does not support this buildless static project. Use the private review to approve these before merge. No full-site audit was performed.

Additional upload-flow check: selecting an unsupported file while an earlier photo is processing no longer leaves Continue disabled. Both languages passed asynchronous replacement/stale-result checks and the complete photo → anonymous name → consent → review → preview completion flow, with decoding/canvas stubbed. This verifies form state and no transmission; it does not substitute for actual device image decoding or camera testing.

## Before release

1. Add approved real notes and sanitised photographs, with separate language content and documented consent.
2. Verify actual typed and attached-image delivery, including rejection/timeouts, then disable preview mode. Keep submitted data private and approve publication manually.
3. Approve AM/EN desktop and phone appearance in the preview, then merge through the established production workflow.
