// MEXC'nin Big Data ekranındaki veriyi coin başına toplar (www.mexc.com/futures/contractBigData):
// - long / short hesap oranları, saatlik son nokta: bütün hesaplar (Platform's Long-Short Position Holders Ratio),
//   seçkin hesaplar hesap sayısı (Elite Account ... Holders Ratio) ve pozisyon büyüklüğü (Elite Account ... Holding Ratio)
// - saatlik aktif alış / satış tutarı (Platform's Active Buys and Sells): son 1, 4 ve 12 saatin toplamı
// - coin adı farklı olan kontratların listesi ve tarama anındaki fiyat (sayfa Binance'le eşleştirirken kullanır)
// MEXC bu adreslerde başka sitelerden tarayıcı isteğine izin vermediği için sayfa okuyamaz, sunucuda toplanır.
// Kullanım: node oran.mjs <çıktı.json>
import { writeFile, rename } from 'node:fs/promises';

const API = 'https://futures.mexc.com/api/v1/contract/';
const HIZ = 8;              // saniyede en çok istek (kopya trade taramasında 8 ile hız uyarısı alınmadı)
const ISCI = 6;
const HATA_SINIRI = 0.05;   // alınamayan coin oranı bunu geçerse eski dosya korunur
const SAAT = 3600000;
const TURLER = { u: 'PLATFORM_TOTAL_USERS', eu: 'PLATFORM_ELITE_TOTAL_USERS', ep: 'PLATFORM_ELITE_TOTAL_AMOUNT' };
const PENCERE = [1, 4, 12];  // saat; MEXC saatlik aralıkta 12 nokta veriyor
const cikti = process.argv[2];
if (!cikti) { console.error('Kullanım: node oran.mjs <çıktı.json>'); process.exit(2); }

const bekle = (ms) => new Promise(r => setTimeout(r, ms));
let sonraki = Date.now(), istek = 0, hizUyarisi = 0;
async function sira() {
  const simdi = Date.now(), t = Math.max(simdi, sonraki);
  sonraki = t + 1000 / HIZ;
  if (t > simdi) await bekle(t - simdi);
}

// Başarılı cevapta data, alınamazsa null
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
const detay = await al(API + 'detail');
if (!Array.isArray(detay) || !detay.length) { console.error('Kontrat listesi alınamadı'); process.exit(1); }
const usdt = detay.filter(d => d.quoteCoin === 'USDT' && d.settleCoin === 'USDT' && d.futureType === 1 && d.state === 0 && d.symbol.endsWith('_USDT'));
const semboller = usdt.map(d => d.symbol);
// MEXC bazı coinleri farklı adla listeliyor (TRUMP → TRUMPOFFICIAL_USDT, FIL → FILECOIN_USDT): coin adı → sembol adı.
// Sayfa bu adla eşleştirdiğinde fiyatı da karşılaştırır, aynı kısaltmalı başka coin eşleşmez.
const ad = {};
for (const d of usdt) { const k = d.symbol.slice(0, -5); if (d.baseCoinName && d.baseCoinName !== k) ad[d.baseCoinName] = k; }

const coin = {};
let alinamayan = 0, veriYok = 0;
const kuyruk = semboller.slice();
const yuvarla = (v) => +Number(v).toPrecision(6);

async function isci() {
  while (kuyruk.length) {
    const sym = kuyruk.shift();
    const q = `currency=USDT&interval=H1&symbol=${sym}`;
    let basarisiz = false;
    const o = {};
    for (const [k, tur] of Object.entries(TURLER)) {
      const d = await al(`${API}big_data/position?${q}&type=${tur}`);
      if (!d) { basarisiz = true; break; }
      const n = Array.isArray(d.time) ? d.time.length : 0;
      // [nokta zamanı, long payı, long / short oranı]
      if (n && d.longRatio && d.longShortRatio) o[k] = [d.time[n - 1], yuvarla(d.longRatio[n - 1]), yuvarla(d.longShortRatio[n - 1])];
    }
    let h = null;
    if (!basarisiz) {
      const d = await al(`${API}big_data/active_trade_amount?${q}`);
      if (!d) basarisiz = true;
      else if (Array.isArray(d.time) && d.time.length) {
        // Nokta zamanı saatin bitişi: T noktası T-1 saat ile T arasındaki işlemler (MEXC mumlarıyla karşılaştırarak ölçüldü).
        // MEXC az işlemli saatleri yayımlamıyor (o saatlerin mumunda yine işlem var, 27.11 ölçümü): pencerede yayımlanan
        // saatler toplanır, kaç saat olduğu da yazılır; sayfa bunu gösterir. [alış, satış, yayımlanan saat]
        const T = Math.max(...d.time);
        h = { t: T };
        for (const s of PENCERE) {
          let b = 0, a = 0, say = 0;
          d.time.forEach((t, i) => { if (t > T - s * SAAT && t <= T) { b += d.bidAmount[i]; a += d.askAmount[i]; say++; } });
          h[s] = [Math.round(b), Math.round(a), say];
        }
      }
    }
    if (basarisiz) { alinamayan++; continue; }
    if (!Object.keys(o).length && !h) { veriYok++; continue; }
    coin[sym.slice(0, -5)] = { o, h };
  }
}
await Promise.all(Array.from({ length: ISCI }, isci));

const oran = alinamayan / semboller.length;
if (oran > HATA_SINIRI) {
  console.error(`Alınamayan coin %${(oran * 100).toFixed(1)}, dosya yazılmadı (${alinamayan}/${semboller.length})`);
  process.exit(1);
}

// Tarama anındaki fiyat: sayfa eşleşmeyi Binance fiyatıyla doğrular
const ticker = await al(API + 'ticker');
if (!Array.isArray(ticker) || !ticker.length) { console.error('Fiyat listesi alınamadı, dosya yazılmadı'); process.exit(1); }
const adil = Object.fromEntries(ticker.map(t => [t.symbol, t.fairPrice]));
for (const [k, x] of Object.entries(coin)) x.f = adil[k + '_USDT'] ?? null;

const veri = { zaman: Date.now(), baslangic, kontrat: semboller.length, alinamayan, veriYok, ad, coin };
await writeFile(cikti + '.tmp', JSON.stringify(veri));
await rename(cikti + '.tmp', cikti);
console.log(`Bitti: ${semboller.length} kontrat, alınamayan ${alinamayan}, verisi olmayan ${veriYok}, yazılan ${Object.keys(coin).length} coin, ${istek} istek, hız uyarısı ${hizUyarisi}, ${((Date.now() - baslangic) / 60000).toFixed(1)} dk`);
