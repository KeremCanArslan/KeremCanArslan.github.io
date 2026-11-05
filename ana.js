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

  // Süzgeç
  var dugmeler = [].slice.call(document.querySelectorAll('.suzgec button'));
  dugmeler.forEach(function (b) {
    var k = b.dataset.k;
    b.querySelector('sup').textContent = k === 'hepsi' ? satirlar.length : satirlar.filter(function (li) { return li.dataset.k === k; }).length;
    b.addEventListener('click', function () {
      dugmeler.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      satirlar.forEach(function (li) { li.hidden = !(k === 'hepsi' || li.dataset.k === k); });
    });
  });

  // Vaka görünümü
  [].slice.call(document.querySelectorAll('[data-sekme]')).forEach(function (f) {
    var ekran = f.querySelector('.ekran img'), tel = f.querySelector('.tel img');
    var bs = [].slice.call(f.querySelectorAll('.sekme button'));
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        ekran.src = b.dataset.ekran; ekran.alt = b.dataset.alt; tel.src = b.dataset.tel;
      });
    });
  });

  // İmleçle gelen önizleme (yalnız fareyle)
  var on = document.querySelector('.onizleme'), dizin = document.querySelector('.dizin');
  if (!on || !dizin || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var img = on.querySelector('img'), x = 0, y = 0, bekliyor = false;
  function yerlestir() {
    bekliyor = false;
    var w = on.offsetWidth, h = on.offsetHeight;
    var px = x + 28, py = y - h / 2;
    if (px + w > innerWidth - 12) px = x - w - 28;
    py = Math.max(12, Math.min(py, innerHeight - h - 12));
    on.style.transform = 'translate(' + px + 'px,' + py + 'px)';
  }
  dizin.addEventListener('mousemove', function (e) {
    x = e.clientX; y = e.clientY;
    if (!bekliyor) { bekliyor = true; requestAnimationFrame(yerlestir); }
  });
  satirlar.forEach(function (li) {
    var k = li.querySelector('img.d-kucuk');
    li.addEventListener('mouseenter', function () {
      if (!k) { on.classList.remove('acik'); return; }
      img.src = k.getAttribute('src'); on.classList.add('acik');
    });
    li.addEventListener('mouseleave', function () { on.classList.remove('acik'); });
  });
})();
