# Pod Hřebenem – návrh webu (CS, EN, DE, PL, SK)

Statický web (HTML + CSS + trocha JS). Obsah je ukázkový, místa k doplnění jsou značena `[Doplnit]`, `[To add]`, `[Placeholder]` apod.

## Struktura
- Kořen = česky: `index.html`, `vybaveni.html`, `galerie.html`, `okoli.html`, `cenik.html`, `kontakt.html`
- `en/`, `de/`, `pl/`, `sk/` = stejné stránky pod stejnými názvy souborů
- `style.css`, `main.js` – společné pro všechny jazyky (jazyk se pozná z `<html lang>`)
- `404.html`, `robots.txt` (zatím blokuje indexování), `.nojekyll`

## Nasazení na GitHub Pages
1. Vytvořit repozitář a nahrát celý obsah (včetně složek `en`, `de`, `pl`, `sk` a souboru `.nojekyll`) do kořene.
2. Settings → Pages → Source: *Deploy from a branch*, větev `main`, složka `/ (root)`.
3. Web poběží na `https://UZIVATEL.github.io/REPOZITAR/`. Všechny odkazy jsou relativní, funguje i v podadresáři.

## Úpravy textů (doporučeno přes generátor)
Všechny texty všech pěti jazyků jsou v jednom souboru `build.py` (slovník `T`, pořadí cs, en, de, pl, sk).
Po úpravě spusťte `python build.py` a vznikne celý web znovu. Ruční úpravy v 30 souborech tím odpadají.

## Co doplnit po dodání podkladů
- [ ] Skutečný název, adresa, telefon, e-mail (hledat `example.cz`, `+420000000000`, `[Doplnit`)
- [ ] Fotografie (zmenšit, WebP/JPEG, popisky `alt`, `loading="lazy"`), nahradit bloky `.ph`
- [ ] Ceny: tabulka v `build.py` (`p_r*`) a konstanty `CFG` v `main.js`
- [ ] Skutečné recenze s odkazem na zdroj
- [ ] Mapa (Mapy.cz / OpenStreetMap), provozní řád PDF
- [ ] Odesílání formuláře: dnes `mailto:`, pro ostrý provoz např. Formspree
- [ ] V `build.py` nastavit `BASE` na adresu webu (zapne hreflang, canonical a `sitemap.xml`) a změnit `robots.txt` na `Allow: /`
- [ ] Překlady nechat zkontrolovat rodilým mluvčím (psané bez korektury)
