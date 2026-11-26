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

  /* Üst alandaki sade arama (örnek sayfada sonuç sayfası yok): fiyat aralıkları işlem türüne göre değişir,
     Ara'ya basınca ilgili ilan bölümüne iner ve temada ne olacağı yazılır */
  var giris = $('.giris');
  var arama = $('#arama');
  if (arama) {
    var FIYATLAR = {
      satilik: ["5 milyon TL'ye kadar", '5-10 milyon TL', '10-25 milyon TL', '25 milyon TL üzeri'],
      kiralik: ["30.000 TL'ye kadar", '30.000-50.000 TL', '50.000 TL üzeri']
    };
    var fiyatSec = $('[data-fiyat]', arama);
    var fiyatDoldur = function (tur) {
      fiyatSec.length = 1;
      FIYATLAR[tur].forEach(function (f) { fiyatSec.add(new Option(f, f)); });
    };
    $$('input[name="islem"]', arama).forEach(function (g) {
      g.addEventListener('change', function () { if (g.checked) fiyatDoldur(g.value); });
    });
    arama.addEventListener('submit', function (e) {
      e.preventDefault();
      var islem = $('input[name="islem"]:checked', arama).value;
      var tur = $('select[name="tur"]', arama).value;
      var hedef = tur === 'Proje' ? '#projeler' : (islem === 'kiralik' ? '#kiralik' : '#satilik');
      var bolum = $(hedef);
      if (bolum) bolum.scrollIntoView({ behavior: hareketAzalt ? 'auto' : 'smooth', block: 'start' });
      bildir(DEMO.arama);
    });
  }

  /* Süreç: adımlar yan yana; bölüm görününce soldan sağa sırayla koyulaşır (CSS gecikmeleri) */
  var surecListe = $('.surec-liste');
  if (surecListe && kok.classList.contains('hareket') && 'IntersectionObserver' in window
      && surecListe.getBoundingClientRect().top > window.innerHeight * 0.8) {
    surecListe.classList.add('bekliyor');
    var surecGozle = new IntersectionObserver(function (girdiler) {
      if (girdiler[0].isIntersecting) { surecListe.classList.remove('bekliyor'); surecGozle.disconnect(); }
    }, { threshold: 0.35 });
    surecGozle.observe(surecListe);
  }

  /* Formlarda aranmak istenen gün ve saat: bugünden itibaren 6 çalışma günü (pazar yok);
     saatler çalışma saatleriyle aynı (hafta içi 09:00-19:00, cumartesi 10:00-16:00), bugün için geçen saatler çıkmaz */
  var SAATLER = {
    hafta: [[9, 12], [12, 15], [15, 19]],
    cumartesi: [[10, 12], [12, 14], [14, 16]]
  };
  var iki = function (s) { return (s < 10 ? '0' : '') + s + ':00'; };
  var gunler = (function () {
    var liste = [], simdi = new Date(), d = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());
    for (var i = 0; liste.length < 6 && i < 10; i++, d.setDate(d.getDate() + 1)) {
      var gun = d.getDay();
      if (gun === 0) continue;
      var dilimler = SAATLER[gun === 6 ? 'cumartesi' : 'hafta'];
      if (i === 0) dilimler = dilimler.filter(function (s) { return s[1] - 1 > simdi.getHours(); });
      if (!dilimler.length) continue;
      var ad = d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (i === 0) ad = 'Bugün, ' + ad; else if (i === 1) ad = 'Yarın, ' + ad;
      liste.push({ ad: ad, dilimler: dilimler });
    }
    return liste;
  })();
  $$('[data-gun]').forEach(function (gunSec) {
    var saatSec = gunSec.closest('form').querySelector('[data-saat]');
    gunler.forEach(function (g, i) { gunSec.add(new Option(g.ad, g.ad)); gunSec.options[i + 1].dataset.sira = i; });
    gunSec.addEventListener('change', function () {
      var secili = gunSec.selectedOptions[0];
      var dilimler = secili && secili.dataset.sira ? gunler[+secili.dataset.sira].dilimler : SAATLER.hafta;
      var onceki = saatSec.value;
      saatSec.length = 1;
      dilimler.forEach(function (s) {
        var ad = iki(s[0]) + '-' + iki(s[1]);
        saatSec.add(new Option(ad, ad, false, ad === onceki));
      });
    });
  });

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

    /* Üst alan geçilince belirir; üst alandayken liste açıksa kapanır */
    var renkGorunum = function () {
      var gorunur = !giris || giris.getBoundingClientRect().bottom < window.innerHeight * 0.5;
      renkPanel.classList.toggle('gorunur', gorunur);
      if (!gorunur) renkKapat(false);
    };
    window.addEventListener('scroll', renkGorunum, { passive: true });
    renkGorunum();
  }

  /* Talep pencereleri */
  function formSifirla(kap) {
    var form = $('form', kap), tamam = $('.form-tamam', kap);
    if (form) {
      form.hidden = false; form.reset(); $('.form-hata', form).hidden = true;
      $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
      /* Gün "Fark etmez"e dönünce saat listesi de hafta içi saatlerine döner */
      $$('[data-gun]', form).forEach(function (s) { s.dispatchEvent(new Event('change')); });
    }
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

  /* Kaydırınca ilan, mahalle ve blog kartları belirir; ilk açılışta ekranda olanlar hemen görünür */
  if (kok.classList.contains('hareket') && 'IntersectionObserver' in window) {
    var belirt = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (g.isIntersecting) { g.target.classList.remove('bekliyor'); belirt.unobserve(g.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('.kart, .yazi, .mahalle-kart').forEach(function (el) {
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
    ortaklik: 'Örnek sayfa: temada iş ortaklığı formu ayrı bir sayfada açılır.',
    mahalle: 'Örnek sayfa: bu bağlantı mahallenin rehber sayfasını açar. Mahalleler ve yazıları panelden eklenir.',
    arama: 'Örnek sayfa: temada arama, seçtiğiniz bilgilere uyan ilanları ayrı bir sayfada listeler.'
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-demo]');
    if (!a) return;
    e.preventDefault();
    bildir(DEMO[a.dataset.demo] || DEMO.ilan);
  });
})();
