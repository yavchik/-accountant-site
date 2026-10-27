# Happy Finance — сайт бухгалтерського супроводу

Статичний сайт без збирачів і npm: HTML, CSS (custom properties), vanilla JS.
GSAP + ScrollTrigger (з cdnjs) використовується лише для сцени «Хаос → порядок» на головному екрані.

## Структура

```
index.html            — сторінка сайту (згенерована з blocks/, див. нижче)
css/tokens.css        — кольори, шрифти, відступи, радіуси, тіні, рух
css/base.css          — шрифти, reset, типографіка, контейнер, кнопки
css/site.css          — стилі всіх блоків (згенеровано)
js/config.js          — КОНТАКТИ: телефон, Telegram, Instagram
js/contacts.js        — посилання для контактів і їх підстановка на сторінку
js/site.js            — скрипти всіх блоків (згенеровано)
blocks/NN-*.html      — блоки сайту, кожен відкривається окремо (джерело для index.html)
tools/build.py        — збирає index.html, css/site.css, js/site.js з blocks/
assets/fonts          — Onest, IBM Plex Mono (woff2, кирилиця + латиниця)
assets/images         — логотипи, іконки вкладки, картинка для соцмереж
```

## Як заповнити контакти

Відкрийте `js/config.js` і впишіть значення в лапках (формат підписаний у файлі).
Контакти зʼявляться в меню на телефоні, у блоці «Контакти», у підвалі та в кнопках Telegram і Instagram.
Збирати сайт після цього не потрібно.

## Як змінити блок

1. Правите файл у `blocks/` (наприклад, `blocks/06-faq.html`) і перевіряєте його окремо.
2. Запускаєте `python3 tools/build.py` — оновляться `index.html`, `css/site.css`, `js/site.js`.

`tools/build.py` потрібен лише Python 3 (без пакетів); на роботу сайту він не впливає.

## Як переглянути локально

```bash
python3 -m http.server 8000
# сайт:        http://localhost:8000/
# окремий блок: http://localhost:8000/blocks/03-services.html
```

## Публікація

Сайт опублікований у двох місцях, обидва оновлюються самі після кожного push у гілку `claude/project-thread-6hfbbp`:

- **Vercel (основна адреса):** https://happy-finance-beta.vercel.app/ — проєкт `happy-finance`, Application Preset «Other», без команди збирання.
- **GitHub Pages:** https://yavchik.github.io/-accountant-site/

### Як увімкнути GitHub Pages з нуля

1. На GitHub відкрийте репозиторій → **Settings** → **Pages**.
2. **Source**: Deploy from a branch.
3. **Branch**: гілка з сайтом (зараз `claude/project-thread-6hfbbp`), папка `/ (root)` → **Save**.

Якщо зʼявиться власний домен, змініть `SITE_URL` у `tools/build.py` (для картинки в соцмережах і canonical) і запустіть збирання.

## Правила для блоків

- Класи з префіксом блоку (`hero__title`, `svc__card`), жодних глобальних селекторів у CSS блоку.
- Кольори лише через семантичні токени: `--bg`, `--fg`, `--fg-strong`, `--fg-muted`, `--accent`, `--accent-text`, `--on-accent`, `--line`.
- Темна секція: атрибут `data-theme="dark"`.
- Анімуються лише `transform` і `opacity`; `prefers-reduced-motion` вимикає рух.
- Дані, яких ще немає, позначаються `<span class="placeholder">[ПЛЕЙСХОЛДЕР]</span>`.
- Демо-стилі блоку починаються з коментаря `/* ===== ДЕМО` і в сайт не потрапляють.

## Що ще чекає даних

- Питання FAQ 6–8 — після відповідей Марії.

## Шрифти

Onest та IBM Plex Mono розповсюджуються за SIL Open Font License 1.1.
