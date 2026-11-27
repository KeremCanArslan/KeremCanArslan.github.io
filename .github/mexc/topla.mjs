// MEXC kopya trade lider trader'larının açık işlemlerinden coin başına özet çıkarır:
// long / short trader sayısı ve miktar ağırlıklı ortalama giriş fiyatı.
// Kaynak MEXC'nin kendi kopya trade sayfasının kullandığı herkese açık adresler (giriş gerekmez).
// Kullanım: node topla.mjs <çıktı.json>
import { writeFile, rename } from 'node:fs/promises';

const KOPYA = 'https://futures.mexc.com/copyFutures/api/v1/';
const TICKER = 'https://futures.mexc.com/api/v1/contract/ticker';
const HIZ = 8;              // saniyede en çok istek; 8 ile hız uyarısı (510) alınmadı, daha hızlısında alındı
const ISCI = 6;
const SAYFA_SINIRI = 25;    // trader başına en çok 25 x 20 işlem
const HATA_SINIRI = 0.05;   // taranamayan trader oranı bunu geçerse eski dosya korunur
const cikti = process.argv[2];
if (!cikti) { console.error('Kullanım: node topla.mjs <çıktı.json>'); process.exit(2); }

const bekle = (ms) => new Promise(r => setTimeout(r, ms));
let sonraki = Date.now(), istek = 0, hizUyarisi = 0;
async function sira() {
  const simdi = Date.now(), t = Math.max(simdi, sonraki);
  sonraki = t + 1000 / HIZ;
  if (t > simdi) await bekle(t - simdi);
}

async function al(url) {
  for (let deneme = 0; deneme < 5; deneme++) {
    await sira();
    istek++;
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } });
      const j = await r.json();
      if (j && j.success && j.data !== undefined) return j.data;
      if (j && j.code === 510) { hizUyarisi++; await bekle(2000); continue; }
    } catch (e) { /* ağ hatası: aşağıda bekleyip yeniden denenir */ }
    await bekle(500 * (deneme + 1));
  }
  return null;
}

const baslangic = Date.now();

const uids = [], gorulen = new Set();
let toplamTrader = 0;
for (let sayfa = 1; sayfa <= 200; sayfa++) {
  const d = await al(`${KOPYA}traders/v2?condition=%5B%5D&limit=100&orderBy=COMPREHENSIVE&page=${sayfa}`);
  if (!d) { console.error('Trader listesi alınamadı, sayfa ' + sayfa); process.exit(1); }
  toplamTrader = d.total || toplamTrader;
  const c = d.content || [];
  if (!c.length) break;
  for (const t of c) if (!gorulen.has(t.uid)) { gorulen.add(t.uid); uids.push(t.uid); }
  if (uids.length >= toplamTrader) break;
}
if (!uids.length) { console.error('Trader listesi boş geldi'); process.exit(1); }

const islemler = new Map();   // işlem id -> işlem (aynı işlem iki sayfada gelirse bir kez sayılır)
let taranamayan = 0, acikTrader = 0;
const kuyruk = uids.slice();
async function isci() {
  while (kuyruk.length) {
    const uid = kuyruk.shift();
    let n = 0, basarili = true;
    for (let sayfa = 1; sayfa <= SAYFA_SINIRI; sayfa++) {
      const d = await al(`${KOPYA}trader/orders/v2?limit=20&orderListType=ORDER&page=${sayfa}&uid=${uid}`);
      if (!d) { basarili = false; break; }
      const c = d.content || [];
      for (const e of c) islemler.set(e.id, e);
      n += c.length;
      if (c.length < 20) break;
    }
    if (!basarili) taranamayan++;
    if (n) acikTrader++;
  }
}
await Promise.all(Array.from({ length: ISCI }, isci));

const oran = taranamayan / uids.length;
if (oran > HATA_SINIRI) {
  console.error(`Taranamayan trader %${(oran * 100).toFixed(1)}, dosya yazılmadı (${taranamayan}/${uids.length})`);
  process.exit(1);
}

const ticker = await al(TICKER);
const adil = {};
for (const t of (Array.isArray(ticker) ? ticker : [])) adil[t.symbol] = t.fairPrice;

const coin = {};
for (const e of islemler.values()) {
  if (!e.symbol || !e.symbol.endsWith('_USDT') || !(e.amount > 0) || !(e.openAvgPrice > 0)) continue;
  if (e.positionType !== 1 && e.positionType !== 2) continue;
  const taban = e.symbol.slice(0, -5);
  const c = (coin[taban] ||= { L: { t: new Set(), m: 0, pm: 0 }, S: { t: new Set(), m: 0, pm: 0 } });
  const y = e.positionType === 1 ? c.L : c.S;
  y.t.add(e.traderUid); y.m += e.amount; y.pm += e.amount * e.openAvgPrice;
}
const yuvarla = (v) => (v === null ? null : +v.toPrecision(8));
const ozet = {};
for (const [taban, c] of Object.entries(coin)) {
  ozet[taban] = {
    lt: c.L.t.size, st: c.S.t.size,
    lo: c.L.m ? yuvarla(c.L.pm / c.L.m) : null,
    so: c.S.m ? yuvarla(c.S.pm / c.S.m) : null,
    f: adil[taban + '_USDT'] ?? null
  };
}

const veri = {
  zaman: Date.now(), baslangic, trader: uids.length, toplamTrader, taranamayan, acikTrader,
  islem: islemler.size, coin: ozet
};
await writeFile(cikti + '.tmp', JSON.stringify(veri));
await rename(cikti + '.tmp', cikti);
console.log(`Bitti: ${uids.length} trader (${toplamTrader} listede), taranamayan ${taranamayan}, açık işlemi olan ${acikTrader}, ${islemler.size} işlem, ${Object.keys(ozet).length} coin, ${istek} istek, hız uyarısı ${hizUyarisi}, ${((Date.now() - baslangic) / 60000).toFixed(1)} dk`);
