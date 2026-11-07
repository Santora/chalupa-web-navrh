// Chalupa Pod Hřebenem – pracovní návrh (placeholder)
(function () {
  'use strict';

  // --- mobilní menu ---
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // --- zobrazení sekcí při scrollu ---
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // --- poptávkový formulář + orientační cena ---
  var form = document.getElementById('inquiry');
  if (!form) return;

  // UKÁZKOVÉ ceny – nahradit skutečnými
  var CFG = {
    email: 'info@example.cz',
    ratePerNight: { low: 4500, high: 6500 }, // Kč / noc
    cleaning: 1500,                           // Kč jednorázově
    minNights: 2,
    highMonths: [12, 1, 2, 3, 7, 8]           // vysoká sezóna
  };

  var from = form.elements.from, to = form.elements.to, guests = form.elements.guests;
  var out = document.getElementById('estimate');
  var today = new Date().toISOString().slice(0, 10);
  from.min = today; to.min = today;

  function nights() {
    if (!from.value || !to.value) return 0;
    return Math.round((new Date(to.value) - new Date(from.value)) / 86400000);
  }

  function estimate() {
    var n = nights();
    if (!n) { out.innerHTML = 'Vyberte termín a zobrazí se orientační cena.'; return null; }
    if (n < 0) { out.innerHTML = 'Odjezd musí být po příjezdu.'; return null; }
    if (n < CFG.minNights) { out.innerHTML = 'Minimální délka pobytu je ' + CFG.minNights + ' noci.'; return null; }
    var total = 0, d = new Date(from.value);
    for (var i = 0; i < n; i++) {
      var high = CFG.highMonths.indexOf(d.getMonth() + 1) !== -1;
      total += high ? CFG.ratePerNight.high : CFG.ratePerNight.low;
      d.setDate(d.getDate() + 1);
    }
    total += CFG.cleaning;
    out.innerHTML = n + ' nocí, orientačně <strong>' + total.toLocaleString('cs-CZ') + ' Kč</strong> (včetně úklidu). Konečnou cenu potvrdíme v odpovědi.';
    return { n: n, total: total };
  }

  from.addEventListener('change', function () {
    if (!to.value || to.value <= from.value) {
      var d = new Date(from.value); d.setDate(d.getDate() + CFG.minNights);
      to.value = d.toISOString().slice(0, 10);
    }
    to.min = from.value;
    estimate();
  });
  to.addEventListener('change', estimate);

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var est = estimate();
    if (!est) { out.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    var f = form.elements;
    var body = [
      'Termín: ' + f.from.value + ' – ' + f.to.value + ' (' + est.n + ' nocí)',
      'Počet osob: ' + f.guests.value,
      'Orientační cena: ' + est.total + ' Kč',
      'Jméno: ' + f.name.value,
      'Telefon: ' + f.phone.value,
      '',
      f.message.value
    ].join('\n');
    // Pro ostrý provoz nahradit odesláním na Formspree / vlastní backend.
    window.location.href = 'mailto:' + CFG.email +
      '?subject=' + encodeURIComponent('Poptávka pobytu ' + f.from.value) +
      '&body=' + encodeURIComponent(body);
  });
})();
