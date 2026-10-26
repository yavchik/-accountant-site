#!/usr/bin/env python3
"""Збирає index.html, css/site.css і js/site.js з погоджених блоків у blocks/.

Блоки лишаються джерелом: правите блок, запускаєте `python3 tools/build.py`,
і сторінка сайту оновлюється. Потрібен лише Python 3, без сторонніх пакетів.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOCKS = ["01-header", "02-hero", "03-services", "04-about", "05-process", "06-faq", "07-contact", "08-footer"]
SITE_URL = "https://yavchik.github.io/-accountant-site/"   # змініть, коли буде свій домен

TITLE = "Happy Finance — бухгалтерський супровід ФОП і ТОВ"
DESCRIPTION = ("Бухгалтерський супровід ФОП і ТОВ: облік, звітність, податки, кадри "
               "й фінансовий моніторинг у банку. Вартість після консультації.")


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


def main():
    parts = {name: parse(name) for name in BLOCKS}

    head = "/* Згенеровано з blocks/ скриптом tools/build.py — правте блоки, а не цей файл. */\n"
    css = head + "\n\n".join(f"/* ================= {n} ================= */\n{p['css']}" for n, p in parts.items()) + "\n"
    (ROOT / "css" / "site.css").write_text(css, encoding="utf-8")

    js = head + "\n\n".join(f"/* ================= {n} ================= */\n" + "\n\n".join(p["js"])
                            for n, p in parts.items() if p["js"]) + "\n"
    (ROOT / "js" / "site.js").write_text(js, encoding="utf-8")

    ld = "\n".join(f'  <script type="application/ld+json">\n{l}\n  </script>' for p in parts.values() for l in p["ld"])
    main_html = "\n\n".join(parts[n]["html"] for n in BLOCKS[1:-1])
    html = f"""<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Згенеровано з blocks/ скриптом tools/build.py — правте блоки, а не цей файл. -->
  <title>{TITLE}</title>
  <meta name="description" content="{DESCRIPTION}">
  <meta name="theme-color" content="#121420">
  <link rel="canonical" href="{SITE_URL}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="uk_UA">
  <meta property="og:site_name" content="Happy Finance">
  <meta property="og:title" content="{TITLE}">
  <meta property="og:description" content="{DESCRIPTION}">
  <meta property="og:url" content="{SITE_URL}">
  <meta property="og:image" content="{SITE_URL}assets/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Happy Finance. Бухгалтерія — це ваш спокій.">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/images/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">

  <link rel="preload" href="assets/fonts/onest-var-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/site.css">

  <!-- GSAP + ScrollTrigger: лише для сцени «Хаос → порядок» на головному екрані -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
  <script src="js/config.js" defer></script>
  <script src="js/contacts.js" defer></script>
  <script src="js/site.js" defer></script>
{ld}
</head>
<body>
{parts["01-header"]["html"]}

<main id="main">

{main_html}

</main>

{parts["08-footer"]["html"]}
</body>
</html>
"""
    (ROOT / "index.html").write_text(html, encoding="utf-8")
    print("index.html, css/site.css, js/site.js оновлено")


if __name__ == "__main__":
    main()
