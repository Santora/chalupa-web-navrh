// Pod Hřebenem – pracovní návrh (placeholder). Jazyk se čte z <html lang="..">.
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'cs').slice(0, 2);
  var LOCALE = { cs: 'cs-CZ', en: 'en-GB', de: 'de-DE', pl: 'pl-PL', sk: 'sk-SK' };

  // Texty kalkulačky a e-mailu. U minNights je tvar „noci/Nächte/..." uveden pro 2–4 noci.
  var S = {
    cs: { cur: 'Kč', pick: 'Vyberte termín a zobrazí se orientační cena.', order: 'Odjezd musí být po příjezdu.',
      min: 'Minimální délka pobytu je {min} noci.',
      res: '{n} {nights}, orientačně <strong>{total} Kč</strong> (včetně úklidu). Konečnou cenu potvrdíme v odpovědi.',
      subj: 'Poptávka pobytu', term: 'Termín', guests: 'Počet osob', price: 'Orientační cena', name: 'Jméno', phone: 'Telefon',
      nights: ['noc', 'noci', 'nocí'] },
    en: { cur: 'CZK', pick: 'Choose your dates to see an estimated price.', order: 'Departure must be after arrival.',
      min: 'Minimum stay is {min} nights.',
      res: '{n} {nights}, approx. <strong>{total} CZK</strong> (cleaning included). We will confirm the final price in our reply.',
      subj: 'Stay inquiry', term: 'Dates', guests: 'Guests', price: 'Estimated price', name: 'Name', phone: 'Phone',
      nights: ['night', 'nights', 'nights'] },
    de: { cur: 'CZK', pick: 'Wählen Sie einen Zeitraum, um den ungefähren Preis zu sehen.', order: 'Die Abreise muss nach der Anreise liegen.',
      min: 'Mindestaufenthalt: {min} Nächte.',
      res: '{n} {nights}, ca. <strong>{total} CZK</strong> (inkl. Endreinigung). Den Endpreis bestätigen wir in unserer Antwort.',
      subj: 'Anfrage Aufenthalt', term: 'Zeitraum', guests: 'Personen', price: 'Ungefährer Preis', name: 'Name', phone: 'Telefon',
      nights: ['Nacht', 'Nächte', 'Nächte'] },
    pl: { cur: 'Kč', pick: 'Wybierz termin, a pokażemy orientacyjną cenę.', order: 'Wyjazd musi być po przyjeździe.',
      min: 'Minimalny pobyt to {min} noce.',
      res: '{n} {nights}, orientacyjnie <strong>{total} Kč</strong> (ze sprzątaniem). Ostateczną cenę potwierdzimy w odpowiedzi.',
      subj: 'Zapytanie o pobyt', term: 'Termin', guests: 'Liczba osób', price: 'Orientacyjna cena', name: 'Imię i nazwisko', phone: 'Telefon',
      nights: ['noc', 'noce', 'nocy'] },
    sk: { cur: 'Kč', pick: 'Vyberte termín a zobrazí sa orientačná cena.', order: 'Odchod musí byť po príchode.',
      min: 'Minimálna dĺžka pobytu je {min} noci.',
      res: '{n} {nights}, orientačne <strong>{total} Kč</strong> (vrátane upratovania). Konečnú cenu potvrdíme v odpovedi.',
      subj: 'Dopyt na pobyt', term: 'Termín', guests: 'Počet osôb', price: 'Orientačná cena', name: 'Meno', phone: 'Telefón',
      nights: ['noc', 'noci', 'nocí'] }
  };
  var L = S[LANG] || S.cs;
  var LOC = LOCALE[LANG] || 'cs-CZ';

  function nightsWord(n) {
    var w = L.nights, m10 = n % 10, m100 = n % 100;
    if (LANG === 'en' || LANG === 'de') return n === 1 ? w[0] : w[1];
    if (LANG === 'pl') {
      if (n === 1) return w[0];
      return (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) ? w[1] : w[2];
    }
    if (n === 1) return w[0];
    return (n >= 2 && n <= 4) ? w[1] : w[2];
  }

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

  // UKÁZKOVÉ ceny – nahradit skutečnými (ceny v tabulce jsou v build.py)
  var CFG = {
    email: 'info@example.cz',
    ratePerNight: { low: 4500, high: 6500 }, // Kč / noc
    cleaning: 1500,                           // Kč jednorázově
    minNights: 2,
    highMonths: [12, 1, 2, 3, 7, 8]           // vysoká sezóna
  };

  var from = form.elements.from, to = form.elements.to;
  var out = document.getElementById('estimate');
  var today = new Date().toISOString().slice(0, 10);
  from.min = today; to.min = today;
  out.innerHTML = L.pick;

  function nights() {
    if (!from.value || !to.value) return 0;
    return Math.round((new Date(to.value) - new Date(from.value)) / 86400000);
  }

  function estimate() {
    var n = nights();
    if (!n) { out.innerHTML = L.pick; return null; }
    if (n < 0) { out.innerHTML = L.order; return null; }
    if (n < CFG.minNights) { out.innerHTML = L.min.replace('{min}', CFG.minNights); return null; }
    var total = 0, d = new Date(from.value);
    for (var i = 0; i < n; i++) {
      var high = CFG.highMonths.indexOf(d.getMonth() + 1) !== -1;
      total += high ? CFG.ratePerNight.high : CFG.ratePerNight.low;
      d.setDate(d.getDate() + 1);
    }
    total += CFG.cleaning;
    out.innerHTML = L.res.replace('{n}', n).replace('{nights}', nightsWord(n)).replace('{total}', total.toLocaleString(LOC));
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
      L.term + ': ' + f.from.value + ' – ' + f.to.value + ' (' + est.n + ' ' + nightsWord(est.n) + ')',
      L.guests + ': ' + f.guests.value,
      L.price + ': ' + est.total + ' ' + L.cur,
      L.name + ': ' + f.name.value,
      L.phone + ': ' + f.phone.value,
      '',
      f.message.value
    ].join('\n');
    // Pro ostrý provoz nahradit odesláním na Formspree / vlastní backend.
    window.location.href = 'mailto:' + CFG.email +
      '?subject=' + encodeURIComponent(L.subj + ' ' + f.from.value) +
      '&body=' + encodeURIComponent(body);
  });
})();
