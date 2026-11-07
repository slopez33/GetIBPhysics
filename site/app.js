/* getibphysics: a self-contained, offline revision workspace. No network requests. */
(() => {
  'use strict';

  /* ==========================================================================
     Utilities
     ========================================================================== */

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  /* ==========================================================================
     Theme (light / dark)
     ========================================================================== */

  const themeButton = $('#theme-toggle');

  function applyTheme(mode) {
    document.documentElement.dataset.theme = mode;
    const dark = mode === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    $('#theme-label').textContent = dark ? 'Light' : 'Dark';
    $('meta[name="theme-color"]').content = dark ? '#0a0a0a' : '#fafafa';
  }

  applyTheme(document.documentElement.dataset.theme || 'light');

  themeButton.onclick = () => {
    const mode = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(mode);
    try { localStorage.setItem('getibphysics-theme', mode); } catch {}
    announce(`${mode === 'dark' ? 'Dark' : 'Light'} mode enabled.`);
  };

  /* ==========================================================================
     Content and progress state
     ========================================================================== */

  const themes = {
    A: 'Space, time and motion',
    B: 'The particulate nature of matter',
    C: 'Wave behaviour',
    D: 'Fields',
    E: 'Nuclear and quantum physics'
  };
  const topics = globalThis.TOPICS || [];
  const questions = [...(globalThis.QUESTION_AB || []), ...(globalThis.QUESTION_CDE || [])];
  const cards = globalThis.FLASHCARDS || [];
  const formulas = globalThis.FORMULAS || [];
  const constants = globalThis.CONSTANTS || [];
  const topicMap = new Map(topics.map(t => [t.id, t]));
  const questionMap = new Map(questions.map(q => [q.id, q]));
  const cardMap = new Map(cards.map(c => [c.id, c]));

  /* The storage key keeps its original name so existing progress is not lost. */
  const storeKey = 'field-physics-hl-v1';
  let canSave = true;

  const fresh = () => ({ version: 1, lessons: [], answers: {}, bookmarks: [], cards: {} });

  function cleanProgress(raw) {
    if (!raw || typeof raw !== 'object' || raw.version !== 1) throw Error('This is not a getibphysics progress file.');
    const p = fresh();
    p.lessons = [...new Set(Array.isArray(raw.lessons) ? raw.lessons.filter(id => topicMap.has(id)) : [])];
    p.bookmarks = [...new Set(Array.isArray(raw.bookmarks) ? raw.bookmarks.filter(id => questionMap.has(id)) : [])];
    if (raw.answers && typeof raw.answers === 'object') {
      for (const [id, a] of Object.entries(raw.answers)) {
        const q = questionMap.get(id);
        if (q && a && Number.isInteger(a.choice) && a.choice >= 0 && a.choice < 4) {
          p.answers[id] = { choice: a.choice, correct: a.choice === q.answer };
        }
      }
    }
    if (raw.cards && typeof raw.cards === 'object') {
      for (const [id, v] of Object.entries(raw.cards)) {
        if (cardMap.has(id) && ['known', 'learning'].includes(v)) p.cards[id] = v;
      }
    }
    return p;
  }

  let progress = fresh();
  try {
    const raw = localStorage.getItem(storeKey);
    if (raw) progress = cleanProgress(JSON.parse(raw));
    localStorage.setItem(storeKey, JSON.stringify(progress));
  } catch {
    canSave = false;
  }

  function save() {
    try {
      localStorage.setItem(storeKey, JSON.stringify(progress));
      canSave = true;
    } catch {
      canSave = false;
    }
    updateSaveStatus();
  }

  function updateSaveStatus() {
    const el = $('#save-status');
    el.textContent = canSave ? 'Progress saved on this device' : 'Progress in memory · export to keep it';
    el.classList.toggle('storage-error', !canSave);
  }

  function announce(text) {
    $('#announcer').textContent = '';
    setTimeout(() => { $('#announcer').textContent = text; }, 30);
  }

  /* ==========================================================================
     Maths typesetting
     ========================================================================== */

  const math = (tex, display = false) =>
    `<span class="math${display ? ' display-math' : ''}" data-tex="${h(tex)}"${display ? ' data-display="true"' : ''}></span>`;

  function typeset(root = $('#app')) {
    if (!globalThis.katex) return;
    $$('[data-tex]', root).forEach(el => {
      try {
        katex.render(el.dataset.tex, el, {
          displayMode: el.dataset.display === 'true',
          throwOnError: true,
          strict: 'ignore',
          trust: false,
          output: 'htmlAndMathml'
        });
      } catch {
        el.textContent = el.dataset.tex;
        el.classList.add('math-error');
      }
    });
    if (globalThis.renderMathInElement) {
      renderMathInElement(root, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        strict: 'ignore',
        trust: false,
        ignoredClasses: ['math']
      });
    }
  }

  /* ==========================================================================
     Shared markup helpers
     ========================================================================== */

  const opts = (pairs, selected) => pairs
    .map(([v, label]) => `<option value="${h(v)}"${selected === v ? ' selected' : ''}>${h(label)}</option>`)
    .join('');

  const themeOptions = v => opts([
    ['all', 'All themes'],
    ...Object.entries(themes).map(([k, n]) => [k, `${k} · ${n}`])
  ], v);

  function topicOptions(v, theme = 'all', tools = false) {
    return opts([
      ['all', 'All topics'],
      ...(tools ? [['Tools', 'Mathematics & uncertainties']] : []),
      ...topics.filter(t => theme === 'all' || t.theme === theme).map(t => [t.id, `${t.id} · ${t.name}`])
    ], v);
  }

  const selectField = (label, id, optionsHtml) => `
    <label class="filter-field" for="${id}">
      <span class="filter-label">${label}</span>
      <select id="${id}">${optionsHtml}</select>
    </label>`;

  const field = (label, id, options, value) => selectField(label, id, opts(options, value));

  const inputField = (label, id, value, placeholder) => `
    <label class="filter-field" for="${id}">
      <span class="filter-label">${label}</span>
      <input id="${id}" type="search" value="${h(value)}" placeholder="${h(placeholder)}" autocomplete="off">
    </label>`;

  const sidebarHeading = (title, resetId) => `
    <div class="sidebar-heading">
      <h2>${title}</h2>
      <button class="text-button" id="${resetId}" type="button">Reset</button>
    </div>`;

  const progressBar = (value, max, label) => `
    <div class="progress-track" role="progressbar" aria-label="${h(label)}" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${value}">
      <div class="progress-fill" style="width:${value / max * 100}%"></div>
    </div>`;

  const levelTag = level => `<span class="tag${level === 'HL' ? ' tag-hl' : ''}">${level === 'HL' ? 'HL' : 'Core'}</span>`;

  /* Keeps focus, caret position and the mobile filter drawer stable across re-renders. */
  function preserveInput(fn) {
    const active = document.activeElement;
    const id = active?.id;
    const start = active?.selectionStart;
    const end = active?.selectionEnd;
    const filtersOpen = $('#sidebar')?.classList.contains('filters-open');
    fn();
    if (filtersOpen) {
      $('#sidebar')?.classList.add('filters-open');
      $('#filter-toggle')?.setAttribute('aria-expanded', 'true');
    }
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.focus({ preventScroll: true });
        if (typeof start === 'number' && el.type === 'search') el.setSelectionRange(start, end);
      }
    }
  }

  /* ==========================================================================
     Router
     ========================================================================== */

  let route = { tab: 'study', topic: null };

  const qFilter = { theme: 'all', topic: 'all', difficulty: 'all', status: 'all', level: 'all', query: '' };
  let qPool = [], qIndex = 0, qChoice = null;

  const cFilter = { theme: 'all', topic: 'all', status: 'all', query: '' };
  let cPool = [], cIndex = 0, cFlipped = false, cView = 'study';

  const bFilter = { theme: 'all', topic: 'all', query: '' };
  let bView = 'formulas', bookPage = 6;

  function parseRoute() {
    const [tab, topic] = location.hash.replace(/^#/, '').split('/');
    return {
      tab: ['study', 'questions', 'cards', 'booklet'].includes(tab) ? tab : 'study',
      topic: topicMap.has(topic) ? topic : null
    };
  }

  function go(tab, topic = null) {
    const hash = `#${tab}${topic ? '/' + topic : ''}`;
    if (location.hash === hash) {
      route = parseRoute();
      render();
      window.scrollTo(0, 0);
    } else {
      location.hash = hash;
    }
  }

  function navigate() {
    const next = parseRoute();
    const changed = next.tab !== route.tab;
    route = next;
    if (changed && route.tab === 'questions') refreshQ();
    if (changed && route.tab === 'cards') refreshCards();
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function render() {
    $$('.primary-nav a').forEach(a => {
      if (a.dataset.tab === route.tab) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    const titles = {
      study: route.topic ? topicMap.get(route.topic).name : 'Study guides',
      questions: 'Question bank',
      cards: 'Flashcards',
      booklet: 'Data booklet'
    };
    document.title = `${titles[route.tab]} — getibphysics`;

    if (route.tab === 'study') renderStudy();
    else if (route.tab === 'questions') renderQuestions();
    else if (route.tab === 'cards') renderCards();
    else renderBooklet();

    $('#main')?.setAttribute('tabindex', '-1');
    typeset();
    updateSaveStatus();
  }

  function mobileFilter(label = 'Filters') {
    return `
      <div class="mobile-filters">
        <button id="filter-toggle" type="button" aria-expanded="false" aria-controls="sidebar">${label}</button>
        <span>${route.tab === 'study' ? 'Course index' : 'Physics HL'}</span>
      </div>`;
  }

  function hookMobile() {
    $('#filter-toggle')?.addEventListener('click', e => {
      const open = $('#sidebar').classList.toggle('filters-open');
      e.currentTarget.setAttribute('aria-expanded', open);
    });
  }

  /* ==========================================================================
     Study guides
     ========================================================================== */

  function studySidebar(id) {
    return `
      <aside class="sidebar lesson-sidebar" id="sidebar" aria-label="Course topics">
        <div class="sidebar-heading">
          <h2>Course index</h2>
          <a class="text-button" href="#study">All guides</a>
        </div>
        ${Object.entries(themes).map(([key, name]) => `
          <details class="sidebar-theme" data-key="${key}"${id.startsWith(key) ? ' open' : ''}>
            <summary><span class="theme-letter">${key}</span><span class="sidebar-theme-name">${name}</span></summary>
            <ul class="topic-list">
              ${topics.filter(t => t.theme === key).map(t => `
                <li><a href="#study/${t.id}" class="sidebar-topic${id === t.id ? ' active' : ''}"${id === t.id ? ' aria-current="page"' : ''}>
                  <span class="topic-code">${t.id}</span><span class="sidebar-topic-name">${h(t.name)}</span>${progress.lessons.includes(t.id) ? '<span class="done" aria-label="Read">✓</span>' : ''}
                </a></li>`).join('')}
            </ul>
          </details>`).join('')}
        <p class="filter-summary filter-divider">${progress.lessons.length} / ${topics.length} guides marked as read</p>
      </aside>`;
  }

  const topicMinutes = t => Math.max(5, Math.ceil(t.sections.map(s => s.body).join(' ').split(/\s+/).length / 100));

  const orbitDiagram = `
    <svg viewBox="0 0 250 165" role="img" aria-label="Diagram of a circular orbit: the velocity is tangent and acceleration points towards the centre">
      <defs>
        <marker id="orbit-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0 0L5 2.5L0 5" fill="none" stroke="var(--accent)" stroke-width=".8"/>
        </marker>
      </defs>
      <circle cx="116" cy="85" r="59" fill="none" stroke="var(--line-strong)" stroke-width=".8"/>
      <path d="M116 18v134M42 85h148" stroke="var(--line)" stroke-width=".7"/>
      <path d="M116 85L167 56" stroke="var(--muted)" stroke-width=".8" stroke-dasharray="2 4"/>
      <circle cx="116" cy="85" r="3" fill="var(--ink)"/>
      <circle cx="167" cy="56" r="3" fill="var(--accent)"/>
      <path d="M165 58L132 76M168 55L150 24" stroke="var(--accent)" stroke-width="1.2" marker-end="url(#orbit-arrow)"/>
      <text x="142" y="79" font-family="Georgia,serif" font-style="italic" font-size="12" fill="var(--ink)">a</text>
      <text x="141" y="31" font-family="Georgia,serif" font-style="italic" font-size="12" fill="var(--ink)">v</text>
    </svg>`;

  function renderStudy() {
    if (!route.topic) renderStudyOverview();
    else renderLesson();
  }

  function renderStudyOverview() {
    const read = progress.lessons.length;
    const first = topics.find(t => !progress.lessons.includes(t.id)) || topics[0];

    $('#app').innerHTML = `
      <main id="main" class="page-shell overview screen-enter">
        <header class="page-heading">
          <div class="page-heading-text">
            <p class="eyebrow">01 / Study guides</p>
            <h1>Study guides</h1>
            <p class="lede">IB Physics HL · First assessment 2025<br>${topics.length} topics across the complete core and HL syllabus.</p>
          </div>
          <div class="heading-aside">
            <p class="big-number">${String(read).padStart(2, '0')}<span class="muted"> / ${topics.length}</span></p>
            <p class="aside-label">Guides marked as read</p>
            ${progressBar(read, topics.length, 'Guides marked as read')}
          </div>
        </header>

        <div class="overview-layout">
          <section class="course-index" aria-labelledby="course-index-title">
            <div class="section-heading">
              <h2 id="course-index-title">Course index</h2>
              <span class="muted">Core + additional higher level</span>
            </div>
            ${Object.entries(themes).map(([key, name]) => `
              <details class="theme-group" data-key="${key}"${key === 'A' ? ' open' : ''}>
                <summary>
                  <span class="theme-letter">${key}</span>
                  <span class="theme-title">${name}</span>
                  <span class="theme-count">${topics.filter(t => t.theme === key).length} topics</span>
                  <span class="expand-mark" aria-hidden="true"></span>
                </summary>
                <ul class="topic-list">
                  ${topics.filter(t => t.theme === key).map(t => `
                    <li><a class="topic-row" href="#study/${t.id}">
                      <span class="topic-code">${t.id}</span>
                      <span class="topic-name">${h(t.name)}</span>
                      ${levelTag(t.level)}
                      <span class="duration">${topicMinutes(t)} min</span>
                      <span class="row-arrow" aria-hidden="true">${progress.lessons.includes(t.id) ? '✓' : '→'}</span>
                      <span class="sr-only">${progress.lessons.includes(t.id) ? 'Read' : 'Open'}</span>
                    </a></li>`).join('')}
                </ul>
              </details>`).join('')}
          </section>

          <aside class="overview-side" aria-label="Revision tools">
            <h2 class="side-label">Revision tools</h2>
            <a class="side-link" href="#questions">
              <strong>Question bank</strong>
              <span>${questions.length.toLocaleString()} multiple-choice questions</span>
              <span class="arrow" aria-hidden="true">→</span>
            </a>
            <a class="side-link" href="#cards">
              <strong>Vocabulary flashcards</strong>
              <span>${cards.length} terms and definitions</span>
              <span class="arrow" aria-hidden="true">→</span>
            </a>
            <a class="side-link" href="#booklet">
              <strong>Annotated data booklet</strong>
              <span>Formulae, symbols and constants</span>
              <span class="arrow" aria-hidden="true">→</span>
            </a>
            <figure class="diagram-art">
              ${orbitDiagram}
              <figcaption class="diagram-caption"><span>A.2 / Circular motion</span><span>v ⟂ a</span></figcaption>
            </figure>
            <a class="side-link side-link-primary" href="#study/${first.id}">
              <strong>${read ? 'Continue reading' : 'Begin with ' + first.id}</strong>
              <span>${h(first.name)}</span>
              <span class="arrow" aria-hidden="true">→</span>
            </a>
          </aside>
        </div>
      </main>`;
  }

  function renderLesson() {
    const topic = topicMap.get(route.topic);
    const idx = topics.indexOf(topic);
    const done = progress.lessons.includes(topic.id);
    const prev = topics[idx - 1];
    const next = topics[idx + 1];

    $('#app').innerHTML = `
      <div class="page-shell">
        ${mobileFilter('Topics')}
        <div class="workspace">
          ${studySidebar(topic.id)}
          <main id="main" class="workspace-content screen-enter">
            <div class="lesson-topline">
              <p class="eyebrow">${topic.id} / ${h(themes[topic.theme])}</p>
              <button class="text-button" id="print-lesson" type="button">Print guide</button>
            </div>

            <header class="lesson-header">
              <span class="tag${topic.level === 'HL' ? ' tag-hl' : ''}">${topic.level === 'HL' ? 'Additional HL' : 'Core · HL extensions where labelled'}</span>
              <h1>${h(topic.name)}</h1>
              <p class="lede">${h(topic.summary)}</p>
            </header>

            <div class="lesson-body">
              <article class="lesson-article">
                ${topic.sections.map((s, i) => `
                  <section class="lesson-section" id="section-${i}">
                    <h2><span class="section-number">${String(i + 1).padStart(2, '0')}</span>${h(s.title)}</h2>
                    <div class="prose">${s.body.includes('<p>') || s.body.includes('<ul>') ? s.body : `<p>${s.body}</p>`}</div>
                  </section>`).join('')}

                ${plotMarkup(topic.id)}

                <section class="equation-panel" id="equations">
                  <h2 class="panel-title">Key relationships</h2>
                  ${topic.equations.map(e => `
                    <div class="equation-item">
                      ${math(e.tex, true)}
                      <p class="equation-note">${h(e.note)}</p>
                    </div>`).join('')}
                  <a href="#booklet" class="text-button" id="lesson-formulas">Open formula annotations →</a>
                </section>

                <section class="worked-example" id="worked">
                  <h2>Worked example</h2>
                  <p class="worked-question">${h(topic.worked.question)}</p>
                  <details>
                    <summary>Show working</summary>
                    <div class="solution">${topic.worked.solution}</div>
                  </details>
                </section>

                <section class="lesson-section" id="pitfalls">
                  <h2>Common mistakes</h2>
                  <ul class="pitfalls">${topic.pitfalls.map(p => `<li>${h(p)}</li>`).join('')}</ul>
                </section>

                <section class="lesson-section" id="checklist">
                  <h2>Before you move on</h2>
                  <ul class="checklist">${topic.checklist.map(c => `<li>${h(c)}</li>`).join('')}</ul>
                </section>

                <div class="lesson-complete">
                  <button class="button${done ? '' : ' primary'}" id="mark-read" type="button">${done ? '✓ Marked as read' : 'Mark guide as read'}</button>
                  <button class="text-button" id="practice-topic" type="button">Practice ${topic.id} questions →</button>
                </div>

                <nav class="pager" aria-label="Previous and next guide">
                  ${prev ? `<a class="button small" href="#study/${prev.id}">← ${prev.id}</a>` : '<span></span>'}
                  ${next ? `<a class="button small" href="#study/${next.id}">Next: ${h(next.name)} →</a>` : '<a class="button small" href="#study">Course index →</a>'}
                </nav>
              </article>

              <nav class="lesson-toc" aria-label="On this page">
                <div class="toc-inner">
                  <h2 class="side-label">On this page</h2>
                  ${topic.sections.map((s, i) => `<a href="#section-${i}" data-scroll="section-${i}">${h(s.title)}</a>`).join('')}
                  <a href="#equations" data-scroll="equations">Key relationships</a>
                  <a href="#worked" data-scroll="worked">Worked example</a>
                  <a href="#checklist" data-scroll="checklist">Checklist</a>
                </div>
              </nav>
            </div>
          </main>
        </div>
      </div>`;

    hookMobile();
    hookPlot(topic.id);

    $('#print-lesson').onclick = () => window.print();

    $('#mark-read').onclick = () => {
      if (done) progress.lessons = progress.lessons.filter(id => id !== topic.id);
      else progress.lessons.push(topic.id);
      save();
      const y = scrollY;
      render();
      window.scrollTo(0, y);
      announce(done ? 'Guide unmarked.' : 'Guide marked as read.');
    };

    $('#practice-topic').onclick = () => {
      Object.assign(qFilter, { theme: 'all', topic: topic.id, difficulty: 'all', status: 'all', level: 'all', query: '' });
      refreshQ();
      go('questions');
    };

    $('#lesson-formulas').onclick = e => {
      e.preventDefault();
      Object.assign(bFilter, { theme: 'all', topic: topic.id, query: '' });
      bView = 'formulas';
      go('booklet');
    };

    $$('[data-scroll]').forEach(a => {
      a.onclick = e => {
        e.preventDefault();
        document.getElementById(a.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
      };
    });
  }

  /* --------------------------------------------------------------------------
     Interactive graphs inside selected study guides
     -------------------------------------------------------------------------- */

  function plotMarkup(id) {
    if (!['A.1', 'C.1', 'C.2', 'D.1'].includes(id)) return '';
    const info = {
      'A.1': ['Velocity–time graph', 'Acceleration', 'm s⁻²', 'Change the constant acceleration. The gradient changes; the shaded area is displacement over the first 4 s. Initial velocity is 2 m s⁻¹.'],
      'C.1': ['SHM displacement', 'Amplitude', 'm', 'Change the amplitude. The period remains 2 s; amplitude changes the maximum displacement without changing the period.'],
      'C.2': ['Wave profile', 'Wavelength', 'm', 'Change the wavelength. The curve is a snapshot of displacement against position, not displacement against time.'],
      'D.1': ['Gravitational field', 'Source mass', '×10²⁴ kg', 'Change the source mass. At a fixed distance, field strength scales with source mass. Distance is measured from the centre.']
    }[id];

    return `
      <section class="interactive-plot">
        <h2 class="panel-title">${info[0]}</h2>
        <svg id="physics-plot" viewBox="0 0 650 250" role="img" aria-label="${info[0]}"></svg>
        <label class="plot-controls">
          <span>${info[1]}</span>
          <input id="plot-slider" type="range" min="1" max="5" step="0.1" value="2" aria-label="${info[1]}">
          <output id="plot-value">2 ${info[2]}</output>
        </label>
        <p class="plot-caption">${info[3]}</p>
      </section>`;
  }

  function hookPlot(id) {
    const slider = $('#plot-slider');
    if (!slider) return;

    const draw = () => {
      const a = Number(slider.value);
      const svg = $('#physics-plot');
      let path = '', area = '', yLabel = '', xLabel = '', xMax = 4, yMax = 24, unit = '';

      if (id === 'A.1') { xMax = 4; yMax = 24; yLabel = 'v / m s⁻¹'; xLabel = 't / s'; unit = 'm s⁻²'; }
      if (id === 'C.1') { xMax = 4; yMax = 5; yLabel = 'x / m'; xLabel = 't / s'; unit = 'm'; }
      if (id === 'C.2') { xMax = 10; yMax = 1.3; yLabel = 'displacement / m'; xLabel = 'position / m'; unit = 'm'; }
      if (id === 'D.1') { xMax = 5; yMax = 40; yLabel = 'g / N kg⁻¹'; xLabel = 'r / 10⁷ m'; unit = '×10²⁴ kg'; }

      const xMin = id === 'D.1' ? 0.3 : 0;
      if (id === 'D.1') xMax = 5.3;

      const isWave = id.startsWith('C');
      const x0 = 54, y0 = isWave ? 128 : 208, w = 560, scale = isWave ? 67 : 168;
      const pts = [];

      for (let i = 0; i <= 240; i++) {
        const x = xMin + i / 240 * (xMax - xMin);
        let y;
        if (id === 'A.1') y = 2 + a * x;
        else if (id === 'C.1') y = a * Math.sin(Math.PI * x);
        else if (id === 'C.2') y = Math.sin(2 * Math.PI * x / a);
        else y = 6.67e-11 * a * 1e24 / (x * 1e7) ** 2;
        const px = x0 + (x - xMin) / (xMax - xMin) * w;
        const py = y0 - y / yMax * scale;
        pts.push([px, Math.max(28, Math.min(218, py))]);
      }

      path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join('');
      if (id === 'A.1') area = `<path class="plot-area" d="${path}L614,208L54,208Z"/>`;

      svg.innerHTML = `
        <g class="plot-labels" font-size="13">
          <text x="10" y="17">${yLabel}</text>
          <text x="557" y="245">${xLabel}</text>
        </g>
        <g class="plot-grid">
          ${[1, 2, 3, 4].map(i => `<path d="M${x0 + i * w / 4} 28V218"/>`).join('')}
          <path d="M54 48H614M54 88H614M54 168H614M54 208H614"/>
        </g>
        ${area}
        <path class="plot-axis" d="M54 28V218M54 ${y0}H623"/>
        <path class="plot-curve" d="${path}"/>
        <g class="plot-ticks" font-size="11">
          ${[0, 1, 2, 3, 4].map(i => `<text x="${x0 + i * w / 4 - 3}" y="233">${(xMin + i * (xMax - xMin) / 4).toFixed(id === 'D.1' ? 2 : xMax === 10 ? 1 : 0)}</text>`).join('')}
          <text x="27" y="${y0 + 3}">0</text>
          <text x="18" y="${y0 - scale + 3}">${yMax}</text>
          ${isWave ? `<text x="10" y="${y0 + scale + 3}">−${yMax}</text>` : ''}
        </g>`;
      $('#plot-value').textContent = `${a.toFixed(1)} ${unit}`;
    };

    slider.oninput = draw;
    draw();
  }

  /* ==========================================================================
     Question bank
     ========================================================================== */

  function filterQuestions() {
    const query = qFilter.query.toLowerCase().trim();
    return questions.filter(q =>
      (qFilter.theme === 'all' || q.topic.startsWith(qFilter.theme)) &&
      (qFilter.topic === 'all' || q.topic === qFilter.topic) &&
      (qFilter.difficulty === 'all' || q.difficulty === qFilter.difficulty) &&
      (qFilter.level === 'all' || q.level === qFilter.level) &&
      (qFilter.status === 'all' ||
        qFilter.status === 'new' && !progress.answers[q.id] ||
        qFilter.status === 'answered' && progress.answers[q.id] ||
        qFilter.status === 'incorrect' && progress.answers[q.id] && !progress.answers[q.id].correct ||
        qFilter.status === 'saved' && progress.bookmarks.includes(q.id)) &&
      (!query || `${q.prompt} ${q.id} ${topicMap.get(q.topic)?.name} ${q.tags || ''}`.toLowerCase().includes(query))
    );
  }

  function refreshQ() {
    qPool = filterQuestions();
    qIndex = 0;
    qChoice = null;
  }

  function questionSidebar() {
    const answered = Object.keys(progress.answers).length;
    const correct = Object.values(progress.answers).filter(a => a.correct).length;
    return `
      <aside class="sidebar" id="sidebar" aria-label="Question filters">
        ${sidebarHeading('Filter questions', 'q-reset')}
        ${inputField('Search', 'q-search', qFilter.query, 'Keyword or question ID')}
        ${selectField('Theme', 'q-theme', themeOptions(qFilter.theme))}
        ${selectField('Topic', 'q-topic', topicOptions(qFilter.topic, qFilter.theme))}
        ${field('Content', 'q-level', [['all', 'Core + HL'], ['Core', 'Core'], ['HL', 'Additional HL']], qFilter.level)}
        ${field('Difficulty', 'q-difficulty', [['all', 'All difficulties'], ['Foundation', 'Foundation'], ['Standard', 'Standard'], ['Challenge', 'Challenge']], qFilter.difficulty)}
        ${field('Question status', 'q-status', [['all', 'All questions'], ['new', 'Not answered'], ['answered', 'Answered'], ['incorrect', 'Incorrect'], ['saved', 'Bookmarked']], qFilter.status)}
        <div class="filter-divider">
          <h3 class="eyebrow">Your practice</h3>
          <ul class="stat-list">
            <li><strong>${answered}</strong> / ${questions.length} checked</li>
            <li><strong>${answered ? Math.round(correct / answered * 100) : 0}%</strong> correct across checked answers</li>
            <li><strong>${progress.bookmarks.length}</strong> bookmarked</li>
          </ul>
          ${progressBar(answered, questions.length, 'Questions checked')}
        </div>
      </aside>`;
  }

  function renderQuestions() {
    if (!qPool.length && qFilter.status === 'all' && qFilter.query === '' && qFilter.topic === 'all' &&
        qFilter.theme === 'all' && qFilter.level === 'all' && qFilter.difficulty === 'all') refreshQ();

    $('#app').innerHTML = `
      <div class="page-shell">
        ${mobileFilter()}
        <div class="workspace">
          ${questionSidebar()}
          <main id="main" class="workspace-content screen-enter">
            <header class="tool-heading">
              <p class="eyebrow">02 / Question bank</p>
              <div class="tool-heading-row">
                <div>
                  <h1>Question bank</h1>
                  <p class="lede">Multiple-choice practice with worked explanations.</p>
                </div>
                <p class="stat-inline"><strong>${questions.length.toLocaleString()}</strong>Original MCQs</p>
              </div>
            </header>
            <div class="tool-topbar">
              <span>${qPool.length} questions in selection</span>
              <button id="random-question" class="text-button" type="button"${qPool.length ? '' : ' disabled'}>Random question</button>
            </div>
            <div id="question-area"></div>
          </main>
        </div>
      </div>`;

    hookMobile();
    renderCurrentQuestion();

    for (const key of ['theme', 'topic', 'level', 'difficulty', 'status']) {
      $('#q-' + key).onchange = e => {
        qFilter[key] = e.target.value;
        if (key === 'theme') qFilter.topic = 'all';
        refreshQ();
        preserveInput(() => { renderQuestions(); typeset(); });
      };
    }

    $('#q-search').oninput = e => {
      qFilter.query = e.target.value;
      refreshQ();
      preserveInput(() => { renderQuestions(); typeset(); });
    };

    $('#q-reset').onclick = () => {
      Object.assign(qFilter, { theme: 'all', topic: 'all', level: 'all', difficulty: 'all', status: 'all', query: '' });
      refreshQ();
      renderQuestions();
      typeset();
    };

    $('#random-question').onclick = () => {
      if (qPool.length > 1) {
        let n = qIndex;
        while (n === qIndex) n = Math.floor(Math.random() * qPool.length);
        qIndex = n;
      }
      qChoice = null;
      renderCurrentQuestion();
      announce('Random question selected.');
    };
  }

  function renderCurrentQuestion() {
    const area = $('#question-area');
    if (!area) return;

    if (!qPool.length) {
      area.innerHTML = `
        <div class="empty-state">
          <h2>No matching questions</h2>
          <p>Try a different topic, status or search term.</p>
          <button id="clear-q-empty" class="button" type="button">Clear filters</button>
        </div>`;
      $('#clear-q-empty').onclick = () => $('#q-reset').click();
      return;
    }

    qIndex = Math.min(qIndex, qPool.length - 1);
    const q = qPool[qIndex];
    const record = progress.answers[q.id];
    const saved = progress.bookmarks.includes(q.id);
    const selected = record ? record.choice : qChoice;
    const pageStart = Math.floor(qIndex / 24) * 24;

    area.innerHTML = `
      <article class="question-card screen-enter">
        <div class="question-meta">
          <span class="question-topic">${q.topic} · ${h(topicMap.get(q.topic)?.name || '')}</span>
          ${levelTag(q.level)}
          <span class="tag">${h(q.difficulty)}</span>
          <button class="question-save" id="bookmark-q" type="button" aria-pressed="${saved}">${saved ? '◆ Saved' : '◇ Save'}</button>
        </div>

        <p class="question-prompt">${h(q.prompt)}</p>
        ${q.diagram ? `<div class="question-diagram">${q.diagram}</div>` : ''}

        <div class="question-options" role="group" aria-label="Choose one answer">
          ${q.options.map((o, i) => `
            <button class="answer-option${selected === i ? ' selected' : ''}${record && i === q.answer ? ' correct' : ''}${record && record.choice === i && i !== q.answer ? ' wrong' : ''}" type="button" data-answer="${i}" aria-pressed="${selected === i}"${record ? ' disabled' : ''}>
              <span class="answer-letter">${'ABCD'[i]}</span>
              <span class="answer-content">${h(o)}</span>
              ${record && i === q.answer ? '<span class="answer-indicator">✓ Correct</span>' : record && record.choice === i ? '<span class="answer-indicator">✕ Your answer</span>' : ''}
            </button>`).join('')}
        </div>

        <div class="answer-actions">
          <button class="button primary" id="check-answer" type="button"${record || selected === null ? ' disabled' : ''}>${record ? 'Answer checked' : 'Check answer'}</button>
          ${record ? '<button class="text-button" id="retry-question" type="button">Reset this answer</button>' : '<span class="answer-hint">Select one answer, then check</span>'}
        </div>

        ${record ? `
          <section class="explanation" aria-label="Answer explanation">
            <h2>${record.correct ? 'Correct.' : 'Correct answer: ' + 'ABCD'[q.answer] + '.'}</h2>
            <p>${h(q.explanation)}</p>
          </section>` : ''}
      </article>

      <div class="pager">
        <button class="button" id="q-prev" type="button"${qIndex === 0 ? ' disabled' : ''}>← Previous</button>
        <span class="question-id">${h(q.id)} · ${qIndex + 1} / ${qPool.length}</span>
        <button class="button" id="q-next" type="button"${qIndex === qPool.length - 1 ? ' disabled' : ''}>Next question →</button>
      </div>

      <div class="question-jump" role="group" aria-label="Jump to a question">
        ${qPool.slice(pageStart, pageStart + 24).map((item, i) => {
          const n = pageStart + i;
          return `<button class="jump-button${progress.answers[item.id] ? ' answered' : ''}${n === qIndex ? ' current' : ''}" type="button" data-jump="${n}" aria-label="Question ${n + 1}${progress.answers[item.id] ? ', answered' : ''}"${n === qIndex ? ' aria-current="true"' : ''}>${n + 1}</button>`;
        }).join('')}
      </div>`;

    $$('[data-answer]').forEach(b => {
      b.onclick = () => {
        qChoice = Number(b.dataset.answer);
        renderCurrentQuestion();
        const next = $(`[data-answer="${qChoice}"]`);
        next?.focus({ preventScroll: true });
      };
    });

    $('#check-answer').onclick = () => {
      if (qChoice === null || record) return;
      progress.answers[q.id] = { choice: qChoice, correct: qChoice === q.answer };
      save();
      renderCurrentQuestion();
      updateQuestionStats();
      announce(qChoice === q.answer
        ? 'Correct answer. Explanation is now available.'
        : `Incorrect. The correct answer is ${'ABCD'[q.answer]}. Explanation is now available.`);
    };

    $('#retry-question')?.addEventListener('click', () => {
      delete progress.answers[q.id];
      qChoice = null;
      save();
      renderCurrentQuestion();
      updateQuestionStats();
      announce('Answer reset.');
    });

    $('#bookmark-q').onclick = () => {
      if (saved) progress.bookmarks = progress.bookmarks.filter(id => id !== q.id);
      else progress.bookmarks.push(q.id);
      save();
      renderCurrentQuestion();
      updateQuestionStats();
    };

    $('#q-prev').onclick = () => moveQ(-1);
    $('#q-next').onclick = () => moveQ(1);

    $$('[data-jump]').forEach(b => {
      b.onclick = () => {
        qIndex = Number(b.dataset.jump);
        qChoice = null;
        renderCurrentQuestion();
        $('#main').scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    });

    typeset(area);
  }

  function updateQuestionStats() {
    const old = $('#sidebar');
    if (!old) return;
    const freshEl = document.createElement('div');
    freshEl.innerHTML = questionSidebar();
    const current = $('.filter-divider', old);
    const next = $('.filter-divider', freshEl);
    current.replaceWith(next);
  }

  function moveQ(n) {
    if (qIndex + n < 0 || qIndex + n >= qPool.length) return;
    qIndex += n;
    qChoice = null;
    renderCurrentQuestion();
    $('#main').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ==========================================================================
     Flashcards
     ========================================================================== */

  function filteredCards() {
    const query = cFilter.query.trim().toLowerCase();
    return cards.filter(c =>
      (cFilter.theme === 'all' || c.topic.startsWith(cFilter.theme)) &&
      (cFilter.topic === 'all' || c.topic === cFilter.topic) &&
      (cFilter.status === 'all' || cFilter.status === 'new' && !progress.cards[c.id] || cFilter.status === progress.cards[c.id]) &&
      (!query || `${c.term} ${c.definition} ${c.detail}`.toLowerCase().includes(query))
    );
  }

  function refreshCards() {
    cPool = filteredCards();
    cIndex = 0;
    cFlipped = false;
  }

  function cardSidebar() {
    const known = Object.values(progress.cards).filter(s => s === 'known').length;
    const learning = Object.values(progress.cards).filter(s => s === 'learning').length;
    return `
      <aside class="sidebar" id="sidebar" aria-label="Flashcard filters">
        ${sidebarHeading('Choose a deck', 'c-reset')}
        ${inputField('Search vocabulary', 'c-search', cFilter.query, 'Term or definition')}
        ${selectField('Theme', 'c-theme', themeOptions(cFilter.theme))}
        ${selectField('Topic', 'c-topic', topicOptions(cFilter.topic, cFilter.theme))}
        ${field('Review status', 'c-status', [['all', 'All cards'], ['new', 'Not reviewed'], ['learning', 'Learning'], ['known', 'Known']], cFilter.status)}
        <div class="filter-divider">
          <h3 class="eyebrow">Your vocabulary</h3>
          <ul class="stat-list">
            <li><strong>${known}</strong> known</li>
            <li><strong>${learning}</strong> learning</li>
            <li><strong>${cards.length - known - learning}</strong> not reviewed</li>
          </ul>
          ${progressBar(known, cards.length, 'Cards marked as known')}
        </div>
      </aside>`;
  }

  function renderCards() {
    $('#app').innerHTML = `
      <div class="page-shell">
        ${mobileFilter()}
        <div class="workspace">
          ${cardSidebar()}
          <main id="main" class="workspace-content screen-enter">
            <header class="tool-heading">
              <p class="eyebrow">03 / Flashcards</p>
              <div class="tool-heading-row">
                <div>
                  <h1>Physics vocabulary</h1>
                  <p class="lede">Definitions, distinctions and the context behind each term.</p>
                </div>
                <p class="stat-inline"><strong>${cards.length}</strong>Vocabulary cards</p>
              </div>
            </header>
            <div class="tool-topbar">
              <span>${cPool.length} cards in deck</span>
              <div class="view-switch">
                <button class="button small${cView === 'study' ? ' active' : ''}" id="card-study" type="button" aria-pressed="${cView === 'study'}">Review</button>
                <button class="button small${cView === 'browse' ? ' active' : ''}" id="card-browse" type="button" aria-pressed="${cView === 'browse'}">Browse</button>
              </div>
            </div>
            <div id="card-area"></div>
          </main>
        </div>
      </div>`;

    hookMobile();
    renderCurrentCard();

    for (const key of ['theme', 'topic', 'status']) {
      $('#c-' + key).onchange = e => {
        cFilter[key] = e.target.value;
        if (key === 'theme') cFilter.topic = 'all';
        refreshCards();
        preserveInput(() => { renderCards(); typeset(); });
      };
    }

    $('#c-search').oninput = e => {
      cFilter.query = e.target.value;
      refreshCards();
      preserveInput(() => { renderCards(); typeset(); });
    };

    $('#c-reset').onclick = () => {
      Object.assign(cFilter, { theme: 'all', topic: 'all', status: 'all', query: '' });
      refreshCards();
      renderCards();
      typeset();
    };

    $('#card-study').onclick = () => { cView = 'study'; renderCards(); typeset(); };
    $('#card-browse').onclick = () => { cView = 'browse'; renderCards(); typeset(); };
  }

  function renderCurrentCard() {
    const area = $('#card-area');
    if (!area) return;

    if (!cPool.length) {
      area.innerHTML = `
        <div class="empty-state">
          <h2>No cards in this deck</h2>
          <p>Choose another review status, topic or search term.</p>
          <button class="button" id="empty-c-reset" type="button">Clear filters</button>
        </div>`;
      $('#empty-c-reset').onclick = () => $('#c-reset').click();
      return;
    }

    if (cView === 'browse') {
      area.innerHTML = `
        <div class="table-wrap">
          <table class="vocab-table">
            <caption class="sr-only">Vocabulary cards in the current deck</caption>
            <thead><tr><th scope="col">Term</th><th scope="col">Definition</th><th scope="col">Topic</th><th scope="col">Status</th></tr></thead>
            <tbody>
              ${cPool.map(c => `
                <tr>
                  <td>${h(c.term)}</td>
                  <td>${h(c.definition)}<p class="equation-note">${h(c.detail)}</p></td>
                  <td>${c.topic}</td>
                  <td><button class="text-button" type="button" data-card-status="${h(c.id)}">${progress.cards[c.id] || 'Not reviewed'}</button></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;

      $$('[data-card-status]').forEach(b => {
        b.onclick = () => {
          const id = b.dataset.cardStatus;
          progress.cards[id] = progress.cards[id] === 'known' ? 'learning' : 'known';
          save();
          const allowed = new Set(filteredCards().map(c => c.id));
          cPool = cPool.filter(c => allowed.has(c.id));
          renderCurrentCard();
          updateCardStats();
        };
      });
      typeset(area);
      return;
    }

    cIndex = Math.min(cIndex, cPool.length - 1);
    const c = cPool[cIndex];
    const status = progress.cards[c.id] || 'Not reviewed';

    area.innerHTML = `
      <div class="deck-stats">
        <span>${c.topic} / ${h(topicMap.get(c.topic)?.name)}</span>
        <span class="deck-status"><strong>${h(status)}</strong></span>
      </div>

      <div class="flash-stage">
        <button class="flashcard${cFlipped ? ' flipped' : ''}" id="flashcard" type="button" aria-label="${cFlipped ? 'Definition. ' + h(c.definition) + '. Click to show term.' : 'Term: ' + h(c.term) + '. Click to reveal definition.'}" aria-pressed="${cFlipped}">
          <span class="card-face card-front" aria-hidden="${cFlipped}">
            <span class="card-face-label">Term / ${String(cIndex + 1).padStart(2, '0')}</span>
            <span class="card-term">${h(c.term)}</span>
            <span class="card-face-hint">Click to reveal definition</span>
          </span>
          <span class="card-face card-back" aria-hidden="${!cFlipped}">
            <span class="card-face-label">Definition / ${c.topic}</span>
            <span class="card-definition">${h(c.definition)}</span>
            <span class="card-detail">${h(c.detail)}</span>
            <span class="card-face-hint">Click to return to term</span>
          </span>
        </button>
      </div>

      <div class="card-rating">
        <button class="button" id="card-again" type="button"${cFlipped ? '' : ' disabled'}>Review again</button>
        <button class="button primary" id="card-known" type="button"${cFlipped ? '' : ' disabled'}>Know this ✓</button>
      </div>

      <div class="pager card-controls">
        <button class="button" id="c-prev" type="button"${cIndex === 0 ? ' disabled' : ''}>← Previous</button>
        <span class="question-id">${cIndex + 1} / ${cPool.length}</span>
        <button class="button" id="c-next" type="button"${cIndex === cPool.length - 1 ? ' disabled' : ''}>Next →</button>
      </div>

      <div class="deck-footer">
        <button class="text-button" id="shuffle-cards" type="button">Shuffle deck</button>
        <span class="answer-hint">Space to reveal · rate to continue</span>
      </div>`;

    $('#flashcard').onclick = () => {
      cFlipped = !cFlipped;
      const el = $('#flashcard');
      el.classList.toggle('flipped', cFlipped);
      el.setAttribute('aria-pressed', cFlipped);
      el.setAttribute('aria-label', cFlipped
        ? 'Definition: ' + c.definition + '. Click to show term.'
        : 'Term: ' + c.term + '. Click to reveal definition.');
      $('.card-front').setAttribute('aria-hidden', cFlipped);
      $('.card-back').setAttribute('aria-hidden', !cFlipped);
      $('#card-again').disabled = !cFlipped;
      $('#card-known').disabled = !cFlipped;
    };

    const rate = v => {
      progress.cards[c.id] = v;
      save();
      const oldIndex = cIndex;
      const allowed = new Set(filteredCards().map(item => item.id));
      cPool = cPool.filter(item => allowed.has(item.id));
      const currentIndex = cPool.findIndex(item => item.id === c.id);
      if (currentIndex >= 0) {
        cIndex = currentIndex;
        if (cIndex < cPool.length - 1) cIndex++;
        else announce('End of this deck. Your ratings are saved.');
      } else {
        cIndex = Math.max(0, Math.min(oldIndex, cPool.length - 1));
        if (!cPool.length) announce('All cards in this selection have been reviewed. Your ratings are saved.');
      }
      cFlipped = false;
      renderCurrentCard();
      updateCardStats();
    };

    $('#card-again').onclick = () => rate('learning');
    $('#card-known').onclick = () => rate('known');

    $('#c-prev').onclick = () => { if (cIndex > 0) cIndex--; cFlipped = false; renderCurrentCard(); };
    $('#c-next').onclick = () => { if (cIndex < cPool.length - 1) cIndex++; cFlipped = false; renderCurrentCard(); };

    $('#shuffle-cards').onclick = () => {
      for (let i = cPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cPool[i], cPool[j]] = [cPool[j], cPool[i]];
      }
      cIndex = 0;
      cFlipped = false;
      renderCurrentCard();
      announce('Deck shuffled.');
    };

    typeset(area);
  }

  function updateCardStats() {
    const wrap = document.createElement('div');
    wrap.innerHTML = cardSidebar();
    $('#sidebar .filter-divider')?.replaceWith($('.filter-divider', wrap));
    const count = $('.tool-topbar > span');
    if (count) count.textContent = `${cPool.length} cards in deck`;
  }

  /* ==========================================================================
     Data booklet
     ========================================================================== */

  function bookletSidebar() {
    return `
      <aside class="sidebar" id="sidebar" aria-label="Formula filters">
        ${sidebarHeading('Formula index', 'b-reset')}
        ${inputField('Search formulae & symbols', 'b-search', bFilter.query, 'e.g. momentum, mass, photon')}
        ${selectField('Theme', 'b-theme', themeOptions(bFilter.theme))}
        ${selectField('Topic', 'b-topic', topicOptions(bFilter.topic, bFilter.theme, true))}
        <p class="filter-summary">Filters apply to annotated and recall formulae. Constants have a separate complete index.</p>
        <div class="filter-divider sidebar-links">
          <a class="button small" href="assets/physics-data-booklet.pdf" target="_blank" rel="noopener">Open original PDF ↗</a>
          <a class="text-button" href="assets/physics-data-booklet.pdf" download="IB-Physics-data-booklet-2023.pdf">Download data booklet ↓</a>
          <p class="filter-summary">2023 edition · Version 1.0<br>First assessment 2025</p>
        </div>
      </aside>`;
  }

  function renderBooklet() {
    const tabs = [
      ['formulas', 'Annotated formulae'],
      ['constants', 'Constants & units'],
      ['pages', 'Booklet pages'],
      ['recall', 'Recall & derive']
    ];

    $('#app').innerHTML = `
      <div class="page-shell">
        ${mobileFilter()}
        <div class="workspace">
          ${bookletSidebar()}
          <main id="main" class="workspace-content screen-enter">
            <header class="tool-heading">
              <p class="eyebrow">04 / Data booklet</p>
              <h1>Formula reference</h1>
              <p class="lede">The supplied equations, with each symbol and its units explained.</p>
            </header>
            <div class="booklet-tabs" role="tablist" aria-label="Formula reference sections">
              ${tabs.map(([id, label]) => `<button role="tab" type="button" tabindex="${bView === id ? '0' : '-1'}" aria-selected="${bView === id}" aria-controls="booklet-area" class="${bView === id ? 'active' : ''}" data-bview="${id}" id="btab-${id}">${label}</button>`).join('')}
            </div>
            <div id="booklet-area" role="tabpanel" aria-labelledby="btab-${bView}"></div>
          </main>
        </div>
      </div>`;

    hookMobile();
    renderBookletContent();

    $$('[data-bview]').forEach(b => {
      b.onclick = () => {
        bView = b.dataset.bview;
        preserveInput(() => { renderBooklet(); typeset(); });
      };
      b.onkeydown = e => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        const tabEls = $$('[data-bview]');
        const current = tabEls.indexOf(b);
        const index = e.key === 'Home' ? 0
          : e.key === 'End' ? tabEls.length - 1
          : (current + (e.key === 'ArrowRight' ? 1 : -1) + tabEls.length) % tabEls.length;
        const id = tabEls[index].id;
        tabEls[index].click();
        document.getElementById(id)?.focus({ preventScroll: true });
      };
    });

    for (const key of ['theme', 'topic']) {
      $('#b-' + key).onchange = e => {
        bFilter[key] = e.target.value;
        if (key === 'theme') bFilter.topic = 'all';
        preserveInput(() => { renderBooklet(); typeset(); });
      };
    }

    $('#b-search').oninput = e => {
      bFilter.query = e.target.value;
      preserveInput(() => { renderBooklet(); typeset(); });
    };

    $('#b-reset').onclick = () => {
      Object.assign(bFilter, { theme: 'all', topic: 'all', query: '' });
      renderBooklet();
      typeset();
    };
  }

  function formulaMarkup(f) {
    return `
      <details class="formula-entry">
        <summary>
          <span class="formula-title-row">
            <span class="topic-code">${f.topic}</span>
            <span class="formula-name">${h(f.name)}</span>
            <span class="formula-page">${f.recall ? 'Recall / derive' : 'Booklet p. ' + f.page}</span>
          </span>
          <span class="formula-display">${math(f.tex, true)}</span>
        </summary>
        <div class="formula-body">
          <p>${h(f.explanation)}</p>
          <div class="table-wrap">
            <table class="variable-table">
              <thead><tr><th scope="col">Symbol</th><th scope="col">Meaning</th><th scope="col">SI unit / note</th></tr></thead>
              <tbody>
                ${f.variables.map(v => `<tr><td>${math(v.symbol)}</td><td>${h(v.meaning)}</td><td>${h(v.unit)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          ${f.page ? `<button class="text-button formula-source" type="button" data-bookpage="${f.page + 4}">View original page ${f.page} →</button>` : ''}
        </div>
      </details>`;
  }

  function renderBookletContent() {
    const area = $('#booklet-area');

    if (bView === 'formulas' || bView === 'recall') {
      const query = bFilter.query.toLowerCase().trim();
      const list = formulas.filter(f =>
        f.recall === (bView === 'recall') &&
        (bFilter.theme === 'all' || f.topic.startsWith(bFilter.theme)) &&
        (bFilter.topic === 'all' || f.topic === bFilter.topic) &&
        (!query || `${f.name} ${f.tex} ${f.explanation} ${f.variables.map(v => v.symbol + ' ' + v.meaning).join(' ')}`.toLowerCase().includes(query))
      );

      area.innerHTML = `
        <p class="booklet-note">${bView === 'formulas'
          ? 'Booklet notation is retained, including stacked fractions, subscripts and powers. Equations generally give magnitudes; use directions and signs consistently. Open an equation for its conditions, symbol definitions and units.'
          : 'These useful relationships are not printed as standalone equations in the supplied booklet. Learn their meaning and how to derive them. Check the stated assumptions before using a shortcut.'}</p>
        <p class="count-label">${list.length} ${bView === 'recall' ? 'recall relationships' : 'annotated equation groups'}${bFilter.topic !== 'all' ? ' · ' + h(bFilter.topic) : ''}</p>
        <div class="formula-list">
          ${list.length
            ? list.map(formulaMarkup).join('')
            : '<div class="empty-state"><h2>No matching formulae</h2><p>Try a broader topic or search term. Some topics use relationships listed under another topic.</p></div>'}
        </div>`;

      $$('[data-bookpage]').forEach(b => {
        b.onclick = () => {
          bookPage = Number(b.dataset.bookpage);
          bView = 'pages';
          renderBooklet();
          typeset();
          $('#main').scrollIntoView({ behavior: 'smooth' });
        };
      });

    } else if (bView === 'constants') {
      area.innerHTML = `
        <p class="booklet-note">Rounded values as printed on booklet page 3. Symbols can have different meanings in different topics; use the definitions beside each equation. Constants are shown as a complete index.</p>
        ${constants.map(c => `
          <section class="constant-entry">
            <div class="constant-symbol">${math(c.symbol)}</div>
            <div class="constant-content">
              <h3>${h(c.name)}</h3>
              <div class="constant-value">${math(c.tex)}</div>
              <p>${h(c.explanation)}</p>
            </div>
          </section>`).join('')}
        <h2 class="subsection-title">SI multipliers</h2>
        <div class="prefix-grid">
          ${(globalThis.PREFIXES || []).map(([name, symbol, power]) => `
            <div class="prefix-item"><strong>${h(name)} <span>${h(symbol)}</span></strong>${math('10^{' + power + '}')}</div>`).join('')}
        </div>
        <h2 class="subsection-title">Unit conversions</h2>
        ${(globalThis.CONVERSIONS || []).map(([tex, note]) => `
          <div class="conversion-entry">${math(tex)}<p>${h(note)}</p></div>`).join('')}`;

    } else {
      const pageNames = {
        6: '2 · Mathematical equations',
        7: '3 · Uncertainties & constants',
        8: '4 · Multipliers & conversions',
        9: '5 · Circuits & electromagnetic spectrum',
        10: '6 · A.1–A.3 Mechanics',
        11: '7 · A.4–A.5 HL mechanics & relativity',
        12: '8 · B.1–B.3 Thermal physics',
        13: '9 · B.4–B.5 Thermodynamics & circuits',
        14: '10 · C Wave behaviour',
        15: '11 · C HL wave phenomena',
        16: '12 · D Fields',
        17: '13 · D.4 & E Nuclear / quantum'
      };

      area.innerHTML = `
        <p class="booklet-note">Original booklet pages are rendered as images so that the mathematical layout stays intact. The on-site images are in grayscale. Use the PDF for the full supplied document.</p>
        <div class="booklet-reader-toolbar">
          <button class="button small" id="book-prev" type="button" aria-label="Previous page"${bookPage <= 6 ? ' disabled' : ''}>←</button>
          <label class="sr-only" for="book-page-select">Printed booklet page</label>
          <select id="book-page-select" class="page-select">
            ${Object.entries(pageNames).map(([p, label]) => `<option value="${p}"${bookPage === Number(p) ? ' selected' : ''}>${label}</option>`).join('')}
          </select>
          <button class="button small" id="book-next" type="button" aria-label="Next page"${bookPage >= 17 ? ' disabled' : ''}>→</button>
        </div>
        <figure class="booklet-figure">
          <img class="booklet-page" width="1203" height="1700" src="assets/booklet/page-${String(bookPage).padStart(2, '0')}.png" alt="Original IB Physics data booklet printed page ${bookPage - 4}: ${h(pageNames[bookPage].split(' · ').slice(1).join(' · '))}">
          <figcaption class="booklet-page-caption">Printed page ${bookPage - 4} / 13 · IB Physics data booklet, 2023</figcaption>
        </figure>`;

      const change = () => { renderBookletContent(); typeset(area); };
      $('#book-prev').onclick = () => { bookPage--; change(); };
      $('#book-next').onclick = () => { bookPage++; change(); };
      $('#book-page-select').onchange = e => { bookPage = Number(e.target.value); change(); };
    }

    typeset(area);
  }

  /* ==========================================================================
     About dialog and progress backup
     ========================================================================== */

  const dialog = $('#about-dialog');

  $('.skip-link').onclick = e => {
    e.preventDefault();
    const main = $('#main');
    main?.setAttribute('tabindex', '-1');
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showAbout = () => {
    dialog.showModal();
    $('#import-status').textContent = '';
    $('.reset-confirm', dialog)?.remove();
  };

  $('#help-button').onclick = showAbout;
  $('#about-footer').onclick = showAbout;
  $('#close-about').onclick = () => dialog.close();

  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close();
  });

  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $('#export-progress').onclick = () => download('getibphysics-progress.json', JSON.stringify(progress, null, 2), 'application/json');
  $('#import-progress-button').onclick = () => $('#import-progress').click();

  $('#import-progress').onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (file.size > 2e6) throw Error('This progress file is too large.');
      const parsed = cleanProgress(JSON.parse(await file.text()));
      progress = parsed;
      save();
      refreshQ();
      refreshCards();
      render();
      $('#import-status').textContent = 'Progress imported. This replaces the previous progress on this browser.';
    } catch (err) {
      $('#import-status').textContent = err.message === 'This is not a getibphysics progress file.'
        ? err.message
        : 'Could not import this file. Choose a JSON progress file exported from getibphysics.';
    }
    e.target.value = '';
  };

  $('#clear-progress').onclick = () => {
    if ($('.reset-confirm', dialog)) return;
    const box = document.createElement('div');
    box.className = 'reset-confirm';
    box.innerHTML = `
      <p>Reset all checked answers, read guides, bookmarks and flashcard ratings on this browser?</p>
      <div class="reset-confirm-actions">
        <button class="button primary" id="confirm-reset" type="button">Reset progress</button>
        <button class="button" id="cancel-reset" type="button">Keep progress</button>
      </div>`;
    $('.dialog-actions', dialog).after(box);
    $('#cancel-reset').onclick = () => box.remove();
    $('#confirm-reset').onclick = () => {
      progress = fresh();
      save();
      refreshQ();
      refreshCards();
      render();
      box.remove();
      $('#import-status').textContent = 'All progress has been reset.';
    };
  };

  /* ==========================================================================
     Keyboard shortcuts and cross-tab sync
     ========================================================================== */

  document.addEventListener('keydown', e => {
    if (dialog.open || e.ctrlKey || e.metaKey || e.altKey || e.target.matches('input,select,textarea,[contenteditable=true]')) return;

    if (route.tab === 'questions') {
      if (/^[1-4]$/.test(e.key) && !progress.answers[qPool[qIndex]?.id]) {
        e.preventDefault();
        $(`[data-answer="${Number(e.key) - 1}"]`)?.click();
      } else if (e.key === 'Enter' && (e.target === document.body || e.target.closest('.answer-option'))) {
        e.preventDefault();
        $('#check-answer')?.click();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        moveQ(1);
      }
    } else if (route.tab === 'cards' && cView === 'study' && e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      $('#flashcard')?.click();
    }
  });

  window.addEventListener('hashchange', navigate);

  window.addEventListener('storage', e => {
    if (e.key !== storeKey || !e.newValue) return;
    try {
      progress = cleanProgress(JSON.parse(e.newValue));
      const qId = qPool[qIndex]?.id;
      const cId = cPool[cIndex]?.id;
      qPool = filterQuestions();
      cPool = filteredCards();
      qIndex = Math.max(0, qPool.findIndex(q => q.id === qId));
      cIndex = Math.max(0, cPool.findIndex(c => c.id === cId));
      qChoice = null;
      cFlipped = false;
      render();
      announce('Progress updated from another tab.');
    } catch {}
  });

  /* ==========================================================================
     Boot
     ========================================================================== */

  refreshQ();
  refreshCards();
  route = parseRoute();
  render();
})();
