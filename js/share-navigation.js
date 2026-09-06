/* Static share pages keep legacy hash navigation and relative assets working. */
(function () {
  'use strict';
  var pages = window.SHARE_PAGES || [];
  var root = new URL('.', document.baseURI);
  window.currentSharePage = function () {
    return pages.find(function (p) { return new URL(p.path, root).pathname === location.pathname; });
  };
  window.syncSharePage = function (lang, route) {
    route = route || location.hash || (window.currentSharePage() || {}).route || '#home';
    if (route === '#/patients/faq') route = '#faq';
    var page = pages.find(function (p) { return p.lang === lang && p.route === route; });
    if (!page) return;
    var url = new URL(page.path, root);
    if (route.indexOf('#/') !== 0 && route !== '#home') url.hash = route;
    history.replaceState(null, '', url.href);
    document.documentElement.lang = lang;
    document.title = page.title + ' — Dr. Levon Galstyan';
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://www.levongalstyan.com/' + page.path;
    [['og:title',page.title],['og:description',page.description],['og:url',url.origin+url.pathname],['twitter:title',page.title],['twitter:description',page.description]].forEach(function (item) {
      var node = document.querySelector('meta[property="'+item[0]+'"],meta[name="'+item[0]+'"]');
      if (node) node.content = item[1];
    });
  };
  // A base URL fixes assets on deep pages; intercept hash links so navigation stays local.
  document.addEventListener('click', function (event) {
    var a = event.target.closest('a[href^="#"]');
    if (!a || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    location.hash = a.getAttribute('href');
  });
})();
