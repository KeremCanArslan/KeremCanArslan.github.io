(function () {
  'use strict';

  var kok = document.documentElement;
  var hareketAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  /* Bildirim */
  var bildirim = $('#bildirim');
  var bildirimSaat;
  function bildir(metin) {
    var kap = document.querySelector('dialog[open]') || document.body;
    if (bildirim.parentNode !== kap) kap.appendChild(bildirim);
    bildirim.textContent = metin;
    bildirim.classList.add('acik');
    clearTimeout(bildirimSaat);
    bildirimSaat = setTimeout(function () { bildirim.classList.remove('acik'); }, 4200);
  }

  /* Üst menü */
  var ust = $('#ust');
  function ustDurum() { ust.classList.toggle('dolu', window.scrollY > 40); }
  ustDurum();
  window.addEventListener('scroll', ustDurum, { passive: true });

  var menuAc = $('.menu-ac');
  function menuKapat() {
    kok.classList.remove('menu-acik');
    menuAc.setAttribute('aria-expanded', 'false');
    menuAc.setAttribute('aria-label', 'Menüyü aç');
  }
  menuAc.addEventListener('click', function () {
    var acik = kok.classList.toggle('menu-acik');
    menuAc.setAttribute('aria-expanded', acik ? 'true' : 'false');
    menuAc.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
    if (acik) { var ilkBag = $('#menu a'); if (ilkBag) ilkBag.focus({ preventScroll: true }); }
  });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', menuKapat); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && kok.classList.contains('menu-acik')) { menuKapat(); menuAc.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 1080) menuKapat(); });

  /* Talepler açılır listesi: tıklayınca açılır; dışarı tıklayınca, odak çıkınca ya da Esc ile kapanır */
  var acilir = $('.acilir-dugme'), acilirListe = $('#talep-listesi'), acilirKap = $('.menu-acilir');
  function acilirKapat(odakGeri) {
    if (acilirListe.hidden) return;
    acilirListe.hidden = true;
    acilir.setAttribute('aria-expanded', 'false');
    if (odakGeri) acilir.focus();
  }
  acilir.addEventListener('click', function () {
    var acik = !acilirListe.hidden;
    acilirListe.hidden = acik;
    acilir.setAttribute('aria-expanded', acik ? 'false' : 'true');
  });
  acilirListe.addEventListener('click', function (e) { if (e.target.closest('a, button')) acilirKapat(false); });
  document.addEventListener('click', function (e) { if (!acilirKap.contains(e.target)) acilirKapat(false); });
  document.addEventListener('focusin', function (e) { if (!acilirKap.contains(e.target)) acilirKapat(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !acilirListe.hidden) acilirKapat(true);
  });

  /* Vitrin */
  var vitrin = $('.vitrin');
  var slaytlar = $$('.slayt', vitrin);
  var rayOgeler = $$('.ray-oge', vitrin);
  var durdurDugme = $('.ray-durdur', vitrin);
  var SURE = 7000;
  var sira = 0, saat = null, baslangic = 0, kalan = SURE, oynuyor = !hareketAzalt;
  var duraklatildi = false, sebep = { odak: false, gizli: false };

  function slaytGoster(yeni) {
    if (yeni === sira) return;
    var eski = slaytlar[sira];
    eski.classList.remove('aktif');
    eski.setAttribute('aria-hidden', 'true');
    $$('a, button', eski).forEach(function (el) { el.setAttribute('tabindex', '-1'); });
    rayOgeler[sira].classList.remove('aktif', 'oynuyor');
    rayOgeler[sira].setAttribute('aria-current', 'false');

    sira = yeni;
    var simdi = slaytlar[sira];
    slaytYukle(simdi);
    simdi.classList.add('aktif');
    simdi.removeAttribute('aria-hidden');
    $$('a, button', simdi).forEach(function (el) { el.removeAttribute('tabindex'); });
    rayOgeler[sira].classList.add('aktif');
    rayOgeler[sira].setAttribute('aria-current', 'true');
    zamanla(SURE);
  }
  function sonraki() { slaytGoster((sira + 1) % slaytlar.length); }
  function onceki() { slaytGoster((sira - 1 + slaytlar.length) % slaytlar.length); }

  /* Duraklatılmışken sayaç kurulmaz, çizgi yerinde bekler; sürdürünce kalan süreyle devam eder */
  function zamanla(sure) {
    clearTimeout(saat);
    var oge = rayOgeler[sira];
    oge.classList.remove('oynuyor');
    if (!oynuyor) return;
    void oge.offsetWidth;
    oge.style.setProperty('--sure', (sure / 1000) + 's');
    oge.classList.add('oynuyor');
    baslangic = Date.now();
    kalan = sure;
    if (!duraklatildi) saat = setTimeout(sonraki, sure);
  }
  function duraklat() {
    if (!oynuyor || duraklatildi) return;
    duraklatildi = true;
    clearTimeout(saat);
    kalan = Math.max(0, kalan - (Date.now() - baslangic));
    vitrin.classList.add('durdu');
  }
  function surdur() {
    if (!oynuyor || !duraklatildi) return;
    duraklatildi = false;
    vitrin.classList.remove('durdu');
    clearTimeout(saat);
    baslangic = Date.now();
    saat = setTimeout(sonraki, kalan);
  }
  function sebepGuncelle() {
    if (sebep.odak || sebep.gizli) duraklat(); else surdur();
  }

  rayOgeler.forEach(function (oge, i) {
    oge.addEventListener('click', function () { slaytGoster(i); });
  });
  function oynatmaDurumu() {
    durdurDugme.setAttribute('aria-pressed', oynuyor ? 'false' : 'true');
    vitrin.classList.toggle('elle-durdu', !oynuyor);
  }
  durdurDugme.addEventListener('click', function () {
    oynuyor = !oynuyor;
    duraklatildi = false;
    sebep.odak = false;
    vitrin.classList.remove('durdu');
    oynatmaDurumu();
    if (oynuyor) { zamanla(SURE); } else { clearTimeout(saat); rayOgeler[sira].classList.remove('oynuyor'); }
  });
  oynatmaDurumu();
  document.addEventListener('visibilitychange', function () {
    sebep.gizli = document.hidden;
    sebepGuncelle();
  });
  /* Klavye odağı vitrindeyken geçiş durur, fareyle gezerken durmaz */
  function klavyeOdagi(el) {
    try { return el.matches(':focus-visible'); } catch (hata) { return false; }
  }
  vitrin.addEventListener('focusin', function (e) {
    if (klavyeOdagi(e.target)) { sebep.odak = true; sebepGuncelle(); }
  });
  vitrin.addEventListener('focusout', function (e) {
    if (!vitrin.contains(e.relatedTarget)) { sebep.odak = false; sebepGuncelle(); }
  });
  /* İlk slayttan sonrakiler sayfa yüklendikten 2,5 sn sonra iner (telefonda ilk fotoğrafla bant paylaşmasın);
     ondan önce seçilen slaytın fotoğrafı hemen iner */
  function slaytYukle(slayt) {
    $$('[data-src], [data-srcset]', slayt).forEach(function (el) {
      if (el.dataset.srcset) { el.srcset = el.dataset.srcset; el.removeAttribute('data-srcset'); }
      if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
    });
  }
  window.addEventListener('load', function () {
    setTimeout(function () { slaytlar.forEach(slaytYukle); }, 2500);
  });
  var dokunX = null, dokunY = null;
  vitrin.addEventListener('touchstart', function (e) {
    dokunX = e.touches[0].clientX; dokunY = e.touches[0].clientY;
  }, { passive: true });
  vitrin.addEventListener('touchend', function (e) {
    if (dokunX === null) return;
    var dx = e.changedTouches[0].clientX - dokunX;
    var dy = e.changedTouches[0].clientY - dokunY;
    dokunX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0) sonraki(); else onceki(); }
  }, { passive: true });
  zamanla(SURE);

  /* İlan sekmeleri */
  var sekmeler = $$('.sekme');
  var tumBag = $('#tum-bag');
  var filtreSonuc = $('#filtre-sonuc');
  var filtreMetin = $('#filtre-metin');
  var bosDurum = $('#bos-durum');

  function sekmeSec(ad, odakla) {
    sekmeler.forEach(function (s) {
      var secili = s.dataset.sekme === ad;
      s.setAttribute('aria-selected', secili ? 'true' : 'false');
      s.setAttribute('tabindex', secili ? '0' : '-1');
      var panel = document.getElementById(s.getAttribute('aria-controls'));
      panel.hidden = !secili;
      if (secili) {
        $$('.kart.bekliyor', panel).forEach(function (k) { k.classList.remove('bekliyor'); });
        tumBag.textContent = s.dataset.tum;
        panel.classList.remove('giris');
        if (!hareketAzalt) { void panel.offsetWidth; panel.classList.add('giris'); }
        if (odakla) s.focus();
      }
    });
  }
  sekmeler.forEach(function (s, i) {
    s.addEventListener('click', function () { filtreTemizle(); sekmeSec(s.dataset.sekme); });
    s.addEventListener('keydown', function (e) {
      var hedef = null;
      if (e.key === 'ArrowRight') hedef = sekmeler[(i + 1) % sekmeler.length];
      else if (e.key === 'ArrowLeft') hedef = sekmeler[(i - 1 + sekmeler.length) % sekmeler.length];
      else if (e.key === 'Home') hedef = sekmeler[0];
      else if (e.key === 'End') hedef = sekmeler[sekmeler.length - 1];
      if (hedef) { e.preventDefault(); filtreTemizle(); sekmeSec(hedef.dataset.sekme, true); }
    });
  });
  $$('[data-git-sekme]').forEach(function (a) {
    a.addEventListener('click', function () { filtreTemizle(); sekmeSec(a.dataset.gitSekme); });
  });

  /* Arama (filtre önerisi) */
  var FIYATLAR = {
    satilik: [10000000, 20000000, 40000000, 75000000],
    kiralik: [30000, 40000, 50000],
    proje: [8000000, 10000000, 20000000],
    arsa: [2000000, 5000000, 10000000]
  };
  var TUR_AD = { satilik: 'Satılık ilanlarda', kiralik: 'Kiralık ilanlarda', proje: 'Projelerde', arsa: 'Arsalarda' };
  var aTur = $('#a-tur'), aIlce = $('#a-ilce'), aOda = $('#a-oda'), aFiyat = $('#a-fiyat'), aOdaAlan = $('#a-oda-alan');

  function paraYaz(tl) {
    if (tl >= 1000000) return (tl / 1000000).toLocaleString('tr-TR') + ' milyon TL';
    return tl.toLocaleString('tr-TR') + ' TL';
  }
  function fiyatYaz(tur, f, cumleIci) {
    var on = tur === 'kiralik' ? (cumleIci ? 'aylık ' : 'Aylık ') : '';
    return on + paraYaz(f) + "'ye kadar";
  }
  function secenekKur(liste, degerler, yazi) {
    liste.innerHTML = '<option value="">Tümü</option>';
    degerler.forEach(function (d) {
      var o = document.createElement('option');
      o.value = d;
      o.textContent = yazi(d);
      liste.appendChild(o);
    });
  }
  function fiyatSecenekleri() {
    var tur = aTur.value;
    secenekKur(aFiyat, FIYATLAR[tur], function (f) { return fiyatYaz(tur, f); });
    var ilceler = [];
    $$('#panel-' + tur + ' .kart').forEach(function (k) {
      if (ilceler.indexOf(k.dataset.ilce) < 0) ilceler.push(k.dataset.ilce);
    });
    ilceler.sort(function (a, b) { return a.localeCompare(b, 'tr'); });
    secenekKur(aIlce, ilceler, function (i) { return i; });
    var arsa = tur === 'arsa';
    aOda.disabled = arsa;
    if (arsa) aOda.value = '';
    aOdaAlan.classList.toggle('pasif', arsa);
  }
  aTur.addEventListener('change', fiyatSecenekleri);
  fiyatSecenekleri();

  function filtreTemizle() {
    $$('.kart').forEach(function (k) { k.hidden = false; });
    $$('.ilan-izgara').forEach(function (g) { g.classList.remove('suzuldu'); });
    filtreSonuc.hidden = true;
    bosDurum.hidden = true;
  }
  $('#filtre-temizle').addEventListener('click', function () {
    filtreTemizle();
    aIlce.value = ''; aOda.value = ''; aFiyat.value = '';
    sekmeSec(aTur.value, true);
  });

  $('#arama-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var tur = aTur.value, ilce = aIlce.value, oda = parseInt(aOda.value, 10) || 0, fiyat = parseInt(aFiyat.value, 10) || 0;
    filtreTemizle();
    sekmeSec(tur);
    var panel = $('#panel-' + tur);
    var say = 0;
    $$('.kart', panel).forEach(function (k) {
      var odaAz = parseInt(k.dataset.odaAz, 10), odaCok = parseInt(k.dataset.odaCok, 10), kFiyat = parseInt(k.dataset.fiyat, 10);
      var uyar = (!ilce || k.dataset.ilce === ilce) &&
        (!oda || (oda >= 4 ? odaCok >= 4 : odaAz <= oda && oda <= odaCok)) &&
        (!fiyat || (kFiyat > 0 && kFiyat <= fiyat));
      k.hidden = !uyar;
      if (uyar) say++;
    });
    $('.ilan-izgara', panel).classList.add('suzuldu');
    var olcut = [ilce, oda ? (oda >= 4 ? '4+1 ve üzeri' : oda + '+1') : '', fiyat ? fiyatYaz(tur, fiyat, true) : ''].filter(Boolean);
    filtreSonuc.hidden = false;
    filtreMetin.textContent = TUR_AD[tur] + ' ' + say + ' sonuç' + (olcut.length ? ': ' + olcut.join(', ') : '');
    bosDurum.hidden = say > 0;
    $('#ilanlar').scrollIntoView({ behavior: hareketAzalt ? 'auto' : 'smooth', block: 'start' });
  });

  /* Talep pencereleri */
  function formSifirla(kap) {
    var form = $('form', kap), tamam = $('.form-tamam', kap);
    if (form) { form.hidden = false; form.reset(); $('.form-hata', form).hidden = true; $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); }); }
    if (tamam) tamam.hidden = true;
  }
  $$('[data-talep]').forEach(function (d) {
    d.addEventListener('click', function () {
      var tur = d.dataset.talep;
      var pencere = $(tur === 'ariyorum' ? '#talep-ariyorum' : '#talep-satiyorum');
      menuKapat();
      formSifirla(pencere);
      if (tur !== 'ariyorum') {
        $('input[value="' + (tur === 'kiralik' ? 'kirala' : 'sat') + '"]', pencere).checked = true;
      }
      pencere.showModal();
      var ilk = $('input[name="ad"]', pencere);
      if (ilk) ilk.focus();
    });
  });
  $$('dialog.talep').forEach(function (p) {
    if (typeof p.showModal !== 'function') {
      p.showModal = function () { p.setAttribute('open', ''); };
      p.close = function () { p.removeAttribute('open'); };
    }
    var basilan = null;
    p.addEventListener('mousedown', function (e) { basilan = e.target; });
    p.addEventListener('click', function (e) { if (e.target === p && basilan === p) p.close(); basilan = null; });
    $$('[data-kapat]', p).forEach(function (b) { b.addEventListener('click', function () { p.close(); }); });
  });

  /* Form doğrulama (örnek sayfada veri gönderilmez) */
  $$('.form-dogrula').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bosAlan = [], ekler = [];
      $$('[required]', form).forEach(function (el) {
        var bos = el.type === 'checkbox' ? !el.checked : !el.value.trim();
        var hatali = !bos && el.type === 'tel' && el.value.replace(/\D/g, '').length < 10;
        if (bos || hatali) {
          el.setAttribute('aria-invalid', 'true');
          if (el.type === 'checkbox') ekler.push('onay kutusunu işaretleyin');
          else if (hatali) ekler.unshift('telefonu alan koduyla yazın');
          else bosAlan.push(el.dataset.ad);
        } else {
          el.removeAttribute('aria-invalid');
        }
      });
      var parcalar = ekler.slice();
      if (bosAlan.length) {
        var adlar = bosAlan.length > 1 ? bosAlan.slice(0, -1).join(', ') + ' ve ' + bosAlan[bosAlan.length - 1] : bosAlan[0];
        parcalar.unshift(adlar + (bosAlan.length > 1 ? ' alanlarını' : ' alanını') + ' doldurun');
      }
      var hata = $('.form-hata', form);
      if (parcalar.length) {
        var metin = parcalar.join(', ');
        hata.textContent = 'Göndermek için ' + metin + '.';
        hata.hidden = false;
        var ilk = $('[aria-invalid="true"]', form);
        if (ilk) ilk.focus();
        return;
      }
      hata.hidden = true;
      form.hidden = true;
      var tamam = form.parentNode.querySelector('.form-tamam');
      tamam.hidden = false;
      tamam.focus();
    });
  });
  var yeniMesaj = $('[data-yeni-mesaj]');
  if (yeniMesaj) yeniMesaj.addEventListener('click', function () {
    var kutu = $('.iletisim-kutu');
    formSifirla(kutu);
    $('input[name="ad"]', kutu).focus();
  });

  /* Kaydırınca ilan ve blog kartları belirir; ilk açılışta ekranda olanlar hemen görünür */
  if (kok.classList.contains('hareket') && 'IntersectionObserver' in window) {
    var belirt = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (g.isIntersecting) { g.target.classList.remove('bekliyor'); belirt.unobserve(g.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('.ilan-panel:not([hidden]) .kart, .yazi').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('bekliyor'); belirt.observe(el); }
    });
  }

  /* Örnek sayfada henüz olmayan bağlantılar */
  var DEMO = {
    ilan: 'Örnek sayfa: bu bağlantı ilanın kendi sayfasını açar. İlan sayfası ana sayfadan sonra hazırlanacak.',
    kategori: 'Örnek sayfa: bu bağlantı kategorideki bütün ilanların listesini açar.',
    blog: 'Örnek sayfa: bu bağlantı blog yazısını açar.',
    hakkimda: 'Örnek sayfa: bu bağlantı Hakkımda sayfasını açar.',
    kvkk: 'Örnek sayfa: aydınlatma metni temada ayrı bir sayfada açılır.',
    tel: 'Örnek sayfa: temada bu bağlantı telefonda aramayı başlatır.',
    wa: 'Örnek sayfa: temada bu bağlantı WhatsApp sohbetini açar.',
    eposta: 'Örnek sayfa: temada bu bağlantı e-posta uygulamasını açar.',
    sosyal: 'Örnek sayfa: temada bu simgeler sosyal medya hesaplarınıza gider.',
    ortaklik: 'Örnek sayfa: temada iş ortaklığı formu ayrı bir sayfada açılır.'
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-demo]');
    if (!a) return;
    e.preventDefault();
    bildir(DEMO[a.dataset.demo] || DEMO.ilan);
  });
})();
