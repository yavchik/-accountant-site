#!/usr/bin/env python3
"""Збирає index.html і team.html (з їхніми css/ та js/) з погоджених блоків у blocks/.

Блоки лишаються джерелом: правите блок, запускаєте `python3 tools/build.py`,
і сторінка сайту оновлюється. Потрібен лише Python 3, без сторонніх пакетів.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOCKS = ["01-header", "02-hero", "03-services", "04-about", "05-process", "06-faq", "07-contact", "08-footer"]
TEAM = ["09-team"]   # сторінка team.html: шапка + ці блоки + підвал
SITE_URL = "https://happy-finance-beta.vercel.app/"   # основна адреса; змініть, коли буде свій домен

TITLE = "Happy Finance — бухгалтерський супровід ФОП і ТОВ"
DESCRIPTION = ("Бухгалтерський супровід ФОП і ТОВ: облік, звітність, податки, кадри "
               "й фінансовий моніторинг у банку. Вартість після консультації.")
TEAM_TITLE = "Команда Happy Finance — хто веде ваш облік"
TEAM_DESCRIPTION = ("Знайомтеся з командою Happy Finance: засновниця Марія Панченко і бухгалтери, "
                    "які ведуть первинні документи, зарплату, звітність і фінанси ФОП і ТОВ.")


def dedent(text, n):
    pad = " " * n
    return "\n".join(line[n:] if line.startswith(pad) else line.lstrip() if not line.strip() else line
                     for line in text.splitlines())


def parse(name):
    src = (ROOT / "blocks" / f"{name}.html").read_text(encoding="utf-8")
    css = src.split("<style>", 1)[1].split("</style>", 1)[0]
    # демо-стилі лишаються тільки в окремому файлі блоку
    css = re.split(r"\n\s*/\* =+ (?:ДЕМО|Лише для перегляду)", css)[0]
    body = re.search(r"<!-- =+ БЛОК \d\d .*?-->(.*?)<!-- =+ /БЛОК \d\d", src, re.S).group(1)
    ld = re.findall(r'\s*<script type="application/ld\+json">(.*?)</script>', body, re.S)
    body = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', "", body, flags=re.S)
    js = re.findall(r"\s*<script>(.*?)</script>", body, re.S)
    body = re.sub(r"\s*<script>.*?</script>", "", body, flags=re.S)
    body = body.replace("../assets/", "assets/")
    return {
        "css": dedent(css.strip("\n"), 4).rstrip(),
        "html": body.strip("\n"),
        "js": [dedent(j.strip("\n"), 4).rstrip() for j in js],
        "ld": [dedent(l.strip("\n"), 4).strip() for l in ld],
    }


HEAD = "/* Згенеровано з blocks/ скриптом tools/build.py — правте блоки, а не цей файл. */\n"


def write_assets(parts, names, css_name, js_name):
    css = HEAD + "\n\n".join(f"/* ================= {n} ================= */\n{parts[n]['css']}" for n in names) + "\n"
    (ROOT / "css" / css_name).write_text(css, encoding="utf-8")
    js = HEAD + "\n\n".join(f"/* ================= {n} ================= */\n" + "\n\n".join(parts[n]["js"])
                             for n in names if parts[n]["js"]) + "\n"
    (ROOT / "js" / js_name).write_text(js, encoding="utf-8")


def page(title, description, path, og_alt, css_name, js_name, gsap, ld, body):
    url = SITE_URL + path
    gsap_tags = """
  <!-- GSAP + ScrollTrigger: лише для сцени «Хаос → порядок» на головному екрані -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>""" if gsap else ""
    return f"""<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Згенеровано з blocks/ скриптом tools/build.py — правте блоки, а не цей файл. -->
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="theme-color" content="#121420">
  <link rel="canonical" href="{url}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="uk_UA">
  <meta property="og:site_name" content="Happy Finance">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE_URL}assets/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{og_alt}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/images/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">

  <link rel="preload" href="assets/fonts/onest-var-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/{css_name}">
{gsap_tags}
  <script src="js/config.js" defer></script>
  <script src="js/contacts.js" defer></script>
  <script src="js/{js_name}" defer></script>
{ld}
</head>
<body>
{body}
</body>
</html>
"""


def to_home(html):
    """Шапка й підвал на інших сторінках: якорі ведуть на головну, а не в межах сторінки."""
    html = re.sub(r'href="#(services|about|process|faq|contact|match)"', r'href="./#\1"', html)
    return html.replace('class="hdr__logo" href="#top" aria-label="Happy Finance, на початок сторінки"',
                        'class="hdr__logo" href="./" aria-label="Happy Finance, на головну"')


def main():
    parts = {name: parse(name) for name in BLOCKS + TEAM}
    for p in parts.values():
        p["html"] = p["html"].replace('href="../team.html', 'href="team.html').replace('href="../index.html', 'href="./')

    # ---------- Головна ----------
    write_assets(parts, BLOCKS, "site.css", "site.js")
    ld = "\n".join(f'  <script type="application/ld+json">\n{l}\n  </script>' for n in BLOCKS for l in parts[n]["ld"])
    main_html = "\n\n".join(parts[n]["html"] for n in BLOCKS[1:-1])
    body = f"""{parts["01-header"]["html"]}

<main id="main">

{main_html}

</main>

{parts["08-footer"]["html"]}"""
    (ROOT / "index.html").write_text(page(TITLE, DESCRIPTION, "", "Happy Finance. Бухгалтерія — це ваш спокій.",
                                          "site.css", "site.js", True, ld, body), encoding="utf-8")

    # ---------- Команда ----------
    names = ["01-header"] + TEAM + ["08-footer"]
    write_assets(parts, names, "team.css", "team.js")
    header = to_home(parts["01-header"]["html"]).replace('class="hdr__link" href="team.html"',
                                                         'class="hdr__link" href="team.html" aria-current="page"')
    header = header.replace('class="hdr__menu-link" href="team.html"', 'class="hdr__menu-link" href="team.html" aria-current="page"')
    team_html = "\n\n".join(parts[n]["html"] for n in TEAM)
    body = f"""{header}

<main id="main">

{team_html}

</main>

{to_home(parts["08-footer"]["html"])}"""
    (ROOT / "team.html").write_text(page(TEAM_TITLE, TEAM_DESCRIPTION, "team.html", "Команда Happy Finance.",
                                         "team.css", "team.js", False, "", body), encoding="utf-8")
    print("index.html, team.html, css/site.css, css/team.css, js/site.js, js/team.js оновлено")


if __name__ == "__main__":
    main()
