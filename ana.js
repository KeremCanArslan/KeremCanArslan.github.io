(function () {
  var en = document.documentElement.lang === 'en';

  // Son güncelleme: sunucunun verdiği tarih
  var g = document.getElementById('guncel'), t = new Date(document.lastModified);
  if (g && !isNaN(t) && t.getFullYear() > 2025) {
    g.textContent = (en ? 'Last updated: ' : 'Son güncelleme: ') +
      t.toLocaleDateString(en ? 'en-GB' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Örnek sayısı listeden sayılır
  var satirlar = [].slice.call(document.querySelectorAll('.dizin li'));
  var sayi = document.getElementById('ornek-sayi');
  if (sayi && satirlar.length) sayi.textContent = satirlar.filter(function (li) { return li.hasAttribute('data-canli'); }).length;

  // Uzun liste kısa açılır: ilk 10 satır, gerisi düğmeyle (betik çalışmazsa liste tam görünür)
  var liste = document.querySelector('.dizin'), hepsiniAc = null;
  function listeyiAc() { if (liste) liste.classList.remove('kisa'); if (hepsiniAc) hepsiniAc.hidden = true; }
  if (liste && satirlar.length > 12) {
    liste.classList.add('kisa');
    hepsiniAc = document.createElement('button');
    hepsiniAc.type = 'button';
    hepsiniAc.className = 'btn dizin-ac';
    hepsiniAc.textContent = (en ? 'Show all demos' : 'Bütün örnekleri göster') + ' (' + satirlar.length + ')';
    liste.insertAdjacentElement('afterend', hepsiniAc);
    hepsiniAc.addEventListener('click', listeyiAc);
  }

  // Süzgeç
  var dugmeler = [].slice.call(document.querySelectorAll('.suzgec button'));
  dugmeler.forEach(function (b) {
    var k = b.dataset.k;
    b.querySelector('sup').textContent = k === 'hepsi' ? satirlar.length : satirlar.filter(function (li) { return li.dataset.k === k; }).length;
    b.addEventListener('click', function () {
      if (k !== 'hepsi') listeyiAc();
      dugmeler.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      satirlar.forEach(function (li) { li.hidden = !(k === 'hepsi' || li.dataset.k === k); });
    });
  });

  // Vaka görünümü
  [].slice.call(document.querySelectorAll('[data-sekme]')).forEach(function (f) {
    var ekran = f.querySelector('.ekran img'), tel = f.querySelector('.tel img'), telKutu = tel && tel.closest('.tel');
    var bs = [].slice.call(f.querySelectorAll('.sekme button'));
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        ekran.src = b.dataset.ekran; ekran.alt = b.dataset.alt;
        // Sekmenin kendi telefon görüntüsü yoksa telefon çerçevesi gizlenir
        if (telKutu) { telKutu.hidden = !b.dataset.tel; if (b.dataset.tel) tel.src = b.dataset.tel; }
      });
    });
  });

  // İmleçle gelen önizleme (yalnız fareyle)
  var on = document.querySelector('.onizleme'), dizin = document.querySelector('.dizin');
  if (!on || !dizin || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  // konum: imlecin yeri bir fare ya da tekerlek olayından öğrenildi mi
  var img = on.querySelector('img'), x = 0, y = 0, konum = false, bekliyor = false;
  function yerlestir() {
    bekliyor = false;
    var w = on.offsetWidth, h = on.offsetHeight;
    var px = x + 28, py = y - h / 2;
    if (px + w > innerWidth - 12) px = x - w - 28;
    py = Math.max(12, Math.min(py, innerHeight - h - 12));
    on.style.transform = 'translate(' + px + 'px,' + py + 'px)';
  }
  // Fare sabitken tekerlekle kaydırınca satır imlecin altına kendisi gelir; imlecin son yeri
  // fare ve tekerlek olaylarından tutulur, önizleme açılırken o yere konur.
  function izle(e) {
    x = e.clientX; y = e.clientY; konum = true;
    if (on.classList.contains('acik') && !bekliyor) { bekliyor = true; requestAnimationFrame(yerlestir); }
  }
  document.addEventListener('mousemove', izle, { passive: true });
  document.addEventListener('wheel', izle, { passive: true });
  satirlar.forEach(function (li) {
    var k = li.querySelector('img.d-kucuk');
    li.addEventListener('mouseenter', function () {
      if (!k || !konum) { on.classList.remove('acik'); return; }
      img.src = k.getAttribute('src'); yerlestir(); on.classList.add('acik');
    });
    li.addEventListener('mouseleave', function () { on.classList.remove('acik'); });
  });
})();
