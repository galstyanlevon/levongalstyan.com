# Patient resources

Accepted layout: append patient-resource sections after the existing service text.
Each uses the site's existing heading, divider and one-sentence paragraph. The
heading remains plain text; the complete explanatory sentence is the native link.
No arrows, coloured navigation band or separate buttons. English links open
English pages; Armenian links open Armenian pages. No Russian routes are introduced.

Only resources with `status: 'published'` are exposed. Galleries additionally
require at least one consented before/after pair in the current language. Draft
and empty destinations are neither linked nor generated as public share pages.

## Included

- Orthognathic service: the published patient guide link, followed by the existing
  contact form component. The parent service previously
  had no lower contact form. All original service copy is unchanged.
- Facial aesthetics and its five procedures: gallery slots are registered but
  remain hidden until approved pairs are published. Existing contact forms and
  field definitions are unchanged.
- Published orthognathic guide from the final `Orthognathic_Patient_Guide_AM_v1.0.docx`
  and `Orthognathic_Patient_Guide_EN_v1.0.docx` files. The text and hierarchy are
  preserved. A closing References section lists compact source titles only for
  sources whose content and locators were checked against the patient guide.
- The guide is presented as a white paper sheet with a thin mid-grey perimeter,
  square corners and a restrained shadow on a neutral grey field. It ends with the
  patient's reference points after discharge as a compact bullet list and has no additional contact form.
  The guide follows a linear reading flow without a separate contents block.
- Direct static URLs, locale switching, responsive recovery table and a gallery
  renderer. The published guide is indexed; draft resources have no public route.
- Published septoplasty guide on the nasal breathing service and published FESS
  and nasal polyps guide on the endoscopic sinus surgery service. Both preserve
  the approved Armenian and British English clinical content while presenting it
  as structured sections, lists, tables, highlighted instructions and timelines.
  The FESS guide includes the approved postoperative irrigation video.

## Gallery completion

1. Supply the selected, consented before/after pairs and their captions, follow-up
   intervals and alternative text. Galleries intentionally contain no cases yet.
2. Set each reviewed gallery's `status` to `published` when it is ready.

- Five published oral-surgery guides: simple extraction, impacted tooth removal,
  guided bone regeneration, sinus lift and dental implantation. Service and
  procedure pages use the standard Patient Guideline link. Postoperative FAQ
  entries open a short linked answer and preserve the existing accordion.
- Adding a guide to `PATIENT_GUIDES` with its `service` index and both language
  versions automatically adds its linked section and generated pages. Optional
  `sub` keys target individual procedures. Do not point these links to unrelated
  general guides.

## Checks

Build: `node scripts/build.mjs`. Existing checks: `node scripts/test-share-pages.mjs`
and `node scripts/test-contact.mjs`. Browser check: install Playwright 1.58.2 and
Chromium, then run `node scripts/test-patient-resources.mjs`. It blocks external
requests, checks 1440px and 390px in both languages, and saves screenshots. No form
messages are sent. GitHub Actions runs the same checks and saves the built review
site as an artifact before changes are merged to the public site.
