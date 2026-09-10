/* Review fixtures only. Never turn a submitted draft into a published entry here.
 * Add approved, anonymised assets to this registry after documented consent.
 * language is the language of the approved public text/image, never auto-translated.
 */
window.PATIENT_NOTES_CONFIG = Object.freeze({ preview: true });
window.PATIENT_NOTES = ['hy', 'en'].flatMap(function (language) {
  var hy = language === 'hy';
  var copy = hy ? [
    'Ձեռագիր գրառման ցուցադրական տեղապահ։',
    'Այստեղ կտեղադրվի բուժառուի կարճ գրառումը՝ հրապարակման համաձայնությամբ։',
    'Սա ցուցադրական տեքստ է՝ ավելի ծավալուն գրառման տեսքը գնահատելու համար։ Իրական խոսքերը կավելացվեն հեղինակի համաձայնությամբ և նախնական ստուգումից հետո։',
    'Ձեռագիր գրառման ցուցադրական տեղապահ։',
    'Այստեղ կտեղադրվի մեկ այլ գրառում։ Հեղինակը կարող է ընտրել անանուն հրապարակումը։',
    'Ցուցադրական գրառում՝ առանց անձնական կամ բժշկական տվյալների։'
  ] : [
    'Demonstration placeholder for a handwritten note.',
    'A short patient note will appear here, with permission to publish.',
    'This is demonstration text to show how a longer note will read. The patient’s own words will be added with their consent and reviewed before publication.',
    'Demonstration placeholder for a handwritten note.',
    'Another note will appear here. Its author may choose to remain anonymous.',
    'A demonstration note, without personal or medical information.'
  ];
  return copy.map(function (text, i) {
    var handwritten = i === 0 || i === 3;
    return { id: 'demo-' + language + '-' + (i + 1), language: language,
      type: handwritten ? 'handwriting' : 'text',
      image: handwritten ? 'images/patient-notes/demo-' + language + '.svg' : null,
      text: text, year: i < 4 ? 2026 : 2025,
      displayName: i === 5 ? '' : (hy ? 'Անանուն' : 'Anonymous'),
      published: false, demo: true, sortOrder: i + 1 };
  });
});

window.PATIENT_LINKS.en.push({ key: "notes", label: "Patient Notes" });
window.PATIENT_LINKS.hy.push({ key: "notes", label: "Բուժառուների խոսքերը" });
