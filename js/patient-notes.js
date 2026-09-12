/* Isolated vanilla DOM component. No submission writes to the public registry. */
(function () {
  'use strict';
  var activeDialog = null;
  var drafts = {};
  var COPY = {
    en: {
      title: 'Patient Notes', demo: 'Demonstration', intro: 'Preview with demonstration content only.',
      leave: 'Leave a note', write: 'Write a note', upload: 'Upload handwriting', close: 'Close',
      activate: 'Select note', open: 'Open note', zoom: 'Full size', fit: 'Fit image',
      text: 'Your note', next: 'Continue', back: 'Back', privacy: 'Please leave out phone numbers and medical details you do not want published.',
      choose: 'Choose a photo', camera: 'Take a photo', imageHelp: 'Photograph the note clearly. Crop out names, signatures and other details you do not want published. JPEG, PNG or WebP, up to 10 MB.',
      imageError: 'Choose a readable JPEG, PNG or WebP image up to 10 MB. If your phone uses HEIC, export the photo as JPEG first.',
      imageNeeded: 'Choose a photo before continuing.', processing: 'Preparing photo…', photo: 'Selected note photo',
      preference: 'How should your name appear?', anonymous: 'Anonymous', first: 'First name', initial: 'First name + initial',
      name: 'First name', initialLabel: 'Surname initial', consent: 'I agree to publication of this note and the name option I selected on this website.',
      moderation: 'Every note is reviewed before publication. Sending a note does not publish it automatically.',
      review: 'Review your note', send: 'Send for review', previewSend: 'Finish preview', sending: 'Sending…',
      previewHint: 'Preview only. Your note and photo will not be sent or published.',
      done: 'Preview complete', doneBody: 'Nothing has been sent or published. Your demonstration draft has been cleared.',
      received: 'Sent for review', receivedBody: 'Thank you. Your note will be reviewed before any publication.',
      sendError: 'The note could not be sent. Your draft is still here. Please try again.', empty: 'No notes have been published yet.'
    },
    hy: {
      title: 'Բուժառուների խոսքերը', demo: 'Ցուցադրական նմուշ', intro: 'Նախադիտում՝ միայն ցուցադրական բովանդակությամբ։',
      leave: 'Թողնել գրառում', write: 'Գրել գրառում', upload: 'Վերբեռնել ձեռագիր', close: 'Փակել',
      activate: 'Ընտրել գրառումը', open: 'Բացել գրառումը', zoom: 'Ամբողջ չափով', fit: 'Տեղավորել պատկերը',
      text: 'Ձեր գրառումը', next: 'Շարունակել', back: 'Հետ', privacy: 'Խնդրում ենք չներառել հեռախոսահամարներ և բժշկական տվյալներ, որոնք չեք ցանկանում հրապարակել։',
      choose: 'Ընտրել լուսանկար', camera: 'Լուսանկարել', imageHelp: 'Ձեռագիրը լուսանկարեք հստակ։ Կտրեք անունները, ստորագրությունները և այլ տվյալներ, որոնք չեք ցանկանում հրապարակել։ JPEG, PNG կամ WebP՝ մինչև 10 ՄԲ։',
      imageError: 'Ընտրեք ընթեռնելի JPEG, PNG կամ WebP պատկեր՝ մինչև 10 ՄԲ։ Եթե լուսանկարը HEIC ձևաչափով է, նախ փոխարկեք այն JPEG-ի։',
      imageNeeded: 'Շարունակելու համար ընտրեք լուսանկար։', processing: 'Լուսանկարը մշակվում է…', photo: 'Գրառման ընտրված լուսանկարը',
      preference: 'Ինչպե՞ս նշենք Ձեր անունը', anonymous: 'Անանուն', first: 'Միայն անունը', initial: 'Անունը և ազգանվան սկզբնատառը',
      name: 'Անուն', initialLabel: 'Ազգանվան սկզբնատառ', consent: 'Համաձայն եմ, որ իմ գրառումը հրապարակվի այս կայքում՝ անունը նշելու իմ ընտրած տարբերակով։',
      moderation: 'Յուրաքանչյուր գրառում ստուգվում է հրապարակումից առաջ։ Ուղարկելը չի նշանակում ինքնաբերաբար հրապարակում։',
      review: 'Ստուգեք Ձեր գրառումը', send: 'Ուղարկել ստուգման', previewSend: 'Ավարտել փորձարկումը', sending: 'Ուղարկվում է…',
      previewHint: 'Սա նախադիտում է։ Ձեր գրառումը և լուսանկարը չեն ուղարկվի կամ հրապարակվի։',
      done: 'Փորձարկումն ավարտված է', doneBody: 'Ոչինչ չի ուղարկվել կամ հրապարակվել։ Փորձնական սևագիրը ջնջվել է։',
      received: 'Ուղարկվել է ստուգման', receivedBody: 'Շնորհակալություն։ Ձեր գրառումը կստուգվի հրապարակումից առաջ։',
      sendError: 'Գրառումը չհաջողվեց ուղարկել։ Սևագիրը պահպանված է։ Խնդրում ենք կրկին փորձել։', empty: 'Դեռ հրապարակված գրառումներ չկան։'
    }
  };
  function blank() { return { type: '', text: '', image: null, preference: 'anonymous', name: '', initial: '', consent: false }; }
  function preview() { return window.PATIENT_NOTES_CONFIG.preview === true; }
  function close() { if (activeDialog) activeDialog(); }
  function build(lang, el) {
    var c = COPY[lang], draft = drafts[lang] || (drafts[lang] = blank());
    function button(text, className, action) { return el('button', { type: 'button', class: className, onclick: action }, [/pn-(cta|choice)/.test(className) ? el('span', null, [text]) : text]); }
    function caption(text) { return el('p', { class: 'pn-caption' }, [text]); }
    function makeDialog(className, title, opener) {
      close();
      var cleanup = [], scroll = document.body.style.overflow;
      var dialog = el('dialog', { class: 'pn-dialog ' + className, 'aria-labelledby': 'pn-dialog-title' });
      var heading = el('h2', { id: 'pn-dialog-title', tabindex: '-1' }, [title]);
      var x = button('×', 'pn-open', function () { dispose(); });
      x.setAttribute('aria-label', c.close);
      var head = el('div', { class: 'pn-dialog-head' }, [heading, x]);
      dialog.appendChild(head);
      function dispose() {
        cleanup.forEach(function (fn) { fn(); });
        if (dialog.open) dialog.close();
        dialog.remove(); document.body.style.overflow = scroll;
        activeDialog = null;
        if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      }
      dialog.addEventListener('cancel', function (e) { e.preventDefault(); dispose(); });
      dialog.addEventListener('click', function (e) {
        var r = dialog.getBoundingClientRect();
        if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dispose();
      });
      document.body.appendChild(dialog); dialog.showModal(); document.body.style.overflow = 'hidden';
      activeDialog = dispose;
      return { node: dialog, heading: heading, close: dispose, cleanup: cleanup };
    }
    function view(note, opener) {
      var d = makeDialog('pn-viewer', c.title, opener);
      var body = el('div', { class: 'pn-view-body' });
      if (note.image) body.appendChild(el('img', { src: note.image, alt: note.text }));
      else body.appendChild(el('p', { class: 'pn-view-text' }, [note.text]));
      d.node.appendChild(body);
      var actions = el('div', { class: 'pn-actions' }, [caption([note.demo ? c.demo : '', note.displayName, note.year].filter(Boolean).join(' · '))]);
      if (note.image) actions.appendChild(button(c.zoom, 'card-btn', function (e) {
        var zoomed = body.classList.toggle('is-zoomed');
        e.currentTarget.textContent = zoomed ? c.fit : c.zoom;
        e.currentTarget.setAttribute('aria-pressed', String(zoomed));
      }));
      d.node.appendChild(actions); d.heading.focus();
    }
    function publicationName() {
      if (draft.preference === 'anonymous') return c.anonymous;
      return draft.name.trim() + (draft.preference === 'initial' ? ' ' + draft.initial.trim().toUpperCase() + '.' : '');
    }
    function contribute(opener) {
      var d = makeDialog('pn-sheet', c.leave, opener), stepContent = el('div'), fileURL = null, generation = 0, sending = false;
      d.node.appendChild(stepContent);
      d.cleanup.push(function () { generation++; if (fileURL) URL.revokeObjectURL(fileURL); });
      function showPhoto(parent) {
        if (fileURL) URL.revokeObjectURL(fileURL);
        fileURL = URL.createObjectURL(draft.image);
        parent.appendChild(el('img', { src: fileURL, alt: c.photo, class: 'pn-upload-preview' }));
      }
      function screen(step, title) {
        generation++; d.node.dataset.step = step; d.heading.textContent = title;
        stepContent.replaceChildren(); d.node.scrollTop = 0;
        if (step !== 'choose') d.heading.focus();
      }
      function actions(form, back, next) {
        var nextButton = el('button', { type: 'submit', class: 'form-submit' }, [next || c.next]);
        form.appendChild(el('div', { class: 'pn-actions' }, [button(c.back, 'card-btn', back), nextButton]));
        return nextButton;
      }
      function choose() {
        screen('choose', c.leave);
        stepContent.appendChild(el('div', { class: 'pn-choice-row' }, [
          button(c.write, 'pn-choice', function () { draft.type = 'text'; compose(); }),
          button(c.upload, 'pn-choice', function () { draft.type = 'handwriting'; compose(); })
        ]));
      }
      function compose() {
        screen('compose', draft.type === 'text' ? c.write : c.upload);
        var form = el('form', { class: 'pn-flow' });
        var error = el('p', { class: 'pn-error', role: 'alert' });
        var nextButton;
        if (draft.type === 'text') {
          var input = el('textarea', { rows: '5', maxlength: '3000', required: '', 'aria-describedby': 'pn-privacy', oninput: function (e) { draft.text = e.target.value; e.target.setCustomValidity(''); } });
          input.value = draft.text;
          form.appendChild(el('label', null, [c.text, input]));
          form.appendChild(el('p', { class: 'pn-caption', id: 'pn-privacy' }, [c.privacy]));
        } else {
          var photo = el('div');
          if (draft.image) showPhoto(photo);
          function picker(capture) {
            var attrs = { type: 'file', accept: 'image/jpeg,image/png,image/webp', class: 'pn-hidden', tabindex: '-1', onchange: function (e) { prepare(e.target.files[0]); e.target.value = ''; } };
            if (capture) attrs.capture = 'environment';
            var input = el('input', attrs); form.appendChild(input); return input;
          }
          var fileInput = picker(false), cameraInput = picker(true);
          form.appendChild(el('div', { class: 'pn-choice-row' }, [button(c.choose, 'pn-choice', function () { fileInput.click(); }), button(c.camera, 'pn-choice', function () { cameraInput.click(); })]));
          form.appendChild(caption(c.imageHelp)); form.appendChild(photo);
          async function prepare(file) {
            if (!file) return;
            var current = ++generation;
            error.textContent = '';
            // A replacement invalidates the previous conversion, including its
            // finally handler. Restore the control before validating this file.
            nextButton.disabled = false;
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10000000) { error.textContent = c.imageError; return; }
            nextButton.disabled = true; error.textContent = c.processing;
            var source = URL.createObjectURL(file);
            try {
              var image = new Image(); image.src = source; await image.decode();
              if (!image.naturalWidth || image.naturalWidth * image.naturalHeight > 80000000) throw Error('Image too large');
              // Re-encode pixels only: exclude EXIF, geolocation and the original filename.
              var scale = Math.min(1, 3000 / Math.max(image.naturalWidth, image.naturalHeight));
              var canvas = document.createElement('canvas'); canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale);
              var ctx = canvas.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
              var blob = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/jpeg', .92); });
              if (!blob || blob.size > 10000000) throw Error('Conversion failed');
              if (current !== generation || !d.node.open) return;
              draft.image = blob; photo.replaceChildren(); showPhoto(photo); error.textContent = '';
            } catch (e) { if (current === generation) error.textContent = c.imageError; }
            finally { URL.revokeObjectURL(source); if (current === generation) nextButton.disabled = false; }
          }
        }
        form.appendChild(error);
        nextButton = actions(form, choose);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (draft.type === 'text' && !draft.text.trim()) { input.setCustomValidity(c.text); input.reportValidity(); return; }
          if (draft.type === 'handwriting' && !draft.image) { error.textContent = c.imageNeeded; return; }
          identity();
        });
        stepContent.appendChild(form);
      }
      function identity() {
        screen('identity', c.preference);
        var form = el('form', { class: 'pn-flow' });
        var fieldset = el('fieldset', null, [el('legend', null, [c.preference])]);
        var names = el('div', { class: 'pn-flow' });
        function nameFields() {
          names.replaceChildren();
          if (draft.preference === 'anonymous') return;
          var first = el('input', { required: '', maxlength: '40', autocomplete: 'given-name', pattern: '.*\\S.*', oninput: function (e) { draft.name = e.target.value; } }); first.value = draft.name;
          names.appendChild(el('label', null, [c.name, first]));
          if (draft.preference === 'initial') {
            var initial = el('input', { required: '', maxlength: '1', pattern: '[\\p{L}]', oninput: function (e) { draft.initial = e.target.value; } }); initial.value = draft.initial;
            names.appendChild(el('label', null, [c.initialLabel, initial]));
          }
        }
        [['anonymous', c.anonymous], ['first', c.first], ['initial', c.initial]].forEach(function (item) {
          var radio = el('input', { type: 'radio', name: 'publication-name', value: item[0], onchange: function () { draft.preference = item[0]; nameFields(); } });
          radio.checked = draft.preference === item[0]; fieldset.appendChild(el('label', { class: 'pn-check' }, [radio, item[1]]));
        });
        form.appendChild(fieldset); form.appendChild(names); nameFields();
        var consent = el('input', { type: 'checkbox', required: '', onchange: function (e) { draft.consent = e.target.checked; } }); consent.checked = draft.consent;
        form.appendChild(el('label', { class: 'pn-check' }, [consent, c.consent]));
        form.appendChild(caption(c.moderation)); actions(form, compose);
        form.addEventListener('submit', function (e) { e.preventDefault(); if (draft.consent) review(); });
        stepContent.appendChild(form);
      }
      function review() {
        screen('review', c.review);
        var form = el('form', { class: 'pn-flow' });
        var note = el('div', { class: 'pn-review' });
        if (draft.type === 'text') note.textContent = draft.text.trim(); else showPhoto(note);
        form.appendChild(note); form.appendChild(caption(publicationName()));
        form.appendChild(caption(preview() ? c.previewHint : c.moderation));
        var error = el('p', { role: 'alert', class: 'pn-error' }); form.appendChild(error);
        var submit = actions(form, identity, preview() ? c.previewSend : c.send);
        form.addEventListener('submit', async function (e) {
          e.preventDefault(); if (sending || !draft.consent) return;
          if (preview()) { finish(); return; }
          sending = true; submit.disabled = true; submit.textContent = c.sending; error.textContent = '';
          var controller = new AbortController(), timeout = setTimeout(function () { controller.abort(); }, 20000);
          try {
            // Same FormData/AJAX convention as the existing contact form.
            // Inbox is the moderation queue; this never changes published data.
            var fd = new FormData();
            fd.append('_subject', 'Patient note — moderation required'); fd.append('_captcha', 'false');
            fd.append('language', lang); fd.append('type', draft.type); fd.append('displayName', publicationName());
            fd.append('namePreference', draft.preference); fd.append('publicationConsent', c.consent);
            fd.append('consentTimestamp', new Date().toISOString()); fd.append('published', 'false');
            if (draft.type === 'text') fd.append('message', draft.text.trim());
            else fd.append('attachment', draft.image, 'patient-note.jpg');
            var response = await fetch('https://formsubmit.co/ajax/galstyan.levon@gmail.com', { method: 'POST', headers: { Accept: 'application/json' }, body: fd, signal: controller.signal });
            if (!response.ok) throw Error('Request failed');
            var result = await response.json(); if (result.success !== true && result.success !== 'true') throw Error('Rejected');
            if (d.node.open) finish();
          } catch (err) { if (d.node.open) { error.textContent = c.sendError; submit.disabled = false; submit.textContent = c.send; } }
          finally { clearTimeout(timeout); sending = false; }
        });
        stepContent.appendChild(form);
      }
      function finish() {
        draft = drafts[lang] = blank();
        if (fileURL) { URL.revokeObjectURL(fileURL); fileURL = null; }
        screen('done', preview() ? c.done : c.received);
        stepContent.appendChild(el('div', { class: 'pn-flow', role: 'status' }, [el('p', null, [preview() ? c.doneBody : c.receivedBody]), button(c.close, 'pn-cta', d.close)]));
      }
      choose();
    }
    var page = el('main', { class: 'section pn-page', id: 'patient-notes' });
    var heading = el('div', { class: 'pn-heading' }, [el('h1', { class: 'uppercase-title' }, [c.title])]);
    if (preview()) heading.appendChild(caption(c.intro));
    page.appendChild(heading);
    var grid = el('div', { class: 'pn-grid' });
    var notes = window.PATIENT_NOTES.filter(function (n) { return n.language === lang && (n.demo ? preview() : n.published === true); }).sort(function (a, b) { return a.sortOrder - b.sortOrder; });
    notes.forEach(function (note, index) {
      var card = el('button', { type: 'button', class: 'card pn-card', 'data-note-id': note.id,
        'aria-label': c.open + ' ' + (index + 1), 'aria-haspopup': 'dialog', onclick: function () {
          grid.querySelectorAll('.pn-card').forEach(function (node) { node.classList.toggle('is-active', node === card); });
          view(note, card);
        } });
      if (note.demo) card.appendChild(el('span', { class: 'pn-caption' }, [c.demo]));
      var content = el('span', { class: 'pn-content' }, [note.image ? el('img', { src: note.image, alt: note.text, loading: 'lazy', width: '900', height: '1100' }) : el('span', { class: 'pn-text' }, [note.text])]);
      card.appendChild(el('span', { class: 'pn-surface' }, [content]));
      card.appendChild(el('span', { class: 'pn-meta pn-caption' }, [[note.displayName, note.year].filter(Boolean).join(' · ')]));
      grid.appendChild(card);
    });
    page.appendChild(notes.length ? grid : caption(c.empty));
    var leave = button(c.leave, 'pn-cta', function () { contribute(leave); });
    page.appendChild(el('div', { class: 'pn-contribute' }, [leave]));
    return page;
  }
  window.PatientNotes = { build: build, close: close };
})();
