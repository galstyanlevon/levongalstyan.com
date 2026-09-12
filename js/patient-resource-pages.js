/* Reuses the site's section, type and form components. No external runtime. */
window.createPatientResourcePages = function (ui) {
  'use strict';
  var el = ui.el, state = ui.state;
  function labels() { return window.RESOURCE_LABELS[state.lang]; }
  function routeHref(route) {
    var page = (window.SHARE_PAGES || []).find(function (entry) { return entry.lang === state.lang && entry.route === route; });
    return page ? new URL(page.path, document.baseURI).href : route;
  }
  function guideFor(service, sub) {
    return Object.keys(window.PATIENT_GUIDES).find(function (key) {
      var item = window.PATIENT_GUIDES[key];
      return item.service === service && (item.sub || null) === (sub || null);
    });
  }
  function galleryFor(service, sub) {
    return Object.keys(window.PATIENT_GALLERIES).find(function (key) {
      var item = window.PATIENT_GALLERIES[key];
      return item.service === service && (item.sub || null) === (sub || null);
    });
  }
  function resourceLink(kind, key) {
    var L = labels();
    var title = L[kind];
    return el('a', {
      class: 'section-block patient-resource-link', href: routeHref('#/' + kind + '/' + key),
      'aria-label': title
    }, [el('h2', null, [title]), el('div', { class: 'card-divider' }), el('p', null, [L[kind + 'Body']])]);
  }
  function appendLinks(inner, service, sub) {
    var guide = guideFor(service, sub), gallery = galleryFor(service, sub);
    if (guide) inner.appendChild(resourceLink('guide', guide));
    if (gallery) inner.appendChild(resourceLink('gallery', gallery));
  }
  function hasLinks(service, sub) { return !!(guideFor(service, sub) || galleryFor(service, sub)); }
  function parentRoute(item) { return routeHref(item.sub ? '#/sub/' + item.sub : '#/service/' + item.service); }
  function titleFor(item) {
    return item.sub ? ui.t().subServices[item.sub].title : ui.t().services[item.service].title.replace(/\n/g, ' ');
  }
  function header(item, title, subtitle) {
    return el('section', { class: 'section section-dark service-hero' }, [
      el('a', { class: 'back-link', href: parentRoute(item) }, [labels().back]),
      el('h1', { class: 'service-title' }, [title]),
      subtitle ? el('p', { class: 'service-body' }, [subtitle]) : null
    ]);
  }
  function contact() {
    return el('section', { class: 'section section-peach center-col' }, [
      el('h2', { class: 'uppercase-title' }, [ui.t().scheduleTitle]), ui.buildContactForm()
    ]);
  }
  function unavailable() {
    return el('section', { class: 'section center-col' }, [
      el('h1', { class: 'service-title' }, [labels().missing]),
      el('a', { href: '#services' }, [ui.t().allServices])
    ]);
  }
  function buildGuide(key) {
    var item = window.PATIENT_GUIDES[key];
    if (!item || !item[state.lang]) return unavailable();
    var data = item[state.lang], L = labels(), frag = document.createDocumentFragment();
    frag.appendChild(header(item, data.title, data.subtitle));
    var wrap = el('article', { class: 'sections-col patient-guide' }), inner = el('div');
    var intro = el('section', { class: 'section-block' }, [el('p', { class: 'guide-author' }, [L.author])]);
    data.intro.forEach(function (p) { intro.appendChild(el('p', null, [p])); });
    intro.appendChild(el('p', { class: 'guide-route' }, [data.route]));
    intro.appendChild(el('p', null, [data.contacts]));
    inner.appendChild(intro);
    var toc = el('nav', { class: 'guide-contents', 'aria-label': L.contents }, [el('h2', null, [L.contents])]);
    var list = el('ol');
    data.sections.forEach(function (s) {
      // Keep section navigation local instead of passing its anchor to the site router.
      list.appendChild(el('li', null, [el('a', {
        href: '#guide-' + s.id,
        onclick: function (event) {
          event.preventDefault();
          var target = document.getElementById('guide-' + s.id);
          if (target) { target.scrollIntoView({ block: 'start' }); target.focus({ preventScroll: true }); }
        }
      }, [s.title])]));
    });
    toc.appendChild(list); inner.appendChild(toc);
    data.sections.forEach(function (s) {
      var section = el('section', { class: 'section-block guide-section', id: 'guide-' + s.id, tabindex: '-1' }, [
        el('h2', null, [s.title]), el('div', { class: 'card-divider' })
      ]);
      s.paragraphs.forEach(function (p) { section.appendChild(el('p', null, [p])); });
      if (s.rows) {
        var table = el('table', { class: 'guide-recovery-table' });
        table.setAttribute('aria-label', s.title);
        var titles = [L.period, L.expect, L.diet];
        table.appendChild(el('thead', null, [el('tr', null, titles.map(function (title) { return el('th', { scope: 'col' }, [title]); }))]));
        var tbody = el('tbody');
        s.rows.forEach(function (row) {
          tbody.appendChild(el('tr', null, row.map(function (value, index) {
            return el(index === 0 ? 'th' : 'td', index === 0 ? { scope: 'row' } : { 'data-label': titles[index] }, [value]);
          })));
        });
        table.appendChild(tbody); section.appendChild(table);
      }
      if (s.next) section.appendChild(el('p', { class: 'guide-next' }, [el('strong', null, [L.next + ': ']), s.next]));
      inner.appendChild(section);
    });
    var sources = el('section', { class: 'section-block' }, [el('h2', null, [L.bibliography]), el('div', { class: 'card-divider' })]);
    item.sources.forEach(function (source) { sources.appendChild(el('p', null, [source])); });
    inner.appendChild(sources); wrap.appendChild(inner); frag.appendChild(wrap);
    frag.appendChild(contact());
    return frag;
  }
  function buildGallery(key) {
    var item = window.PATIENT_GALLERIES[key];
    if (!item) return unavailable();
    var L = labels(), frag = document.createDocumentFragment();
    frag.appendChild(header(item, L.gallery, titleFor(item)));
    var section = el('section', { class: 'sections-col' }), inner = el('div');
    if (!item.cases.length) inner.appendChild(el('p', null, [L.emptyGallery]));
    item.cases.forEach(function (entry) {
      var copy = entry[state.lang];
      if (!copy) return;
      var pair = el('figure', { class: 'patient-photo-case' });
      var images = el('div', { class: 'patient-photo-pair' });
      ['before', 'after'].forEach(function (side) {
        images.appendChild(el('div', null, [
          el('p', null, [L[side]]),
          el('img', { src: entry[side], alt: copy[side + 'Alt'], loading: 'lazy', decoding: 'async' })
        ]));
      });
      pair.appendChild(images); pair.appendChild(el('figcaption', null, [copy.caption])); inner.appendChild(pair);
    });
    section.appendChild(inner); frag.appendChild(section); frag.appendChild(contact());
    return frag;
  }
  return { appendLinks: appendLinks, hasLinks: hasLinks, buildGuide: buildGuide, buildGallery: buildGallery };
};
