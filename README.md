# Happy Finance — сайт бухгалтерського супроводу

Статичний сайт без збирачів: HTML, CSS (custom properties), vanilla JS.
Розробляється блоками: один блок = один HTML-файл у `blocks/`, що відкривається окремо.

## Структура

```
index.html            — збирається після погодження всіх блоків
css/tokens.css        — кольори, шрифти, відступи, радіуси, тіні, рух
css/base.css          — шрифти, reset, типографіка, контейнер, кнопки
blocks/00-design-system.html — превʼю дизайн-системи
blocks/NN-*.html      — блоки сайту
js/main.js            — спільна ініціалізація (з'явиться разом з першим блоком, якому потрібен)
assets/fonts          — Onest, IBM Plex Mono (woff2, кирилиця + латиниця)
assets/images         — логотипи та зображення
```

## Як переглянути локально

Шрифти й стилі підключаються відносними шляхами, тому найнадійніше відкривати через локальний сервер:

```bash
python3 -m http.server 8000
# відкрити http://localhost:8000/blocks/00-design-system.html
```

Подвійний клік по файлу теж працює в Chrome/Edge, але Firefox може не завантажити шрифти з `../assets`.

## Правила для блоків

- Класи з префіксом блоку (`hero__title`, `svc__card`), жодних глобальних селекторів у CSS блоку.
- Кольори лише через семантичні токени: `--bg`, `--fg`, `--fg-strong`, `--fg-muted`, `--accent`, `--accent-text`, `--on-accent`, `--line`.
- Темна секція: атрибут `data-theme="dark"`.
- Анімуються лише `transform` і `opacity`; `prefers-reduced-motion` вимикає рух.
- Дані, яких ще немає, позначаються `<span class="placeholder">[ПЛЕЙСХОЛДЕР: …]</span>`.

## Публікація

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.

## Шрифти

Onest та IBM Plex Mono розповсюджуються за SIL Open Font License 1.1.
