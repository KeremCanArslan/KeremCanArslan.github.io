/* Ortak randevu demosu: web sitesi + telefon uygulaması (?app) + işletme paneli.
   İşletmeye özel her şey (ad, hizmetler, ekip, renkler, sözcükler) sayfadaki window.ISLETME'den gelir.
   Veri tarayıcıda (localStorage) tutulur; site, uygulama ve panel aynı veriyi görür. */
(() => {
'use strict';
const C = window.ISLETME;
const Z = C.soz;
const APP = new URLSearchParams(location.search).has('app');
const KEY = C.anahtar;
const IMG = (id, w) => 'https://images.unsplash.com/photo-' + id + '?w=' + (w || 900) + '&q=62&auto=format&fit=crop';
const GUNLER = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
const GUNTAM = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const AYLAR = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const AYTAM = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const ODEMELER = ['Kart','Nakit','Havale'];
const PANEL_KAYNAK = ['Telefon','WhatsApp','Instagram','Yüz yüze'];
const DURUM = {bekliyor:'Onay bekliyor', onay:'Onaylandı', tamam:'Ödendi', gelmedi:'Gelmedi', iptal:'İptal'};
const AKTIF = r => r.durum === 'bekliyor' || r.durum === 'onay' || r.durum === 'tamam';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tl = n => Math.round(n || 0).toLocaleString('tr-TR') + ' TL';
const pad = n => String(n).padStart(2, '0');
const gunAnahtar = t => t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate());
const gunTarih = k => new Date(k + 'T12:00');
const gunEkle = (k, n) => { const t = gunTarih(k); t.setDate(t.getDate() + n); return gunAnahtar(t); };
const bugunK = () => gunAnahtar(new Date());
const dk2saat = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
const saat2dk = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const simdiDk = () => { const t = new Date(); return t.getHours() * 60 + t.getMinutes(); };
const kapaliGun = k => C.saat.kapali.includes(gunTarih(k).getDay());
const gunEtiket = k => { const t = gunTarih(k); return GUNLER[t.getDay()] + ' ' + t.getDate() + ' ' + AYLAR[t.getMonth()]; };
const gunUzun = k => { const t = gunTarih(k); return GUNTAM[t.getDay()] + ', ' + t.getDate() + ' ' + AYTAM[t.getMonth()]; };
const gunGoreli = k => { const b = bugunK(); return k === b ? 'Bugün' : k === gunEkle(b, 1) ? 'Yarın' : gunEtiket(k); };
const gunMesaj = k => { const b = bugunK(); return k === b ? 'bugün' : k === gunEkle(b, 1) ? 'yarın' : gunUzun(k); };
const kacGunOnce = k => Math.round((gunTarih(bugunK()) - gunTarih(k)) / 864e5);
const ilkAd = ad => String(ad).split(' ')[0];
const telMaske = t => t ? t.slice(0, 4) + ' *** ** ' + t.slice(-2) : '';
const telGoster = r => r.slice(0, 4) + ' ' + r.slice(4, 7) + ' ' + r.slice(7, 9) + ' ' + r.slice(9);
function telTemiz(t){ const r = String(t).replace(/\D/g, ''); if (/^05\d{9}$/.test(r)) return r; if (/^5\d{9}$/.test(r)) return '0' + r; return null; }
const saatNokta = s => s.replace(':', '.');
const kucuk = s => s.toLocaleLowerCase('tr-TR');

function acikGunler(n, bas){
  const g = []; let k = bas || bugunK(), koruma = 0;
  while (g.length < n && koruma++ < 60) { if (!kapaliGun(k)) g.push(k); k = gunEkle(k, 1); }
  return g;
}
function rnd(seed){
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ---------------- veri ---------------- */
let bellek = null;
function oku(){ try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) { /* gizli sekme: bellekteki kopya kullanılır */ } return bellek; }
function yaz(d){ bellek = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* depolama kapalıysa yalnız bu sekmede tutulur */ } }
function veri(){
  let d = oku();
  if (!d || d.surum !== 2 || !Array.isArray(d.randevular) || !Array.isArray(d.hizmetler)) { d = yeniVeri(null); yaz(d); }
  else if (d.tohumGun !== bugunK()) { d = yeniVeri(d); yaz(d); }
  return d;
}
const cakisir = (r, bas, bit) => { const rb = saat2dk(r.saat); return bas < rb + r.dk && rb < bit; };
function yeniVeri(eski){
  const d = {
    surum: 2, tohumGun: bugunK(), sayac: 0, kapali: [], randevular: [],
    hizmetler: eski ? eski.hizmetler : C.hizmetler.map(([id, kat, ad, dk, fiyat]) => ({id, kat, ad, dk, fiyat})),
    ayar: eski && eski.ayar ? eski.ayar : {otoOnay: false, acilis: C.saat.acilis, kapanis: C.saat.kapanis, prim: Object.fromEntries(C.uzmanlar.map(u => [u.ad, u.prim]))},
    notlar: eski && eski.notlar ? eski.notlar : {},
    profil: eski ? eski.profil || null : null
  };
  tohumla(d);
  if (eski) {
    const b = bugunK();
    eski.randevular.filter(r => r.benim && r.gun >= b).forEach(r => {
      d.randevular = d.randevular.filter(x => !(x.gun === r.gun && x.uzman === r.uzman && cakisir(x, saat2dk(r.saat), saat2dk(r.saat) + r.dk)));
      d.randevular.push(r);
    });
  }
  return d;
}
function tohumla(d){
  const r = rnd(C.tohum || 7);
  const sec = a => a[Math.floor(r() * a.length)];
  const AG = Object.fromEntries(C.hizmetler.map(x => [x[0], x[5] || 1]));
  const agirlikli = a => { const top = a.reduce((t, h) => t + (AG[h.id] || 1), 0); let x = r() * top; for (const h of a) { x -= AG[h.id] || 1; if (x <= 0) return h; } return a[a.length - 1]; };
  const ac = saat2dk(d.ayar.acilis), kp = saat2dk(d.ayar.kapanis);
  const b = bugunK(), sim = simdiDk();
  const ADLAR = [...new Set(C.musteriler.map(x => x.split(' ')[0]))], HARF = 'ABCDEFGHİKLMNOPRSTUVYZÇÖŞÜ';
  const n = Math.min(420, ADLAR.length * HARF.length), M = Array.from({length: n}, (_, i) => ADLAR[i % ADLAR.length] + ' ' + HARF[Math.floor(i / ADLAR.length) % HARF.length] + '.');
  const on = ['0532','0533','0535','0536','0538','0542','0543','0544','0505','0506','0552','0555'];
  const tel = i => on[i % on.length] + ' ' + String(100 + (i * 337) % 900) + ' ' + pad((i * 53 + 17) % 100) + ' ' + pad((i * 29 + 41) % 100);
  const kaynak = () => { const x = r(); return x < .3 ? 'Site' : x < .47 ? 'Uygulama' : x < .64 ? 'Instagram' : x < .88 ? 'Telefon' : 'WhatsApp'; };
  const odeme = () => { const x = r(); return x < .56 ? 'Kart' : x < .95 ? 'Nakit' : 'Havale'; };
  const ilk2 = acikGunler(2);
  C.uzmanlar.forEach(u => { if (u.mola) ilk2.forEach(k => d.kapali.push({id: 'k' + (++d.sayac), gun: k, uzman: u.ad, bas: u.mola[0], bit: u.mola[1], neden: 'Öğle arası'})); });
  for (let g = -30; g <= 6; g++) {
    const k = gunEkle(b, g); if (kapaliGun(k)) continue;
    const gunMusteri = new Set();
    const dolu = m => g < 0 ? .7 : g === 0 ? (m < sim ? .7 : .36) : g === 1 ? .42 : .26;
    C.uzmanlar.forEach(u => {
      const hz = d.hizmetler.filter(h => u.kat.includes(h.kat));
      let m = ac + (r() < .5 ? 0 : 30);
      while (m < kp) {
        if (r() > dolu(m)) { m += 30; continue; }
        const h = agirlikli(hz);
        const bit = m + h.dk;
        if (bit > kp || d.kapali.some(x => x.gun === k && x.uzman === u.ad && m < saat2dk(x.bit) && saat2dk(x.bas) < bit)) { m += 30; continue; }
        let mi = Math.floor(Math.pow(r(), 1.3) * n), dene = 0;
        while (gunMusteri.has(mi) && dene++ < 8) mi = Math.floor(r() * n);
        if (gunMusteri.has(mi)) { m += 30; continue; }
        gunMusteri.add(mi);
        const rd = {id: 't' + (++d.sayac), gun: k, saat: dk2saat(m), dk: h.dk, hizmet: h.id, fiyat: h.fiyat, uzman: u.ad, ad: M[mi], tel: tel(mi), kaynak: kaynak(), benim: false};
        if (g < 0 || (g === 0 && bit <= sim)) { const x = r(); rd.durum = x < .89 ? 'tamam' : x < .94 ? 'gelmedi' : 'iptal'; }
        else rd.durum = r() < (g === 0 ? .88 : .94) ? 'onay' : 'bekliyor';
        if (rd.durum === 'tamam') {
          const kal = [{ad: h.ad, fiyat: h.fiyat, hid: h.id}];
          if (r() < .18) { const p = sec(C.urunler); kal.push({ad: p[0], fiyat: p[1]}); }
          rd.adisyon = {kalemler: kal, indirim: 0, odeme: odeme(), toplam: kal.reduce((t, x) => t + x.fiyat, 0)};
        }
        d.randevular.push(rd);
        m += Math.ceil(h.dk / 30) * 30;
      }
    });
  }
}
const hizmetBul = (d, id) => d.hizmetler.find(h => h.id === id);
const hizmetAd = (d, r) => { const h = hizmetBul(d, r.hizmet); return h ? h.ad : (r.adisyon && r.adisyon.kalemler[0] ? r.adisyon.kalemler[0].ad : '-'); };
const aralik = d => ({ac: saat2dk(d.ayar.acilis), kp: saat2dk(d.ayar.kapanis)});
function mesgul(d, gun, uzman, bas, bit, haric){
  return d.randevular.some(r => r.gun === gun && r.uzman === uzman && r.id !== haric && AKTIF(r) && r.kaynak !== 'Randevusuz' && cakisir(r, bas, bit))
    || d.kapali.some(x => x.gun === gun && x.uzman === uzman && bas < saat2dk(x.bit) && saat2dk(x.bas) < bit);
}
function uygunMu(d, gun, bas, dk, panel){
  const {ac, kp} = aralik(d), b = bugunK();
  if (bas < ac || bas + dk > kp || kapaliGun(gun) || gun < b) return false;
  return !(gun === b && bas < simdiDk() + (panel ? 0 : 30));
}
function bosUzman(d, gun, saat, hid, tercih, panel){
  const h = hizmetBul(d, hid); if (!h) return null;
  const bas = saat2dk(saat); if (!uygunMu(d, gun, bas, h.dk, panel)) return null;
  const u = C.uzmanlar.find(x => x.kat.includes(h.kat) && (tercih === 'farketmez' || x.ad === tercih) && !mesgul(d, gun, x.ad, bas, bas + h.dk));
  return u ? u.ad : null;
}
function saatler(d, gun, hid, tercih, panel){
  const {ac, kp} = aralik(d), l = [];
  for (let m = ac; m < kp; m += 30) { const s = dk2saat(m); l.push({s, u: bosUzman(d, gun, s, hid, tercih, panel)}); }
  return l;
}
function ilkBoslar(d, hid, adet){
  for (const g of acikGunler(7)) { const l = saatler(d, g, hid, 'farketmez').filter(x => x.u).slice(0, adet); if (l.length) return {gun: g, l}; }
  return null;
}
function ilkBosUzman(d, ad){
  const {ac, kp} = aralik(d);
  for (const g of acikGunler(7)) for (let m = ac; m + 30 <= kp; m += 30) if (uygunMu(d, g, m, 30) && !mesgul(d, g, ad, m, m + 30)) return {gun: g, saat: dk2saat(m)};
  return null;
}
function rezerve(s){
  const d = veri(), h = hizmetBul(d, s.hizmet);
  if (!h) return {hata: 'Hizmet seçin.'};
  if (!s.gun || !s.saat) return {hata: 'Gün ve saat seçin.'};
  if (!s.ad || s.ad.trim().length < 3) return {hata: 'Adınızı ve soyadınızı yazın.'};
  const tel = telTemiz(s.tel || '');
  if (!tel) return {hata: 'Cep telefonunu 05xx xxx xx xx biçiminde yazın.'};
  const u = bosUzman(d, s.gun, s.saat, s.hizmet, s.uzman);
  if (!u) return {hata: 'Bu saat az önce doldu, başka bir saat seçin.'};
  const r = {id: 'r' + Date.now(), gun: s.gun, saat: s.saat, dk: h.dk, hizmet: h.id, fiyat: h.fiyat, uzman: u, ad: s.ad.trim(), tel: telGoster(tel), durum: d.ayar.otoOnay ? 'onay' : 'bekliyor', kaynak: s.kaynak, benim: true};
  d.randevular.push(r); d.profil = {ad: r.ad, tel: r.tel}; yaz(d);
  return {r};
}
const telYaz = r => r.benim ? r.tel : telMaske(r.tel);
const saatMetin = d => saatNokta(d.ayar.acilis) + ' - ' + saatNokta(d.ayar.kapanis);

/* ---------------- ortak yardımcılar ---------------- */
let toastZ;
function toast(m){ const t = $('toast'); if (!t) return; t.textContent = m; t.classList.add('ac'); clearTimeout(toastZ); toastZ = setTimeout(() => t.classList.remove('ac'), 2800); }
function indir(ad, icerik, tur){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([icerik], {type: tur})); a.download = ad;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function kopyala(metin){
  const yedek = () => { const t = document.createElement('textarea'); t.value = metin; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; } t.remove(); toast(ok ? 'Mesaj kopyalandı' : 'Kopyalanamadı, metni seçip kopyalayın'); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(metin).then(() => toast('Mesaj kopyalandı'), yedek); else yedek();
}
function icsIndir(d, r){
  const [y, a, g] = r.gun.split('-'), bas = r.saat.replace(':', ''), bit = dk2saat(saat2dk(r.saat) + r.dk).replace(':', '');
  const s = new Date(), z = s.getUTCFullYear() + pad(s.getUTCMonth() + 1) + pad(s.getUTCDate()) + 'T' + pad(s.getUTCHours()) + pad(s.getUTCMinutes()) + '00Z';
  const kac = t => t.replace(/[\\,;]/g, m => '\\' + m);
  indir('randevu.ics', ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ornek Randevu//TR','BEGIN:VEVENT','UID:' + r.id + '@ornek','DTSTAMP:' + z,'DTSTART:' + y + a + g + 'T' + bas + '00','DTEND:' + y + a + g + 'T' + bit + '00','SUMMARY:' + kac(C.ad + ' - ' + hizmetAd(d, r)),'LOCATION:' + kac(C.adres),'END:VEVENT','END:VCALENDAR'].join('\r\n'), 'text/calendar');
}
const rotaSvg = '<svg viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/></svg>';

/* ---------------- web sitesi ---------------- */
function siteIskelet(){
  const kats = C.kategoriler;
  return `
<div class="ornek">${esc(C.ornekNot)}</div>
<header><div class="wrap">
  <a class="logo" href="#"><b>${esc(C.ad)}</b><small>${esc(C.altyazi)}</small></a>
  <button class="menuBtn" id="menuBtn" type="button" aria-expanded="false" aria-controls="nav">Menü</button>
  <nav id="nav">
    <a href="#hizmetler">Hizmetler</a><a href="#ekip">${esc(Z.ekipMenu)}</a><a href="#randevu">Randevu</a><a href="#galeri">${esc(Z.isletme)}</a><a href="#iletisim">İletişim</a>
    <a class="v" href="#uygulama" data-v="uygulama">Mobil uygulama</a><a class="v" href="#panel" data-v="panel">${esc(Z.panel)}</a>
  </nav>
</div></header>
<main id="v-site">
  <section class="hero" style="background-image:url('${IMG(C.hero.foto, 1800)}')"><div class="wrap">
    <div class="ust">${esc(C.semt)} · <span id="acikDurum"></span></div>
    <h1>${esc(C.hero.baslik)}</h1>
    <p>${esc(C.hero.metin)}</p>
    <div class="btns"><a class="btn" href="#randevu">Randevu al</a><a class="btn beyaz" href="#hizmetler">Hizmetler ve fiyatlar</a></div>
    <div class="hbos" id="hBos"></div>
    <div class="hbilgi"><div><b>Çalışma saatleri</b>${esc(C.saat.gunMetin)} <span class="hSaat"></span></div><div><b>Adres</b>${esc(C.adresKisa)}</div><div><b>Telefon</b>${esc(C.telefon)}</div></div>
  </div></section>
  <section class="bolum" id="hizmetler"><div class="wrap">
    <div class="bbas"><div class="ust">Hizmetler</div><h2>Hizmetler ve fiyatlar</h2><p>Fiyatlar ${esc(Z.panelden)} güncellenir; burada ve uygulamada hep aynı fiyat görünür.</p></div>
    <div class="hiz"><div class="foto"><img id="katFoto" alt=""></div><div><div class="katlar" id="katlar"></div><div id="hizListe"></div></div></div>
  </div></section>
  <section class="bolum beyaz" id="ekip"><div class="wrap">
    <div class="bbas"><div class="ust">${esc(Z.ekipUst)}</div><h2>${esc(Z.ekipBaslik)}</h2><p>${esc(Z.ekipMetin)}</p></div>
    <div id="ekipListe"></div>
  </div></section>
  <section class="bolum" id="randevu"><div class="wrap">
    <div class="bbas"><div class="ust">Online randevu</div><h2>Randevu alın</h2><p>Dolu saatler kapalı görünür. Randevunuz ${esc(Z.isletme.toLocaleLowerCase('tr-TR'))} onaylayınca kesinleşir.</p></div>
    <div class="rdv">
      <div class="kutu" id="rForm">
        <div class="adim"><b>1. Hizmet</b><select id="rHizmet" aria-label="Hizmet"></select></div>
        <div class="adim"><b>2. ${esc(Z.uzman)}</b><div class="cipler" id="rUzman"></div></div>
        <div class="adim"><b>3. Gün</b><div class="cipler" id="rGun"></div></div>
        <div class="adim"><b>4. Saat</b><div class="cipler" id="rSaat"></div></div>
        <div class="adim" style="margin-bottom:0"><b>5. Bilgileriniz</b>
          <div class="alanlar"><label>Ad soyad<input id="rAd" autocomplete="name" placeholder="Adınız ve soyadınız"></label><label>Cep telefonu<input id="rTel" inputmode="tel" autocomplete="tel" placeholder="05xx xxx xx xx"></label></div>
        </div>
      </div>
      <div class="kutu ozet" id="rOzet"></div>
    </div>
  </div></section>
  <section class="bolum beyaz" id="galeri"><div class="wrap">
    <div class="bbas"><div class="ust">${esc(Z.galeriUst)}</div><h2>${esc(Z.galeriBaslik)}</h2></div>
    <div class="galeri">${C.galeri.map(([id, alt], i) => `<img src="${IMG(id, i ? 600 : 1000)}" alt="${esc(alt)}" loading="lazy">`).join('')}</div>
  </div></section>
  <section class="bolum" id="iletisim"><div class="wrap">
    <div class="bbas"><div class="ust">İletişim</div><h2>Bize ulaşın</h2></div>
    <div class="iletisim">
      <div class="kutu"><b>Adres</b><p>${esc(C.adres)}</p><div class="btns" style="margin-top:14px"><button class="btn cizgi kucuk" type="button" data-bilgi="Gerçek sitede Google Haritalar yol tarifi açılır">Yol tarifi</button></div></div>
      <div class="kutu"><b>Çalışma saatleri</b><div class="saatler"><span>${esc(C.saat.gunMetin)}</span><span class="hSaat"></span><span>${esc(C.saat.kapaliMetin)}</span><span>Kapalı</span></div></div>
      <div class="kutu"><b>Telefon ve mesaj</b><p>${esc(C.telefon)}</p><div class="btns" style="margin-top:14px"><button class="btn wa kucuk" type="button" data-bilgi="Gerçek sitede ${esc(Z.isletmenin)} WhatsApp hattına mesaj açılır">WhatsApp</button><button class="btn cizgi kucuk" type="button" data-bilgi="Gerçek sitede ${esc(Z.isletmenin)} Instagram hesabı açılır">Instagram</button></div></div>
    </div>
  </div></section>
  <footer><div class="wrap"><span>© ${esc(C.ad)}</span><span>Örnek tasarım</span></div></footer>
  <button class="waf" id="waf" type="button" data-bilgi="Gerçek sitede ${esc(Z.isletmenin)} WhatsApp hattına mesaj açılır">WhatsApp</button>
</main>
<section id="v-uygulama" hidden><div class="wrap uyg">
  <div>
    <div class="ust">Mobil uygulama</div>
    <h1>${esc(Z.uygBaslik)}</h1>
    <p>Yandaki telefon gerçekten çalışıyor: hizmet seçip randevu alabilir, Randevularım sekmesinden görebilir ve iptal edebilirsiniz. Uygulamadan alınan randevu da siteden alınan gibi ${esc(Z.paneline)} düşer.</p>
    <div class="ozel">
      <div><b>Randevu al</b>Hizmet, ${esc(Z.uzmanKucuk)}, gün ve boş saat seçilir; dolu saatler görünmez.</div>
      <div><b>Randevularım</b>Müşteri yaklaşan randevusunu görür, gelemeyecekse kendisi iptal eder, o saat yeniden açılır.</div>
      <div><b>${esc(Z.isletme)} bilgileri</b>Fiyatlar, kampanya, adres ve çalışma saatleri tek yerde. Telefonun ana ekranına uygulama gibi eklenir.</div>
    </div>
    <div class="btns"><a class="btn" href="#panel">${esc(Z.paneline.charAt(0).toLocaleUpperCase('tr-TR') + Z.paneline.slice(1))} geç</a><a class="btn cizgi" href="?app=1" target="_blank" rel="noopener">Tam ekran aç</a></div>
  </div>
  <div class="telefon"><iframe id="uygCerceve" title="Mobil uygulama örneği" loading="lazy"></iframe></div>
</div></section>
<section id="v-panel" hidden><div class="pnl"><div class="wrap">
  <div class="pust">
    <div><div class="ust">${esc(Z.panel)}</div><h1 id="pBaslik">Takvim</h1><p class="pnot">Bu bölümü yalnızca siz görürsünüz, şifreyle girilir. Müşteriniz siteden ya da uygulamadan randevu alınca burada anında görünür.</p></div>
    <div class="btns" style="margin-top:0"><a class="btn cizgi kucuk" href="#randevu">Siteden randevu al</a><a class="btn cizgi kucuk" href="#uygulama">Uygulamadan randevu al</a></div>
  </div>
  <div class="psekme" id="pSekme" role="tablist"></div>
  <div id="pIc"></div>
</div></div></section>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="modal" id="modal" hidden><div class="m-kutu" role="dialog" aria-modal="true"><button class="m-kapat" type="button" data-kapat>Kapat</button><div id="mIc"></div></div></div>
<div class="ipucu" id="ipucu" hidden></div>
<div class="rehber" id="rehber" hidden>
  <b>Bu örneği 1 dakikada deneyin</b>
  <ol><li>Siteden bir randevu alın.</li><li>${esc(Z.paneline.charAt(0).toLocaleUpperCase('tr-TR') + Z.paneline.slice(1))} geçin, randevunuz onay bekliyor.</li><li>Takvim, kasa ve müşteri ekranlarına göz atın.</li></ol>
  <div class="btns"><a class="btn kucuk" href="#randevu" data-rehber-kapat>Randevu al</a><button class="btn cizgi kucuk" type="button" data-rehber-kapat>Kapat</button></div>
</div>`;
}

const S = {kat: C.kategoriler[0].k, hizmet: '', uzman: 'farketmez', gun: '', saat: '', bitti: null};
function siteUst(){
  const d = veri(), b = bugunK(), {ac, kp} = aralik(d), sim = simdiDk();
  const el = $('acikDurum');
  if (kapaliGun(b)) { el.className = 'kapali'; el.textContent = 'Bugün kapalı'; }
  else if (sim < ac) { el.className = 'kapali'; el.textContent = 'Açılış ' + saatNokta(d.ayar.acilis); }
  else if (sim >= kp) { el.className = 'kapali'; el.textContent = 'Şu an kapalı'; }
  else { el.className = 'acik'; el.textContent = 'Şu an açık, kapanış ' + saatNokta(d.ayar.kapanis); }
  document.querySelectorAll('.hSaat').forEach(s => { s.textContent = saatMetin(d); });
  const x = ilkBoslar(d, C.populer, 6), ph = hizmetBul(d, C.populer);
  $('hBos').innerHTML = x && ph ? `<b>${gunGoreli(x.gun)} ${esc(kucuk(ph.ad))} için boş saatler</b><div class="cipler">${x.l.map(s => `<button class="cip" type="button" data-hb="${x.gun}|${s.s}">${s.s}</button>`).join('')}</div>` : '';
}
function siteHizmetler(){
  const d = veri(), k = C.kategoriler.find(x => x.k === S.kat);
  $('katFoto').src = IMG(k.foto); $('katFoto').alt = k.ad;
  $('katlar').innerHTML = C.kategoriler.map(x => `<button class="kat${x.k === S.kat ? ' sec' : ''}" data-k="${x.k}" type="button">${esc(x.ad)}</button>`).join('');
  $('hizListe').innerHTML = d.hizmetler.filter(h => h.kat === S.kat).map(h =>
    `<div class="satir"><div><div class="ad">${esc(h.ad)}</div><div class="sure">${h.dk} dakika</div></div><div class="fiyat">${tl(h.fiyat)}</div><button class="btn cizgi kucuk" data-sec="${h.id}" type="button">Randevu al</button></div>`).join('');
}
function siteEkip(){
  const d = veri();
  $('ekipListe').innerHTML = C.uzmanlar.map((u, i) => { const b = ilkBosUzman(d, u.ad);
    return `<div class="ekip-s"><span class="no">${pad(i + 1)}</span><div><h3>${esc(u.ad)}</h3><p>${esc(u.is)}</p></div><div class="ek-bos">${b ? 'İlk boş saat<b>' + gunGoreli(b.gun) + ' ' + b.saat + '</b>' : 'Bu hafta dolu'}</div><button class="btn cizgi kucuk" type="button" data-ekip="${esc(u.ad)}">Randevu al</button></div>`; }).join('');
}
function siteRandevu(){
  const d = veri(), sel = $('rHizmet');
  sel.innerHTML = '<option value="">Hizmet seçin</option>' + C.kategoriler.map(k => `<optgroup label="${esc(k.ad)}">` +
    d.hizmetler.filter(h => h.kat === k.k).map(h => `<option value="${h.id}"${h.id === S.hizmet ? ' selected' : ''}>${esc(h.ad)} · ${h.dk} dk · ${tl(h.fiyat)}</option>`).join('') + '</optgroup>').join('');
  const h = hizmetBul(d, S.hizmet);
  const uz = h ? C.uzmanlar.filter(u => u.kat.includes(h.kat)) : [];
  if (h && S.uzman !== 'farketmez' && !uz.some(u => u.ad === S.uzman)) S.uzman = 'farketmez';
  $('rUzman').innerHTML = h ? [{ad: 'farketmez', is: 'İlk boş ' + Z.uzmanKucuk}].concat(uz).map(u =>
    `<button class="cip${S.uzman === u.ad ? ' sec' : ''}" data-u="${esc(u.ad)}" type="button">${u.ad === 'farketmez' ? 'Fark etmez' : esc(u.ad)}<small>${esc(u.is)}</small></button>`).join('')
    : `<span class="bos">${S.uzman !== 'farketmez' ? esc(S.uzman) + ' seçildi, şimdi hizmet seçin.' : 'Önce hizmet seçin.'}</span>`;
  const gunler = acikGunler(7);
  if (!S.gun || !gunler.includes(S.gun)) S.gun = gunler[0];
  $('rGun').innerHTML = gunler.map(g => `<button class="cip${S.gun === g ? ' sec' : ''}" data-g="${g}" type="button">${g === bugunK() ? 'Bugün' : gunEtiket(g).split(' ')[0]}<small>${gunEtiket(g).split(' ').slice(1).join(' ')}</small></button>`).join('');
  const sl = h ? saatler(d, S.gun, S.hizmet, S.uzman) : [];
  if (S.saat && !sl.some(x => x.s === S.saat && x.u)) S.saat = '';
  $('rSaat').innerHTML = !h ? '<span class="bos">Önce hizmet seçin.</span>' :
    (sl.some(x => x.u) ? sl.map(x => `<button class="cip${S.saat === x.s ? ' sec' : ''}" data-s="${x.s}" type="button"${x.u ? '' : ' disabled'}>${x.s}</button>`).join('') : '<span class="bos">Bu gün için boş saat kalmadı, başka bir gün seçin.</span>');
  siteOzet();
}
function siteOzet(){
  const d = veri(), h = hizmetBul(d, S.hizmet), o = $('rOzet');
  if (S.bitti) {
    const r = d.randevular.find(x => x.id === S.bitti) || null;
    if (r) {
      o.innerHTML = `<div class="tamam"><b>${r.durum === 'onay' ? 'Randevunuz onaylandı' : 'Randevunuz ' + esc(Z.isletmeye) + ' iletildi'}</b>${gunUzun(r.gun)} saat ${r.saat}<br>${esc(hizmetAd(d, r))} · ${esc(r.uzman)}<br>${r.durum === 'onay' ? 'Sizi bekliyoruz.' : esc(Z.isletme) + ' onaylayınca kesinleşir.'}
        <div class="btns"><a class="btn kucuk" href="#panel" data-panelgor="${r.id}">${esc(Z.panelde)} gör</a><button class="btn cizgi kucuk" id="rIcs" type="button">Takvime ekle</button><button class="btn cizgi kucuk" id="rYeni" type="button">Yeni randevu</button></div></div>`;
      return;
    }
    S.bitti = null;
  }
  const u = h && S.saat ? bosUzman(d, S.gun, S.saat, S.hizmet, S.uzman) : null;
  o.innerHTML = `<h3>Randevu özeti</h3><dl><dt>Hizmet</dt><dd>${h ? esc(h.ad) : '-'}</dd><dt>${esc(Z.uzman)}</dt><dd>${esc(u || (S.uzman === 'farketmez' ? 'Fark etmez' : S.uzman))}</dd><dt>Gün</dt><dd>${S.gun ? gunUzun(S.gun) : '-'}</dd><dt>Saat</dt><dd>${S.saat || '-'}</dd><dt>Süre</dt><dd>${h ? h.dk + ' dakika' : '-'}</dd></dl>
    <div class="top"><span>Ücret</span><span>${h ? tl(h.fiyat) : '-'}</span></div>
    <button class="btn" id="rGonder" type="button">Randevuyu gönder</button><div class="hata" id="rHata"></div>
    <p class="not">Ödeme ${esc(Z.isletmede)} yapılır. Gelemeyecekseniz uygulamadan ya da telefonla iptal edebilirsiniz.</p>`;
}
function siteHepsi(){ siteUst(); siteHizmetler(); siteEkip(); siteRandevu(); }
function rehberGoster(){
  let kapali = false; try { kapali = localStorage.getItem(KEY + '-rehber') === '1'; } catch (e) { kapali = false; }
  const r = $('rehber'), site = !$('v-site').hidden;
  r.hidden = kapali || !site || S.bitti !== null;
  $('waf').hidden = !r.hidden;
}
function rehberKapat(){ try { localStorage.setItem(KEY + '-rehber', '1'); } catch (e) { /* yalnız bu açılışta kapanır */ } $('rehber').hidden = true; $('waf').hidden = false; }
function siteKur(){
  $('menuBtn').onclick = () => { const n = $('nav'); n.classList.toggle('ac'); $('menuBtn').setAttribute('aria-expanded', n.classList.contains('ac')); };
  $('nav').addEventListener('click', e => { if (e.target.tagName === 'A') $('nav').classList.remove('ac'); });
  $('v-site').addEventListener('click', e => {
    const k = e.target.closest('[data-k]'); if (k) { S.kat = k.dataset.k; siteHizmetler(); return; }
    const sc = e.target.closest('[data-sec]'); if (sc) { S.hizmet = sc.dataset.sec; S.bitti = null; siteRandevu(); $('randevu').scrollIntoView({behavior: 'smooth'}); return; }
    const hb = e.target.closest('[data-hb]'); if (hb) { const [g, s] = hb.dataset.hb.split('|'); Object.assign(S, {hizmet: C.populer, uzman: 'farketmez', gun: g, saat: s, bitti: null}); siteRandevu(); $('randevu').scrollIntoView({behavior: 'smooth'}); return; }
    const ek = e.target.closest('[data-ekip]'); if (ek) { S.uzman = ek.dataset.ekip; S.bitti = null; const h = hizmetBul(veri(), S.hizmet), u = C.uzmanlar.find(x => x.ad === S.uzman); if (h && !u.kat.includes(h.kat)) S.hizmet = ''; siteRandevu(); $('randevu').scrollIntoView({behavior: 'smooth'}); return; }
    const u = e.target.closest('#rUzman [data-u]'); if (u) { S.uzman = u.dataset.u; siteRandevu(); return; }
    const g = e.target.closest('#rGun [data-g]'); if (g) { S.gun = g.dataset.g; siteRandevu(); return; }
    const s = e.target.closest('#rSaat [data-s]'); if (s && !s.disabled) { S.saat = s.dataset.s; siteRandevu(); return; }
    if (e.target.id === 'rYeni') { S.bitti = null; S.saat = ''; siteRandevu(); return; }
    if (e.target.id === 'rIcs') { const d = veri(), r = d.randevular.find(x => x.id === S.bitti); if (r) icsIndir(d, r); return; }
    if (e.target.id === 'rGonder') {
      const sonuc = rezerve({hizmet: S.hizmet, uzman: S.uzman, gun: S.gun, saat: S.saat, ad: $('rAd').value, tel: $('rTel').value, kaynak: 'Site'});
      if (sonuc.hata) { if (/doldu/.test(sonuc.hata)) { S.saat = ''; siteRandevu(); } $('rHata').textContent = sonuc.hata; return; }
      S.bitti = sonuc.r.id; S.saat = ''; P.yeni = sonuc.r.id; P.gun = sonuc.r.gun; P.sekme = 'takvim'; P.kaydir = true;
      siteHepsi(); rehberGoster(); toast('Randevunuz ' + Z.isletmeye + ' iletildi');
    }
  });
  $('rHizmet').onchange = e => { S.hizmet = e.target.value; S.bitti = null; siteRandevu(); };
  const p = veri().profil; if (p) { $('rAd').value = p.ad; $('rTel').value = p.tel; }
  siteHepsi();
}

/* ---------------- işletme paneli ---------------- */
const P = {sekme: 'takvim', gun: '', yeni: null, kaydir: true, donem: 'bugun', mFiltre: 'hepsi', mAra: ''};
const SEKMELER = [['takvim', 'Takvim'], ['kasa', 'Kasa ve adisyon'], ['musteri', 'Müşteriler'], ['rapor', 'Raporlar'], ['ayar', 'Ayarlar']];
const sirala = (a, b) => (a.gun + a.saat).localeCompare(b.gun + b.saat);
function pRender(){
  const d = veri(), b = bugunK();
  const bekleyen = d.randevular.filter(r => r.durum === 'bekliyor' && r.gun >= b).length;
  $('pSekme').innerHTML = SEKMELER.map(([k, ad]) => `<button type="button" role="tab" aria-selected="${P.sekme === k}" class="${P.sekme === k ? 'sec' : ''}" data-sekme="${k}">${ad}${k === 'takvim' && bekleyen ? `<i>${bekleyen}</i>` : ''}</button>`).join('');
  $('pBaslik').textContent = SEKMELER.find(x => x[0] === P.sekme)[1];
  ({takvim: pTakvim, kasa: pKasa, musteri: pMusteri, rapor: pRapor, ayar: pAyar})[P.sekme](d);
}
const tile = (b, s) => `<div class="sayi"><b>${b}</b><span>${s}</span></div>`;
function pTakvim(d){
  const b = bugunK(), gunler = acikGunler(7);
  if (!P.gun || !gunler.includes(P.gun)) P.gun = gunler[0];
  const {ac, kp} = aralik(d), sim = simdiDk();
  const gunR = d.randevular.filter(r => r.gun === P.gun && r.kaynak !== 'Randevusuz');
  const aktif = gunR.filter(AKTIF);
  const kasa = d.randevular.filter(r => r.gun === P.gun && r.durum === 'tamam' && r.adisyon).reduce((t, r) => t + r.adisyon.toplam, 0);
  const bekleyen = d.randevular.filter(r => r.durum === 'bekliyor' && r.gun >= b).sort((x, y) => (y.benim - x.benim) || sirala(x, y));
  const kapaliDk = d.kapali.filter(x => x.gun === P.gun).reduce((t, x) => t + saat2dk(x.bit) - saat2dk(x.bas), 0);
  const kapasite = C.uzmanlar.length * (kp - ac) - kapaliDk;
  const doluluk = kapasite > 0 ? Math.round(aktif.reduce((t, r) => t + r.dk, 0) / kapasite * 100) : 0;
  const sh = innerWidth < 640 ? 36 : 40, satir = (kp - ac) / 30;
  const blok = r => {
    const bas = saat2dk(r.saat); if (bas < ac || bas >= kp) return '';
    const top = (bas - ac) / 30 * sh + 1, yuk = Math.min(r.dk, kp - bas) / 30 * sh - 3;
    return `<button class="t-blok d-${r.durum}${r.id === P.yeni ? ' yeni' : ''}" type="button" data-rid="${r.id}" style="top:${top}px;height:${yuk}px" aria-label="${r.saat} ${esc(r.ad)}, ${esc(hizmetAd(d, r))}, ${DURUM[r.durum]}"><b>${r.saat} ${esc(r.ad)}</b>${yuk > 30 ? `<span>${esc(hizmetAd(d, r))}</span>` : ''}${yuk > 52 ? `<span>${DURUM[r.durum]}${r.kaynak ? ' · ' + r.kaynak : ''}</span>` : ''}</button>`;
  };
  const kapali = x => { const bas = Math.max(saat2dk(x.bas), ac), bit = Math.min(saat2dk(x.bit), kp); if (bit <= bas) return ''; return `<button class="t-kapali" type="button" data-kid="${x.id}" style="top:${(bas - ac) / 30 * sh + 1}px;height:${(bit - bas) / 30 * sh - 3}px">${esc(x.neden)}</button>`; };
  const yarin = acikGunler(2).find(g => g > b) || gunEkle(b, 1);
  const hatSay = d.randevular.filter(r => r.gun === yarin && (r.durum === 'onay' || r.durum === 'bekliyor') && r.kaynak !== 'Randevusuz').length;
  $('pIc').innerHTML = `
    <div class="sayilar">${tile(aktif.length, gunGoreli(P.gun) + ' randevu')}${tile(bekleyen.length, 'Onay bekleyen')}${P.gun === b ? tile(tl(kasa), 'Bugün kasaya giren') : tile(tl(aktif.reduce((t, r) => t + r.fiyat, 0)), gunGoreli(P.gun) + ' beklenen ciro')}${tile('%' + doluluk, 'Doluluk')}</div>
    ${bekleyen.length ? `<div class="bekleyen"><b>${bekleyen.length} randevu onay bekliyor</b>${bekleyen.slice(0, 4).map(r => `<div class="bsatir${r.id === P.yeni ? ' yeni' : ''}"><div class="bil"><b>${gunGoreli(r.gun)} ${r.saat} · ${esc(r.ad)}${r.benim ? ' <span class="rozet">Sizin randevunuz</span>' : ''}</b><small>${esc(hizmetAd(d, r))} · ${esc(r.uzman)} · ${r.kaynak}</small></div><div class="bbtn"><button class="btn kucuk" type="button" data-onay="${r.id}">Onayla</button><button class="btn cizgi kucuk" type="button" data-red="${r.id}">Reddet</button></div></div>`).join('')}${bekleyen.length > 4 ? `<p class="bos" style="margin-top:6px">+${bekleyen.length - 4} randevu daha; takvimde kesik çizgili görünür.</p>` : ''}</div>` : ''}
    <div class="tbar">
      <div class="cipler">${gunler.map(g => `<button class="cip${P.gun === g ? ' sec' : ''}" type="button" data-pg="${g}">${g === b ? 'Bugün' : gunEtiket(g).split(' ')[0]}<small>${gunEtiket(g).split(' ').slice(1).join(' ')} · ${d.randevular.filter(r => r.gun === g && AKTIF(r) && r.kaynak !== 'Randevusuz').length}</small></button>`).join('')}</div>
      <div class="btns"><button class="btn kucuk" type="button" data-yeni>Randevu ekle</button><button class="btn cizgi kucuk" type="button" data-kapatac>Saat kapat</button><button class="btn cizgi kucuk" type="button" data-hatirlat>Yarının hatırlatmaları (${hatSay})</button></div>
    </div>
    <div class="takvim-kap" id="tKap"><div class="takvim" style="--sut:${C.uzmanlar.length};--sh:${sh}px">
      <div class="t-bas"><div style="border-left:0"></div>${C.uzmanlar.map(u => `<div>${esc(u.ad)}<small>${aktif.filter(r => r.uzman === u.ad).length} randevu</small></div>`).join('')}</div>
      <div class="t-govde" style="height:${satir * sh}px">
        <div class="t-saat">${Array.from({length: Math.ceil(satir / 2)}, (_, i) => ac + i * 60).map(m => `<span style="top:${(m - ac) / 30 * sh}px">${dk2saat(m)}</span>`).join('')}</div>
        ${C.uzmanlar.map(u => `<div class="t-sut" data-uz="${esc(u.ad)}">${gunR.filter(r => r.uzman === u.ad && (AKTIF(r) || r.durum === 'gelmedi')).map(blok).join('')}${d.kapali.filter(x => x.gun === P.gun && x.uzman === u.ad).map(kapali).join('')}</div>`).join('')}
        ${P.gun === b && sim >= ac && sim < kp ? `<div class="t-simdi" style="top:${(sim - ac) / 30 * sh}px"></div>` : ''}
      </div>
    </div></div>
    <div class="lejant"><span>Onaylı</span><span class="l-b">Onay bekliyor</span><span class="l-t">Ödendi</span><span class="l-g">Gelmedi</span><span class="l-k">Kapalı saat</span></div>
    <p class="bos" style="margin-top:8px">Boş bir saate dokunun: telefonla gelen randevuyu ekleyin ya da o saati kapatın. Randevuya dokununca onay, adisyon ve hatırlatma seçenekleri açılır.</p>`;
  if (P.kaydir) {
    P.kaydir = false;
    const kap = $('tKap'), hedef = P.yeni ? d.randevular.find(r => r.id === P.yeni) : null;
    const m = hedef && hedef.gun === P.gun ? saat2dk(hedef.saat) : (P.gun === b ? sim : ac);
    kap.scrollTop = Math.max(0, (m - ac) / 30 * sh - 90);
  }
  if (P.yeni) { const y = P.yeni; setTimeout(() => { if (P.yeni === y) P.yeni = null; }, 4500); }
}

/* ---- modallar ---- */
let M = null;
function modalAc(html){ $('mIc').innerHTML = html; $('modal').hidden = false; document.body.classList.add('kilit'); $('ipucu').hidden = true; }
function modalKapat(){ $('modal').hidden = true; document.body.classList.remove('kilit'); M = null; }
function mYeni(o){ M = Object.assign({tur: 'yeni', mod: 'randevu', hizmet: '', ad: '', tel: '', kaynak: 'Telefon', neden: 'Mola'}, o); M.saat = M.saat || ''; M.bas = M.bas || M.saat; mYeniCiz(); }
function mYeniOku(){
  const v = id => { const e = $(id); return e && !e.disabled && !(id === 'ySaat' && e.value === '') ? e.value : null; };
  [['yUz', 'uzman'], ['yGun', 'gun'], ['yHiz', 'hizmet'], ['ySaat', 'saat'], ['yAd', 'ad'], ['yTel', 'tel'], ['yKay', 'kaynak'], ['kBas', 'bas'], ['kBit', 'bit'], ['kNeden', 'neden']].forEach(([id, k]) => { const x = v(id); if (x !== null) M[k] = x; });
}
function mYeniCiz(){
  const d = veri(), u = C.uzmanlar.find(x => x.ad === M.uzman) || C.uzmanlar[0], {ac, kp} = aralik(d);
  M.uzman = u.ad;
  const gunler = acikGunler(7); if (!gunler.includes(M.gun)) M.gun = gunler[0];
  const hz = d.hizmetler.filter(h => u.kat.includes(h.kat));
  if (M.hizmet && !hz.some(h => h.id === M.hizmet)) M.hizmet = '';
  const ust = `<div class="ust">${esc(Z.panel)}</div><h3>${M.saat && M.mod === 'randevu' ? esc(u.ad) + ' · ' + M.saat : 'Yeni kayıt'}</h3>
    <div class="segment"><button type="button" data-mod="randevu" class="${M.mod === 'randevu' ? 'sec' : ''}">Randevu ekle</button><button type="button" data-mod="kapat" class="${M.mod === 'kapat' ? 'sec' : ''}">Saati kapat</button></div>
    <div class="form"><div class="iki"><label>${esc(Z.uzman)}<select id="yUz">${C.uzmanlar.map(x => `<option${x.ad === u.ad ? ' selected' : ''}>${esc(x.ad)}</option>`).join('')}</select></label><label>Gün<select id="yGun">${gunler.map(g => `<option value="${g}"${g === M.gun ? ' selected' : ''}>${gunGoreli(g)}${g === bugunK() || g === gunEkle(bugunK(), 1) ? ', ' + gunEtiket(g) : ''}</option>`).join('')}</select></label></div>`;
  if (M.mod === 'randevu') {
    const h = hizmetBul(d, M.hizmet);
    const sl = h ? saatler(d, M.gun, h.id, u.ad, true).filter(x => x.u) : [];
    if (h && M.saat && !sl.some(x => x.s === M.saat)) { M.uyari = M.saat + ' bu hizmet için uygun değil, boş saatlerden birini seçin.'; M.saat = ''; } else if (!h || M.saat) M.uyari = '';
    if (h && !M.saat && sl.length) M.saat = sl[0].s;
    const ml = [...new Set(d.randevular.filter(r => r.kaynak !== 'Randevusuz').map(r => r.ad))].sort((a, b) => a.localeCompare(b, 'tr'));
    modalAc(ust + `<label>Hizmet<select id="yHiz"><option value="">Hizmet seçin</option>${hz.map(x => `<option value="${x.id}"${x.id === M.hizmet ? ' selected' : ''}>${esc(x.ad)} · ${x.dk} dk · ${tl(x.fiyat)}</option>`).join('')}</select></label>
      <label>Saat<select id="ySaat"${h ? '' : ' disabled'}>${h ? (sl.length ? sl.map(x => `<option${x.s === M.saat ? ' selected' : ''}>${x.s}</option>`).join('') : '<option value="">Bu gün boş saat yok</option>') : '<option value="">Önce hizmet seçin</option>'}</select></label>
      ${M.uyari ? `<p class="bos" style="color:var(--bek)">${esc(M.uyari)}</p>` : ''}
      <div class="iki"><label>Müşteri adı<input id="yAd" list="yMusteri" autocomplete="off" value="${esc(M.ad)}" placeholder="Ad soyad"></label><label>Telefon (isteğe bağlı)<input id="yTel" inputmode="tel" value="${esc(M.tel)}" placeholder="Kayıtlı müşteride gerekmez"></label></div>
      <datalist id="yMusteri">${ml.map(a => `<option value="${esc(a)}">`).join('')}</datalist>
      <label>Randevu nereden geldi<select id="yKay">${PANEL_KAYNAK.map(k => `<option${k === M.kaynak ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
      <button class="btn" type="button" data-ykaydet>Randevuyu ekle</button><div class="hata" id="yHata"></div></div>`);
  } else {
    const ops = []; for (let m = ac; m <= kp; m += 30) ops.push(dk2saat(m));
    if (!ops.includes(M.bas)) M.bas = ops[0];
    if (!M.bit || saat2dk(M.bit) <= saat2dk(M.bas)) M.bit = dk2saat(Math.min(saat2dk(M.bas) + 60, kp));
    modalAc(ust + `<div class="iki"><label>Başlangıç<select id="kBas">${ops.slice(0, -1).map(s => `<option${s === M.bas ? ' selected' : ''}>${s}</option>`).join('')}</select></label><label>Bitiş<select id="kBit">${ops.filter(s => saat2dk(s) > saat2dk(M.bas)).map(s => `<option${s === M.bit ? ' selected' : ''}>${s}</option>`).join('')}</select></label></div>
      <label>Neden<select id="kNeden">${['Mola', 'Öğle arası', 'İzin', 'Kişisel iş', 'Diğer'].map(x => `<option${x === M.neden ? ' selected' : ''}>${x}</option>`).join('')}</select></label>
      <p class="bos">Kapatılan saat sitede ve uygulamada dolu görünür, o saate randevu alınamaz.</p>
      <button class="btn" type="button" data-kkaydet>Saati kapat</button><div class="hata" id="yHata"></div></div>`);
  }
}
function musteriBul(d, ad){ const a = kucuk(ad.trim()); return d.randevular.find(r => r.kaynak !== 'Randevusuz' && kucuk(r.ad) === a) || null; }
function yeniKaydet(){
  mYeniOku();
  const d = veri(), h = hizmetBul(d, M.hizmet), hata = m => { $('yHata').textContent = m; };
  if (!h) return hata('Hizmet seçin.');
  if (!M.saat) return hata('Saat seçin.');
  if (M.ad.trim().length < 2) return hata('Müşteri adını yazın.');
  let tel = '';
  if (M.tel.trim()) { const t = telTemiz(M.tel); if (!t) return hata('Telefonu 05xx xxx xx xx biçiminde yazın ya da boş bırakın.'); tel = telGoster(t); }
  else { const k = musteriBul(d, M.ad); if (k) tel = k.tel; }
  const bas = saat2dk(M.saat);
  if (!uygunMu(d, M.gun, bas, h.dk, true) || mesgul(d, M.gun, M.uzman, bas, bas + h.dk)) return hata('Bu saat dolu, başka bir saat seçin.');
  const r = {id: 'p' + Date.now(), gun: M.gun, saat: M.saat, dk: h.dk, hizmet: h.id, fiyat: h.fiyat, uzman: M.uzman, ad: M.ad.trim(), tel, durum: 'onay', kaynak: M.kaynak, benim: false};
  d.randevular.push(r); yaz(d); P.yeni = r.id; P.gun = r.gun; P.kaydir = true; modalKapat(); pRender();
  toast(gunGoreli(r.gun) + ' ' + r.saat + ' ' + r.ad + ' için randevu eklendi');
}
function kapatKaydet(){
  mYeniOku();
  const d = veri(), bas = saat2dk(M.bas), bit = saat2dk(M.bit);
  if (!(bit > bas)) { $('yHata').textContent = 'Bitiş saati başlangıçtan sonra olmalı.'; return; }
  const cak = d.randevular.filter(r => r.gun === M.gun && r.uzman === M.uzman && (r.durum === 'onay' || r.durum === 'bekliyor') && r.kaynak !== 'Randevusuz' && cakisir(r, bas, bit));
  if (cak.length) { $('yHata').textContent = 'Bu aralıkta ' + cak.map(r => r.saat + ' ' + r.ad).join(', ') + ' randevusu var. Önce o randevuyu iptal edin ya da başka saat seçin.'; return; }
  const k = {id: 'k' + Date.now(), gun: M.gun, uzman: M.uzman, bas: M.bas, bit: M.bit, neden: M.neden};
  d.kapali.push(k); yaz(d);
  P.gun = k.gun; modalKapat(); pRender(); siteHepsi(); toast(k.uzman + ' için ' + k.bas + ' - ' + k.bit + ' kapatıldı');
}
function hatirlatmaMetni(d, r){ return `Merhaba ${ilkAd(r.ad)}, ${gunMesaj(r.gun)} saat ${r.saat} için ${C.ad} randevunuzu hatırlatırız (${hizmetAd(d, r)}, ${r.uzman}). Gelemeyecekseniz bu mesaja yazmanız yeterli.`; }
const waNot = 'Gerçek panelde bu düğme müşterinin WhatsApp sohbetini mesaj yazılı olarak açar, siz yalnızca gönder\'e basarsınız.';
function mDetay(id){
  const d = veri(), r = d.randevular.find(x => x.id === id); if (!r) return;
  M = {tur: 'detay', id};
  const bit = dk2saat(saat2dk(r.saat) + r.dk), b = bugunK(), basladi = r.gun < b || (r.gun === b && saat2dk(r.saat) <= simdiDk() + 15);
  let is = '';
  if (r.durum === 'bekliyor') is = `<div class="btns"><button class="btn" type="button" data-onay="${r.id}">Onayla</button><button class="btn cizgi" type="button" data-red="${r.id}">Reddet</button></div>`;
  else if (r.durum === 'onay') is = `<div class="btns">${basladi ? `<button class="btn" type="button" data-adisyon="${r.id}">Geldi, adisyonu aç</button><button class="btn cizgi" type="button" data-gelmedi="${r.id}">Gelmedi</button>` : ''}<button class="btn cizgi" type="button" data-iptal="${r.id}">İptal et</button></div>
    <div class="adim" style="margin:18px 0 0"><b>Hatırlatma mesajı</b><div class="mesaj">${esc(hatirlatmaMetni(d, r))}</div><div class="btns" style="margin-top:8px"><button class="btn wa kucuk" type="button" data-kopya="${esc(hatirlatmaMetni(d, r))}">Mesajı kopyala</button></div><p class="bos" style="margin-top:8px">${esc(waNot)}</p></div>`;
  else if (r.durum === 'tamam' && r.adisyon) is = `<div class="adim" style="margin:14px 0 0"><b>Adisyon</b>${r.adisyon.kalemler.map(k => `<div class="kalem" style="grid-template-columns:1fr auto"><span>${esc(k.ad)}</span><span>${tl(k.fiyat)}</span></div>`).join('')}${r.adisyon.indirim ? `<div class="kalem" style="grid-template-columns:1fr auto"><span>İndirim</span><span>-${tl(r.adisyon.indirim)}</span></div>` : ''}<div class="top" style="margin-top:8px"><span>${r.adisyon.odeme} ile ödendi</span><span>${tl(r.adisyon.toplam)}</span></div></div>`;
  modalAc(`<div class="ust">${gunUzun(r.gun)}</div><h3>${r.saat} - ${bit} · ${esc(r.ad)}</h3>
    <dl class="dl"><dt>Hizmet</dt><dd>${esc(hizmetAd(d, r))}</dd><dt>${esc(Z.uzman)}</dt><dd>${esc(r.uzman)}</dd><dt>Süre</dt><dd>${r.dk} dakika</dd><dt>Ücret</dt><dd>${tl(r.fiyat)}</dd><dt>Telefon</dt><dd>${r.tel ? esc(telYaz(r)) : '-'}</dd><dt>Nereden geldi</dt><dd>${esc(r.kaynak)}</dd><dt>Durum</dt><dd><span class="etiket ${r.durum}">${DURUM[r.durum]}</span></dd></dl>
    ${is}${r.kaynak === 'Randevusuz' ? '' : `<p style="margin-top:16px"><button class="link" type="button" data-mkart="${esc(musteriAnahtar(r))}">Müşterinin geçmişini gör</button></p>`}`);
}
function mKapali(id){
  const d = veri(), x = d.kapali.find(k => k.id === id); if (!x) return;
  M = {tur: 'kapali', id};
  modalAc(`<div class="ust">${gunUzun(x.gun)}</div><h3>${x.bas} - ${x.bit} kapalı</h3><p class="bos">${esc(x.uzman)} · ${esc(x.neden)}. Bu aralık sitede ve uygulamada dolu görünüyor.</p><div class="btns"><button class="btn" type="button" data-kac="${x.id}">Saati yeniden aç</button></div>`);
}
function mHatirlat(){
  const d = veri(), b = bugunK(), yarin = acikGunler(2).find(g => g > b) || gunEkle(b, 1);
  const l = d.randevular.filter(r => r.gun === yarin && (r.durum === 'onay' || r.durum === 'bekliyor') && r.kaynak !== 'Randevusuz').sort(sirala);
  M = {tur: 'hatirlat'};
  modalAc(`<div class="ust">${gunUzun(yarin)}</div><h3>Hatırlatma mesajları</h3><p class="bos">${l.length} randevu var. Her müşteriye hazır mesaj; tek dokunuşla WhatsApp'ta açılır. ${esc(waNot)}</p>
    ${l.map(r => `<div class="adim" style="margin:14px 0 0"><b>${r.saat} · ${esc(r.ad)} · ${esc(r.uzman)}</b><div class="mesaj">${esc(hatirlatmaMetni(d, r))}</div><button class="btn wa kucuk" type="button" data-kopya="${esc(hatirlatmaMetni(d, r))}">Mesajı kopyala</button></div>`).join('') || '<p class="bos">Bu gün için randevu yok.</p>'}`);
}
function mAdisyon(id){
  const d = veri(), r = id ? d.randevular.find(x => x.id === id) : null;
  M = {tur: 'adisyon', id: r ? r.id : null, kalemler: r ? [{ad: hizmetAd(d, r), fiyat: r.fiyat, hid: r.hizmet}] : [], indirim: 0, odeme: 'Kart', uzman: r ? r.uzman : C.uzmanlar[0].ad, ad: r ? r.ad : ''};
  mAdisyonCiz();
}
const adisyonToplam = () => Math.max(0, M.kalemler.reduce((t, k) => t + (Number(k.fiyat) || 0), 0) - (Number(M.indirim) || 0));
function mAdisyonCiz(){
  const d = veri();
  modalAc(`<div class="ust">Adisyon</div><h3>${M.id ? esc(M.ad) : 'Randevusuz satış'}</h3>
    ${M.id ? `<p class="bos">${esc(Z.uzman)}: ${esc(M.uzman)}</p>` : `<div class="iki" style="margin-bottom:10px"><label>Müşteri adı (isteğe bağlı)<input id="aAd" value="${esc(M.ad)}" placeholder="Randevusuz müşteri"></label><label>${esc(Z.uzman)}<select id="aUz">${C.uzmanlar.map(u => `<option${u.ad === M.uzman ? ' selected' : ''}>${esc(u.ad)}</option>`).join('')}</select></label></div>`}
    <div>${M.kalemler.map((k, i) => `<div class="kalem"><span>${esc(k.ad)}</span><input type="number" min="0" step="10" inputmode="numeric" data-kf="${i}" value="${k.fiyat}" aria-label="${esc(k.ad)} tutarı"><button class="btn cizgi kucuk" type="button" data-ksil="${i}">Sil</button></div>`).join('') || '<p class="bos">Henüz kalem yok, aşağıdan hizmet ya da ürün ekleyin.</p>'}</div>
    <div class="ekle"><select id="aEk" aria-label="Hizmet ya da ürün ekle"><option value="">Hizmet ya da ürün ekle</option><optgroup label="Hizmetler">${d.hizmetler.map(h => `<option value="h:${h.id}">${esc(h.ad)} · ${tl(h.fiyat)}</option>`).join('')}</optgroup><optgroup label="Ürün satışı">${C.urunler.map((u, i) => `<option value="u:${i}">${esc(u[0])} · ${tl(u[1])}</option>`).join('')}</optgroup></select><button class="btn cizgi kucuk" type="button" data-kekle>Ekle</button></div>
    <label style="max-width:200px">İndirim (TL)<input id="aInd" type="number" min="0" step="10" inputmode="numeric" value="${M.indirim}"></label>
    <div class="adim" style="margin:14px 0 6px"><b>Ödeme</b><div class="cipler">${ODEMELER.map(o => `<button class="cip${M.odeme === o ? ' sec' : ''}" type="button" data-od="${o}">${o}</button>`).join('')}</div></div>
    <div class="top" style="margin-top:12px"><span>Toplam</span><span id="aTop">${tl(adisyonToplam())}</span></div>
    <button class="btn" type="button" data-akapat style="width:100%">Ödemeyi al, adisyonu kapat</button><div class="hata" id="aHata"></div>`);
}
function adisyonKapat(){
  const d = veri();
  if (!M.kalemler.length) { $('aHata').textContent = 'En az bir hizmet ya da ürün ekleyin.'; return; }
  if (M.kalemler.some(k => !(Number(k.fiyat) >= 0) || k.fiyat === '')) { $('aHata').textContent = 'Tutar alanları boş ya da eksi olamaz.'; return; }
  const ad = {kalemler: M.kalemler.map(k => ({ad: k.ad, fiyat: Math.round(Number(k.fiyat)), hid: k.hid})), indirim: Math.round(Number(M.indirim) || 0), odeme: M.odeme, toplam: adisyonToplam()};
  if (M.id) {
    const r = d.randevular.find(x => x.id === M.id); if (!r) { modalKapat(); return; }
    r.durum = 'tamam'; r.adisyon = ad; yaz(d); modalKapat(); pRender(); toast(r.ad + ': ' + tl(ad.toplam) + ' ' + ad.odeme + ' ile kasaya işlendi');
  } else {
    const ilkH = ad.kalemler.find(k => k.hid), m = Math.round(simdiDk() / 5) * 5;
    const r = {id: 'w' + Date.now(), gun: bugunK(), saat: dk2saat(Math.min(m, 23 * 60 + 55)), dk: ilkH ? (hizmetBul(d, ilkH.hid) || {dk: 30}).dk : 15, hizmet: ilkH ? ilkH.hid : '', fiyat: ad.toplam, uzman: M.uzman, ad: (M.ad || '').trim() || 'Randevusuz müşteri', tel: '', durum: 'tamam', kaynak: 'Randevusuz', benim: false, adisyon: ad};
    d.randevular.push(r); yaz(d); P.donem = 'bugun'; modalKapat(); pRender(); toast(tl(ad.toplam) + ' kasaya işlendi');
  }
}

/* ---- kasa ---- */
function donem(kod){
  const b = bugunK(), t = gunTarih(b);
  if (kod === 'bugun') return [b, b];
  if (kod === 'dun') { const k = gunEkle(b, -1); return [k, k]; }
  if (kod === 'hafta') return [gunEkle(b, -((t.getDay() + 6) % 7)), b];
  if (kod === 'ay') return [b.slice(0, 8) + '01', b];
  return [gunEkle(b, -29), b];
}
const DONEMLER = [['bugun', 'Bugün'], ['dun', 'Dün'], ['hafta', 'Bu hafta'], ['ay', 'Bu ay'], ['otuz', 'Son 30 gün']];
function adisyonlar(d, kod){ const [a, z] = donem(kod); return d.randevular.filter(r => r.durum === 'tamam' && r.adisyon && r.gun >= a && r.gun <= z); }
function pKasa(d){
  const l = adisyonlar(d, P.donem).sort((a, b) => sirala(b, a));
  const top = l.reduce((t, r) => t + r.adisyon.toplam, 0), od = o => l.filter(r => r.adisyon.odeme === o).reduce((t, r) => t + r.adisyon.toplam, 0);
  const urun = l.reduce((t, r) => t + r.adisyon.kalemler.filter(k => !k.hid).reduce((s, k) => s + k.fiyat, 0), 0);
  const uz = C.uzmanlar.map(u => { const x = l.filter(r => r.uzman === u.ad), c = x.reduce((t, r) => t + r.adisyon.toplam, 0), p = Number(d.ayar.prim[u.ad]) || 0; return {ad: u.ad, n: x.length, c, p, pt: c * p / 100}; });
  const bosMetin = P.donem === 'bugun' && kapaliGun(bugunK()) ? 'Bugün ' + Z.isletmeKucuk + ' kapalı.' : 'Bu dönemde kapanan adisyon yok. Takvimde bir randevuya dokunup "Geldi, adisyonu aç" deyin ya da randevusuz satış girin.';
  $('pIc').innerHTML = `
    <div class="tbar"><div class="cipler">${DONEMLER.map(([k, ad]) => `<button class="cip${P.donem === k ? ' sec' : ''}" type="button" data-donem="${k}">${ad}</button>`).join('')}</div>
      <div class="btns"><button class="btn kucuk" type="button" data-satis>Randevusuz satış</button><button class="btn cizgi kucuk" type="button" data-csv>Excel'e aktar</button></div></div>
    <div class="sayilar">${tile(tl(top), 'Toplam ciro · ' + l.length + ' adisyon')}${tile(tl(od('Nakit')), 'Nakit')}${tile(tl(od('Kart')), 'Kart')}${tile(tl(od('Havale')), 'Havale')}</div>
    <p class="bos" style="margin:-6px 0 14px">Ortalama adisyon ${tl(l.length ? top / l.length : 0)} · ürün satışı ${tl(urun)}</p>
    <div class="liste" style="margin-bottom:16px"><table class="tablo"><thead><tr><th>${esc(Z.uzman)}</th><th class="s">İşlem</th><th class="s">Ciro</th><th class="s">Prim</th></tr></thead>
      <tbody>${uz.map(x => `<tr><td><b>${esc(x.ad)}</b></td><td class="s">${x.n}</td><td class="s">${tl(x.c)}</td><td class="s">${tl(x.pt)}<small>%${x.p}</small></td></tr>`).join('')}</tbody>
      <tfoot><tr><td>Toplam</td><td class="s">${l.length}</td><td class="s">${tl(top)}</td><td class="s">${tl(uz.reduce((t, x) => t + x.pt, 0))}</td></tr></tfoot></table></div>
    <div class="liste"><table class="tablo"><thead><tr><th>Zaman</th><th>Müşteri</th><th>Kalemler</th><th class="s">Tutar</th></tr></thead><tbody>
      ${l.slice(0, 40).map(r => `<tr class="tik" data-rid="${r.id}"><td>${P.donem === 'bugun' || P.donem === 'dun' ? '' : gunEtiket(r.gun) + ' '}${r.saat}</td><td><b>${esc(r.ad)}</b><small>${esc(r.uzman)}${r.kaynak === 'Randevusuz' ? ' · randevusuz' : ''}</small></td><td>${r.adisyon.kalemler.map(k => esc(k.ad)).join(', ')}${r.adisyon.indirim ? `<small>${tl(r.adisyon.indirim)} indirim</small>` : ''}</td><td class="s"><b>${tl(r.adisyon.toplam)}</b><small>${r.adisyon.odeme}</small></td></tr>`).join('') || `<tr><td colspan="4" class="bos">${bosMetin}</td></tr>`}
    </tbody></table></div>${l.length > 40 ? `<p class="bos" style="margin-top:8px">Son 40 adisyon gösteriliyor; tamamı Excel dosyasında.</p>` : ''}`;
}
function csvIndir(d){
  const l = adisyonlar(d, P.donem).sort(sirala), q = s => '"' + String(s).replace(/"/g, '""') + '"';
  const sat = [['Tarih', 'Saat', 'Müşteri', Z.uzman, 'Kalemler', 'İndirim', 'Ödeme', 'Tutar']].concat(l.map(r => [r.gun.split('-').reverse().join('.'), r.saat, r.ad, r.uzman, r.adisyon.kalemler.map(k => k.ad + ' ' + k.fiyat).join(' + '), r.adisyon.indirim, r.adisyon.odeme, r.adisyon.toplam]));
  indir('kasa-' + DONEMLER.find(x => x[0] === P.donem)[0] + '-' + bugunK() + '.csv', '﻿' + sat.map(s => s.map(q).join(';')).join('\r\n'), 'text/csv;charset=utf-8');
  toast(l.length + ' adisyon Excel dosyasına aktarıldı');
}

/* ---- müşteriler ---- */
const musteriAnahtar = r => r.tel || ('ad:' + kucuk(r.ad));
function musteriler(d){
  const m = new Map(), b = bugunK();
  d.randevular.forEach(r => {
    if (r.kaynak === 'Randevusuz') return;
    const k = musteriAnahtar(r);
    let x = m.get(k); if (!x) { x = {k, ad: r.ad, tel: r.tel, benim: r.benim, ziyaret: 0, toplam: 0, son: '', sonraki: null, l: []}; m.set(k, x); }
    x.l.push(r);
    if (r.durum === 'tamam') { x.ziyaret++; x.toplam += r.adisyon ? r.adisyon.toplam : r.fiyat; if (r.gun > x.son) x.son = r.gun; }
    if ((r.durum === 'onay' || r.durum === 'bekliyor') && r.gun >= b && (!x.sonraki || sirala(r, x.sonraki) < 0)) x.sonraki = r;
  });
  return [...m.values()].map(x => Object.assign(x, {kayip: !!x.son && kacGunOnce(x.son) > 20 && !x.sonraki, sadik: x.ziyaret >= 4}));
}
function pMusteri(d){
  const t = musteriler(d), ara = kucuk(P.mAra.trim()), rakam = P.mAra.replace(/\D/g, '');
  const l = t.filter(x => (P.mFiltre === 'hepsi' || (P.mFiltre === 'sadik' && x.sadik) || (P.mFiltre === 'kayip' && x.kayip) || (P.mFiltre === 'yeni' && x.ziyaret <= 1))
    && (!ara || kucuk(x.ad).includes(ara) || (rakam.length >= 2 && x.tel.replace(/\D/g, '').endsWith(rakam))))
    .sort((a, b) => (b.son || '').localeCompare(a.son || '') || a.ad.localeCompare(b.ad, 'tr'));
  const F = [['hepsi', 'Tümü', t.length], ['sadik', 'Sadık müşteri', t.filter(x => x.sadik).length], ['kayip', 'Uzun süredir gelmeyen', t.filter(x => x.kayip).length], ['yeni', 'Yeni', t.filter(x => x.ziyaret <= 1).length]];
  $('pIc').innerHTML = `
    <div class="ara"><input id="mAra" type="search" placeholder="Ad ya da telefonun son rakamları" value="${esc(P.mAra)}" aria-label="Müşteri ara"><div class="cipler">${F.map(([k, ad, n]) => `<button class="cip${P.mFiltre === k ? ' sec' : ''}" type="button" data-mf="${k}">${ad}<small>${n} kişi</small></button>`).join('')}</div></div>
    ${P.mFiltre === 'kayip' && l.length ? `<div class="bekleyen" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:220px"><b>${l.length} müşteri 3 haftadan uzun süredir gelmedi</b><span class="bos">Hepsine tek seferde "sizi özledik" mesajı hazırlanır.</span></div><button class="btn kucuk" type="button" data-gerikazan>Mesajları hazırla</button></div>` : ''}
    <div class="liste"><table class="tablo"><thead><tr><th>Müşteri</th><th class="s">Ziyaret</th><th>Son ziyaret</th><th class="s">Toplam</th></tr></thead><tbody>
      ${l.slice(0, 60).map(x => `<tr class="tik" data-mkart="${esc(x.k)}"><td><b>${esc(x.ad)}</b>${x.sadik ? '<span class="rozet sadik">Sadık</span>' : ''}${x.kayip ? '<span class="rozet kayip">Gelmiyor</span>' : ''}<small>${esc(x.benim ? x.tel : telMaske(x.tel)) || 'Telefon yok'}${x.sonraki ? ' · sıradaki ' + gunGoreli(x.sonraki.gun) + ' ' + x.sonraki.saat : ''}</small></td><td class="s">${x.ziyaret}</td><td>${x.son ? (kacGunOnce(x.son) === 0 ? 'Bugün' : kacGunOnce(x.son) + ' gün önce') : '-'}</td><td class="s">${tl(x.toplam)}</td></tr>`).join('') || '<tr><td colspan="4" class="bos">Aramaya uyan müşteri yok.</td></tr>'}
    </tbody></table></div>${l.length > 60 ? `<p class="bos" style="margin-top:8px">İlk 60 müşteri gösteriliyor, aramayla daraltın.</p>` : ''}`;
}
const geriKazanMetni = x => `Merhaba ${ilkAd(x.ad)}, ${C.ad} olarak sizi bir süredir göremedik. Size uygun bir saat için buradan randevu alabilirsiniz: ${location.origin + location.pathname}`;
function mMusteri(k){
  const d = veri(), x = musteriler(d).find(m => m.k === k); if (!x) return;
  M = {tur: 'musteri', k};
  const say = (arr, f) => { const c = {}; arr.forEach(r => { const v = f(r); c[v] = (c[v] || 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]; };
  const tam = x.l.filter(r => r.durum === 'tamam'), sikH = tam.length ? say(tam, r => hizmetAd(d, r)) : null, sikU = tam.length ? say(tam, r => r.uzman) : null;
  const msj = x.kayip ? geriKazanMetni(x) : (x.sonraki ? hatirlatmaMetni(d, x.sonraki) : `Merhaba ${ilkAd(x.ad)}, ${C.ad} olarak yeni randevunuz için buradan saat seçebilirsiniz: ${location.origin + location.pathname}`);
  modalAc(`<div class="ust">Müşteri kartı</div><h3>${esc(x.ad)}</h3><p class="bos">${esc(x.benim ? x.tel : telMaske(x.tel)) || 'Telefon yok'}${x.sadik ? ' · Sadık müşteri' : ''}${x.kayip ? ' · ' + kacGunOnce(x.son) + ' gündür gelmedi' : ''}</p>
    <dl class="dl" style="margin-top:12px"><dt>Ziyaret</dt><dd>${x.ziyaret}</dd><dt>Toplam harcama</dt><dd>${tl(x.toplam)}</dd><dt>Ortalama</dt><dd>${tl(x.ziyaret ? x.toplam / x.ziyaret : 0)}</dd><dt>En sık hizmet</dt><dd>${sikH ? esc(sikH[0]) : '-'}</dd><dt>Tercih ettiği ${esc(Z.uzmanKucuk)}</dt><dd>${sikU ? esc(sikU[0]) : '-'}</dd><dt>Sıradaki randevu</dt><dd>${x.sonraki ? gunGoreli(x.sonraki.gun) + ' ' + x.sonraki.saat : '-'}</dd></dl>
    <label>Müşteri notu<textarea id="mNot" placeholder="Örneğin: ${esc(C.notOrnek)}">${esc(d.notlar[k] || '')}</textarea></label>
    <div class="btns" style="margin-top:8px"><button class="btn cizgi kucuk" type="button" data-notkaydet>Notu kaydet</button></div>
    <div class="adim" style="margin:18px 0 0"><b>WhatsApp mesajı</b><div class="mesaj">${esc(msj)}</div><button class="btn wa kucuk" type="button" data-kopya="${esc(msj)}">Mesajı kopyala</button></div>
    <div class="adim" style="margin:18px 0 0"><b>Geçmiş</b><div class="gecmis">${x.l.slice().sort((a, b) => sirala(b, a)).slice(0, 12).map(r => `<div><span>${gunEtiket(r.gun)}<small>${r.saat}</small></span><span>${esc(hizmetAd(d, r))}<small>${esc(r.uzman)} · ${DURUM[r.durum]}</small></span><b>${tl(r.adisyon ? r.adisyon.toplam : r.fiyat)}</b></div>`).join('')}</div></div>`);
}
function mGeriKazan(){
  const l = musteriler(veri()).filter(x => x.kayip).sort((a, b) => a.son.localeCompare(b.son));
  M = {tur: 'gerikazan'};
  modalAc(`<div class="ust">Müşteriler</div><h3>Sizi özledik mesajları</h3><p class="bos">${l.length} müşteri. ${esc(waNot)}</p>${l.map(x => `<div class="adim" style="margin:14px 0 0"><b>${esc(x.ad)} · ${kacGunOnce(x.son)} gün önce</b><div class="mesaj">${esc(geriKazanMetni(x))}</div><button class="btn wa kucuk" type="button" data-kopya="${esc(geriKazanMetni(x))}">Mesajı kopyala</button></div>`).join('')}`);
}

/* ---- raporlar ---- */
function ustSinir(v){ if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
const kisaTl = v => v >= 1000 ? (v / 1000).toLocaleString('tr-TR', {maximumFractionDigits: 1}) + ' bin' : String(Math.round(v));
function sutunGrafik(l, bicim){
  const ust = ustSinir(Math.max(...l.map(x => x.v), 0));
  return `<div class="grafik"><div class="g-alan">${[1, .5, 0].map(o => `<div class="g-cizgi${o === 0 ? ' g-taban' : ''}" style="bottom:${o * 100}%"><span>${bicim(ust * o)}</span></div>`).join('')}
    <div class="g-sutunlar">${l.map(x => `<div class="g-s" tabindex="0" data-ipucu="${esc(x.ip)}" aria-label="${esc(x.ip)}"><i style="height:${x.v / ust * 100}%"></i></div>`).join('')}</div></div>
    <div class="g-etiket">${l.map(x => `<span>${x.on ? `<em>${esc(x.on)} </em>` : ''}${esc(x.e)}</span>`).join('')}</div></div>`;
}
function yatayGrafik(l){
  const ust = Math.max(...l.map(x => x.v), 1);
  return `<div class="yatayb">${l.map(x => `<div class="ys" data-ipucu="${esc(x.ip)}"><span class="ye">${esc(x.e)}</span><span class="yi"><i style="width:${x.v / ust * 100}%"></i></span><span class="yd">${esc(x.m)}</span></div>`).join('')}</div>`;
}
function pRapor(d){
  const b = bugunK(), bas = gunEkle(b, -29);
  const l = d.randevular.filter(r => r.gun >= bas && r.gun <= b);
  const tam = l.filter(r => r.durum === 'tamam' && r.adisyon), randevulu = l.filter(r => r.kaynak !== 'Randevusuz');
  const ciro = tam.reduce((t, r) => t + r.adisyon.toplam, 0);
  const online = randevulu.filter(r => ['Site', 'Uygulama', 'Instagram'].includes(r.kaynak)).length;
  const gelmedi = l.filter(r => r.durum === 'gelmedi').length, kapanan = gelmedi + l.filter(r => r.durum === 'tamam').length;
  const gunler = []; for (let i = 13; i >= 0; i--) { const k = gunEkle(b, -i); if (!kapaliGun(k)) gunler.push(k); }
  const gunCiro = gunler.map(k => { const v = tam.filter(r => r.gun === k).reduce((t, r) => t + r.adisyon.toplam, 0); return {on: k === b ? '' : GUNLER[gunTarih(k).getDay()], e: k === b ? 'Bugün' : String(gunTarih(k).getDate()), v, ip: gunUzun(k) + ': ' + tl(v) + (k === b ? ' (gün sürüyor)' : '')}; });
  const hs = {}; tam.forEach(r => { const a = hizmetAd(d, r); hs[a] = (hs[a] || 0) + 1; });
  const topH = Object.entries(hs).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const ks = {}; randevulu.forEach(r => { ks[r.kaynak] = (ks[r.kaynak] || 0) + 1; });
  const kl = Object.entries(ks).sort((a, b) => b[1] - a[1]);
  const {ac, kp} = aralik(d), saatS = []; for (let m = ac; m < kp; m += 60) saatS.push(m);
  const yog = saatS.map(m => { const v = randevulu.filter(r => AKTIF(r) || r.durum === 'gelmedi').filter(r => { const s = saat2dk(r.saat); return s >= m && s < m + 60; }).length; return {e: dk2saat(m).slice(0, 2), v, ip: dk2saat(m) + ' - ' + dk2saat(m + 60) + ': ' + v + ' randevu başladı'}; });
  const enYog = yog.reduce((a, x) => x.v > a.v ? x : a, yog[0] || {v: 0, e: '-'});
  $('pIc').innerHTML = `
    <p class="bos" style="margin:-4px 0 14px">Son 30 gün (${gunEtiket(bas)} - bugün). Rakamlar kasadaki adisyonlardan ve takvimdeki randevulardan kendiliğinden hesaplanır.</p>
    <div class="sayilar">${tile(tl(ciro), 'Ciro · ' + tam.length + ' adisyon')}${tile(randevulu.length, 'Randevu')}${tile('%' + Math.round(randevulu.length ? online / randevulu.length * 100 : 0), 'Online gelen (site, uygulama, Instagram)')}${tile('%' + Math.round(kapanan ? gelmedi / kapanan * 100 : 0), 'Gelmeyen müşteri')}</div>
    <div class="kutu"><h3>Günlük ciro</h3><p class="bos">Son 14 günün açık günleri; sütunun üstüne gelince tutar görünür.</p>${sutunGrafik(gunCiro, kisaTl)}</div>
    <div class="parca">
      <div class="kutu"><h3>En çok tercih edilen hizmetler</h3><p class="bos">Tamamlanan işlem sayısı</p>${yatayGrafik(topH.map(([a, n]) => ({e: a, v: n, m: n + ' kez', ip: a + ': ' + n + ' kez, ' + Math.round(n / Math.max(tam.length, 1) * 100) + '%'})))}</div>
      <div class="kutu"><h3>Randevular nereden geliyor</h3><p class="bos">Instagram: profildeki randevu bağlantısından gelenler</p>${yatayGrafik(kl.map(([a, n]) => ({e: a, v: n, m: '%' + Math.round(n / Math.max(randevulu.length, 1) * 100), ip: a + ': ' + n + ' randevu'})))}</div>
    </div>
    <div class="kutu" style="margin-top:16px"><h3>Yoğun saatler</h3><p class="bos">Randevuların başladığı saat. En yoğun aralık ${enYog.e}:00 - ${pad(Number(enYog.e) + 1)}:00; boş kalan saatlere kampanya koyabilirsiniz.</p>${sutunGrafik(yog, v => String(Math.round(v)))}</div>`;
}

/* ---- ayarlar ---- */
function pAyar(d){
  const sOps = (bas, bit, sec) => { const o = []; for (let m = bas; m <= bit; m += 30) { const s = dk2saat(m); o.push(`<option${s === sec ? ' selected' : ''}>${s}</option>`); } return o.join(''); };
  const sureler = [15, 20, 30, 40, 45, 50, 60, 75, 90, 105, 120, 150, 180, 240];
  $('pIc').innerHTML = `<div class="parca" style="margin-top:0">
    <div class="kutu"><h3>Randevu kuralları</h3>
      <label class="anahtar" style="margin:10px 0 4px"><input type="checkbox" id="sOto"${d.ayar.otoOnay ? ' checked' : ''}> Gelen randevuları otomatik onayla</label>
      <p class="bos">Kapalıyken siteden ve uygulamadan gelen randevu önce "Onay bekliyor" olarak düşer, siz onaylarsınız.</p>
      <div class="iki" style="margin-top:14px"><label>Açılış<select id="sAc">${sOps(7 * 60, 12 * 60, d.ayar.acilis)}</select></label><label>Kapanış<select id="sKp">${sOps(17 * 60, 23 * 60, d.ayar.kapanis)}</select></label></div>
      <p class="bos" style="margin-top:6px">${esc(C.saat.kapaliMetin)} kapalı. Saat değişince sitedeki boş saatler hemen güncellenir.</p>
      <div class="adim" style="margin:16px 0 8px"><b>${esc(Z.uzman)} primleri</b>${C.uzmanlar.map(u => `<div class="ay-sat" style="grid-template-columns:1fr 110px"><span>${esc(u.ad)}</span><label style="display:flex;align-items:center;gap:6px">%<input type="number" min="0" max="100" step="1" data-prim="${esc(u.ad)}" value="${d.ayar.prim[u.ad]}" aria-label="${esc(u.ad)} prim oranı"></label></div>`).join('')}</div>
      <button class="btn" type="button" data-skaydet style="width:100%">Ayarları kaydet</button><div class="hata" id="sHata"></div>
    </div>
    <div class="kutu"><h3>Hizmetler, süreler ve fiyatlar</h3><p class="bos">Değiştirip kaydedin; sitede, uygulamada ve takvimde hemen güncellenir.</p>
      <div class="ay-kap">${C.kategoriler.map(k => `<div class="ay-sat kb"><span>${esc(k.ad)}</span><span>Süre</span><span>Fiyat</span></div>` + d.hizmetler.filter(h => h.kat === k.k).map(h => `<div class="ay-sat"><span>${esc(h.ad)}</span><select data-hdk="${h.id}" aria-label="${esc(h.ad)} süresi">${sureler.concat(sureler.includes(h.dk) ? [] : [h.dk]).sort((a, b) => a - b).map(s => `<option value="${s}"${s === h.dk ? ' selected' : ''}>${s} dk</option>`).join('')}</select><input type="number" min="0" step="10" inputmode="numeric" data-hf="${h.id}" value="${h.fiyat}" aria-label="${esc(h.ad)} fiyatı"></div>`).join('')).join('')}</div>
      <button class="btn" type="button" data-hkaydet style="width:100%">Hizmetleri kaydet</button>
    </div></div>
    <p style="margin-top:18px"><button class="btn cizgi kucuk" type="button" data-sifirla>Örnek verileri baştan yükle</button></p>`;
}
function ayarKaydet(){
  const d = veri(), ac = $('sAc').value, kp = $('sKp').value, b = bugunK();
  const disarida = d.randevular.filter(r => r.gun >= b && (r.durum === 'onay' || r.durum === 'bekliyor') && r.kaynak !== 'Randevusuz' && (saat2dk(r.saat) < saat2dk(ac) || saat2dk(r.saat) + r.dk > saat2dk(kp)));
  if (disarida.length) { $('sHata').textContent = 'Yeni saatlerin dışında kalan ' + disarida.length + ' randevu var (ilki ' + gunGoreli(disarida[0].gun) + ' ' + disarida[0].saat + '). Önce onları taşıyın ya da iptal edin.'; return; }
  let hata = false;
  document.querySelectorAll('[data-prim]').forEach(i => { const v = Number(i.value); if (i.value === '' || !(v >= 0 && v <= 100)) hata = true; else d.ayar.prim[i.dataset.prim] = Math.round(v); });
  if (hata) { $('sHata').textContent = 'Prim oranı 0 ile 100 arasında olmalı.'; return; }
  d.ayar.otoOnay = $('sOto').checked; d.ayar.acilis = ac; d.ayar.kapanis = kp; yaz(d);
  $('sHata').textContent = ''; siteHepsi(); toast('Ayarlar kaydedildi');
}
function hizmetKaydet(){
  const d = veri(); let hata = false;
  document.querySelectorAll('[data-hf]').forEach(i => { const v = Math.round(Number(i.value)), h = hizmetBul(d, i.dataset.hf); if (i.value === '' || !Number.isFinite(v) || v < 0) hata = true; else if (h) h.fiyat = v; });
  if (hata) { toast('Fiyat alanları boş ya da eksi olamaz'); return; }
  document.querySelectorAll('[data-hdk]').forEach(s => { const h = hizmetBul(d, s.dataset.hdk); if (h) h.dk = Number(s.value); });
  yaz(d); siteHepsi(); toast('Hizmetler sitede ve uygulamada güncellendi');
}

/* ---- panel olayları ---- */
function durumDegis(id, durum, mesaj){
  const d = veri(), r = d.randevular.find(x => x.id === id); if (!r) return;
  r.durum = durum; yaz(d); if (M) modalKapat(); pRender(); siteHepsi(); toast(mesaj(r));
}
function panelKur(){
  const kok = document.body;
  kok.addEventListener('click', e => {
    if (e.target.closest('[data-kapat]') || e.target.id === 'modal') { modalKapat(); return; }
    const t = e.target.closest('[data-sekme]'); if (t) { P.sekme = t.dataset.sekme; P.kaydir = true; pRender(); return; }
    const pg = e.target.closest('[data-pg]'); if (pg) { P.gun = pg.dataset.pg; P.kaydir = true; pRender(); return; }
    const on = e.target.closest('[data-onay]'); if (on) { durumDegis(on.dataset.onay, 'onay', r => r.ad + ' için randevu onaylandı'); return; }
    const red = e.target.closest('[data-red]'); if (red) { durumDegis(red.dataset.red, 'iptal', r => r.saat + ' randevusu reddedildi, saat yeniden açıldı'); return; }
    const ip = e.target.closest('[data-iptal]'); if (ip) { durumDegis(ip.dataset.iptal, 'iptal', r => r.saat + ' randevusu iptal edildi, saat yeniden açıldı'); return; }
    const gm = e.target.closest('[data-gelmedi]'); if (gm) { durumDegis(gm.dataset.gelmedi, 'gelmedi', r => r.ad + ' gelmedi olarak işaretlendi'); return; }
    const ad = e.target.closest('[data-adisyon]'); if (ad) { mAdisyon(ad.dataset.adisyon); return; }
    const kp = e.target.closest('[data-kopya]'); if (kp) { kopyala(kp.dataset.kopya); return; }
    const mk = e.target.closest('[data-mkart]'); if (mk) { mMusteri(mk.dataset.mkart); return; }
    const kac = e.target.closest('[data-kac]'); if (kac) { const d = veri(); d.kapali = d.kapali.filter(x => x.id !== kac.dataset.kac); yaz(d); modalKapat(); pRender(); siteHepsi(); toast('Saat yeniden açıldı'); return; }
    if ($('modal').hidden === false && M) {
      const md = e.target.closest('[data-mod]'); if (md && M.tur === 'yeni') { mYeniOku(); M.mod = md.dataset.mod; mYeniCiz(); return; }
      if (e.target.closest('[data-ykaydet]')) { yeniKaydet(); return; }
      if (e.target.closest('[data-kkaydet]')) { kapatKaydet(); return; }
      if (M.tur === 'adisyon') {
        const ks = e.target.closest('[data-ksil]'); if (ks) { M.kalemler.splice(Number(ks.dataset.ksil), 1); mAdisyonCiz(); return; }
        if (e.target.closest('[data-kekle]')) { const v = $('aEk').value; if (!v) { toast('Listeden bir hizmet ya da ürün seçin'); return; } const [tur, id] = v.split(':'); if (tur === 'h') { const h = hizmetBul(veri(), id); if (h) M.kalemler.push({ad: h.ad, fiyat: h.fiyat, hid: h.id}); } else { const u = C.urunler[Number(id)]; M.kalemler.push({ad: u[0], fiyat: u[1]}); } mAdisyonCiz(); return; }
        const od = e.target.closest('[data-od]'); if (od) { M.odeme = od.dataset.od; document.querySelectorAll('[data-od]').forEach(b => b.classList.toggle('sec', b === od)); return; }
        if (e.target.closest('[data-akapat]')) { adisyonKapat(); return; }
      }
      if (e.target.closest('[data-notkaydet]')) { const d = veri(); const v = $('mNot').value.trim(); if (v) d.notlar[M.k] = v; else delete d.notlar[M.k]; yaz(d); toast('Not kaydedildi'); return; }
      return;
    }
    if ($('v-panel').hidden) return;
    const rb = e.target.closest('[data-rid]'); if (rb) { mDetay(rb.dataset.rid); return; }
    const kb = e.target.closest('[data-kid]'); if (kb) { mKapali(kb.dataset.kid); return; }
    if (e.target.closest('[data-yeni]')) { mYeni({uzman: C.uzmanlar[0].ad, gun: P.gun}); return; }
    if (e.target.closest('[data-kapatac]')) { mYeni({uzman: C.uzmanlar[0].ad, gun: P.gun, mod: 'kapat'}); return; }
    if (e.target.closest('[data-hatirlat]')) { mHatirlat(); return; }
    const sut = e.target.closest('.t-sut');
    if (sut) {
      const d = veri(), {ac, kp} = aralik(d), sh = parseFloat(getComputedStyle(sut.closest('.takvim')).getPropertyValue('--sh')) || 40;
      const m = ac + Math.floor((e.clientY - sut.getBoundingClientRect().top) / sh) * 30;
      if (m >= kp) return;
      if (P.gun === bugunK() && m + 30 <= simdiDk()) { toast('Geçmiş saate randevu eklenemez'); return; }
      mYeni({uzman: sut.dataset.uz, gun: P.gun, saat: dk2saat(m), bas: dk2saat(m)}); return;
    }
    const dn = e.target.closest('[data-donem]'); if (dn) { P.donem = dn.dataset.donem; pRender(); return; }
    if (e.target.closest('[data-satis]')) { mAdisyon(null); return; }
    if (e.target.closest('[data-csv]')) { csvIndir(veri()); return; }
    const mf = e.target.closest('[data-mf]'); if (mf) { P.mFiltre = mf.dataset.mf; pRender(); return; }
    if (e.target.closest('[data-gerikazan]')) { mGeriKazan(); return; }
    if (e.target.closest('[data-skaydet]')) { ayarKaydet(); return; }
    if (e.target.closest('[data-hkaydet]')) { hizmetKaydet(); return; }
    if (e.target.closest('[data-sifirla]')) { bellek = null; try { localStorage.removeItem(KEY); } catch (er) { /* bellek temizlendi */ } S.bitti = null; P.yeni = null; P.kaydir = true; pRender(); siteHepsi(); toast('Örnek veriler baştan yüklendi'); }
  });
  kok.addEventListener('change', e => {
    if (!M || $('modal').hidden) return;
    if (M.tur === 'yeni' && ['yUz', 'yGun', 'yHiz', 'kBas'].includes(e.target.id)) { mYeniOku(); if (e.target.id !== 'yHiz' && e.target.id !== 'kBas') M.saat = ''; mYeniCiz(); }
    if (M.tur === 'adisyon' && e.target.id === 'aUz') M.uzman = e.target.value;
  });
  kok.addEventListener('input', e => {
    if (e.target.id === 'mAra') { P.mAra = e.target.value; const pos = e.target.selectionStart; pRender(); const i = $('mAra'); i.focus(); try { i.setSelectionRange(pos, pos); } catch (er) { /* search alanı imleç konumunu desteklemiyorsa geç */ } return; }
    if (!M || M.tur !== 'adisyon') return;
    if (e.target.dataset.kf !== undefined) { M.kalemler[Number(e.target.dataset.kf)].fiyat = e.target.value === '' ? '' : Number(e.target.value); $('aTop').textContent = tl(adisyonToplam()); }
    if (e.target.id === 'aInd') { M.indirim = Number(e.target.value) || 0; $('aTop').textContent = tl(adisyonToplam()); }
    if (e.target.id === 'aAd') M.ad = e.target.value;
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !$('modal').hidden) modalKapat(); });
  const ipu = $('ipucu');
  const goster = el => { ipu.textContent = el.dataset.ipucu; ipu.hidden = false; const r = el.getBoundingClientRect(), w = ipu.offsetWidth; ipu.style.left = Math.min(innerWidth - w / 2 - 8, Math.max(w / 2 + 8, r.left + r.width / 2)) + 'px'; ipu.style.top = Math.max(r.top, w ? 40 : 0) + 'px'; };
  document.addEventListener('pointerover', e => { const el = e.target.closest('[data-ipucu]'); if (el && el.dataset.ipucu) goster(el); else ipu.hidden = true; });
  document.addEventListener('focusin', e => { const el = e.target.closest('[data-ipucu]'); if (el && el.dataset.ipucu) goster(el); });
  addEventListener('scroll', () => { ipu.hidden = true; }, {passive: true});
}

/* ---------------- görünüm geçişi ---------------- */
function yonlendir(){
  const h = location.hash.slice(1), v = (h === 'uygulama' || h === 'panel') ? h : 'site';
  $('v-site').hidden = v !== 'site'; $('v-uygulama').hidden = v !== 'uygulama'; $('v-panel').hidden = v !== 'panel';
  document.querySelectorAll('nav a.v').forEach(a => a.classList.toggle('sec', a.dataset.v === v));
  if (!$('modal').hidden) modalKapat();
  if (v === 'uygulama') { const f = $('uygCerceve'); if (!f.src) f.src = '?app=1'; }
  if (v === 'panel') { P.kaydir = true; pRender(); }
  if (v === 'site') { siteHepsi(); const el = h && document.getElementById(h); if (el) el.scrollIntoView(); else scrollTo(0, 0); }
  else scrollTo(0, 0);
  rehberGoster();
}

/* ---------------- mobil uygulama (?app) ---------------- */
const A = {t: 'ana', kat: C.kategoriler[0].k, hizmet: '', uzman: 'farketmez', gun: '', saat: ''};
function benimler(d){ const b = bugunK(); return d.randevular.filter(r => r.benim).sort(sirala).map(r => Object.assign({}, r, {gecmis: r.gun < b})); }
function app(){
  const d = veri(), ic = $('aIc'), onay = $('aOnay');
  document.querySelectorAll('#aTab button').forEach(b => b.classList.toggle('sec', b.dataset.t === A.t));
  onay.hidden = A.t !== 'al';
  if (A.t === 'ana') {
    const s = new Date().getHours(), selam = s < 12 ? 'Günaydın' : s < 18 ? 'İyi günler' : 'İyi akşamlar';
    const yak = benimler(d).find(r => !r.gecmis && AKTIF(r) && r.durum !== 'tamam');
    ic.innerHTML = `<div class="a-selam">${selam}${d.profil ? ', ' + esc(ilkAd(d.profil.ad)) : ''}</div><h2 class="a-baslik">${esc(C.app.baslik)}</h2>` +
      (yak ? `<div class="a-kart koyu"><div class="k-ust">Yaklaşan randevunuz</div><h3>${gunUzun(yak.gun)} · ${yak.saat}</h3><p>${esc(hizmetAd(d, yak))} · ${esc(yak.uzman)} · ${DURUM[yak.durum]}</p><button class="btn beyaz kucuk" data-git="benim" type="button">Randevularım</button></div>`
           : `<div class="a-kart koyu"><div class="k-ust">Randevu</div><h3>Boş saatleri görün</h3><p>Hizmetinizi seçin, size uyan saate bir dokunuşla randevu alın.</p><button class="btn beyaz kucuk" data-git="al" type="button">Randevu al</button></div>`) +
      `<div class="a-kart"><div class="k-ust">Bu haftaya özel</div><h3>${esc(C.kampanya.baslik)}</h3><p>${esc(C.kampanya.metin)}</p></div>
      <div class="a-bolum">Hizmetler</div>
      <div class="a-kats">${C.kategoriler.map(k => `<button type="button" data-akat="${k.k}"><img src="${IMG(k.foto, 400)}" alt=""><span>${esc(k.ad)}</span></button>`).join('')}</div>
      <div class="a-bolum">${esc(Z.isletme)}</div>
      <div class="a-kart"><p><b style="color:var(--ink)">${esc(C.adresKisa)}</b><br>${esc(C.saat.gunMetin)} ${saatMetin(d)} · ${esc(C.saat.kapaliMetin)} kapalı</p><div class="a-iki"><button class="btn cizgi kucuk" data-bilgi="Gerçek uygulamada ${esc(Z.isletmeKucuk)} aranır" type="button">Ara</button><button class="btn wa kucuk" data-bilgi="Gerçek uygulamada WhatsApp açılır" type="button">WhatsApp</button></div></div>`;
  }
  if (A.t === 'al') {
    const h = hizmetBul(d, A.hizmet), uz = h ? C.uzmanlar.filter(u => u.kat.includes(h.kat)) : [];
    if (A.uzman !== 'farketmez' && !uz.some(u => u.ad === A.uzman)) A.uzman = 'farketmez';
    const gunler = acikGunler(10); if (!A.gun || !gunler.includes(A.gun)) A.gun = gunler[0];
    const sl = h ? saatler(d, A.gun, A.hizmet, A.uzman) : [];
    if (A.saat && !sl.some(x => x.s === A.saat && x.u)) A.saat = '';
    ic.innerHTML = `<h2 class="a-baslik">Randevu al</h2>
      <div class="yatay">${C.kategoriler.map(k => `<button class="kat${A.kat === k.k ? ' sec' : ''}" data-akat2="${k.k}" type="button">${esc(k.ad)}</button>`).join('')}</div>
      <div class="a-bolum">Hizmet</div>
      ${d.hizmetler.filter(x => x.kat === A.kat).map(x => `<button class="a-hiz${A.hizmet === x.id ? ' sec' : ''}" data-ah="${x.id}" type="button"><span><span class="ad">${esc(x.ad)}</span><br><span class="sure">${x.dk} dakika</span></span><span class="fiyat">${tl(x.fiyat)}</span></button>`).join('')}
      ${h ? `<div class="a-bolum">${esc(Z.uzman)}</div><div class="yatay">${[{ad: 'farketmez'}].concat(uz).map(u => `<button class="cip${A.uzman === u.ad ? ' sec' : ''}" data-au="${esc(u.ad)}" type="button">${u.ad === 'farketmez' ? 'Fark etmez' : esc(u.ad)}</button>`).join('')}</div>
      <div class="a-bolum">Gün</div><div class="yatay">${gunler.map(g => `<button class="cip${A.gun === g ? ' sec' : ''}" data-ag="${g}" type="button">${g === bugunK() ? 'Bugün' : gunEtiket(g).split(' ')[0]}<small>${gunEtiket(g).split(' ').slice(1).join(' ')}</small></button>`).join('')}</div>
      <div class="a-bolum">Saat</div>${sl.some(x => x.u) ? `<div class="saatgrid">${sl.map(x => `<button class="cip${A.saat === x.s ? ' sec' : ''}" data-as="${x.s}" type="button"${x.u ? '' : ' disabled'}>${x.s}</button>`).join('')}</div>` : '<p class="bos">Bu gün için boş saat kalmadı.</p>'}
      ${d.profil ? `<div class="a-bolum">Bilgileriniz</div><div class="a-kart" style="padding:12px 14px"><p><b style="color:var(--ink)">${esc(d.profil.ad)}</b> · ${esc(d.profil.tel)}</p></div>` :
        `<div class="a-bolum">Bilgileriniz</div><div style="display:grid;gap:10px"><label>Ad soyad<input id="aAd2" autocomplete="name" placeholder="Adınız ve soyadınız"></label><label>Cep telefonu<input id="aTel2" inputmode="tel" autocomplete="tel" placeholder="05xx xxx xx xx"></label></div>`}` : '<p class="bos" style="margin-top:6px">Bir hizmet seçin, boş saatler görünsün.</p>'}
      <div style="height:90px"></div>`;
    onay.innerHTML = `<div class="hata" id="aHata2"></div><button class="btn" id="aGonder" type="button"${h && A.saat ? '' : ' disabled'}>${h && A.saat ? 'Randevuyu onayla · ' + A.saat + ' · ' + tl(h.fiyat) : 'Hizmet ve saat seçin'}</button>`;
  }
  if (A.t === 'benim') {
    const l = benimler(d);
    ic.innerHTML = `<h2 class="a-baslik">Randevularım</h2>` + (l.length ? l.map(r => `<div class="a-rdv${r.gecmis || r.durum === 'iptal' ? ' gecmis' : ''}"><div class="ust2"><b>${gunUzun(r.gun)} · ${r.saat}</b><span class="etiket ${r.durum}">${DURUM[r.durum]}</span></div><p>${esc(hizmetAd(d, r))} · ${esc(r.uzman)} · ${tl(r.fiyat)}</p>${!r.gecmis && (r.durum === 'onay' || r.durum === 'bekliyor') ? `<div class="a-iki"><button class="btn cizgi kucuk" data-aiptal="${r.id}" type="button">İptal et</button><button class="btn cizgi kucuk" data-bilgi="Gerçek uygulamada ${esc(Z.isletmenin)} konumu haritada açılır" type="button">Yol tarifi</button></div>` : ''}</div>`).join('')
      : `<div class="a-kart"><h3>Henüz randevunuz yok</h3><p>Aldığınız randevular burada görünür, ${esc(Z.isletmeKucuk)} onaylayınca durumu değişir.</p><button class="btn kucuk" data-git="al" type="button">Randevu al</button></div>`);
  }
}
function appKur(){
  document.body.classList.add('app');
  document.body.innerHTML = `<div class="a-ust"><div class="logo"><b>${esc(C.ad)}</b><small>${esc(C.altyazi)}</small></div></div><div class="a-ic" id="aIc"></div><div class="a-onay" id="aOnay" hidden></div>
    <div class="a-tab" id="aTab"><button type="button" data-t="ana">${rotaSvg}Ana sayfa</button><button type="button" data-t="al"><svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M12 12.5v5M9.5 15h5"/></svg>Randevu al</button><button type="button" data-t="benim"><svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>Randevularım</button></div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  document.body.addEventListener('click', e => {
    const b = e.target.closest('[data-bilgi]'); if (b) { toast(b.dataset.bilgi); return; }
    const t = e.target.closest('[data-t],[data-git]'); if (t) { A.t = t.dataset.t || t.dataset.git; app(); scrollTo(0, 0); return; }
    const k = e.target.closest('[data-akat]'); if (k) { A.kat = k.dataset.akat; A.hizmet = ''; A.t = 'al'; app(); scrollTo(0, 0); return; }
    const k2 = e.target.closest('[data-akat2]'); if (k2) { A.kat = k2.dataset.akat2; app(); return; }
    const h = e.target.closest('[data-ah]'); if (h) { A.hizmet = h.dataset.ah; app(); return; }
    const u = e.target.closest('[data-au]'); if (u) { A.uzman = u.dataset.au; app(); return; }
    const g = e.target.closest('[data-ag]'); if (g) { A.gun = g.dataset.ag; app(); return; }
    const s = e.target.closest('[data-as]'); if (s && !s.disabled) { A.saat = s.dataset.as; app(); return; }
    const i = e.target.closest('[data-aiptal]');
    if (i) { const d = veri(), r = d.randevular.find(x => x.id === i.dataset.aiptal); if (r) { r.durum = 'iptal'; yaz(d); app(); toast('Randevunuz iptal edildi'); } return; }
    if (e.target.id === 'aGonder') {
      const d = veri(), ad = d.profil ? d.profil.ad : ($('aAd2') || {}).value, tel = d.profil ? d.profil.tel : ($('aTel2') || {}).value;
      const sonuc = rezerve({hizmet: A.hizmet, uzman: A.uzman, gun: A.gun, saat: A.saat, ad, tel, kaynak: 'Uygulama'});
      if (sonuc.hata) { if (/doldu/.test(sonuc.hata)) { A.saat = ''; app(); } $('aHata2').textContent = sonuc.hata; return; }
      A.saat = ''; A.hizmet = ''; A.t = 'benim'; app(); scrollTo(0, 0); toast(sonuc.r.durum === 'onay' ? 'Randevunuz onaylandı' : 'Randevunuz alındı, ' + Z.isletmeKucuk + ' onaylayınca bildirilir');
    }
  });
  addEventListener('storage', e => { if (e.key === KEY) app(); });
  app();
}

/* ---------------- başlat ---------------- */
if (APP) appKur();
else {
  document.body.insertAdjacentHTML('afterbegin', siteIskelet());
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-bilgi]'); if (b) { toast(b.dataset.bilgi); return; }
    if (e.target.closest('[data-rehber-kapat]')) rehberKapat();
    const pgor = e.target.closest('[data-panelgor]'); if (pgor) { P.yeni = pgor.dataset.panelgor; P.sekme = 'takvim'; P.kaydir = true; }
  });
  siteKur(); panelKur();
  addEventListener('hashchange', yonlendir);
  addEventListener('storage', e => {
    if (e.key !== KEY) return;
    let once = []; try { once = JSON.parse(e.oldValue || '{"randevular":[]}').randevular.map(r => r.id); } catch (er) { once = []; }
    const d = veri(), yeni = d.randevular.find(r => !once.includes(r.id) && r.benim);
    if (yeni) { P.yeni = yeni.id; P.gun = yeni.gun; P.sekme = 'takvim'; P.kaydir = true; }
    if (!$('v-panel').hidden && !(M && !$('modal').hidden)) pRender();
    siteHepsi();
    if (yeni) toast('Yeni randevu: ' + gunGoreli(yeni.gun) + ' ' + yeni.saat + ', ' + hizmetAd(d, yeni));
  });
  yonlendir();
  setInterval(() => { if (!$('v-site').hidden) siteUst(); }, 60000);
}
})();
