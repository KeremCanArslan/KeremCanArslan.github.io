(async () => {
  'use strict';

  const ANAH = 'hadra-ornek-v1', OTUR = 'hadra-ornek-oturum', SEPET = 'hadra-ornek-sepet';
  const KDV = 20;
  const DURUMLAR = ['Ödeme Bekliyor', 'Hazırlanıyor', 'Yayında', 'Tamamlandı', 'İptal'];
  const VITRIN = ['Normal', 'Yeni Eklenen', 'İndirimde', 'Çok Satan'];
  const $ = (s, k = document) => k.querySelector(s);

  // Depolama: tarayıcı izin vermezse sayfa açık kaldığı sürece bellekte çalışır.
  const bellek = {};
  let kalici = true;
  const depo = {
    al(k) {
      try { const v = localStorage.getItem(k); if (v) return JSON.parse(v); }
      catch { kalici = false; }
      return bellek[k] ?? null;
    },
    yaz(k, v) {
      bellek[k] = v;
      try { localStorage.setItem(k, JSON.stringify(v)); }
      catch { kalici = false; }
    },
    sil(k) {
      delete bellek[k];
      try { localStorage.removeItem(k); }
      catch { kalici = false; }
    }
  };

  // Yardımcılar
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r2 = n => Math.round((+n + Number.EPSILON) * 100) / 100;
  const TL = n => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0) + ' TL';
  const tarih = t => new Date(t).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const kucuk = s => String(s || '').toLocaleLowerCase('tr-TR');
  const baslikAnah = s => kucuk(s).replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/[^a-z0-9]/g, '');
  const hq = (yol, q = {}) => {
    const t = Object.entries(q).filter(([, v]) => v !== '' && v != null);
    return '#/' + yol + (t.length ? '?' + new URLSearchParams(t) : '');
  };
  const urlMi = s => { try { return ['http:', 'https:'].includes(new URL(s).protocol); } catch { return false; } };
  const guvenliUrl = s => urlMi(s) ? s : '#';
  const durumPil = d => `<span class="pil d${DURUMLAR.indexOf(d)}">${e(d)}</span>`;
  const tutarKdv = f => r2(f * (1 + KDV / 100));
  const sifrele = async p => {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('hadra-ornek:' + p));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  };
  const tost = m => {
    const d = document.createElement('div');
    d.textContent = m;
    $('#toast').append(d);
    setTimeout(() => d.remove(), 3400);
  };

  // Veri
  let db, otur, sepet;
  const kaydet = () => depo.yaz(ANAH, db);
  const oturKaydet = () => depo.yaz(OTUR, otur);
  const sepetKaydet = () => depo.yaz(SEPET, sepet);

  function hareket(d, uid, tutar, metin, t = Date.now()) {
    const u = d.uyeler.find(x => x.id === uid);
    u.bakiye = r2(u.bakiye + tutar);
    d.hareketler.unshift({ uid, t, tutar: r2(tutar), metin, sonra: u.bakiye });
  }

  async function tohum() {
    const sifre = await sifrele('123456');
    const simdi = Date.now(), gun = 864e5;
    const siteler = (window.HADRA_SITELER || []).map((s, i) => ({
      id: i + 1, ad: s.name, kategori: s.category, fiyat: s.price, eski: s.oldPrice || null,
      da: s.da, pa: s.pa, yas: s.age, baglanti: s.linkType, news: s.news, vitrin: s.type, aktif: true
    }));
    const d = {
      siteler, kategoriler: [...new Set(siteler.map(s => s.kategori))],
      uyeler: [
        { id: 1, ad: 'Burak Tosun', eposta: 'uye@example.com', sifre, bakiye: 0, engelli: false, kayit: simdi - 40 * gun },
        { id: 2, ad: 'Nazlı Karabulut', eposta: 'nazli.karabulut@example.com', sifre, bakiye: 0, engelli: false, kayit: simdi - 22 * gun },
        { id: 3, ad: 'Gökhan Çetinkaya', eposta: 'gokhan@example.com', sifre, bakiye: 0, engelli: false, kayit: simdi - 6 * gun }
      ],
      yonetici: { ad: 'Yönetici', eposta: 'yonetici@example.com', sifre },
      siparisler: [], talepler: [], hareketler: [], kayitlar: [], sifirlama: {}, sira: 10421, talepSira: 301, siteSira: siteler.length + 1
    };
    hareket(d, 1, 5000, 'Bakiye yükleme (PayTR)', simdi - 35 * gun);
    hareket(d, 2, 1500, 'Bakiye yükleme (Havale)', simdi - 20 * gun);
    d.talepler.push(
      { id: 299, uid: 1, tutar: 5000, yontem: 'PayTR', durum: 'Onaylandı', t: simdi - 35 * gun },
      { id: 300, uid: 2, tutar: 1500, yontem: 'Havale', durum: 'Onaylandı', t: simdi - 20 * gun },
      { id: 301, uid: 3, tutar: 750, yontem: 'Havale', durum: 'Bekliyor', t: simdi - 3 * 36e5 },
      { id: 302, uid: 2, tutar: 2000, yontem: 'Havale', durum: 'Bekliyor', t: simdi - 40 * 6e4 }
    );
    d.talepSira = 303;
    const uygun = siteler.filter(s => s.fiyat >= 50 && s.fiyat <= 600);
    const sip = (uid, i, durum, gunOnce, kelime, hedef, odendi = true) => {
      const s = uygun[i], t = simdi - gunOnce * gun, id = String(d.sira++), tutar = tutarKdv(s.fiyat);
      d.siparisler.unshift({
        id, uid, siteId: s.id, site: s.ad, kelime, hedef, icerik: `${kelime} hakkında hazırlanan tanıtım yazısı metni burada görünür.`,
        fiyat: s.fiyat, tutar, durum, link: ['Yayında', 'Tamamlandı'].includes(durum) ? `https://${s.ad}/haber/ornek-tanitim-yazisi` : '',
        odendi, iade: false, t
      });
      if (odendi) hareket(d, uid, -tutar, `${id} nolu sipariş ödemesi`, t);
    };
    sip(1, 3, 'Tamamlandı', 18, 'kurumsal web tasarım', 'https://example.com/web-tasarim');
    sip(2, 11, 'Tamamlandı', 12, 'ikinci el araba', 'https://example.org/arac');
    sip(1, 21, 'Yayında', 5, 'diş kliniği istanbul', 'https://example.com/klinik');
    sip(2, 34, 'Hazırlanıyor', 2, 'oto kiralama', 'https://example.org/kiralama');
    sip(1, 47, 'Hazırlanıyor', 1, 'tatil köyü', 'https://example.com/tatil');
    sip(3, 58, 'Ödeme Bekliyor', 0.2, 'online eğitim', 'https://example.net/egitim', false);
    d.kayitlar.unshift({ t: simdi - 18 * gun, kim: 'Yönetici', metin: `${d.siparisler[5].id} nolu siparişin durumu Tamamlandı yapıldı` });
    return d;
  }

  async function yukle() {
    db = depo.al(ANAH);
    if (!db) { db = await tohum(); kaydet(); }
    otur = depo.al(OTUR) || { uye: null, yonetici: false };
    sepet = depo.al(SEPET) || [];
  }

  const uye = () => db.uyeler.find(u => u.id === otur.uye) || null;
  const kayit = m => { db.kayitlar.unshift({ t: Date.now(), kim: db.yonetici.ad, metin: m }); db.kayitlar.length = Math.min(db.kayitlar.length, 300); };
  const sepetKalemleri = () => sepet.map(k => ({ k, s: db.siteler.find(x => x.id === k.id && x.aktif) })).filter(x => x.s);
  const bekleyenSiparis = () => db.siparisler.filter(o => ['Ödeme Bekliyor', 'Hazırlanıyor'].includes(o.durum)).length;
  const bekleyenTalep = () => db.talepler.filter(t => t.durum === 'Bekliyor').length;

  // Yönlendirme
  function coz() {
    const [yol, s = ''] = location.hash.slice(2).split('?');
    return { p: yol.split('/').filter(Boolean).map(decodeURIComponent), q: Object.fromEntries(new URLSearchParams(s)) };
  }
  const git = h => { if (location.hash === h) ciz(); else location.hash = h; };

  function ornekSerit() {
    return `<div class="serit"><div class="kap">
      <span>Hadra Ajans için hazırlanmış örnek çalışma${kalici ? '' : '. Tarayıcınız kayda izin vermiyor, sayfa kapanınca veriler silinir'}</span>
      <span class="baglar"><a href="#/yonetim">Yönetim paneli</a><button data-do="sifirlaSor">Örnek verileri sıfırla</button></span>
    </div></div>`;
  }

  function kabuk(ic, acik = '') {
    const u = uye();
    const n = sepetKalemleri().length;
    const { q } = coz();
    return `${ornekSerit()}
    <div class="ust"><div class="kap">
      <a class="logo" href="#/"><strong>hadra<i>ajans</i></strong></a>
      <form class="ust-arama" data-form="ara"><input name="q" value="${e(q.q || '')}" aria-label="Site ara" placeholder="Site adıyla arayın"><button class="dg ana">Ara</button></form>
      <div class="ust-bag">
        <a href="${u ? '#/hesabim' : '#/giris'}">${u ? `${e(u.ad.split(' ')[0])} (${TL(u.bakiye)})` : 'Giriş yap / Üye ol'}</a>
        <a class="sepet-bag" href="#/sepet">Sepet (${n})</a>
      </div>
    </div></div>
    <nav class="menu" aria-label="Ana menü"><div class="kap">
      <a href="#/" class="${acik === 'ana' ? 'acik' : ''}">Ana Sayfa</a>
      <a href="#/siteler" class="${acik === 'siteler' && !q.k ? 'acik' : ''}">Tüm Siteler</a>
      ${db.kategoriler.map(k => `<a href="${hq('siteler', { k })}" class="${acik === 'siteler' && q.k === k ? 'acik' : ''}">${e(k)}</a>`).join('')}
    </div></nav>
    <main class="kap govde bosluk">${ic}</main>
    <footer class="alt"><div class="kap">Bu sayfa satış yapmaz, gösterim amaçlıdır.</div></footer>`;
  }

  const ekleDugme = s => {
    const var_ = sepet.some(k => k.id === s.id);
    return `<button class="ekle ${var_ ? 'var' : ''}" data-do="sepeteEkle" data-id="${s.id}" aria-label="${e(s.ad)} sepete ekle">${var_ ? 'Sepette' : 'Sepete ekle'}</button>`;
  };
  const fiyatHtml = s => `<div class="fiyat">${s.eski ? `<s>${TL(s.eski)}</s>` : ''}${TL(s.fiyat)} <span>+KDV</span></div>`;

  // Üye tarafı
  function vAna() {
    const aktif = db.siteler.filter(s => s.aktif);
    const blok = (bas, tip) => `<section class="kart">
      <header><h2>${bas}</h2><a class="kucuk" href="${hq('siteler', { v: tip })}">Tümünü gör</a></header>
      <ul>${aktif.filter(s => s.vitrin === tip).slice(0, 10).map(s => `<li><span class="ad">${e(s.ad)}<small>DA ${e(s.da)}, PA ${e(s.pa)}, ${e(s.baglanti)}</small></span>${fiyatHtml(s)}${ekleDugme(s)}</li>`).join('') || '<li class="bos">Bu bölümde site yok</li>'}</ul>
    </section>`;
    return kabuk(`<div class="vitrin">${blok('Yeni Eklenenler', 'Yeni Eklenen')}${blok('İndirimdekiler', 'İndirimde')}${blok('En Çok Satanlar', 'Çok Satan')}</div>`, 'ana');
  }

  function vSiteler(q) {
    const { q: ara = '', k = '', v = '', sira = '', s: sf = '1' } = q;
    let l = db.siteler.filter(s => s.aktif && (!k || s.kategori === k) && (!v || s.vitrin === v) && (!ara || kucuk(s.ad).includes(kucuk(ara))));
    if (sira === 'artan') l = [...l].sort((a, b) => a.fiyat - b.fiyat);
    if (sira === 'azalan') l = [...l].sort((a, b) => b.fiyat - a.fiyat);
    if (sira === 'da') l = [...l].sort((a, b) => b.da - a.da);
    if (sira === 'pa') l = [...l].sort((a, b) => b.pa - a.pa);
    const adim = 25, son = Math.max(1, Math.ceil(l.length / adim)), syf = Math.min(son, Math.max(1, +sf || 1));
    const gor = l.slice((syf - 1) * adim, syf * adim);
    const sec = (ad, ops, val) => `<select name="${ad}" aria-label="${ad}">${ops.map(([d, m]) => `<option value="${e(d)}" ${d === val ? 'selected' : ''}>${e(m)}</option>`).join('')}</select>`;
    const katSay = c => db.siteler.filter(s => s.aktif && s.kategori === c).length;
    return kabuk(`<div class="liste-yer">
      <aside class="kart"><h2>Kategori</h2><ul class="kat-list">
        <li><a class="${k ? '' : 'acik'}" href="${hq('siteler', { q: ara, v, sira })}">Tümü</a></li>
        ${db.kategoriler.map(c => `<li><a class="${k === c ? 'acik' : ''}" href="${hq('siteler', { q: ara, k: c, v, sira })}">${e(c)} <span>(${katSay(c)})</span></a></li>`).join('')}
      </ul></aside>
      <section class="kart bosluk">
        <div class="satir ara"><h2>${e(k || v || 'Tüm Siteler')}</h2><span class="soluk kucuk">${l.length} site</span></div>
        <form class="filtre" data-form="filtre" data-otomatik>
          <input name="q" value="${e(ara)}" placeholder="Site adı" aria-label="Site adı">
          ${sec('sira', [['', 'Önerilen sıra'], ['artan', 'Fiyat artan'], ['azalan', 'Fiyat azalan'], ['da', 'DA yüksek'], ['pa', 'PA yüksek']], sira)}
          <input type="hidden" name="k" value="${e(k)}"><input type="hidden" name="v" value="${e(v)}"><button class="dg ana">Filtrele</button>
        </form>
        ${gor.length ? `<table class="kirk"><thead><tr><th>Site</th><th>Kategori</th><th>DA</th><th>PA</th><th>Site yaşı</th><th>Bağlantı</th><th>News</th><th class="sag">Fiyat</th><th></th></tr></thead><tbody>
        ${gor.map(s => `<tr><td class="ad" data-l="Site">${e(s.ad)}</td><td data-l="Kategori">${e(s.kategori)}</td><td data-l="DA">${e(s.da)}</td><td data-l="PA">${e(s.pa)}</td><td data-l="Site yaşı">${e(s.yas)}</td><td data-l="Bağlantı">${e(s.baglanti)}</td><td data-l="News">${e(s.news)}</td><td data-l="Fiyat">${fiyatHtml(s)}</td><td data-l="">${ekleDugme(s)}</td></tr>`).join('')}
        </tbody></table>` : '<p class="bos">Bu aramaya uygun site bulunamadı.</p>'}
        ${sayfala(syf, son, n => hq('siteler', { q: ara, k, v, sira, s: n }))}
      </section></div>`, 'siteler');
  }

  function sayfala(syf, son, h) {
    if (son <= 1) return '';
    const nolar = [...new Set([1, syf - 1, syf, syf + 1, son])].filter(n => n >= 1 && n <= son).sort((a, b) => a - b);
    let onceki = 0, html = '';
    for (const n of nolar) {
      if (n - onceki > 1) html += '<span class="soluk">...</span>';
      html += n === syf ? `<b aria-current="page">${n}</b>` : `<a href="${h(n)}">${n}</a>`;
      onceki = n;
    }
    return `<nav class="sayfa" aria-label="Sayfalar">${html}</nav>`;
  }

  const girisKutu = (bas, ic) => kabuk(`<section class="kart dar bosluk"><h1>${bas}</h1>${ic}</section>`, 'hesap');

  function vGiris(q) {
    return girisKutu('Giriş yap', `
      <div class="bilgi">Örnek üye hesabı: uye@example.com, şifre 123456. <button type="button" class="dg kck" data-do="ornekUye" style="margin-top:6px">Bu hesapla gir</button></div>
      <form class="bosluk" data-form="giris" data-geri="${e(q.geri || '')}">
        <label class="al">E-posta<input name="eposta" type="email" autocomplete="username" required></label>
        <label class="al">Şifre<input name="sifre" type="password" autocomplete="current-password" required></label>
        <button class="dg ana">Giriş yap</button>
      </form>
      <div class="satir ara kucuk"><a href="#/sifre">Şifremi unuttum</a><a href="${hq('kayit', { geri: q.geri })}">Yeni üyelik oluştur</a></div>`);
  }

  function vKayit(q) {
    return girisKutu('Üye ol', `
      <form class="bosluk" data-form="kayit" data-geri="${e(q.geri || '')}">
        <label class="al">Ad soyad<input name="ad" autocomplete="name" required></label>
        <label class="al">E-posta<input name="eposta" type="email" autocomplete="username" required></label>
        <div class="iki"><label class="al">Şifre<input name="sifre" type="password" minlength="6" autocomplete="new-password" required></label>
        <label class="al">Şifre tekrar<input name="sifre2" type="password" minlength="6" autocomplete="new-password" required></label></div>
        <button class="dg ana">Üyeliği oluştur</button>
      </form>
      <p class="kucuk">Hesabınız var mı? <a href="${hq('giris', { geri: q.geri })}">Giriş yapın</a></p>`);
  }

  function vSifre(q) {
    if (q.t) {
      const k = db.sifirlama[q.t];
      if (!k || k.son < Date.now()) return girisKutu('Bağlantı geçersiz', `<p>Bu bağlantının süresi dolmuş ya da daha önce kullanılmış.</p><a class="dg" href="#/sifre">Yeniden dene</a>`);
      return girisKutu('Yeni şifre', `<form class="bosluk" data-form="sifreYeni" data-t="${e(q.t)}">
        <label class="al">Yeni şifre<input name="sifre" type="password" minlength="6" autocomplete="new-password" required></label>
        <label class="al">Yeni şifre tekrar<input name="sifre2" type="password" minlength="6" autocomplete="new-password" required></label>
        <button class="dg ana">Şifreyi kaydet</button></form>`);
    }
    return girisKutu('Şifremi unuttum', `<form class="bosluk" data-form="sifreIste">
      <label class="al">E-posta<input name="eposta" type="email" required></label>
      <button class="dg ana">Sıfırlama bağlantısı gönder</button></form>
      <div id="sifreSonuc"></div><a class="kucuk" href="#/giris">Girişe dön</a>`);
  }

  function vSepet() {
    const k = sepetKalemleri();
    if (!k.length) return kabuk(`<h1>Sepet</h1><section class="kart bos"><p>Sepetiniz boş.</p><p style="margin-top:12px"><a class="dg ana" href="#/siteler">Sitelere göz at</a></p></section>`);
    const ara = r2(k.reduce((t, x) => t + x.s.fiyat, 0)), toplam = r2(k.reduce((t, x) => t + tutarKdv(x.s.fiyat), 0));
    const u = uye();
    return kabuk(`<h1>Sepet</h1><div class="yan">
      <section class="kart">${k.map(({ k: c, s }) => `<div class="sepet-kalem">
        <div class="satir ara"><h3>${e(s.ad)}</h3><div class="satir">${fiyatHtml(s)}<button class="dg kck tehlike" data-do="sepettenCikar" data-id="${s.id}">Çıkar</button></div></div>
        <div class="iki"><label class="al">Anahtar kelime<input data-sepet="kelime" data-id="${s.id}" value="${e(c.kelime)}"></label>
        <label class="al">Hedef bağlantı<input data-sepet="hedef" data-id="${s.id}" type="url" placeholder="https://" value="${e(c.hedef)}"></label></div>
        <label class="al">Yazı içeriği<textarea data-sepet="icerik" data-id="${s.id}" placeholder="Metni yapıştırın">${e(c.icerik)}</textarea></label>
      </div>`).join('')}</section>
      <aside class="kart bosluk"><h2>Sipariş özeti</h2><div class="toplam">
        <div><span>Ara toplam</span><span>${TL(ara)}</span></div><div><span>KDV (%${KDV})</span><span>${TL(r2(toplam - ara))}</span></div><div class="son"><span>Toplam</span><span>${TL(toplam)}</span></div>
        ${u ? `<div><span class="soluk">Bakiyeniz</span><span>${TL(u.bakiye)}</span></div>` : ''}</div>
        <div id="sepetHata"></div>
        <button class="dg turuncu" data-do="ode">${u ? 'Bakiye ile öde' : 'Giriş yapıp devam et'}</button>
      </aside></div>`);
  }

  const hesapSekmeler = acik => `<nav class="sekmeler" aria-label="Hesap menüsü">${[['', 'Özet'], ['siparisler', 'Siparişlerim'], ['bakiye', 'Bakiye Yükle'], ['hareketler', 'Hesap Hareketleri'], ['profil', 'Profil']].map(([y, m]) => `<a href="#/hesabim${y ? '/' + y : ''}" class="${y === acik ? 'acik' : ''}">${m}</a>`).join('')}</nav>`;

  const siparisTablo = l => l.length ? `<table class="kirk"><thead><tr><th>Sipariş</th><th>Site</th><th>Anahtar kelime</th><th>Tutar</th><th>Durum</th><th>Yayın linki</th></tr></thead><tbody>
    ${l.map(o => `<tr><td data-l="Sipariş"><b>${e(o.id)}</b></td><td class="ad" data-l="Site">${e(o.site)}</td><td data-l="Anahtar kelime">${e(o.kelime)}</td><td data-l="Tutar">${TL(o.tutar)}</td><td data-l="Durum">${durumPil(o.durum)}</td><td data-l="Yayın linki">${o.link ? `<a href="${e(guvenliUrl(o.link))}" target="_blank" rel="noopener noreferrer">Yazıyı aç</a>` : '<span class="soluk">Henüz yok</span>'}</td></tr>`).join('')}
    </tbody></table>` : '<p class="bos">Henüz siparişiniz yok.</p>';

  function vHesap(p) {
    const u = uye(), bol = p[1] || '';
    const siparisler = db.siparisler.filter(o => o.uid === u.id);
    let ic = '';
    if (!bol) ic = `<section class="kart"><div class="satir ara"><div><p class="soluk kucuk">Kullanılabilir bakiye</p><p class="bakiye-sayi">${TL(u.bakiye)}</p></div><a class="dg ana" href="#/hesabim/bakiye">Bakiye yükle</a></div></section>
      <section class="kart bosluk"><div class="satir ara"><h2>Son siparişler</h2><a class="kucuk" href="#/hesabim/siparisler">Tümünü gör</a></div>${siparisTablo(siparisler.slice(0, 5))}</section>`;
    if (bol === 'siparisler') ic = `<section class="kart bosluk"><h2>Siparişlerim</h2>${siparisTablo(siparisler)}</section>`;
    if (bol === 'bakiye') {
      const t = db.talepler.filter(x => x.uid === u.id);
      ic = `<section class="kart bosluk"><h2>Bakiye yükle</h2>
        <form class="bosluk" data-form="bakiyeIste">
          <div class="iki"><label class="al">Tutar (TL)<input name="tutar" type="number" min="50" step="1" required></label>
          <label class="al">Ödeme yöntemi<select name="yontem"><option value="PayTR">Kredi kartı (PayTR)</option><option value="Havale">Havale / EFT</option></select></label></div>
          <p class="bilgi">Kartla ödemede PayTR onayı gelince bakiye kendiliğinden yazılır. Bu örnekte PayTR ekranı açılmaz, onay anında gelmiş sayılır. Havalede talep yönetim paneline düşer, yönetici onaylayınca bakiye yazılır.</p>
          <button class="dg ana">Devam et</button></form></section>
        <section class="kart bosluk"><h2>Yükleme geçmişi</h2>${t.length ? `<table class="kirk"><thead><tr><th>Tarih</th><th>Yöntem</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>${t.map(x => `<tr><td data-l="Tarih">${tarih(x.t)}</td><td data-l="Yöntem">${e(x.yontem)}</td><td data-l="Tutar">${TL(x.tutar)}</td><td data-l="Durum">${talepPil(x.durum)}</td></tr>`).join('')}</tbody></table>` : '<p class="bos">Henüz yükleme yok.</p>'}</section>`;
    }
    if (bol === 'hareketler') {
      const h = db.hareketler.filter(x => x.uid === u.id);
      ic = `<section class="kart bosluk"><h2>Hesap hareketleri</h2>${hareketTablo(h, 'Hesabınızda henüz hareket yok.')}</section>`;
    }
    if (bol === 'profil') ic = `<div class="iki">
      <section class="kart"><form class="bosluk" data-form="profil"><h2>Profil bilgileri</h2>
        <label class="al">Ad soyad<input name="ad" value="${e(u.ad)}" required></label>
        <label class="al">E-posta<input value="${e(u.eposta)}" disabled></label><button class="dg ana">Kaydet</button></form></section>
      <section class="kart"><form class="bosluk" data-form="sifreDegis"><h2>Şifre değiştir</h2>
        <label class="al">Mevcut şifre<input name="eski" type="password" autocomplete="current-password" required></label>
        <label class="al">Yeni şifre<input name="sifre" type="password" minlength="6" autocomplete="new-password" required></label><button class="dg ana">Şifreyi değiştir</button></form></section></div>`;
    return kabuk(`<div class="satir ara"><h1>Hesabım</h1><button class="dg kck" data-do="uyeCikis">Çıkış yap</button></div>${hesapSekmeler(bol)}${ic}`, 'hesap');
  }

  const talepPil = d => `<span class="pil ${d === 'Bekliyor' ? 'd0' : d === 'Onaylandı' ? 'd2' : 'kirmizi'}">${e(d)}</span>`;
  const hareketTablo = (h, bos) => h.length ? `<table class="kirk"><thead><tr><th>Tarih</th><th>Açıklama</th><th>Tutar</th><th>Sonraki bakiye</th></tr></thead><tbody>${h.map(x => `<tr><td data-l="Tarih">${tarih(x.t)}</td><td data-l="Açıklama">${e(x.metin)}</td><td data-l="Tutar"><span class="${x.tutar >= 0 ? 'arti' : 'eksi'}">${x.tutar >= 0 ? '+' : '-'}${TL(Math.abs(x.tutar))}</span></td><td data-l="Sonraki bakiye">${TL(x.sonra)}</td></tr>`).join('')}</tbody></table>` : `<p class="bos">${bos}</p>`;

  // Yönetim paneli
  function yonKabuk(ic, acik) {
    const m = [['', 'Genel Durum'], ['siparisler', 'Siparişler', bekleyenSiparis()], ['talepler', 'Bakiye Talepleri', bekleyenTalep()], ['siteler', 'Siteler'], ['kategoriler', 'Kategoriler'], ['uyeler', 'Üyeler'], ['kayitlar', 'İşlem Kayıtları']];
    return `<div class="yon-ust"><a class="logo" href="#/yonetim"><strong>hadra<i>ajans</i></strong><small>Yönetim Paneli</small></a>
      <div class="ust-bag"><a href="#/">Siteyi aç</a><a href="#" data-do="yonCikis">Çıkış</a></div></div>
    <nav class="yon-menu" aria-label="Yönetim menüsü">${m.map(([y, t, n]) => `<a class="${y === acik ? 'acik' : ''}" href="#/yonetim${y ? '/' + y : ''}">${t}${n ? ` (${n})` : ''}</a>`).join('')}</nav>
    <main class="yon-govde">${ic}</main>`;
  }

  function yGiris() {
    return `${ornekSerit()}<div class="yon-ust"><a class="logo" href="#/"><strong>hadra<i>ajans</i></strong><small>Yönetim Paneli</small></a></div><main class="kap govde"><section class="kart dar bosluk">
      <h1>Yönetici girişi</h1>
      <div class="bilgi">Örnek yönetici: yonetici@example.com, şifre 123456. <button type="button" class="dg kck" data-do="ornekYonetici" style="margin-top:6px">Bu hesapla gir</button></div>
      <form class="bosluk" data-form="yGiris">
        <label class="al">E-posta<input name="eposta" type="email" autocomplete="username" required></label>
        <label class="al">Şifre<input name="sifre" type="password" autocomplete="current-password" required></label>
        <button class="dg ana">Giriş yap</button></form>
      <a class="kucuk" href="#/">Siteye dön</a></section></main>`;
  }

  const uyeAd = id => db.uyeler.find(u => u.id === id)?.ad || 'Silinmiş üye';

  const yOzet = () => {
    const satis = db.siparisler.filter(o => o.odendi && !o.iade).reduce((t, o) => t + o.tutar, 0);
    const hazir = db.siparisler.filter(o => o.durum === 'Hazırlanıyor').length, odeme = db.siparisler.filter(o => o.durum === 'Ödeme Bekliyor').length;
    const satir = (m, n, h) => `<tr><td>${h ? `<a href="${h}">${m}</a>` : m}</td><td class="sag"><b>${n}</b></td></tr>`;
    return yonKabuk(`<div class="iki">
      <section class="kart"><h2>Bekleyen işler</h2><table><tbody>
        ${satir('Yayınlanacak sipariş', hazir, hq('yonetim/siparisler', { d: 'Hazırlanıyor' }))}
        ${satir('Ödeme bekleyen sipariş', odeme, hq('yonetim/siparisler', { d: 'Ödeme Bekliyor' }))}
        ${satir('Onay bekleyen bakiye talebi', bekleyenTalep(), '#/yonetim/talepler')}
      </tbody></table></section>
      <section class="kart"><h2>Toplamlar</h2><table><tbody>
        ${satir('Toplam satış', TL(satis))}${satir('Sipariş sayısı', db.siparisler.length)}${satir('Üye sayısı', db.uyeler.length)}${satir('Aktif site', db.siteler.filter(s => s.aktif).length)}
      </tbody></table></section></div>
      <section class="kart bosluk"><div class="satir ara"><h2>Son siparişler</h2><a class="kucuk" href="#/yonetim/siparisler">Tümü</a></div>${ySiparisTablo(db.siparisler.slice(0, 6))}</section>`, '');
  };

  const ySiparisTablo = l => l.length ? `<table class="kirk"><thead><tr><th>Sipariş</th><th>Üye</th><th>Site</th><th>Tutar</th><th>Durum</th><th>Tarih</th><th></th></tr></thead><tbody>
    ${l.map(o => `<tr><td data-l="Sipariş"><b>${e(o.id)}</b></td><td data-l="Üye">${e(uyeAd(o.uid))}</td><td class="ad" data-l="Site">${e(o.site)}</td><td data-l="Tutar">${TL(o.tutar)}</td><td data-l="Durum">${durumPil(o.durum)}</td><td data-l="Tarih">${tarih(o.t)}</td><td data-l=""><button class="dg kck" data-do="siparisAc" data-id="${e(o.id)}">Yönet</button></td></tr>`).join('')}
    </tbody></table>` : '<p class="bos">Bu filtreye uygun sipariş yok.</p>';

  const ySiparisler = q => {
    const { d = '', q: ara = '' } = q, a = kucuk(ara);
    const l = db.siparisler.filter(o => (!d || o.durum === d) && (!a || kucuk(o.id + ' ' + o.site + ' ' + uyeAd(o.uid) + ' ' + o.kelime).includes(a)));
    return yonKabuk(`<div class="satir ara"><h1>Siparişler</h1><span class="soluk kucuk">${l.length} sipariş</span></div>
      <section class="kart bosluk"><form class="filtre uclu" data-form="ySipFiltre" data-otomatik>
        <input name="q" value="${e(ara)}" placeholder="Sipariş no, site, üye" aria-label="Sipariş ara">
        <select name="d" aria-label="Durum"><option value="">Tüm durumlar</option>${DURUMLAR.map(x => `<option ${x === d ? 'selected' : ''}>${x}</option>`).join('')}</select>
        <button class="dg ana">Filtrele</button></form>${ySiparisTablo(l)}</section>`, 'siparisler');
  };

  const yTalepler = () => yonKabuk(`<h1>Bakiye Talepleri</h1><section class="kart">${db.talepler.length ? `<table class="kirk"><thead><tr><th>Tarih</th><th>Üye</th><th>Yöntem</th><th>Tutar</th><th>Durum</th><th></th></tr></thead><tbody>
    ${[...db.talepler].sort((a, b) => b.t - a.t).map(t => `<tr><td data-l="Tarih">${tarih(t.t)}</td><td data-l="Üye">${e(uyeAd(t.uid))}</td><td data-l="Yöntem">${e(t.yontem)}</td><td data-l="Tutar">${TL(t.tutar)}</td><td data-l="Durum">${talepPil(t.durum)}</td><td data-l="">${t.durum === 'Bekliyor' ? `<div class="satir"><button class="dg kck ana" data-do="talepOnay" data-id="${t.id}">Onayla</button><button class="dg kck tehlike" data-do="talepRed" data-id="${t.id}">Reddet</button></div>` : ''}</td></tr>`).join('')}
    </tbody></table>` : '<p class="bos">Talep yok.</p>'}</section>`, 'talepler');

  const ySiteler = q => {
    const { q: ara = '', k = '', s: sf = '1' } = q, a = kucuk(ara);
    const l = db.siteler.filter(s => (!k || s.kategori === k) && (!a || kucuk(s.ad).includes(a)));
    const adim = 20, son = Math.max(1, Math.ceil(l.length / adim)), syf = Math.min(son, Math.max(1, +sf || 1));
    return yonKabuk(`<div class="satir ara"><h1>Siteler</h1><div class="satir"><button class="dg" data-do="topluAc">Excel ile yükle</button><button class="dg ana" data-do="siteAc">Site ekle</button></div></div>
      <section class="kart bosluk"><form class="filtre uclu" data-form="ySiteFiltre" data-otomatik>
        <input name="q" value="${e(ara)}" placeholder="Site adı" aria-label="Site ara">
        <select name="k" aria-label="Kategori"><option value="">Tüm kategoriler</option>${db.kategoriler.map(c => `<option ${c === k ? 'selected' : ''}>${e(c)}</option>`).join('')}</select>
        <button class="dg ana">Filtrele</button></form>
      <span class="soluk kucuk">${l.length} site</span>
      ${l.length ? `<table class="kirk"><thead><tr><th>Site</th><th>Kategori</th><th>DA / PA</th><th>Fiyat</th><th>Vitrin</th><th>Durum</th><th></th></tr></thead><tbody>
      ${l.slice((syf - 1) * adim, syf * adim).map(s => `<tr><td class="ad" data-l="Site">${e(s.ad)}</td><td data-l="Kategori">${e(s.kategori)}</td><td data-l="DA / PA">${e(s.da)} / ${e(s.pa)}</td><td data-l="Fiyat">${fiyatHtml(s)}</td><td data-l="Vitrin">${e(s.vitrin)}</td><td data-l="Durum"><span class="pil ${s.aktif ? 'd2' : 'gri'}">${s.aktif ? 'Aktif' : 'Pasif'}</span></td><td data-l=""><div class="satir"><button class="dg kck" data-do="siteAc" data-id="${s.id}">Düzenle</button><button class="dg kck tehlike" data-do="siteSilSor" data-id="${s.id}">Sil</button></div></td></tr>`).join('')}
      </tbody></table>` : '<p class="bos">Site bulunamadı.</p>'}
      ${sayfala(syf, son, n => hq('yonetim/siteler', { q: ara, k, s: n }))}</section>`, 'siteler');
  };

  const yKategoriler = () => yonKabuk(`<h1>Kategoriler</h1><section class="kart bosluk">
    <form class="arama" data-form="kategoriEkle"><input name="ad" placeholder="Yeni kategori adı" aria-label="Kategori adı" required><button class="dg ana">Ekle</button></form>
    <table class="kirk"><thead><tr><th>Kategori</th><th>Site sayısı</th><th></th></tr></thead><tbody>
    ${db.kategoriler.map(c => { const n = db.siteler.filter(s => s.kategori === c).length; return `<tr><td class="ad" data-l="Kategori">${e(c)}</td><td data-l="Site sayısı">${n}</td><td data-l=""><div class="satir"><button class="dg kck" data-do="kategoriAc" data-ad="${e(c)}">Adını değiştir</button><button class="dg kck tehlike" data-do="kategoriSil" data-ad="${e(c)}">Sil</button></div></td></tr>`; }).join('')}
    </tbody></table></section>`, 'kategoriler');

  const yUyeler = q => {
    const a = kucuk(q.q || '');
    const l = db.uyeler.filter(u => !a || kucuk(u.ad + ' ' + u.eposta).includes(a));
    return yonKabuk(`<div class="satir ara"><h1>Üyeler</h1><span class="soluk kucuk">${l.length} üye</span></div><section class="kart bosluk">
      <form class="arama" data-form="yUyeFiltre"><input name="q" value="${e(q.q || '')}" placeholder="Ad ya da e-posta" aria-label="Üye ara"><button class="dg ana">Ara</button></form>
      ${l.length ? `<table class="kirk"><thead><tr><th>Üye</th><th>E-posta</th><th>Bakiye</th><th>Sipariş</th><th>Durum</th><th></th></tr></thead><tbody>
      ${l.map(u => `<tr><td class="ad" data-l="Üye">${e(u.ad)}</td><td data-l="E-posta">${e(u.eposta)}</td><td data-l="Bakiye"><b>${TL(u.bakiye)}</b></td><td data-l="Sipariş">${db.siparisler.filter(o => o.uid === u.id).length}</td><td data-l="Durum"><span class="pil ${u.engelli ? 'kirmizi' : 'd2'}">${u.engelli ? 'Engelli' : 'Aktif'}</span></td><td data-l=""><div class="satir"><button class="dg kck" data-do="bakiyeAc" data-id="${u.id}">Bakiye</button><button class="dg kck" data-do="uyeHareket" data-id="${u.id}">Hareketler</button><button class="dg kck tehlike" data-do="uyeEngel" data-id="${u.id}">${u.engelli ? 'Engeli kaldır' : 'Engelle'}</button></div></td></tr>`).join('')}
      </tbody></table>` : '<p class="bos">Üye bulunamadı.</p>'}</section>`, 'uyeler');
  };

  const yKayitlar = () => yonKabuk(`<h1>İşlem Kayıtları</h1><section class="kart">${db.kayitlar.length ? `<table class="kirk"><thead><tr><th>Tarih</th><th>Yönetici</th><th>İşlem</th></tr></thead><tbody>${db.kayitlar.map(k => `<tr><td data-l="Tarih">${tarih(k.t)}</td><td data-l="Yönetici">${e(k.kim)}</td><td data-l="İşlem">${e(k.metin)}</td></tr>`).join('')}</tbody></table>` : '<p class="bos">Henüz işlem yok.</p>'}</section>`, 'kayitlar');

  // Çizim
  let sonHash = null;
  function ciz() {
    const { p, q } = coz();
    let h;
    if (p[0] === 'yonetim') {
      if (!otur.yonetici) h = yGiris();
      else {
        const v = { '': yOzet, siparisler: ySiparisler, talepler: yTalepler, siteler: ySiteler, kategoriler: yKategoriler, uyeler: yUyeler, kayitlar: yKayitlar }[p[1] || ''] || yOzet;
        h = v(q);
      }
    } else if (p[0] === 'hesabim' && !uye()) {
      location.replace(hq('giris', { geri: location.hash }));
      return;
    } else {
      switch (p[0] || '') {
        case 'siteler': h = vSiteler(q); break;
        case 'giris': h = vGiris(q); break;
        case 'kayit': h = vKayit(q); break;
        case 'sifre': h = vSifre(q); break;
        case 'sepet': h = vSepet(); break;
        case 'hesabim': h = vHesap(p); break;
        default: h = vAna();
      }
    }
    $('#app').innerHTML = h;
    if (sonHash !== location.hash) { window.scrollTo(0, 0); sonHash = location.hash; }
  }

  function pencere(bas, ic) {
    $('#modal').innerHTML = `<div class="perde" data-perde><div class="pencere" role="dialog" aria-modal="true" aria-label="${e(bas)}">
      <div class="bas"><h2>${e(bas)}</h2><button class="kapat" data-do="kapat" aria-label="Kapat">&times;</button></div>${ic}</div></div>`;
    const ilk = $('#modal input:not([type=hidden]), #modal select, #modal textarea');
    if (ilk) ilk.focus();
  }
  const kapat = () => { $('#modal').innerHTML = ''; };
  function formHata(f, m) {
    let h = $('.hata', f);
    if (!h) { h = document.createElement('p'); h.className = 'hata'; h.setAttribute('role', 'alert'); f.prepend(h); }
    h.textContent = m;
  }
  function sorMesaj(bas, metin, eylem, dugme, veri = '') {
    pencere(bas, `<p>${e(metin)}</p><div class="satir"><button class="dg tehlike" data-do="${eylem}" ${veri}>${e(dugme)}</button><button class="dg" data-do="kapat">Vazgeç</button></div>`);
  }

  async function uyeGiris(eposta, sifre) {
    const h = await sifrele(sifre);
    return db.uyeler.find(x => x.eposta === kucuk(eposta).trim() && x.sifre === h) || null;
  }
  const geriGit = g => git(g && g.startsWith('#/') ? g : '#/hesabim');
  function uyeOturum(u, g) {
    otur.uye = u.id; oturKaydet();
    tost(`Hoş geldiniz, ${u.ad.split(' ')[0]}`);
    geriGit(g);
  }
  function yoneticiOturum() {
    otur.yonetici = true; oturKaydet();
    kayit('Yönetici girişi yapıldı'); kaydet();
    git('#/yonetim');
  }

  // Excel ile yükleme
  let topluBekleyen = null;
  const xlsxYukle = () => window.XLSX ? Promise.resolve() : new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = 'xlsx.full.min.js';
    s.onload = ok;
    s.onerror = () => no(new Error('Excel okuyucu yüklenemedi, sayfayı yenileyip tekrar deneyin.'));
    document.head.append(s);
  });
  function sayiCoz(v) {
    if (typeof v === 'number') return v;
    let s = String(v ?? '').replace(/[₺\s]/g, '').replace(/tl$/i, '');
    if (!s) return NaN;
    const v1 = s.lastIndexOf(','), n1 = s.lastIndexOf('.');
    if (v1 >= 0 && n1 >= 0) s = v1 > n1 ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
    else if (v1 >= 0) s = s.replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return Number(s);
  }
  const alanAdi = v => kucuk(v).trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  const ALANLAR = {
    ad: ['site', 'siteadi', 'alanadi', 'domain', 'websitesi', 'name'], fiyat: ['fiyat', 'price', 'satisfiyati'], eski: ['eskifiyat', 'oldprice'],
    kategori: ['kategori', 'category'], da: ['da'], pa: ['pa'], yas: ['siteyasi', 'yas', 'age'], baglanti: ['baglanti', 'baglantituru', 'linkturu', 'linktype'], news: ['news', 'googlenews', 'newskaydi']
  };
  function satirlariCoz(satirlar) {
    if (!satirlar.length) return { hata: 'Dosya boş görünüyor.' };
    const bas = satirlar[0].map(baslikAnah), sutun = {};
    for (const [a, adlar] of Object.entries(ALANLAR)) sutun[a] = bas.findIndex(b => adlar.includes(b));
    if (sutun.ad < 0 || sutun.fiyat < 0) return { hata: 'İlk satırda en az Site ve Fiyat sütunları olmalı.' };
    const mevcut = new Map(db.siteler.map(s => [s.ad, s])), goruldu = new Set();
    const sonuc = { yeni: [], guncel: [], hatalar: [] };
    satirlar.slice(1).forEach((r, i) => {
      const no = i + 2, al = a => sutun[a] >= 0 ? r[sutun[a]] : '';
      if (r.every(x => String(x ?? '').trim() === '')) return;
      const ad = alanAdi(al('ad')), fiyat = sayiCoz(al('fiyat'));
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(ad)) return sonuc.hatalar.push(`Satır ${no}: site adı geçersiz`);
      if (!(fiyat >= 0)) return sonuc.hatalar.push(`Satır ${no}: fiyat geçersiz`);
      if (goruldu.has(ad)) return sonuc.hatalar.push(`Satır ${no}: ${ad} dosyada iki kez var`);
      goruldu.add(ad);
      const sayi = a => { const n = sayiCoz(al(a)); return Number.isFinite(n) ? n : null; };
      const k = {
        ad, fiyat: r2(fiyat), eski: sayi('eski') || null, kategori: String(al('kategori') || '').trim() || 'Diğer', da: sayi('da'), pa: sayi('pa'),
        yas: String(al('yas') || '').trim(), baglanti: /no/i.test(String(al('baglanti'))) ? 'Nofollow' : 'Dofollow', news: /yok|hay/i.test(String(al('news'))) ? 'Yok' : 'Var'
      };
      (mevcut.has(ad) ? sonuc.guncel : sonuc.yeni).push(k);
    });
    return sonuc;
  }
  async function topluOku(dosya) {
    const yer = $('#topluSonuc');
    yer.innerHTML = '<p class="soluk kucuk">Dosya okunuyor...</p>';
    try {
      await xlsxYukle();
      let wb;
      if (/\.csv$/i.test(dosya.name)) wb = XLSX.read(new TextDecoder('utf-8').decode(await dosya.arrayBuffer()).replace(/^﻿/, ''), { type: 'string', raw: true });
      else wb = XLSX.read(await dosya.arrayBuffer(), { type: 'array' });
      const s = satirlariCoz(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: true, defval: '' }));
      if (s.hata) { topluBekleyen = null; yer.innerHTML = `<p class="hata">${e(s.hata)}</p>`; return; }
      topluBekleyen = s;
      yer.innerHTML = `<div class="bilgi">${s.yeni.length} yeni site eklenecek, ${s.guncel.length} site güncellenecek, ${s.hatalar.length} satır atlanacak.</div>
        ${s.hatalar.length ? `<p class="hata">${s.hatalar.slice(0, 5).map(e).join('<br>')}${s.hatalar.length > 5 ? `<br>ve ${s.hatalar.length - 5} satır daha` : ''}</p>` : ''}
        <button class="dg ana" data-do="topluUygula" ${s.yeni.length + s.guncel.length ? '' : 'disabled'}>Aktarımı tamamla</button>`;
    } catch (h) {
      topluBekleyen = null;
      yer.innerHTML = `<p class="hata">${e(h.message || 'Dosya okunamadı.')}</p>`;
    }
  }
  function ornekDosya() {
    const m = '﻿Site;Kategori;Fiyat;Eski Fiyat;DA;PA;Site Yaşı;Bağlantı;News\nhaber-ornek-1.example;Haber;150;;25;40;6 yıl;Dofollow;Var\nblog-ornek-2.example;Blog;1.250,50;1.500;18;33;3 yıl;Nofollow;Yok\n';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([m], { type: 'text/csv;charset=utf-8' }));
    a.download = 'site-listesi-ornek.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // Eylemler
  const eylem = {
    kapat,
    sifirlaSor: () => sorMesaj('Örnek verileri sıfırla', 'Eklediğiniz üyeler, siparişler ve siteler silinir, sayfa ilk haline döner.', 'sifirla', 'Sıfırla'),
    async sifirla() {
      depo.sil(ANAH); depo.sil(OTUR); depo.sil(SEPET);
      kapat(); await yukle(); tost('Örnek veriler sıfırlandı'); git('#/');
    },
    sepeteEkle(b) {
      const id = +b.dataset.id;
      if (sepet.some(k => k.id === id)) { tost('Bu site zaten sepette'); return; }
      sepet.push({ id, kelime: '', hedef: '', icerik: '' }); sepetKaydet(); tost('Sepete eklendi'); ciz();
    },
    sepettenCikar(b) { sepet = sepet.filter(k => k.id !== +b.dataset.id); sepetKaydet(); ciz(); },
    ode() {
      const u = uye();
      if (!u) { git(hq('giris', { geri: '#/sepet' })); return; }
      const k = sepetKalemleri(), yer = $('#sepetHata');
      const goster = m => { yer.innerHTML = m; };
      for (const { k: c, s } of k) {
        if (!c.kelime.trim()) return goster(`<p class="hata">${e(s.ad)} için anahtar kelime yazın.</p>`);
        if (!urlMi(c.hedef.trim())) return goster(`<p class="hata">${e(s.ad)} için hedef bağlantıyı https:// ile yazın.</p>`);
      }
      const toplam = r2(k.reduce((t, x) => t + tutarKdv(x.s.fiyat), 0));
      if (u.bakiye < toplam) return goster(`<p class="hata">Bakiyeniz yetmiyor, ${TL(r2(toplam - u.bakiye))} eksik. <a href="#/hesabim/bakiye">Bakiye yükleyin</a></p>`);
      for (const { k: c, s } of k) {
        const id = String(db.sira++), tutar = tutarKdv(s.fiyat);
        db.siparisler.unshift({ id, uid: u.id, siteId: s.id, site: s.ad, kelime: c.kelime.trim(), hedef: c.hedef.trim(), icerik: c.icerik.trim(), fiyat: s.fiyat, tutar, durum: 'Hazırlanıyor', link: '', odendi: true, iade: false, t: Date.now() });
        hareket(db, u.id, -tutar, `${id} nolu sipariş ödemesi`);
      }
      kaydet(); sepet = []; sepetKaydet();
      tost(`${k.length} sipariş oluşturuldu`);
      git('#/hesabim/siparisler');
    },
    uyeCikis() { otur.uye = null; oturKaydet(); git('#/'); },
    yonCikis(b, ev) { ev.preventDefault(); otur.yonetici = false; oturKaydet(); git('#/yonetim'); },
    async ornekUye() {
      const u = await uyeGiris('uye@example.com', '123456');
      if (!u) { tost('Örnek üyenin şifresi değişmiş, verileri sıfırlayabilirsiniz'); return; }
      if (u.engelli) { tost('Bu üye yönetim panelinden engellenmiş'); return; }
      const f = $('form[data-form=giris]');
      uyeOturum(u, f && f.dataset.geri);
    },
    ornekYonetici: yoneticiOturum,
    siparisAc(b) {
      const o = db.siparisler.find(x => x.id === b.dataset.id);
      pencere(`Sipariş ${o.id}`, `<dl class="dl"><dt>Üye</dt><dd>${e(uyeAd(o.uid))}</dd><dt>Site</dt><dd>${e(o.site)}</dd><dt>Anahtar kelime</dt><dd>${e(o.kelime)}</dd><dt>Hedef bağlantı</dt><dd><a href="${e(guvenliUrl(o.hedef))}" target="_blank" rel="noopener noreferrer">${e(o.hedef)}</a></dd><dt>Yazı içeriği</dt><dd>${e(o.icerik) || '<span class="soluk">Yazılmamış</span>'}</dd><dt>Tutar</dt><dd>${TL(o.tutar)} (${o.odendi ? (o.iade ? 'iade edildi' : 'ödendi') : 'ödenmedi'})</dd></dl>
      ${o.durum === 'İptal' ? '<p class="bilgi">Bu sipariş iptal edildi, değiştirilemez.</p>' : `<form class="bosluk" data-form="siparis" data-id="${e(o.id)}">
        <label class="al">Durum<select name="durum">${DURUMLAR.map(d => `<option ${d === o.durum ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
        <label class="al">Yayın linki<input name="link" type="url" placeholder="https://" value="${e(o.link)}"></label>
        <p class="soluk kucuk">Ödenmiş sipariş iptal edilirse tutar üyenin bakiyesine bir kez iade edilir.</p>
        <button class="dg ana">Kaydet</button></form>`}`);
    },
    talepOnay(b) {
      const t = db.talepler.find(x => x.id === +b.dataset.id);
      if (!t || t.durum !== 'Bekliyor') return;
      t.durum = 'Onaylandı';
      hareket(db, t.uid, t.tutar, `Bakiye yükleme (${t.yontem})`);
      kayit(`${uyeAd(t.uid)} için ${TL(t.tutar)} bakiye talebi onaylandı`); kaydet(); tost('Talep onaylandı, bakiye yazıldı'); ciz();
    },
    talepRed(b) {
      const t = db.talepler.find(x => x.id === +b.dataset.id);
      if (!t || t.durum !== 'Bekliyor') return;
      t.durum = 'Reddedildi';
      kayit(`${uyeAd(t.uid)} için ${TL(t.tutar)} bakiye talebi reddedildi`); kaydet(); tost('Talep reddedildi'); ciz();
    },
    siteAc(b) {
      const s = b.dataset.id ? db.siteler.find(x => x.id === +b.dataset.id) : { ad: '', kategori: db.kategoriler[0] || '', fiyat: '', eski: '', da: '', pa: '', yas: '', baglanti: 'Dofollow', news: 'Var', vitrin: 'Normal', aktif: true };
      const sec = (a, ops, v) => `<select name="${a}">${ops.map(o => `<option ${o === v ? 'selected' : ''}>${e(o)}</option>`).join('')}</select>`;
      pencere(s.id ? 'Siteyi düzenle' : 'Yeni site', `<form class="bosluk" data-form="site" data-id="${s.id || ''}">
        <label class="al">Site adı<input name="ad" value="${e(s.ad)}" placeholder="ornekhaber.com" required></label>
        <div class="iki"><label class="al">Fiyat (TL)<input name="fiyat" type="number" min="0" step="0.01" value="${e(s.fiyat)}" required></label><label class="al">Eski fiyat (indirim için)<input name="eski" type="number" min="0" step="0.01" value="${e(s.eski ?? '')}"></label></div>
        <div class="uc"><label class="al">DA<input name="da" type="number" min="0" max="100" value="${e(s.da ?? '')}"></label><label class="al">PA<input name="pa" type="number" min="0" max="100" value="${e(s.pa ?? '')}"></label><label class="al">Site yaşı<input name="yas" value="${e(s.yas)}"></label></div>
        <div class="iki"><label class="al">Kategori${sec('kategori', db.kategoriler, s.kategori)}</label><label class="al">Vitrin${sec('vitrin', VITRIN, s.vitrin)}</label></div>
        <div class="iki"><label class="al">Bağlantı${sec('baglanti', ['Dofollow', 'Nofollow'], s.baglanti)}</label><label class="al">Google News${sec('news', ['Var', 'Yok'], s.news)}</label></div>
        <label class="satir kucuk"><input type="checkbox" name="aktif" ${s.aktif ? 'checked' : ''} style="width:18px"> Sitede yayında</label>
        <button class="dg ana">Kaydet</button></form>`);
    },
    siteSilSor(b) {
      const s = db.siteler.find(x => x.id === +b.dataset.id);
      sorMesaj('Siteyi sil', `${s.ad} listeden silinecek. Geçmiş siparişler etkilenmez.`, 'siteSil', 'Sil', `data-id="${s.id}"`);
    },
    siteSil(b) {
      const s = db.siteler.find(x => x.id === +b.dataset.id);
      db.siteler = db.siteler.filter(x => x !== s);
      sepet = sepet.filter(k => k.id !== s.id); sepetKaydet();
      kayit(`${s.ad} silindi`); kaydet(); kapat(); tost('Site silindi'); ciz();
    },
    topluAc() {
      topluBekleyen = null;
      pencere('Excel ile site yükle', `<p class="soluk kucuk">Excel ya da CSV dosyası seçin. İlk satırda sütun adları olsun: Site, Kategori, Fiyat, Eski Fiyat, DA, PA, Site Yaşı, Bağlantı, News. Listede olan site güncellenir, olmayan eklenir.</p>
        <label class="al">Dosya<input type="file" id="topluDosya" accept=".xlsx,.xls,.csv"></label>
        <button class="dg kck" data-do="ornekDosyaIndir" style="justify-self:start">Örnek dosyayı indir</button>
        <div id="topluSonuc" class="bosluk"></div>`);
    },
    ornekDosyaIndir: ornekDosya,
    topluUygula() {
      if (!topluBekleyen) return;
      const { yeni, guncel } = topluBekleyen;
      for (const k of yeni) {
        if (!db.kategoriler.includes(k.kategori)) db.kategoriler.push(k.kategori);
        db.siteler.unshift({ id: db.siteSira++, ...k, da: k.da ?? 0, pa: k.pa ?? 0, vitrin: 'Yeni Eklenen', aktif: true });
      }
      for (const k of guncel) {
        if (!db.kategoriler.includes(k.kategori)) db.kategoriler.push(k.kategori);
        const s = db.siteler.find(x => x.ad === k.ad);
        Object.assign(s, { fiyat: k.fiyat, eski: k.eski, kategori: k.kategori, baglanti: k.baglanti, news: k.news });
        if (k.da != null) s.da = k.da;
        if (k.pa != null) s.pa = k.pa;
        if (k.yas) s.yas = k.yas;
      }
      kayit(`Excel ile ${yeni.length} site eklendi, ${guncel.length} site güncellendi`); kaydet();
      topluBekleyen = null; kapat(); tost('Site listesi aktarıldı'); ciz();
    },
    kategoriAc(b) {
      pencere('Kategori adını değiştir', `<form class="bosluk" data-form="kategoriAd" data-ad="${e(b.dataset.ad)}"><label class="al">Yeni ad<input name="ad" value="${e(b.dataset.ad)}" required></label><button class="dg ana">Kaydet</button></form>`);
    },
    kategoriSil(b) {
      const ad = b.dataset.ad, n = db.siteler.filter(s => s.kategori === ad).length;
      if (n) { tost(`Bu kategoride ${n} site var, önce onları taşıyın`); return; }
      db.kategoriler = db.kategoriler.filter(c => c !== ad);
      kayit(`${ad} kategorisi silindi`); kaydet(); ciz();
    },
    bakiyeAc(b) {
      const u = db.uyeler.find(x => x.id === +b.dataset.id);
      pencere(`${u.ad} bakiyesi`, `<p>Güncel bakiye: <b>${TL(u.bakiye)}</b></p><form class="bosluk" data-form="uyeBakiye" data-id="${u.id}">
        <div class="iki"><label class="al">İşlem<select name="tur"><option value="ekle">Bakiye ekle</option><option value="cikar">Bakiye çıkar</option></select></label>
        <label class="al">Tutar (TL)<input name="tutar" type="number" min="0.01" step="0.01" required></label></div>
        <label class="al">Açıklama<input name="aciklama" required></label><button class="dg ana">Uygula</button></form>`);
    },
    uyeHareket(b) {
      const u = db.uyeler.find(x => x.id === +b.dataset.id);
      pencere(`${u.ad} hareketleri`, hareketTablo(db.hareketler.filter(x => x.uid === u.id), 'Hareket yok.'));
    },
    uyeEngel(b) {
      const u = db.uyeler.find(x => x.id === +b.dataset.id);
      u.engelli = !u.engelli;
      if (u.engelli && otur.uye === u.id) { otur.uye = null; oturKaydet(); }
      kayit(`${u.ad} ${u.engelli ? 'engellendi' : 'engeli kaldırıldı'}`); kaydet(); ciz();
    }
  };

  // Formlar
  const form = {
    ara: fd => git(hq('siteler', { q: fd.get('q').trim() })),
    filtre: fd => git(hq('siteler', { q: fd.get('q').trim(), k: fd.get('k'), sira: fd.get('sira'), v: fd.get('v') })),
    ySipFiltre: fd => git(hq('yonetim/siparisler', { q: fd.get('q').trim(), d: fd.get('d') })),
    ySiteFiltre: fd => git(hq('yonetim/siteler', { q: fd.get('q').trim(), k: fd.get('k') })),
    yUyeFiltre: fd => git(hq('yonetim/uyeler', { q: fd.get('q').trim() })),
    async giris(fd, f) {
      const u = await uyeGiris(fd.get('eposta'), fd.get('sifre'));
      if (!u) return formHata(f, 'E-posta ya da şifre hatalı.');
      if (u.engelli) return formHata(f, 'Hesabınız engellenmiş, bizimle iletişime geçin.');
      uyeOturum(u, f.dataset.geri);
    },
    async kayit(fd, f) {
      const eposta = kucuk(fd.get('eposta')).trim();
      if (fd.get('sifre') !== fd.get('sifre2')) return formHata(f, 'Şifreler aynı değil.');
      if (db.uyeler.some(u => u.eposta === eposta)) return formHata(f, 'Bu e-posta ile kayıtlı bir üyelik var.');
      const u = { id: Math.max(0, ...db.uyeler.map(x => x.id)) + 1, ad: fd.get('ad').trim(), eposta, sifre: await sifrele(fd.get('sifre')), bakiye: 0, engelli: false, kayit: Date.now() };
      db.uyeler.push(u); kaydet(); uyeOturum(u, f.dataset.geri);
    },
    sifreIste(fd) {
      const eposta = kucuk(fd.get('eposta')).trim(), u = db.uyeler.find(x => x.eposta === eposta);
      let link = '';
      if (u) {
        const t = crypto.randomUUID();
        db.sifirlama[t] = { uid: u.id, son: Date.now() + 30 * 6e4 }; kaydet();
        link = `<p style="margin-top:8px"><a class="dg kck" href="${hq('sifre', { t })}">Bağlantıyı aç</a></p>`;
      }
      $('#sifreSonuc').innerHTML = `<div class="bilgi">Bu adres kayıtlıysa sıfırlama bağlantısı e-postayla gider. Örnekte e-posta gönderilmediği için bağlantı burada görünür.${link}</div>`;
    },
    async sifreYeni(fd, f) {
      const k = db.sifirlama[f.dataset.t];
      if (!k || k.son < Date.now()) return formHata(f, 'Bağlantının süresi dolmuş.');
      if (fd.get('sifre') !== fd.get('sifre2')) return formHata(f, 'Şifreler aynı değil.');
      db.uyeler.find(u => u.id === k.uid).sifre = await sifrele(fd.get('sifre'));
      delete db.sifirlama[f.dataset.t]; kaydet(); tost('Şifreniz değişti, giriş yapabilirsiniz'); git('#/giris');
    },
    bakiyeIste(fd, f) {
      const u = uye(), tutar = r2(+fd.get('tutar')), yontem = fd.get('yontem');
      if (!(tutar >= 50)) return formHata(f, 'En az 50 TL yükleyebilirsiniz.');
      const t = { id: db.talepSira++, uid: u.id, tutar, yontem, durum: yontem === 'PayTR' ? 'Onaylandı' : 'Bekliyor', t: Date.now() };
      db.talepler.unshift(t);
      if (yontem === 'PayTR') { hareket(db, u.id, tutar, 'Bakiye yükleme (PayTR)'); tost('Ödeme onaylandı, bakiye yazıldı'); }
      else tost('Talebiniz yönetim paneline düştü');
      kaydet(); ciz();
    },
    profil(fd) { uye().ad = fd.get('ad').trim(); kaydet(); tost('Bilgileriniz kaydedildi'); ciz(); },
    async sifreDegis(fd, f) {
      const u = uye();
      if (await sifrele(fd.get('eski')) !== u.sifre) return formHata(f, 'Mevcut şifre hatalı.');
      u.sifre = await sifrele(fd.get('sifre')); kaydet(); tost('Şifreniz değişti'); f.reset();
    },
    async yGiris(fd, f) {
      const h = await sifrele(fd.get('sifre'));
      if (kucuk(fd.get('eposta')).trim() !== db.yonetici.eposta || h !== db.yonetici.sifre) return formHata(f, 'E-posta ya da şifre hatalı.');
      yoneticiOturum();
    },
    siparis(fd, f) {
      const o = db.siparisler.find(x => x.id === f.dataset.id), durum = fd.get('durum'), link = fd.get('link').trim();
      if (o.durum === 'İptal') return formHata(f, 'İptal edilen sipariş değiştirilemez.');
      if (link && !urlMi(link)) return formHata(f, 'Yayın linki https:// ile başlamalı.');
      if (['Yayında', 'Tamamlandı'].includes(durum) && !link) return formHata(f, 'Bu durum için yayın linki gerekli.');
      if (durum === 'Ödeme Bekliyor' && o.odendi) return formHata(f, 'Ödemesi alınmış sipariş bu duruma dönemez.');
      if (durum === 'İptal' && o.odendi && !o.iade) { o.iade = true; hareket(db, o.uid, o.tutar, `${o.id} nolu sipariş iadesi`); }
      if (!o.odendi && ['Hazırlanıyor', 'Yayında', 'Tamamlandı'].includes(durum)) o.odendi = true;
      const eski = o.durum;
      o.durum = durum; o.link = link;
      kayit(`${o.id} nolu siparişin durumu ${eski === durum ? durum + ' olarak kaydedildi' : eski + ' iken ' + durum + ' yapıldı'}`);
      kaydet(); kapat(); tost('Sipariş güncellendi'); ciz();
    },
    site(fd, f) {
      const ad = alanAdi(fd.get('ad'));
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(ad)) return formHata(f, 'Site adını ornekhaber.com biçiminde yazın.');
      const id = +f.dataset.id;
      if (db.siteler.some(s => s.ad === ad && s.id !== id)) return formHata(f, 'Bu site listede zaten var.');
      const v = { ad, fiyat: r2(+fd.get('fiyat')), eski: +fd.get('eski') || null, da: +fd.get('da') || 0, pa: +fd.get('pa') || 0, yas: fd.get('yas').trim(), kategori: fd.get('kategori'), vitrin: fd.get('vitrin'), baglanti: fd.get('baglanti'), news: fd.get('news'), aktif: fd.get('aktif') === 'on' };
      if (id) Object.assign(db.siteler.find(s => s.id === id), v);
      else db.siteler.unshift({ id: db.siteSira++, ...v });
      kayit(`${ad} ${id ? 'düzenlendi' : 'eklendi'}`); kaydet(); kapat(); tost('Site kaydedildi'); ciz();
    },
    kategoriEkle(fd, f) {
      const ad = fd.get('ad').trim();
      if (db.kategoriler.some(c => kucuk(c) === kucuk(ad))) return formHata(f, 'Bu kategori zaten var.');
      db.kategoriler.push(ad); kayit(`${ad} kategorisi eklendi`); kaydet(); ciz();
    },
    kategoriAd(fd, f) {
      const eski = f.dataset.ad, ad = fd.get('ad').trim();
      if (db.kategoriler.some(c => c !== eski && kucuk(c) === kucuk(ad))) return formHata(f, 'Bu ad başka bir kategoride var.');
      db.kategoriler = db.kategoriler.map(c => c === eski ? ad : c);
      db.siteler.forEach(s => { if (s.kategori === eski) s.kategori = ad; });
      kayit(`${eski} kategorisinin adı ${ad} oldu`); kaydet(); kapat(); ciz();
    },
    uyeBakiye(fd, f) {
      const u = db.uyeler.find(x => x.id === +f.dataset.id), tutar = r2(+fd.get('tutar')), tur = fd.get('tur'), ac = fd.get('aciklama').trim();
      if (!(tutar > 0)) return formHata(f, 'Tutar girin.');
      if (tur === 'cikar' && tutar > u.bakiye) return formHata(f, 'Üyenin bakiyesinden fazla çıkarılamaz.');
      hareket(db, u.id, tur === 'ekle' ? tutar : -tutar, `Yönetici: ${ac}`);
      kayit(`${u.ad} bakiyesi ${tur === 'ekle' ? '+' : '-'}${TL(tutar)} (${ac})`); kaydet(); kapat(); tost('Bakiye güncellendi'); ciz();
    }
  };

  // Olay dinleyiciler
  let mesgul = false;
  document.addEventListener('click', async ev => {
    if (ev.target.matches('[data-perde]')) { kapat(); return; }
    const b = ev.target.closest('[data-do]');
    if (!b || mesgul) return;
    mesgul = true;
    try { await eylem[b.dataset.do](b, ev); }
    catch (h) { console.error(h); tost('İşlem tamamlanamadı, sayfayı yenileyip tekrar deneyin'); }
    finally { mesgul = false; }
  });
  document.addEventListener('submit', async ev => {
    const f = ev.target.closest('form[data-form]');
    if (!f) return;
    ev.preventDefault();
    if (mesgul) return;
    mesgul = true;
    try { await form[f.dataset.form](new FormData(f), f); }
    catch (h) { console.error(h); formHata(f, 'İşlem tamamlanamadı, sayfayı yenileyip tekrar deneyin.'); }
    finally { mesgul = false; }
  });
  document.addEventListener('change', ev => {
    if (ev.target.id === 'topluDosya' && ev.target.files[0]) { topluOku(ev.target.files[0]); return; }
    if (ev.target.matches('select')) { const f = ev.target.closest('form[data-otomatik]'); if (f) f.requestSubmit(); }
  });
  document.addEventListener('input', ev => {
    const a = ev.target.dataset && ev.target.dataset.sepet;
    if (!a) return;
    const k = sepet.find(x => x.id === +ev.target.dataset.id);
    if (k) { k[a] = ev.target.value; sepetKaydet(); }
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && $('#modal').firstChild) kapat(); });
  window.addEventListener('hashchange', ciz);

  await yukle();
  ciz();
})();
