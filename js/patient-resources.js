/* Patient resources. Orthognathic text adapted from the author's working guide,
 * Orthognathic_Patient_Guide_RU_v0.1.docx, version 2 (12 September 2026).
 * Translations and galleries remain drafts pending editorial review and selected photos.
 * Add future guides here when their content is ready; do not create dead service links.
 */
window.RESOURCE_LABELS = {
  en: {
    guide: 'Patient guide', guideBody: 'Click here to read the guide to preparation and recovery.',
    gallery: 'Before and after pictures', galleryBody: 'Click here to view photographs taken before and after surgery.',
    back: 'Back to the procedure', contents: 'In this guide', next: 'Next step',
    period: 'Period', expect: 'What to expect', diet: 'Eating and the next stage',
    before: 'Before', after: 'After',
    emptyGallery: 'No before and after photographs are available for this procedure yet.',
    missing: 'This patient resource is not available.',
    bibliography: 'Further reading',
    author: 'Levon Galstyan, DMD, MD, DDS · Oral and Maxillofacial Surgeon'
  },
  hy: {
    guide: 'Պացիենտի ուղեցույց', guideBody: 'Սեղմեք այստեղ՝ նախապատրաստման և վերականգնման մասին ուղեցույցը կարդալու համար։',
    gallery: 'Լուսանկարներ՝ միջամտությունից առաջ և հետո', galleryBody: 'Սեղմեք այստեղ՝ միջամտությունից առաջ և հետո արված լուսանկարները դիտելու համար։',
    back: 'Վերադառնալ միջամտության էջին', contents: 'Այս ուղեցույցում', next: 'Հաջորդ քայլը',
    period: 'Ժամանակահատված', expect: 'Ինչ սպասել', diet: 'Սնուցումը և հաջորդ փուլը',
    before: 'Մինչև', after: 'Հետո',
    emptyGallery: 'Այս միջամտության՝ մինչև և հետո արված լուսանկարները դեռ հասանելի չեն։',
    missing: 'Այս նյութը հասանելի չէ։',
    bibliography: 'Գրականություն',
    author: 'Լևոն Գալստյան, DMD, MD, DDS · Դիմածնոտային վիրաբույժ'
  }
};

window.PATIENT_GUIDES = {
  orthognathic: {
    service: 3,
    status: 'draft',
    reviewedDate: null,
    en: {
      title: 'Orthognathic surgery',
      subtitle: 'Your guide from the first consultation to recovery',
      intro: [
        'I want you to understand what is happening at each stage and why the next step matters. You can read this guide gradually: first about preparation, then about planning and recovery. We can discuss questions that arise at our next contact.',
        'Le Fort I changes the position of the upper jaw; BSSO changes the position of the lower jaw. Chin surgery, or genioplasty, may be planned separately if needed. This guide describes treatment with orthodontic preparation before surgery.'
      ],
      route: 'Shared goals → preparing the teeth → checking readiness → 3D planning and surgery → recovery and completion of orthodontics.',
      contacts: 'Five planned contacts with the surgeon take place before surgery. Discussions can be held online; examinations, scanning and splint checks require attendance in person. Further contacts are added if needed. Postoperative reviews are arranged separately.',
      sections: [
        { id: 'first-contact', title: 'Contact 1 · Getting to know you and your goals', paragraphs: ['We discuss your symptoms, expectations, health and previous treatment. We assess your face, smile and bite, and review the options, limitations and main risks. The first discussion may take place online; the clinical examination is carried out in person.'], next: 'Gather the requested investigations. Bring existing scans and details of your treatment so that the team can identify anything still needed.' },
        { id: 'shared-plan', title: 'Contact 2 · A shared plan before orthodontics', paragraphs: ['We take photographs of your face and teeth, scan the dental arches or take impressions for models, and record your bite. X-rays, including CBCT, are requested according to the clinical task. The surgeon and orthodontist agree on the provisional scope of surgery and preparation of the teeth. Results can be discussed remotely.'], next: 'Begin orthodontics according to the agreed plan. You will understand the intended positions of the teeth and jaws; the final movements are refined after preparation.' },
        { id: 'orthodontic-preparation', title: 'Between contacts · Orthodontic preparation', paragraphs: ['Your orthodontist monitors tooth movement and agrees with the surgeon on changes that affect surgery. Your bite can temporarily look worse as tooth inclinations that partly masked the jaw discrepancy are corrected. We discuss these expected changes beforehand. If preparation departs from the plan, the team revises it together with you.'] },
        { id: 'readiness', title: 'Contact 3 · Checking readiness after orthodontics', paragraphs: ['As preparation nears completion, we update photographs, scans or dental models and the bite record. The team decides whether further X-rays are needed. At an in-person examination, the surgeon and orthodontist check whether the dental arches will fit together in the planned jaw positions.'], next: 'If readiness is confirmed, proceed to final planning. If further tooth movements are needed, we explain their purpose and arrange another check. The operation date is coordinated with readiness.' },
        { id: 'updated-records', title: 'Why new scans and models are needed', paragraphs: ['Initial models help define the direction of treatment. Preoperative models show the position of the teeth after orthodontics. Digital planning combines CBCT data with precise dental arch models: CBCT alone does not reproduce tooth contacts with sufficient accuracy.'] },
        { id: 'three-dimensional-plan', title: 'Contact 4 · Your three-dimensional plan', paragraphs: ['I prepare the plan and send you a three-dimensional visualisation with explanations. You can study it at your own pace and write down questions. We then discuss jaw position, your bite, changes to your face and whether genioplasty is needed, online or in person. The planned bite is agreed with your orthodontist; the prediction of soft tissue changes remains approximate.'], next: 'Discuss anything that is unclear and agree on the final plan. The team then prepares the devices needed to transfer the plan to surgery.' },
        { id: 'final-check', title: 'Contact 5 · The final check', paragraphs: ['Individual surgical splints are made from the agreed plan. These fit over your teeth and help position the jaws as planned. We check their fit and correspondence with the plan. Your orthodontist prepares the appliances, and the anaesthetist assesses your readiness for anaesthesia. We review the scope of surgery, risks, consent and recovery again.', 'Coordination before surgery: after the final scan, any tooth movements or changes to appliances must be agreed between the specialists so that the splints match the actual position of the teeth.'], next: 'Follow your individual instructions, confirm your admission time and arrange support after discharge. You should have instructions about fasting, medicines and contacting the team.' },
        { id: 'operation', title: 'Surgery and the first days', paragraphs: ['In hospital, we monitor breathing, healing, your bite and your ability to drink and eat. Before discharge, we explain care and your elastic band regimen, and arrange the next review. Ask us to repeat or demonstrate anything that is unclear. We can also discuss the instructions with the person who will be helping you.'] },
        { id: 'recovery', title: 'Recovery, step by step', paragraphs: ['Your general wellbeing, swelling, mouth opening and bone healing progress at different rates. The following are guide points for uncomplicated recovery. We adjust food and activity after examination; your individual instructions take priority.'], rows: [
          ['First 1–3 days', 'Swelling usually increases and mouth opening is limited. Nasal congestion and tiredness can occur.', 'Start drinking and eating when the team permits. Initially, take liquids or smooth food that requires no chewing.'],
          ['First week', 'Swelling gradually begins to settle. Early review checks healing, your bite, nutrition and elastics.', 'Food that needs no chewing, in small, frequent meals. Adequate fluids, energy and protein are important.'],
          ['Weeks 2–3', 'Most swelling has usually reduced noticeably, although some puffiness is still expected.', 'With permission, progress to food that is easily mashed with a fork. This may be later, depending on healing and your elastic regimen.'],
          ['Weeks 3–6', 'Mouth opening and chewing muscle endurance gradually improve. Feeling well does not yet mean that bone healing is complete.', 'Continue a soft diet. Your surgeon decides when gentle chewing is allowed. Avoid hard and chewy food for now.'],
          ['Around weeks 6–8 and beyond', 'At review, we assess whether loading can increase and coordinate further orthodontic treatment.', 'Gradually return towards your usual diet after your surgeon gives permission. Ordinary and hard foods may be reintroduced at different times.'],
          ['Following months', 'Residual swelling may take several months to settle. Lip and chin sensation recovers separately and sometimes not completely.', 'Bite refinement and follow-up continue. We assess the final result after the tissues have recovered.']
        ] },
        { id: 'elastics', title: 'When can the elastic bands be removed?', paragraphs: ['Elastics guide and support your bite. At reviews, the surgeon and orthodontist agree on their strength, placement and wearing time. Temporary removal for meals or hygiene and stopping them altogether are different decisions. Do not change the regimen yourself; lighter elastics may still be needed during orthodontics.', 'You will receive a clear placement diagram and instructions on whether removal is allowed, how to replace elastics and what to do if one breaks. Contact the team if your bite changes suddenly.'] },
        { id: 'daily-life', title: 'Returning to daily life', paragraphs: ['At each review, we clarify what is now permitted, what remains restricted and when the next check is due. If recovery differs from what is expected, the team assesses the cause and adjusts the advice.', 'Follow your oral hygiene instructions even if mouth opening is limited. Begin jaw exercises at the prescribed time, without forcing movement. After upper jaw surgery, follow nasal care instructions and do not blow your nose until your surgeon permits it.', 'Returning to work depends on how you feel and the demands of speaking and physical activity. Exercise and activities that risk a blow to the face are discussed separately. We agree beforehand on the period of abstinence from smoking and nicotine.'] },
        { id: 'continuing-care', title: 'How coordinated treatment continues', paragraphs: ['The surgeon assesses healing and authorises changes to diet and activity. The orthodontist refines tooth contacts after active treatment resumes by agreement. The specialists coordinate the elastic regimen so that you have one current set of instructions.', 'After orthodontics, retainers help maintain tooth position. Subsequent reviews assess bite stability, function and sensation.'] },
        { id: 'earlier-review', title: 'When to seek help before your scheduled review', paragraphs: ['Immediately: seek emergency help for severe difficulty breathing or heavy, continuing bleeding. Do not wait for a reply to a message.', 'Contact the team the same day for increasing pain or swelling after improvement, fever with worsening general wellbeing, pus, a sudden change in your bite, repeated vomiting or inability to drink.', 'Give the operation date, the symptom and when it started, your temperature and whether you can drink. Use the team contact provided at discharge. The website form is not intended for emergencies.'] },
        { id: 'discharge', title: 'Your reference points after discharge', paragraphs: ['Keep a record of your next review and the specialist you will see; the team contact for routine and urgent concerns; permitted food and the date for reassessment; your elastic placement and removal instructions; and questions for your next contact.'] }
      ]
    },
    hy: {
      title: 'Օրթոգնաթիկ վիրաբուժություն',
      subtitle: 'Պացիենտի ուղեցույց՝ առաջին խորհրդատվությունից մինչև վերականգնում',
      intro: [
        'Ցանկանում եմ, որ յուրաքանչյուր փուլում հասկանաք՝ ինչ է կատարվում և ինչու է անհրաժեշտ հաջորդ քայլը։ Այս ուղեցույցը կարող եք կարդալ աստիճանաբար՝ սկզբում նախապատրաստման, ապա պլանավորման և վերականգնման մասին։ Ընթացքում առաջացած հարցերը կքննարկենք հաջորդ հանդիպման կամ զրույցի ժամանակ։',
        'Le Fort I վիրահատությունը փոխում է վերին ծնոտի, իսկ BSSO-ն՝ ստորին ծնոտի դիրքը։ Անհրաժեշտության դեպքում առանձին պլանավորվում է կզակի շտկումը՝ գենիոպլաստիկան։ Այստեղ նկարագրված է բուժման ուղին՝ վիրահատությունից առաջ օրթոդոնտիկ նախապատրաստմամբ։'
      ],
      route: 'Ընդհանուր նպատակներ → ատամների նախապատրաստում → պատրաստվածության ստուգում → 3D պլան և վիրահատություն → վերականգնում և օրթոդոնտիկ բուժման ավարտ։',
      contacts: 'Վիրահատությունից առաջ նախատեսված է հինգ պլանային հանդիպում կամ քննարկում վիրաբույժի հետ։ Քննարկումները կարող են անցկացվել առցանց, իսկ զննումը, սկանավորումը և սպլինտների ստուգումը պահանջում են անձամբ ներկայանալ։ Անհրաժեշտության դեպքում ավելացվում են հանդիպումներ։ Հետվիրահատական զննումները նշանակվում են առանձին։',
      sections: [
        { id: 'first-contact', title: 'Հանդիպում 1 · Ծանոթություն և նպատակներ', paragraphs: ['Քննարկում ենք ձեր գանգատները, սպասումները, առողջական վիճակը և նախկին բուժումները։ Գնահատում ենք դեմքը, ժպիտը և կծվածքը, ներկայացնում տարբերակները, սահմանափակումներն ու հիմնական ռիսկերը։ Առաջին քննարկումը կարող է լինել առցանց, իսկ կլինիկական զննումը կատարվում է առկա ձևաչափով։'], next: 'Հավաքել նշանակված հետազոտությունների արդյունքները։ Բերեք առկա նկարներն ու բուժման մասին տեղեկությունները, որպեսզի թիմը որոշի՝ ինչն է պակասում։' },
        { id: 'shared-plan', title: 'Հանդիպում 2 · Ընդհանուր պլան՝ օրթոդոնտիկ բուժումից առաջ', paragraphs: ['Կատարում ենք դեմքի և ատամների լուսանկարահանում, ատամնաշարերի սկանավորում կամ դրոշմահանում՝ մոդելների համար, գրանցում կծվածքը։ Ռենտգենաբանական հետազոտությունները, ներառյալ ԿՃՀՏ-ն, նշանակվում են ըստ կլինիկական խնդրի։ Վիրաբույժը և օրթոդոնտը համաձայնեցնում են վիրահատության նախնական ծավալը և ատամների նախապատրաստումը։ Արդյունքները կարելի է քննարկել հեռավար։'], next: 'Սկսել օրթոդոնտիկ բուժումը համաձայնեցված պլանով։ Դուք գիտեք՝ ատամների և ծնոտների ինչ դիրքի ենք ձգտում, իսկ վերջնական տեղաշարժերը ճշտվում են նախապատրաստումից հետո։' },
        { id: 'orthodontic-preparation', title: 'Հանդիպումների միջև · Օրթոդոնտիկ նախապատրաստում', paragraphs: ['Օրթոդոնտը վերահսկում է ատամների տեղաշարժը և վիրաբույժի հետ համաձայնեցնում վիրահատության վրա ազդող փոփոխությունները։ Կծվածքը երբեմն ժամանակավորապես կարող է ավելի վատ տեսք ունենալ. ուղղվում են ատամների այն թեքությունները, որոնք մասամբ քողարկում էին ծնոտների անհամապատասխանությունը։ Սպասվող փոփոխությունները քննարկում ենք նախապես։ Եթե նախապատրաստումը շեղվում է պլանից, թիմը ձեզ հետ միասին ճշտում է այն։'] },
        { id: 'readiness', title: 'Հանդիպում 3 · Ստուգում օրթոդոնտիկ նախապատրաստումից հետո', paragraphs: ['Երբ նախապատրաստումը մոտենում է ավարտին, թարմացնում ենք լուսանկարները, ատամների սկաները կամ մոդելները և կծվածքի գրանցումը։ Նոր ռենտգեն նկարների անհրաժեշտությունը որոշում է թիմը։ Առկա զննման ժամանակ վիրաբույժը և օրթոդոնտը ստուգում են՝ արդյոք ատամնաշարերը կկարողանան ճիշտ հպվել ծնոտների պլանավորված դիրքում։'], next: 'Հաստատված պատրաստվածության դեպքում անցնել վերջնական պլանավորմանը։ Եթե անհրաժեշտ են ատամների լրացուցիչ տեղաշարժեր, բացատրում ենք դրանց նպատակը և նշանակում կրկնակի ստուգում։ Վիրահատության օրը համաձայնեցվում է պատրաստվածության հետ։' },
        { id: 'updated-records', title: 'Ինչու են անհրաժեշտ նոր սկաներ և մոդելներ', paragraphs: ['Սկզբնական մոդելներն օգնում են ընտրել բուժման ուղղությունը։ Նախավիրահատական մոդելներն արտացոլում են ատամների դիրքը օրթոդոնտիկ բուժումից հետո։ Թվային պլանավորման համար ԿՃՀՏ տվյալները համադրվում են ատամնաշարերի ճշգրիտ մոդելների հետ. միայն ԿՃՀՏ-ն ատամների հպումները չի վերարտադրում անհրաժեշտ ճշգրտությամբ։'] },
        { id: 'three-dimensional-plan', title: 'Հանդիպում 4 · Ձեր եռաչափ պլանը', paragraphs: ['Ես պատրաստում եմ պլանը և ձեզ ուղարկում եռաչափ պատկերումը՝ բացատրություններով։ Կարող եք այն հանգիստ ուսումնասիրել և գրի առնել հարցերը։ Այնուհետև առցանց կամ առկա ձևաչափով քննարկում ենք ծնոտների դիրքը, կծվածքը, դեմքի փոփոխությունները և գենիոպլաստիկայի անհրաժեշտությունը։ Պլանավորված կծվածքը համաձայնեցվում է օրթոդոնտի հետ, իսկ փափուկ հյուսվածքների փոփոխությունների կանխատեսումը մնում է մոտավոր։'], next: 'Քննարկել անհասկանալի պահերը և համաձայնեցնել վերջնական պլանը։ Դրանից հետո թիմը պատրաստում է պլանը վիրահատության ընթացքում իրականացնելու համար անհրաժեշտ հարմարանքները։' },
        { id: 'final-check', title: 'Հանդիպում 5 · Վերջնական ստուգում', paragraphs: ['Հաստատված պլանի հիման վրա պատրաստվում են անհատական վիրաբուժական սպլինտներ՝ ատամների վրա տեղադրվող հարմարանքներ, որոնք օգնում են ծնոտները բերել նախատեսված դիրքին։ Ստուգում ենք դրանց նստեցումը և համապատասխանությունը պլանին։ Օրթոդոնտը պատրաստում է ապարատները, անեսթեզիոլոգը գնահատում է ընդհանուր անզգայացման պատրաստվածությունը։ Կրկին քննարկում ենք վիրահատության ծավալը, ռիսկերը, համաձայնությունը և վերականգնումը։', 'Համաձայնեցում վիրահատությունից առաջ. վերջնական սկանավորումից հետո ատամների տեղաշարժերն ու ապարատների փոփոխությունները համաձայնեցվում են մասնագետների միջև, որպեսզի սպլինտները համապատասխանեն ատամների փաստացի դիրքին։'], next: 'Կատարել անհատական նշանակումները, ճշտել հոսպիտալացման ժամը և կազմակերպել օգնությունը դուրսգրումից հետո։ Դուք պետք է ունենաք սննդից և հեղուկներից զերծ մնալու, դեղերի ընդունման և թիմի հետ կապի ցուցումները։' },
        { id: 'operation', title: 'Վիրահատությունը և առաջին օրերը', paragraphs: ['Հիվանդանոցում վերահսկում ենք շնչառությունը, ապաքինումը, կծվածքը և խմելու ու սնվելու հնարավորությունը։ Դուրսգրումից առաջ բացատրում ենք խնամքը, էլաստիկների կրման սխեման և նշանակում հաջորդ զննումը։ Խնդրեք կրկնել կամ ցույց տալ այն, ինչ դեռ պարզ չէ։ Ցուցումները կարող ենք քննարկել նաև այն մարդու հետ, ով ձեզ օգնելու է։'] },
        { id: 'recovery', title: 'Վերականգնում՝ քայլ առ քայլ', paragraphs: ['Ինքնազգացողությունը, այտուցը, բերանի բացումը և ոսկրային ապաքինումը փոխվում են տարբեր արագությամբ։ Ստորև բերված են ուղենիշներ՝ առանց բարդությունների վերականգնման համար։ Սնունդն ու ծանրաբեռնվածությունն ընդլայնում ենք զննման արդյունքներով. ձեր անհատական նշանակումները առաջնային են։'], rows: [
          ['Առաջին 1–3 օրը', 'Այտուցը սովորաբար ավելանում է, բերանի բացումը սահմանափակ է։ Հնարավոր են քթի փակվածություն և հոգնածություն։', 'Խմել և ուտել սկսում եք թիմի թույլտվությունից հետո։ Սկզբում՝ հեղուկ կամ համասեռ սնունդ՝ առանց ծամելու։'],
          ['Առաջին շաբաթը', 'Այտուցն աստիճանաբար սկսում է նվազել։ Վաղ զննման ժամանակ գնահատում ենք ապաքինումը, կծվածքը, սնուցումը և էլաստիկները։', 'Չծամվող սնունդ՝ փոքր չափաբաժիններով և հաճախ։ Կարևոր է ստանալ բավարար հեղուկ, էներգիա և սպիտակուց։'],
          ['2–3 շաբաթ', 'Հիմնական այտուցը սովորաբար նկատելիորեն նվազում է, սակայն որոշ այտուցվածություն դեռ սպասելի է։', 'Թույլտվությամբ՝ պատառաքաղով հեշտ տրորվող սնունդ։ Անցումը կարող է ավելի ուշ լինել՝ կախված ապաքինումից և էլաստիկների սխեմայից։'],
          ['3–6 շաբաթ', 'Բերանի բացումը և ծամիչ մկանների դիմացկունությունն աստիճանաբար բարելավվում են։ Լավ ինքնազգացողությունը դեռ չի նշանակում ոսկրի լիարժեք ապաքինում։', 'Պահպանվում է փափուկ սննդակարգը։ Թեթև ծամելու թույլատրելիությունը որոշում է վիրաբույժը։ Կոշտ և դժվար ծամվող սնունդը դեռ բացառվում է։'],
          ['Մոտ 6–8 շաբաթից և հետագայում', 'Զննման ժամանակ գնահատում ենք ծանրաբեռնվածությունն ավելացնելու հնարավորությունը և համաձայնեցնում հետագա օրթոդոնտիկ բուժումը։', 'Սովորական սննդակարգին վերադառնում ենք աստիճանաբար՝ վիրաբույժի թույլտվությունից հետո։ Սովորական և կոշտ սնունդը կարող են վերադառնալ տարբեր ժամկետներում։'],
          ['Հետագա ամիսները', 'Մնացորդային այտուցը կարող է պահպանվել մի քանի ամիս։ Շրթունքների և կզակի զգացողությունը վերականգնվում է առանձին և երբեմն՝ ոչ ամբողջությամբ։', 'Շարունակվում են ատամների հպումների շտկումը և հսկողությունը։ Վերջնական արդյունքը գնահատում ենք հյուսվածքների վերականգնումից հետո։']
        ] },
        { id: 'elastics', title: 'Երբ կարելի է հանել էլաստիկները', paragraphs: ['Էլաստիկներն ուղղորդում և պահպանում են կծվածքը։ Զննումների ժամանակ վիրաբույժը և օրթոդոնտը համաձայնեցնում են դրանց ուժը, տեղադրությունը և կրման տևողությունը։ Սնվելու կամ հիգիենայի համար ժամանակավոր հանումը և ամբողջությամբ դադարեցնելը տարբեր որոշումներ են։ Ինքնուրույն մի փոխեք սխեման. ավելի թույլ էլաստիկներ կարող են անհրաժեշտ լինել նաև օրթոդոնտիկ փուլում։', 'Դուք կստանաք տեղադրության հստակ սխեմա և ցուցումներ՝ կարելի՞ է դրանք հանել, ինչպես փոխարինել և ինչ անել պատռվելու դեպքում։ Կծվածքի հանկարծակի փոփոխության դեպքում կապվեք թիմի հետ։'] },
        { id: 'daily-life', title: 'Վերադարձ առօրյա կյանքին', paragraphs: ['Յուրաքանչյուր զննման ժամանակ ճշտում ենք՝ ինչն է արդեն թույլատրված, ինչը դեռ սահմանափակված է և երբ է հաջորդ ստուգումը։ Սպասվող վերականգնումից շեղումների դեպքում թիմը գնահատում է պատճառը և ճշգրտում խորհուրդները։', 'Պահպանեք հիգիենան ըստ տրված ցուցումների, նույնիսկ եթե բերանի բացումը սահմանափակ է։ Ծնոտի վարժությունները սկսեք նշանակված ժամկետում՝ առանց շարժումները հարկադրելու։ Վերին ծնոտի վիրահատությունից հետո հետևեք քթի խնամքի ցուցումներին և մի փչեք քիթը մինչև վիրաբույժի թույլտվությունը։', 'Աշխատանքի վերադառնալու ժամկետը կախված է ինքնազգացողությունից, խոսքային և ֆիզիկական ծանրաբեռնվածությունից։ Մարզումները և դեմքին հարվածի վտանգ ունեցող զբաղմունքները համաձայնեցվում են առանձին։ Ծխելուց և նիկոտինից հրաժարվելու ժամանակահատվածը քննարկում ենք նախապես։'] },
        { id: 'continuing-care', title: 'Ինչպես է շարունակվում համատեղ բուժումը', paragraphs: ['Վիրաբույժը գնահատում է ապաքինումը և թույլատրում սննդի ու ծանրաբեռնվածության փոփոխությունները։ Ակտիվ բուժման համաձայնեցված վերսկսումից հետո օրթոդոնտը կատարելագործում է ատամների հպումները։ Մասնագետներն էլաստիկների սխեման համաձայնեցնում են միմյանց հետ, որպեսզի դուք ունենաք մեկ արդիական հրահանգ։', 'Օրթոդոնտիկ բուժման ավարտից հետո ռետեյներներն օգնում են պահպանել ատամների դիրքը։ Հետագա զննումներին գնահատում ենք կծվածքի կայունությունը, ֆունկցիան և զգացողությունը։'] },
        { id: 'earlier-review', title: 'Երբ դիմել մինչև նշանակված զննումը', paragraphs: ['Անմիջապես. արտահայտված շնչառական դժվարության կամ ուժեղ, շարունակվող արյունահոսության դեպքում դիմեք շտապ օգնության՝ չսպասելով հաղորդագրության պատասխանին։', 'Նույն օրը կապվել թիմի հետ. բարելավումից հետո ցավի կամ այտուցի ուժեղացման, ջերմության՝ ինքնազգացողության վատացման հետ, թարախային արտադրության, կծվածքի հանկարծակի փոփոխության, կրկնվող փսխման կամ խմելու անհնարինության դեպքում։', 'Հայտնեք վիրահատության օրը, ախտանիշը և դրա առաջացման ժամանակը, ջերմությունը և խմելու հնարավորությունը։ Օգտագործեք դուրսգրման ժամանակ տրված թիմի կոնտակտը։ Կայքի ձևը նախատեսված չէ շտապ կապի համար։'] },
        { id: 'discharge', title: 'Ձեր ուղենիշները դուրսգրումից հետո', paragraphs: ['Գրի առեք հաջորդ զննման օրը և մասնագետին, թիմի կոնտակտը՝ սովորական ու շտապ հարցերի համար, թույլատրված սնունդը և վերանայման օրը, էլաստիկների սխեման ու հանելու պայմանները, ինչպես նաև հաջորդ հանդիպման հարցերը։'] }
      ]
    },
    sources: [
      'Naini FB, Gill DS. Orthognathic Surgery: Principles, Planning and Practice. pp. 109–115, 258–261, 337–338.',
      'Ayoub A et al. Handbook of Orthognathic Treatment. pp. 51–79.',
      'Swennen GRJ. 3D Virtual Treatment Planning of Orthognathic Surgery. Chapters 1 and 4.'
    ]
  }
};

/* Add only selected before/after pairs with publication consent.
 * Each case: { before, after, en: { caption, beforeAlt, afterAlt }, hy: {...} }.
 */
window.PATIENT_GALLERIES = {
  orthognathic: { service: 3, status: 'draft', cases: [] },
  'facial-aesthetics': { service: 0, status: 'draft', cases: [] },
  rhinoplasty: { sub: 'rhinoplasty', service: 0, status: 'draft', cases: [] },
  blepharoplasty: { sub: 'blepharoplasty', service: 0, status: 'draft', cases: [] },
  browlift: { sub: 'browlift', service: 0, status: 'draft', cases: [] },
  ottoplasty: { sub: 'ottoplasty', service: 0, status: 'draft', cases: [] },
  cheiloplasty: { sub: 'cheiloplasty', service: 0, status: 'draft', cases: [] }
};
