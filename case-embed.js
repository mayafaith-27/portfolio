// Case-study pages: when opened inside the Ventures overlay, hide the duplicate global nav and hand navigation back to the parent.
(function () {
  const embedded = window.parent !== window && new URLSearchParams(location.search).get('embed') === '1';
  const CASES = ['daviswithmaya.html', 'story-and-spoon.html', 'daily.html'];
  const file = (h) => (h || '').split('#')[0].split('?')[0].split('/').pop();
  const cs = document.createElement('style');
  cs.textContent = '@media (max-width:760px){[data-cover-grid]{grid-template-columns:1fr !important;gap:36px !important;padding-left:20px !important;padding-right:20px !important;}[data-cover-visual]{justify-self:center !important;max-width:320px !important;}[data-cover-kpis]{grid-template-columns:1fr 1fr 1fr !important;}[data-cover-kpis]>div{padding:16px 10px 16px 0 !important;}[data-cover-kpis]>div:last-child{grid-column:1 / -1;border-left:0 !important;padding-left:0 !important;border-top:1px solid oklch(0.5 0.02 50 / 0.3);}}';
  document.head.appendChild(cs);
  if (!embedded) {
    const NAMES = { 'daviswithmaya.html': 'DavisWithMaya', 'story-and-spoon.html': 'Story & Spoon', 'daily.html': 'Daily UC Davis' };
    const i = CASES.indexOf(file(location.pathname));
    if (i < 0) return;
    const p = CASES[(i + CASES.length - 1) % CASES.length], n = CASES[(i + 1) % CASES.length];
    const mount = () => {
      const bar = document.createElement('div');
      bar.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:150;display:flex;align-items:center;gap:4px;padding:5px;border-radius:100px;background:oklch(0.2 0.015 50 / 0.92);backdrop-filter:blur(10px);box-shadow:0 14px 34px -14px oklch(0 0 0 / 0.6);font:600 12.5px 'Public Sans',sans-serif;white-space:nowrap;";
      const link = (href, txt, strong) => { const a = document.createElement('a'); a.href = href; a.textContent = txt; a.style.cssText = `padding:8px 14px;border-radius:100px;color:oklch(0.97 0.01 60);text-decoration:none;${strong ? 'background:oklch(0.72 0.13 45);color:oklch(0.15 0.02 50);font-weight:800;' : ''}`; return a; };
      bar.append(link('ventures.html', '← Back to Ventures', true), link(p, '← ' + NAMES[p]), link(n, NAMES[n] + ' →'));
      if (matchMedia('(max-width:560px)').matches) { bar.children[1].textContent = '←'; bar.children[2].textContent = '→'; }
      bar.style.transition = 'opacity .3s ease, transform .3s ease';
      const upd = () => { const on = scrollY > innerHeight * 0.9; bar.style.opacity = on ? '1' : '0'; bar.style.pointerEvents = on ? 'auto' : 'none'; bar.style.transform = 'translateX(-50%) translateY(' + (on ? '0' : '12px') + ')'; };
      addEventListener('scroll', upd, { passive: true }); upd();
      document.body.appendChild(bar);
    };
    if (document.body) mount(); else addEventListener('DOMContentLoaded', mount);
    return;
  }
  const st = document.createElement('style');
  st.textContent = 'nav{display:none !important;} [data-crumb]{display:none !important;} [data-cover-grid]{padding-top:72px !important;}';
  document.head.appendChild(st);
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^(https?:|mailto:)/.test(href) || /\.(pdf|jpg|png|mp4)$/i.test(file(href))) return;
    e.preventDefault(); e.stopPropagation();
    const f = file(href);
    if (f === 'ventures.html') parent.postMessage({ type: 'case:close' }, '*');
    else if (CASES.includes(f)) parent.postMessage({ type: 'case:open', href: f }, '*');
    else parent.postMessage({ type: 'case:nav', href }, '*');
  }, true);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') parent.postMessage({ type: 'case:close' }, '*'); });
})();
