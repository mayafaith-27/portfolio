// Ventures case-study overlay: opens case pages as full-screen overlays under the global nav.
(function () {
  const CASES = [
    { id: 'daviswithmaya', href: 'daviswithmaya.html', title: 'DavisWithMaya' },
    { id: 'story-and-spoon', href: 'story-and-spoon.html', title: 'Story & Spoon' },
    { id: 'daily', href: 'daily.html', title: 'Daily UC Davis' },
  ];
  const INK = 'oklch(0.2 0.015 50)', CREAM = 'oklch(0.97 0.01 60)', ACC = 'oklch(0.5 0.13 45)', MUTED = 'oklch(0.5 0.02 50)';
  const byHref = (h) => { if (!h) return null; const f = h.split('#')[0].split('?')[0].split('/').pop(); return CASES.find(c => c.href === f) || null; };
  let root, frame, titleEl, countEl, prevBtn, nextBtn, cur = -1, savedY = 0;

  function navH() { const n = document.querySelector('nav'); return n ? n.getBoundingClientRect().height : 64; }
  function btn(label) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label;
    b.style.cssText = `display:inline-flex;align-items:center;gap:6px;background:transparent;border:0;padding:8px 4px;font:600 13px 'Public Sans',sans-serif;color:${INK};cursor:pointer;white-space:nowrap;`;
    b.onmouseenter = () => { if (!b.disabled) b.style.color = ACC; }; b.onmouseleave = () => { b.style.color = b.disabled ? 'oklch(0.75 0.01 55)' : INK; };
    return b;
  }
  function build() {
    root = document.createElement('div');
    root.setAttribute('data-case-overlay', '');
    root.style.cssText = `position:fixed;left:0;right:0;bottom:0;z-index:90;background:${CREAM};display:flex;flex-direction:column;opacity:0;transform:translateY(24px);transition:opacity .35s ease, transform .45s cubic-bezier(.2,.7,.2,1);box-shadow:0 -20px 60px -30px oklch(0.2 0.015 50 / 0.4);`;
    const bar = document.createElement('div');
    bar.style.cssText = `flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px clamp(12px,3vw,40px);border-bottom:1px solid oklch(0.87 0.015 55);background:${CREAM};`;
    const back = btn('← Back to Ventures'); back.style.fontWeight = '700'; back.onclick = () => close(true);
    const mid = document.createElement('div'); mid.style.cssText = 'display:flex;align-items:baseline;gap:10px;min-width:0;overflow:hidden;';
    titleEl = document.createElement('span'); titleEl.style.cssText = `font:700 14px 'Bricolage Grotesque',sans-serif;color:${INK};white-space:nowrap;`;
    countEl = document.createElement('span'); countEl.style.cssText = `font:600 11px 'Public Sans',sans-serif;letter-spacing:1px;color:${MUTED};white-space:nowrap;`;
    mid.append(titleEl, countEl);
    const right = document.createElement('div'); right.style.cssText = 'display:flex;align-items:center;gap:14px;';
    prevBtn = btn('← Prev'); nextBtn = btn('Next →');
    prevBtn.onclick = () => go(cur - 1); nextBtn.onclick = () => go(cur + 1);
    right.append(prevBtn, nextBtn);
    bar.append(back, mid, right);
    frame = document.createElement('iframe');
    frame.title = 'Case study';
    frame.style.cssText = 'flex:1 1 auto;width:100%;border:0;display:block;background:' + CREAM + ';';
    root.append(bar, frame);
    document.body.appendChild(root);
    if (matchMedia('(max-width:560px)').matches) mid.style.display = 'none';
  }
  function paint() {
    const c = CASES[cur];
    titleEl.textContent = c.title; countEl.textContent = `${cur + 1} OF ${CASES.length}`;
    const p = CASES[(cur - 1 + CASES.length) % CASES.length], n = CASES[(cur + 1) % CASES.length];
    prevBtn.textContent = '← ' + p.title; nextBtn.textContent = n.title + ' →';
    prevBtn.title = 'Previous venture'; nextBtn.title = 'Next venture';
  }
  function open(i, push) {
    if (!root) build();
    const wasOpen = cur >= 0;
    cur = (i + CASES.length) % CASES.length;
    root.style.top = navH() + 'px';
    frame.src = CASES[cur].href + '?embed=1';
    paint();
    if (!wasOpen) {
      savedY = scrollY;
      document.documentElement.style.overflow = 'hidden';
      root.style.display = 'flex';
      void root.offsetWidth; root.style.opacity = '1'; root.style.transform = 'none';
    }
    const url = location.pathname + '?case=' + CASES[cur].id + location.hash;
    if (push) history.pushState({ caseId: CASES[cur].id }, '', url); else history.replaceState({ caseId: CASES[cur].id }, '', url);
  }
  function go(i) { open(i, false); }
  function close(push) {
    if (!root || cur < 0) return;
    cur = -1;
    root.style.opacity = '0'; root.style.transform = 'translateY(24px)';
    setTimeout(() => { if (cur < 0) { root.style.display = 'none'; frame.src = 'about:blank'; } }, 380);
    document.documentElement.style.overflow = '';
    scrollTo(0, savedY);
    if (push) history.replaceState(null, '', location.pathname + location.hash);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (a.closest('[data-case-overlay]')) return;
    const c = byHref(a.getAttribute('href'));
    if (!c) return;
    e.preventDefault(); e.stopPropagation();
    open(CASES.indexOf(c), true);
  }, true);
  addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === 'case:close') close(true);
    if (d.type === 'case:open') { const c = byHref(d.href); if (c) open(CASES.indexOf(c), false); }
    if (d.type === 'case:nav' && d.href) location.href = d.href;
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && cur >= 0) close(true); });
  addEventListener('resize', () => { if (root && cur >= 0) root.style.top = navH() + 'px'; });
  addEventListener('popstate', () => {
    const id = new URLSearchParams(location.search).get('case');
    const i = CASES.findIndex(c => c.id === id);
    if (i >= 0) open(i, false); else if (cur >= 0) close(false);
  });
  function boot() {
    const id = new URLSearchParams(location.search).get('case');
    const i = CASES.findIndex(c => c.id === id);
    if (i >= 0) setTimeout(() => open(i, false), 300);
  }
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
})();
