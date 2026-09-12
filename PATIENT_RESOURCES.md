# Patient resources — review version

Accepted layout: append two linked sections after the existing service text. Each
uses the site's existing heading, divider and one-sentence paragraph. The whole
section is a native link. No arrows, coloured navigation band or separate buttons.
English links open English pages; Armenian links open Armenian pages. No Russian
website routes are introduced.

## Included

- Orthognathic service: patient guide and procedure-specific gallery links,
  followed by the existing contact form component. The parent service previously
  had no lower contact form. All original service copy is unchanged.
- Facial aesthetics and its five procedures: procedure-specific gallery links.
  Existing procedure contact forms and field definitions are unchanged.
- Orthognathic guide in English and Eastern Armenian, adapted from the author's
  `Orthognathic_Patient_Guide_RU_v0.1.docx`, version 2, dated 12 September 2026.
  The source language is working material only. The two adaptations are drafts.
- Direct static URLs, locale switching, guide contents navigation, responsive
  recovery table and a gallery renderer with an honest empty state.
- Draft resource pages have `noindex, nofollow` metadata.

## Before publication

1. Review both guide adaptations for clinical meaning and language, particularly
   recovery, elastic instructions and the five preoperative contacts.
2. Supply the selected, consented before/after pairs and their captions, follow-up
   intervals and alternative text. Galleries intentionally contain no cases yet.
3. Set each reviewed resource's `status` to `published` when it is ready. Keep the
   PR as a draft until the intended published links lead to complete material.

Implant and breathing surgery guides are the next content phase. Adding a guide to
`PATIENT_GUIDES` with its `service` index and both language versions automatically
adds its linked section and generated pages. Optional `sub` keys target individual
procedures. Do not point these links to unrelated general guides.

## Checks

Build: `node scripts/build.mjs`. Existing checks: `node scripts/test-share-pages.mjs`
and `node scripts/test-contact.mjs`. Browser check: install Playwright 1.58.2 and
Chromium, then run `node scripts/test-patient-resources.mjs`. It blocks external
requests, checks 1440px and 390px in both languages, and saves screenshots. No form
messages are sent. GitHub Actions runs the same checks and saves the built review
site as an artifact; it does not deploy or change the public site.
