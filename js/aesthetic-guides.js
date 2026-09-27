/* Reviewed patient guides for the five facial aesthetic procedures.
 * Clinical source texts: audited Russian editions, 27 September 2026.
 * Each paragraph starts with a short topic label, as on the established guides.
 */
(function () {
  'use strict';
  var data = {
    rhinoplasty: {
      sub: 'rhinoplasty',
      references: [
        ['Mayo Clinic — Rhinoplasty', 'https://www.mayoclinic.org/tests-procedures/rhinoplasty/about/pac-20384532'],
        ['AAO-HNSF — Rhinoplasty Guideline and Patient Handouts', 'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/improving-nasal-form-and-function-after-rhinoplasty/'],
        ['ASPS — Rhinoplasty Recovery', 'https://www.plasticsurgery.org/cosmetic-procedures/rhinoplasty/recovery'],
        ['Cambridge University Hospitals — Septorhinoplasty Aftercare', 'https://www.cuh.nhs.uk/patient-information/information-after-septorhinoplasty/']
      ],
      en: {
        title: 'Rhinoplasty',
        intro: [
          'What is rhinoplasty?|Rhinoplasty reshapes the nose while taking nasal breathing into account. The aim is to achieve the agreed shape in proportion to the face, considering the skin and supporting tissues, while preserving or improving airflow.',
          'About this guide|This guide explains preparation and recovery. Your exact instructions depend on the operation and your follow-up findings.'
        ],
        route: 'Consultation and shared goals → preparation → surgery → care during the first days → follow-up → gradual refinement of the result.',
        sections: [
          ['Consultation and planning',
            'Goals and examination|We discuss what you would like to change, any breathing problems and the outcome you expect. The surgeon examines the external nose, skin, septum, nasal valves and turbinates. Tell us about previous injuries, operations and nasal fillers.',
            'Photographs and simulation|Photographs document your starting point and help us discuss the plan. Computer simulation, if used, illustrates possible changes; it does not guarantee an exact result. Skin thickness, pre-existing asymmetry and healing all affect the final shape.',
            'An informed choice|We discuss what surgery can and cannot achieve, risks, alternatives and the possibility of further correction before you choose a date.'],
          ['Before surgery',
            'Tell your doctor|List your conditions, allergies, medicines and supplements, especially blood-thinning medicines, prolonged decongestant use, smoking and sleep apnoea. If you use CPAP, discuss the mask and timing of use after surgery.',
            'Regular medicines|Do not stop anticoagulants, antiplatelet medicines or other regular treatment yourself. Tests and any changes to treatment are decided individually.',
            'Smoking and illness|Stop smoking as early as you can and avoid nicotine during healing; mention vaping and other nicotine products. Tell the team if you develop a fever, cold or other illness before surgery.',
            'Anaesthesia and discharge|Follow the individual instructions for food, fluids and medicines before anaesthesia. Arrange a lift home, help from an adult during the first 24 hours and clothing that does not go over your head.'],
          ['The operation',
            'Anaesthesia and incisions|Rhinoplasty is usually performed under general anaesthesia. Incisions are inside the nose or include a small external incision between the nostrils.',
            'What may be changed|The surgeon reshapes bone and cartilage and, when needed, corrects the septum or other causes of poor airflow. Any need for cartilage from another site and its healing is discussed beforehand.',
            'Going home|After local anaesthesia discharge is usually the same day. After sedation or general anaesthesia it may be the same day or the next, once the main anaesthetic effects have worn off and the team confirms it is safe.'],
          ['Splint, sutures and internal supports',
            'External splint|An external support may be applied and is usually removed at review after about 7–10 days. Keep it dry and do not remove or adjust it yourself.',
            'Internal supports|Thin silicone splints may be placed inside the nose; they are different from packing. The surgeon decides whether and when to remove them. Firm packing is used only when indicated, for example to control bleeding.',
            'External sutures|These are usually removed on days 5–7. Do not pull visible threads. Massage only if the surgeon prescribes an individual method.'],
          ['The first days',
            'What to expect|Congestion, moderate pain, swelling, bruising around the eyes, slight blood-stained discharge, dry mouth and tiredness are common. Swelling often peaks on days 2–3.',
            'Position and cooling|Rest with the head and upper body raised; avoid pressure on the nose. If you have sleep apnoea, agree a sleeping position with your doctor. During the first day only, apply cold through cloth to the cheeks without pressing on the nose: 20 minutes on, 10 minutes off, or 20 minutes on each side in turn. Never put ice directly on skin.',
            'Movement and food|Start short walks, food and fluids when the team permits. If nauseated, choose small portions of soft, non-hot food. Do not drive during the first 24 hours after general anaesthesia or while sleepy or taking sedating medicine.'],
          ['Nasal care and medicines',
            'Saline spray|Saline usually helps moisten the nose and clear discharge; it often begins the next day, but confirm the timing and frequency at discharge. Do not use a forceful stream or irrigate against marked resistance.',
            'Blowing and sneezing|Do not blow your nose for at least the first week, or longer if instructed. You may gently clear secretions backwards through the nasopharynx into the throat and spit them out without forceful suction or pressure. Sneeze with your mouth open; do not pick crusts or insert swabs deeply.',
            'Incision and medicines|Clean the external incision only as instructed. Use prescribed ointments, drops, sprays and pain medicine as directed. Do not add aspirin, other painkillers, antibiotics or steroids without asking the doctor.'],
          ['Daily life',
            'Washing|A brief warm shower is possible when allowed, keeping the splint dry. Avoid hot baths, saunas and overheating in the first weeks; do not put cosmetics on an open incision.',
            'Glasses|Frames must not press on the operated bridge. The duration depends on bone and cartilage work. Discuss contact lenses or support for glasses before resuming them.',
            'Sun, smoking and alcohol|After the skin heals, protect the nose and scars with a hat and SPF 50 or higher. Avoid smoking and smoke exposure. Avoid alcohol for at least 72 hours and while taking incompatible medicines; follow a longer restriction if advised.'],
          ['Work, activity and travel',
            'Work|Many patients plan to return to non-strenuous work after 1–2 weeks. Physical work, heat, dust or equipment pressing on the nose require an individual plan.',
            'Activity|In the first days take short walks. For the first 1–2 weeks avoid exercise, heavy lifting, straining and deep bending. Until the end of month two, increase gentle activity after review but avoid intensive exercise, contact sports and falls or impact to the nose. After two months, with normal healing and the surgeon’s approval, gradually resume most activities, including contact sports. Stop if swelling, throbbing or bleeding increases.',
            'Travel|If you are travelling to the clinic, plan roughly two weeks nearby. Agree the flight and departure date after the early review. These timings are guidance, not automatic clearance.'],
          ['Follow-up',
            'Early review|The first appointment is arranged at discharge. The surgeon checks healing, may clean the nose and removes splints or sutures when appropriate.',
            'Later reviews|Breathing, scars and the changing shape are monitored. A later result review is usually planned at 12 months or beyond. Report new symptoms without waiting for a scheduled visit.'],
          ['When to judge the result',
            'Early appearance|Swelling remains after the splint comes off. Bruising and stronger swelling often ease over the first weeks, while the tip can feel firm, numb and enlarged for longer.',
            'Uneven swelling|It may vary by side and time of day. A sudden change in shape, pain or rapidly growing one-sided swelling needs medical review.',
            'Final shape|Refinement takes about a year and sometimes longer after revision or complex surgery. Tell the surgeon about breathing or appearance concerns as they arise. Further correction, if needed, is planned after assessment.'],
          ['Possible complications',
            'Surgical risks|Bleeding, infection, unfavourable scarring, persistent irregularity or asymmetry, altered sensation or smell, and persistent or worse breathing are possible. Septal surgery can rarely leave a perforation.',
            'Individual risks|Anaesthetic risks and those of revision surgery are discussed before the operation. This guide supplements the consultation and consent discussion.'],
          ['When to contact the team',
            'Contact your surgeon the same day|Seek advice for more than slight blood-stained discharge, recurrent bleeding, a temperature of 38 °C or higher, chills, increasing pain or one-sided swelling, worsening obstruction, pus or persistent bad smell, repeated vomiting or inability to drink.',
            'Get emergency help|Heavy bleeding that does not stop, breathing difficulty beyond expected congestion, fainting, sudden visual loss or chest pain need urgent care. Do not wait for a reply through the website form.',
            'If bleeding starts|Sit upright and lean slightly forward. Do not tilt your head back, blow your nose, remove the splint or insert packing yourself. Before discharge, confirm your prescriptions, review date and direct clinical contact details.']
        ]
      }
    },
    blepharoplasty: {
      sub: 'blepharoplasty',
      references: [
        ['Mayo Clinic — Blepharoplasty', 'https://www.mayoclinic.org/tests-procedures/blepharoplasty/about/pac-20385174'],
        ['ASPS — Eyelid Surgery Recovery', 'https://www.plasticsurgery.org/cosmetic-procedures/eyelid-surgery/recovery'],
        ['NHS — Eyelid Surgery', 'https://www.nhs.uk/tests-and-treatments/cosmetic-procedures/cosmetic-surgery/eyelid-surgery/'],
        ['Guy’s and St Thomas’ — Blepharoplasty Aftercare', 'https://www.guysandstthomas.nhs.uk/health-information/blepharoplasty/during-and-after-your-surgery']
      ],
      en: {
        title: 'Blepharoplasty',
        intro: [
          'What is blepharoplasty?|Surgery of the upper lids, lower lids or both. Excess skin and fat may be removed or repositioned; muscle and lower lid support are addressed when needed.',
          'About this guide|Preparation and recovery depend on the extent of surgery, the eye surface and individual healing.'
        ],
        route: 'Consultation and shared goals → preparation → surgery → eyelid and eye care → reviews → assessment of the result.',
        sections: [
          ['Consultation and planning',
            'Goals and examination|We discuss heavy upper lids, restricted field of view, lower lid bulges, contours and asymmetry. The surgeon checks brow and lid position, skin, fat, lid closure and lower lid tone.',
            'Eye health|Report dryness, burning, watering, double or impaired vision, glaucoma, thyroid disease, previous eye surgery or injury, and contact lens use. An ophthalmology review or tear-film and visual assessment may be needed.',
            'Limits and choices|Upper blepharoplasty does not lift a low brow or correct true eyelid ptosis. It does not promise to remove crow’s feet, pigment or every dark circle. Incisions, alternatives, asymmetry and potential further correction are discussed before deciding.'],
          ['Before surgery',
            'Medical information|List conditions, allergies, medicines, eye drops and supplements, especially anticoagulants, antiplatelets and anti-inflammatory drugs. Never stop regular medication without an individual plan from the prescribing doctor.',
            'Smoking and illness|Avoid nicotine during healing and mention vaping. Report fever, a cold, eye infection or deteriorating health before surgery; follow the individual anaesthesia instructions for food, drink and medicines.',
            'Discharge|Do not wear eye makeup or cream on the day. Arrange transport and an adult to help during the first 24 hours, particularly after sedation or general anaesthesia.'],
          ['The operation',
            'Anaesthesia|Local anaesthesia, local anaesthesia with sedation or general anaesthesia may be used, depending on the plan and health.',
            'Upper and lower lids|An upper lid incision usually follows the natural crease; skin and sometimes muscle or fat are adjusted. Lower lid access is below the lashes or inside the lid. Fat can be removed or redistributed and the lid supported when needed.',
            'Going home|After local anaesthesia, discharge is usually the same day. After sedation or general anaesthesia it may be the same or following day after recovery from the main effects and a safety check.'],
          ['Sutures and dressings',
            'Sutures|Non-absorbable sutures are generally removed in the first or second week, at the time set by the surgeon. Do not pull threads or adhesive strips.',
            'Ointment and dressings|Small dressings, strips or ointment may be applied. Follow the specific discharge instructions.'],
          ['The first days',
            'Normal early changes|Swelling, bruising, tightness, mild discomfort, watering or dryness, light sensitivity and temporarily blurred vision are common. Ointment may itself blur vision. The two sides often swell differently.',
            'Position and cooling|Rest with your head raised and avoid sleeping face down. Unless your surgeon gives a different plan, apply a cool compress through clean cloth for 10 minutes each waking hour on the first evening, then 4–5 times the following day. Do not press on the eyes or put ice directly on skin; ask before further cooling.',
            'Closure and driving|The lids may not close fully at first, especially at night. Use prescribed lubricants and report worsening dryness, pain or redness. Do not drive for at least 24 hours after sedation or general anaesthesia; resume only with clear vision and no sedating medicine.'],
          ['Caring for eyelids and eyes',
            'Cleaning|Confirm the washing routine at discharge. Wash your hands, clean gently and avoid rubbing or directing a strong stream of water at the lids.',
            'Drops and ointment|Use only what was prescribed; keep the applicator tip off the eye, lashes and skin. Do not start other drops or antibiotics yourself.',
            'Contacts and makeup|Avoid contact lenses for about two weeks, longer if swelling, irritation or dryness persists. Resume after the doctor agrees and they are comfortable. Apply no makeup to an unhealed incision; wait for closure and suture removal as instructed.',
            'Protect the wound|Do not rub the lids, pick crusts or pull threads.'],
          ['Daily life',
            'Water and heat|Keep shampoo, hot water and strong shower flow away from the eyes. Avoid saunas, hot baths and overheating in the early weeks.',
            'Sun and wind|Use sunglasses outdoors. Once incisions close, protect scars with SPF 50 or higher without getting cream in the eyes.',
            'Smoking and alcohol|Avoid smoking and smoke irritation. No alcohol for at least 72 hours or while taking incompatible medicines.'],
          ['Work and activity',
            'Work|Allow around 1–2 weeks before quiet work; the exact time depends on swelling, visual demands, dust and injury risk.',
            'Activity|Walk gently in the first days, avoiding head-down bending. For two weeks avoid heavy lifting, straining, strenuous exercise and swimming. Increase activity gradually after review; contact sport and facial impact need separate clearance. Stop and contact the surgeon if pain, swelling, throbbing or bleeding rises.',
            'Travel|Arrange long journeys after the early review and agree how long to remain near the clinic if travelling from elsewhere.'],
          ['Follow-up',
            'Early visit|The date is provided at discharge. Non-absorbable sutures are usually removed in the first or second week.',
            'Further checks|The surgeon assesses lid closure and position, lower lid support, scars, symmetry and dryness. Report new symptoms promptly.'],
          ['When to judge the result',
            'First weeks|Most bruising and marked swelling ease within about two weeks; many patients are ready for ordinary social activities at 10–14 days, though redness and residual swelling last longer.',
            'Scars and sensation|Pink, firm or sensitive incisions and numb patches usually soften and fade over months.',
            'Final assessment|A preliminary assessment is possible around six weeks, with the result settling over three to six months. Ageing continues; the surgeon assesses any need for correction after stabilisation.'],
          ['Possible complications',
            'Temporary effects|Swelling, bruising, dryness, watering, irritation, light sensitivity, blurry vision, altered skin sensation and incomplete lid closure can occur.',
            'Specific risks|Bleeding, infection, visible scarring, asymmetry, persistent dryness, ptosis, lower lid retraction or eversion, double vision, eye muscle damage and further surgery are possible.',
            'Threat to sight|Rare bleeding behind the eye can compress the optic nerve and requires immediate assessment and treatment. Anaesthetic and combined-operation risks are discussed individually.'],
          ['When to contact the team',
            'Emergency care immediately|Sudden loss or worsening of vision, new severe eye pain, a rapidly increasing tense swelling around an eye, or new double vision require urgent assessment. Do not wait for a website response. Chest pain, difficulty breathing, fainting or a severe allergic reaction also need emergency care.',
            'Contact your surgeon the same day|Report increasing pain or swelling, persistent bleeding, fever of 38 °C or higher, pus, worsening redness, significant difficulty closing the eye or worsening dryness.',
            'Before discharge|Confirm medicines and eye care, review and suture-removal dates, and a direct contact for urgent postoperative questions.']
        ]
      }
    },
    otoplasty: {
      sub: 'ottoplasty',
      references: [
        ['Mayo Clinic — Otoplasty', 'https://www.mayoclinic.org/tests-procedures/otoplasty/about/pac-20394822'],
        ['NHS — Ear Correction Surgery', 'https://www.nhs.uk/tests-and-treatments/cosmetic-procedures/cosmetic-surgery/ear-correction-surgery/'],
        ['ASPS — Ear Surgery Recovery', 'https://www.plasticsurgery.org/cosmetic-procedures/ear-surgery/recovery'],
        ['ASPS — Ear Surgery Risks', 'https://www.plasticsurgery.org/cosmetic-procedures/ear-surgery/safety']
      ],
      en: {
        title: 'Otoplasty',
        intro: [
          'What is otoplasty?|Otoplasty changes the shape, position or proportions of the outer ears, often reducing prominence or reshaping cartilage folds.',
          'About this guide|Preparation and protection during healing depend on technique, skin, cartilage and individual recovery.'
        ],
        route: 'Consultation and agreed ear shape → preparation → surgery → protective dressing → wound care and reviews → settling of the result.',
        sections: [
          ['Consultation and planning',
            'Goals and examination|We examine the ear cartilage, folds, concha, lobule, prominence and pre-existing asymmetry. Otoplasty changes the outer ear; it is not intended to improve hearing.',
            'Scars and durability|Incisions are usually behind the ear or in a natural crease. The aim is a natural position, not perfectly identical ears. Some recurrence or further correction is possible.',
            'Children and young people|Timing depends on ear development, the child’s understanding and willingness, and the ability to follow aftercare. We discuss anaesthesia, limitations, risks and alternatives before choosing a date.'],
          ['Before surgery',
            'Health and medicines|List illnesses, allergies, previous procedures, medicines and supplements, especially blood thinners, past ear infections and a tendency to thick or keloid scars. Do not stop aspirin or other regular medicines without an individual plan.',
            'Tests and illness|Tests depend on age, health and anaesthesia. Report fever, cold, cough, herpes, spots near the ears or other acute illness. Avoid nicotine, including vaping, during healing.',
            'Food and discharge|Follow your own fasting and medication instructions; do not change fasting times yourself. Arrange transport, an adult helper after discharge and clothes that fasten at the front. A stay until the next day may be advised after sedation or general anaesthesia.'],
          ['The operation',
            'Anaesthesia|Adults may have local anaesthesia with or without sedation, or general anaesthesia; children more often have general anaesthesia. The choice is individual.',
            'Ear reshaping|The incision is usually behind the ear. Internal stitches, scoring, limited removal or a combination reshape the cartilage. A soft protective dressing supports and shields the new position.',
            'Going home|After local anaesthesia patients are usually discharged the same day. Following sedation or general anaesthesia, discharge may be the same day or the next once the main anaesthetic effects pass and the team confirms it is safe.'],
          ['Dressing, sutures and protective band',
            'First dressing|Keep it clean and dry. Do not remove, loosen or adjust it yourself. It is usually removed at review after 5–10 days, according to the operation.',
            'If it shifts|Do not re-bandage tightly or push it back. Protect the ears from pressure and bending and contact the team.',
            'Sutures and band|Absorbable stitches stay in place; non-absorbable stitches are usually removed at 7–10 days. Do not pull threads. A broad, soft night-time band may be advised for several weeks after the first dressing; it should protect without squeezing.'],
          ['The first days',
            'Expected changes|Moderate pain, swelling, bruising, tightness, itching and temporary numbness are common. After the dressing comes off, ears can appear swollen, uneven or closer to the head than expected.',
            'Sleep and itching|Sleep on your back, slightly elevated. Do not lie on the ears or fold them against a pillow. Never put fingers, cotton buds or combs beneath the dressing; report increasing pain, burning or excessive pressure.',
            'Medicines and driving|Take prescribed pain relief only as directed. Do not add aspirin or anti-inflammatory medicines without advice. Avoid driving for at least 24 hours after sedation or general anaesthesia and until head movement and alertness are normal.'],
          ['Ear and incision care',
            'Water and hair|Do not wet the main dressing or wash hair while it is in place. After removal, wash gently only if cleared; do not rub the ears and pat behind them dry.',
            'Wound care|Clean incisions and use ointments only as instructed. Do not pick crusts or apply unprescribed antiseptics.',
            'Pressure and jewellery|Protect ears from headphones, helmets, masks, glasses or hair accessories that squeeze or bend them. Discuss earrings and new piercings with the surgeon before resuming.'],
          ['Daily life',
            'Clothes and hair|Wear front-fastening or loose clothing; take care when combing or styling hair near the ears.',
            'Sun and substances|Protect healed scars from sun with a hat and SPF 50 or higher. Avoid smoking and smoke exposure. Avoid alcohol for at least 72 hours and while taking incompatible medicines.'],
          ['Work and activity',
            'Work or school|Many return to quiet work or study in about one to two weeks, after the dressing review and when comfortable. A child’s return and protection at school need individual planning.',
            'Activity|Walk gently in the first days; avoid strenuous exercise, straining and heavy lifting during the early weeks. Sport with pressure, bending or impact to the ears requires the surgeon’s clearance and any advised protection. Stop and ask for advice if pain, bleeding or swelling rises.'],
          ['Follow-up',
            'First appointment|The initial visit and dressing removal are arranged at discharge, usually after 5–10 days. Non-absorbable sutures are usually removed at 7–10 days.',
            'Further checks|We check wound healing, shape, symmetry, skin condition and any night-band regimen. Do not wait for a scheduled visit if a new problem develops.'],
          ['When to judge the result',
            'After dressing removal|The ears may look closer to the head than planned, swollen and uneven. This appearance changes as the swelling settles.',
            'Later appearance|Bruising and most swelling improve over weeks; firmness, altered sensation and scars can take months to settle. Final assessment is usually made after several months. If significant asymmetry or recurrence remains, we discuss correction after healing stabilises.'],
          ['Possible complications',
            'Surgical risks|Bleeding or a haematoma, infection including cartilage infection, poor wound healing, visible or raised scars, altered sensation and skin problems are possible.',
            'Shape and symmetry|Overcorrection, undercorrection, unequal ears, recurrent prominence or a need for revision can occur. We discuss individual and anaesthetic risks before surgery.'],
          ['When to contact the team',
            'Contact your surgeon the same day|Increasing or severe pain, a tight rapidly swelling ear, bleeding through the dressing, fever of 38 °C or higher, discharge or bad smell, marked redness, skin colour change or a displaced dressing need prompt advice.',
            'Get emergency help|Uncontrolled bleeding, breathing difficulty, fainting or a severe allergic reaction need urgent care, not a website form.',
            'Before discharge|Confirm the dressing and band plan, medicines, follow-up dates and direct contact for postoperative problems.']
        ]
      }
    },
    cheiloplasty: {
      sub: 'cheiloplasty',
      references: [
        ['Cleveland Clinic — Lip Lift', 'https://my.clevelandclinic.org/health/procedures/lip-lift'],
        ['AAFPRS — Lip Enhancement', 'https://www.aafprs.org/AAFPRS/Procedures/Facial-Rejuvenation/Lip_Enhancement.aspx']
      ],
      en: {
        title: 'Cheiloplasty: Paris V–Y and Bullhorn Lip Lift',
        intro: [
          'What is cheiloplasty?|Surgical changes to lip shape and proportion are planned around lip closure, speech, smiling and eating.',
          'Paris Cheiloplasty|In this practice, Paris refers to a variation of V–Y advancement of the mucosa from inside the lip. It defines and projects the lip contour and has a lasting surgical effect.',
          'Bullhorn Lip Lift|A separate technique removes a measured strip of skin beneath the nose to shorten the philtrum and lift the upper lip. The two techniques may be combined for different aims.'
        ],
        route: 'Consultation and choice of technique → preparation → surgery → care of internal or external sutures → follow-up → scar and contour maturation.',
        sections: [
          ['Consultation and planning',
            'Goals and examination|We assess lip shape, vermilion, Cupid’s bow, philtrum length, tooth show, closure, movement, scars and facial proportions.',
            'Paris V–Y|Mucosa and underlying tissue are advanced from the inner lip through V-shaped incisions closed as Y shapes; this adjusts contour and projection without a skin incision under the nose.',
            'Bullhorn|A subnasal skin incision reduces the distance between nose and upper lip and changes tooth show. It leaves a scar at the nasal base. These techniques address different anatomical aims and can be combined.',
            'Limits and function|Surgery aims at a lasting change, but ageing, tissue response and scars affect the final result. Too much correction can impair closure, speech, smiling or eating. We discuss alternatives, risks and realistic expectations.'],
          ['Before surgery',
            'Medical information|Report illnesses, allergies, previous lip injury or surgery, dental work, fillers, threads or implants, medicines and supplements, clotting problems, problematic scars and cold sores. Provide details of previous fillers even if placed long ago.',
            'Regular medicines|Do not stop aspirin, anticoagulants or other prescribed treatment yourself. Changes are coordinated with the prescriber.',
            'Infection and dental care|Active cold sores, dental or gum infection, mouth ulcers, spots around the lips or fever may delay surgery. Recurrent herpes may require antiviral prevention. Treat active oral infection and keep brushing gently.',
            'Nicotine, fasting and discharge|Avoid nicotine throughout healing; follow your own anaesthesia instructions about food and fluids. Arrange a ride, adult help after sedation or general anaesthesia, soft food and prescribed care supplies.'],
          ['The operation',
            'Anaesthesia|Local anaesthesia, sedation with local anaesthesia, or general anaesthesia is chosen according to the plan and health.',
            'V–Y technique|One or more V-shaped incisions inside the lip permit planned mucosal advancement. They are closed as Y shapes; the number and position depend on the desired contour.',
            'Bullhorn|A measured strip of skin is removed under the nasal base, then the edges are moved and closed in layers without undue tension or nostril distortion. If combined, the subnasal lift shortens the philtrum while V–Y refines the vermilion.',
            'Going home|After local anaesthesia discharge is usually the same day. After sedation or general anaesthesia it may be the same or next day, after anaesthetic recovery and a safety assessment.'],
          ['Sutures and protecting the site',
            'External sutures|After a Bullhorn or other skin incision, non-absorbable sutures are generally removed at 5–7 days, according to healing.',
            'Internal sutures|V–Y stitches are usually absorbable. Do not pull, bite or cut threads that you can feel with your tongue.',
            'Wound protection|Do not remove adhesive strips or apply creams or antiseptics unless instructed. A wound that opens, bleeds or shifts requires contact with the team; cover gently with clean gauze without strong pressure.'],
          ['The first days',
            'Expected changes|Swelling, bruising, tenderness, tightness, numbness and reduced upper-lip movement are expected. Uneven swelling can distort the smile and contour; swelling often increases for the first 2–3 days.',
            'Position and cooling|Sleep on your back with your head slightly raised and do not press the lip into a pillow. Cooling depends on the specific incisions and tissue movement: use a cool compress through cloth only if prescribed, without pressure or direct ice.',
            'Lip movement and medicines|For the first days avoid wide mouth opening, exaggerated smiling, laughing, whistling and prolonged talking. Take only prescribed medicines. Do not drive for at least 24 hours after sedation or general anaesthesia or while taking sedatives.'],
          ['Mouth and incision care',
            'Clean hands and skin|Wash hands before care. Clean an external incision only as instructed; do not pick crusts or add alcohol, peroxide, unprescribed antibiotic ointment or active skincare.',
            'Inside the mouth|After V–Y surgery, brush gently with a soft brush away from stitches. Use a prescribed rinse after meals if advised, without forceful swishing or spitting. Do not play with the wound using fingers or tongue.',
            'Makeup and dental treatment|Avoid lipstick and makeup until the cut has closed and the surgeon agrees. Postpone routine dental work requiring wide opening; tell a dentist about recent surgery if urgent care is needed.'],
          ['Eating and daily life',
            'Food and drink|Start with small portions of soft cool or warm food; use a spoon and take small bites. Avoid hot, spicy, acidic, hard and crunchy food in the early days. Sip water; do not use a straw unless cleared, because suction stretches the lip.',
            'Pressure and contact|Avoid kissing, lip massage and oral contact until initial healing and clearance; avoid anything that stretches or contaminates the wound.',
            'Sun and substances|Once an external incision closes, use a hat and SPF 50 or higher on the scar. Avoid nicotine and smoke. Avoid alcohol for at least 72 hours or while taking incompatible medicines.'],
          ['Work and activity',
            'Work|Quiet work may be possible after several days, but visible swelling or bruising may last 1–2 weeks. Public-facing work or active expression may need longer.',
            'Activity|Walk gently at first. Avoid straining, bending, heavy lifting and intensive exercise for the first two weeks. Increase activity with approval after that. Facial-impact sports require individual clearance, with no universal deadline across these techniques. Stop if throbbing, bleeding, swelling or pain increases.'],
          ['Follow-up',
            'Early review|The first visit is arranged at discharge. External non-absorbable sutures are usually removed at 5–7 days.',
            'V–Y and later checks|The surgeon examines mucosa, tissue position, internal stitches, lip function and symmetry. Absorbable stitches usually need no removal. Later reviews assess contour, closure, scars and swelling. Report new pain, discharge, wound separation or difficulty drinking promptly.'],
          ['When to judge the result',
            'Early appearance|The change is visible but swelling can make the lip look larger, firmer and asymmetric. Do not judge the final smile immediately.',
            'Settling|Most bruising and swelling decrease over the first weeks. Tightness, firmness and numbness may last longer; a Bullhorn scar often remains pink and firm for months before fading.',
            'Longer term|Contour and scar maturation take months. A further correction is considered only after tissues settle, except where a medical problem requires earlier treatment.'],
          ['Possible complications',
            'General risks|Bleeding, infection, wound separation, poor healing, anaesthetic complications and need for further surgery are possible.',
            'Shape, scars and function|Visible, widened or raised scars, pigmentation, asymmetry, contour irregularity, excess tooth show, altered lip closure or movement, lasting numbness and dissatisfaction may occur. V–Y advancement can form internal tightness or unwanted mucosal contour. Cold sores may recur; individual risks are discussed before surgery.'],
          ['When to contact the team',
            'Contact your surgeon the same day|Report persistent bleeding, a rapidly growing or one-sided swelling, increasing pain, fever of 38 °C or higher, pus, bad smell, separated stitches, a colour change or difficulty drinking.',
            'Get emergency help|Heavy uncontrolled bleeding, difficulty breathing, fainting or a severe allergic reaction need emergency care. Do not use the website form for urgent postoperative symptoms.',
            'Before discharge|Confirm the individual wound and mouth-care plan, medicines, date for review and suture removal, and direct clinical contact.']
        ]
      }
    },
    browlift: {
      sub: 'browlift',
      references: [
        ['Mayo Clinic — Brow Lift', 'https://www.mayoclinic.org/tests-procedures/brow-lift/about/pac-20393257'],
        ['ASPS — Brow Lift Recovery', 'https://www.plasticsurgery.org/cosmetic-procedures/brow-lift/recovery'],
        ['ASPS — Brow Lift Risks', 'https://www.plasticsurgery.org/cosmetic-procedures/brow-lift/safety'],
        ['Leeds Teaching Hospitals — Forehead and Brow Lift', 'https://www.leedsth.nhs.uk/patients/resources/forehead-and-brow-lift/']
      ],
      en: {
        title: 'Periorbital rejuvenation: brow lift',
        intro: [
          'What is a brow lift?|A brow lift raises a descended brow and adjusts forehead tissues. Periorbital rejuvenation may also involve other procedures, but each is planned separately.',
          'How it differs from eyelid surgery|A brow lift changes brow position; blepharoplasty treats the eyelid itself. A low brow can create apparent excess upper-lid skin, so assessment of both is important.',
          'About this guide|Recovery and scar care vary with the chosen incision, fixation and any combined procedure.'
        ],
        route: 'Assessment of brows and eyes → selection of technique → preparation → surgery → wound care and reviews → settling of brow position.',
        sections: [
          ['Consultation and planning',
            'Examination|We discuss the brow position, forehead movement, hairline, asymmetry, eyelids, eye surface and visual symptoms. The aim is a natural brow shape, not an identical or permanently fixed position.',
            'Techniques|Endoscopic lifting uses short cuts in the scalp. Temporal, direct, hairline and coronal approaches have different incision sites and effects. Choice depends on brow and hairline anatomy, degree of descent, scars and the agreed aim.',
            'Shared decision|We discuss limits, scars, possible hair changes, alternatives, risks and any separate need for eyelid surgery before choosing a plan.'],
          ['Before surgery',
            'Medical and eye history|List illnesses, allergies, medicines, supplements, prior forehead or eye operations, dry eyes, visual changes, glaucoma and thyroid disease. Tell us about previous botulinum toxin or filler injections and their dates. An eye examination may be needed.',
            'Regular medicines and infection|Do not stop blood thinners or other medicines yourself. Report fever, respiratory or eye infection, skin inflammation near the planned incisions and any worsening of health.',
            'Preparation|Avoid nicotine during healing. Follow your own food and fluid instructions for anaesthesia. Wash hair and avoid makeup or styling products as instructed; do not shave the scalp unless asked. Arrange transport and an adult helper for the first day.'],
          ['The operation',
            'Anaesthesia and access|Local anaesthesia with sedation or general anaesthesia may be used. The surgeon releases and moves forehead and brow tissues through incisions chosen for the plan.',
            'Fixation and other procedures|Internal stitches or fixation devices may hold the new position while tissues heal. Eyelid surgery, if planned, has its own incisions and risks. A dressing, and sometimes a drain, may be placed.',
            'Going home|After local anaesthesia patients are usually discharged the same day. After sedation or general anaesthesia discharge may be the same or next day, once effects wear off and the team confirms safety.'],
          ['Dressings, sutures and incisions',
            'First dressing|Keep it clean and dry; do not remove, tighten or adjust it unless instructed. Report sudden tightness or a displaced dressing.',
            'Stitches, clips and drain|Removal depends on the incision and technique; your discharge plan gives the dates. Do not pull threads or clips or remove a drain yourself.',
            'Internal fixation|You may feel a firm spot or minor irregularity while healing. Do not massage it without the surgeon’s instruction.'],
          ['The first days',
            'Expected changes|Forehead and eyelid swelling, bruising, tightness, temporary numbness, itching and a headache are common. Brows can appear higher or uneven initially.',
            'Position, cold and heat|Sleep on your back with your head raised; do not lie on incisions. Avoid heat. Use cooling only if your surgeon specifically instructs you where and how: recommendations differ by technique, and ice or heat should not be placed directly on the operated area.',
            'Expression and vision|Avoid forceful facial movements, deep bending and straining in the early period. Follow prescribed pain relief. New severe eye pain, worsening vision or tense swelling around an eye needs immediate help.',
            'Driving|Do not drive for at least 24 hours after sedation or general anaesthesia and until vision, alertness and head movement are safe.'],
          ['Incision, hair and eye care',
            'Clean hands and incisions|Wash hands before care. Use prescribed cleansing and ointments only; do not pick scabs or pull stitches.',
            'Washing hair|The team will tell you when and how to wash it. Use gentle water and shampoo, avoid rubbing the cuts, and pat dry. Delay hot hairdryers, dyeing and chemical treatments until cleared.',
            'Eyes and makeup|Use prescribed eye lubrication if needed. Do not apply makeup to unhealed incisions; report increasing irritation or poor lid closure.'],
          ['Daily life',
            'Pressure and sun|Avoid headwear or eyewear that presses on incisions. Once closed, protect exposed scars with a hat and SPF 50 or higher; do not apply sunscreen to open wounds.',
            'Nicotine, alcohol and sleep|Avoid nicotine and smoke. Avoid alcohol for at least 72 hours or while taking incompatible medicines. Sleep without pressure on the incisions, and handle hair gently.'],
          ['Work and activity',
            'Work|Plan a break of about one to two weeks for quiet work; visible bruising, extent of surgery and work conditions may change this.',
            'Activity|Take short walks first. Avoid bending, straining and heavy lifting during early healing. Gradually increase exercise after the surgeon’s review. Contact sport or a risk of impact to the forehead requires separate clearance; there is no single time limit for every technique. Stop if swelling, bleeding or pain increases.'],
          ['Follow-up',
            'First review|The appointment is arranged at discharge; dressing or drain care and wound healing are checked.',
            'Suture removal and further checks|Stitches or clips are removed on the surgeon’s individual schedule. Later visits assess brow shape, scars, hair, sensation and eye symptoms. Report new complaints without waiting.'],
          ['When to judge the result',
            'Early appearance|Swelling can hold brows unusually high or make them asymmetric. The position softens during the first weeks.',
            'Scars and hair|Scalp tightness or numbness and changes around incisions can last months; hair loss or scar visibility may be temporary or persistent.',
            'Longer term|Judge the settled result after several months. A brow lift does not stop ageing or sun-related changes, and descent may partly recur. Further surgery is considered after stabilisation unless there is an earlier medical need.'],
          ['Possible complications',
            'General risks|Bleeding, haematoma, infection, fluid collection, wound separation, slow healing, reaction to sutures or fixation, persistent pain and repeat surgery are possible.',
            'Scars, hair and sensation|A wide or raised scar, hairline change, hair loss, itching or numbness of the forehead or scalp may occur. Rare facial nerve injury can cause temporary or lasting weakness of forehead or brow movement.',
            'Brow and eye effects|Asymmetry, under- or overcorrection, an unnatural high brow, recurrent descent, dry or watery eyes, irritation and incomplete lid closure are possible. Combined blepharoplasty has its own risks.'],
          ['When to contact the team',
            'Contact your surgeon the same day|Report increasing pain or swelling, persistent bleeding, fever of 38 °C or higher, discharge, bad smell, wound separation, marked one-sided change or worsening eye irritation.',
            'Emergency care immediately|Sudden worsening of vision, new severe eye pain, new double vision or rapidly increasing tense swelling around the eye need emergency assessment. So do difficulty breathing, chest pain, fainting or a severe allergic reaction. Do not wait for a message reply.',
            'Before discharge|Confirm medicines and wound care, dates for dressing, drain, stitches or clips, hair washing instructions and a direct contact for urgent concerns.']
        ]
      }
    }
  };
  function paragraph(value) {
    var split = value.indexOf('|');
    return { type: 'paragraph', parts: split < 0
      ? [{ type: 'text', text: value }]
      : [{ type: 'strong', text: value.slice(0, split) + ' ' }, { type: 'text', text: value.slice(split + 1) }] };
  }
  Object.keys(data).forEach(function (key) {
    var item = data[key], output = {
      service: 0, sub: item.sub, status: 'published', hideHeroSubtitle: true,
      reviewedDate: '2026-09-27',
      references: item.references.map(function (r) { return { text: r[0], url: r[1] }; })
    };
    ['en', 'hy'].forEach(function (lang) {
      var copy = item[lang];
      if (!copy) return;
      output[lang] = {
        title: copy.title, intro: copy.intro,
        routeTitle: lang === 'hy' ? 'Ձեր բուժման ուղին' : 'Your treatment pathway',
        route: copy.route,
        sections: copy.sections.map(function (section, index) {
          return {
            id: key + '-' + (index + 1), level: 2,
            title: (index + 1) + '. ' + section[0],
            blocks: section.slice(1).map(paragraph)
          };
        })
      };
    });
    window.PATIENT_GUIDES[key] = output;
  });
}());
