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

  /* Süreç: kaydırdıkça çizgi dolar, geçilen adım koyulaşır; çizgi son adımın noktasında biter */
  var akis = $('.surec-akis');
  if (akis) {
    var ray = $('.surec-ray', akis);
    var adimlar = $$('.adim', akis);
    /* Numaranın konumu .surec-akis'e göre (ilk konumlu üst öğe); nokta CSS'te top .14em, 12 px */
    var noktaPay = function (adim) {
      var no = $('.adim-no', adim);
      return no.offsetTop + parseFloat(getComputedStyle(no).fontSize) * 0.14 + 6;
    };
    var rayBoyu = function () {
      ray.style.top = noktaPay(adimlar[0]) + 'px';
      ray.style.bottom = Math.max(0, akis.offsetHeight - noktaPay(adimlar[adimlar.length - 1])) + 'px';
    };
    rayBoyu();
    window.addEventListener('resize', rayBoyu);
    window.addEventListener('load', rayBoyu);
    if (kok.classList.contains('hareket')) {
      akis.classList.add('canli');
      var bekleyen = false;
      var ilerle = function () {
        bekleyen = false;
        var cizgi = window.innerHeight * 0.62;
        var r = ray.getBoundingClientRect();
        var oran = r.height ? (cizgi - r.top) / r.height : 0;
        akis.style.setProperty('--ilerle', Math.min(1, Math.max(0, oran)).toFixed(4));
        adimlar.forEach(function (adim) {
          adim.classList.toggle('gecti', $('.adim-no', adim).getBoundingClientRect().top < cizgi);
        });
      };
      var istek = function () { if (!bekleyen) { bekleyen = true; requestAnimationFrame(ilerle); } };
      window.addEventListener('scroll', istek, { passive: true });
      window.addEventListener('resize', istek);
      ilerle();
    }
  }

  /* Tema rengi seçici (yalnız örnek sayfada): hazır firma renkleri ya da kendi renginiz.
     Ana renk düğme ve alt bilgide, vurgu etiketlerde; yazı okunurluğu en az 4,5:1 tutulur. */
  var renkPanel = $('.renk-panel');
  if (renkPanel) {
    var renkAc = $('.renk-ac', renkPanel), renkListe = $('#renk-liste'), renkSec = $('#renk-sec');
    var temaMeta = $('meta[name="theme-color"]');
    var VARSAYILAN = temaMeta ? temaMeta.content : '#123234';
    var TAKIMLAR = {};
    $$('.renk-secenek .renk-cift[style]', renkPanel).forEach(function (s) {
      var girdi = s.parentNode.querySelector('input');
      TAKIMLAR[girdi.value] = [s.style.getPropertyValue('--a').trim(), s.style.getPropertyValue('--b').trim()];
    });

    var hexRgb = function (h) {
      h = h.replace('#', '');
      if (h.length === 3) h = h.replace(/./g, '$&$&');
      return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); });
    };
    var rgbHex = function (c) {
      return '#' + c.map(function (v) { return ('0' + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2); }).join('');
    };
    var parlaklik = function (c) {
      var d = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2];
    };
    var karsitlik = function (x, y) {
      var a = parlaklik(x), b = parlaklik(y);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    var karistir = function (x, y, oran) { return x.map(function (v, i) { return v + (y[i] - v) * oran; }); };
    var SIYAH = [0, 0, 0], BEYAZ = [255, 255, 255], KOYU_YAZI = [17, 17, 17];

    /* Beyaz üstünde okunmayan açık renk, tonu korunarak koyulaştırılır */
    var okunurYap = function (c) {
      var adim = 0;
      while (karsitlik(c, BEYAZ) < 4.5 && adim < 40) { c = karistir(c, SIYAH, 0.06); adim++; }
      return c;
    };
    /* Karartma: ana rengin tonunu taşıyan çok koyu renk (fotoğraf üstü yazı için) */
    var karartRenk = function (c) {
      var gri = (c[0] + c[1] + c[2]) / 3;
      return karistir(karistir(c, [gri, gri, gri], 0.3), SIYAH, 0.66);
    };
    var vurguYazi = function (ana, vurgu) {
      if (karsitlik(ana, vurgu) >= 4.5) return rgbHex(ana);
      return karsitlik(BEYAZ, vurgu) >= 4.5 ? '#ffffff' : rgbHex(KOYU_YAZI);
    };

    var uygula = function (anaHex, vurguHex) {
      var st = kok.style;
      if (!anaHex) {
        ['--gece', '--gece-koyu', '--ihlamur', '--vurgu-yazi', '--karart'].forEach(function (p) { st.removeProperty(p); });
        if (temaMeta) temaMeta.content = VARSAYILAN;
        return;
      }
      var ana = okunurYap(hexRgb(anaHex));
      var vurgu = vurguHex ? hexRgb(vurguHex) : karistir(ana, BEYAZ, 0.8);
      st.setProperty('--gece', rgbHex(ana));
      st.setProperty('--gece-koyu', rgbHex(karistir(ana, SIYAH, 0.3)));
      st.setProperty('--ihlamur', rgbHex(vurgu));
      st.setProperty('--vurgu-yazi', vurguYazi(ana, vurgu));
      st.setProperty('--karart', karartRenk(ana).map(Math.round).join(', '));
      if (temaMeta) temaMeta.content = rgbHex(ana);
    };
    var secimUygula = function () {
      var secili = $('input[name="renk"]:checked', renkPanel);
      if (!secili || secili.value === 'yesil') { uygula(null); return; }
      if (secili.value === 'ozel') { uygula(renkSec.value, null); return; }
      var t = TAKIMLAR[secili.value];
      uygula(t[0], t[1]);
    };
    $$('input[name="renk"]', renkPanel).forEach(function (g) { g.addEventListener('change', secimUygula); });
    renkSec.addEventListener('input', function () {
      renkPanel.style.setProperty('--ozel', renkSec.value);
      $('input[value="ozel"]', renkPanel).checked = true;
      secimUygula();
    });
    renkPanel.style.setProperty('--ozel', renkSec.value);

    var renkKapat = function (odakGeri) {
      if (renkListe.hidden) return;
      renkListe.hidden = true;
      renkAc.setAttribute('aria-expanded', 'false');
      if (odakGeri) renkAc.focus();
    };
    renkAc.addEventListener('click', function () {
      var acik = !renkListe.hidden;
      renkListe.hidden = acik;
      renkAc.setAttribute('aria-expanded', acik ? 'false' : 'true');
      if (!acik) { var secili = $('input[name="renk"]:checked', renkPanel); if (secili) secili.focus(); }
    });
    document.addEventListener('click', function (e) { if (!renkPanel.contains(e.target)) renkKapat(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !renkListe.hidden) renkKapat(true); });

    /* Vitrin geçilince belirir; vitrinin üstündeyken liste açıksa kapanır */
    var renkGorunum = function () {
      var gorunur = vitrin.getBoundingClientRect().bottom < window.innerHeight * 0.5;
      renkPanel.classList.toggle('gorunur', gorunur);
      if (!gorunur) renkKapat(false);
    };
    window.addEventListener('scroll', renkGorunum, { passive: true });
    renkGorunum();
  }

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
    $$('.kart, .yazi').forEach(function (el) {
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
