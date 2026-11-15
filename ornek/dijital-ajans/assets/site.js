/* Sıraüstü — örnek ajans ana sayfası
   Sektör içerikleri tek nesnede (WordPress'te tema ayarlarından ya da özel alanlardan gelecek). */
(function () {
  'use strict';

  var azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuGenis = window.matchMedia('(min-width: 960px)');

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
      sorgu: 'el yapımı deri sneaker',
      baslik: '{F} | El Yapımı Deri Sneaker | Aynı Gün Kargo',
      aciklama: 'Yerli deri, el dikişi taban. <b>Sneaker</b> modellerinde 30 gün ücretsiz değişim, 2.000 TL üzeri kargo bizden.',
      baglanti: ['Yeni sezon', 'Beden rehberi', 'Kargo ve iade', 'Mağazalar'],
      akisMetin: 'Yeni sezon kutudan çıktı. Siyah kanvas, beyaz kauçuk taban, el dikişi.',
      akisCta: 'Alışverişe başla',
      videoMetin: 'Bir siparişin paketlenişi, baştan sona 40 saniye.',
      videoCta: 'Hemen al',
      begeni: '24,6 B',
      yorum: '318',
      soru: 'Günlük kullanım için rahat, yerli üretim bir sneaker önerir misin?',
      cevap: 'Rahatlık için önce taban yapısına bak: kauçuk dış taban ve yastıklı iç taban uzun yürüyüşte fark eder. Deri astar ayağın nefes almasını sağlar. Beden konusunda emin değilsen ücretsiz değişim sunan markaları tercih et.',
      reklamBaslik: 'El dikişi, yerli deri sneaker',
      reklamMetin: 'Aynı gün kargo, 30 gün içinde ücretsiz değişim.',
      seoSorgu: 'yerli üretim deri sneaker',
      seoBaslik: '{F} | Yerli Üretim Deri Sneaker Modelleri',
      site: { baslik: 'El dikişi, yerli deri sneaker.', menu: ['Kadın', 'Erkek', 'Yeni sezon'], cta: 'Alışverişe başla', bilgi: ['Aynı gün kargo', '30 gün değişim', 'Güvenli ödeme'] }
    },
    egitim: {
      foto: 'egitim',
      sorgu: 'kadıköy yks hazırlık kursu',
      baslik: '{F} | YKS Hazırlık, 12 Kişilik Sınıflar | Ücretsiz Deneme',
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

  var ETIKET = {
    arama: 'Arama ağı, metin reklamı',
    akis: 'Akış reklamı, 4:5, 1080 × 1350 piksel',
    video: 'Dikey video, 9:16, 1080 × 1920 piksel',
    sohbet: 'Sohbet içinde sponsorlu öneri',
    seo: 'Organik sonuç, reklam değil'
  };
  var YUZEYLER = ['arama', 'akis', 'video', 'sohbet', 'seo'];
  var KANAL = { arama: 'Google Ads', akis: 'Meta Ads', video: 'TikTok Ads', sohbet: 'ChatGPT Ads', seo: 'SEO' };
  var DURUM_IK = '<svg class="durum-ik" viewBox="0 0 64 14" aria-hidden="true"><g fill="currentColor"><rect x="0" y="9" width="3" height="4" rx=".7"/><rect x="4.5" y="7" width="3" height="6" rx=".7"/><rect x="9" y="4.5" width="3" height="8.5" rx=".7"/><rect x="13.5" y="2" width="3" height="11" rx=".7"/></g><path d="M23 6.2a9 9 0 0 1 12 0M25.3 8.6a5.6 5.6 0 0 1 7.4 0M27.6 11a2.2 2.2 0 0 1 2.8 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="40" y="2" width="20" height="10" rx="3" fill="none" stroke="currentColor" stroke-opacity=".45"/><rect x="42" y="4" width="15" height="6" rx="1.6" fill="currentColor"/><rect x="61" y="5.3" width="1.6" height="3.6" rx=".8" fill="currentColor" fill-opacity=".45"/></svg>';

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
    ileri: svg('<path d="m9.5 6 6 6-6 6"/>'),
    yeni: svg('<path d="M12 5v14M5 12h14"/>')
  };

  /* ---------- durum ---------- */
  var durum = { firma: '', sektor: 'sanayi' };
  try {
    var kayitli = JSON.parse(sessionStorage.getItem('siraustu-durum') || 'null');
    if (kayitli && typeof kayitli.firma === 'string' && SEKTOR[kayitli.sektor]) {
      durum.firma = kayitli.firma.slice(0, 28);
      durum.sektor = kayitli.sektor;
    }
  } catch (e) { /* tarayıcı depolamayı kapatmışsa varsayılanla devam */ }

  function kaydet() {
    try { sessionStorage.setItem('siraustu-durum', JSON.stringify(durum)); } catch (e) { /* yok sayılır, sayfa depolamasız çalışır */ }
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
  function arama(s) {
    return '<div class="ara">' +
      '<div class="ara-kutu">' + IK.mercek + '<span class="ara-sorgu" data-sorgu="' + esc(s.sorgu) + '">' + esc(s.sorgu) + '</span><span class="imlec"></span></div>' +
      '<div class="ara-sekme"><span class="s">Tümü</span><span>Görseller</span><span>Haritalar</span><span>Haberler</span><span>Alışveriş</span></div>' +
      '<div class="ara-reklam">' +
        '<p class="ara-sponsor">Sponsorlu</p>' +
        '<div class="ara-kaynak"><span class="fav" data-k="harf">' + esc(harf()) + '</span><span><b>' + slotHTML() + '</b><small>https://www.<span data-k="alan">' + esc(alan()) + '</span></small></span>' + IK.ucNokta + '</div>' +
        '<p class="ara-baslik">' + yerlestir(s.baslik) + '</p>' +
        '<p class="ara-aciklama">' + s.aciklama + '</p>' +
        '<p class="ara-baglanti">' + s.baglanti.map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '</p>' +
      '</div>' +
      '<div class="iskelet"><span class="isk isk-a"></span><span class="isk isk-b"></span><span class="isk isk-c"></span><span class="isk isk-d"></span></div>' +
      '<div class="iskelet"><span class="isk isk-a"></span><span class="isk isk-b"></span><span class="isk isk-c"></span><span class="isk isk-d"></span></div>' +
      '<div class="iskelet"><span class="isk isk-a"></span><span class="isk isk-b"></span><span class="isk isk-c"></span></div>' +
    '</div>';
  }

  function seo(s) {
    var satirlar = '';
    for (var i = 0; i < 4; i++) {
      satirlar += '<li class="sira-satir" style="--i:' + i + '"><span class="sira-no">' + (i + 1) + '</span><div class="sira-ic"><span class="isk isk-a"></span><span class="isk isk-b"></span></div></li>';
    }
    satirlar += '<li class="sira-satir sira-firma" style="--i:4"><span class="sira-no">5</span><div class="sira-ic">' +
      '<p class="sira-alan"><span class="fav" data-k="harf">' + esc(harf()) + '</span><span data-k="alan">' + esc(alan()) + '</span></p>' +
      '<p class="sira-baslik">' + yerlestir(s.seoBaslik) + '</p></div><span class="sira-rozet">1. sıra</span></li>';
    return '<div class="ara">' +
      '<div class="ara-kutu">' + IK.mercek + '<span class="ara-sorgu">' + esc(s.seoSorgu) + '</span></div>' +
      '<div class="ara-sekme"><span class="s">Tümü</span><span>Görseller</span><span>Haritalar</span><span>Haberler</span><span>Alışveriş</span></div>' +
      '<ol class="sira">' + satirlar + '</ol>' +
      '<div class="iskelet"><span class="isk isk-a"></span><span class="isk isk-b"></span><span class="isk isk-c"></span><span class="isk isk-d"></span></div>' +
      '<div class="iskelet"><span class="isk isk-a"></span><span class="isk isk-b"></span><span class="isk isk-c"></span></div>' +
    '</div>';
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
    return '<div class="soh">' +
      '<div class="soh-ust"><span>Yeni sohbet</span>' + IK.yeni + '</div>' +
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

  var CIZ = { arama: arama, akis: akis, video: video, sohbet: sohbet, seo: seo };

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

  /* ---------- çizim ---------- */
  var vitrin = document.getElementById('vitrin');
  var vitrinKap = document.querySelector('.vitrin-kap');
  var vitrinAlt = document.querySelector('.vitrin-alt');
  var vitrinAd = document.getElementById('vitrin-ad');
  var vitrinEtiket = document.getElementById('vitrin-etiket');
  var durDugme = document.querySelector('.vitrin-dur');
  var sekmeler = Array.prototype.slice.call(document.querySelectorAll('.vitrin-sekmeler button'));
  var cihazlar = vitrin ? Array.prototype.slice.call(vitrin.querySelectorAll('.cihaz')) : [];
  var webOnizleme = document.getElementById('web-onizleme');

  cihazlar.forEach(function (c) {
    c.innerHTML = '<div class="ekran"><div class="durum"><span>09:41</span>' + DURUM_IK + '</div><span class="ada"></span><div class="ekran-ic"></div><span class="ev"></span></div>';
  });

  function ciz() {
    var s = sek();
    cihazlar.forEach(function (c) {
      c.querySelector('.ekran-ic').innerHTML = CIZ[c.getAttribute('data-y')](s);
    });
    if (webOnizleme) webOnizleme.innerHTML = siteOnizleme(s);
    document.querySelectorAll('[data-firma-yaz]').forEach(function (el) { el.innerHTML = slotHTML(); });
    if (cihazlar[aktifSira]) hareketBaslat(cihazlar[aktifSira], YUZEYLER[aktifSira]);
  }

  /* firma adı yazılırken yalnız ad geçen yerler güncellenir; fotoğraflar yeniden yüklenmez */
  function adGuncelle() {
    var a = ad(), h = harf(), al = alan(), sl = slug(), b = bos();
    document.querySelectorAll('[data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k');
      if (k === 'slot') {
        el.textContent = a;
        el.classList.toggle('bos', b);
        if (!b && !azalt) {
          el.classList.remove('parla');
          void el.offsetWidth;
          el.classList.add('parla');
        }
      } else if (k === 'harf') el.textContent = h;
      else if (k === 'alan') el.textContent = al;
      else if (k === 'handle') el.textContent = sl;
    });
  }

  /* ---------- ekran içi hareketler ---------- */
  function yaz(el, metin, gecikme) {
    clearTimeout(el._zaman);
    el.textContent = '';
    var i = 0;
    function adim() {
      i++;
      el.textContent = metin.slice(0, i);
      if (i < metin.length) el._zaman = setTimeout(adim, 45 + Math.random() * 45);
    }
    el._zaman = setTimeout(adim, gecikme || 0);
  }

  function siraTirman(liste) {
    if (!liste) return;
    clearTimeout(liste._zaman);
    var satirlar = Array.prototype.slice.call(liste.children);
    var firma = liste.querySelector('.sira-firma');
    var sira = [0, 1, 2, 3].map(function (i) { return satirlar[i]; });
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
      sira.splice(4, 1);
      sira.unshift(firma);
      yerlestirSira();
      liste.classList.add('tamam');
      return;
    }
    var konum = 4;
    function adim() {
      if (konum === 0) { liste.classList.add('tamam'); return; }
      var ust = sira[konum - 1];
      sira[konum - 1] = firma;
      sira[konum] = ust;
      konum--;
      yerlestirSira();
      liste._zaman = setTimeout(adim, 520);
    }
    liste._zaman = setTimeout(adim, 700);
  }

  function cevapAk(kap) {
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
      if (i < kelimeler.length) p._zaman = setTimeout(adim, 38);
      else p._zaman = setTimeout(function () { reklam.classList.remove('gizli'); }, 250);
    }
    p._zaman = setTimeout(adim, 500);
  }

  function hareketBaslat(kap, y) {
    if (y === 'arama' && !azalt) {
      var sorgu = kap.querySelector('.ara-sorgu');
      if (sorgu) yaz(sorgu, sorgu.getAttribute('data-sorgu'), 400);
    }
    if (y === 'seo') siraTirman(kap.querySelector('.sira'));
    if (y === 'sohbet') cevapAk(kap);
    var v = kap.querySelector('.video');
    if (v) v.classList.add('oynuyor');
  }

  /* ---------- vitrin: konum ondalıklı; 0 = ilk telefon önde ---------- */
  var ADIM = 13.5;            /* yan telefonun uzaklığı, em */
  var SURE = 5600;            /* kendiliğinden ilerleme aralığı, ms */
  var ELLE_SURE = 9000;       /* elle çevirdikten sonra bekleme, ms */
  var konum = 0;
  var aktifSira = 0;
  var durduruldu = azalt;
  var ustunde = false, odakta = false, gorunur = true, surukleniyor = false;
  var otoZaman = null;

  function fark(i) {
    var d = (i - konum) % 5;
    if (d < -2.5) d += 5;
    if (d >= 2.5) d -= 5;
    return d;
  }

  function yerlestirVitrin() {
    cihazlar.forEach(function (c, i) {
      var d = fark(i), a = Math.abs(d), yon = d < 0 ? -1 : 1;
      var x = a <= 1 ? d * ADIM : yon * (ADIM + (a - 1) * 7);
      var r = -Math.max(-1.3, Math.min(1.3, d)) * 32;
      var z = -Math.min(a, 2) * 6;
      var olcek = 1 - Math.min(a, 2) * 0.13;
      var gorun = a <= 1 ? 1 : Math.max(0, 1 - (a - 1) * 1.8);
      c.style.transform = 'translate3d(' + x.toFixed(3) + 'em,0,' + z.toFixed(3) + 'em) rotateY(' + r.toFixed(2) + 'deg) scale(' + olcek.toFixed(3) + ')';
      c.style.opacity = gorun.toFixed(3);
      c.style.zIndex = String(10 - Math.round(a * 2));
      c.style.setProperty('--golge', (Math.min(a, 1) * 0.55).toFixed(3));
      c.style.pointerEvents = a < 1.5 ? 'auto' : 'none';
    });
  }

  function aktifGuncelle(zorla) {
    var sira = ((Math.round(konum) % 5) + 5) % 5;
    if (sira === aktifSira && !zorla) return;
    var eski = cihazlar[aktifSira];
    if (eski && eski !== cihazlar[sira]) {
      var v = eski.querySelector('.video');
      if (v) v.classList.remove('oynuyor');
    }
    aktifSira = sira;
    var y = YUZEYLER[sira];
    if (vitrinAd) vitrinAd.textContent = KANAL[y];
    if (vitrinEtiket) vitrinEtiket.textContent = ETIKET[y];
    sekmeler.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-yuzey') === y ? 'true' : 'false'); });
    if (cihazlar[sira]) hareketBaslat(cihazlar[sira], y);
  }

  function git(sira) {
    konum += Math.round(fark(sira));
    yerlestirVitrin();
    aktifGuncelle();
  }

  function otoKur(bekle) {
    clearTimeout(otoZaman);
    if (!vitrinAlt) return;
    vitrinAlt.classList.remove('oynuyor');
    if (durduruldu || ustunde || odakta || !gorunur || surukleniyor || document.hidden) return;
    var t = bekle || SURE;
    vitrinAlt.style.setProperty('--sure', t + 'ms');
    void vitrinAlt.offsetWidth;
    vitrinAlt.classList.add('oynuyor');
    otoZaman = setTimeout(function () {
      konum += 1;
      yerlestirVitrin();
      aktifGuncelle();
      otoKur();
    }, t);
  }

  if (vitrin && cihazlar.length === 5) {
    yerlestirVitrin();

    /* sürükleme: yatay hareket vitrini çevirir, dikey kaydırma sayfaya kalır (touch-action: pan-y) */
    var basX = 0, basKonum = 0, sonX = 0, sonT = 0, hiz = 0, isaretci = null, suruklendi = false, sonBirakma = 0;
    function adimPx() { return ADIM * parseFloat(getComputedStyle(vitrin).fontSize); }
    vitrin.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isaretci = e.pointerId;
      basX = sonX = e.clientX;
      sonT = performance.now();
      basKonum = konum;
      hiz = 0;
      suruklendi = false;
    });
    vitrin.addEventListener('pointermove', function (e) {
      if (e.pointerId !== isaretci) return;
      var dx = e.clientX - basX;
      if (!suruklendi) {
        if (Math.abs(dx) < 6) return;
        suruklendi = true;
        surukleniyor = true;
        vitrin.classList.add('surukle');
        try { vitrin.setPointerCapture(e.pointerId); } catch (hata) { /* yakalama desteklenmiyorsa sürükleme yine çalışır */ }
        otoKur();
      }
      konum = basKonum - dx / adimPx();
      var simdi = performance.now();
      hiz = (e.clientX - sonX) / Math.max(1, simdi - sonT);
      sonX = e.clientX;
      sonT = simdi;
      yerlestirVitrin();
    });
    function birak(e) {
      if (e.pointerId !== isaretci) return;
      isaretci = null;
      if (!suruklendi) return;
      surukleniyor = false;
      sonBirakma = performance.now();
      vitrin.classList.remove('surukle');
      /* kısa ve hızlı fiske bir telefon çevirir; uzun sürüklemede en yakın telefona oturur */
      var gecen = konum - basKonum;
      var hedef = Math.abs(gecen) < 0.5 && Math.abs(hiz) > 0.25 ? basKonum + (hiz < 0 ? 1 : -1) : basKonum + Math.round(gecen);
      konum = Math.max(basKonum - 2, Math.min(basKonum + 2, hedef));
      yerlestirVitrin();
      aktifGuncelle();
      otoKur(ELLE_SURE);
    }
    vitrin.addEventListener('pointerup', birak);
    vitrin.addEventListener('pointercancel', birak);
    vitrin.addEventListener('dragstart', function (e) { e.preventDefault(); });
    vitrin.addEventListener('click', function (e) {
      if (performance.now() - sonBirakma < 350) return;
      var c = e.target.closest('.cihaz');
      if (!c) return;
      var sira = cihazlar.indexOf(c);
      if (sira !== aktifSira) { git(sira); otoKur(ELLE_SURE); }
    });

    sekmeler.forEach(function (b, i) {
      b.addEventListener('click', function () {
        git(YUZEYLER.indexOf(b.getAttribute('data-yuzey')));
        otoKur(ELLE_SURE);
      });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var hedef = sekmeler[(i + (e.key === 'ArrowRight' ? 1 : 4)) % 5];
        hedef.focus();
        hedef.click();
      });
    });

    if (durDugme) {
      var durYazi = durDugme.querySelector('.sr');
      var durGuncelle = function () {
        durDugme.setAttribute('aria-pressed', durduruldu ? 'true' : 'false');
        if (durYazi) durYazi.textContent = durduruldu ? 'Vitrini kendiliğinden döndür' : 'Vitrinin kendiliğinden dönmesini durdur';
      };
      durGuncelle();
      durDugme.addEventListener('click', function () {
        durduruldu = !durduruldu;
        durGuncelle();
        otoKur();
      });
    }

    if (vitrinKap) {
      vitrinKap.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { ustunde = true; otoKur(); } });
      vitrinKap.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { ustunde = false; otoKur(ELLE_SURE); } });
      vitrinKap.addEventListener('focusin', function () { odakta = true; otoKur(); });
      vitrinKap.addEventListener('focusout', function (e) {
        if (vitrinKap.contains(e.relatedTarget)) return;
        odakta = false;
        otoKur(ELLE_SURE);
      });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (girdiler) {
        gorunur = girdiler[0].isIntersecting;
        otoKur();
      }, { threshold: 0.25 }).observe(vitrin);
    }
    document.addEventListener('visibilitychange', function () { otoKur(); });

    /* açılışta telefonlar ortadan yana açılır */
    if (!azalt) {
      vitrin.classList.add('ilk');
      setTimeout(function () { vitrin.classList.remove('ilk'); }, 420);
    }
  }

  /* hizmet satırındaki "Vitrinde gör" */
  document.querySelectorAll('[data-vitrin]').forEach(function (b) {
    b.addEventListener('click', function () {
      git(YUZEYLER.indexOf(b.getAttribute('data-vitrin')));
      if (vitrinKap) vitrinKap.scrollIntoView({ behavior: azalt ? 'auto' : 'smooth', block: 'center' });
      otoKur(ELLE_SURE);
    });
  });

  /* ---------- giriş: firma adı ve sektör ---------- */
  var girdi = document.getElementById('firma-adi');
  var formFirma = document.getElementById('f-firma');
  var formFirmaElle = false;
  if (formFirma) formFirma.addEventListener('input', function () { formFirmaElle = true; });

  function formaAktar() {
    if (formFirma && !formFirmaElle) formFirma.value = durum.firma.trim();
  }

  if (girdi) {
    girdi.value = durum.firma;
    girdi.addEventListener('input', function () {
      durum.firma = girdi.value.slice(0, 28);
      kaydet();
      adGuncelle();
      formaAktar();
    });
  }
  document.querySelectorAll('input[name="sektor"]').forEach(function (r) {
    r.checked = r.value === durum.sektor;
    r.addEventListener('change', function () {
      if (!r.checked) return;
      durum.sektor = r.value;
      kaydet();
      ciz();
    });
  });

  /* ---------- üst menü ---------- */
  var ust = document.getElementById('ust');
  function kaydirma() { if (ust) ust.classList.toggle('kaydi', window.scrollY > 8); }
  window.addEventListener('scroll', kaydirma, { passive: true });
  kaydirma();

  var menuAc = document.querySelector('.menu-ac');
  var menu = document.getElementById('menu');
  var arkaPlan = [document.getElementById('icerik'), document.querySelector('.alt')];
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
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menuKapat(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menuKapat(true); });
    menuGenis.addEventListener('change', function () { menuKapat(false); });
  }

  /* ---------- paketler: telefonda sütun seçimi ---------- */
  var tablo = document.querySelector('.paket-tablo');
  document.querySelectorAll('.paket-sec button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (tablo) tablo.setAttribute('data-secili', b.getAttribute('data-sutun'));
      document.querySelectorAll('.paket-sec button').forEach(function (d) { d.setAttribute('aria-selected', d === b ? 'true' : 'false'); });
    });
  });

  var paketSecim = document.getElementById('f-paket');
  function hizmetIsaretle(deger) {
    var kutu = document.querySelector('input[name="hizmet"][value="' + deger + '"]');
    if (kutu) kutu.checked = true;
  }
  document.querySelectorAll('[data-paket]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (paketSecim) paketSecim.value = a.getAttribute('data-paket');
      hizmetIsaretle('SEO');
    });
  });
  document.querySelectorAll('[data-hizmet]').forEach(function (a) {
    a.addEventListener('click', function () { hizmetIsaretle(a.getAttribute('data-hizmet')); });
  });

  /* ---------- analiz formu ---------- */
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
  if (form && tamam) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var adSoyad = form.elements.ad.value.trim();
      var tel = form.elements.telefon.value.replace(/\D/g, '');
      var eposta = form.elements.eposta.value.trim();
      var kvkk = form.elements.kvkk.checked;
      var adHata = !adSoyad;
      var telHata = tel.length < 10 || tel.length > 13;
      var epostaHata = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(eposta);
      hataGoster('f-ad', adHata);
      hataGoster('f-tel', telHata);
      hataGoster('f-eposta', epostaHata);
      hataGoster('f-kvkk', !kvkk);
      var ilk = adHata ? 'f-ad' : telHata ? 'f-tel' : epostaHata ? 'f-eposta' : !kvkk ? 'f-kvkk' : null;
      if (ilk) { document.getElementById(ilk).focus(); return; }
      var ilkAd = adSoyad.split(/\s+/)[0];
      document.getElementById('form-tamam-yazi').textContent =
        'Teşekkürler ' + ilkAd + '. Raporu 3 iş günü içinde ' + eposta + ' adresine göndereceğiz; sorumuz olursa ' + form.elements.telefon.value.trim() + ' numaranızı ararız.';
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

  /* ---------- başlat ---------- */
  ciz();
  formaAktar();
})();
