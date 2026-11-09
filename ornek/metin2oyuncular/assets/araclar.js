(function () {
  'use strict';

  function bul(id) { return document.getElementById(id); }
  function el(ad, sinif, yazi) {
    var d = document.createElement(ad);
    if (sinif) d.className = sinif;
    if (yazi !== undefined) d.textContent = yazi;
    return d;
  }
  function bosalt(d) { while (d.firstChild) d.removeChild(d.firstChild); }
  function kucult(s) { return (s || '').replace(/İ/g, 'i').replace(/I/g, 'ı').toLocaleLowerCase('tr'); }
  function binlik(n) { return Math.round(n).toLocaleString('tr-TR'); }

  // Resmî tabloda alt sınır iki aralıkta da geçiyor, tam o puan ayrıca söylenir.
  function odulYaz(p, s1, s2, adlar) {
    var ad = p >= s2 ? adlar[2] : p > s1 ? adlar[1] : p === s1 ? adlar[0] + ' ya da ' + adlar[1] : adlar[0];
    var hedef = p < s1 ? s1 : p < s2 ? s2 : 0;
    return 'Ödül: ' + ad + (hedef ? '. Sonraki eşiğe ' + (hedef - p) + ' puan.' : '. En üst ödül.');
  }

  function okey() {
    if (!bul('okey')) return;
    var RENK = [['Mavi', 'mavi'], ['Sarı', 'sari'], ['Kırmızı', 'kirmizi']];
    var kartlar = [], gecmis = [], puan = 0;
    var tahta = bul('okey-tahta');
    RENK.forEach(function (r, ri) {
      for (var n = 1; n <= 8; n++) {
        var k = { r: ri, n: n, d: 0, b: el('button', 'okey-kart ' + r[1], String(n)) };
        k.b.type = 'button';
        k.b.setAttribute('aria-label', r[0] + ' ' + n);
        tahta.appendChild(k.b);
        kartlar.push(k);
      }
    });
    kartlar.forEach(function (k) {
      k.b.addEventListener('click', function () {
        var elde = kartlar.filter(function (x) { return x.d === 1; }).length;
        k.d = k.d === 0 ? (elde >= 5 ? 2 : 1) : k.d === 1 ? 2 : 0;
        ciz();
      });
    });
    function puanla(x) {
      var s = x.slice().sort(function (a, b) { return a.n - b.n; });
      if (s[0].n === s[1].n && s[1].n === s[2].n) return 10 + s[0].n * 10;
      if (s[1].n === s[0].n + 1 && s[2].n === s[1].n + 1) {
        return s[0].r === s[1].r && s[1].r === s[2].r ? 40 + s[0].n * 10 : s[0].n * 10;
      }
      return 0;
    }
    function ucluler(l) {
      var c = [];
      for (var i = 0; i < l.length; i++) for (var j = i + 1; j < l.length; j++) for (var m = j + 1; m < l.length; m++) {
        var u = [l[i], l[j], l[m]], p = puanla(u);
        if (p) c.push({ u: u, p: p });
      }
      return c.sort(function (a, b) { return b.p - a.p; });
    }
    function satir(c, oyna) {
      var s = el('div', 'arac-satir');
      c.u.slice().sort(function (a, b) { return a.n - b.n; }).forEach(function (k) { s.appendChild(el('span', 'mini ' + RENK[k.r][1], String(k.n))); });
      s.appendChild(el('b', '', '+' + c.p));
      if (oyna) {
        var b = el('button', 'arac-btn', 'Oyna');
        b.type = 'button';
        b.addEventListener('click', function () {
          gecmis.push({ u: c.u, p: c.p });
          c.u.forEach(function (k) { k.d = 2; });
          puan += c.p;
          ciz();
        });
        s.appendChild(b);
      } else {
        s.appendChild(el('small', 'soluk', 'Elinde ' + c.u.filter(function (k) { return k.d === 1; }).length + '/3'));
      }
      return s;
    }
    function ciz() {
      var elde = kartlar.filter(function (k) { return k.d === 1; });
      var deste = kartlar.filter(function (k) { return k.d === 0; });
      kartlar.forEach(function (k) { k.b.classList.toggle('elde', k.d === 1); k.b.classList.toggle('gitti', k.d === 2); });
      bul('okey-deste').textContent = deste.length;
      bul('okey-el-say').textContent = elde.length;
      bul('okey-puan').textContent = puan;
      bul('okey-odul').textContent = odulYaz(puan, 300, 400, ['Bronz', 'Gümüş', 'Altın']);
      var a = bul('okey-el'), b = bul('okey-kalan');
      bosalt(a); bosalt(b);
      var eldeki = ucluler(elde);
      eldeki.forEach(function (c) { a.appendChild(satir(c, true)); });
      if (!eldeki.length) a.appendChild(el('p', 'soluk', 'Elindeki kartlarla üçlü yok.'));
      ucluler(elde.concat(deste)).filter(function (c) { return c.u.some(function (k) { return k.d === 0; }); }).slice(0, 5).forEach(function (c) { b.appendChild(satir(c, false)); });
    }
    bul('okey-geri').addEventListener('click', function () {
      var g = gecmis.pop();
      if (!g) return;
      g.u.forEach(function (k) { k.d = 1; });
      puan -= g.p;
      ciz();
    });
    bul('okey-yeni').addEventListener('click', function () {
      kartlar.forEach(function (k) { k.d = 0; });
      gecmis = []; puan = 0;
      ciz();
    });
    ciz();
  }

  function kral() {
    if (!bul('kral')) return;
    var ALAN = { 1: 7, 2: 4, 3: 5, 4: 5, 5: 3, 6: 1 };
    var EL = [1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6];
    var durum, gecmis, secili = -1, hucreler = [];
    function ad(v) { return v === 6 ? 'K' : String(v); }
    function yeni() { durum = { alan: new Array(25).fill(0), el: 0, puan: 0, bingo: 0, bitti: false }; gecmis = []; secili = -1; }
    function kalanlar() {
      var r = {};
      Object.keys(ALAN).forEach(function (v) { r[v] = ALAN[v]; });
      durum.alan.forEach(function (v) { if (v) r[v]--; });
      return r;
    }
    var tahta = bul('kral-tahta');
    for (var i = 0; i < 25; i++) (function (i) {
      var b = el('button', 'kral-hucre', '');
      b.type = 'button';
      b.setAttribute('aria-label', (Math.floor(i / 5) + 1) + '. sıra, ' + (i % 5 + 1) + '. kart');
      b.addEventListener('click', function () {
        if (durum.alan[i] || durum.bitti) return;
        secili = i;
        ciz();
      });
      tahta.appendChild(b);
      hucreler.push(b);
    })(i);
    function ac(v) {
      gecmis.push(JSON.stringify(durum));
      var h = EL[durum.el], puansiz = bul('kral-puansiz').checked, devam = false;
      durum.alan[secili] = v;
      if (puansiz) {
        bul('kral-puansiz').checked = false;
      } else if (h === 6 && v === 6) {
        durum.puan += 100;
        durum.bitti = true;
      } else if (v !== 6 && h >= v) {
        durum.puan += v * 10;
        devam = h > v;
      }
      var dolu = 0;
      for (var s = 0; s < 5; s++) if (durum.alan.slice(s * 5, s * 5 + 5).every(Boolean)) dolu++;
      durum.puan += (dolu - durum.bingo) * 10;
      durum.bingo = dolu;
      if (!devam && !durum.bitti) durum.el++;
      if (durum.el >= EL.length || durum.alan.every(Boolean)) durum.bitti = true;
      secili = -1;
      ciz();
    }
    function ciz() {
      var r = kalanlar(), kapali = durum.alan.filter(function (v) { return !v; }).length;
      hucreler.forEach(function (b, i) {
        var v = durum.alan[i];
        b.textContent = v ? ad(v) : '';
        b.classList.toggle('acik', !!v);
        b.classList.toggle('kral-k', v === 6);
        b.classList.toggle('secili', i === secili);
        b.disabled = !!v || durum.bitti;
      });
      var e = bul('kral-el');
      bosalt(e);
      EL.forEach(function (v, i) { e.appendChild(el('span', 'mini' + (i < durum.el ? ' gitti' : i === durum.el ? ' simdi' : ''), ad(v))); });
      bul('kral-simdiki').textContent = durum.bitti ? '-' : ad(EL[durum.el]);
      bul('kral-puan').textContent = durum.puan;
      bul('kral-bingo').textContent = durum.bingo;
      bul('kral-kapali').textContent = kapali;
      bul('kral-odul').textContent = (durum.bitti ? 'Oyun bitti. ' : '') + odulYaz(durum.puan, 400, 550, ['Bronz', 'Gümüş', 'Altın']);
      var t = bul('kral-kalan');
      bosalt(t);
      [1, 2, 3, 4, 5, 6].forEach(function (v) {
        var s = el('tr');
        s.appendChild(el('td', '', ad(v)));
        s.appendChild(el('td', '', String(r[v])));
        s.appendChild(el('td', '', kapali ? '%' + Math.round(r[v] / kapali * 100) : '-'));
        t.appendChild(s);
      });
      var sans = '';
      if (!durum.bitti && kapali) {
        var h = EL[durum.el], iyi = 0;
        [1, 2, 3, 4, 5, 6].forEach(function (v) { if (h === 6 || (v <= h && v !== 6)) iyi += r[v]; });
        sans = 'Bu kartla puan alma şansı: %' + Math.round(iyi / kapali * 100);
      }
      bul('kral-sans').textContent = sans;
      var kutu = bul('kral-sec'), sec = bul('kral-secenek');
      kutu.hidden = secili < 0;
      bosalt(sec);
      if (secili >= 0) [1, 2, 3, 4, 5, 6].forEach(function (v) {
        var b = el('button', 'kral-deger', ad(v));
        b.type = 'button';
        b.disabled = r[v] <= 0;
        b.addEventListener('click', function () { ac(v); });
        sec.appendChild(b);
      });
    }
    bul('kral-vazgec').addEventListener('click', function () { secili = -1; ciz(); });
    bul('kral-geri').addEventListener('click', function () {
      var g = gecmis.pop();
      if (!g) return;
      durum = JSON.parse(g);
      secili = -1;
      ciz();
    });
    bul('kral-yeni').addEventListener('click', function () { yeni(); bul('kral-puansiz').checked = false; ciz(); });
    yeni();
    ciz();
  }

  function kusak() {
    var kok = bul('kusak');
    if (!kok) return;
    var veri = {}, girdi = bul('kusak-ekipman'), tur = bul('kusak-tur'), oran = bul('kusak-oran'), arti = bul('kusak-arti');
    function em(sayi, o) {
      if (sayi <= 0) return 0;
      var s = Math.floor(sayi * o / 100 + 1e-9);
      return s < 1 ? 1 : s;
    }
    function degerEm(d, o) {
      var a = /^(\d+)\s*-\s*(\d+)$/.exec(d);
      if (a) return em(+a[1], o) + '-' + em(+a[2], o);
      var m = /-?\d+(?:[.,]\d+)?/.exec(d);
      if (!m) return '';
      var s = parseFloat(m[0].replace(',', '.'));
      if (s < 0) return 'Geçmez';
      return /%/.test(d) ? '%' + em(s, o) : String(em(s, o));
    }
    function satir(t, a, b, c) {
      var s = el('tr');
      s.appendChild(el('td', '', a));
      s.appendChild(el('td', '', b));
      s.appendChild(el('td', '', c));
      t.appendChild(s);
    }
    function hesapla() {
      var ozel = tur.value === 'ozel';
      bul('kusak-oran-alan').hidden = !ozel;
      var o = ozel ? Math.min(25, Math.max(11, parseInt(oran.value, 10) || 11)) : +tur.value;
      var es = veri[kucult(girdi.value.trim())], t = bul('kusak-sonuc');
      bosalt(t);
      bul('kusak-baslik').textContent = 'Kuşağa geçen değerler, %' + o;
      if (es) {
        var s = es.s[+arti.value];
        es.k.forEach(function (ad, i) { if (s[i]) satir(t, ad, s[i], degerEm(s[i], o)); });
      }
      kok.querySelectorAll('.kusak-bonus').forEach(function (b, i) {
        var ad = b.querySelector('[data-bonus-ad]').value.trim(), d = b.querySelector('[data-bonus-deger]').value;
        if (d !== '') satir(t, ad || (i + 1) + '. bonus', d, degerEm(d, o));
      });
      if (!t.children.length) {
        var bos = el('tr'), h = el('td', '', 'Silah ya da zırh seç.');
        h.colSpan = 3;
        bos.appendChild(h);
        t.appendChild(bos);
      }
    }
    fetch(kok.dataset.veri).then(function (r) {
      if (!r.ok) throw new Error('veri');
      return r.json();
    }).then(function (l) {
      var d = bul('kusak-liste');
      l.forEach(function (x) {
        veri[kucult(x.a)] = x;
        var o = el('option');
        o.value = x.a;
        o.label = x.g;
        d.appendChild(o);
      });
      girdi.placeholder = 'Silah ya da zırh adı yaz';
      hesapla();
    }).catch(function () { girdi.placeholder = 'Liste yüklenemedi, sayfayı yenile'; });
    kok.addEventListener('input', hesapla);
    kok.addEventListener('submit', function (o) { o.preventDefault(); });
    hesapla();
  }

  function kostum() {
    if (!bul('kostum')) return;
    var setler = JSON.parse(bul('kostum-veri').textContent), sec = bul('kostum-set'), kutu = bul('kostum-parca');
    setler.forEach(function (s, i) {
      var o = el('option', '', s.ad);
      o.value = i;
      sec.appendChild(o);
    });
    function maddeler(d, l) {
      bosalt(d);
      l.forEach(function (x) { d.appendChild(el('li', '', x)); });
    }
    function hesapla() {
      var s = setler[+sec.value];
      if (!s) return;
      var adet = Array.prototype.filter.call(kutu.querySelectorAll('select'), function (x) { return x.value !== ''; }).length;
      var esik = Object.keys(s.bonus).map(Number).sort(function (a, b) { return a - b; });
      var aktif = esik.filter(function (x) { return x <= adet; }).pop(), sonraki = esik.filter(function (x) { return x > adet; })[0];
      bul('kostum-say').textContent = adet;
      maddeler(bul('kostum-bonus'), aktif ? s.bonus[aktif] : ['En az ' + esik[0] + ' parça gerekir.']);
      bul('kostum-sonraki-bas').textContent = sonraki ? sonraki + ' parçada' : 'En üst eşiktesin';
      maddeler(bul('kostum-sonraki'), sonraki ? s.bonus[sonraki] : []);
    }
    function parcalar() {
      var s = setler[+sec.value];
      bosalt(kutu);
      if (!s) return;
      s.yuvalar.forEach(function (y, i) {
        var l = el('label', '', (i + 1) + '. parça'), a = el('select'), b = el('option', '', 'Takılı değil');
        b.value = '';
        a.appendChild(b);
        y.forEach(function (ad) { a.appendChild(el('option', '', ad)); });
        l.appendChild(a);
        kutu.appendChild(l);
      });
      hesapla();
    }
    sec.addEventListener('change', parcalar);
    kutu.addEventListener('change', hesapla);
    parcalar();
  }

  function mob() {
    var kok = bul('mob');
    if (!kok) return;
    var veri = null, girdi = bul('mob-ara'), grup = bul('mob-grup'), durum = bul('mob-durum'), sonuc = bul('mob-sonuc');
    function bag(o, sinif) {
      var d;
      if (o.u) {
        d = el('a', sinif, o.a);
        d.href = kok.dataset.taban + o.u;
      } else {
        d = el('span', sinif, o.a);
      }
      return d;
    }
    function goster() {
      if (!veri) return;
      var a = kucult(girdi.value.trim()), g = grup.value;
      bosalt(sonuc);
      if (!a && !g) { durum.textContent = veri.length.toLocaleString('tr-TR') + ' kayıt içinde ara.'; return; }
      var l = veri.filter(function (x) { return (!g || x.g === g) && kucult(x.a).indexOf(a) > -1; });
      durum.textContent = l.length ? l.length.toLocaleString('tr-TR') + ' sonuç' + (l.length > 40 ? ', ilk 40 tanesi görünüyor.' : '.') : 'Sonuç bulunamadı.';
      l.slice(0, 40).forEach(function (x) {
        var k = el('article', 'mob-kart'), b = el('div', 'mob-bas');
        b.appendChild(bag(x, 'mob-ad'));
        b.appendChild(el('small', 'soluk', x.g + (x.l ? ' · Seviye ' + x.l : '') + (x.c ? ' · Can ' + x.c : '')));
        k.appendChild(b);
        var h = el('div', 'wiki-liste');
        if (x.h.length) x.h.forEach(function (o) { h.appendChild(bag(o)); });
        else h.appendChild(el('span', '', 'Harita bilgisi yok'));
        k.appendChild(h);
        sonuc.appendChild(k);
      });
    }
    fetch(kok.dataset.veri).then(function (r) {
      if (!r.ok) throw new Error('veri');
      return r.json();
    }).then(function (d) { veri = d; goster(); }).catch(function () { durum.textContent = 'Liste yüklenemedi, sayfayı yenileyip tekrar dene.'; });
    girdi.addEventListener('input', goster);
    grup.addEventListener('change', goster);
  }

  function meley() {
    if (!bul('meley')) return;
    var ZINDAN = 3600, YUMURTA = 120, YUZUK = 10, BEKLEME = 3 * 3600 * 1000, ANAHTAR = 'm2o-meley-bekleme';
    var ses = null, zindanBitis = 0, yumurtaBitis = 0, yuzukBitis = 0, bekleme = 0, duraklama = ZINDAN;
    function bip(f, s) {
      if (!bul('meley-ses').checked) return;
      try {
        ses = ses || new (window.AudioContext || window.webkitAudioContext)();
        var o = ses.createOscillator(), g = ses.createGain();
        o.frequency.value = f;
        g.gain.value = 0.12;
        o.connect(g);
        g.connect(ses.destination);
        o.start();
        o.stop(ses.currentTime + s);
      } catch (e) {
        bul('meley-ses').checked = false;
      }
    }
    function dk(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
    try { bekleme = parseInt(localStorage.getItem(ANAHTAR), 10) || 0; } catch (e) { bekleme = 0; }
    function saklaBekleme() {
      try {
        if (bekleme) localStorage.setItem(ANAHTAR, String(bekleme)); else localStorage.removeItem(ANAHTAR);
      } catch (e) {
        bul('meley-bekleme-btn').title = 'Bu tarayıcıda kayıt tutulamıyor';
      }
    }
    function yumurtaBaslat() { yumurtaBitis = Date.now() + YUMURTA * 1000; bul('meley-yumurta-btn').textContent = 'Yeniden başlat'; }
    function tik() {
      var n = Date.now();
      if (zindanBitis) {
        var k = (zindanBitis - n) / 1000;
        bul('meley-kalan').textContent = dk(k);
        if (k <= 0) { zindanBitis = 0; duraklama = 0; bip(440, 0.8); bul('meley-basla').textContent = 'Başlat'; }
      }
      if (yumurtaBitis) {
        var y = (yumurtaBitis - n) / 1000;
        bul('meley-yumurta').textContent = dk(y);
        if (y <= 0) { bip(880, 0.3); yumurtaBaslat(); }
      }
      if (yuzukBitis) {
        var z = Math.max(0, Math.ceil((yuzukBitis - n) / 1000));
        bul('meley-yuzuk').textContent = z;
        if (z === 0) { yuzukBitis = 0; bip(660, 0.5); }
      }
      if (bekleme && bekleme <= n) { bekleme = 0; saklaBekleme(); }
      bul('meley-bekleme').textContent = bekleme ? new Date(bekleme).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Hazır';
      bul('meley-bekleme-btn').textContent = bekleme ? 'Sıfırla' : 'Zindandan çıktım';
    }
    bul('meley-basla').addEventListener('click', function () {
      if (zindanBitis) {
        duraklama = (zindanBitis - Date.now()) / 1000;
        zindanBitis = 0;
        this.textContent = 'Devam et';
      } else {
        if (duraklama <= 0) duraklama = ZINDAN;
        zindanBitis = Date.now() + duraklama * 1000;
        this.textContent = 'Duraklat';
      }
      tik();
    });
    function asamaSec(i) {
      Array.prototype.forEach.call(bul('meley-asama').children, function (li, j) {
        li.classList.toggle('tamam', j < i);
        li.classList.toggle('simdi', j === i);
      });
      if (i === 1) yumurtaBaslat(); else if (i > 1) { yumurtaBitis = 0; bul('meley-yumurta').textContent = dk(YUMURTA); bul('meley-yumurta-btn').textContent = 'Başlat'; }
    }
    Array.prototype.forEach.call(bul('meley-asama').children, function (li, i) {
      li.querySelector('button').addEventListener('click', function () { asamaSec(i); });
    });
    bul('meley-sifirla').addEventListener('click', function () {
      zindanBitis = yumurtaBitis = yuzukBitis = 0;
      duraklama = ZINDAN;
      bul('meley-kalan').textContent = dk(ZINDAN);
      bul('meley-yumurta').textContent = dk(YUMURTA);
      bul('meley-yuzuk').textContent = YUZUK;
      bul('meley-basla').textContent = 'Başlat';
      bul('meley-yumurta-btn').textContent = 'Başlat';
      asamaSec(-1);
    });
    bul('meley-yumurta-btn').addEventListener('click', yumurtaBaslat);
    bul('meley-yuzuk-btn').addEventListener('click', function () { yuzukBitis = Date.now() + YUZUK * 1000; tik(); });
    bul('meley-bekleme-btn').addEventListener('click', function () {
      bekleme = bekleme ? 0 : Date.now() + BEKLEME;
      saklaBekleme();
      tik();
    });
    setInterval(tik, 250);
    tik();
  }

  function simulasyon() {
    var f = bul('sim');
    if (!f) return;
    var t = JSON.parse(f.dataset.tablo), DENEME = 10000, SINIR = 3000;
    var yangSut = t.kolonlar.indexOf('Yang'), malSut = t.kolonlar.indexOf('Malzeme');
    var yang = t.satirlar.map(function (s) { return yangSut < 0 ? 0 : parseInt((s[yangSut] || '0').replace(/\D/g, ''), 10) || 0; });
    var malzeme = t.satirlar.map(function (s) {
      var l = [];
      if (malSut >= 0) (s[malSut] || '').split(',').forEach(function (p) {
        var m = /^\s*(\d+)\s*x\s*(.+?)\s*$/.exec(p);
        if (m) l.push([m[2], +m[1]]);
      });
      return l;
    });
    for (var i = 0; i < t.satirlar.length; i++) {
      if (i < t.satirlar.length - 1) f.bas.appendChild(el('option', '', t.satirlar[i][0]));
      if (i > 0) f.hedef.appendChild(el('option', '', t.satirlar[i][0]));
    }
    f.hedef.selectedIndex = f.hedef.options.length - 1;
    Array.prototype.forEach.call(f.bas.options, function (o, i) { o.value = i; });
    Array.prototype.forEach.call(f.hedef.options, function (o, i) { o.value = i + 1; });
    f.addEventListener('submit', function (o) {
      o.preventDefault();
      var bas = +f.bas.value, hedef = +f.hedef.value, oran = Math.min(100, Math.max(1, +f.sans.value)) / 100, yontem = f.yontem.value;
      var kutu = bul('sim-sonuc');
      bosalt(kutu);
      kutu.hidden = false;
      if (hedef <= bas) { kutu.appendChild(el('p', '', 'Hedef, başlangıçtan yüksek olmalı.')); return; }
      var ulasan = 0, topYang = 0, topBasma = 0, top = {};
      for (var d = 0; d < DENEME; d++) {
        var a = bas, n = 0;
        while (a < hedef && n < SINIR) {
          n++;
          var s = a + 1;
          topYang += yang[s];
          malzeme[s].forEach(function (m) { top[m[0]] = (top[m[0]] || 0) + m[1]; });
          if (Math.random() < oran) a = s;
          else if (yontem === 'demirci') break;
          else if (yontem === 'kutsama') a = Math.max(0, a - 1);
        }
        topBasma += n;
        if (a === hedef) ulasan++;
      }
      var dl = el('dl', 'arac-sayac');
      [['Hedefe ulaşma', '%' + (ulasan / DENEME * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })], ['Ortalama basma', (topBasma / DENEME).toLocaleString('tr-TR', { maximumFractionDigits: 1 })], ['Ortalama yang', binlik(topYang / DENEME)]].forEach(function (x) {
        var k = el('div');
        k.appendChild(el('dt', '', x[0]));
        k.appendChild(el('dd', '', x[1]));
        dl.appendChild(k);
      });
      kutu.appendChild(dl);
      var adlar = Object.keys(top);
      if (adlar.length) {
        kutu.appendChild(el('h3', '', 'Ortalama malzeme'));
        var l = el('div', 'wiki-liste');
        adlar.forEach(function (ad) { l.appendChild(el('span', '', (top[ad] / DENEME).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + ' x ' + ad)); });
        kutu.appendChild(l);
      }
    });
  }

  function ticaret() {
    var girdi = bul('cam-ara');
    if (!girdi) return;
    var kok = bul('cam'), not = bul('cam-sonuc');
    girdi.addEventListener('input', function () {
      var a = kucult(girdi.value.trim()), top = 0;
      kok.querySelectorAll('.cam-bolum').forEach(function (b) {
        var bolum = 0;
        b.querySelectorAll('.cam-alt').forEach(function (d) {
          var alt = 0;
          d.querySelectorAll('.wiki-liste > *').forEach(function (x) {
            var uy = !a || kucult(x.textContent).indexOf(a) > -1;
            x.hidden = !uy;
            if (uy) alt++;
          });
          d.hidden = !alt;
          d.open = !!a && alt > 0 && alt <= 60;
          bolum += alt;
        });
        b.hidden = !bolum;
        top += bolum;
      });
      not.textContent = a ? (top ? top.toLocaleString('tr-TR') + ' eşya bulundu.' : 'Sonuç bulunamadı.') : '';
    });
  }

  okey();
  kral();
  kusak();
  kostum();
  mob();
  meley();
  simulasyon();
  ticaret();
}());
