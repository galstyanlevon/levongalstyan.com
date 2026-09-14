/* Approved public notes. Never turn a submitted draft into a published entry here.
 * Add assets to this registry only after publication consent and a privacy review.
 * language is the language of the approved public text/image, never auto-translated.
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

window.PATIENT_LINKS.en.push({ key: "notes", label: "Patient Notes" });
window.PATIENT_LINKS.hy.push({ key: "notes", label: "Բուժառուների խոսքերը" });
