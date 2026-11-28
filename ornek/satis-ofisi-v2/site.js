(() => {
'use strict';

/* ================= VERİ (kurulumda yönetim panelinden gelir) ================= */
const PROJE = { ad: 'Focus Prestij', whatsapp: '' }; // whatsapp: 905xxxxxxxxx, boşsa kişi seçtirir
const KAT_SAYISI = 12;
const BLOKLAR = ['A', 'B'];
const GW = 1600, GH = 893, OREN = GW / GH;

// Kuşbakışı renderlarda her bloğun görünen dikey köşeleri (görsel pikseli, soldan sağa):
// [çatı altı, podyum üstü]. Katlar bu köşelerden perspektife uygun bölünür.
const KENAR = {
  on: {
    A: [[[308, 89], [337, 431]], [[490, 101], [503, 446]], [[777, 122], [777, 506]]],
    B: [[[797, 190], [820, 580]], [[1163, 303], [1138, 734]], [[1343, 187], [1302, 594]]]
  },
  arka: {
    B: [[[312, 272], [355, 618]], [[436, 412], [480, 740]], [[800, 260], [793, 585]]],
    A: [[[850, 128], [905, 485]], [[961, 196], [980, 505]], [[1292, 135], [1261, 445]]]
  }
};

const R = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// Örnek kat planı. Plan birimi: 1 birim = 10 cm. Odalar: [anahtar, ad, çokgen, fotoğraf]
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
    ['mutfak', 'Mutfak', R(140, 140, 185, 180), 'mutfak'],
    ['antre', 'Antre', [[166, 108], [175, 108], [175, 112], [205, 112], [205, 125], [185, 125], [185, 140], [140, 140], [140, 125], [166, 125]]],
    ['yatak', 'Ebeveyn yatak odası', R(205, 80, 240, 125), 'yatak'],
    ['yatak2', 'Yatak odası', R(175, 80, 205, 112)],
    ['yatak3', 'Çocuk odası', R(140, 80, 175, 108)],
    ['banyo', 'Banyo', R(140, 108, 166, 125)],
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
const TEMEL_FIYAT = { A: 7450000, B: 8950000, C: 6650000, D: 6650000 };
const DURUM_AD = { satilik: 'Satışta', rezerve: 'Rezerve', satildi: 'Satıldı' };
const FOTO = { salon: 'img/oda-salon.webp', mutfak: 'img/oda-mutfak.webp', yatak: 'img/oda-yatak.webp' };
const PLAN_GORSEL = {
  kat: { src: 'img/plan-kat.webp', vb: [-35.2, -19.4, 310.4, 232.8] },
  A: { src: 'img/plan-A.webp', vb: [-10, 57, 120, 160] },
  B: { src: 'img/plan-B.webp', vb: [130, 57, 120, 160] },
  C: { src: 'img/plan-C.webp', vb: [-14, -8, 128, 96] },
  D: { src: 'img/plan-D.webp', vb: [126, -8, 128, 96] }
};
const MESAFE = [['TEM Otoyolu bağlantısı', '4 dk'], ['Basın Ekspres Yolu', '7 dk'], ['Metro istasyonu', '9 dk'], ['Alışveriş merkezi', '8 dk'], ['İstanbul Havalimanı', '28 dk']];
// Galeri: [dosya, dikey mi]
const GALERI = [['g01', 0], ['g11', 1], ['g03', 0], ['g02', 1], ['g09', 0], ['g10', 1], ['g14', 0], ['g04', 1], ['g15', 0], ['g05', 1], ['g07', 1], ['g12', 1], ['g06', 1], ['g13', 1], ['g08', 1], ['g16', 1]];

/* ================= yardımcılar ================= */
const $ = id => document.getElementById(id);
const body = document.body;
const hareketAz = matchMedia('(prefers-reduced-motion: reduce)').matches;
const telefon = () => matchMedia('(max-width: 820px)').matches;
const bekle = ms => new Promise(r => setTimeout(r, hareketAz ? 0 : ms));
const alan = p => { let s = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; s += x1 * y2 - x2 * y1; } return Math.abs(s) / 2 / 100; };
const m2 = v => v.toFixed(2).replace('.', ',');
const merkez = p => { let a = 0, cx = 0, cy = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; const f = x1 * y2 - x2 * y1; a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f; } a /= 2; return [cx / (6 * a), cy / (6 * a)]; };
const yol = p => 'M' + p.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + 'Z';
const tl = n => Math.round(n).toLocaleString('tr-TR') + ' TL';
const icindeMi = (x, y, p) => { let ic = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ic = !ic; } return ic; };
const onYuklenen = new Map();
const yukle = src => { if (!onYuklenen.has(src)) onYuklenen.set(src, new Promise(r => { const i = new Image(); i.onload = i.onerror = () => r(); i.src = src; })); return onYuklenen.get(src); };
const sinirla = (v, a, b) => Math.max(a, Math.min(b, v));

Object.values(TIPLER).forEach(t => {
  t.net = t.odalar.filter(o => o[0] !== 'balkon').reduce((s, o) => s + alan(o[2]), 0);
  t.brut = Math.round(t.net * 1.22);
  const b = t.odalar.find(o => o[0] === 'balkon'); t.balkon = b ? alan(b[2]) : 0;
});
const daireNo = (kat, tip) => (kat - 1) * 4 + TIP_SIRA.indexOf(tip) + 1;
const daireBul = no => ({ kat: Math.ceil(no / 4), tip: TIP_SIRA[(no - 1) % 4] });
const fiyat = (blok, kat, tip) => TEMEL_FIYAT[tip] + (kat - 1) * 125000 + (blok === 'B' ? 150000 : 0);
// örnek satış durumu: alt katlarda satılan daha çok
const DURUM = {};
BLOKLAR.forEach(b => { DURUM[b] = {}; for (let k = 1; k <= KAT_SAYISI; k++) { DURUM[b][k] = {}; TIP_SIRA.forEach((t, i) => {
  let h = 0; for (const c of b + k + t + 'fp') h = (h * 31 + c.charCodeAt(0)) % 9973;
  const oran = k <= 3 ? 46 : k <= 7 ? 30 : 16, v = h % 100;
  DURUM[b][k][t] = v < oran ? 'satildi' : v < oran + 9 ? 'rezerve' : 'satilik';
  if (k === KAT_SAYISI && i === 1) DURUM[b][k][t] = 'satilik';
}); } });
const satistaSay = (b, k) => TIP_SIRA.filter(t => DURUM[b][k][t] === 'satilik').length;

/* ================= kat bantları (perspektif) ================= */
function kesisim(cizgiler) {
  let A11 = 0, A12 = 0, A22 = 0, B1 = 0, B2 = 0;
  cizgiler.forEach(([[x1, y1], [x2, y2]]) => {
    let a = y2 - y1, b = x1 - x2; const n = Math.hypot(a, b); a /= n; b /= n; const c = a * x1 + b * y1;
    A11 += a * a; A12 += a * b; A22 += b * b; B1 += a * c; B2 += b * c;
  });
  const det = A11 * A22 - A12 * A12;
  return Math.abs(det) < 1e-9 ? null : [(B1 * A22 - B2 * A12) / det, (A11 * B2 - A12 * B1) / det];
}
function kenarNokta([x0, y0], [x1, y1], v, kn) {
  const dx = x1 - x0, dy = y1 - y0;
  if (!kn) return [x0 + dx * v, y0 + dy * v];
  const sV = ((kn[0] - x0) * dx + (kn[1] - y0) * dy) / (dx * dx + dy * dy), g = 1 / (sV - 1);
  const s = sV * g * v / (g * v + 1);
  return [x0 + dx * s, y0 + dy * s];
}
// blok etiketleri: çatının ortası (görsel pikseli)
const PIN = { on: { A: [540, 72], B: [1062, 196] }, arka: { B: [492, 292], A: [1046, 106] } };
const KATLAR = {}, KULE = {};
Object.keys(KENAR).forEach(g => {
  KATLAR[g] = {}; KULE[g] = {};
  Object.keys(KENAR[g]).forEach(b => {
    const ken = KENAR[g][b], kn = kesisim(ken);
    const sira = v => ken.map(([u, a]) => kenarNokta(u, a, v, kn));
    KATLAR[g][b] = {};
    for (let k = 1; k <= KAT_SAYISI; k++) KATLAR[g][b][k] = sira((KAT_SAYISI - k) / KAT_SAYISI).concat(sira((KAT_SAYISI - k + 1) / KAT_SAYISI).reverse());
    KULE[g][b] = sira(0).concat(sira(1).reverse());
  });
});

/* ================= durum ================= */
const D = { gorunum: 'acilis', cephe: 'on', zaman: 'aksam', blok: 'A', kat: null, tip: null, oda: null, panel: null };
function gorunumAyarla(g) {
  D.gorunum = g; body.dataset.gorunum = g;
  body.classList.toggle('kagitta', g === 'kat' || g === 'daire');
  yolCiz();
  document.querySelectorAll('.menu [data-git="bina"]').forEach(b => b.classList.toggle('secili', !D.panel));
}
function yolCiz() {
  const y = $('yol'); y.innerHTML = '';
  const ekle = (yazi, git) => { if (y.children.length) { const i = document.createElement('i'); i.textContent = '/'; y.appendChild(i); } const el = document.createElement(git ? 'button' : 'span'); el.textContent = yazi; if (git) { el.type = 'button'; el.addEventListener('click', () => gitAdim(git)); } y.appendChild(el); };
  if (D.gorunum === 'kat' || D.gorunum === 'daire' || D.gorunum === 'oda') {
    ekle('Bina', 'bina');
    ekle(`${D.blok} Blok, ${D.kat}. kat`, D.gorunum === 'kat' ? null : 'kat');
    if (D.gorunum !== 'kat') ekle('Daire ' + daireNo(D.kat, D.tip), D.gorunum === 'oda' ? 'daire' : null);
  }
}
function gitAdim(h) { panelKapat(); menuKapat(); if (h === 'bina') binayaDon(); else if (h === 'kat') kataDon(); else if (h === 'daire') daireyeDon(); }

/* ================= BİNA: yerleşim ================= */
const gBina = $('g-bina'), sahne = $('sahne'), kutu = $('kutu'), ksvg = $('katlar-svg');
const resimler = [...kutu.querySelectorAll('.cephe')];
function yerlesim() {
  const W = innerWidth, H = innerHeight;
  let w, h, x, y;
  if (telefon()) {
    w = W * 1.5; h = w / OREN; x = sinirla(W / 2 - .53 * w, W - w, 0); y = 0;
    body.style.setProperty('--sahne-h', Math.round(h) + 'px');
  } else {
    // görselin üstünde menüye pay kalsın: yükseklik ekranın %95'i, alta yaslı, üst kenar yumuşak
    h = H * .95; w = h * OREN;
    if (w < W) { w = W; h = W / OREN; }
    x = sinirla((W - 260) / 2 - .53 * w, W - w, 0);
    y = h <= H ? H - h : sinirla((H - h) * .3, H - h, 0);
  }
  kutu.style.setProperty('--kx', x + 'px'); kutu.style.setProperty('--ky', y + 'px');
  kutu.style.setProperty('--kw', w + 'px'); kutu.style.setProperty('--kh', h + 'px');
}
function resimKaynak(im) { return `img/${im.dataset.v}-${im.dataset.z}${telefon() ? '-m' : ''}.webp`; }
function cepheGoster() { resimler.forEach(im => im.classList.toggle('gor', im.dataset.v === D.cephe && im.dataset.z === D.zaman)); }

/* ================= BİNA: kat katmanı ================= */
function katKatmani(ciz) {
  const g = D.cephe, telefonda = telefon();
  let h = `<defs><mask id="m-delik" maskUnits="userSpaceOnUse" x="0" y="0" width="${GW}" height="${GH}"><rect width="${GW}" height="${GH}" fill="#fff"/><path id="delik" d="" fill="#000"/></mask></defs>`;
  BLOKLAR.forEach(b => { h += `<path class="karart" d="${yol(KULE[g][b])}" mask="url(#m-delik)"/>`; });
  BLOKLAR.forEach(b => {
    for (let k = 1; k <= KAT_SAYISI; k++) {
      const d = yol(KATLAR[g][b][k]);
      h += `<g class="kat" data-blok="${b}" data-kat="${k}" style="--s:${k}"><path class="alan" d="${d}"/><path class="kenar" pathLength="1" d="${d}"/></g>`;
    }
  });
  BLOKLAR.forEach(b => {
    const [px, py] = PIN[g][b], gen = telefonda ? 160 : 214, yuk = telefonda ? 66 : 62, x0 = px - gen / 2, y0 = py - yuk / 2;
    const satista = [...Array(KAT_SAYISI)].reduce((s, _, i) => s + satistaSay(b, i + 1), 0);
    h += `<g class="pin"><circle class="halka" cx="${x0 - 14}" cy="${py}" r="5"/><circle cx="${x0 - 14}" cy="${py}" r="5"/>` +
      `<rect class="pin-zemin" x="${x0}" y="${y0}" width="${gen}" height="${yuk}"/><rect class="pin-cizgi" x="${x0}" y="${y0}" width="3" height="${yuk}"/>` +
      `<text x="${x0 + 18}" y="${telefonda ? py + 15 : y0 + 31}">${b} Blok</text>` +
      (telefonda ? '' : `<text class="pin-alt" x="${x0 + 18}" y="${y0 + 50}">${KAT_SAYISI} kat, ${satista} daire satışta</text>`) + `</g>`;
  });
  ksvg.innerHTML = h;
  if (ciz && !hareketAz) { ksvg.classList.remove('ciz'); void ksvg.getBoundingClientRect(); ksvg.classList.add('ciz'); setTimeout(() => ksvg.classList.remove('ciz'), 1400); }
  if (vurgu) katVurgu(vurgu.blok, vurgu.kat);
}

/* ================= BİNA: kat listesi ================= */
const katListesi = $('kat-listesi');
function katListesiCiz() {
  katListesi.innerHTML = '';
  for (let k = KAT_SAYISI; k >= 1; k--) {
    const s = satistaSay(D.blok, k);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'kat-satir'; b.dataset.kat = k;
    b.setAttribute('aria-label', `${D.blok} Blok ${k}. kat, ${s ? s + ' daire satışta' : 'satışta daire yok'}`);
    b.innerHTML = `<span class="no">${k}</span><span class="hucreler" aria-hidden="true">${TIP_SIRA.map(t => `<i class="h-${DURUM[D.blok][k][t]}"></i>`).join('')}</span><span class="durum">${s ? s + ' satışta' : 'Satıldı'}</span>`;
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') katVurgu(D.blok, k); });
    b.addEventListener('pointerleave', () => katVurgu(null));
    b.addEventListener('focus', () => katVurgu(D.blok, k));
    b.addEventListener('blur', () => katVurgu(null));
    b.addEventListener('click', () => katAc(D.blok, k));
    katListesi.appendChild(b);
  }
}
function blokSec(b) {
  D.blok = b;
  document.querySelectorAll('.blok-sec button').forEach(x => x.setAttribute('aria-selected', String(x.dataset.blok === b)));
  katListesiCiz();
}
document.querySelectorAll('.blok-sec button').forEach(x => x.addEventListener('click', () => blokSec(x.dataset.blok)));

let vurgu = null;
const cip = $('kat-cip');
function katVurgu(b, k) {
  vurgu = b ? { blok: b, kat: k } : null;
  ksvg.querySelectorAll('.kat').forEach(g => g.classList.toggle('on', !!vurgu && g.dataset.blok === b && +g.dataset.kat === k));
  katListesi.querySelectorAll('.kat-satir').forEach(x => x.classList.toggle('on', !!vurgu && D.blok === b && +x.dataset.kat === k));
  ksvg.classList.toggle('vurgulu', !!vurgu);
  kutu.classList.toggle('isaret', !!vurgu);
  const delik = ksvg.querySelector('#delik');
  if (delik) delik.setAttribute('d', vurgu ? yol(KATLAR[D.cephe][b][k]) : '');
  if (!vurgu || telefon()) { cip.classList.remove('on'); return; }
  const p = KATLAR[D.cephe][b][k], ust = p.slice(0, p.length / 2), sag = ust.reduce((a, q) => q[0] > a[0] ? q : a);
  const r = kutu.getBoundingClientRect(), sx = r.left + sag[0] / GW * r.width, sy = r.top + sag[1] / GH * r.height;
  const satista = TIP_SIRA.filter(t => DURUM[b][k][t] === 'satilik'), enAz = Math.min(...satista.map(t => fiyat(b, k, t)));
  cip.innerHTML = `<strong>${k}<small>. kat</small></strong><span>${b} Blok</span><em>${satista.length ? `${satista.length} daire satışta, ${tl(enAz)}'den` : 'Satışta daire yok'}</em>`;
  const panelSol = innerWidth - 260, cg = cip.offsetWidth || 210;
  let cx = sx + 18, cy = sy - 18;
  if (cx + cg > panelSol) {
    const sol = ust.reduce((a, q) => q[0] < a[0] ? q : a);
    cx = r.left + sol[0] / GW * r.width - 18 - cg; cy = r.top + sol[1] / GH * r.height - 18;
  }
  cx = sinirla(cx, 12, innerWidth - cg - 12); cy = sinirla(cy, 90, innerHeight - 80);
  cip.style.setProperty('--cx', cx + 'px'); cip.style.setProperty('--cy', cy + 'px');
  cip.classList.add('on');
}

/* ================= BİNA: sürükleme, dokunma, cephe ve saat ================= */
function gorselNokta(cx, cy) { const r = kutu.getBoundingClientRect(); return [(cx - r.left) / r.width * GW, (cy - r.top) / r.height * GH]; }
function noktadakiKat(cx, cy) {
  if (gecis) return null;
  const [x, y] = gorselNokta(cx, cy);
  for (const b of BLOKLAR) for (let k = 1; k <= KAT_SAYISI; k++) if (icindeMi(x, y, KATLAR[D.cephe][b][k])) return { blok: b, kat: k };
  return null;
}
let surukle = null, gecis = false;
kutu.addEventListener('pointerdown', e => { if (D.gorunum !== 'bina') return; surukle = { x: e.clientX, y: e.clientY, hareket: false }; });
addEventListener('pointermove', e => {
  if (!surukle) {
    if (D.gorunum === 'bina' && e.pointerType === 'mouse' && e.target.closest && e.target.closest('#kutu')) {
      const n = noktadakiKat(e.clientX, e.clientY);
      if (!n && vurgu) katVurgu(null);
      else if (n && (!vurgu || n.blok !== vurgu.blok || n.kat !== vurgu.kat)) katVurgu(n.blok, n.kat);
    }
    return;
  }
  const dx = e.clientX - surukle.x;
  if (!surukle.hareket) {
    if (Math.abs(dx) < 10) return;
    if (Math.abs(e.clientY - surukle.y) > Math.abs(dx)) { surukle = null; return; }
    surukle.hareket = true; kutu.classList.add('surukle'); katVurgu(null);
    try { kutu.setPointerCapture(e.pointerId); } catch (_) { /* dokunmatik: yakalama yok */ }
  }
  if (Math.abs(dx) > 70 && !gecis && surukle.hareket !== 'bitti') { const yon = dx < 0 ? 1 : -1; surukle.hareket = 'bitti'; cepheGit(D.cephe === 'on' ? 'arka' : 'on', yon); }
});
function birak(e) {
  if (!surukle) return;
  const s = surukle; surukle = null; kutu.classList.remove('surukle');
  if (!s.hareket && e.type === 'pointerup') { const n = noktadakiKat(e.clientX, e.clientY); if (n) katAc(n.blok, n.kat); }
}
addEventListener('pointerup', birak); addEventListener('pointercancel', birak);
kutu.addEventListener('pointerleave', () => { if (!surukle) katVurgu(null); });

async function cepheGit(yeni, yon = 1) {
  if (gecis || yeni === D.cephe) return;
  gecis = true; katVurgu(null);
  const eski = resimler.find(im => im.dataset.v === D.cephe && im.dataset.z === D.zaman);
  const gel = resimler.find(im => im.dataset.v === yeni && im.dataset.z === D.zaman);
  await yukle(gel.src || resimKaynak(gel));
  if (!gel.src) gel.src = resimKaynak(gel);
  D.cephe = yeni;
  document.querySelectorAll('[data-cephe]').forEach(b => b.classList.toggle('secili', b.dataset.cephe === yeni));
  ksvg.style.opacity = 0;
  if (!hareketAz) {
    gel.style.transition = 'none'; gel.style.transform = `translateX(${yon * 7}%) scale(1.12)`; gel.style.filter = 'blur(6px)';
    void gel.offsetWidth;
    [eski, gel].forEach(im => { im.style.transition = 'opacity .95s ease, transform 1.15s cubic-bezier(.65,0,.25,1), filter 1s ease'; });
    eski.style.transform = `translateX(${-yon * 7}%) scale(1.12)`; eski.style.filter = 'blur(6px)';
    gel.style.transform = ''; gel.style.filter = '';
  }
  cepheGoster();
  await bekle(1150);
  [eski, gel].forEach(im => { im.style.transition = ''; im.style.transform = ''; im.style.filter = ''; });
  katKatmani(true); ksvg.style.opacity = 1;
  gecis = false;
}
async function zamanGit(z) {
  if (z === D.zaman) return;
  const gel = resimler.find(im => im.dataset.v === D.cephe && im.dataset.z === z);
  if (!gel.src) gel.src = resimKaynak(gel);
  await yukle(gel.src);
  D.zaman = z;
  document.querySelectorAll('[data-zaman]').forEach(b => b.classList.toggle('secili', b.dataset.zaman === z));
  cepheGoster();
}
document.querySelectorAll('[data-cephe]').forEach(b => b.addEventListener('click', () => cepheGit(b.dataset.cephe, b.dataset.cephe === 'arka' ? 1 : -1)));
document.querySelectorAll('[data-zaman]').forEach(b => b.addEventListener('click', () => zamanGit(b.dataset.zaman)));

/* ================= KAT ================= */
const katPlan = $('kat-plan');
const DESEN = `<defs><filter id="f-satildi" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix type="saturate" values="0"/><feGaussianBlur stdDeviation=".8"/></filter></defs>`;
const gorselEtiketi = (G, ek = '') => `<image class="render" href="${G.src}" x="${G.vb[0]}" y="${G.vb[1]}" width="${G.vb[2]}" height="${G.vb[3]}" preserveAspectRatio="none"${ek}/>`;
function katPlaniCiz(inis) {
  const kat = D.kat, blok = D.blok, G = PLAN_GORSEL.kat;
  let h = `<svg class="plan${!hareketAz ? ' ciz' : ''}${inis && !hareketAz ? ' iniyor' : ''}" viewBox="-14 -30 276 246" role="img" aria-label="${blok} Blok ${kat}. kat planı">${DESEN}`;
  h += gorselEtiketi(G);
  TIP_SIRA.forEach((t, i) => {
    const T = TIPLER[t], d = DURUM[blok][kat][t], no = daireNo(kat, t);
    const [kx0, ky0, kx1, ky1] = T.kutu, dp = T.dis, [lx, ly] = merkez(dp);
    const balkon = T.odalar.filter(o => o[0] === 'balkon').map(o => yol(o[2])).join('');
    h += `<g class="daire ${d}" data-tip="${t}" style="--s:${i}">`;
    if (d === 'satildi') {
      h += `<clipPath id="kp-${t}"><path d="${yol(dp)}${balkon}"/></clipPath>`;
      h += gorselEtiketi(G, ` clip-path="url(#kp-${t})" filter="url(#f-satildi)"`);
      h += `<path class="ort" d="${yol(dp)}${balkon}"/>`;
    }
    h += `<path class="zemin" d="${yol(dp)}${balkon}"/><path class="vurgu" d="${yol(dp)}"/>`;
    h += `<rect class="kutu-ref" x="${kx0}" y="${ky0}" width="${kx1 - kx0}" height="${ky1 - ky0}" fill="none" pointer-events="none"/>`;
    const ey = d === 'satildi' ? ly - 13 : ly;
    h += `<g class="etiket"><rect x="${lx - 22}" y="${ey - 8}" width="44" height="16" rx="1.6"/><text class="e1" x="${lx}" y="${ey - 1.2}" text-anchor="middle">Daire ${no}</text><text class="e2" x="${lx}" y="${ey + 4.8}" text-anchor="middle">${T.oda}, ${Math.round(T.net)} m², ${DURUM_AD[d].toLocaleLowerCase('tr-TR')}</text></g>`;
    if (d === 'satildi') h += `<g transform="translate(${lx} ${ly + 9}) rotate(-8)"><g class="damga"><rect x="-25" y="-7.5" width="50" height="15" rx="1.2"/><text y="3" text-anchor="middle">SATILDI</text></g></g>`;
    h += `</g>`;
  });
  h += `<g class="kuzey" transform="translate(252 -16)"><path d="M0 -8 5 6 0 3 -5 6Z"/><text class="yazi" y="13" text-anchor="middle" style="font-size:4.4px;font-weight:600">K</text></g>`;
  h += `<g class="olcek" transform="translate(0 204)"><rect x="0" y="0" width="25" height="1.6"/><rect x="25" y="0" width="25" height="1.6" fill="#fff" stroke="#0d2234" stroke-width=".4"/><text class="yazi" x="0" y="7" style="font-size:3.6px">0</text><text class="yazi" x="25" y="7" text-anchor="middle" style="font-size:3.6px">2,5</text><text class="yazi" x="50" y="7" text-anchor="middle" style="font-size:3.6px">5 m</text></g>`;
  h += `<text class="yazi" x="120" y="207" text-anchor="middle" style="font-size:4.4px">Örnek kat planı. Projenin planları kurulumda yüklenir.</text></svg>`;
  katPlan.innerHTML = h;
  const svg = katPlan.querySelector('svg');
  if (inis && !hareketAz) requestAnimationFrame(() => requestAnimationFrame(() => { svg.classList.remove('iniyor'); svg.classList.add('indi'); }));
  katPlan.querySelectorAll('.daire').forEach(g => {
    const t = g.dataset.tip;
    g.addEventListener('pointerenter', () => daireVurgu(t));
    g.addEventListener('pointerleave', () => daireVurgu(null));
    g.addEventListener('click', () => daireAc(D.kat, t, g.querySelector('.kutu-ref')));
  });
  const s = satistaSay(blok, kat);
  $('kat-blok').textContent = `${blok} Blok`;
  $('kat-no').textContent = kat;
  $('kat-ozet').textContent = s ? `Bu katta 4 daireden ${s} tanesi satışta. Daireye dokunup planını, odalarını ve ödeme planını görün.` : 'Bu kattaki dairelerin hepsi satıldı ya da rezerve. Yandaki kulelerden başka bir kat seçebilirsiniz.';
  const ul = $('daire-listesi'); ul.innerHTML = '';
  TIP_SIRA.forEach(t => {
    const T = TIPLER[t], d = DURUM[blok][kat][t], no = daireNo(kat, t);
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
  miniKuleCiz();
}
function miniKuleCiz() {
  const m = $('mini-kule'); m.innerHTML = '';
  BLOKLAR.forEach(b => {
    const d = document.createElement('div'); d.className = 'mk-blok';
    d.innerHTML = `<p>${b} Blok</p>`;
    for (let k = KAT_SAYISI; k >= 1; k--) {
      const x = document.createElement('button'); x.type = 'button'; x.className = 'mk-kat' + (b === D.blok && k === D.kat ? ' secili' : '');
      x.setAttribute('aria-label', `${b} Blok ${k}. kat`);
      x.innerHTML = `<span>${k}</span><b></b>`;
      x.addEventListener('click', () => katDegistir(b, k));
      d.appendChild(x);
    }
    m.appendChild(d);
  });
}
function daireVurgu(t) {
  katPlan.querySelectorAll('.daire').forEach(g => g.classList.toggle('on', g.dataset.tip === t));
  document.querySelectorAll('#daire-listesi .daire-satir').forEach(b => b.classList.toggle('on', b.dataset.tip === t));
}
async function katAc(b, k) {
  if (D.gorunum !== 'bina' || gecis) return;
  D.blok = b; D.kat = k; katVurgu(b, k);
  const [mx, my] = merkez(KATLAR[D.cephe][b][k]), kr = kutu.getBoundingClientRect(), sr = sahne.getBoundingClientRect();
  sahne.style.transformOrigin = `${kr.left - sr.left + mx / GW * kr.width}px ${kr.top - sr.top + my / GH * kr.height}px`;
  sahne.classList.add('kataGit'); cip.classList.remove('on');
  TIP_SIRA.forEach(t => yukle(PLAN_GORSEL[t].src));
  await Promise.all([bekle(420), yukle(PLAN_GORSEL.kat.src)]);
  gorunumAyarla('kat');
  $('g-kat').classList.add('acik'); $('g-kat').scrollTop = 0;
  katPlaniCiz(true);
  katVurgu(null); blokSec(b);
}
function binayaDon() {
  if (D.gorunum === 'bina') return;
  if (D.gorunum === 'oda') odaKapat(true);
  $('g-daire').classList.remove('acik', 'yerlesti');
  $('g-kat').classList.remove('acik');
  sahne.classList.remove('kataGit');
  gorunumAyarla('bina');
  setTimeout(() => katKatmani(true), hareketAz ? 0 : 500);
}
function katDegistir(b, k) {
  if (k < 1 || k > KAT_SAYISI) return;
  D.blok = b; D.kat = k; blokSec(b);
  const svg = katPlan.querySelector('svg');
  const ciz = () => { katPlaniCiz(true); yolCiz(); };
  if (svg && !hareketAz) { svg.style.transition = 'opacity .25s ease, transform .3s ease'; svg.style.opacity = 0; svg.style.transform = 'translateY(-12px)'; setTimeout(ciz, 250); } else ciz();
}

/* ================= DAİRE ================= */
const dPlan = $('daire-plan');
const T_DURUM = { pesin: 40, vade: 24 };
function dairePlaniCiz() {
  const T = TIPLER[D.tip], [x0, y0, x1, y1] = T.kutu, pad = 16, G = PLAN_GORSEL[D.tip];
  const vx0 = Math.min(G.vb[0], x0 - pad), vy0 = Math.min(G.vb[1], y0 - pad);
  const vx1 = Math.max(G.vb[0] + G.vb[2], x1 + pad), vy1 = Math.max(G.vb[1] + G.vb[3], y1 + pad);
  let h = `<svg class="plan" viewBox="${vx0} ${vy0} ${vx1 - vx0} ${vy1 - vy0}" role="img" aria-label="Daire ${daireNo(D.kat, D.tip)} planı">`;
  h += gorselEtiketi(G);
  h += `<rect class="kutu-ref" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" pointer-events="none"/>`;
  T.odalar.forEach(o => { h += `<g class="oda" data-oda="${o[0]}"><path class="zemin" d="${yol(o[2])}"/><path class="vurgu" d="${yol(o[2])}"/></g>`; });
  h += `<g class="yazilar" pointer-events="none">`;
  T.odalar.forEach(o => {
    const [cx, cy] = merkez(o[2]);
    const ad = o[1].length > 13 && (o[2][1][0] - o[2][0][0]) < 45 ? o[1].replace(' yatak odası', '') : o[1];
    const m = `${m2(alan(o[2]))} m²`, gen = Math.max(ad.length * 1.9, m.length * 1.62) + 4;
    h += `<rect class="oda-zemin" x="${cx - gen / 2}" y="${cy - 4.6}" width="${gen}" height="9.2" rx="1.2"/>`;
    h += `<text class="yazi oda-ad" x="${cx}" y="${cy - .6}" text-anchor="middle">${ad}</text><text class="yazi oda-m2" x="${cx}" y="${cy + 3.2}" text-anchor="middle">${m}</text>`;
    if (o[3]) h += `<g class="foto" transform="translate(${cx} ${cy - 7.9})"><circle r="2.6"/><path d="M-1.6 -.6h.8l.5-.7h.6l.5.7h.8v2h-3.2z"/><circle class="mercek" cy=".45" r=".55"/></g>`;
  });
  h += `</g>`;
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
function odaSec(k, x, y) { const o = TIPLER[D.tip].odalar.find(q => q[0] === k); if (o && o[3]) odaAc(k, x, y); else odaVurgu(k); }
function taksitHesap(f, pesin, vade) { const p = f * pesin / 100; return { pesinat: p, aylik: (f - p) / vade }; }
function sayiAnim(el, hedef, bicim, sure = 600) {
  const bas = +(el.dataset.deger || 0); el.dataset.deger = hedef;
  if (hareketAz || !bas) { el.textContent = bicim(hedef); return; }
  const t0 = performance.now();
  const adim = now => { const k = Math.min(1, (now - t0) / sure), e = 1 - Math.pow(1 - k, 3); el.textContent = bicim(bas + (hedef - bas) * e); if (k < 1 && +el.dataset.deger === hedef) requestAnimationFrame(adim); };
  requestAnimationFrame(adim);
}
function taksitCiz() {
  const f = fiyat(D.blok, D.kat, D.tip), r = taksitHesap(f, T_DURUM.pesin, T_DURUM.vade);
  $('t-pesin-yazi').textContent = '%' + T_DURUM.pesin;
  sayiAnim($('t-aylik'), r.aylik, v => tl(v) + ' / ay');
  $('t-alt').textContent = `${tl(r.pesinat)} peşinat, ${T_DURUM.vade} ay faizsiz taksit`;
}
$('t-pesin').addEventListener('input', e => { T_DURUM.pesin = +e.target.value; taksitCiz(); });
document.querySelectorAll('[data-vade]').forEach(b => b.addEventListener('click', () => { T_DURUM.vade = +b.dataset.vade; document.querySelectorAll('[data-vade]').forEach(x => x.classList.toggle('secili', x === b)); taksitCiz(); }));
function daireYanCiz() {
  const T = TIPLER[D.tip], d = DURUM[D.blok][D.kat][D.tip], no = daireNo(D.kat, D.tip);
  $('daire-ust').textContent = `${D.blok} Blok, ${D.kat}. kat`;
  $('daire-ad').textContent = 'Daire ' + no;
  $('daire-tip').textContent = `${T.oda}, ${Math.round(T.net)} m² net, ${T.brut} m² brüt`;
  $('daire-bilgi').innerHTML = `<dt>Cephe</dt><dd>${T.cephe}</dd><dt>Balkon</dt><dd>${T.balkon ? m2(T.balkon) + ' m²' : 'Yok'}</dd><dt>Teslim</dt><dd>Aralık 2028</dd><dt>Durum</dt><dd class="durum-${d}">${DURUM_AD[d]}</dd>`;
  const f = $('daire-fiyat');
  if (d === 'satildi') {
    const benzer = [];
    for (let k = 1; k <= KAT_SAYISI; k++) if (DURUM[D.blok][k][D.tip] === 'satilik') benzer.push(daireNo(k, D.tip));
    f.innerHTML = `<p class="satildi-not">Bu daire satıldı.</p>` + (benzer.length ? `<p class="benzer">${D.blok} Blokta aynı tipte satışta olanlar: ${benzer.slice(0, 5).map(n => `<button type="button" data-no="${n}">Daire ${n}</button>`).join(', ')}</p>` : '');
    f.querySelectorAll('[data-no]').forEach(b => b.addEventListener('click', () => { const q = daireBul(+b.dataset.no); daireGec(q.kat, q.tip); }));
  } else {
    f.innerHTML = `<strong>${tl(fiyat(D.blok, D.kat, D.tip))}</strong><small>${d === 'rezerve' ? 'Rezerve. Satış iptal olursa sizi arayalım.' : 'Örnek fiyat. Fiyatlar yönetim panelinden girilir.'}</small>`;
  }
  $('taksit').hidden = d === 'satildi';
  $('t-aylik').dataset.deger = 0;
  if (d !== 'satildi') taksitCiz();
  const ul = $('oda-listesi'); ul.innerHTML = '';
  T.odalar.forEach(o => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="oda-satir" data-oda="${o[0]}"><span class="ad">${o[1]}</span>${o[3] ? '<svg viewBox="0 0 16 16" aria-label="Fotoğrafı var"><path d="M2 5h3l1.2-1.6h3.6L11 5h3v8H2z"/><circle cx="8" cy="9" r="2.3"/></svg>' : ''}<span class="m2">${m2(alan(o[2]))} m²</span></button>`;
    const b = li.firstElementChild;
    b.addEventListener('pointerenter', () => odaVurgu(o[0]));
    b.addEventListener('pointerleave', () => odaVurgu(null));
    b.addEventListener('click', () => { const g = dPlan.querySelector(`.oda[data-oda="${o[0]}"] .zemin`), r = g ? g.getBoundingClientRect() : b.getBoundingClientRect(); odaSec(o[0], r.left + r.width / 2, r.top + r.height / 2); });
    ul.appendChild(li);
  });
  const mesaj = `Merhaba, ${PROJE.ad} ${D.blok} Blok Daire ${no} (${D.kat}. kat, ${T.oda}) hakkında bilgi almak istiyorum.`;
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
  if (kr && !hareketAz && kr.width) {
    const e0 = svg.getBoundingClientRect(), hr = svg.querySelector('.kutu-ref').getBoundingClientRect(), s = kr.width / hr.width;
    const tx = kr.left - e0.left - s * (hr.left - e0.left), ty = kr.top - e0.top - s * (hr.top - e0.top);
    svg.classList.remove('ucus'); svg.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    void svg.getBoundingClientRect();
    svg.classList.add('ucus'); svg.style.transform = '';
    await bekle(820);
  }
  gd.classList.add('yerlesti');
  Object.values(FOTO).forEach(yukle);
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
  if (D.gorunum === 'kat') return;
  if (D.gorunum === 'oda') odaKapat(true);
  katPlaniCiz(false);
  $('g-daire').classList.remove('acik', 'yerlesti');
  $('g-kat').classList.add('acik');
  gorunumAyarla('kat');
  daireVurgu(D.tip); setTimeout(() => daireVurgu(null), 1200);
}

/* ================= ODA ================= */
const gOda = $('g-oda'), odaResim = $('oda-resim');
function odaYazi(o) { $('oda-ad').textContent = o[1]; $('oda-alt').textContent = `${m2(alan(o[2]))} m², ${D.blok} Blok Daire ${daireNo(D.kat, D.tip)}, ${D.kat}. kat`; }
function odaAc(k, x, y) {
  const T = TIPLER[D.tip], o = T.odalar.find(q => q[0] === k);
  D.oda = k;
  odaResim.style.backgroundImage = `url(${FOTO[o[3]]})`;
  gOda.style.setProperty('--cx', x + 'px'); gOda.style.setProperty('--cy', y + 'px');
  odaYazi(o);
  const c = $('oda-cipler'); c.innerHTML = '';
  T.odalar.filter(q => q[3]).forEach(q => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = q[1]; b.classList.toggle('secili', q[0] === k);
    b.addEventListener('click', () => odaDegistir(q[0]));
    c.appendChild(b);
  });
  yukle(FOTO[o[3]]).then(() => { void gOda.offsetWidth; gOda.classList.add('acik'); gorunumAyarla('oda'); });
}
function odaDegistir(k) {
  const o = TIPLER[D.tip].odalar.find(q => q[0] === k); D.oda = k;
  if (odaResim.animate && !hareketAz) odaResim.animate([{ opacity: 1 }, { opacity: .15 }, { opacity: 1 }], { duration: 520 });
  setTimeout(() => { odaResim.style.backgroundImage = `url(${FOTO[o[3]]})`; }, hareketAz ? 0 : 230);
  odaYazi(o);
  $('oda-cipler').querySelectorAll('button').forEach(b => b.classList.toggle('secili', b.textContent === o[1]));
}
function odaKapat(hemen) { gOda.classList.remove('acik'); if (!hemen) gorunumAyarla('daire'); }
function daireyeDon() { if (D.gorunum === 'oda') odaKapat(false); }

/* ================= PANELLER ================= */
const menu = document.querySelector('.menu');
function menuKapat() { menu.classList.remove('acik'); $('menu-ac').setAttribute('aria-expanded', 'false'); }
$('menu-ac').addEventListener('click', () => { const a = !menu.classList.contains('acik'); menu.classList.toggle('acik', a); $('menu-ac').setAttribute('aria-expanded', String(a)); });
let panelOnceki = null;
function panelAc(id) {
  menuKapat();
  if (D.panel === id) return;
  if (D.panel) panelKapat(true);
  const p = $(id); D.panel = id; panelOnceki = document.activeElement;
  p.hidden = false; p.scrollTop = 0;
  document.querySelectorAll('.menu button').forEach(b => b.classList.toggle('secili', b.dataset.panel === id));
  if (id === 'p-konum') konumHazirla();
  if (id === 'p-galeri') galeriHazirla();
  if (id === 'p-odeme') odemeHazirla();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    p.classList.add('acik'); p.querySelector('.kapat').focus({ preventScroll: true });
    if (id === 'p-ortak') sayaclar();
    if (id === 'p-odeme') takvimIlerle();
  }));
}
function panelKapat(hemen) {
  if (!D.panel) return;
  const p = $(D.panel); D.panel = null;
  p.classList.remove('acik');
  const bitir = () => { if (!p.classList.contains('acik')) p.hidden = true; };
  if (hemen || hareketAz) bitir(); else setTimeout(bitir, 800);
  document.querySelectorAll('.menu button').forEach(b => b.classList.toggle('secili', b.dataset.git === 'bina'));
  if (panelOnceki && panelOnceki.focus && !hemen) panelOnceki.focus({ preventScroll: true });
}
document.querySelectorAll('[data-panel]').forEach(b => b.addEventListener('click', () => panelAc(b.dataset.panel)));
document.querySelectorAll('.panel [data-kapat]').forEach(b => b.addEventListener('click', () => panelKapat()));

let konumHazir = false;
function konumHazirla() {
  if (konumHazir) return; konumHazir = true;
  $('mesafe').innerHTML = MESAFE.map(([a, s]) => `<li><strong>${a}</strong><span>${s}</span></li>`).join('');
  const f = document.createElement('iframe');
  f.title = 'Mahmutbey, İstanbul haritası'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
  f.src = 'https://maps.google.com/maps?q=Mahmutbey%2C%20Ba%C4%9Fc%C4%B1lar%2C%20%C4%B0stanbul&z=14&output=embed';
  $('harita').appendChild(f);
}

let galeriHazir = false, galeriNo = 0;
const gSahne = $('galeri-sahne'), gSerit = $('galeri-seridi');
function galeriHazirla() {
  if (galeriHazir) { galeriGoster(galeriNo); return; }
  galeriHazir = true;
  $('galeri-top').textContent = GALERI.length;
  GALERI.forEach(([ad, dik], i) => {
    const r = document.createElement('div'); r.className = 'g-resim' + (dik ? ' dik' : ''); r.setAttribute('role', 'img'); r.setAttribute('aria-label', `Focus Prestij görseli ${i + 1}`); gSahne.appendChild(r);
    const t = document.createElement('button'); t.type = 'button'; t.style.backgroundImage = `url(img/galeri/${ad}-k.webp)`; t.setAttribute('aria-label', `Görsel ${i + 1}`);
    t.addEventListener('click', () => galeriGoster(i)); gSerit.appendChild(t);
  });
  galeriGoster(0);
}
function galeriGoster(i) {
  galeriNo = (i + GALERI.length) % GALERI.length;
  const kat = gSahne.children, src = `img/galeri/${GALERI[galeriNo][0]}.webp`;
  const el = kat[galeriNo];
  yukle(src).then(() => {
    if (!el.style.backgroundImage) el.style.backgroundImage = `url(${src})`;
    [...kat].forEach((r, j) => r.classList.toggle('gor', j === galeriNo));
  });
  $('galeri-no').textContent = galeriNo + 1;
  [...gSerit.children].forEach((t, j) => t.classList.toggle('secili', j === galeriNo));
  const t = gSerit.children[galeriNo]; if (t) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: hareketAz ? 'auto' : 'smooth' });
  yukle(`img/galeri/${GALERI[(galeriNo + 1) % GALERI.length][0]}.webp`);
}
$('galeri-geri').addEventListener('click', () => galeriGoster(galeriNo - 1));
$('galeri-ileri').addEventListener('click', () => galeriGoster(galeriNo + 1));
let gKay = null;
gSahne.addEventListener('pointerdown', e => { gKay = e.clientX; });
gSahne.addEventListener('pointerup', e => { if (gKay === null) return; const dx = e.clientX - gKay; gKay = null; if (Math.abs(dx) > 50) galeriGoster(galeriNo + (dx < 0 ? 1 : -1)); });
gSahne.addEventListener('pointercancel', () => { gKay = null; });

const H_DURUM = { fiyat: 0, pesin: 40, vade: 24 };
let odemeHazir = false;
function odemeHazirla() {
  if (!odemeHazir) {
    odemeHazir = true;
    const s = $('h-fiyat'), secenek = [['A', 6], ['B', 6], ['C', 6], ['B', 11]];
    s.innerHTML = secenek.map(([t, k], i) => { const T = TIPLER[t], f = fiyat('A', k, t); return `<option value="${f}"${i === 1 ? ' selected' : ''}>${T.oda}, ${Math.round(T.net)} m², ${k}. kat: ${tl(f)}</option>`; }).join('');
    s.addEventListener('change', () => { H_DURUM.fiyat = +s.value; hesapCiz(); });
    $('h-pesin').addEventListener('input', e => { H_DURUM.pesin = +e.target.value; hesapCiz(); });
    document.querySelectorAll('[data-hvade]').forEach(b => b.addEventListener('click', () => { H_DURUM.vade = +b.dataset.hvade; document.querySelectorAll('[data-hvade]').forEach(x => x.classList.toggle('secili', x === b)); hesapCiz(); }));
    H_DURUM.fiyat = +s.value;
  }
  hesapCiz();
}
function hesapCiz() {
  const r = taksitHesap(H_DURUM.fiyat, H_DURUM.pesin, H_DURUM.vade);
  $('h-pesin-yazi').textContent = '%' + H_DURUM.pesin;
  sayiAnim($('h-pesinat'), r.pesinat, tl);
  sayiAnim($('h-aylik'), r.aylik, tl);
}
function takvimIlerle() {
  const t = $('takvim'), s = t.querySelector('.simdi');
  t.style.setProperty('--ilerleme', '0px');
  requestAnimationFrame(() => t.style.setProperty('--ilerleme', (s.offsetTop + 15) + 'px'));
}
let sayacBitti = false;
function sayaclar() {
  if (sayacBitti || hareketAz) return; sayacBitti = true;
  document.querySelectorAll('[data-say]').forEach(el => {
    const son = el.textContent, hedef = +el.dataset.say, t0 = performance.now() + 500;
    const adim = now => { const k = sinirla((now - t0) / 1300, 0, 1), e = 1 - Math.pow(1 - k, 3); el.textContent = k < 1 ? String(Math.round(hedef * e)) : son; if (k < 1) requestAnimationFrame(adim); };
    el.textContent = '0'; requestAnimationFrame(adim);
  });
}

/* ================= FORM ================= */
const perde = $('perde'), formL = $('form'); let formOnceki = null;
function formAc(daireIcin) {
  menuKapat();
  $('form-konu').textContent = daireIcin && D.tip ? `${D.blok} Blok Daire ${daireNo(D.kat, D.tip)} (${D.kat}. kat, ${TIPLER[D.tip].oda}) için arama talebi` : `${PROJE.ad} hakkında arama talebi`;
  $('arama-formu').hidden = false; $('form-tamam').hidden = true; $('form-hata').textContent = '';
  formOnceki = document.activeElement;
  perde.hidden = false; formL.hidden = false;
  requestAnimationFrame(() => { perde.classList.add('acik'); formL.classList.add('acik'); formL.querySelector('.kapat').focus(); });
}
function formKapat() {
  if (formL.hidden) return;
  perde.classList.remove('acik'); formL.classList.remove('acik');
  setTimeout(() => { if (!formL.classList.contains('acik')) { formL.hidden = true; perde.hidden = true; } }, hareketAz ? 0 : 500);
  if (formOnceki && formOnceki.focus) formOnceki.focus({ preventScroll: true });
}
document.querySelectorAll('[data-form]').forEach(b => b.addEventListener('click', () => formAc(b.dataset.form === 'daire')));
formL.querySelector('[data-kapat]').addEventListener('click', formKapat);
perde.addEventListener('click', formKapat);
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
  if (D.gorunum === 'acilis') { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') acilisBitir(); return; }
  if (e.key === 'Escape') {
    if (!formL.hidden) return formKapat();
    if (D.panel) return panelKapat();
    if (menu.classList.contains('acik')) return menuKapat();
    if (D.gorunum === 'oda') return daireyeDon();
    if (D.gorunum === 'daire') return kataDon();
    if (D.gorunum === 'kat') return binayaDon();
  }
  const yazida = e.target.closest && e.target.closest('input, select, textarea');
  if (D.panel === 'p-galeri' && !yazida && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return galeriGoster(galeriNo + (e.key === 'ArrowRight' ? 1 : -1));
  if (D.gorunum === 'bina' && !D.panel && formL.hidden && !yazida && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) cepheGit(D.cephe === 'on' ? 'arka' : 'on', e.key === 'ArrowRight' ? 1 : -1);
});
let boyutZaman = 0;
addEventListener('resize', () => { clearTimeout(boyutZaman); boyutZaman = setTimeout(() => { yerlesim(); if (vurgu) katVurgu(null); }, 80); });

/* ================= AÇILIŞ ================= */
const acilis = $('acilis');
let acildi = false;
function harfle(el) {
  let n = 0;
  el.querySelectorAll('span').forEach(sp => { const y = sp.textContent; sp.textContent = ''; [...y].forEach(c => { const h = document.createElement('span'); h.className = 'h'; h.textContent = c; h.style.transitionDelay = (n++ * 55) + 'ms'; sp.appendChild(h); }); });
}
// insa: açılış kendi bitince bina eskizden yükselir; Geç ya da tuşla atlanınca doğrudan açılır
function acilisBitir(insa) {
  if (acildi) return; acildi = true;
  insa = insa === true && !hareketAz;
  const eskiz = $('eskiz');
  if (insa) {
    kutu.classList.add('insada'); eskiz.classList.add('insa'); gBina.classList.add('yavas');
    setTimeout(() => {
      resimler.forEach(im => { im.style.transition = 'none'; });
      kutu.classList.remove('insada'); void kutu.offsetWidth;
      resimler.forEach(im => { im.style.transition = ''; });
    }, 1450);
    setTimeout(() => { eskiz.classList.remove('insa'); gBina.classList.remove('yavas'); }, 3300);
  }
  acilis.classList.add('bitti');
  if (!hareketAz) { sahne.classList.add('giris'); void sahne.offsetWidth; }
  gBina.classList.add('acik', 'ilk');
  setTimeout(() => gBina.classList.remove('ilk'), insa ? 4200 : 3200);
  gorunumAyarla('bina');
  requestAnimationFrame(() => sahne.classList.remove('giris'));
  setTimeout(() => katKatmani(true), hareketAz ? 0 : insa ? 2900 : 1000);
  setTimeout(() => {
    resimler.forEach(im => { if (!im.src) im.src = resimKaynak(im); });
    yukle(PLAN_GORSEL.kat.src);
  }, 1200);
  setTimeout(() => { acilis.hidden = true; }, 1200);
}
async function acilisOynat() {
  const m = telefon() ? '-m' : '';
  harfle(document.querySelector('.ac-ad'));
  const ilk = resimler.find(im => im.dataset.v === 'on' && im.dataset.z === 'aksam');
  ilk.src = resimKaynak(ilk);
  const eskiz = $('eskiz');
  eskiz.src = `img/eskiz-on${m}.webp`;
  const isler = [`img/acilis-1${m}.webp`, ilk.src, eskiz.src];
  let biten = 0;
  const hazir = isler.map(s => yukle(s).then(() => { biten++; $('ac-dolu').style.width = (biten / isler.length * 100) + '%'; }));
  $('ac-1').style.backgroundImage = `url(${isler[0]})`;
  const zamanAsimi = ms => new Promise(r => setTimeout(r, ms));
  await Promise.race([Promise.all([yukle('img/logo-izyap-beyaz.webp'), yukle('img/logo-barisan-beyaz.webp'), document.fonts ? document.fonts.ready : null]), zamanAsimi(1500)]);
  if (acildi) return;
  if (hareketAz) { await Promise.race([hazir[1], zamanAsimi(4000)]); return acilisBitir(); }
  acilis.dataset.adim = '1'; await bekle(2300); if (acildi) return;
  await Promise.race([hazir[0], zamanAsimi(3000)]); if (acildi) return;
  acilis.dataset.adim = '2'; await bekle(3400); if (acildi) return;
  const tamam = await Promise.race([Promise.all([hazir[1], hazir[2]]).then(() => true), zamanAsimi(4000).then(() => false)]);
  acilisBitir(tamam);
}
$('ac-gec').addEventListener('click', () => acilisBitir());

/* ================= başlangıç ================= */
yerlesim(); cepheGoster(); katListesiCiz();
acilisOynat();
})();
