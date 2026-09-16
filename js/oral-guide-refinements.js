/* Approved compact references and service copy for the oral-surgery patient guides. */
(function () {
  'use strict';

  window.CONTENT.en.dentalImplantsIntro = 'Dr. L. Galstyan uses digital 3D planning and guided implant surgery to restore missing teeth with precise, functional and natural-looking results. Treatment is individually planned, including for complex clinical cases.';
  window.CONTENT.hy.dentalImplantsIntro = 'Բժիշկ Լ. Գալստյանը կիրառում է թվային 3D պլանավորում և ուղղորդված իմպլանտային վիրաբուժություն՝ բացակայող ատամները ճշգրիտ, ֆունկցիոնալ և բնական տեսքով վերականգնելու համար։ Բուժումը պլանավորվում է անհատապես՝ ներառյալ բարդ կլինիկական դեպքերը։';

  var references = {
    'tooth-extraction': [
      { text: 'University College London Hospitals — Dental extractions: post-operative instructions', url: 'https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/dental-extractions-post-operative-instructions' }
    ],
    'impacted-tooth': [
      { text: 'American Association of Oral and Maxillofacial Surgeons — The Management of Impacted Third Molar Teeth, 2024', url: 'https://aaoms.org/wp-content/uploads/2024/07/impacted_third_molars.pdf' },
      { text: 'University College London Hospitals — Dental extractions: post-operative instructions', url: 'https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/dental-extractions-post-operative-instructions' }
    ],
    gbr: [
      { text: 'International Team for Implantology — Bone Augmentation Procedures in Extended Alveolar Ridge Defects', url: 'https://network.iti.org/academy/consensus-database/consensus-statement/-/consensus/bone-augmentation-procedures-in-extended-alveolar-ridge-defects/1211' },
      { text: 'International Team for Implantology — Computer-Guided Implant Surgery', url: 'https://academy.iti.org/academy/consensus-database/consensus-statement/-/consensus/computer-guided-implant-surgery/1213' }
    ],
    'sinus-lift': [
      { text: 'International Team for Implantology — Bone Augmentation Procedures in Extended Alveolar Ridge Defects', url: 'https://network.iti.org/academy/consensus-database/consensus-statement/-/consensus/bone-augmentation-procedures-in-extended-alveolar-ridge-defects/1211' },
      { text: 'Cambridge University Hospitals — Sinus lift procedures', url: 'https://www.cuh.nhs.uk/patient-information/sinus-lift-procedures/' }
    ],
    'dental-implantation': [
      { text: 'European Federation of Periodontology — S3 Clinical Practice Guideline: Prevention and Treatment of Peri-implant Diseases', url: 'https://www.efp.org/education/continuing-education/clinical-guidelines/guideline-on-treatment-of-peri-implant-diseases/' },
      { text: 'International Team for Implantology — Computer-Guided Implant Surgery', url: 'https://academy.iti.org/academy/consensus-database/consensus-statement/-/consensus/computer-guided-implant-surgery/1213' },
      { text: 'International Team for Implantology — Accuracy of Static Computer-Aided Implant Surgery', url: 'https://academy.iti.org/academy/consensus-database/consensus-statement/-/consensus/accuracy-of-static-computer-aided-implant-surgery/1820' }
    ]
  };

  function compactSources(guide, language) {
    guide[language].sections = guide[language].sections.filter(function (section) {
      return section.id !== 'evidence-base';
    });
    guide[language].sections.forEach(function (section) {
      var sourceHeading = language === 'hy' ? 'Աղբյուրներ' : 'Sources';
      var sourceIndex = section.blocks.findIndex(function (block) {
        return block.type === 'subheading' && (block.parts || []).map(function (part) { return part.text; }).join('') === sourceHeading;
      });
      if (sourceIndex >= 0) section.blocks = section.blocks.slice(0, sourceIndex);
    });
  }

  Object.keys(references).forEach(function (key) {
    var guide = window.PATIENT_GUIDES[key];
    compactSources(guide, 'en');
    compactSources(guide, 'hy');
    guide.references = references[key];
  });
})();
