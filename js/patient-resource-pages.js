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
      return item.status === 'published' && !!item[state.lang] &&
        item.service === service && (item.sub || null) === (sub || null);
    });
  }
  function galleryFor(service, sub) {
    return Object.keys(window.PATIENT_GALLERIES).find(function (key) {
      var item = window.PATIENT_GALLERIES[key];
      var hasPublishedCase = item.status === 'published' && (item.cases || []).some(function (entry) {
        return !!(entry.before && entry.after && entry[state.lang]);
      });
      return hasPublishedCase && item.service === service && (item.sub || null) === (sub || null);
    });
  }
  function resourceLink(kind, key) {
    var L = labels();
    var title = L[kind];
    return el('div', { class: 'section-block patient-resource-link' }, [
      el('h2', null, [title]),
      el('div', { class: 'card-divider' }),
      el('p', null, [el('a', {
        href: routeHref('#/' + kind + '/' + key), 'aria-label': title
      }, [L[kind + 'Body']])])
    ]);
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
  function appendParts(parent, parts) {
    (parts || []).forEach(function (part) {
      if (part.type === 'strong') parent.appendChild(el('strong', null, [part.text]));
      else parent.appendChild(document.createTextNode(part.text));
    });
  }
  function appendGuideBlock(section, block, sectionData) {
    if (block.type === 'table') {
      var rows = block.rows || [];
      if (!rows.length) return;
      var titles = rows[0], table = el('table', { class: 'guide-recovery-table', 'aria-label': sectionData.title });
      table.appendChild(el('thead', null, [el('tr', null, titles.map(function (title) {
        return el('th', { scope: 'col' }, [title]);
      }))]));
      var tbody = el('tbody');
      rows.slice(1).forEach(function (row) {
        tbody.appendChild(el('tr', null, row.map(function (value, index) {
          return el(index === 0 ? 'th' : 'td', index === 0 ? { scope: 'row' } : { 'data-label': titles[index] }, [value]);
        })));
      });
      table.appendChild(tbody); section.appendChild(table); return;
    }
    if (block.type === 'list' || block.type === 'steps') {
      var list = el(block.type === 'steps' ? 'ol' : 'ul', { class: 'guide-list guide-' + block.type });
      (block.items || []).forEach(function (parts) {
        var item = el('li'); appendParts(item, parts); list.appendChild(item);
      });
      section.appendChild(list); return;
    }
    if (block.type === 'subheading') {
      var subheading = el('h4', { class: 'guide-subheading' });
      appendParts(subheading, block.parts); section.appendChild(subheading); return;
    }
    if (block.type === 'timeline') {
      var timeline = el('dl', { class: 'guide-timeline' });
      (block.items || []).forEach(function (item) {
        timeline.appendChild(el('div', null, [el('dt', null, [item.label]), el('dd', null, [item.text])]));
      });
      section.appendChild(timeline); return;
    }
    if (block.type === 'video') {
      section.appendChild(el('div', { class: 'guide-video' }, [
        el('iframe', {
          src: block.url, title: block.title, loading: 'lazy', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', allowfullscreen: ''
        })
      ]));
      return;
    }
    var paragraph = el('p', block.type === 'next' ? { class: 'guide-next' } : (block.type === 'highlight' ? { class: 'guide-highlight' } : null));
    appendParts(paragraph, block.parts); section.appendChild(paragraph);
  }
  function buildGuide(key) {
    var item = window.PATIENT_GUIDES[key];
    if (!item || item.status !== 'published' || !item[state.lang]) return unavailable();
    var data = item[state.lang], L = labels(), frag = document.createDocumentFragment();
    frag.appendChild(header(item, data.title, data.subtitle));
    var wrap = el('article', { class: 'sections-col patient-guide' }), inner = el('div');
    var intro = el('section', { class: 'section-block' }, [el('p', { class: 'guide-author' }, [data.author || L.author])]);
    data.intro.forEach(function (p) { intro.appendChild(el('p', null, [p])); });
    inner.appendChild(intro);
    var routeParts = [el('h2', null, [data.routeTitle || L.contents]), el('p', null, [data.route])];
    if (data.contacts) routeParts.push(el('p', null, [data.contacts]));
    inner.appendChild(el('section', { class: 'guide-route' }, routeParts));
    data.sections.forEach(function (s) {
      var level = s.level || 2;
      var section = el('section', { class: 'section-block guide-section guide-section-level-' + level, id: 'guide-' + s.id, tabindex: '-1' }, [
        el(level === 1 ? 'h2' : 'h3', null, [s.title]), el('div', { class: 'card-divider' })
      ]);
      if (s.id === 'discharge') {
        var referenceList = el('ul', { class: 'guide-reference-list' });
        (s.blocks || []).forEach(function (block) {
          var text = (block.parts || []).map(function (part) { return part.text; }).join('')
            .replace(/\s*[:՝]\s*_+\s*$/, '');
          referenceList.appendChild(el('li', null, [text]));
        });
        section.appendChild(referenceList);
      } else {
        (s.blocks || []).forEach(function (block) { appendGuideBlock(section, block, s); });
      }
      inner.appendChild(section);
    });
    wrap.appendChild(inner); frag.appendChild(wrap);
    return frag;
  }
  function buildGallery(key) {
    var item = window.PATIENT_GALLERIES[key];
    if (!item || item.status !== 'published' || !(item.cases || []).some(function (entry) {
      return !!(entry.before && entry.after && entry[state.lang]);
    })) return unavailable();
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
