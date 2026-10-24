/* Vanilla JS site logic — no templating, no eval, no external runtime. */
(function () {
  "use strict";
  var CONTENT = window.CONTENT, SUB_PARENT = window.SUB_PARENT, CRED = window.CRED, HREFS = window.HREFS;

  var formDraft = { name: "", phone: "", email: "", message: "", contact_method: "" };
  var formSending = false;
  var formError = false;
  var state = {
    lang: (function () { var explicit = document.documentElement.dataset.pageLang; if (explicit === "hy" || explicit === "en") return explicit; try { var s = localStorage.getItem("galstyan.lang"); return (s === "hy" || s === "en") ? s : "hy"; } catch (e) { return "hy"; } })(),
    mobile: window.innerWidth < 1180,
    phone: window.innerWidth < 768,
    menuOpen: false,
    servicesOpen: false,
    mobileServices: {},
    drawerSection: null,
    drawerService: null,
    route: null,
    open: -1,
    openQ: null,
    cred: 2,
    sent: false,
    service: "",
    moved: false
  };

  function setState(patch) { Object.assign(state, patch); render(); }
  function t() { return CONTENT[state.lang]; }
  var resourcePages = window.createPatientResourcePages({ el: el, state: state, t: t, buildContactForm: buildContactForm });

  /* ---------- DOM helper (no innerHTML with dynamic data, no eval) ---------- */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null) return;
        if (k === "style" && typeof v === "object") Object.assign(node.style, v);
        else if (k.indexOf("on") === 0 && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === "class") node.className = v;
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      if (typeof c === "string" || typeof c === "number") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }
  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(attrs, pathAttrsList) {
    var s = document.createElementNS(SVG_NS, "svg");
    Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    pathAttrsList.forEach(function (pa) {
      var tag = pa.tag || "path";
      var p = document.createElementNS(SVG_NS, tag);
      Object.keys(pa).forEach(function (k) { if (k !== "tag") p.setAttribute(k, pa[k]); });
      s.appendChild(p);
    });
    return s;
  }
  function logoIcon(fill) {
    return svg({ width: "32", height: "36.683", viewBox: "0 0 32 36.683", fill: fill || "#272A3C", "aria-hidden": "true" }, [
      { d: "M 29.403 34.074 L 2.555 34.074 L 2.555 2.597 L 29.403 2.597 L 29.403 34.074 Z M 29.403 0 L 2.555 0 L 0 2.597 L 0 34.074 L 2.555 36.671 L 29.403 36.671 L 31.958 34.074 L 31.958 2.597 L 29.403 0 Z" },
      { d: "M 0 0 L 0 26.553 L 21.523 26.553 L 21.523 20.142 L 18.879 20.142 L 18.879 23.847 L 2.663 23.847 L 2.663 0 L 0 0 Z", transform: "translate(5.217 4.978)" },
      { d: "M 0 21.965 L 0 0 L 16.788 0 L 16.788 16.939 L 14.125 16.939 L 14.125 2.707 L 2.663 2.707 L 2.663 19.013 L 9.25 19.013 L 9.25 13.105 L 6.026 13.105 L 6.026 10.398 L 11.912 10.398 L 11.912 21.965 L 0 21.965 Z", transform: "translate(9.953 4.978)" }
    ]);
  }
  function bookIcon() {
    var s = logoIcon("#CCCAEE");
    s.setAttribute("width", "10.667"); s.setAttribute("height", "12.228");
    s.setAttribute("class", "card-icon");
    return s;
  }
  function chevron(open, stroke) {
    return svg({ width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: "transform:" + (open ? "rotate(180deg)" : "rotate(0deg)") + ";transition:transform .25s" }, [
      { d: "M 7 1.6 L 7 12.4 M 2.6 8.2 L 7 12.4 L 11.4 8.2", stroke: stroke || "#272A3C", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }
    ]);
  }
  function arrowIcon() {
    return svg({ width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", class: "card-icon", style: "opacity:.5" }, [
      { d: "M 5 2.6 L 9.4 7 L 5 11.4", stroke: "#272A3C", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }
    ]);
  }
  function videoIcon() {
    return svg({ width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true" }, [
      { d: "M 12.2 7 L 2.4 12.6 L 2.4 1.4 Z", stroke: "rgba(39,42,60,0.6)", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }
    ]);
  }
  function gradIcon() {
    return svg({ width: "20", height: "20", viewBox: "0 0 24 24", "aria-hidden": "true" }, [
      { d: "M12 3 L2 8.5 L12 14 L22 8.5 Z", fill: "none", stroke: "rgba(39,42,60,0.4)", "stroke-width": "1.5", "stroke-linejoin": "round" },
      { d: "M6 11 L6 17 L12 20 L18 17 L18 11", fill: "none", stroke: "rgba(39,42,60,0.4)", "stroke-width": "1.5", "stroke-linejoin": "round" }
    ]);
  }
  function briefcaseIcon() {
    return svg({ width: "20", height: "20", viewBox: "0 0 24 24", "aria-hidden": "true" }, [
      { tag: "rect", x: "3", y: "8", width: "18", height: "12", rx: "1.5", fill: "none", stroke: "rgba(39,42,60,0.4)", "stroke-width": "1.5" },
      { d: "M8 8 L8 5.5 C8 4.7 8.7 4 9.5 4 L14.5 4 C15.3 4 16 4.7 16 5.5 L16 8", fill: "none", stroke: "rgba(39,42,60,0.4)", "stroke-width": "1.5" }
    ]);
  }

  function closeAllMenus() {
    state.servicesOpen = false; state.activityOpen = false; state.patientsOpen = false; state.menuOpen = false;
    state.mobileServices = {};
    var mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.remove("open");
      document.getElementById("nav-menu").setAttribute("aria-expanded", "false");
    }
    closeNavigation(false);
  }
  function goService(i) { closeAllMenus(); window.location.hash = "#/service/" + i; }
  function goRoute(name) { closeAllMenus(); window.location.hash = "#/" + name; }
  function goSub(key) { closeAllMenus(); window.location.hash = "#/sub/" + key; }
  function bookService(title) {
    closeAllMenus();
    setState({ service: title, sent: false, route: null, menuOpen: false, servicesOpen: false });
    window.location.hash = "#contact";
  }
  function toggleLang() {
    var keepNavigationFocus = !!state.drawerSection;
    var next = state.lang === "en" ? "hy" : "en";
    try { localStorage.setItem("galstyan.lang", next); } catch (e) {}
    setState({ lang: next });
    if (window.syncSharePage) window.syncSharePage(next);
    if (keepNavigationFocus) document.querySelector(".lang-btn").focus({ preventScroll: true });
  }

  /* ---------- Header ---------- */
  function buildHeader() {
    var mobile = state.mobile, T = t();
    var nav = T.nav.map(function (label, i) { return { label: label, href: HREFS[i], isServices: i === 1, isInsights: i === 2, isPatients: i === 3 }; });
    var header = el("header", { class: "site-header" });
    header.appendChild(el("a", { href: "#home", class: "logo-link", "aria-label": "Dr. Levon Galstyan" }, [logoIcon()]));
    if (!mobile) {
      var navEl = el("nav", { class: "main-nav" });
      nav.forEach(function (item) {
        if (item.isServices) {
          navEl.appendChild(el("button", {
            type: "button", class: "services-toggle", id: "nav-services",
            "aria-controls": "navigation-drawer", "aria-expanded": "false", "data-nav-section": "services",
            onclick: function (event) { toggleNavigation("services", event.currentTarget.id); }
          }, [el("span", null, [item.label])]));
        } else if (item.isInsights) {
          navEl.appendChild(el("button", {
            type: "button", class: "services-toggle", id: "nav-activity",
            "aria-controls": "navigation-drawer", "aria-expanded": "false", "data-nav-section": "activity",
            onclick: function (event) { toggleNavigation("activity", event.currentTarget.id); }
          }, [el("span", null, [item.label])]));
        } else if (item.isPatients) {
          navEl.appendChild(el("button", {
            type: "button", class: "services-toggle", id: "nav-patients",
            "aria-controls": "navigation-drawer", "aria-expanded": "false", "data-nav-section": "patients",
            onclick: function (event) { toggleNavigation("patients", event.currentTarget.id); }
          }, [el("span", null, [item.label])]));
        } else {
          navEl.appendChild(el("a", { href: item.href, onclick: closeAllMenus }, [item.label]));
        }
      });
      header.appendChild(navEl);
    }
    header.appendChild(el("div", { class: "spacer" }));
    if (mobile) {
      header.appendChild(el("button", {
        type: "button", class: "hamburger", id: "nav-menu", "aria-label": T.menuLabels.menu,
        "aria-expanded": String(state.phone ? state.menuOpen : !!state.drawerSection),
        "aria-controls": state.phone ? "mobile-menu" : "navigation-drawer",
        onclick: function () { if (state.phone) setState({ menuOpen: !state.menuOpen }); else toggleNavigation("menu", "nav-menu"); }
      }, [el("span"), el("span"), el("span")]));
    }
    header.appendChild(el("button", { type: "button", class: "lang-btn", onclick: toggleLang }, [T.langLabel]));
    header.appendChild(el("a", { href: "/" + state.lang + "/contact/", class: "contacts-btn", onclick: closeAllMenus }, [T.contacts]));
    return header;
  }

  var SUB_IMAGES = {
    rhinoplasty: "images/subs/rhinoplasty.png",
    blepharoplasty: "images/subs/blepharoplasty.png",
    browlift: "images/subs/browlift.jpg",
    ottoplasty: "images/subs/ottoplasty.png",
    cheiloplasty: "images/subs/cheiloplasty.png",
    mucogingival: "images/subs/mucogingival.jpg",
    sinuslifting: "images/subs/sinuslifting.jpg",
    gbr: "images/subs/gbr.jpg",
    immediateimplants: "images/subs/immediateimplants.jpg",
    digitalimplant: "images/subs/digitalimplant.jpeg",
    removabledentures: "images/subs/removabledentures.jpeg",
    fixeddentures: "images/subs/fixeddentures.jpg"
  };
  function subsFor(index, T) {
    var map = {
      0: ["rhinoplasty", "blepharoplasty", "browlift", "ottoplasty", "cheiloplasty"],
      1: ["mucogingival", "sinuslifting", "gbr"],
      2: ["immediateimplants", "digitalimplant", "removabledentures", "fixeddentures"]
    };
    var keys = map[index];
    if (!keys) return null;
    return keys.map(function (k) { return { title: T.subServices[k].title, key: k }; });
  }

  var INSIGHT_KEYS = ["publications", "conferences", "lectures", "videos"];
  var navigationOpener = null;
  function focusNavigationTitle() {
    var title = document.getElementById("navigation-subtitle");
    if (!title || title.hidden) title = document.getElementById("navigation-title");
    if (title) title.focus({ preventScroll: true });
  }
  function closeNavigation(restoreFocus) {
    state.drawerSection = null; state.drawerService = null;
    syncNavigation();
    var opener = navigationOpener && document.getElementById(navigationOpener);
    if (restoreFocus && opener) opener.focus({ preventScroll: true });
    navigationOpener = null;
  }
  function toggleNavigation(section, openerId) {
    if (state.phone) return;
    if (state.drawerSection === section || (section === "menu" && state.drawerSection)) {
      closeNavigation(true); return;
    }
    navigationOpener = openerId;
    showNavigationSection(section);
  }
  function showNavigationSection(section) {
    state.drawerSection = section; state.drawerService = null;
    syncNavigation(); focusNavigationTitle();
  }
  function showNavigationService(index) {
    state.drawerService = index;
    syncNavigation(); focusNavigationTitle();
  }
  function backNavigation() {
    var service = state.drawerService, section = state.drawerSection;
    if (service != null) state.drawerService = null;
    else state.drawerSection = "menu";
    syncNavigation();
    var selector = service != null ? '[data-drawer-service="' + service + '"]' : '[data-drawer-section="' + section + '"]';
    var previous = document.querySelector("#navigation-drawer " + selector);
    if (previous) previous.focus({ preventScroll: true });
    else focusNavigationTitle();
  }
  function buildNavigationDrawer() {
    if (state.phone) return null;
    var T = t();
    return el("aside", {
      id: "navigation-drawer", class: "navigation-drawer", "aria-labelledby": "navigation-title", "aria-hidden": "true", inert: ""
    }, [
      el("div", { class: "navigation-drawer-head" }, [
        el("div", { class: "navigation-drawer-controls" }, [
          el("button", { type: "button", class: "navigation-back", hidden: "", onclick: backNavigation }, [
            el("span", { "aria-hidden": "true" }, ["←"]), el("span", null, [T.menuLabels.back])
          ]),
          el("button", { type: "button", class: "navigation-close", "aria-label": T.menuLabels.close, onclick: function () { closeNavigation(true); } }, [el("span", { "aria-hidden": "true" }, ["×"])])
        ]),
        el("h2", { id: "navigation-title", tabindex: "-1" }, [T.menuLabels.menu]),
        el("h3", { id: "navigation-subtitle", tabindex: "-1", hidden: "" })
      ]),
      el("nav", { class: "navigation-drawer-list", "aria-labelledby": "navigation-title" })
    ]);
  }
  function syncNavigation() {
    var drawer = document.getElementById("navigation-drawer");
    if (!drawer) return;
    var section = state.drawerSection, open = !!section, T = t();
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) drawer.removeAttribute("inert"); else drawer.setAttribute("inert", "");
    document.querySelectorAll("[data-nav-section]").forEach(function (button) {
      button.setAttribute("aria-expanded", String(button.getAttribute("data-nav-section") === section));
    });
    var hamburger = document.getElementById("nav-menu");
    if (hamburger) hamburger.setAttribute("aria-expanded", String(open));
    if (!open) return;

    var list = drawer.querySelector(".navigation-drawer-list");
    var title = drawer.querySelector("#navigation-title");
    var service = state.drawerService;
    var labels = { menu: T.menuLabels.menu, services: T.nav[1], activity: T.nav[2], patients: T.nav[3] };
    title.textContent = labels[section];
    var subtitle = drawer.querySelector("#navigation-subtitle");
    subtitle.hidden = service == null;
    subtitle.textContent = service != null ? T.services[service].title.replace(/\n/g, " ") : "";
    list.setAttribute("aria-labelledby", service != null ? "navigation-subtitle" : "navigation-title");
    list.classList.toggle("navigation-categories", service == null && (section === "services" || section === "menu"));
    drawer.querySelector(".navigation-back").hidden = service == null && (!state.mobile || section === "menu");
    list.replaceChildren();
    list.scrollTop = 0;
    function link(label, href, overview) {
      list.appendChild(el("a", { href: href, class: "navigation-row" + (overview ? " navigation-overview" : ""), onclick: closeAllMenus }, [
        el("span", null, [label]), el("span", { class: "navigation-link-arrow", "aria-hidden": "true" }, ["↗"])
      ]));
    }
    function branch(label, action, attributes) {
      list.appendChild(el("button", Object.assign({ type: "button", class: "navigation-row", onclick: action }, attributes), [el("span", null, [label]), arrowIcon()]));
    }
    if (service != null) {
      link(T.menuLabels.overview, "#/service/" + service, true);
      subsFor(service, T).forEach(function (sub) { link(sub.title, "#/sub/" + sub.key); });
    } else if (section === "services") {
      T.services.forEach(function (s, index) {
        var label = s.title.replace(/\n/g, " ");
        if (subsFor(index, T)) branch(label, function () { showNavigationService(index); }, { "data-drawer-service": index });
        else link(label, "#/service/" + index);
      });
    } else if (section === "activity") {
      link(T.menuLabels.overview, "#/activity", true);
      INSIGHT_KEYS.forEach(function (key, index) { link(T.insights[index].title, "#/insight/" + key); });
    } else if (section === "patients") {
      window.PATIENT_LINKS[state.lang].forEach(function (p) { link(p.label, "#/patients/" + p.key); });
    } else {
      link(T.nav[0], HREFS[0]);
      ["services", "activity", "patients"].forEach(function (key) {
        branch(labels[key], function () { showNavigationSection(key); }, { "data-drawer-section": key });
      });
    }
  }

  function buildMobileMenu() {
    if (!state.phone) return null;
    var T = t();
    var wrap = el("nav", { id: "mobile-menu", class: "mobile-menu" + (state.menuOpen ? " open" : ""), "aria-label": T.menuLabels.menu });
    function section(label, key, id) {
      var subWrap = el("div", { id: id, class: "mobile-subs", hidden: state[key] ? null : "" });
      var btn = el("button", {
        type: "button", class: "services-toggle-m", "aria-expanded": String(!!state[key]), "aria-controls": id,
        onclick: function () {
          state[key] = !state[key];
          btn.setAttribute("aria-expanded", String(state[key]));
          subWrap.hidden = !state[key];
        }
      }, [el("span", null, [label]), chevron(false)]);
      wrap.appendChild(el("h2", { class: "mobile-section-heading" }, [btn]));
      wrap.appendChild(subWrap);
      return subWrap;
    }
    function mobileLink(label, href, className) {
      return el("a", { href: href, class: className || "mobile-menu-link", onclick: closeAllMenus }, [label]);
    }
    T.nav.forEach(function (label, i) {
      if (i === 1) {
        var subWrap = section(label, "servicesOpen", "mobile-services");
        T.services.forEach(function (s, j) {
          var name = s.title.replace(/\n/g, " "), subs = subsFor(j, T);
          if (subs) {
            var group = el("details", {
              class: "mobile-service-group", open: state.mobileServices[j] ? "" : null,
              ontoggle: function () { state.mobileServices[j] = group.open; }
            }, [el("summary", { class: "mobile-service-heading" }, [el("span", null, [name]), chevron(false)])]);
            var procedures = el("div", { class: "mobile-procedures" }, [mobileLink(T.menuLabels.overview, "#/service/" + j)]);
            subs.forEach(function (sub) { procedures.appendChild(mobileLink(sub.title, "#/sub/" + sub.key)); });
            group.appendChild(procedures);
            subWrap.appendChild(group);
          } else {
            subWrap.appendChild(mobileLink(name, "#/service/" + j, "mobile-service-heading"));
          }
        });
      } else if (i === 2) {
        var asubWrap = section(label, "activityOpen", "mobile-activity");
        INSIGHT_KEYS.forEach(function (k, idx) {
          asubWrap.appendChild(mobileLink(T.insights[idx].title, "#/insight/" + k));
        });
      } else if (i === 3) {
        var psubWrap = section(label, "patientsOpen", "mobile-patients");
        window.PATIENT_LINKS[state.lang].forEach(function (p) {
          psubWrap.appendChild(mobileLink(p.label, "#/patients/" + p.key));
        });
      } else {
        wrap.appendChild(mobileLink(label, HREFS[i], "mobile-top-link"));
      }
    });
    return wrap;
  }

  /* ---------- Landing sections ---------- */
  function readMoreLink(href, label) { return el("a", { href: href, class: "card-link" }, [label]); }

  function buildHero() {
    var T = t();
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { id: "home", class: "hero-banner", style: { backgroundImage: "url('images/hero.webp')" } }));
    var s = el("section", { class: "section section-dark center-col", style: { gap: "24px" } }, [
      el("div", { class: "hero-identity" }, [
        el("h1", { class: "uppercase-title hero-name" }, [
          T.heroPrefix ? el("span", { class: "hero-name-prefix" }, [T.heroPrefix]) : null,
          el("span", null, [T.heroName])
        ]),
        T.heroDegrees ? el("p", { class: "hero-degrees" }, [T.heroDegrees]) : null
      ]),
      el("p", { style: { fontSize: "18px", textAlign: "center" } }, [T.heroRole]),
      el("p", { class: "max-670", style: { marginTop: "26px" } }, [T.heroBlurb]),
      el("button", { type: "button", class: "hero-cta", onclick: function () { bookService(""); } }, [T.cta])
    ]);
    frag.appendChild(s);
    return frag;
  }

  function buildApproach() {
    var T = t();
    var section = el("section", { id: "about", class: "section center-col" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.approachTitle]));
    section.appendChild(el("p", { class: "max-670" }, [T.approachBody]));
    var grid = el("div", { class: "grid" });
    T.approachCards.forEach(function (c, i) {
      var href = c.href || (i === 1 ? "#/education" : i === 2 ? "#/experience" : "#contact");
      var card = el("article", { class: "card card-peach" }, [
        el("h3", null, [c.title]), bookIcon(), el("p", null, [c.body]), readMoreLink(href, T.readMore)
      ]);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    section.appendChild(el("a", { href: "https://www.linkedin.com/in/drlevongalstyan/", target: "_blank", rel: "noopener", "aria-label": "LinkedIn", style: { marginTop: "100px", display: "flex", alignItems: "center", opacity: "0.75" } }, [
      el("img", { src: "images/linkedin.webp", alt: "LinkedIn", style: { height: "22px", width: "auto" } })
    ]));
    return section;
  }

  function buildServicesGrid() {
    var T = t();
    var section = el("section", { id: "services", class: "section section-blue" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.servicesTitle]));
    var grid = el("div", { class: "grid" });
    T.services.forEach(function (s, i) {
      grid.appendChild(el("article", { class: "card card-peach", style: { minHeight: "401px" } }, [
        el("h3", null, [s.title]), bookIcon(), el("p", null, [s.body]),
        el("button", { type: "button", class: "card-btn", onclick: function () { goService(i); } }, [T.readMore])
      ]));
    });
    section.appendChild(grid);
    return section;
  }

  function buildCredentials() {
    var T = t();
    var section = el("section", { id: "credentials", class: "section section-dark" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.credentialsTitle]));
    var mobile = state.mobile;
    var vw = window.innerWidth;
    var sidePad = Math.min(50, Math.max(40, vw * 0.035));
    var containerW = Math.min(1340, vw - 2 * sidePad);
    var cardW = mobile ? vw * 0.62 : Math.min(520, vw * 0.36);
    var scale = 0.62;
    var track = el("div", {
      class: "cred-track",
      onpointerdown: function (e) { state.dragX = e.clientX; state.moved = false; },
      onpointerup: onDragEnd,
      onpointercancel: function () { state.dragX = null; state.moved = true; }
    });
    // Keep the page and controls mounted so touch navigation preserves scroll and focus.
    function updateSlides() {
      track.replaceChildren();
      CRED.forEach(function (img, i) {
        var rel = i - state.cred;
        if (rel > CRED.length / 2) rel -= CRED.length;
        if (rel < -CRED.length / 2) rel += CRED.length;
        if (Math.abs(rel) > 1) return;
        var leftPx, scaleVal;
        if (rel === 0) { leftPx = (containerW - cardW) / 2; scaleVal = 1; }
        else if (rel > 0) { scaleVal = scale; leftPx = containerW - cardW * (1 + scale) / 2; }
        else { scaleVal = scale; leftPx = -cardW * (1 - scale) / 2; }
        var slide = el("div", {
          class: "cred-slide",
          style: {
            left: leftPx + "px", width: cardW + "px",
            transform: "translateY(-50%) scale(" + scaleVal + ")",
            opacity: rel === 0 ? "1" : "0.1",
            zIndex: rel === 0 ? "3" : "1",
            cursor: "pointer",
            backgroundImage: "url('" + img + "')"
          },
          onclick: function () {
            if (state.moved) return;
            if (rel === 0) setCred(state.cred + 1);
            else setCred(i);
          }
        });
        track.appendChild(slide);
      });
    }
    updateSlides();
    section.appendChild(track);
    var controls = el("div", { class: "cred-controls" }, [
      el("button", { type: "button", "aria-label": "Previous", onclick: function () { setCred(state.cred - 1); } }, [el("span", { class: "cred-arrow" })]),
      el("span", { class: "cred-counter" }, [(state.cred + 1) + " / " + CRED.length]),
      el("button", { type: "button", "aria-label": "Next", onclick: function () { setCred(state.cred + 1); } }, [el("span", { class: "cred-arrow right" })])
    ]);
    section.appendChild(controls);
    function setCred(i) {
      state.cred = ((i % CRED.length) + CRED.length) % CRED.length;
      updateSlides();
      controls.querySelector(".cred-counter").textContent = (state.cred + 1) + " / " + CRED.length;
    }
    function onDragEnd(e) {
      if (state.dragX == null) return;
      var dx = e.clientX - state.dragX;
      state.dragX = null;
      state.moved = Math.abs(dx) > 8;
      if (dx <= -40) setCred(state.cred + 1);
      else if (dx >= 40) setCred(state.cred - 1);
    }
    return section;
  }

  function buildPatients() {
    var T = t();
    var section = el("section", { id: "patients", class: "section" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.forPatientsTitle]));
    section.appendChild(el("p", { class: "max-670" }, [T.forPatientsBody]));
    var grid = el("div", { class: "grid grid-wide" });
    T.clinics.forEach(function (cl) {
      grid.appendChild(el("article", { class: "card card-cream" }, [
        el("h3", null, [cl.name]), el("div", { class: "card-divider" }), el("p", null, [cl.address]),
        el("a", { href: cl.url, target: "_blank", rel: "noopener", class: "card-link" }, [T.visit])
      ]));
    });
    section.appendChild(grid);
    section.appendChild(el("div", { class: "pn-contribute" }, [el("a", { href: "#/patients/notes", class: "card-link" }, [state.lang === "hy" ? "Բուժառուների խոսքերը" : "Patient Notes"])]));
    return section;
  }

  function buildFaq() {
    var T = t();
    var section = el("section", { id: "faq", class: "section section-dark" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.faqTitle]));
    section.appendChild(el("p", { class: "max-670" }, [T.faqBody]));
    var list = el("div", { class: "faq-list" });
    var faqControls = [];
    function updateFaq() {
      faqControls.forEach(function (entry, i) {
        var categoryOpen = state.open === i;
        entry.categoryChevron.style.transform = categoryOpen ? "rotate(180deg)" : "rotate(0deg)";
        entry.list.classList.toggle("open", categoryOpen);
        entry.questions.forEach(function (question) {
          var questionOpen = state.openQ === question.key;
          question.chevron.style.transform = questionOpen ? "rotate(180deg)" : "rotate(0deg)";
          question.answer.classList.toggle("open", questionOpen);
        });
      });
    }
    T.faq.forEach(function (f, i) {
      var isOpen = state.open === i;
      var item = el("div", { class: "faq-item" });
      var categoryChevron = chevron(isOpen);
      item.appendChild(el("button", { type: "button", class: "faq-head", onclick: function () {
        state.open = state.open === i ? -1 : i;
        updateFaq();
      } }, [
        el("span", null, [f.title]), categoryChevron
      ]));
      item.appendChild(el("div", { class: "faq-badge-row" }, [el("span", { class: "faq-badge" }, [f.count])]));
      var ul = el("ul", { class: "faq-sub-list" + (isOpen ? " open" : "") });
      var questions = [];
      f.items.forEach(function (it, j) {
        var faqGuide = window.FAQ_GUIDE_LINKS && window.FAQ_GUIDE_LINKS[state.lang] && window.FAQ_GUIDE_LINKS[state.lang][it.q];
        var faqVideo = window.FAQ_VIDEOS && window.FAQ_VIDEOS[state.lang] && window.FAQ_VIDEOS[state.lang][it.q];
        var hasVideo = !faqGuide && !!faqVideo;
        var key = i + ":" + j;
        var qOpen = state.openQ === key;
        var li = el("li", { class: "faq-sub-item" });
        var iconsRow = el("span", { class: "faq-q-icons" });
        if (hasVideo) iconsRow.appendChild(videoIcon());
        var questionChevron = chevron(qOpen, "rgba(39,42,60,0.6)");
        iconsRow.appendChild(questionChevron);
        li.appendChild(el("button", { type: "button", class: "faq-q", onclick: function () {
          state.openQ = state.openQ === key ? null : key;
          updateFaq();
        } }, [
          el("span", null, [it.q]), iconsRow
        ]));
        var answerContent = faqGuide ? el("a", {
          href: resourcePages.guideHref(faqGuide), class: "faq-guide-link"
        }, [window.RESOURCE_LABELS[state.lang].guideBody]) : (it.a || "");
        var ans = el("div", { class: "faq-answer" + (qOpen ? " open" : "") }, [el("p", null, [answerContent])]);
        if (hasVideo) {
          var mediaRow = el("div", { class: "faq-media-row" });
          mediaRow.appendChild(el("div", { class: "faq-media video" }, [
            el("iframe", { src: faqVideo.url, title: faqVideo.title, loading: "lazy", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", allowfullscreen: "true", referrerpolicy: "strict-origin-when-cross-origin" })
          ]));
          ans.appendChild(mediaRow);
        }
        li.appendChild(ans);
        ul.appendChild(li);
        questions.push({ key: key, chevron: questionChevron, answer: ans });
      });
      item.appendChild(ul);
      list.appendChild(item);
      faqControls.push({ categoryChevron: categoryChevron, list: ul, questions: questions });
    });
    section.appendChild(list);
    return section;
  }

  function buildContactForm() {
    var T = t();
    var wrap = el("div", { class: "form-wrap" });
    wrap.appendChild(el("div", { class: "sent-panel" + (state.sent ? " show" : ""), role: "status", tabindex: "-1" }, [
      el("p", null, [T.sentTitle]),
      el("button", { type: "button", onclick: function () { setState({ sent: false, service: "" }); } }, [T.again])
    ]));
    var form = el("form", { class: "contact-form" + (state.sent ? " hide" : ""), "aria-busy": String(formSending), onsubmit: function (e) {
      e.preventDefault();
      if (formSending) return;
      updateContactRequirements();
      if (!e.target.reportValidity()) return;
      formSending = true;
      formError = false;
      form.setAttribute("aria-busy", "true");
      form.querySelector(".form-error").hidden = true;
      var delivered = false;
      var fd = new FormData(e.target);
      fd.set("service", T.contactSubjects[subject.value] || subject.value);
      fd.append("_subject", "New inquiry from levongalstyan.com");
      fd.append("_captcha", "false");
      var submitBtn = e.target.querySelector(".form-submit");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = T.sending; }
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 20000);
      fetch("https://formsubmit.co/ajax/galstyan.levon@gmail.com", {
        method: "POST",
        signal: controller.signal,
        headers: { Accept: "application/json" },
        body: fd
      }).then(function (r) {
        if (!r.ok) throw new Error("Request failed");
        return r.json();
      }).then(function (result) {
        if (result.success !== true && result.success !== "true") throw new Error("Submission rejected");
        delivered = true;
        try { if (window.SiteAnalytics) window.SiteAnalytics.goal("contact_success"); } catch (error) { /* Delivery must not depend on analytics. */ }
        formDraft = { name: "", phone: "", email: "", message: "", contact_method: "" };
      }).catch(function () {
        formError = true;
      }).finally(function () {
        clearTimeout(timeout);
        formSending = false;
        setState(delivered ? { sent: true, service: "" } : {});
        var feedback = document.querySelector(delivered ? ".sent-panel.show" : ".form-error");
        if (feedback) feedback.focus();
      });
    } });
    var subject = el("select", { name: "service", onchange: function (e) { state.service = e.target.value; } });
    var currentSubject = state.service || "";
    subject.appendChild(el("option", { value: "" }, [T.phService]));
    Object.keys(T.contactSubjects).forEach(function (key) {
      subject.appendChild(el("option", { value: key }, [T.contactSubjects[key]]));
    });
    if (currentSubject && !Object.prototype.hasOwnProperty.call(T.contactSubjects, currentSubject)) {
      subject.appendChild(el("option", { value: currentSubject }, [currentSubject]));
    }
    subject.value = currentSubject;
    form.appendChild(el("div", { class: "form-row" }, [
      el("label", null, [T.fName + " *", el("input", { name: "name", required: "true", autocomplete: "name" })]),
      el("label", null, [T.fService, subject])
    ]));
    form.appendChild(el("label", null, [T.fMessage, el("textarea", { name: "message", rows: "4", placeholder: T.phMessage, "aria-describedby": "message-help" })]));
    form.appendChild(el("p", { id: "message-help", class: "form-help" }, [T.messageHelp]));
    var method = el("select", { name: "contact_method", "aria-describedby": "contact-details-help", onchange: function () {
      formDraft.contact_method = method.value;
      updateContactRequirements();
    } });
    Object.keys(T.contactMethods).forEach(function (key) {
      method.appendChild(el("option", { value: key }, [T.contactMethods[key]]));
    });
    form.appendChild(el("label", null, [T.fContactMethod, method]));
    form.appendChild(el("div", { class: "form-row" }, [
      el("label", null, [T.fPhone, el("input", { name: "phone", type: "tel", inputmode: "tel", autocomplete: "tel", placeholder: "+374 …", "aria-describedby": "contact-details-help" })]),
      el("label", null, [T.fEmail, el("input", { name: "email", type: "email", inputmode: "email", autocomplete: "email", autocapitalize: "none", spellcheck: "false", placeholder: "name@example.com", "aria-describedby": "contact-details-help" })])
    ]));
    var detailsHelp = el("p", { id: "contact-details-help", class: "form-help", "aria-live": "polite" });
    form.appendChild(detailsHelp);
    function updateContactRequirements() {
      var phone = form.querySelector('[name="phone"]');
      var email = form.querySelector('[name="email"]');
      var needsEmail = method.value === "email";
      var needsPhone = method.value === "whatsapp" || method.value === "telegram" || method.value === "phone";
      phone.required = needsPhone || (!needsEmail && !email.value.trim());
      email.required = needsEmail || (!needsPhone && !phone.value.trim());
      detailsHelp.textContent = T.contactMethodHelp[method.value] || T.contactDetailsHelp;
    }
    form.appendChild(el("p", { class: "form-required" }, [T.requiredFields]));
    form.appendChild(el("p", { class: "form-error", role: "alert", tabindex: "-1", hidden: formError ? null : "true" }, [
      T.sendError + " ", el("a", { href: "mailto:galstyan.levon@gmail.com" }, ["galstyan.levon@gmail.com"])
    ]));
    form.appendChild(el("button", { type: "submit", class: "form-submit", "aria-live": "polite" }, [formSending ? T.sending : T.send]));
    Object.keys(formDraft).forEach(function (key) {
      var input = form.querySelector('[name="' + key + '"]');
      input.value = formDraft[key];
      input.addEventListener("input", function () { formDraft[key] = input.value; updateContactRequirements(); });
    });
    updateContactRequirements();
    form.querySelector(".form-submit").disabled = formSending;
    wrap.appendChild(form);
    return wrap;
  }

  function buildContact() {
    var T = t();
    var section = el("section", { id: "contact", class: "section section-peach center-col" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.scheduleTitle]));
    section.appendChild(buildContactForm());
    return section;
  }

  function buildInsights() {
    var T = t();
    var section = el("section", { id: "insights", class: "section" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.insightsTitle]));
    section.appendChild(el("p", { class: "max-670" }, [T.insightsBody]));
    var grid = el("div", { class: "grid" });
    T.insights.forEach(function (i, idx) {
      var keys = ["publications", "conferences", "lectures", "videos"];
      grid.appendChild(el("article", { class: "card card-cream" }, [
        el("h3", null, [i.title]), bookIcon(), el("p", null, [i.body]),
        el("button", { type: "button", class: "card-btn", onclick: function () { goRoute("insight/" + keys[idx]); } }, [T.readMore])
      ]));
    });
    section.appendChild(grid);
    return section;
  }

  function buildLanding() {
    var frag = document.createDocumentFragment();
    frag.appendChild(buildHero());
    frag.appendChild(buildApproach());
    frag.appendChild(buildServicesGrid());
    frag.appendChild(buildCredentials());
    frag.appendChild(el("div", { class: "banner-img", style: { backgroundImage: "url('images/banner-1.webp')", backgroundPosition: "55% top" } }));
    frag.appendChild(buildPatients());
    frag.appendChild(buildFaq());
    frag.appendChild(buildContact());
    frag.appendChild(el("div", { class: "banner-img", style: { backgroundImage: "url('images/banner-2.webp')", backgroundPosition: "100% 40%" } }));
    frag.appendChild(buildInsights());
    return frag;
  }

  /* ---------- Service page ---------- */
  function buildServicePage(index) {
    var T = t();
    var s = T.services[index];
    var body = index === 0 ? T.facialAestheticIntro : (index === 1 ? T.oralRegenerationIntro : (index === 2 ? T.dentalImplantsIntro : (index === 3 ? T.orthognathicIntro : (index === 4 ? T.breathingIntro : (index === 5 ? T.fessIntro : (index === 6 ? T.snoringIntro : (index === 7 ? T.tearductIntro : (index === 10 ? T.facialInjuriesIntro : (index === 11 ? T.inflammationIntro : (index === 12 ? T.jawCystsIntro : s.body))))))))));
    var sections = index === 1 ? T.oralRegenerationSections : (index === 2 ? T.dentalImplantsSections : (index === 3 ? T.orthognathicSections : (index === 4 ? T.breathingSections : (index === 5 ? T.fessSections : (index === 6 ? T.snoringSections : (index === 7 ? T.tearductSections : (index === 10 ? T.facialInjuriesSections : (index === 11 ? T.inflammationSections : (index === 12 ? T.jawCystsSections : null)))))))));
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("a", { href: "#services", class: "back-link" }, [T.allServices]),
      el("h1", { class: "service-title" }, [s.title]),
      el("p", { class: "service-body" }, [body]),
      el("button", { type: "button", class: "hero-cta", style: { marginTop: "26px" }, onclick: function () { bookService(s.title.replace(/\n/g, " ")); } }, [T.cta])
    ]));
    var serviceVideo = window.SERVICE_VIDEOS && window.SERVICE_VIDEOS[state.lang] && window.SERVICE_VIDEOS[state.lang].services[index];
    if (serviceVideo) frag.appendChild(buildProcedureVideo(serviceVideo));
    if (sections || resourcePages.hasLinks(index)) {
      var wrap = el("section", { class: "sections-col" });
      var inner = el("div");
      (sections || []).forEach(function (sec) {
        inner.appendChild(el("div", { class: "section-block" }, [
          el("h2", null, [sec.title]), el("div", { class: "card-divider" }), el("p", null, [sec.body])
        ]));
      });
      resourcePages.appendLinks(inner, index);
      wrap.appendChild(inner);
      frag.appendChild(wrap);
    }
    if (resourcePages.hasLinks(index)) {
      frag.appendChild(el("section", { class: "section section-peach center-col" }, [
        el("h2", { class: "uppercase-title" }, [T.scheduleTitle]), buildContactForm()
      ]));
    }
    var subs = subsFor(index, T);
    if (subs) {
      var sSec = el("section", { class: "section center-col" });
      sSec.appendChild(el("h2", { class: "uppercase-title" }, [T.relatedProcedures]));
      var grid = el("div", { class: "grid grid-narrow" });
      subs.forEach(function (sub) {
        var img = SUB_IMAGES[sub.key];
        var tileChildren = [el("span", { class: "tile-label" }, [sub.title])];
        if (img) tileChildren.unshift(el("div", { class: "tile-thumb", style: { backgroundImage: "url('" + img + "')", backgroundSize: "cover", backgroundPosition: "center" } }));
        grid.appendChild(el("button", { type: "button", class: "tile", onclick: function () { goSub(sub.key); } }, tileChildren));
      });
      sSec.appendChild(grid);
      frag.appendChild(sSec);
    }
    var otherSec = el("section", { class: "section section-blue" });
    otherSec.appendChild(el("h2", { class: "uppercase-title" }, [T.otherServices]));
    var otherGrid = el("div", { class: "grid" });
    [1, 2, 3].forEach(function (d) {
      var j = (index + d) % T.services.length;
      otherGrid.appendChild(el("article", { class: "card card-peach", style: { minHeight: "340px" } }, [
        el("h3", null, [T.services[j].title]), bookIcon(), el("p", null, [T.services[j].body]),
        el("button", { type: "button", class: "card-btn", onclick: function () { goService(j); } }, [T.readMore])
      ]));
    });
    otherSec.appendChild(otherGrid);
    frag.appendChild(otherSec);
    return frag;
  }

  /* ---------- About pages (bio / education / experience) ---------- */
  function aboutLinks(T, excludeKey) {
    return [
      { key: "bio", title: T.bioTitle, go: function () { goRoute("bio"); } },
      { key: "education", title: T.educationTitle, go: function () { goRoute("education"); } },
      { key: "experience", title: T.experienceTitle, go: function () { goRoute("experience"); } },
      { key: "services", title: T.servicesTitle, go: function () { window.location.hash = "#services"; } }
    ].filter(function (l) { return l.key !== excludeKey; });
  }
  function buildAboutLinksSection(T, excludeKey) {
    var section = el("section", { class: "section section-blue" });
    var grid = el("div", { class: "grid grid-wide" });
    aboutLinks(T, excludeKey).forEach(function (l) {
      grid.appendChild(el("button", { type: "button", class: "about-link-card", onclick: l.go }, [
        el("h3", null, [l.title]), el("span", null, [T.readMore])
      ]));
    });
    section.appendChild(grid);
    return section;
  }

  function buildBioPage() {
    var T = t();
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("a", { href: "#about", class: "back-link" }, [T.back]),
      el("h1", { class: "service-title" }, [T.bioTitle]),
      el("p", { class: "service-body" }, [T.bioIntro])
    ]));
    var wrap = el("section", { class: "sections-col" });
    var inner = el("div", { style: { gap: "26px" } });
    T.bioParagraphs.forEach(function (p) { inner.appendChild(el("p", { style: { color: "rgba(39,42,60,0.8)", textWrap: "pretty" } }, [p])); });
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    frag.appendChild(buildAboutLinksSection(T, "bio"));
    return frag;
  }

  function buildEducationPage() {
    var T = t();
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("a", { href: "#about", class: "back-link" }, [T.back]),
      el("h1", { class: "service-title" }, [T.educationTitle]),
      el("p", { class: "service-body" }, [T.educationIntro])
    ]));
    var wrap = el("section", { class: "sections-col" });
    var inner = el("div");
    T.education.forEach(function (e) {
      inner.appendChild(el("div", { class: "timeline-item" }, [
        el("div", { class: "timeline-head" }, [el("h2", null, [e.school]), el("div", { class: "timeline-icon" }, [gradIcon()])]),
        el("div", { class: "card-divider" }),
        el("p", { class: "desc" }, [e.degree]),
        el("p", { class: "dim" }, [e.years])
      ]));
    });
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    frag.appendChild(buildAboutLinksSection(T, "education"));
    return frag;
  }

  function buildExperiencePage() {
    var T = t();
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("a", { href: "#about", class: "back-link" }, [T.back]),
      el("h1", { class: "service-title" }, [T.experienceTitle]),
      el("p", { class: "service-body" }, [T.experienceIntro])
    ]));
    var wrap = el("section", { class: "sections-col" });
    var inner = el("div");
    T.experience.forEach(function (e) {
      var block = el("div", { class: "timeline-item" }, [
        el("div", { class: "timeline-head" }, [el("h2", null, [e.org]), el("div", { class: "timeline-icon" }, [briefcaseIcon()])]),
        el("div", { class: "card-divider" }),
        el("p", { class: "desc" }, [e.role]),
        el("p", { class: "dim" }, [e.years])
      ]);
      if (e.location) block.appendChild(el("p", { class: "dim" }, [e.location]));
      if (e.note) block.appendChild(el("p", { class: "desc", style: { textWrap: "pretty" } }, [e.note]));
      inner.appendChild(block);
    });
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    frag.appendChild(buildAboutLinksSection(T, "experience"));
    return frag;
  }

  /* ---------- Sub-service page ---------- */
  function buildSubPage(key) {
    var T = t();
    var sub = T.subServices[key];
    var parentIdx = SUB_PARENT[key] || 0;
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("button", { type: "button", class: "back-link", onclick: function () { goService(parentIdx); } }, [T.services[parentIdx].title.replace(/\n/g, " ")]),
      el("h1", { class: "service-title" }, [sub.title]),
      el("p", { class: "service-body" }, [sub.intro])
    ]));
    var subVideo = window.SERVICE_VIDEOS && window.SERVICE_VIDEOS[state.lang] && window.SERVICE_VIDEOS[state.lang].subServices[key];
    if (subVideo) frag.appendChild(buildProcedureVideo(subVideo));
    var wrap = el("section", { class: "sections-col" });
    var inner = el("div");
    sub.sections.forEach(function (sec) {
      inner.appendChild(el("div", { class: "section-block" }, [
        el("h2", null, [sec.title]), el("div", { class: "card-divider" }), el("p", { style: { whiteSpace: "normal" } }, [sec.body])
      ]));
    });
    resourcePages.appendLinks(inner, parentIdx, key);
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    frag.appendChild(el("section", { class: "section section-peach center-col" }, [
      el("h2", { class: "uppercase-title" }, [T.scheduleTitle]),
      buildContactForm()
    ]));
    var otherSec = el("section", { class: "section center-col" });
    otherSec.appendChild(el("h2", { class: "uppercase-title" }, [T.otherProcedures]));
    var grid = el("div", { class: "grid grid-narrow" });
    Object.keys(T.subServices).filter(function (k) { return k !== key; }).forEach(function (k) {
      var img = SUB_IMAGES[k];
      var procedureChildren = [el("span", { class: "tile-label" }, [T.subServices[k].title])];
      if (img) procedureChildren.unshift(el("div", { class: "tile-thumb", style: { backgroundImage: "url('" + img + "')", backgroundSize: "cover", backgroundPosition: "center" } }));
      grid.appendChild(el("button", { type: "button", class: "tile", onclick: function () { goSub(k); } }, procedureChildren));
    });
    otherSec.appendChild(grid);
    frag.appendChild(otherSec);
    return frag;
  }

  function buildProcedureVideo(video) {
    return el("section", { class: "procedure-video-section" }, [
      el("div", { class: "procedure-video-inner" }, [
        el("h2", null, [video.heading]),
        el("div", { class: "card-divider" }),
        el("div", { class: "procedure-video-frame" }, [
          el("iframe", { src: video.url, title: video.title, loading: "lazy", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", allowfullscreen: "true", referrerpolicy: "strict-origin-when-cross-origin" })
        ])
      ])
    ]);
  }

  /* ---------- Activity page ---------- */
  function buildActivityPage() {
    var T = t();
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("h1", { class: "service-title" }, [T.insightsTitle]),
      el("p", { class: "service-body" }, [T.insightsBody])
    ]));
    var section = el("section", { class: "section" });
    var grid = el("div", { class: "grid" });
    T.insights.forEach(function (i, idx) {
      grid.appendChild(el("article", { class: "card card-cream" }, [
        el("h3", null, [i.title]), bookIcon(), el("p", null, [i.body]),
        el("button", { type: "button", class: "card-btn", onclick: function () { goRoute("insight/" + INSIGHT_KEYS[idx]); } }, [T.readMore])
      ]));
    });
    section.appendChild(grid);
    frag.appendChild(section);
    return frag;
  }

  function linkedinIcon() {
    return svg({ width: "16", height: "16", viewBox: "0 0 24 24", "aria-hidden": "true" }, [
      { tag: "rect", x: "2", y: "2", width: "20", height: "20", rx: "3", fill: "none", stroke: "currentColor", "stroke-width": "1.6" },
      { tag: "circle", cx: "7.2", cy: "8.2", r: "1.15", fill: "currentColor" },
      { d: "M7.2 11 L7.2 17", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" },
      { d: "M11.2 17 L11.2 12.8 C11.2 11.2 12.4 10.6 13.4 10.6 C15 10.6 15.5 11.6 15.5 13 L15.5 17", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", fill: "none" },
      { d: "M11.2 13.2 L11.2 17", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" }
    ]);
  }

  /* ---------- Lecture detail page ---------- */
  function buildLectureCarousel(id) {
    var images = window.LECTURE_IMAGES && window.LECTURE_IMAGES[id];
    if (!images || !images.length) return null;
    if (!state.lectureCred) state.lectureCred = {};
    var cur = state.lectureCred[id] || 0;
    var vw = window.innerWidth;
    var mobile = state.mobile;
    var sidePad = Math.min(50, Math.max(40, vw * 0.035));
    var containerW = Math.min(1340, vw - 2 * sidePad);
    var cardW = mobile ? vw * 0.62 : Math.min(700, vw * 0.5);
    var scale = 0.62;
    function setCur(i) {
      cur = ((i % images.length) + images.length) % images.length;
      state.lectureCred[id] = cur;
      updateSlides();
      wrap.querySelector(".lec-carousel-counter").textContent = (cur + 1) + " / " + images.length;
    }
    var track = el("div", {
      class: "lec-carousel-track",
      onpointerdown: function (e) { state.dragX2 = e.clientX; state.moved2 = false; },
      onpointerup: function (e) {
        if (state.dragX2 == null) return;
        var dx = e.clientX - state.dragX2; state.dragX2 = null; state.moved2 = Math.abs(dx) > 8;
        if (dx <= -40) setCur(cur + 1); else if (dx >= 40) setCur(cur - 1);
      },
      onpointercancel: function () { state.dragX2 = null; state.moved2 = true; }
    });
    // Keep the page and controls mounted so touch navigation preserves scroll and focus.
    function updateSlides() {
      track.replaceChildren();
      images.forEach(function (img, i) {
        var rel = i - cur;
        if (rel > images.length / 2) rel -= images.length;
        if (rel < -images.length / 2) rel += images.length;
        if (Math.abs(rel) > 1) return;
        var leftPx, scaleVal;
        if (rel === 0) { leftPx = (containerW - cardW) / 2; scaleVal = 1; }
        else if (rel > 0) { scaleVal = scale; leftPx = containerW - cardW * (1 + scale) / 2; }
        else { scaleVal = scale; leftPx = -cardW * (1 - scale) / 2; }
        track.appendChild(el("div", {
          class: "lec-carousel-slide",
          style: { left: leftPx + "px", width: cardW + "px", transform: "translateY(-50%) scale(" + scaleVal + ")", opacity: rel === 0 ? "1" : "0.1", zIndex: rel === 0 ? "3" : "1", cursor: "pointer", backgroundImage: "url('" + img + "')" },
          onclick: function () { if (state.moved2) return; if (rel === 0) setCur(cur + 1); else setCur(i); }
        }));
      });
    }
    updateSlides();
    var wrap = el("div", { class: "section center-col" }, [track,
      el("div", { class: "lec-carousel-controls" }, [
        el("button", { type: "button", "aria-label": "Previous", onclick: function () { setCur(cur - 1); } }, [el("span", { class: "cred-arrow", style: { borderColor: "#272A3C" } })]),
        el("span", { class: "lec-carousel-counter", style: { color: "rgba(39,42,60,0.7)" } }, [(cur + 1) + " / " + images.length]),
        el("button", { type: "button", "aria-label": "Next", onclick: function () { setCur(cur + 1); } }, [el("span", { class: "cred-arrow right", style: { borderColor: "#272A3C" } })])
      ])
    ]);
    return wrap;
  }
  function buildLecturePage(id) {
    var T = t();
    var lec = window.LECTURES[state.lang].filter(function (l) { return l.id === id; })[0];
    var frag = document.createDocumentFragment();
    if (!lec) return frag;
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("a", { href: "#/insight/lectures", class: "back-link" }, [T.insightPages.lectures.title]),
      el("span", { style: { fontSize: "14px", color: "rgba(238,249,247,0.6)" } }, [lec.date]),
      el("h1", { class: "service-title" }, [lec.title])
    ]));
    var wrap = el("section", { class: "sections-col" });
    wrap.appendChild(el("div", { style: { width: "100%", maxWidth: "900px" } }, [
      el("p", { style: { color: "rgba(39,42,60,0.8)", textWrap: "pretty", fontSize: "16px", lineHeight: "28px" } }, [lec.body])
    ]));
    frag.appendChild(wrap);
    var carousel = buildLectureCarousel(id);
    if (carousel) frag.appendChild(carousel);
    var others = window.LECTURES[state.lang].filter(function (l) { return l.id !== id; });
    var otherLecs = others.slice(0, 4);
    var lecSec = el("section", { class: "section center-col" });
    lecSec.appendChild(el("h2", { class: "uppercase-title" }, [T.insightPages.lectures.title]));
    var lecGrid = el("div", { class: "lec-list" });
    otherLecs.forEach(function (lec2) {
      lecGrid.appendChild(el("button", { type: "button", class: "lec-card", onclick: function () { goRoute("lecture/" + lec2.id); } }, [
        el("span", { class: "lec-date" }, [lec2.date]),
        el("span", { class: "lec-title" }, [lec2.title]),
        el("span", { class: "lec-excerpt" }, [lec2.body])
      ]));
    });
    lecSec.appendChild(lecGrid);
    frag.appendChild(lecSec);
    var otherSec = el("section", { class: "section section-blue" });
    otherSec.appendChild(el("h2", { class: "uppercase-title" }, [T.insightsTitle]));
    var otherGrid = el("div", { class: "grid" });
    T.insights.forEach(function (ins, idx) {
      if (INSIGHT_KEYS[idx] === "lectures") return;
      otherGrid.appendChild(el("article", { class: "card card-peach" }, [
        el("h3", null, [ins.title]), bookIcon(), el("p", null, [ins.body]),
        el("button", { type: "button", class: "card-btn", onclick: function () { goRoute("insight/" + INSIGHT_KEYS[idx]); } }, [T.readMore])
      ]));
    });
    otherSec.appendChild(otherGrid);
    frag.appendChild(otherSec);
    return frag;
  }

  function buildOtherInsights(excludeKey) {
    var T = t();
    var section = el("section", { class: "section section-blue" });
    section.appendChild(el("h2", { class: "uppercase-title" }, [T.insightsTitle]));
    var grid = el("div", { class: "grid" });
    T.insights.forEach(function (ins, idx) {
      if (INSIGHT_KEYS[idx] === excludeKey) return;
      grid.appendChild(el("article", { class: "card card-peach" }, [
        el("h3", null, [ins.title]), bookIcon(), el("p", null, [ins.body]),
        el("button", { type: "button", class: "card-btn", onclick: function () { goRoute("insight/" + INSIGHT_KEYS[idx]); } }, [T.readMore])
      ]));
    });
    section.appendChild(grid);
    return section;
  }

  /* ---------- Patients sub pages (FAQ / Addresses / Useful Info) ---------- */
  function buildPatientsSubPage(key) {
    var T = t();
    if (key === "notes") return window.PatientNotes.build(state.lang, el);
    if (key === "faq") { window.location.replace("#faq"); return document.createDocumentFragment(); }
    var frag = document.createDocumentFragment();
    if (key === "addresses") {
      frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
        el("h1", { class: "service-title" }, [window.PATIENT_LINKS[state.lang][1].label])
      ]));
      var section = el("section", { class: "section", style: { paddingTop: "100px" } });
      var grid = el("div", { class: "grid grid-wide", style: { marginTop: "0" } });
      T.clinics.forEach(function (cl) {
        grid.appendChild(el("article", { class: "card card-cream" }, [
          el("h3", null, [cl.name]), el("div", { class: "card-divider" }), el("p", null, [cl.address]),
          el("a", { href: cl.url, target: "_blank", rel: "noopener", class: "card-link" }, [T.visit])
        ]));
      });
      section.appendChild(grid);
      frag.appendChild(section);
      return frag;
    }
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("h1", { class: "service-title" }, [T.usefulInfoTitle]),
      el("p", { class: "service-body" }, [T.usefulInfoIntro])
    ]));
    var wrap = el("section", { class: "sections-col" });
    var inner = el("div");
    T.usefulInfoSections.forEach(function (sec) {
      inner.appendChild(el("div", { class: "section-block" }, [
        el("h2", null, [sec.title]), el("div", { class: "card-divider" }), el("p", null, [sec.body])
      ]));
    });
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    frag.appendChild(el("section", { class: "section section-peach center-col" }, [
      el("h2", { class: "uppercase-title" }, [T.scheduleTitle]),
      buildContactForm()
    ]));
    return frag;
  }

  /* ---------- Insight page ---------- */
  function buildInsightPage(key) {
    var T = t();
    var page = T.insightPages[key];
    var frag = document.createDocumentFragment();
    frag.appendChild(el("section", { class: "section section-dark service-hero" }, [
      el("a", { href: "#insights", class: "back-link" }, [T.insightsTitle]),
      el("h1", { class: "service-title" }, [page.title]),
      el("p", { class: "service-body" }, [page.intro])
    ]));
    var section = el("section", { class: "section center-col" });
    if (key === "publications") {
      var list = el("div", { class: "pub-list" });
      window.PUBLICATIONS.forEach(function (p) {
        list.appendChild(el("div", { class: "pub-item" }, [
          el("div", { class: "pub-main" }, [
            el("span", { class: "pub-title" }, [p.title]),
            el("span", { class: "pub-meta" }, [p.meta]),
            el("a", { href: window.PUBLICATIONS_URL, target: "_blank", rel: "noopener", class: "pub-link", "aria-label": "LinkedIn" }, [
              el("img", { src: "images/linkedin.webp", alt: "LinkedIn", style: { height: "18px", width: "auto" } })
            ])
          ]),
          el("span", { class: "pub-date" }, [p.date])
        ]));
      });
      section.appendChild(list);
      frag.appendChild(section);
      frag.appendChild(buildOtherInsights(key));
      return frag;
    }
    if (key === "conferences") {
      var confList = el("div", { class: "conf-list" });
      window.CONFERENCES[state.lang].forEach(function (c) {
        confList.appendChild(el("div", { class: "conf-item" }, [
          el("span", { class: "conf-meta" }, [c.date + " — " + c.place]),
          el("span", { class: "conf-title" }, [c.title]),
          el("p", { class: "conf-body" }, [c.body])
        ]));
      });
      section.appendChild(confList);
      frag.appendChild(section);
      frag.appendChild(buildOtherInsights(key));
      return frag;
    }
    if (key === "videos") {
      var vidList = el("div", { class: "vid-list" });
      window.VIDEOS[state.lang].forEach(function (v) {
        vidList.appendChild(el("div", { class: "vid-card" }, [
          el("div", { class: "vid-frame-wrap" }, [
            el("iframe", { src: v.url, title: v.title, loading: "lazy", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowfullscreen: "true" })
          ]),
          el("span", { class: "vid-title" }, [v.title])
        ]));
      });
      section.appendChild(vidList);
      frag.appendChild(section);
      frag.appendChild(buildOtherInsights(key));
      return frag;
    }
    if (key === "lectures") {
      var lecList = el("div", { class: "lec-list" });
      window.LECTURES[state.lang].forEach(function (lec) {
        lecList.appendChild(el("button", { type: "button", class: "lec-card", onclick: function () { goRoute("lecture/" + lec.id); } }, [
          el("span", { class: "lec-date" }, [lec.date]),
          el("span", { class: "lec-title" }, [lec.title]),
          el("span", { class: "lec-excerpt" }, [lec.body])
        ]));
      });
      section.appendChild(lecList);
      frag.appendChild(section);
      frag.appendChild(buildOtherInsights(key));
      return frag;
    }
    frag.appendChild(buildOtherInsights(key));
    return frag;
  }

  /* ---------- Footer ---------- */
  function buildFooter() {
    var T = t();
    var footer = el("footer", { class: "site-footer" });
    var cols = el("div", { class: "footer-cols" });
    var footerLinks = [
      ["#/insight/publications", "#/insight/lectures", "#/insight/conferences", "#/insight/videos"],
      ["#/patients/useful-info", "#faq", "#services"],
      ["https://www.facebook.com/share/19KYS2Pe6P/?mibextid=wwXIfr", "https://www.instagram.com/levon.r.galstyan?stkn=MWQwaDc3ZW1ldDI3cw%3D%3D&utm_source=qr", "https://youtube.com/@levongalstyanomfs?si=rwM7Igbz_p-BoLFM", "https://www.linkedin.com/in/drlevongalstyan/"]
    ];
    T.footerCols.forEach(function (col, colIndex) {
      var ul = el("ul");
      col.links.forEach(function (l, linkIndex) {
        var href = footerLinks[colIndex][linkIndex];
        var attrs = { href: href };
        if (href.indexOf("https://") === 0) {
          attrs.target = "_blank";
          attrs.rel = "noopener noreferrer";
        }
        ul.appendChild(el("li", null, [el("a", attrs, [l])]));
      });
      cols.appendChild(el("div", { class: "footer-col" }, [el("p", null, [col.title]), ul]));
    });
    footer.appendChild(cols);
    footer.appendChild(el("div", { class: "footer-divider" }));
    footer.appendChild(logoIcon("#EEF9F7"));
    footer.querySelector("svg").setAttribute("class", "footer-logo");
    footer.appendChild(el("p", { class: "footer-year" }, ["2026"]));
    // Analytics settings link temporarily hidden at the site owner's request.
    return footer;
  }

  /* ---------- Routing ---------- */
  function readHash() {
    var hash = window.location.hash || (window.currentSharePage && (window.currentSharePage() || {}).route) || "";
    var m = /^#\/service\/(\d+)$/.exec(hash);
    var isEdu = hash === "#/education", isExp = hash === "#/experience", isBio = hash === "#/bio";
    var subM = /^#\/sub\/([a-z]+)$/.exec(hash);
    var insightM = /^#\/insight\/([a-z]+)$/.exec(hash);
    var isActivity = hash === "#/activity";
    var lecM = /^#\/lecture\/(\d+)$/.exec(hash);
    var patM = /^#\/patients\/([a-z-]+)$/.exec(hash);
    var resourceM = /^#\/(guide|gallery)\/([a-z-]+)$/.exec(hash);
    var wasRoute = state.route != null;
    var route = m ? Math.max(0, Math.min(parseInt(m[1], 10), 12)) : (isEdu ? "education" : (isExp ? "experience" : (isBio ? "bio" : (subM ? "sub:" + subM[1] : (insightM ? "insight:" + insightM[1] : (isActivity ? "activity" : (lecM ? "lecture:" + lecM[1] : (patM ? "patients:" + patM[1] : null))))))));
    if (resourceM) route = resourceM[1] + ":" + resourceM[2];
    var anchor = (!resourceM && !m && !isEdu && !isExp && !isBio && !subM && !insightM && !isActivity && !lecM && !patM && hash.length > 1) ? hash.slice(1) : null;
    state.route = route; closeAllMenus();
    render();
    if (window.syncSharePage) window.syncSharePage(state.lang, hash);
    if (route != null) { window.scrollTo(0, 0); return; }
    var target = anchor ? document.getElementById(anchor) : null;
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: "instant" });
    else if (wasRoute) window.scrollTo(0, 0);
  }

  /* ---------- Render ---------- */
  function render() {
    if (window.PatientNotes) window.PatientNotes.close();
    var app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(buildHeader());
    var navigation = buildNavigationDrawer();
    if (navigation) app.appendChild(navigation);
    var mobileMenu = buildMobileMenu();
    if (mobileMenu) app.appendChild(mobileMenu);

    if (state.route == null) app.appendChild(buildLanding());
    else if (typeof state.route === "number") app.appendChild(buildServicePage(state.route));
    else if (state.route.indexOf("guide:") === 0) app.appendChild(resourcePages.buildGuide(state.route.slice(6)));
    else if (state.route.indexOf("gallery:") === 0) app.appendChild(resourcePages.buildGallery(state.route.slice(8)));
    else if (state.route === "education") app.appendChild(buildEducationPage());
    else if (state.route === "experience") app.appendChild(buildExperiencePage());
    else if (state.route === "bio") app.appendChild(buildBioPage());
    else if (typeof state.route === "string" && state.route.indexOf("sub:") === 0) app.appendChild(buildSubPage(state.route.slice(4)));
    else if (typeof state.route === "string" && state.route.indexOf("insight:") === 0) app.appendChild(buildInsightPage(state.route.slice(8)));
    else if (state.route === "activity") app.appendChild(buildActivityPage());
    else if (typeof state.route === "string" && state.route.indexOf("lecture:") === 0) app.appendChild(buildLecturePage(parseInt(state.route.slice(8), 10)));
    else if (typeof state.route === "string" && state.route.indexOf("patients:") === 0) app.appendChild(buildPatientsSubPage(state.route.slice(9)));

    app.appendChild(buildFooter());
    syncNavigation();
  }

  function syncMobile() {
    var m = window.innerWidth < 1180;
    var phone = window.innerWidth < 768;
    if (m !== state.mobile || phone !== state.phone) {
      closeAllMenus(); state.mobile = m; state.phone = phone; render();
    }
  }
  function dismissOutsideNavigation(event) {
    // A branch click replaces its own row. The original event path still identifies the drawer.
    var insideNavigation = event.composedPath().some(function (node) {
      return node.nodeType === 1 && node.matches(".site-header, .navigation-drawer");
    });
    if (state.drawerSection && !insideNavigation) closeNavigation(false);
  }
  document.addEventListener("click", dismissOutsideNavigation);
  document.addEventListener("focusin", dismissOutsideNavigation);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.drawerSection) {
      event.preventDefault(); closeNavigation(true);
    }
  });
  window.addEventListener("resize", syncMobile);
  window.addEventListener("hashchange", readHash);
  window.addEventListener("popstate", function () {
    var page = window.currentSharePage && window.currentSharePage();
    if (page) state.lang = page.lang;
    readHash();
  });
  readHash();
  render();
  syncMobile();
  setTimeout(syncMobile, 0);
  window.addEventListener("load", syncMobile);
})();
