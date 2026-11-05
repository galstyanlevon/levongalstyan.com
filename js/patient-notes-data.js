/* Approved public notes. Never turn a submitted draft into a published entry here.
 * Add assets to this registry only after publication consent and a privacy review.
 * language is the page locale. Publish each approved original in both locales,
 * without translating its text/image unless separately approved.
 */
window.PATIENT_NOTES_CONFIG = Object.freeze({ preview: false, showPreviewNotice: false });
window.PATIENT_NOTES = ['hy', 'en'].map(function (language) {
  var hy = language === 'hy';
  return {
    id: 'anzhella-sukiasyan-2015-' + language,
    language: language,
    type: 'handwriting',
    image: 'images/patient-notes/anzhella-sukiasyan-2015.jpg',
    text: hy ? 'Բուժառուի բնօրինակ ռուսերեն ձեռագիր գրառում։' :
      'Original handwritten patient note in Russian.',
    year: 2015,
    displayName: 'Анжелла Сукиасян',
    published: true,
    demo: false,
    sortOrder: 1
  };
});

['hy', 'en'].forEach(function (language) {
window.PATIENT_NOTES.push({
  id: 'elizabeth-2026-' + language,
  language: language,
  type: 'handwriting',
  image: 'images/patient-notes/elizabeth-2026.jpg',
  text: language === 'hy' ? 'Բուժառուի բնօրինակ անգլերեն ձեռագիր գրառում։' :
    'Original handwritten patient note in English.',
  year: 2026,
  displayName: 'Elizabeth',
  published: true,
  demo: false,
  sortOrder: 2
});
});

['hy', 'en'].forEach(function (language) {
  window.PATIENT_NOTES.push({
    id: 'gabriella-2026-' + language,
    language: language,
    type: 'text',
    text: "Dear Dr. Galstyan,\n\nFor many, many years, I struggled with multiple breathing problems, believing that there was no solution.\n\nWith high hopes for a positive outcome, I underwent FESS surgery. Now, two months after the procedure, I can confidently say that you have restored not only my ability to breathe properly but also my quality of life.\n\nMy recovery has been unbelievably quick and smooth, something I honestly never expected.\n\nAfter more than 10 years of suffering, I can finally breathe, eat, sleep, and enjoy my everyday life again.\nThank you for giving me back my health, my comfort, and, most importantly, my life as I once knew it.\n\nI will always be grateful for what you have done for me!\n\n\nKind regards,\nGabriella Bernardi",
    year: 2026,
    displayName: 'Gabriella',
    published: true,
    demo: false,
    sortOrder: 3
  });
});

window.PATIENT_LINKS.en.push({ key: "notes", label: "Patient Notes" });
window.PATIENT_LINKS.hy.push({ key: "notes", label: "Բուժառուների խոսքերը" });
