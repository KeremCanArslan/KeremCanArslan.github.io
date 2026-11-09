(function () {
  'use strict';

  function oku(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function yaz(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* gizli pencerede depolama kapalı olabilir, görünüm yine çalışır */ } }
  var kok = document.documentElement;

  var tema = document.getElementById('tema');
  if (tema) tema.addEventListener('click', function () {
    var yeni = kok.dataset.tema === 'gunduz' ? 'gece' : 'gunduz';
    kok.dataset.tema = yeni;
    yaz('m2o-tema', yeni);
  });

  var menu = document.getElementById('menu-ac');
  if (menu) menu.addEventListener('click', function () {
    var acik = document.body.classList.toggle('menu-acik');
    menu.setAttribute('aria-expanded', acik ? 'true' : 'false');
  });

  var serit = document.getElementById('serit');
  if (serit && serit.children.length > 1) {
    var sira = 0;
    setInterval(function () {
      serit.children[sira].classList.remove('gor');
      sira = (sira + 1) % serit.children.length;
      serit.children[sira].classList.add('gor');
    }, 4500);
  }

  var sekmeler = document.getElementById('sekmeler');
  if (sekmeler) sekmeler.addEventListener('click', function (o) {
    var dugme = o.target.closest('button');
    if (!dugme) return;
    sekmeler.querySelectorAll('button').forEach(function (b) { b.classList.toggle('secili', b === dugme); });
    var tur = dugme.dataset.sekme, kalan = 0;
    document.querySelectorAll('#kartlar .kart').forEach(function (k) {
      var gor = tur === 'hepsi' || k.dataset.tur === tur;
      k.hidden = !gor;
      k.style.display = gor ? '' : 'none';
      if (gor) kalan++;
    });
    document.getElementById('kart-bos').hidden = kalan > 0;
  });

  var kayit = [];
  try { kayit = JSON.parse(oku('m2o-kayit') || '[]'); } catch (e) { kayit = []; }
  document.querySelectorAll('[data-kaydet]').forEach(function (b) {
    var ad = b.dataset.kaydet;
    b.classList.toggle('kayitli', kayit.indexOf(ad) > -1);
    b.addEventListener('click', function () {
      var i = kayit.indexOf(ad);
      if (i > -1) kayit.splice(i, 1); else kayit.push(ad);
      b.classList.toggle('kayitli', i === -1);
      yaz('m2o-kayit', JSON.stringify(kayit));
    });
  });

  function kucult(s) {
    return (s || '').replace(/İ/g, 'i').replace(/I/g, 'ı').toLocaleLowerCase('tr');
  }

  var form = document.getElementById('ust-ara');
  var girdi = document.getElementById('ara');
  var kapsam = document.getElementById('ara-kapsam');
  var tarihSec = document.getElementById('ara-tarih');
  var sonuc = document.getElementById('arama-sonuc');
  var veri = null, yukleniyor = false;
  function satirYaz(metin) {
    var p = document.createElement('p');
    p.textContent = metin;
    sonuc.textContent = '';
    sonuc.appendChild(p);
  }
  function goster() {
    var a = kucult(girdi.value.trim());
    if (!a) { sonuc.hidden = true; return; }
    sonuc.hidden = false;
    if (!veri) { satirYaz('Yükleniyor...'); return; }
    var alan = kapsam.value;
    var sinir = tarihSec.value ? Date.now() / 1000 - tarihSec.value * 86400 : 0;
    var liste = veri.filter(function (y) { return (!alan || y.c === alan) && (!sinir || y.d >= sinir) && kucult(y.t).indexOf(a) > -1; }).slice(0, 10);
    if (!liste.length) { satirYaz('Sonuç bulunamadı.'); return; }
    sonuc.textContent = '';
    liste.forEach(function (y) {
      var l = document.createElement('a');
      l.href = y.u;
      l.textContent = y.t;
      var s = document.createElement('small');
      s.textContent = y.k;
      l.appendChild(s);
      sonuc.appendChild(l);
    });
  }
  function veriYukle() {
    if (veri || yukleniyor) return;
    yukleniyor = true;
    fetch(document.body.dataset.arama).then(function (r) { return r.json(); }).then(function (d) { veri = d; goster(); }).catch(function () {
      yukleniyor = false;
      satirYaz('Arama şu an yüklenemedi, sayfayı yenileyip tekrar dene.');
    });
  }
  if (form) {
    girdi.addEventListener('focus', veriYukle);
    girdi.addEventListener('input', goster);
    kapsam.addEventListener('change', function () {
      tarihSec.hidden = kapsam.value !== 'rehber';
      if (tarihSec.hidden) tarihSec.value = '';
      goster();
    });
    tarihSec.addEventListener('change', goster);
    form.addEventListener('submit', function (o) {
      o.preventDefault();
      var ilk = sonuc.querySelector('a');
      if (ilk) location.href = ilk.href;
    });
    document.addEventListener('click', function (o) { if (!form.contains(o.target)) sonuc.hidden = true; });
    document.addEventListener('keydown', function (o) { if (o.key === 'Escape') sonuc.hidden = true; });
  }

  // Bildirimler son rehberleri gösterir; ziyaretçinin son baktığı an yalnız kendi tarayıcısında tutulur.
  var zil = document.getElementById('bildirim');
  if (zil) {
    var zilAc = document.getElementById('bildirim-ac');
    var zilKutu = document.getElementById('bildirim-kutu');
    var zilSayi = document.getElementById('bildirim-sayi');
    var bakilan = +(oku('m2o-bildirim') || 0);
    var yeniler = zilKutu.querySelectorAll('a');
    var yeniAdet = 0;
    yeniler.forEach(function (a) { if (+a.dataset.an > bakilan) { a.classList.add('yeni'); yeniAdet++; } });
    if (yeniAdet) { zilSayi.textContent = yeniAdet; zilSayi.hidden = false; }
    function zilKapat() { zilKutu.hidden = true; zilAc.setAttribute('aria-expanded', 'false'); }
    zilAc.addEventListener('click', function () {
      if (!zilKutu.hidden) { zilKapat(); return; }
      zilKutu.hidden = false;
      zilAc.setAttribute('aria-expanded', 'true');
      zilSayi.hidden = true;
      yaz('m2o-bildirim', String(Math.floor(Date.now() / 1000)));
    });
    document.addEventListener('click', function (o) { if (!zil.contains(o.target)) zilKapat(); });
    document.addEventListener('keydown', function (o) { if (o.key === 'Escape') zilKapat(); });
  }

  var slayt = document.getElementById('slayt');
  if (slayt) {
    var sahneler = slayt.querySelectorAll('.vitrin-bir');
    var kucukler = slayt.querySelectorAll('#slayt-kucuk button');
    var simdiki = 0, zaman = null;
    function git(n) {
      var yeni = (n + sahneler.length) % sahneler.length;
      sahneler[simdiki].classList.remove('gor');
      sahneler[simdiki].setAttribute('tabindex', '-1');
      kucukler[simdiki].classList.remove('secili');
      simdiki = yeni;
      sahneler[simdiki].classList.add('gor');
      sahneler[simdiki].removeAttribute('tabindex');
      kucukler[simdiki].classList.add('secili');
    }
    function basla() { dur(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) zaman = setInterval(function () { git(simdiki + 1); }, 6000); }
    function dur() { if (zaman) clearInterval(zaman); zaman = null; }
    document.getElementById('slayt-geri').addEventListener('click', function () { git(simdiki - 1); basla(); });
    document.getElementById('slayt-ileri').addEventListener('click', function () { git(simdiki + 1); basla(); });
    kucukler.forEach(function (b, i) { b.addEventListener('click', function () { git(i); basla(); }); });
    slayt.addEventListener('mouseenter', dur);
    slayt.addEventListener('mouseleave', basla);
    basla();
  }

  var gorunum = document.getElementById('gorunum');
  if (gorunum) {
    var alan = document.getElementById('kartlar');
    function gorunumUygula(tur) {
      alan.classList.toggle('satirlar', tur === 'satir');
      gorunum.querySelectorAll('button').forEach(function (b) { b.classList.toggle('secili', b.dataset.gorunum === tur); });
    }
    gorunumUygula(oku('m2o-gorunum') === 'satir' ? 'satir' : 'kart');
    gorunum.addEventListener('click', function (o) {
      var b = o.target.closest('button');
      if (!b) return;
      gorunumUygula(b.dataset.gorunum);
      yaz('m2o-gorunum', b.dataset.gorunum);
    });
  }

  var ozet = document.getElementById('ozet-form');
  if (ozet) ozet.addEventListener('submit', function (o) {
    o.preventDefault();
    var bilgi = document.getElementById('ozet-sonuc');
    fetch(ozet.action, { method: 'POST', body: new FormData(ozet) }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.ok) throw new Error('kayit');
      ozet.reset();
      bilgi.textContent = 'Teşekkürler, aboneliğin alındı.';
    }).catch(function () { bilgi.textContent = 'Abonelik şu an kaydedilemedi, sonra tekrar dene.'; });
  });

  var wikiAra = document.getElementById('wiki-ara');
  if (wikiAra) wikiAra.addEventListener('input', function () {
    var a = kucult(wikiAra.value.trim());
    document.querySelectorAll('#wiki-tablo tbody tr').forEach(function (s) {
      s.style.display = kucult(s.textContent).indexOf(a) > -1 ? '' : 'none';
    });
  });

  // Etkinlik durumu ve saat Türkiye saatine göre hesaplanır, ziyaretçinin saat diliminden etkilenmez.
  var saatBicim = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  var gunBicim = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Istanbul', weekday: 'short' });
  var gunNo = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  function dakika(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function sureYaz(d) { return d >= 60 ? Math.floor(d / 60) + ' sa ' + (d % 60) + ' dk' : d + ' dk'; }
  var trSaat = document.getElementById('tr-saat');
  function etkinlikGuncelle() {
    var an = new Date();
    var saat = saatBicim.format(an);
    if (trSaat) trSaat.textContent = saat;
    var bugun = gunNo[gunBicim.format(an)];
    var simdi = dakika(saat.slice(0, 5));
    document.querySelectorAll('.gun[data-gun]').forEach(function (kutu) {
      kutu.classList.toggle('bugun-gun', +kutu.dataset.gun === bugun);
    });
    document.querySelectorAll('li[data-bas]').forEach(function (li) {
      var sahip = li.dataset.gun ? li : li.closest('[data-gun]');
      var buGun = sahip && +sahip.dataset.gun === bugun;
      var d = li.querySelector('.ev-durum');
      var chip = li.querySelector('.canli');
      li.classList.remove('devam', 'bitti');
      if (d) d.textContent = '';
      if (chip) chip.hidden = true;
      if (!buGun) return;
      var bas = dakika(li.dataset.bas), bit = dakika(li.dataset.bit);
      if (bit <= bas) bit += 1440;
      if (simdi >= bas && simdi < bit) {
        li.classList.add('devam');
        if (chip) chip.hidden = false;
        if (d) d.textContent = 'Devam ediyor, ' + sureYaz(bit - simdi) + ' kaldı';
      } else if (simdi >= bit) {
        li.classList.add('bitti');
        if (d) d.textContent = 'Bitti';
      } else if (d) {
        d.textContent = sureYaz(bas - simdi) + ' sonra başlıyor';
      }
    });
  }
  if (document.querySelector('[data-gun]') || trSaat) {
    etkinlikGuncelle();
    setInterval(etkinlikGuncelle, 1000);
  }
})();
