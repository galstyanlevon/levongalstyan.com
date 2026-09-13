/* Review fixtures and approved public notes. Never turn a submitted draft into a published entry here.
 * Add assets to this registry only after publication consent and a privacy review.
 * language is the language of the approved public text/image, never auto-translated.
 */
window.PATIENT_NOTES_CONFIG = Object.freeze({ preview: true });
window.PATIENT_NOTES = ['hy', 'en'].flatMap(function (language) {
  var hy = language === 'hy';
  var copy = hy ? [
    'Բուժառուի բնօրինակ ռուսերեն ձեռագիր գրառում։',
    'Այստեղ կտեղադրվի բուժառուի կարճ գրառումը՝ հրապարակման համաձայնությամբ։',
    'Սա երկար գրառման ցուցադրական տեքստ է՝ գնահատելու համար, թե ինչպես է ավելի ծավալուն պատմությունը երևում քարտի ներսում և ամբողջությամբ բացված պատուհանում։ Այն չի ներկայացնում իրական բուժառուի կարծիք կամ փորձառություն։ Իրական գրառումը կարող է պատմել բուժման տարբեր փուլերի, շփման, սպասումների և վերականգնման մասին՝ այնքան մանրամասն, որքան հեղինակը ցանկանա։ Հրապարակումից առաջ տեքստը կստուգվի, անձնական և չնախատեսված բժշկական տվյալները չեն ցուցադրվի, իսկ անունը կնշվի միայն հեղինակի ընտրած ձևով և նրա հստակ համաձայնությամբ։',
    'Ձեռագիր գրառման ցուցադրական տեղապահ։',
    'Այստեղ կտեղադրվի մեկ այլ գրառում։ Հեղինակը կարող է ընտրել անանուն հրապարակումը։',
    'Ցուցադրական գրառում՝ առանց անձնական կամ բժշկական տվյալների։'
  ] : [
    'Original handwritten patient note in Russian.',
    'A short patient note will appear here, with permission to publish.',
    'This is extended demonstration text created to show how a substantially longer note will appear inside the card and in the full reading view. It is not a real patient statement or account of treatment. A genuine note may describe several stages of care, communication, expectations and recovery in as much detail as its author wishes to share. Before publication, the text will be reviewed, unintended personal or medical details will not be displayed, and the author’s name will appear only in the format they selected and explicitly consented to publish.',
    'Demonstration placeholder for a handwritten note.',
    'Another note will appear here. Its author may choose to remain anonymous.',
    'A demonstration note, without personal or medical information.'
  ];
  return copy.map(function (text, i) {
    var handwritten = i === 0 || i === 3;
    var approvedSample = i === 0;
    return { id: approvedSample ? 'anzhella-sukiasyan-2015-' + language :
        'demo-' + language + '-' + (i + 1), language: language,
      type: handwritten ? 'handwriting' : 'text',
      image: approvedSample ? 'images/patient-notes/anzhella-sukiasyan-2015.jpg' :
        (handwritten ? 'images/patient-notes/demo-' + language + '.svg' : null),
      text: text, year: approvedSample ? 2015 : (i < 4 ? 2026 : 2025),
      displayName: approvedSample ? 'Анжелла Сукиасян' :
        (i === 5 ? '' : (hy ? 'Անանուն' : 'Anonymous')),
      published: approvedSample, demo: !approvedSample, sortOrder: i + 1 };
  });
});

window.PATIENT_LINKS.en.push({ key: "notes", label: "Patient Notes" });
window.PATIENT_LINKS.hy.push({ key: "notes", label: "Բուժառուների խոսքերը" });
