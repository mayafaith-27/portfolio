(function(){
if (customElements.get('cs-menu')) return;
const GROUPS = [
  { label: 'Brands I founded', items: [
    ['DavisWithMaya', '5.4M profile views in one month', 'daviswithmaya.html'],
    ['Daily UC Davis', '1.2M views in the first 30 days', 'daily.html'],
    ['Story & Spoon', 'Marketing studio · first client signed', 'story-and-spoon.html'],
  ]},
  { label: 'Marketing', items: [
    ['ASUCD Marketing', 'Two content formats for 14K followers', 'marketing.html#p-asucd'],
    ['The Midnight Grind', '382 RSVPs at a single event', 'marketing.html#p-tmg'],
    ['Worship on the Lawn', 'Founded a monthly campus event', 'marketing.html#p-worship'],
  ]},
  { label: 'Design', items: [
    ['Fourth & Hope', 'Nonprofit site redesign', 'design.html#p-nonprofit'],
    ['Yesterday Vintage', 'App + web redesign', 'design.html#p-vintage'],
    ['CampusBites', 'Mobile app, research to prototype', 'design.html#p-quickbite'],
    ['Nova Open Source', 'Contributor leaderboard', 'design.html#p-nova'],
    ['Green Haven', 'Design research', 'design.html#p-green'],
  ]},
];
class CsMenu extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const size = this.getAttribute('size') || '13.5';
    const r = this.attachShadow({ mode: 'open' });
    const here = location.pathname.split('/').pop() || 'index.html';
    const active = ['daviswithmaya.html','daily.html','story-and-spoon.html'].includes(here);
    r.innerHTML = `<style>
      :host{position:relative;display:inline-flex;font-family:'Public Sans',system-ui,sans-serif;}
      button{all:unset;cursor:pointer;font-size:${size}px;font-weight:600;color:${active?'oklch(0.2 0.015 50)':'oklch(0.5 0.02 50)'};padding-bottom:4px;border-bottom:2px solid ${active?'oklch(0.56 0.13 45)':'transparent'};white-space:nowrap;display:flex;gap:5px;align-items:center;transition:color .2s;}
      button:hover,:host([open]) button{color:oklch(0.2 0.015 50);}
      .car{font-size:9px;transition:transform .2s;}
      :host([open]) .car{transform:rotate(180deg);}
      .p{position:absolute;top:calc(100% + 14px);right:-120px;width:min(620px,92vw);background:oklch(0.995 0.004 60);border:1px solid oklch(0.85 0.01 55);border-radius:16px;box-shadow:0 30px 60px -24px oklch(0.2 0.02 50 / 0.35);padding:18px;display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .18s,transform .18s,visibility .18s;z-index:300;box-sizing:border-box;}
      .p::before{content:'';position:absolute;left:0;right:0;top:-16px;height:16px;}
      :host([open]) .p{opacity:1;visibility:visible;transform:none;}
      .g{display:flex;flex-direction:column;gap:2px;}
      .g.wide{grid-column:1 / -1;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:12px;margin-bottom:6px;border-bottom:1px solid oklch(0.9 0.01 55);}
      .h{font-size:10.5px;letter-spacing:1.3px;font-weight:800;color:oklch(0.5 0.02 50);text-transform:uppercase;padding:4px 10px 6px;}
      .g.wide .h{grid-column:1 / -1;}
      a{display:block;padding:8px 10px;border-radius:10px;text-decoration:none;color:oklch(0.2 0.015 50);transition:background .15s;}
      a:hover{background:oklch(0.95 0.014 55);}
      .g.wide a{background:oklch(0.96 0.012 55);padding:12px;}
      .g.wide a:hover{background:oklch(0.92 0.02 55);}
      .t{font-size:14px;font-weight:700;font-family:'Bricolage Grotesque',sans-serif;}
      .g.wide .t{font-size:16px;}
      .d{font-size:12px;color:oklch(0.45 0.02 50);margin-top:2px;line-height:1.35;}
      .g.wide .d{color:oklch(0.48 0.12 45);font-weight:600;}
      @media (max-width:760px){.p{position:fixed;top:58px;left:10px;right:10px;width:auto;grid-template-columns:1fr;max-height:calc(100vh - 80px);overflow:auto;}.g.wide{grid-template-columns:1fr;}}
    </style>
    <button aria-haspopup="true">Case studies <span class="car">▼</span></button>
    <div class="p" role="menu">${GROUPS.map((g,i)=>`<div class="g ${i===0?'wide':''}"><div class="h">${g.label}</div>${g.items.map(([t,d,h])=>`<a href="${h}"><div class="t">${t.replace(/&/g,'&amp;')}</div><div class="d">${d}</div></a>`).join('')}</div>`).join('')}</div>`;
    const open = () => { clearTimeout(this._t); this.setAttribute('open',''); };
    const close = () => { this._t = setTimeout(() => this.removeAttribute('open'), 140); };
    this.addEventListener('mouseenter', open);
    this.addEventListener('mouseleave', close);
    r.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); this.hasAttribute('open') ? this.removeAttribute('open') : open(); });
    document.addEventListener('click', (e) => { if (!this.contains(e.target)) this.removeAttribute('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.removeAttribute('open'); });
    r.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => {
      const [p, h] = a.getAttribute('href').split('#');
      if (h && p === here) { e.preventDefault(); location.hash = 'p-' === h.slice(0,2) ? h : h; location.reload(); }
    }));
  }
}
customElements.define('cs-menu', CsMenu);
})();
