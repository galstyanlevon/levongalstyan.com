import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Exercise the actual carousel handlers; a whole-page render is a regression.
const source = fs.readFileSync('js/app.js', 'utf8');
const functions = source.slice(source.indexOf('  function buildCredentials()'), source.indexOf('  function buildPatients()'))
  + source.slice(source.indexOf('  function buildLectureCarousel(id)'), source.indexOf('  function buildLecturePage(id)'));
function el(tag, props = {}, children = []) {
  return {
    tag, props: props || {}, children,
    appendChild(child) { this.children.push(child); },
    replaceChildren(...items) { this.children = items; },
    querySelector(selector) {
      if ((this.props.class || '').split(' ').includes(selector.slice(1))) return this;
      return this.children.filter(c => typeof c === 'object').map(c => c.querySelector(selector)).find(Boolean);
    },
    get textContent() { return this.children.join(''); },
    set textContent(value) { this.children = [value]; }
  };
}
const data = { window: {} };
vm.runInNewContext(fs.readFileSync('js/content.js', 'utf8'), data);
let checked = 0;
for (const lang of ['hy', 'en']) {
  for (const width of [960, 1440]) {
    for (const id of [null, ...Object.keys(data.window.LECTURE_IMAGES)]) {
      const state = { lang, mobile: width < 1180, cred: 2 };
      const context = {
        el, state, CRED: data.window.CRED,
        window: { ...data.window, innerWidth: width },
        t: () => data.window.CONTENT[lang],
        render: () => assert.fail('Carousel must not rebuild the page'),
        setState: () => assert.fail('Carousel must not rebuild the page')
      };
      vm.createContext(context);
      vm.runInContext(functions, context);
      const root = id === null ? context.buildCredentials() : context.buildLectureCarousel(id);
      const prefix = id === null ? '.cred' : '.lec-carousel';
      const track = root.querySelector(prefix + '-track');
      const controls = root.querySelector(prefix + '-controls');
      const counter = root.querySelector(prefix + '-counter');
      const total = Number(counter.textContent.split('/')[1]);
      let current = parseInt(counter.textContent) - 1;
      const check = delta => {
        current = (current + delta + total) % total;
        assert.equal(parseInt(counter.textContent), current + 1);
        assert.strictEqual(root.querySelector(prefix + '-controls'), controls);
        assert.strictEqual(root.querySelector(prefix + '-track'), track);
        const centre = track.children.find(c => c.props.style.zIndex === '3');
        const images = id === null ? data.window.CRED : data.window.LECTURE_IMAGES[id];
        assert.equal(centre.props.style.backgroundImage, "url('" + images[current] + "')");
      };
      // Traverse both ends to check wraparound and repeated button use.
      for (let i = 0; i <= total; i++) { controls.children[2].props.onclick(); check(1); }
      for (let i = 0; i <= total; i++) { controls.children[0].props.onclick(); check(-1); }
      const tap = () => {
        track.props.onpointerdown({ clientX: 500 });
        track.props.onpointerup({ clientX: 500 });
        track.children.find(c => c.props.style.zIndex === '3').props.onclick();
        check(1);
      };
      tap();
      for (const dx of [-100, 100]) {
        track.props.onpointerdown({ clientX: 500 });
        track.props.onpointerup({ clientX: 500 + dx });
        check(dx < 0 ? 1 : -1);
        track.children.find(c => c.props.style.zIndex === '3').props.onclick();
        check(0); // A synthesized click after a swipe must not advance twice.
        tap();
      }
      track.props.onpointerdown({ clientX: 500 });
      track.props.onpointercancel({ clientX: 350 });
      track.props.onpointerup({ clientX: 300 });
      check(0);
      tap();
      checked++;
    }
  }
}
console.log(`PASS ${checked} carousel cases: both languages, tablet/desktop widths, arrows, taps, swipes, cancellation, wraparound; no page render.`);
