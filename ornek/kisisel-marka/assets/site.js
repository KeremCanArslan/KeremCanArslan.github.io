/* Murat ERDOĞAN — kişisel marka ana sayfası
   Sektör içerikleri tek nesnede (WordPress'te tema ayarlarından ya da özel alanlardan gelecek). */
(function () {
  'use strict';

  var azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var genis = window.matchMedia('(min-width: 1080px)');
  var fareli = window.matchMedia('(hover: hover) and (pointer: fine)');
  var kok = document.documentElement;

  var SEKTOR = {
    sanayi: {
      foto: 'sanayi',
      sorgu: 'cnc işleme fason üretim',
      baslik: '{F} | CNC İşleme ve Fason Üretim | 48 Saatte Fiyat',
      aciklama: 'Teknik resminizi gönderin, 48 saat içinde fiyat verelim. Tek parçadan seri üretime <b>CNC işleme</b> ve <b>fason üretim</b>.',
      baglanti: ['Teklif iste', 'Makine parkı', 'Referanslar', 'İletişim'],
      akisMetin: 'Tek parça prototipten 10.000 adetlik seriye. Teknik resminizi gönderin, 48 saatte fiyatlayalım.',
      akisCta: 'Teklif al',
      videoMetin: 'Bu parça 6 saatte tezgâhtan çıktı. Sizinkini de gönderin.',
      videoCta: 'Teklif al',
      begeni: '8.214',
      yorum: '126',
      soru: 'Gebze civarında küçük seri CNC işleme yapan bir firma arıyorum. Nelere dikkat etmeliyim?',
      cevap: 'Önce makine parkına bak: 5 eksen tezgâh varsa karmaşık parçaları tek bağlamada işleyebilirler. Tolerans kabiliyetini, malzemeyi kendilerinin tedarik edip etmediğini ve teslim süresini sor. Aynı teknik resimle en az iki firmadan teklif almak fiyatı netleştirir.',
      reklamBaslik: 'Teknik resminize 48 saatte fiyat',
      reklamMetin: 'CNC işleme ve fason üretim, tek parçadan seri üretime.',
      seoSorgu: 'gebze cnc işleme',
      seoBaslik: '{F} | Gebze CNC İşleme Atölyesi',
      site: { baslik: 'Teknik resminizi gönderin, 48 saatte fiyat verelim.', menu: ['Hizmetler', 'Makine parkı', 'İletişim'], cta: 'Teklif iste', bilgi: ['5 eksen CNC', 'Tek parçadan seriye', 'Gebze'] }
    },
    eticaret: {
      foto: 'eticaret',
      sorgu: 'el yapımı kanvas sneaker',
      baslik: '{F} | El Yapımı Kanvas Sneaker | Aynı Gün Kargo',
      aciklama: 'Yerli üretim kanvas, el dikişi taban. <b>Sneaker</b> modellerinde 30 gün ücretsiz değişim, 2.000 TL üzeri kargo bizden.',
      baglanti: ['Yeni sezon', 'Beden rehberi', 'Kargo ve iade', 'Mağazalar'],
      akisMetin: 'Yeni sezon kutudan çıktı. Siyah kanvas, beyaz kauçuk taban, el dikişi.',
      akisCta: 'Alışverişe başla',
      videoMetin: 'Bir siparişin paketlenişi, baştan sona 40 saniye.',
      videoCta: 'Hemen al',
      begeni: '24,6 B',
      yorum: '318',
      soru: 'Günlük kullanım için rahat, yerli üretim bir sneaker önerir misin?',
      cevap: 'Rahatlık için önce taban yapısına bak: kauçuk dış taban ve yastıklı iç taban uzun yürüyüşte fark eder. Pamuklu kanvas üst ayağın nefes almasını sağlar. Beden konusunda emin değilsen ücretsiz değişim sunan markaları tercih et.',
      reklamBaslik: 'El dikişi, yerli kanvas sneaker',
      reklamMetin: 'Aynı gün kargo, 30 gün içinde ücretsiz değişim.',
      seoSorgu: 'yerli üretim kanvas sneaker',
      seoBaslik: '{F} | Yerli Üretim Kanvas Sneaker Modelleri',
      site: { baslik: 'El dikişi, yerli kanvas sneaker.', menu: ['Kadın', 'Erkek', 'Yeni sezon'], cta: 'Alışverişe başla', bilgi: ['Aynı gün kargo', '30 gün değişim', 'Güvenli ödeme'] }
    },
    egitim: {
      foto: 'egitim',
      sorgu: 'kadıköy yks hazırlık kursu',
      baslik: '{F} | YKS Hazırlık | 12 Kişilik Sınıflar',
      aciklama: 'Haftalık deneme sınavı, birebir rehberlik ve etüt. Kayıttan önce ücretsiz seviye belirleme sınavıyla <b>YKS hazırlık</b> programınızı planlayın.',
      baglanti: ['Programlar', 'Deneme sınavı', 'Ücretler', 'Şubeler'],
      akisMetin: 'Sınava 7 ay var. Seviye belirleme sınavı ücretsiz, sonucu aynı gün.',
      akisCta: 'Kayıt ol',
      videoMetin: 'Bir YKS öğrencisinin haftası: 3 deneme, 2 etüt, 1 birebir görüşme.',
      videoCta: 'Bilgi al',
      begeni: '11,3 B',
      yorum: '402',
      soru: 'Kadıköy\'de küçük sınıflı bir YKS kursu arıyorum, nasıl seçmeliyim?',
      cevap: 'Sınıf mevcuduna, deneme sınavlarının sıklığına ve rehberlik saatlerine bak. Geçen yılların yerleştirme sonuçlarını sormak da fikir verir. Kayıttan önce bir deneme dersine girmek, öğretmenle uyumu görmenin en kolay yolu.',
      reklamBaslik: '12 kişilik sınıflarda YKS hazırlık',
      reklamMetin: 'Haftalık deneme sınavı. Seviye belirleme sınavı ücretsiz.',
      seoSorgu: 'kadıköy yks kursu',
      seoBaslik: '{F} | Kadıköy YKS Hazırlık Kursu',
      site: { baslik: '12 kişilik sınıflarda YKS hazırlık.', menu: ['Programlar', 'Ücretler', 'İletişim'], cta: 'Ücretsiz deneme', bilgi: ['Haftalık deneme', 'Birebir rehberlik', 'Kadıköy'] }
    },
    turizm: {
      foto: 'turizm',
      sorgu: 'fethiye denize sıfır butik otel',
      baslik: '{F} | Denize Sıfır Butik Otel | Erken Rezervasyon',
      aciklama: 'Koya bakan 24 oda, sonsuzluk havuzu, kahvaltı dahil. Fethiye <b>butik otel</b> erken rezervasyonunda ön ödeme yok.',
      baglanti: ['Odalar', 'Fiyatlar', 'Galeri', 'Konum'],
      akisMetin: 'Sabah 8\'de havuz böyle. 2027 yazı için erken rezervasyon açıldı.',
      akisCta: 'Rezervasyon yap',
      videoMetin: 'Odadan koya 30 adım.',
      videoCta: 'Fiyatları gör',
      begeni: '41,8 B',
      yorum: '655',
      soru: 'Fethiye\'de sakin, denize sıfır ve yetişkinlere yönelik bir butik otel önerir misin?',
      cevap: 'Sakin bir tatil için oda sayısı az, yetişkinlere yönelik işletmelere bak. Koy içindeki oteller rüzgârdan daha korunaklı olur. Havalimanı transferi olup olmadığını ve kahvaltının fiyata dahil olup olmadığını önceden sor.',
      reklamBaslik: 'Fethiye, koya bakan butik otel',
      reklamMetin: 'Yetişkinlere özel 24 oda. Erken rezervasyonda ön ödeme yok.',
      seoSorgu: 'fethiye butik otel',
      seoBaslik: '{F} | Fethiye Butik Otel, Denize Sıfır',
      site: { baslik: 'Koya bakan 24 oda.', menu: ['Odalar', 'Galeri', 'Konum'], cta: 'Rezervasyon', bilgi: ['Yetişkinlere özel', 'Kahvaltı dahil', 'Fethiye'] }
    }
  };

  function svg(ic, sinif) {
    return '<svg class="ik' + (sinif ? ' ' + sinif : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>';
  }
  var IK = {
    mercek: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4 20 20"/>'),
    ucNokta: svg('<circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/>', 'ik-dolu'),
    kalp: svg('<path d="M12 19.6s-7.6-4.5-7.6-10A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.6 2.4c0 5.5-7.6 10-7.6 10Z"/>'),
    yorum: svg('<path d="M20 11.6a8 8 0 0 1-11.7 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z"/>'),
    gonder: svg('<path d="M21 3 10.2 13.8M21 3l-6.6 18-4.2-7.2L3 9.6 21 3Z"/>'),
    kaydet: svg('<path d="M6.5 3.8h11v16.6L12 16.5l-5.5 3.9V3.8Z"/>'),
    ok: svg('<path d="m9.5 6 6 6-6 6"/>'),
    kalpDolu: svg('<path d="M12 20.5s-8.5-5-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 2.7c0 6.2-8.5 11.2-8.5 11.2Z"/>', 'ik-dolu'),
    yorumDolu: svg('<path d="M12 3.5c5 0 9 3.4 9 7.7s-4 7.7-9 7.7c-1 0-2-.1-2.9-.4L4.5 20.5l1.2-3.8C4.1 15.3 3 13.4 3 11.2 3 6.9 7 3.5 12 3.5Z"/>', 'ik-dolu'),
    paylas: svg('<path d="M13.5 4.5 21 11.3l-7.5 6.8v-4C8 14 5.3 15.7 3 19.5c.6-5.9 3.9-10.4 10.5-11v-4Z"/>', 'ik-dolu'),
    yukari: svg('<path d="M12 19V5.5M5.8 11.7 12 5.5l6.2 6.2"/>'),
    kilit: svg('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>'),
    geri: svg('<path d="m14.5 6-6 6 6 6"/>'),
    ileri: svg('<path d="m9.5 6 6 6-6 6"/>')
  };

  /* ---------- durum ---------- */
  var durum = { firma: '', sektor: 'sanayi' };
  try {
    var kayitli = JSON.parse(sessionStorage.getItem('me-durum') || 'null');
    if (kayitli && typeof kayitli.firma === 'string' && Object.prototype.hasOwnProperty.call(SEKTOR, kayitli.sektor)) {
      durum.firma = kayitli.firma.slice(0, 28);
      durum.sektor = kayitli.sektor;
    }
  } catch (e) { /* tarayıcı depolamayı kapatmışsa varsayılanla devam */ }

  function kaydet() {
    try { sessionStorage.setItem('me-durum', JSON.stringify(durum)); } catch (e) { /* yok sayılır, sayfa depolamasız çalışır */ }
  }

  function ad() { return durum.firma.trim() || 'Firmanız'; }
  function bos() { return !durum.firma.trim(); }
  function harf() { return ad().charAt(0).toLocaleUpperCase('tr'); }
  function slug() {
    var m = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
    var s = ad().toLocaleLowerCase('tr').replace(/[çğıöşüâîû]/g, function (c) { return m[c]; });
    s = s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 24);
    return s || 'firmaniz';
  }
  function alan() { return slug() + '.com.tr'; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slotHTML() { return '<span class="slot' + (bos() ? ' bos' : '') + '" data-k="slot">' + esc(ad()) + '</span>'; }
  function yerlestir(kalip) { return kalip.split('{F}').map(esc).join(slotHTML()); }
  function sek() { return SEKTOR[durum.sektor]; }

  /* ---------- yüzeyler ---------- */
  /* Google ve SEO sahnesi çerçevesiz: havada duran arama kutusu, altında sonuç kartı (koyu tema) */
  function aramaKutusu(sorgu) {
    return '<div class="ys-kutu">' + IK.mercek + '<span class="ys-sorgu" data-sorgu="' + esc(sorgu) + '">' + esc(sorgu) + '</span><span class="imlec"></span></div>';
  }
  function arama(s) {
    return '<div class="ys ys-ara">' + aramaKutusu(s.sorgu) +
      '<div class="ys-sonuc">' +
        '<p class="ys-sponsor">Sponsorlu</p>' +
        '<div class="ys-kaynak"><span class="fav" data-k="harf">' + esc(harf()) + '</span><span><b>' + slotHTML() + '</b><small>https://www.<span data-k="alan">' + esc(alan()) + '</span></small></span></div>' +
        '<p class="ys-baslik">' + yerlestir(s.baslik) + '</p>' +
        '<p class="ys-aciklama">' + s.aciklama + '</p>' +
        '<p class="ys-baglanti">' + s.baglanti.map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '</p>' +
      '</div>' +
    '</div>';
  }

  function seo(s) {
    var satirlar = '';
    for (var i = 0; i < 3; i++) {
      satirlar += '<li class="sira-satir" style="--i:' + i + '"><span class="sira-no">' + (i + 1) + '</span><div class="sira-ic"><span class="isk isk-a"></span><span class="isk isk-b"></span></div></li>';
    }
    satirlar += '<li class="sira-satir sira-firma" style="--i:3"><span class="sira-no">4</span><div class="sira-ic">' +
      '<p class="sira-alan"><span class="fav" data-k="harf">' + esc(harf()) + '</span><span data-k="alan">' + esc(alan()) + '</span></p>' +
      '<p class="sira-baslik">' + yerlestir(s.seoBaslik) + '</p></div><span class="sira-rozet">1. sıra</span></li>';
    return '<div class="ys ys-seo">' + aramaKutusu(s.seoSorgu) + '<ol class="sira">' + satirlar + '</ol></div>';
  }

  function akis(s) {
    return '<div class="akis">' +
      '<div class="akis-bas"><span class="avatar" data-k="harf">' + esc(harf()) + '</span><p class="akis-ad"><b>' + slotHTML() + '</b><small>Sponsorlu</small></p>' + IK.ucNokta + '</div>' +
      '<img class="akis-foto" src="img/' + s.foto + '-akis.webp" alt="" width="960" height="1200" loading="lazy" decoding="async" draggable="false">' +
      '<div class="akis-cta"><span>' + esc(s.akisCta) + '</span>' + IK.ok + '</div>' +
      '<div class="akis-eylem">' + IK.kalp + IK.yorum + IK.gonder + '<span class="bosluk"></span>' + IK.kaydet + '</div>' +
      '<p class="akis-metin"><b data-k="handle">' + esc(slug()) + '</b> ' + esc(s.akisMetin) + '</p>' +
      '<div class="akis-sonraki"><i></i><span class="isk isk-a"></span></div>' +
    '</div>';
  }

  function hikaye(s) {
    return '<div class="hikaye">' +
      '<img class="hikaye-foto" src="img/' + s.foto + '-dikey.webp" alt="" width="720" height="1280" loading="lazy" decoding="async" draggable="false">' +
      '<div class="hikaye-cubuk"><span></span><span></span><span></span></div>' +
      '<div class="hikaye-bas"><span class="avatar" data-k="harf">' + esc(harf()) + '</span><p><b>' + slotHTML() + '</b><small>Sponsorlu</small></p></div>' +
      '<div class="hikaye-alt"><p class="hikaye-metin">' + esc(s.akisMetin) + '</p><span class="hikaye-cta">' + esc(s.akisCta) + '</span></div>' +
    '</div>';
  }

  function video(s) {
    return '<div class="video">' +
      '<img class="video-foto" src="img/' + s.foto + '-dikey.webp" alt="" width="720" height="1280" loading="lazy" decoding="async" draggable="false">' +
      '<div class="video-ilerleme"><span></span></div>' +
      '<div class="video-yan">' +
        '<span class="avatar avatar-video"><span data-k="harf">' + esc(harf()) + '</span><i>+</i></span>' +
        '<span class="video-ik">' + IK.kalpDolu + '<small>' + esc(s.begeni) + '</small></span>' +
        '<span class="video-ik">' + IK.yorumDolu + '<small>' + esc(s.yorum) + '</small></span>' +
        '<span class="video-ik">' + IK.paylas + '<small>Paylaş</small></span>' +
      '</div>' +
      '<div class="video-alt">' +
        '<p class="video-ad">@<span data-k="handle">' + esc(slug()) + '</span></p>' +
        '<p class="video-metin">' + esc(s.videoMetin) + ' <span class="video-sponsor">Sponsorlu</span></p>' +
        '<span class="video-cta">' + esc(s.videoCta) + IK.ok + '</span>' +
      '</div>' +
    '</div>';
  }

  function sohbet(s) {
    return '<div class="ys ys-soh">' +
      '<div class="soh-akis">' +
        '<p class="soh-soru">' + esc(s.soru) + '</p>' +
        '<p class="soh-cevap" data-cevap="' + esc(s.cevap) + '">' + esc(s.cevap) + '</p>' +
        '<div class="soh-reklam">' +
          '<p class="soh-etiket"><span>Sponsorlu</span>' + IK.ucNokta + '</p>' +
          '<div class="soh-satir">' +
            '<img class="soh-gorsel" src="img/' + s.foto + '-akis.webp" alt="" width="960" height="1200" loading="lazy" decoding="async" draggable="false">' +
            '<div class="soh-yazi"><p class="soh-marka"><span class="fav" data-k="harf">' + esc(harf()) + '</span>' + slotHTML() + '</p>' +
            '<p class="soh-baslik">' + esc(s.reklamBaslik) + '</p><p class="soh-metin">' + esc(s.reklamMetin) + '</p></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="soh-girdi"><span>Bir şey sorun</span><span class="soh-gonder">' + IK.yukari + '</span></div>' +
    '</div>';
  }

  function siteOnizleme(s) {
    var w = s.site;
    return '<div class="tarayici">' +
      '<div class="t-ust"><span class="t-geri">' + IK.geri + IK.ileri + '</span><span class="t-adres">' + IK.kilit + '<span data-k="alan">' + esc(alan()) + '</span></span></div>' +
      '<div class="t-site">' +
        '<div class="ts-menu"><span class="ts-logo">' + slotHTML() + '</span><span class="ts-linkler">' + w.menu.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</span><span class="ts-cta">' + esc(w.cta) + '</span></div>' +
        '<div class="ts-hero"><img src="img/' + s.foto + '-yatay.webp" alt="" width="1600" height="1000" loading="lazy" decoding="async" draggable="false"><div class="ts-hero-ic"><p class="ts-baslik">' + esc(w.baslik) + '</p><span class="ts-dugme">' + esc(w.cta) + '</span></div></div>' +
        '<div class="ts-bilgi">' + w.bilgi.map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '</div>' +
      '</div>' +
    '</div>';
  }

  /* firma adı yazılırken yalnız ad geçen yerler güncellenir; fotoğraflar yeniden yüklenmez */
  function adGuncelle() {
    var a = ad(), h = harf(), al = alan(), sl = slug(), b = bos();
    document.querySelectorAll('[data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k');
      clearTimeout(el._zaman);
      if (k === 'slot') {
        el.textContent = a;
        el.classList.toggle('bos', b);
      } else if (k === 'harf') el.textContent = h;
      else if (k === 'alan') el.textContent = al;
      else if (k === 'handle') el.textContent = sl;
    });
  }

  /* ---------- sahne içi hareketler ---------- */
  function yaz(el, metin, gecikme, bitince) {
    clearTimeout(el._zaman);
    if (azalt) { el.textContent = metin; if (bitince) bitince(); return; }
    el.textContent = '';
    var i = 0;
    function adim() {
      i++;
      el.textContent = metin.slice(0, i);
      if (i < metin.length) el._zaman = setTimeout(adim, 55 + Math.random() * 55);
      else if (bitince) el._zaman = setTimeout(bitince, 260);
    }
    el._zaman = setTimeout(adim, gecikme || 0);
  }

  function siraTirman(liste, bitince) {
    if (!liste) return;
    clearTimeout(liste._zaman);
    var firma = liste.querySelector('.sira-firma');
    var sira = Array.prototype.slice.call(liste.children).filter(function (li) { return li !== firma; });
    sira.push(firma);
    liste.classList.remove('tamam');
    function yerlestirSira() {
      sira.forEach(function (li, i) {
        li.style.setProperty('--i', i);
        li.querySelector('.sira-no').textContent = i + 1;
      });
    }
    yerlestirSira();
    if (azalt) {
      sira.pop();
      sira.unshift(firma);
      yerlestirSira();
      liste.classList.add('tamam');
      return;
    }
    var konum = sira.length - 1;
    function adim() {
      if (konum === 0) {
        liste.classList.add('tamam');
        if (bitince) liste._zaman = setTimeout(bitince, 250);
        return;
      }
      var ust = sira[konum - 1];
      sira[konum - 1] = firma;
      sira[konum] = ust;
      konum--;
      yerlestirSira();
      liste._zaman = setTimeout(adim, 480);
    }
    liste._zaman = setTimeout(adim, 450);
  }

  function cevapAk(kap, bitince) {
    var p = kap.querySelector('.soh-cevap');
    var reklam = kap.querySelector('.soh-reklam');
    if (!p || !reklam) return;
    clearTimeout(p._zaman);
    var metin = p.getAttribute('data-cevap');
    if (azalt) { p.textContent = metin; reklam.classList.remove('gizli'); return; }
    var kelimeler = metin.split(' ');
    var i = 0;
    p.textContent = '';
    reklam.classList.add('gizli');
    function adim() {
      i++;
      p.textContent = kelimeler.slice(0, i).join(' ');
      if (i < kelimeler.length) p._zaman = setTimeout(adim, 40);
      else p._zaman = setTimeout(function () {
        reklam.classList.remove('gizli');
        if (bitince) p._zaman = setTimeout(bitince, 300);
      }, 260);
    }
    p._zaman = setTimeout(adim, 600);
  }

  /* imleç sahneye girip reklama tıklar (telefonda parmak dokunuşu); hareket azaltmada hiç çıkmaz */
  var FARE = '<span class="fare" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5.5 3.2v15.6l4.2-4 2.8 6.3 2.7-1.2-2.8-6.2h5.9L5.5 3.2Z"/></svg></span>';
  function fareGotur(kap, secici, gecikme) {
    if (azalt) return;
    var fare = kap.querySelector('.fare');
    var hedef = kap.querySelector(secici);
    if (!fare || !hedef) return;
    clearTimeout(fare._zaman);
    fare._zaman = setTimeout(function () {
      var k = kap.getBoundingClientRect();
      var h = hedef.getBoundingClientRect();
      if (!k.width || !h.width) return;
      fare.style.transform = 'translate(' + Math.round(k.width * .8) + 'px,' + Math.round(k.height * .96) + 'px)';
      void fare.offsetWidth;
      fare.classList.add('gel');
      var x = h.left - k.left + Math.min(h.width * .4, 70);
      var y = h.top - k.top + h.height * .62;
      fare.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      fare._zaman = setTimeout(function () {
        fare.classList.add('tik');
        hedef.classList.add('basildi');
      }, 950);
    }, gecikme || 0);
  }

  /* arama: sorgu harf harf yazılır, sonuç kartı oturur, imleç sponsorlu sonuca tıklar */
  function hareketBaslat(kap, y) {
    var ys = kap.querySelector('.ys-ara, .ys-seo');
    var sorgu = kap.querySelector('.ys-sorgu');
    if ((y === 'arama' || y === 'seo') && ys && sorgu) {
      ys.classList.add('bekle');
      yaz(sorgu, sorgu.getAttribute('data-sorgu'), 450, function () {
        ys.classList.remove('bekle');
        if (y === 'seo') siraTirman(kap.querySelector('.sira'), function () { fareGotur(kap, '.sira-firma .sira-baslik', 150); });
        else fareGotur(kap, '.ys-baslik', 650);
      });
    }
    if (y === 'sohbet') cevapAk(kap, function () { fareGotur(kap, '.soh-baslik', 0); });
    if (y === 'akis') fareGotur(kap, '.akis-cta span', 1500);
    if (y === 'video') fareGotur(kap, '.video-cta', 1800);
    if (y === 'web') {
      var t = kap.querySelector('.tarayici');
      var adres = kap.querySelector('.t-adres [data-k="alan"]');
      if (t && adres) {
        t.classList.add('bekle');
        yaz(adres, alan(), 350, function () {
          t.classList.remove('bekle');
          fareGotur(kap, '.ts-dugme', 700);
        });
      }
    }
    var v = kap.querySelector('.video');
    if (v) v.classList.add('oynuyor');
  }

  /* ---------- vitrin: altı kanal, tek sahne ---------- */
  var YUZEYLER = ['arama', 'akis', 'video', 'sohbet', 'seo', 'web'];
  var KANAL_AD = ['Google Ads', 'Meta Ads', 'TikTok Ads', 'ChatGPT Ads', 'SEO', 'Web sitesi'];
  var YUZEY_AD = ['Google araması', 'Instagram akışı ve hikâye', 'TikTok, Sana Özel', 'ChatGPT cevabı', 'Google organik sonuçlar', 'Size özel web sitesi'];
  var YUZEY_RENK = ['#4f8bf9', '#e1306c', '#fe2c55', '#10a37f', '#34a853', '#ff5b22'];
  var OZET = [
    'Google aramasında sponsorlu sonuç önizlemesi',
    'Instagram akışında ve hikâyede sponsorlu gönderi önizlemesi',
    'TikTok akışında sponsorlu dikey video önizlemesi',
    'ChatGPT cevabının altında sponsorlu kutu önizlemesi',
    'Google organik sonuçlarında birinci sıra önizlemesi',
    'Size özel web sitesi önizlemesi'
  ];
  var SAHNE = {
    arama: function (s) { return '<div class="gorsel gorsel-yuzen">' + arama(s) + '</div>'; },
    akis: function (s) { return '<div class="gorsel gorsel-akis"><div class="kart kart-akis">' + akis(s) + '</div><div class="kart kart-hikaye">' + hikaye(s) + '</div></div>'; },
    video: function (s) { return '<div class="gorsel gorsel-video"><div class="kart">' + video(s) + '</div></div>'; },
    sohbet: function (s) { return '<div class="gorsel gorsel-yuzen gorsel-soh">' + sohbet(s) + '</div>'; },
    seo: function (s) { return '<div class="gorsel gorsel-yuzen">' + seo(s) + '</div>'; },
    web: function (s) { return '<div class="gorsel gorsel-web">' + siteOnizleme(s) + '</div>'; }
  };

  var vitrin = document.getElementById('vitrin');
  var sahne = document.getElementById('sahne');
  var sahneOzet = document.getElementById('sahne-ozet');
  var yuzeyAd = document.getElementById('yuzey-ad');
  var kanalKap = document.getElementById('kanallar');
  var kanallar = vitrin ? Array.prototype.slice.call(vitrin.querySelectorAll('.kanal')) : [];
  var N = kanallar.length;
  var aktif = 0;

  function sahneCiz(i, ilk) {
    if (!sahne) return;
    var y = YUZEYLER[i];
    var yeni = document.createElement('div');
    yeni.className = 'katman' + (ilk || azalt ? '' : ' gir');
    yeni.innerHTML = SAHNE[y](sek()) + (azalt ? '' : FARE);
    Array.prototype.slice.call(sahne.children).forEach(function (eski) {
      /* zaten çıkan katmanın silme sırası bozulmaz; hızlı geçişte katman birikmez */
      if (eski.classList.contains('cik')) return;
      eski.classList.add('cik');
      [eski].concat(Array.prototype.slice.call(eski.querySelectorAll('*'))).forEach(function (el) { if (el._zaman) clearTimeout(el._zaman); });
      eski._sil = setTimeout(function () { if (eski.parentNode) eski.parentNode.removeChild(eski); }, azalt ? 0 : 500);
    });
    sahne.appendChild(yeni);
    hareketBaslat(yeni, y);
  }

  function kanalCubugaKaydir(b) {
    if (!kanalKap || kanalKap.scrollWidth <= kanalKap.clientWidth) return;
    var hedef = b.getBoundingClientRect().left - kanalKap.getBoundingClientRect().left + kanalKap.scrollLeft - (kanalKap.clientWidth - b.offsetWidth) / 2;
    try { kanalKap.scrollTo({ left: Math.max(0, hedef), behavior: azalt ? 'auto' : 'smooth' }); }
    catch (e) { kanalKap.scrollLeft = Math.max(0, hedef); }
  }

  function goster(i, kullanici, ilk) {
    if (!N) return;
    i = ((i % N) + N) % N;
    aktif = i;
    kanallar.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    if (yuzeyAd) yuzeyAd.textContent = YUZEY_AD[i];
    if (vitrin) vitrin.style.setProperty('--kanal-renk', YUZEY_RENK[i]);
    if (sahneOzet && kullanici) sahneOzet.textContent = KANAL_AD[i] + ': ' + OZET[i];
    sahneCiz(i, ilk);
    kanalCubugaKaydir(kanallar[i]);
  }

  /* kendiliğinden geçiş: fare üstünde, klavye odağında, ekran dışında ve sekme gizliyken durur */
  var SURE = 7400;
  var ELLE_SURE = 11000;
  var durduruldu = azalt;
  var ustunde = false, odakta = false, gorunur = true;
  var elleOynatildi = false; /* kullanıcı oynat dediyse klavye odağı geçişi durdurmaz */
  var otoZaman = null;
  var durDugme = vitrin ? vitrin.querySelector('.v-dur') : null;

  function otoKur(bekle) {
    clearTimeout(otoZaman);
    if (!vitrin) return;
    vitrin.classList.remove('oynuyor');
    var calisiyor = !(durduruldu || ustunde || odakta || !gorunur || document.hidden);
    if (!calisiyor) return;
    var t = bekle || SURE;
    vitrin.style.setProperty('--sure', t + 'ms');
    void vitrin.offsetWidth;
    vitrin.classList.add('oynuyor');
    otoZaman = setTimeout(function () {
      goster(aktif + 1);
      otoKur();
    }, t);
  }

  function elle(i) {
    goster(i, true);
    otoKur(ELLE_SURE);
  }

  if (vitrin && N) {
    kanallar.forEach(function (b, i) {
      b.addEventListener('click', function () { elle(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var hedef = (i + (e.key === 'ArrowRight' ? 1 : N - 1)) % N;
        kanallar[hedef].focus();
        elle(hedef);
      });
    });
    var onceki = vitrin.querySelector('.v-onceki');
    var sonraki = vitrin.querySelector('.v-sonraki');
    if (onceki) onceki.addEventListener('click', function () { elle(aktif - 1); });
    if (sonraki) sonraki.addEventListener('click', function () { elle(aktif + 1); });

    if (durDugme) {
      var durGuncelle = function () {
        durDugme.setAttribute('aria-pressed', durduruldu ? 'true' : 'false');
        vitrin.classList.toggle('durdu', durduruldu);
      };
      durGuncelle();
      durDugme.addEventListener('click', function () {
        durduruldu = !durduruldu;
        elleOynatildi = !durduruldu;
        if (!durduruldu) odakta = false;
        durGuncelle();
        otoKur();
      });
    }

    /* sahnede parmakla ya da fareyle yatay çekince sonraki/önceki kanal */
    var basX = 0, basY = 0, isaretci = null;
    sahne.addEventListener('pointerdown', function (e) {
      isaretci = (e.pointerType === 'mouse' && e.button !== 0) ? null : e.pointerId;
      basX = e.clientX;
      basY = e.clientY;
    });
    sahne.addEventListener('pointerup', function (e) {
      if (e.pointerId !== isaretci) return;
      isaretci = null;
      var dx = e.clientX - basX, dy = e.clientY - basY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) elle(aktif + (dx < 0 ? 1 : -1));
    });
    sahne.addEventListener('pointercancel', function () { isaretci = null; });
    sahne.addEventListener('dragstart', function (e) { e.preventDefault(); });

    var sahneVeCubuk = [sahne, vitrin.querySelector('.kanal-cubuk')];
    sahneVeCubuk.forEach(function (el) {
      if (!el) return;
      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { ustunde = true; otoKur(); } });
      el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { ustunde = false; otoKur(ELLE_SURE); } });
    });
    /* fareyle tıklanan düğme odak alsa da geçiş durmaz; klavyeyle gelen odakta durur */
    var klavyeOdagi = function (el) {
      try { return el.matches(':focus-visible'); } catch (hata) { return true; }
    };
    vitrin.addEventListener('focusin', function (e) { odakta = !elleOynatildi && klavyeOdagi(e.target); otoKur(); });
    vitrin.addEventListener('focusout', function (e) {
      if (vitrin.contains(e.relatedTarget)) return;
      odakta = false;
      otoKur(ELLE_SURE);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (girdiler) {
        gorunur = girdiler[0].intersectionRatio >= 0.25;
        otoKur();
      }, { threshold: [0, 0.25] }).observe(vitrin);
    }
    document.addEventListener('visibilitychange', function () { otoKur(); });
  }

  /* ---------- firma adı ve sektör ---------- */
  var girdi = document.getElementById('firma-adi');
  var formFirma = document.getElementById('f-firma');
  var formFirmaElle = false;
  var yenidenOyna = null;
  if (formFirma) formFirma.addEventListener('input', function () { formFirmaElle = true; });

  function formaAktar() {
    if (formFirma && !formFirmaElle) formFirma.value = durum.firma.trim();
  }
  function firmaYazilari() {
    document.querySelectorAll('[data-firma-yaz]').forEach(function (el) { el.innerHTML = slotHTML(); });
  }

  if (girdi) {
    girdi.value = durum.firma;
    girdi.addEventListener('input', function () {
      durum.firma = girdi.value.slice(0, 28);
      kaydet();
      adGuncelle();
      formaAktar();
      /* yazmayı bırakınca sahne yeni adla baştan oynar */
      clearTimeout(yenidenOyna);
      yenidenOyna = setTimeout(function () { goster(aktif); otoKur(ELLE_SURE); }, 700);
    });
  }
  document.querySelectorAll('input[name="sektor"]').forEach(function (r) {
    r.checked = r.value === durum.sektor;
    r.addEventListener('change', function () {
      if (!r.checked) return;
      durum.sektor = r.value;
      kaydet();
      goster(aktif);
      otoKur(ELLE_SURE);
    });
  });

  /* ---------- üst menü ---------- */
  var ust = document.getElementById('ust');
  var menuAc = document.querySelector('.menu-ac');
  var menu = document.getElementById('menu');
  var acilirlar = Array.prototype.slice.call(document.querySelectorAll('.menu-oge.acilir'));
  var arkaPlan = [document.getElementById('icerik'), document.querySelector('.alt'), document.querySelector('.hizli')];

  function panelKapat(li, odakGeri) {
    var b = li.querySelector('.menu-dugme');
    if (b.getAttribute('aria-expanded') !== 'true') return;
    b.setAttribute('aria-expanded', 'false');
    if (odakGeri) b.focus();
  }
  function panelAc(li) {
    acilirlar.forEach(function (o) { if (o !== li) panelKapat(o); });
    li.querySelector('.menu-dugme').setAttribute('aria-expanded', 'true');
  }
  function hepsiniKapat() { acilirlar.forEach(function (li) { panelKapat(li); }); }

  acilirlar.forEach(function (li) {
    var b = li.querySelector('.menu-dugme');
    var kapatZaman = null;
    var sonIsaretci = '';
    var baglar = Array.prototype.slice.call(li.querySelectorAll('.menu-panel a'));
    b.addEventListener('pointerdown', function (e) { sonIsaretci = e.pointerType; });
    b.addEventListener('click', function (e) {
      var acik = b.getAttribute('aria-expanded') === 'true';
      /* masaüstünde panel fareyle üstüne gelince zaten açılır; düğmeye tıklamak onu kapatmaz */
      var fareTiki = e.detail > 0 && sonIsaretci === 'mouse' && genis.matches;
      if (acik && !fareTiki) panelKapat(li);
      else panelAc(li);
    });
    /* klavye: aşağı ok paneli açıp ilk bağlantıya, panelde aşağı/yukarı ok bağlantılar arasında gezer */
    b.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' || !baglar.length) return;
      e.preventDefault();
      panelAc(li);
      baglar[0].focus();
    });
    baglar.forEach(function (a, i) {
      a.addEventListener('keydown', function (e) {
        var h = null;
        if (e.key === 'ArrowDown') h = baglar[(i + 1) % baglar.length];
        else if (e.key === 'ArrowUp') h = i === 0 ? b : baglar[i - 1];
        else if (e.key === 'Home') h = baglar[0];
        else if (e.key === 'End') h = baglar[baglar.length - 1];
        if (h) { e.preventDefault(); h.focus(); }
      });
    });
    li.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' || !genis.matches || !fareli.matches) return;
      clearTimeout(kapatZaman);
      panelAc(li);
    });
    li.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse' || !genis.matches || !fareli.matches) return;
      kapatZaman = setTimeout(function () { panelKapat(li); }, 160);
    });
    li.addEventListener('focusout', function (e) {
      if (genis.matches && !li.contains(e.relatedTarget)) panelKapat(li);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu-oge.acilir') && genis.matches) hepsiniKapat();
  });

  function arkaPlanKilit(kilit) {
    arkaPlan.forEach(function (el) { if (el) el.inert = kilit; });
    document.body.style.overflow = kilit ? 'hidden' : '';
  }
  function menuKapat(odakGeri) {
    if (!menu || !menu.classList.contains('acik')) return;
    menu.classList.remove('acik');
    menuAc.setAttribute('aria-expanded', 'false');
    arkaPlanKilit(false);
    if (odakGeri) menuAc.focus();
  }
  if (menuAc && menu) {
    menuAc.addEventListener('click', function () {
      var acik = menu.classList.toggle('acik');
      menuAc.setAttribute('aria-expanded', acik ? 'true' : 'false');
      arkaPlanKilit(acik);
      if (!acik) hepsiniKapat();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menuKapat(false); hepsiniKapat(); });
    });
    genis.addEventListener('change', function () { menuKapat(false); hepsiniKapat(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var acikPanel = acilirlar.filter(function (li) { return li.querySelector('.menu-dugme').getAttribute('aria-expanded') === 'true'; })[0];
    if (acikPanel) { panelKapat(acikPanel, true); return; }
    menuKapat(true);
  });

  function ustGuncelle() { if (ust) ust.classList.toggle('kaydi', window.scrollY > 8); }
  window.addEventListener('scroll', ustGuncelle, { passive: true });
  ustGuncelle();

  /* ---------- formu dolduran bağlantılar ---------- */
  var paketSecim = document.getElementById('f-paket');
  var mesajAlan = document.getElementById('f-mesaj');
  var sonOtoMesaj = '';
  function hizmetIsaretle(deger) {
    var kutu = document.querySelector('input[name="hizmet"][value="' + (window.CSS && CSS.escape ? CSS.escape(deger) : deger) + '"]');
    if (kutu) kutu.checked = true;
  }
  function mesajYaz(metin) {
    if (!mesajAlan) return;
    /* kişinin kendi yazdığı mesajın üstüne yazılmaz */
    if (mesajAlan.value.trim() && mesajAlan.value !== sonOtoMesaj) return;
    mesajAlan.value = metin;
    sonOtoMesaj = metin;
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-paket], [data-hizmet], [data-mesaj]');
    if (!el) return;
    if (el.hasAttribute('data-paket') && paketSecim) paketSecim.value = el.getAttribute('data-paket');
    if (el.hasAttribute('data-hizmet')) hizmetIsaretle(el.getAttribute('data-hizmet'));
    if (el.hasAttribute('data-mesaj')) mesajYaz(el.getAttribute('data-mesaj'));
  });

  /* ---------- sekmeler: paketler ve alt kısımdaki bağlantı grupları ---------- */
  function sekmeGrubu(sekmeler, sonra) {
    function sec(hedef, odakla) {
      sekmeler.forEach(function (s) {
        var a = s === hedef;
        s.setAttribute('aria-selected', a ? 'true' : 'false');
        s.tabIndex = a ? 0 : -1;
        var panel = document.getElementById(s.getAttribute('aria-controls'));
        if (panel) panel.hidden = !a;
      });
      if (odakla) hedef.focus();
      if (sonra) sonra(hedef);
    }
    sekmeler.forEach(function (s, i) {
      s.addEventListener('click', function () { sec(s); });
      s.addEventListener('keydown', function (e) {
        var n = sekmeler.length, h = null;
        if (e.key === 'ArrowRight') h = sekmeler[(i + 1) % n];
        else if (e.key === 'ArrowLeft') h = sekmeler[(i + n - 1) % n];
        else if (e.key === 'Home') h = sekmeler[0];
        else if (e.key === 'End') h = sekmeler[n - 1];
        if (h) { e.preventDefault(); sec(h, true); }
      });
    });
    return sec;
  }
  var paketSekmeleri = Array.prototype.slice.call(document.querySelectorAll('.paket-sekme'));
  var paketSec = paketSekmeleri.length ? sekmeGrubu(paketSekmeleri) : null;
  var ksSekmeleri = Array.prototype.slice.call(document.querySelectorAll('.ks'));
  /* keşfet sekmesi tıklamayla ya da ok tuşuyla seçilince açık arama temizlenir, seçilen grup görünür */
  if (ksSekmeleri.length) sekmeGrubu(ksSekmeleri, function () { kesfetAramaTemizle(); });
  /* olay yetkisi: arama sonucunda kopyalanan bağlantılar da çalışır */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-paket-sekme]');
    if (!a) return;
    var hedef = document.getElementById(a.getAttribute('data-paket-sekme') === 'web' ? 'ps-web' : 'ps-reklam');
    if (hedef && paketSec) paketSec(hedef);
  });

  /* keşfet: bağlantı arama, üç gruptaki bağlantıları birlikte süzer */
  function kesfetAramaTemizle() {
    var g = document.getElementById('k-ara');
    if (!g || !g.value) return;
    g.value = '';
    g.dispatchEvent(new Event('input'));
  }
  var kAra = document.getElementById('k-ara');
  var kSonuc = document.getElementById('kp-ara');
  var kesfet = document.querySelector('.kesfet');
  if (kAra && kSonuc && kesfet) {
    var kListe = kSonuc.querySelector('.kb-izgara');
    var kYok = kSonuc.querySelector('.kesfet-yok');
    var kDurum = document.getElementById('k-ara-durum');
    var kBaglar = Array.prototype.slice.call(kesfet.querySelectorAll('.kesfet-panel:not(#kp-ara) .kb-izgara > li'));
    var kucult = function (t) { return t.toLocaleLowerCase('tr').replace(/\s+/g, ' ').trim(); };
    kAra.addEventListener('input', function () {
      var q = kucult(kAra.value);
      kListe.innerHTML = '';
      if (!q) {
        kesfet.classList.remove('aramada');
        kSonuc.hidden = true;
        if (kDurum) kDurum.textContent = '';
        return;
      }
      var gorulen = {};
      kBaglar.forEach(function (li) {
        var ad = kucult(li.textContent);
        if (ad.indexOf(q) === -1 || gorulen[ad]) return;
        gorulen[ad] = true;
        kListe.appendChild(li.cloneNode(true));
      });
      var n = kListe.children.length;
      kesfet.classList.add('aramada');
      kSonuc.hidden = false;
      kYok.hidden = n > 0;
      if (kDurum) kDurum.textContent = n ? n + ' bağlantı bulundu' : 'Eşleşen bağlantı yok';
    });
  }

  /* ---------- detay pencereleri: hizmet, yazılım, blog, sözleşme ---------- */
  function pencereAc(d) {
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); }
    else d.setAttribute('open', '');
    kok.style.overflow = 'hidden';
    var ic = d.querySelector('.dt-ic');
    if (d.scrollTop) d.scrollTop = 0;
    if (ic) ic.scrollTop = 0;
  }
  function pencereKapat(d) {
    if (typeof d.close === 'function') { if (d.open) d.close(); }
    else d.removeAttribute('open');
    kok.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var tetik = e.target.closest('[data-detay]');
    if (!tetik) return;
    var d = document.getElementById(tetik.getAttribute('data-detay'));
    if (!d) return;
    e.preventDefault();
    /* menüden açılan pencere kapanınca odak gizlenen bağlantıya değil menü düğmesine döner */
    var oge = tetik.closest('.menu-oge.acilir');
    if (menu && menu.classList.contains('acik') && menu.contains(tetik)) d._donus = menuAc;
    else if (oge) d._donus = oge.querySelector('.menu-dugme');
    else d._donus = null;
    menuKapat(false);
    hepsiniKapat();
    pencereAc(d);
  });
  document.querySelectorAll('dialog.detay').forEach(function (d) {
    var kapat = d.querySelector('.dt-kapat');
    if (kapat) kapat.addEventListener('click', function () { pencereKapat(d); });
    d.addEventListener('click', function (e) { if (e.target === d) pencereKapat(d); });
    d.addEventListener('close', function () {
      kok.style.overflow = '';
      var donus = d._donus;
      d._donus = null;
      if (donus) donus.focus();
    });
    /* pencere içindeki "teklif al" bağlantısı pencereyi kapatıp forma gider */
    d.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () { d._donus = null; pencereKapat(d); });
    });
  });

  /* ---------- iletişim formu ---------- */
  var form = document.getElementById('analiz-form');
  var tamam = document.getElementById('form-tamam');
  function hataGoster(alanId, goster) {
    var el = document.getElementById(alanId);
    var hata = document.getElementById(alanId + '-hata');
    if (!el || !hata) return;
    hata.hidden = !goster;
    var kutu = el.closest('.alan');
    if (kutu) kutu.classList.toggle('gecersiz', goster);
    if (goster) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', alanId + '-hata');
    } else {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    }
  }
  var EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (form && tamam) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var adSoyad = form.elements.ad.value.trim();
      var tel = form.elements.telefon.value.replace(/\D/g, '');
      var eposta = form.elements.eposta.value.trim();
      var kvkk = form.elements.kvkk.checked;
      var adHata = !adSoyad;
      var telHata = tel.length < 10 || tel.length > 13;
      var epostaHata = !EPOSTA.test(eposta);
      hataGoster('f-ad', adHata);
      hataGoster('f-tel', telHata);
      hataGoster('f-eposta', epostaHata);
      hataGoster('f-kvkk', !kvkk);
      var ilk = adHata ? 'f-ad' : telHata ? 'f-tel' : epostaHata ? 'f-eposta' : !kvkk ? 'f-kvkk' : null;
      if (ilk) { document.getElementById(ilk).focus(); return; }
      var ilkAd = adSoyad.split(/\s+/)[0];
      document.getElementById('form-tamam-yazi').textContent =
        'Teşekkürler ' + ilkAd + '. Değerlendirme 3 iş günü içinde ' + eposta + ' adresine gönderilecek; bir soru olursa ' + form.elements.telefon.value.trim() + ' numaranız aranacak.';
      form.hidden = true;
      tamam.hidden = false;
      tamam.focus();
    });
    ['f-ad', 'f-tel', 'f-eposta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) hataGoster(id, false); });
    });
    var kvkkKutu = document.getElementById('f-kvkk');
    if (kvkkKutu) kvkkKutu.addEventListener('change', function () { if (kvkkKutu.checked) hataGoster('f-kvkk', false); });
  }

  /* ---------- bülten ---------- */
  var bulten = document.getElementById('bulten');
  if (bulten) {
    var bGirdi = document.getElementById('b-eposta');
    var bDurum = document.getElementById('bulten-durum');
    bulten.addEventListener('submit', function (e) {
      e.preventDefault();
      var deger = bGirdi.value.trim();
      if (!EPOSTA.test(deger)) {
        bDurum.textContent = 'Geçerli bir e-posta adresi yazın.';
        bGirdi.setAttribute('aria-invalid', 'true');
        bGirdi.focus();
        return;
      }
      bGirdi.removeAttribute('aria-invalid');
      bDurum.textContent = 'Teşekkürler, aboneliğiniz alındı: ' + deger;
      bGirdi.value = '';
    });
  }

  /* ---------- ekrana girişler: kart ızgaraları ve süreç çizgisi ---------- */
  var izlenenler = Array.prototype.slice.call(document.querySelectorAll('.giris-izgara, .adimlar'));
  izlenenler.forEach(function (iz) {
    Array.prototype.slice.call(iz.children).forEach(function (c, i) { c.style.setProperty('--s', i % 3); });
  });
  if (!azalt && 'IntersectionObserver' in window) {
    var gozcu = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (!g.isIntersecting) return;
        g.target.classList.add('gorundu');
        gozcu.unobserve(g.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    izlenenler.forEach(function (iz) { gozcu.observe(iz); });
  } else {
    kok.classList.remove('hareket');
    izlenenler.forEach(function (iz) { iz.classList.add('hazir'); });
  }

  /* telefonda alt şerit iki durumda çekilir: kanal düğmelerinin üstüne binecekse
     ve iletişim formu ekrandayken (gönder düğmesini kapatmasın) */
  var hizli = document.querySelector('.hizli');
  var iletisim = document.getElementById('iletisim');
  var kanalCubuk = document.querySelector('.kanal-cubuk');
  var formEkranda = false;
  var hizliKare = 0;
  function hizliGuncelle() {
    hizliKare = 0;
    if (!hizli || getComputedStyle(hizli).display === 'none') return;
    var cakisir = false;
    if (kanalCubuk) {
      var c = kanalCubuk.getBoundingClientRect();
      var seritUst = window.innerHeight - hizli.offsetHeight - 16;
      cakisir = c.bottom > seritUst && c.top < window.innerHeight;
    }
    hizli.classList.toggle('gizli', cakisir || formEkranda);
  }
  function hizliIste() { if (!hizliKare) hizliKare = requestAnimationFrame(hizliGuncelle); }
  if (hizli) {
    window.addEventListener('scroll', hizliIste, { passive: true });
    window.addEventListener('resize', hizliIste);
    if (iletisim && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (g) {
        formEkranda = g[0].isIntersecting;
        hizliGuncelle();
      }).observe(iletisim);
    }
    hizliGuncelle();
  }

  /* ---------- başlat ---------- */
  firmaYazilari();
  adGuncelle();
  goster(0, false, true);
  formaAktar();
  otoKur();
  /* head'deki yedek: bu satıra gelinmezse giriş hareketi kaldırılır, kartlar görünür kalır */
  window.meHazir = true;
})();
