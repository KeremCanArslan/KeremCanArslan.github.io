(() => {
'use strict';

/* ================= VERİ (kurulumda yönetim panelinden gelir) ================= */
const PROJE = { ad: 'Örnek Konutları', whatsapp: '' }; // whatsapp: 905xxxxxxxxx, boşsa kişi seçtirir
const KAT_SAYISI = 4;
const KOT = n => 4 + (n - 1) * 3; // zemin 4 m, katlar 3 m

const R = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// Plan birimi: 1 birim = 10 cm. Odalar: [anahtar, ad, çokgen, fotoğraf anahtarı]
const TIPLER = {
  A: { oda: '2+1', cephe: 'Güney ve batı', kutu: [0, 80, 100, 194], dis: R(0, 80, 100, 180), odalar: [
    ['salon', 'Salon', R(0, 120, 55, 180), 'salon'],
    ['mutfak', 'Mutfak', R(55, 140, 100, 180), 'mutfak'],
    ['antre', 'Antre', [[40, 115], [100, 115], [100, 140], [55, 140], [55, 120], [40, 120]]],
    ['yatak', 'Ebeveyn yatak odası', R(0, 80, 40, 120), 'yatak'],
    ['yatak2', 'Yatak odası', R(40, 80, 70, 115)],
    ['banyo', 'Banyo', R(70, 80, 100, 100)],
    ['wc', 'WC', R(70, 100, 100, 115)],
    ['balkon', 'Balkon', R(15, 180, 85, 194)] ] },
  B: { oda: '3+1', cephe: 'Güney ve doğu', kutu: [140, 80, 240, 194], dis: R(140, 80, 240, 180), odalar: [
    ['salon', 'Salon', R(185, 125, 240, 180), 'salon'],
    ['mutfak', 'Mutfak', R(140, 150, 185, 180), 'mutfak'],
    ['antre', 'Antre', [[175, 112], [205, 112], [205, 125], [185, 125], [185, 150], [140, 150], [140, 125], [175, 125]]],
    ['yatak', 'Ebeveyn yatak odası', R(205, 80, 240, 125), 'yatak'],
    ['yatak2', 'Yatak odası', R(175, 80, 205, 112)],
    ['yatak3', 'Çocuk odası', R(140, 80, 175, 108)],
    ['banyo', 'Banyo', R(140, 108, 175, 125)],
    ['balkon', 'Balkon', R(155, 180, 225, 194)] ] },
  C: { oda: '2+1', cephe: 'Kuzey ve batı', kutu: [0, 0, 100, 80], dis: R(0, 0, 100, 80), odalar: [
    ['salon', 'Salon', R(0, 0, 50, 45), 'salon'],
    ['mutfak', 'Mutfak', R(50, 0, 100, 30), 'mutfak'],
    ['antre', 'Antre', [[50, 30], [100, 30], [100, 55], [40, 55], [40, 45], [50, 45]]],
    ['yatak', 'Ebeveyn yatak odası', R(0, 45, 40, 80), 'yatak'],
    ['banyo', 'Banyo', R(40, 55, 65, 80)],
    ['yatak2', 'Yatak odası', R(65, 55, 100, 80)] ] },
  D: { oda: '2+1', cephe: 'Kuzey ve doğu', kutu: [140, 0, 240, 80], dis: R(140, 0, 240, 80), odalar: [
    ['salon', 'Salon', R(190, 0, 240, 45), 'salon'],
    ['mutfak', 'Mutfak', R(140, 0, 190, 30), 'mutfak'],
    ['antre', 'Antre', [[190, 30], [140, 30], [140, 55], [200, 55], [200, 45], [190, 45]]],
    ['yatak', 'Ebeveyn yatak odası', R(200, 45, 240, 80), 'yatak'],
    ['banyo', 'Banyo', R(175, 55, 200, 80)],
    ['yatak2', 'Yatak odası', R(140, 55, 175, 80)] ] }
};
const TIP_SIRA = ['A', 'B', 'C', 'D'];
const TEMEL_FIYAT = { A: 7950000, B: 8400000, C: 6350000, D: 6350000 };
// Satış durumu: kat → tip → satilik | rezerve | satildi
const DURUM = {
  1: { A: 'satildi', B: 'satilik', C: 'satilik', D: 'rezerve' },
  2: { A: 'satilik', B: 'satildi', C: 'satilik', D: 'satilik' },
  3: { A: 'satilik', B: 'satilik', C: 'satildi', D: 'satilik' },
  4: { A: 'rezerve', B: 'satilik', C: 'satilik', D: 'satilik' }
};
const DURUM_AD = { satilik: 'Satışta', rezerve: 'Rezerve', satildi: 'Satıldı' };
const FOTO = { salon: 'img/oda-salon.webp', mutfak: 'img/oda-mutfak.webp', yatak: 'img/oda-yatak.webp' };

// Cephe görsellerinde kat çizgileri (görsel pikseli, 1376x768): üstten alta 5 çizgi
const CEPHE = {
  '-1': [[[290, 160], [345, 165], [1040, 163]], [[290, 262], [345, 258], [1040, 258]], [[290, 362], [345, 362], [1040, 362]], [[290, 465], [345, 466], [1040, 466]], [[290, 556], [345, 556], [1040, 556]]],
  '0': [[[335, 163], [1040, 163]], [[335, 258], [1040, 258]], [[335, 362], [1040, 362]], [[335, 466], [1040, 466]], [[335, 556], [1040, 556]]],
  '1': [[[310, 230], [940, 150], [1050, 240]], [[310, 297], [940, 260], [1050, 300]], [[310, 390], [940, 363], [1050, 395]], [[310, 484], [940, 461], [1050, 490]], [[310, 563], [940, 556], [1050, 575]]]
};
const GW = 1376, GH = 768, OREN = GW / GH;

/* ================= yardımcılar ================= */
const $ = id => document.getElementById(id);
const hareketAz = matchMedia('(prefers-reduced-motion: reduce)').matches;
const telefon = () => matchMedia('(max-width: 820px)').matches;
const alan = p => { let s = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; s += x1 * y2 - x2 * y1; } return Math.abs(s) / 2 / 100; };
const m2 = v => v.toFixed(2).replace('.', ',');
const merkez = p => { let a = 0, cx = 0, cy = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; const f = x1 * y2 - x2 * y1; a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f; } a /= 2; return [cx / (6 * a), cy / (6 * a)]; };
const yol = p => 'M' + p.map(q => q.join(' ')).join('L') + 'Z';
const tl = n => n.toLocaleString('tr-TR') + ' TL';
const icindeMi = (x, y, p) => { let ic = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ic = !ic; } return ic; };
const bekle = ms => new Promise(r => setTimeout(r, ms));

Object.values(TIPLER).forEach(t => {
  t.net = t.odalar.filter(o => o[0] !== 'balkon').reduce((s, o) => s + alan(o[2]), 0);
  t.brut = Math.round(t.net * 1.18);
  const b = t.odalar.find(o => o[0] === 'balkon'); t.balkon = b ? alan(b[2]) : 0;
});
const daireNo = (kat, tip) => (kat - 1) * 4 + TIP_SIRA.indexOf(tip) + 1;
const daireBul = no => ({ kat: Math.ceil(no / 4), tip: TIP_SIRA[(no - 1) % 4] });
const fiyat = (kat, tip) => TEMEL_FIYAT[tip] + (kat - 1) * 150000;
const satistaSay = kat => TIP_SIRA.filter(t => DURUM[kat][t] === 'satilik').length;

/* ================= durum ================= */
const D = { gorunum: 'yukleniyor', cephe: 0, kat: null, tip: null, oda: null, odaNokta: null };
const body = document.body;
function gorunumAyarla(g) { D.gorunum = g; body.dataset.gorunum = g; yolCiz(); }

function yolCiz() {
  const y = $('yol'); y.innerHTML = '';
  const ekle = (yazi, git) => { if (y.children.length) { const i = document.createElement('i'); i.textContent = '/'; y.appendChild(i); } const el = document.createElement(git ? 'button' : 'span'); el.textContent = yazi; if (git) { el.type = 'button'; el.addEventListener('click', () => gitAdim(git)); } y.appendChild(el); };
  if (D.gorunum === 'kat' || D.gorunum === 'daire' || D.gorunum === 'oda') {
    ekle('Bina', 'bina');
    ekle(D.kat + '. kat', D.gorunum === 'kat' ? null : 'kat');
    if (D.gorunum !== 'kat') ekle('Daire ' + daireNo(D.kat, D.tip), null);
  }
}
function gitAdim(h) { if (h === 'bina') binayaDon(); else if (h === 'kat') kataDon(); else if (h === 'daire') daireyeDon(); }

/* ================= BİNA: yerleşim ================= */
const sahne = $('sahne'), kutu = $('kutu'), ksvg = $('katlar-svg');
const resimler = [...kutu.querySelectorAll('.cephe')];
let kutuR = null;
function yerlesim() {
  const W = innerWidth, H = innerHeight;
  let w, h, x, y;
  if (telefon()) {
    w = W * 1.45; h = w / OREN; x = (W - w) / 2; y = 0;
    body.style.setProperty('--sahne-h', Math.round(h) + 'px');
  } else {
    if (W / H > OREN) { w = W; h = W / OREN; } else { h = H; w = H * OREN; }
    x = (W - w) / 2; y = (H - h) / 2;
  }
  kutu.style.setProperty('--kx', x + 'px'); kutu.style.setProperty('--ky', y + 'px');
  kutu.style.setProperty('--kw', w + 'px'); kutu.style.setProperty('--kh', h + 'px');
  kutuR = null;
}

/* ================= BİNA: cephe çizimi ================= */
let p = 0, hedef = 0;
function cepheCiz(pp) {
  resimler.forEach(im => {
    const c = +im.dataset.c, d = pp - c, wgt = Math.max(0, 1 - Math.abs(d));
    im.style.opacity = wgt;
    im.style.transform = `translateX(${(-d * 7).toFixed(3)}%) scale(${(1 + Math.abs(d) * 0.04).toFixed(4)})`;
    im.style.zIndex = wgt > .5 ? 2 : 1;
  });
}
function katCokgen(cephe, n) {
  const L = CEPHE[String(cephe)], ust = L[KAT_SAYISI - n], alt = L[KAT_SAYISI - n + 1];
  return ust.concat([...alt].reverse());
}
function katKatmani(ciz) {
  const c = String(D.cephe), L = CEPHE[c];
  const x0 = Math.min(...L.map(l => l[0][0])) - 60;
  let h = '';
  for (let n = 1; n <= KAT_SAYISI; n++) {
    const pg = katCokgen(c, n), [mx, my] = merkez(pg), s = satistaSay(n);
    const yazi = `${n}. kat, ${s ? s + ' daire satışta' : 'satışta daire yok'}`;
    const tw = yazi.length * 8.6 + 34;
    h += `<g class="kat" data-kat="${n}"><path class="alan" d="${yol(pg)}"/><path class="kenar" d="${yol(pg)}"/>` +
      `<g class="kat-etiket"><rect x="${mx - tw / 2}" y="${my - 19}" width="${tw}" height="38" rx="19"/><text x="${mx}" y="${my + 6}" text-anchor="middle">${yazi}</text></g></g>`;
  }
  // kot çizgisi: binanın solunda, mimari çizimdeki gibi. Çizgi i, (KAT_SAYISI - i + 1). katın döşemesi; i = 0 çatı.
  const ys = L.map(l => l[0][1]);
  h += `<g class="kot${ciz ? ' ciz' : ''}"><line pathLength="1" x1="${x0}" y1="${ys[0]}" x2="${x0}" y2="${ys[ys.length - 1]}"/>`;
  ys.forEach((yy, i) => {
    h += `<line class="tik" pathLength="1" x1="${x0 - 7}" y1="${yy}" x2="${x0 + 7}" y2="${yy}"/>`;
    h += `<text class="kot-deger" x="${x0 - 12}" y="${yy + 5}" text-anchor="end">+${KOT(KAT_SAYISI - i + 1)},00</text>`;
  });
  h += `</g>`;
  ksvg.innerHTML = h;
  if (ciz && !hareketAz) { ksvg.classList.remove('ciziyor'); void ksvg.getBoundingClientRect(); ksvg.classList.add('ciziyor'); }
  if (vurguKat) katVurgu(vurguKat);
}

/* ================= BİNA: kat listesi ================= */
const katListesi = $('kat-listesi');
function katListesiCiz() {
  katListesi.innerHTML = '';
  for (let n = KAT_SAYISI; n >= 1; n--) {
    const s = satistaSay(n);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'kat-satir'; b.dataset.kat = n;
    b.innerHTML = `<span class="no">${n}</span><span class="ad">${n}. kat</span><span class="durum"><span class="hucreler" aria-hidden="true">${TIP_SIRA.map(t => `<i class="h-${DURUM[n][t]}"></i>`).join('')}</span>${s ? s + ' daire satışta' : 'Satışta daire yok'}</span>`;
    b.addEventListener('pointerenter', () => katVurgu(n));
    b.addEventListener('pointerleave', () => katVurgu(null));
    b.addEventListener('focus', () => katVurgu(n));
    b.addEventListener('blur', () => katVurgu(null));
    b.addEventListener('click', () => katAc(n));
    katListesi.appendChild(b);
  }
}
let vurguKat = null;
function katVurgu(n) {
  vurguKat = n;
  ksvg.querySelectorAll('.kat').forEach(g => g.classList.toggle('on', +g.dataset.kat === n));
  katListesi.querySelectorAll('.kat-satir').forEach(b => b.classList.toggle('on', +b.dataset.kat === n));
  kutu.classList.toggle('isaret', !!n);
}

/* ================= BİNA: sürükleme ve dokunma ================= */
function gorselNokta(cx, cy) { const r = kutu.getBoundingClientRect(); return [(cx - r.left) / r.width * GW, (cy - r.top) / r.height * GH]; }
function noktadakiKat(cx, cy) {
  if (Math.abs(p - Math.round(p)) > .02) return null;
  const [x, y] = gorselNokta(cx, cy);
  for (let n = 1; n <= KAT_SAYISI; n++) if (icindeMi(x, y, katCokgen(D.cephe, n))) return n;
  return null;
}
let surukle = null;
kutu.addEventListener('pointerdown', e => {
  if (D.gorunum !== 'bina') return;
  surukle = { x: e.clientX, y: e.clientY, p0: p, hareket: false, t: performance.now(), hiz: 0, sonX: e.clientX };
});
addEventListener('pointermove', e => {
  if (!surukle) { if (D.gorunum === 'bina' && e.target.closest && e.target.closest('#kutu')) { const n = noktadakiKat(e.clientX, e.clientY); if (n !== vurguKat) katVurgu(n); } return; }
  const dx = e.clientX - surukle.x;
  if (!surukle.hareket) {
    if (Math.abs(dx) < 8) return;
    if (Math.abs(e.clientY - surukle.y) > Math.abs(dx)) { surukle = null; return; } // dikey kaydırma (telefon)
    surukle.hareket = true; kutu.classList.add('surukle'); katVurgu(null); ksvg.style.opacity = 0;
    try { kutu.setPointerCapture(e.pointerId); } catch (_) {}
  }
  const now = performance.now(), genislik = Math.min(innerWidth, 1200) * .55;
  surukle.hiz = (e.clientX - surukle.sonX) / Math.max(1, now - surukle.t); surukle.sonX = e.clientX; surukle.t = now;
  p = Math.max(-1, Math.min(1, surukle.p0 - dx / genislik)); hedef = p; cepheCiz(p);
});
function birak(e) {
  if (!surukle) return;
  const s = surukle; surukle = null; kutu.classList.remove('surukle');
  if (!s.hareket) {
    // pointercancel: tarayıcı sayfayı kaydırmaya başladı, dokunma kat seçimi sayılmaz
    if (e.type === 'pointerup') { const n = noktadakiKat(e.clientX, e.clientY); if (n) katAc(n); }
    return;
  }
  const m = p - s.p0 - s.hiz * 160;
  const yeni = Math.abs(m) > .12 ? Math.round(s.p0) + Math.sign(m) : Math.round(s.p0);
  cepheGit(Math.max(-1, Math.min(1, yeni)));
}
addEventListener('pointerup', birak); addEventListener('pointercancel', birak);
kutu.addEventListener('pointerleave', () => { if (!surukle) katVurgu(null); });

let animId = 0;
function cepheGit(c) {
  hedef = c; const bas = p, sure = hareketAz ? 1 : 750, t0 = performance.now(), id = ++animId;
  const degisti = c !== D.cephe; D.cephe = c;
  document.querySelectorAll('.cephe-sec button').forEach(b => b.classList.toggle('secili', +b.dataset.cephe === c));
  if (degisti) ksvg.style.opacity = 0;
  const adim = now => {
    if (id !== animId) return;
    const k = Math.min(1, (now - t0) / sure), e = 1 - Math.pow(1 - k, 3);
    p = bas + (c - bas) * e; cepheCiz(p);
    if (k < 1) requestAnimationFrame(adim);
    else { p = c; cepheCiz(p); katKatmani(degisti); ksvg.style.opacity = 1; }
  };
  requestAnimationFrame(adim);
}
document.querySelectorAll('.cephe-sec button').forEach(b => b.addEventListener('click', () => cepheGit(+b.dataset.cephe)));
addEventListener('wheel', e => {
  if (D.gorunum !== 'bina' || Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 30) return;
  const c = Math.max(-1, Math.min(1, D.cephe + Math.sign(e.deltaX)));
  if (c !== D.cephe && Math.abs(p - Math.round(p)) < .01) cepheGit(c);
}, { passive: true });

/* ================= KAT ================= */
const katPlan = $('kat-plan');
const DESEN = `<defs>
  <pattern id="t-satildi" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#dfe4e1"/><line x1="0" y1="0" x2="0" y2="4" stroke="#4a5157" stroke-width="1" opacity=".45"/></pattern>
  <pattern id="t-rezerve" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#fff"/><line x1="0" y1="0" x2="0" y2="4" stroke="#b97c0c" stroke-width="1" opacity=".55"/></pattern>
  <pattern id="t-cekirdek" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="3" height="3" fill="#dfe4e1"/><line x1="0" y1="0" x2="0" y2="3" stroke="#23272b" stroke-width=".4" opacity=".35"/></pattern>
</defs>`;
function katPlaniCiz(ciz) {
  const kat = D.kat;
  let h = `<svg class="plan${ciz && !hareketAz ? ' ciz' : ''}" viewBox="-24 -30 288 242" role="img" aria-label="${kat}. kat planı">${DESEN}`;
  // çekirdek: merdiven, asansör, hol
  h += `<path class="cekirdek" d="${yol(R(100, 0, 140, 180))}"/>`;
  h += `<rect x="104" y="4" width="32" height="44" fill="#fff" stroke="#23272b" stroke-width=".7"/>`;
  for (let y = 8; y < 46; y += 3.4) h += `<line class="basamak" x1="104" y1="${y}" x2="120" y2="${y}"/><line class="basamak" x1="120" y1="${y}" x2="136" y2="${y}"/>`;
  h += `<line x1="120" y1="4" x2="120" y2="48" stroke="#23272b" stroke-width=".7"/>`;
  h += `<rect x="108" y="54" width="24" height="20" fill="#fff" stroke="#23272b" stroke-width=".7"/><path d="M108 54l24 20M132 54l-24 20" stroke="#23272b" stroke-width=".4"/>`;
  h += `<text class="yazi" x="120" y="86" text-anchor="middle" style="font-size:4.2px">Asansör</text><text class="yazi" x="120" y="128" text-anchor="middle" style="font-size:4.2px">Kat holü</text>`;
  TIP_SIRA.forEach(t => {
    const T = TIPLER[t], d = DURUM[kat][t], no = daireNo(kat, t);
    const [kx0, ky0, kx1, ky1] = T.kutu, dp = T.dis;
    const [lx, ly] = merkez(dp);
    h += `<g class="daire ${d}" data-tip="${t}" tabindex="-1">`;
    h += `<path class="zemin" d="${yol(dp)}"/>`;
    T.odalar.forEach(o => { if (o[0] === 'balkon') h += `<path class="zemin" d="${yol(o[2])}"/>`; });
    T.odalar.forEach(o => { h += `<path class="ic" d="${yol(o[2])}"/>`; });
    h += `<path class="duvar" d="${yol(dp)}"/>`;
    h += `<path class="vurgu" d="${yol(dp)}"/>`;
    h += `<rect class="kutu-ref" x="${kx0}" y="${ky0}" width="${kx1 - kx0}" height="${ky1 - ky0}" fill="none" pointer-events="none"/>`;
    h += `<g class="etiket"><rect x="${lx - 23}" y="${ly - 9}" width="46" height="18" rx="2"/><text class="e1" x="${lx}" y="${ly - 1}" text-anchor="middle">Daire ${no}</text><text class="e2" x="${lx}" y="${ly + 5.6}" text-anchor="middle">${T.oda}, ${Math.round(T.net)} m², ${DURUM_AD[d].toLocaleLowerCase('tr-TR')}</text></g>`;
    h += `</g>`;
  });
  // kuzey oku ve ölçek
  h += `<g class="kuzey" transform="translate(252 -16)"><path d="M0 -8 5 6 0 3 -5 6Z"/><text class="yazi" y="13" text-anchor="middle" style="font-size:4.4px;font-weight:600">K</text></g>`;
  h += `<g class="olcek" transform="translate(0 204)"><rect x="0" y="0" width="25" height="1.6"/><rect x="25" y="0" width="25" height="1.6" fill="#fff" stroke="#23272b" stroke-width=".4"/><text class="yazi" x="0" y="7" style="font-size:3.6px">0</text><text class="yazi" x="25" y="7" text-anchor="middle" style="font-size:3.6px">2,5</text><text class="yazi" x="50" y="7" text-anchor="middle" style="font-size:3.6px">5 m</text></g>`;
  h += `<text class="yazi" x="120" y="207" text-anchor="middle" style="font-size:4.4px">Sokak cephesi</text>`;
  h += `</svg>`;
  katPlan.innerHTML = h;
  katPlan.querySelectorAll('.daire').forEach(g => {
    const t = g.dataset.tip;
    g.addEventListener('pointerenter', () => daireVurgu(t));
    g.addEventListener('pointerleave', () => daireVurgu(null));
    g.addEventListener('click', () => daireAc(D.kat, t, g.querySelector('.kutu-ref')));
  });
  // yan liste
  const s = satistaSay(kat);
  $('kat-ad').textContent = kat + '. kat';
  $('kat-ozet').textContent = s ? `4 daireden ${s} tanesi satışta. Daireye dokunup planını ve odalarını görün.` : 'Bu kattaki dairelerin hepsi satıldı ya da rezerve.';
  const ul = $('daire-listesi'); ul.innerHTML = '';
  TIP_SIRA.forEach(t => {
    const T = TIPLER[t], d = DURUM[kat][t], no = daireNo(kat, t);
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="daire-satir" data-tip="${t}"><span class="ad">Daire ${no}</span><span class="durum durum-${d}">${DURUM_AD[d]}</span><span class="tip">${T.oda}, ${Math.round(T.net)} m² net, ${T.cephe.toLocaleLowerCase('tr-TR')} cephe</span></button>`;
    const b = li.firstElementChild;
    b.addEventListener('pointerenter', () => daireVurgu(t));
    b.addEventListener('pointerleave', () => daireVurgu(null));
    b.addEventListener('focus', () => daireVurgu(t));
    b.addEventListener('blur', () => daireVurgu(null));
    b.addEventListener('click', () => daireAc(D.kat, t, katPlan.querySelector(`.daire[data-tip="${t}"] .kutu-ref`)));
    ul.appendChild(li);
  });
  $('kat-ust').disabled = kat >= KAT_SAYISI; $('kat-alt').disabled = kat <= 1;
}
function daireVurgu(t) {
  katPlan.querySelectorAll('.daire').forEach(g => g.classList.toggle('on', g.dataset.tip === t));
  document.querySelectorAll('#daire-listesi .daire-satir').forEach(b => b.classList.toggle('on', b.dataset.tip === t));
}

async function katAc(n) {
  if (D.gorunum !== 'bina') return;
  D.kat = n; katVurgu(n);
  const pg = katCokgen(D.cephe, n), [mx, my] = merkez(pg), kr = kutu.getBoundingClientRect(), sr = sahne.getBoundingClientRect();
  sahne.style.transformOrigin = `${kr.left - sr.left + mx / GW * kr.width}px ${kr.top - sr.top + my / GH * kr.height}px`;
  sahne.classList.add('kataGit');
  await bekle(hareketAz ? 0 : 320);
  katPlaniCiz(true);
  gorunumAyarla('kat');
  $('g-kat').classList.add('acik'); $('g-kat').scrollTop = 0;
  katVurgu(null);
}
function binayaDon() {
  if (D.gorunum === 'oda') odaKapat(true);
  $('g-daire').classList.remove('acik', 'yerlesti');
  $('g-kat').classList.remove('acik');
  sahne.classList.remove('kataGit');
  gorunumAyarla('bina');
  setTimeout(() => katKatmani(true), hareketAz ? 0 : 350);
}
function katDegistir(n) {
  if (n < 1 || n > KAT_SAYISI) return;
  D.kat = n; const svg = katPlan.querySelector('svg');
  if (svg && !hareketAz) { svg.style.transition = 'opacity .25s ease'; svg.style.opacity = 0; setTimeout(() => { katPlaniCiz(false); yolCiz(); }, 250); }
  else { katPlaniCiz(false); yolCiz(); }
}
$('kat-ust').addEventListener('click', () => katDegistir(D.kat + 1));
$('kat-alt').addEventListener('click', () => katDegistir(D.kat - 1));

/* ================= DAİRE ================= */
const dPlan = $('daire-plan');
function dairePlaniCiz() {
  const T = TIPLER[D.tip], [x0, y0, x1, y1] = T.kutu, pad = 16;
  let h = `<svg class="plan" viewBox="${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}" role="img" aria-label="Daire ${daireNo(D.kat, D.tip)} planı">`;
  h += `<rect class="kutu-ref" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" pointer-events="none"/>`;
  T.odalar.forEach(o => {
    h += `<g class="oda${o[0] === 'balkon' ? ' balkon' : ''}" data-oda="${o[0]}"><path class="zemin" d="${yol(o[2])}" stroke="#23272b" stroke-width=".8"/><path class="vurgu" d="${yol(o[2])}"/></g>`;
  });
  h += `<path class="duvar" d="${yol(T.dis)}" pointer-events="none"/>`;
  h += `<g class="yazilar" pointer-events="none">`;
  T.odalar.forEach(o => {
    const [cx, cy] = merkez(o[2]);
    const ad = o[1].length > 13 && (o[2][1][0] - o[2][0][0]) < 45 ? o[1].replace(' yatak odası', '') : o[1];
    h += `<text class="yazi oda-ad" x="${cx}" y="${cy - 1}" text-anchor="middle">${ad}</text><text class="yazi oda-m2" x="${cx}" y="${cy + 4.4}" text-anchor="middle">${m2(alan(o[2]))} m²</text>`;
    if (o[3]) h += `<g class="foto" transform="translate(${cx} ${cy - 9.5})"><circle r="3.2"/><path d="M-1.6 -.6h.8l.5-.7h.6l.5.7h.8v2h-3.2z"/><circle class="mercek" cy=".45" r=".55"/></g>`;
  });
  h += `</g>`;
  // ölçü çizgileri
  const w = (x1 - x0) / 10, dh = (T.dis[2][1] - T.dis[0][1]) / 10;
  h += `<g class="olcu" pointer-events="none"><line x1="${x0}" y1="${y0 - 8}" x2="${x1}" y2="${y0 - 8}"/><line x1="${x0}" y1="${y0 - 11}" x2="${x0}" y2="${y0 - 5}"/><line x1="${x1}" y1="${y0 - 11}" x2="${x1}" y2="${y0 - 5}"/><text x="${(x0 + x1) / 2}" y="${y0 - 10}" text-anchor="middle">${m2(w)} m</text>`;
  h += `<line x1="${x0 - 8}" y1="${T.dis[0][1]}" x2="${x0 - 8}" y2="${T.dis[2][1]}"/><line x1="${x0 - 11}" y1="${T.dis[0][1]}" x2="${x0 - 5}" y2="${T.dis[0][1]}"/><line x1="${x0 - 11}" y1="${T.dis[2][1]}" x2="${x0 - 5}" y2="${T.dis[2][1]}"/><text transform="translate(${x0 - 10} ${(T.dis[0][1] + T.dis[2][1]) / 2}) rotate(-90)" text-anchor="middle">${m2(dh)} m</text></g>`;
  h += `</svg>`;
  dPlan.innerHTML = h;
  dPlan.querySelectorAll('.oda').forEach(g => {
    g.addEventListener('pointerenter', () => odaVurgu(g.dataset.oda));
    g.addEventListener('pointerleave', () => odaVurgu(null));
    g.addEventListener('click', e => odaSec(g.dataset.oda, e.clientX, e.clientY));
  });
}
function odaVurgu(k) {
  dPlan.querySelectorAll('.oda').forEach(g => g.classList.toggle('on', g.dataset.oda === k));
  document.querySelectorAll('#oda-listesi .oda-satir').forEach(b => b.classList.toggle('on', b.dataset.oda === k));
}
function odaSec(k, x, y) {
  const o = TIPLER[D.tip].odalar.find(q => q[0] === k);
  if (o && o[3]) odaAc(k, x, y); else odaVurgu(k);
}
function daireYanCiz() {
  const T = TIPLER[D.tip], d = DURUM[D.kat][D.tip], no = daireNo(D.kat, D.tip);
  $('daire-ad').textContent = 'Daire ' + no;
  $('daire-tip').textContent = `${T.oda}, ${Math.round(T.net)} m² net, ${T.brut} m² brüt`;
  $('daire-bilgi').innerHTML = `<dt>Kat</dt><dd>${D.kat}. kat</dd><dt>Cephe</dt><dd>${T.cephe}</dd><dt>Balkon</dt><dd>${T.balkon ? m2(T.balkon) + ' m²' : 'Yok'}</dd><dt>Durum</dt><dd class="durum-${d}">${DURUM_AD[d]}</dd>`;
  const f = $('daire-fiyat');
  if (d === 'satildi') {
    const benzer = [];
    for (let k = 1; k <= KAT_SAYISI; k++) if (DURUM[k][D.tip] === 'satilik') benzer.push(daireNo(k, D.tip));
    f.innerHTML = `<p class="satildi-not">Bu daire satıldı.</p>` + (benzer.length ? `<p class="benzer">Aynı tipte satışta olanlar: ${benzer.map(n => `<button type="button" data-no="${n}">Daire ${n}</button>`).join(', ')}</p>` : '');
    f.querySelectorAll('[data-no]').forEach(b => b.addEventListener('click', () => { const q = daireBul(+b.dataset.no); daireGec(q.kat, q.tip); }));
  } else {
    f.innerHTML = `<strong>${tl(fiyat(D.kat, D.tip))}</strong><small>${d === 'rezerve' ? 'Rezerve. Satış iptal olursa sizi arayalım.' : 'Örnek fiyat. Fiyatlar yönetim panelinden girilir.'}</small>`;
  }
  const ul = $('oda-listesi'); ul.innerHTML = '';
  T.odalar.forEach(o => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="oda-satir" data-oda="${o[0]}"><span class="ad">${o[1]}</span>${o[3] ? '<svg viewBox="0 0 16 16" aria-label="Fotoğrafı var"><path d="M2 5h3l1.2-1.6h3.6L11 5h3v8H2z"/><circle cx="8" cy="9" r="2.3"/></svg>' : ''}<span class="m2">${m2(alan(o[2]))} m²</span></button>`;
    const b = li.firstElementChild;
    b.addEventListener('pointerenter', () => odaVurgu(o[0]));
    b.addEventListener('pointerleave', () => odaVurgu(null));
    b.addEventListener('click', () => {
      const g = dPlan.querySelector(`.oda[data-oda="${o[0]}"] .zemin`), r = g ? g.getBoundingClientRect() : b.getBoundingClientRect();
      odaSec(o[0], r.left + r.width / 2, r.top + r.height / 2);
    });
    ul.appendChild(li);
  });
  const mesaj = `Merhaba, ${PROJE.ad} Daire ${no} (${D.kat}. kat, ${T.oda}) hakkında bilgi almak istiyorum.`;
  $('wa').href = `https://wa.me/${PROJE.whatsapp}?text=${encodeURIComponent(mesaj)}`;
  $('daire-eylem').hidden = d === 'satildi';
  const sira = daireNo(D.kat, D.tip);
  $('onceki').disabled = sira <= 1; $('sonraki').disabled = sira >= KAT_SAYISI * 4;
}

async function daireAc(kat, tip, kaynak) {
  if (D.gorunum !== 'kat') return;
  D.kat = kat; D.tip = tip;
  const kr = kaynak ? kaynak.getBoundingClientRect() : null;
  dairePlaniCiz(); daireYanCiz();
  const gd = $('g-daire'); gd.classList.remove('yerlesti'); gd.scrollTop = 0;
  gd.classList.add('acik'); $('g-kat').classList.remove('acik');
  gorunumAyarla('daire');
  const svg = dPlan.querySelector('svg');
  if (kr && !hareketAz) {
    const e0 = svg.getBoundingClientRect(), hr = svg.querySelector('.kutu-ref').getBoundingClientRect();
    const s = kr.width / hr.width;
    const tx = kr.left - e0.left - s * (hr.left - e0.left), ty = kr.top - e0.top - s * (hr.top - e0.top);
    svg.classList.remove('ucus'); svg.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    void svg.getBoundingClientRect();
    svg.classList.add('ucus'); svg.style.transform = '';
    await bekle(820);
  }
  gd.classList.add('yerlesti');
}
async function daireGec(kat, tip) {
  D.kat = kat; D.tip = tip;
  const svg = dPlan.querySelector('svg'), gd = $('g-daire');
  if (svg && !hareketAz) { svg.style.transition = 'opacity .22s ease'; svg.style.opacity = 0; gd.classList.remove('yerlesti'); await bekle(220); }
  dairePlaniCiz(); daireYanCiz(); yolCiz();
  const yeni = dPlan.querySelector('svg');
  if (!hareketAz) { yeni.style.opacity = 0; yeni.style.transition = 'opacity .35s ease'; void yeni.getBoundingClientRect(); yeni.style.opacity = 1; }
  gd.classList.add('yerlesti');
}
$('onceki').addEventListener('click', () => { const q = daireBul(daireNo(D.kat, D.tip) - 1); daireGec(q.kat, q.tip); });
$('sonraki').addEventListener('click', () => { const q = daireBul(daireNo(D.kat, D.tip) + 1); daireGec(q.kat, q.tip); });
function kataDon() {
  if (D.gorunum === 'oda') odaKapat(true);
  katPlaniCiz(false);
  $('g-daire').classList.remove('acik', 'yerlesti');
  $('g-kat').classList.add('acik');
  gorunumAyarla('kat');
  daireVurgu(D.tip);
  setTimeout(() => daireVurgu(null), 1200);
}

/* ================= ODA ================= */
const gOda = $('g-oda'), odaResim = $('oda-resim');
function odaAc(k, x, y) {
  const T = TIPLER[D.tip], o = T.odalar.find(q => q[0] === k);
  D.oda = k; D.odaNokta = [x, y];
  odaResim.style.backgroundImage = `url(${FOTO[o[3]]})`;
  gOda.style.setProperty('--cx', x + 'px'); gOda.style.setProperty('--cy', y + 'px');
  $('oda-ad').textContent = o[1];
  $('oda-alt').textContent = `${m2(alan(o[2]))} m², Daire ${daireNo(D.kat, D.tip)}, ${D.kat}. kat`;
  const c = $('oda-cipler'); c.innerHTML = '';
  T.odalar.filter(q => q[3]).forEach(q => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = q[1]; b.classList.toggle('secili', q[0] === k);
    b.addEventListener('click', () => odaDegistir(q[0]));
    c.appendChild(b);
  });
  const img = new Image(); img.src = FOTO[o[3]];
  const goster = () => { void gOda.offsetWidth; gOda.classList.add('acik'); gorunumAyarla('oda'); };
  if (img.complete) goster(); else { img.onload = img.onerror = goster; }
}
function odaDegistir(k) {
  const T = TIPLER[D.tip], o = T.odalar.find(q => q[0] === k); D.oda = k;
  odaResim.animate ? odaResim.animate([{ opacity: 1 }, { opacity: .2 }, { opacity: 1 }], { duration: hareketAz ? 1 : 500 }) : null;
  setTimeout(() => { odaResim.style.backgroundImage = `url(${FOTO[o[3]]})`; }, hareketAz ? 0 : 220);
  $('oda-ad').textContent = o[1];
  $('oda-alt').textContent = `${m2(alan(o[2]))} m², Daire ${daireNo(D.kat, D.tip)}, ${D.kat}. kat`;
  $('oda-cipler').querySelectorAll('button').forEach(b => b.classList.toggle('secili', b.textContent === o[1]));
}
function odaKapat(hemen) {
  gOda.classList.remove('acik');
  if (hemen) return;
  gorunumAyarla('daire');
}
function daireyeDon() { odaKapat(false); }

/* ================= LEVHALAR ================= */
const perde = $('perde'); let acikLevha = null, oncekiOdak = null;
function levhaAc(id) {
  levhaKapat(true);
  const l = $(id); acikLevha = l; oncekiOdak = document.activeElement;
  perde.hidden = false; l.hidden = false;
  requestAnimationFrame(() => { perde.classList.add('acik'); l.classList.add('acik'); l.querySelector('.kapat').focus(); });
}
function levhaKapat(hemen) {
  if (!acikLevha) return;
  const l = acikLevha; acikLevha = null;
  perde.classList.remove('acik'); l.classList.remove('acik');
  const bitir = () => { if (!l.classList.contains('acik')) { l.hidden = true; if (!acikLevha) perde.hidden = true; } };
  if (hemen || hareketAz) bitir(); else setTimeout(bitir, 450);
  if (oncekiOdak && oncekiOdak.focus) oncekiOdak.focus();
}
$('proje-ac').addEventListener('click', () => levhaAc('proje'));
document.querySelectorAll('[data-form]').forEach(b => b.addEventListener('click', () => {
  const daire = b.dataset.form === 'daire' && D.tip;
  $('form-konu').textContent = daire ? `Daire ${daireNo(D.kat, D.tip)} (${D.kat}. kat, ${TIPLER[D.tip].oda}) için arama talebi` : `${PROJE.ad} hakkında arama talebi`;
  $('arama-formu').hidden = false; $('form-tamam').hidden = true; $('form-hata').textContent = '';
  levhaAc('form');
}));
document.querySelectorAll('[data-kapat]').forEach(b => b.addEventListener('click', () => levhaKapat()));
perde.addEventListener('click', () => levhaKapat());
$('arama-formu').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, ad = f.ad.value.trim(), tel = f.tel.value.replace(/\D/g, '');
  let hata = '';
  if (!ad) hata = 'Adınızı yazın.';
  else if (tel.length < 10 || tel.length > 12) hata = 'Telefon numarasını 05xx xxx xx xx biçiminde yazın.';
  else if (!f.kvkk.checked) hata = 'Devam etmek için izin kutusunu işaretleyin.';
  $('form-hata').textContent = hata;
  if (hata) return;
  f.reset(); f.hidden = true; $('form-tamam').hidden = false;
});

/* ================= gezinme ================= */
document.querySelectorAll('[data-git]').forEach(b => b.addEventListener('click', () => gitAdim(b.dataset.git)));
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (acikLevha) return levhaKapat();
    if (D.gorunum === 'oda') return daireyeDon();
    if (D.gorunum === 'daire') return kataDon();
    if (D.gorunum === 'kat') return binayaDon();
  }
  if (D.gorunum === 'bina' && !acikLevha && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.target.closest('input, select')) {
    const c = Math.max(-1, Math.min(1, D.cephe + (e.key === 'ArrowRight' ? 1 : -1)));
    if (c !== D.cephe) cepheGit(c);
  }
});
addEventListener('resize', () => { yerlesim(); });

/* ================= açılış ================= */
yerlesim(); cepheCiz(0); katListesiCiz();
const yuklenecek = resimler.map(im => im.decode ? im.decode().catch(() => {}) : Promise.resolve());
let biten = 0;
yuklenecek.forEach(pr => pr.then(() => { biten++; $('yukleme-dolu').style.width = (biten / yuklenecek.length * 100) + '%'; }));
Promise.all([Promise.all(yuklenecek), document.fonts ? document.fonts.ready : null]).then(async () => {
  await bekle(hareketAz ? 0 : 250);
  $('g-bina').classList.add('acik');
  gorunumAyarla('bina');
  katKatmani(true);
  // oda görsellerini arka planda hazırla
  setTimeout(() => Object.values(FOTO).forEach(src => { const i = new Image(); i.src = src; }), 1500);
});
})();
