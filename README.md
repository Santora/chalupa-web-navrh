# Chalupa Pod Hřebenem – návrh webu (placeholder)

Statický web (HTML + CSS + trocha JS), bez build kroku. Obsah je ukázkový, místa k doplnění jsou značena `[Doplnit]` nebo `[Placeholder]`.

## Struktura
- `index.html`, `vybaveni.html`, `galerie.html`, `okoli.html`, `cenik.html`, `kontakt.html`, `404.html`
- `style.css`, `main.js` – sdílený vzhled a skript (menu, kalkulace ceny, poptávkový formulář)
- `robots.txt` – zatím blokuje indexování (návrh), při ostrém nasazení změnit

## Nasazení na GitHub Pages
1. Vytvořit repozitář a nahrát všechny soubory do kořene.
2. Settings → Pages → Source: *Deploy from a branch*, větev `main`, složka `/ (root)`.
3. Web poběží na `https://UZIVATEL.github.io/REPOZITAR/`. Všechny odkazy jsou relativní, takže funguje i v podadresáři.

## Co doplnit po dodání podkladů
- [ ] Skutečný název, adresa, telefon, e-mail (hledat `example.cz`, `+420000000000`, `[Doplnit`)
- [ ] Fotografie (zmenšit, WebP/JPEG, `alt` popisky, `loading="lazy"`), nahradit `.ph` bloky
- [ ] Ceny a pravidla v `cenik.html` a konstanty `CFG` v `main.js`
- [ ] Skutečné recenze s odkazem na zdroj
- [ ] Mapa (Mapy.cz / OpenStreetMap), provozní řád PDF
- [ ] Odesílání formuláře: dnes `mailto:`, pro ostrý provoz např. Formspree
- [ ] `robots.txt`, `sitemap.xml`, `<link rel="canonical">`, Open Graph obrázek, jazykové verze (EN/PL)
