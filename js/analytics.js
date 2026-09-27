/* Yandex Metrica with a persistent visitor opt-out. */
(function () {
  'use strict';
  var COUNTER_ID = 98511055;
  var HOST = 'www.levongalstyan.com';
  var KEY = 'galstyan.analytics-consent.v1';
  // Temporary: restore automatic notice only when the site owner requests it.
  var SHOW_AUTOMATIC_NOTICE = false;
  // Set true when restoring opt-in; never overwrite the visitor's saved choice.
  var REQUIRE_OPT_IN = false;
  var allowed = location.hostname === HOST && !/^\/preview(?:\/|$)/i.test(location.pathname);
  var choice = null, active = false, loading = false, loaded = false, lastPage = null;
  var panel;
  try { choice = localStorage.getItem(KEY); } catch (e) { /* storage is optional */ }
  function mayTrack() { return choice === 'accept' || (!REQUIRE_OPT_IN && choice !== 'reject'); }

  function language() { return document.documentElement.lang === 'en' ? 'en' : 'hy'; }
  var copy = {
    hy: {
      message: 'Այս կայքն օգտագործում է «Յանդեքս Մետրիկան»՝ այցելությունների և կապ հաստատելու գործողությունների վիճակագրության համար։ Հաղորդագրությունների և ձևաթղթերի բովանդակությունը վերլուծական համակարգ չի փոխանցվում։ Վերլուծությունը կարող եք անջատել այստեղ։',
      accept: 'Միացնել', reject: 'Անջատել', settings: 'Վերլուծության կարգավորումներ'
    },
    en: {
      message: 'This site uses Yandex Metrica to measure visits and actions leading to an enquiry. The contents of messages and forms are not sent to analytics. You can disable analytics here.',
      accept: 'Enable', reject: 'Disable', settings: 'Analytics settings'
    }
  };
  function safePage() {
    if (!allowed || !Array.isArray(window.SHARE_PAGES)) return null;
    var path = location.pathname;
    if (path === '/') path = '/hy/';
    if (!window.SHARE_PAGES.some(function (p) { return '/' + p.path === path; })) return null;
    return location.origin + path; // No search, hash, title, or user-supplied values.
  }
  function safeReferrer(value) {
    try {
      var url = new URL(value);
      return /^https?:$/.test(url.protocol) ? url.origin + '/' : '';
    } catch (e) { return ''; }
  }
  function sendPage(countContact) {
    if (!active || typeof window.ym !== 'function') return;
    var page = safePage();
    if (!page || page === lastPage) return;
    var from = lastPage || safeReferrer(document.referrer);
    window.ym(COUNTER_ID, 'hit', page, { referer: from, title: '' });
    lastPage = page;
    if (countContact && /\/(hy|en)\/contact\/$/.test(new URL(page).pathname)) goal('contact_open');
  }
  function start() {
    if (!allowed || !Number.isSafeInteger(COUNTER_ID) || COUNTER_ID <= 0 || !mayTrack()) return;
    if (active) return;
    if (loaded) { initialise(); return; }
    if (loading) return;
    loading = true;
    // Official async queue. Loading failure leaves the website and form unaffected.
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = 1 * new Date();
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.onload = function () { loading = false; loaded = true; if (mayTrack()) initialise(); };
    script.onerror = function () { loading = false; script.remove(); };
    document.head.appendChild(script);
  }
  function initialise() {
    if (active || !mayTrack() || !allowed) return;
    active = true;
    window.ym(COUNTER_ID, 'init', {
      defer: true, webvisor: false, clickmap: false, trackLinks: false,
      trackHash: false, sendTitle: false, accurateTrackBounce: false,
      disableYtm: true
    });
    sendPage(false);
  }
  function goal(id) {
    if (active && /^(contact_open|contact_success)$/.test(id) && typeof window.ym === 'function') {
      window.ym(COUNTER_ID, 'reachGoal', id); // No form fields, URL or event parameters.
    }
  }
  function setChoice(value) {
    choice = value;
    try { localStorage.setItem(KEY, value); } catch (e) { /* current page only */ }
    if (value === 'reject' && active) {
      window.ym(COUNTER_ID, 'destruct');
      active = false;
      lastPage = null;
    }
    if (value === 'accept') start();
    paint();
  }
  function paint() {
    if (!panel) return;
    var c = copy[language()];
    panel.querySelector('p').textContent = c.message;
    panel.querySelector('[data-choice="accept"]').textContent = c.accept;
    panel.querySelector('[data-choice="reject"]').textContent = c.reject;
    panel.hidden = !SHOW_AUTOMATIC_NOTICE || choice === 'accept' || choice === 'reject';
  }
  function openSettings() { if (panel) { panel.hidden = false; paint(); panel.hidden = false; panel.querySelector('button').focus(); } }
  function initUi() {
    if (!allowed) return;
    panel = document.createElement('aside');
    panel.className = 'analytics-consent';
    panel.setAttribute('aria-label', 'Analytics consent');
    var message = document.createElement('p');
    panel.appendChild(message);
    ['reject', 'accept'].forEach(function (value) {
      var button = document.createElement('button');
      button.type = 'button'; button.dataset.choice = value;
      button.addEventListener('click', function () { setChoice(value); });
      panel.appendChild(button);
    });
    document.body.appendChild(panel);
    paint();
    if (mayTrack()) start();
  }
  window.SiteAnalytics = { pageView: function () { paint(); sendPage(true); }, goal: goal, openSettings: openSettings };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initUi);
  else initUi();
})();
