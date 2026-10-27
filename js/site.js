/* Згенеровано з blocks/ скриптом tools/build.py — правте блоки, а не цей файл. */
/* ================= 01-header ================= */
(function () {
function initHeader() {
  var hdr = document.querySelector("[data-hdr]");
  if (!hdr) return;
  if (window.HFContacts) window.HFContacts.fill(hdr);

  var burger = hdr.querySelector(".hdr__burger");
  var menu = hdr.querySelector(".hdr__menu");
  var nav = hdr.querySelector(".hdr__nav");
  var indicator = hdr.querySelector(".hdr__indicator");
  var navLinks = Array.prototype.slice.call(hdr.querySelectorAll(".hdr__link"));
  var menuLinks = Array.prototype.slice.call(hdr.querySelectorAll(".hdr__menu-link"));
  var desktop = window.matchMedia("(min-width: 1024px)");
  var headerH = function () { return hdr.offsetHeight; };

  /* ---------- 1. Тема і стан при скролі ---------- */
  var lastY = window.scrollY;
  var ticking = false;
  var isOpen = false;

  function updateOnScroll() {
    var y = window.scrollY;
    hdr.classList.toggle("is-scrolled", y > 8);
    // ховаємо при скролі вниз, показуємо при скролі вгору; не ховаємо, якщо фокус у шапці
    var goingDown = y > lastY;
    var hide = goingDown && y > headerH() * 3 && !isOpen && !hdr.contains(document.activeElement);
    if (Math.abs(y - lastY) > 4) hdr.classList.toggle("is-hidden", hide);
    lastY = y;
    updateTheme();
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateOnScroll); }
  }, { passive: true });
  hdr.addEventListener("focusin", function () { hdr.classList.remove("is-hidden"); });

  // Тема шапки = тема секції верхнього рівня, що зараз під нею
  var themed = Array.prototype.slice.call(document.querySelectorAll("main > [data-theme], body > footer[data-theme]"));
  function updateTheme() {
    if (isOpen || !themed || !themed.length) return;
    var probe = headerH() / 2;
    for (var i = 0; i < themed.length; i++) {
      var r = themed[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) {
        hdr.setAttribute("data-theme", themed[i].getAttribute("data-theme"));
        return;
      }
    }
  }
  updateOnScroll();

  /* ---------- 2. Активний розділ і лінія під пунктом ---------- */
  function moveIndicator(link) {
    if (!link || !desktop.matches) { indicator.style.opacity = "0"; return; }
    var navBox = nav.getBoundingClientRect();
    var box = link.getBoundingClientRect();
    indicator.style.transform = "translateX(" + (box.left - navBox.left) + "px) scaleX(" + box.width + ")";
    indicator.style.opacity = "1";
  }

  function setActive(id) {
    var active = null;
    navLinks.concat(menuLinks).forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      if (on && a.classList.contains("hdr__link")) active = a;
    });
    moveIndicator(active);
  }

  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var current = sections.filter(function (s) { return visible[s.id]; }).pop();
      setActive(current ? current.id : null);
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spyIO.observe(s); });
  }
  window.addEventListener("resize", function () {
    moveIndicator(hdr.querySelector('.hdr__link[aria-current="true"]'));
  }, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      moveIndicator(hdr.querySelector('.hdr__link[aria-current="true"]'));
    });
  }

  /* ---------- 3. Мобільне меню ---------- */
  var themeBeforeOpen = hdr.getAttribute("data-theme");

  function focusables() {
    return [burger].concat(Array.prototype.slice.call(menu.querySelectorAll("a[href], button:not([disabled])")));
  }

  function openMenu() {
    isOpen = true;
    themeBeforeOpen = hdr.getAttribute("data-theme");
    hdr.setAttribute("data-theme", "dark");
    hdr.classList.add("is-open");
    hdr.classList.remove("is-hidden");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрити меню");
    document.documentElement.style.overflow = "hidden";
    var first = menu.querySelector(".hdr__menu-link");
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
  }

  function closeMenu(returnFocus) {
    if (!isOpen) return;
    isOpen = false;
    hdr.classList.remove("is-open");
    hdr.setAttribute("data-theme", themeBeforeOpen);
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Відкрити меню");
    document.documentElement.style.overflow = "";
    if (returnFocus) burger.focus({ preventScroll: true });
  }

  burger.addEventListener("click", function () { isOpen ? closeMenu(true) : openMenu(); });

  menuLinks.concat(Array.prototype.slice.call(menu.querySelectorAll(".btn"))).forEach(function (a) {
    a.addEventListener("click", function () { closeMenu(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (!isOpen) return;
    if (e.key === "Escape") { e.preventDefault(); closeMenu(true); return; }
    if (e.key === "Tab") {
      var items = focusables();
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Перехід на десктоп при відкритому меню
  var onBp = function (e) { if (e.matches) closeMenu(false); };
  if (desktop.addEventListener) desktop.addEventListener("change", onBp);
  else desktop.addListener(onBp);
}
// Секції сторінки ще не в DOM, поки виконується цей скрипт, тож чекаємо на розбір документа
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHeader);
else initHeader();
})();

/* ================= 02-hero ================= */
(function () {
  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !window.gsap || !window.ScrollTrigger) {
      root.classList.add("hero--static");
      return;
    }
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    var pin = root.querySelector(".hero__pin");
    var stage = root.querySelector(".hero__stage");
    var scene = root.querySelector(".hero__scene");
    var board = root.querySelector(".hero__board");
    var pieces = gsap.utils.toArray(root.querySelectorAll(".hero__piece"));
    var bubbles = pieces.filter(function (p) { return p.classList.contains("hero__piece--bubble"); });
    var tiles = pieces.filter(function (p) { return bubbles.indexOf(p) === -1; });
    var floats = pieces.map(function (p) { return p.querySelector(".hero__float"); });
    var checks = root.querySelectorAll(".hero__check");
    var frameX = root.querySelectorAll(".hero__frame-line--t, .hero__frame-line--b");
    var frameY = root.querySelectorAll(".hero__frame-line--l, .hero__frame-line--r");
    var corners = root.querySelectorAll(".hero__frame-corner");
    var wordChaos = root.querySelector(".hero__state-word--chaos");
    var wordOrder = root.querySelector(".hero__state-word--order");
    var hint = root.querySelector(".hero__hint");

    // Стан «хаос» кожного уламка: зсув у частках сторони дошки + 3D-поворот
    function chaos(spread) {
      var S = board.offsetWidth;
      var n = function (el, key) { return parseFloat(el.dataset[key]) || 0; };
      return {
        x: function (i, el) { return n(el, "x") * S * spread; },
        y: function (i, el) { return n(el, "y") * S * spread; },
        z: function (i, el) { return n(el, "z") * spread; },
        rotationX: function (i, el) { return n(el, "rx"); },
        rotationY: function (i, el) { return n(el, "ry"); },
        rotation: function (i, el) { return n(el, "rz"); }
      };
    }

    var mm = gsap.matchMedia();
    mm.add({
      desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
      compact: "not all and (min-width: 1024px) and (hover: hover) and (pointer: fine)"
    }, function (ctx) {
      var desktop = ctx.conditions.desktop;
      var spread = desktop ? 1 : 0.55;

      gsap.set(pieces, chaos(spread));
      gsap.set(pieces, { opacity: 0, scale: 0.86 });
      gsap.set(checks, { scale: 0 });
      gsap.set(frameX, { scaleX: 0 });
      gsap.set(frameY, { scaleY: 0 });
      gsap.set(corners, { scale: 0 });
      gsap.set(wordOrder, { opacity: 0, y: 8 });
      gsap.set(wordChaos, { opacity: 1, y: 0 });

      // Поява сцени після заголовка
      gsap.to(pieces, {
        opacity: 1, scale: 1, duration: 0.9, ease: "power2.out",
        stagger: { each: 0.05, from: "random" }, delay: 0.45
      });

      // Збирання «хаос → порядок»
      var tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });
      tl.to(bubbles, { opacity: 0, scale: 0.7, z: "+=80", duration: 0.35, stagger: 0.06, ease: "power2.in" }, 0)
        .to(tiles, {
          x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotation: 0, scale: 1, opacity: 1,
          duration: 1, stagger: { each: 0.045, from: "random" }
        }, 0.05)
        .to(wordChaos, { opacity: 0, y: -8, duration: 0.2, ease: "power1.in" }, 0.45)
        .to(wordOrder, { opacity: 1, y: 0, duration: 0.25, ease: "power1.out" }, 0.6)
        .to(frameX, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.7)
        .to(frameY, { scaleY: 1, duration: 0.6, ease: "power2.out" }, 0.75)
        .to(corners, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 1.1)
        .to(checks, { scale: 1, duration: 0.35, stagger: 0.035, ease: "back.out(2.2)" }, 0.95);
      if (hint) tl.to(hint, { opacity: 0, duration: 0.15 }, 0);

      var trigger;
      if (desktop) {
        trigger = window.ScrollTrigger.create({
          trigger: root,
          pin: pin,
          start: "top top",
          end: "+=110%",
          scrub: 0.8,
          animation: tl,
          invalidateOnRefresh: true
        });
      } else {
        trigger = window.ScrollTrigger.create({
          trigger: stage,
          start: "top 75%",
          once: true,
          onEnter: function () { gsap.delayedCall(0.5, function () { tl.timeScale(0.75).play(); }); }
        });
      }

      // Легке «плавання» уламків; гасне, коли звіт зібрано
      var phases = floats.map(function (_, i) { return i * 1.7; });
      var amp = desktop ? 6 : 4;
      var visible = true;
      var io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; });
      io.observe(root);
      function drift(time) {
        if (!visible) return;
        var k = amp * (1 - tl.progress());
        for (var i = 0; i < floats.length; i++) {
          var t = time * 0.9 + phases[i];
          floats[i].style.transform = "translate3d(0," + (Math.sin(t) * k).toFixed(2) + "px,0) rotate(" + (Math.cos(t * 0.8) * k * 0.25).toFixed(2) + "deg)";
        }
      }
      gsap.ticker.add(drift);

      // Нахил сцени за курсором (лише десктоп)
      var onMove = null;
      if (desktop) {
        var rotY = gsap.quickTo(scene, "rotationY", { duration: 0.9, ease: "power3.out" });
        var rotX = gsap.quickTo(scene, "rotationX", { duration: 0.9, ease: "power3.out" });
        onMove = function (e) {
          var px = e.clientX / window.innerWidth - 0.5;
          var py = e.clientY / window.innerHeight - 0.5;
          var k = 1 - tl.progress() * 0.5;
          rotY(px * 16 * k);
          rotX(-py * 12 * k);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
      }

      return function cleanup() {
        gsap.ticker.remove(drift);
        io.disconnect();
        if (onMove) window.removeEventListener("pointermove", onMove);
        if (trigger) trigger.kill();
        floats.forEach(function (f) { f.style.transform = ""; });
      };
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHero);
  else initHero();
})();

/* ================= 03-services ================= */
(function initServices() {
  var root = document.querySelector("[data-svc]");
  if (!root) return;

  var SVG = "http://www.w3.org/2000/svg";
  var tablist = root.querySelector(".svc__tabs");
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".svc__tab"));
  var maps = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
  var detail = root.querySelector("[data-svc-detail]");
  var reveals = root.querySelectorAll(".svc__reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mapMQ = window.matchMedia("(min-width: 768px)");
  var hoverMQ = window.matchMedia("(hover: hover) and (pointer: fine)");
  var isMap = false;
  var active = 0;

  /* ---------- Вузли: позиції на колі, промені, стан ---------- */
  var sets = maps.map(function (map) {
    var stations = Array.prototype.slice.call(map.querySelectorAll(".svc__station"));
    var spokes = map.querySelector(".svc__spokes");
    var n = stations.length;
    stations.forEach(function (st, i) {
      // перший вузол угорі, далі за годинниковою стрілкою; координати в одиницях viewBox 100×70
      var a = (-90 + i * 360 / n) * Math.PI / 180;
      var x = 50 + 34 * Math.cos(a);
      var y = 35 + 24 * Math.sin(a);
      st.style.setProperty("--px", x.toFixed(2));
      st.style.setProperty("--py", (y / 70 * 100).toFixed(2));
      st.style.setProperty("--i", i);

      var base = document.createElementNS(SVG, "line");
      var on = document.createElementNS(SVG, "line");
      [base, on].forEach(function (l) {
        l.setAttribute("x1", "50"); l.setAttribute("y1", "35");
        l.setAttribute("x2", x.toFixed(2)); l.setAttribute("y2", y.toFixed(2));
      });
      base.setAttribute("class", "svc__spoke");
      on.setAttribute("class", "svc__spoke svc__spoke--on");
      spokes.appendChild(base);
      spokes.appendChild(on);

      st._btn = st.querySelector(".svc__node");
      st._info = st.querySelector(".svc__info");
      st._spoke = on;
    });
    return stations;
  });

  function setOpen(st, open) {
    st.classList.toggle("is-open", open);
    st._info.classList.toggle("is-open", open);
    st._btn.setAttribute("aria-expanded", String(open));
    st._spoke.classList.toggle("is-on", open);
    // закритий вміст не читається скрінрідером і не потрапляє в пошук фокуса
    if (open) st._info.removeAttribute("inert"); else st._info.setAttribute("inert", "");
  }
  function openOnly(stations, st) {
    stations.forEach(function (s) { if (s !== st) setOpen(s, false); });
    setOpen(st, true);
  }

  sets.forEach(function (stations, si) {
    stations.forEach(function (st, i) {
      setOpen(st, si === 0 && i === 0);
      st._btn.addEventListener("click", function () {
        // на карті завжди відкритий один вузол; у списку його можна згорнути
        if (isMap) openOnly(stations, st);
        else if (st.classList.contains("is-open")) setOpen(st, false);
        else openOnly(stations, st);
      });
      var timer;
      st._btn.addEventListener("mouseenter", function () {
        if (!isMap || !hoverMQ.matches) return;
        timer = setTimeout(function () { openOnly(stations, st); }, 70);
      });
      st._btn.addEventListener("mouseleave", function () { clearTimeout(timer); });
    });
  });

  /* ---------- Режим: карта чи «лінія метро» ---------- */
  function layout() {
    isMap = mapMQ.matches;
    root.classList.toggle("is-map", isMap);
    sets.forEach(function (stations) {
      stations.forEach(function (st) {
        if (isMap) detail.appendChild(st._info);
        else st.appendChild(st._info);
      });
    });
    // на карті панель ніколи не порожня
    var current = sets[active];
    if (isMap && !current.some(function (s) { return s.classList.contains("is-open"); })) openOnly(current, current[0]);
  }
  layout();
  if (mapMQ.addEventListener) mapMQ.addEventListener("change", layout);

  /* ---------- Перемикач ФОП / ТОВ ---------- */
  // без JS видно обидва списки; з JS — лише активний
  maps.forEach(function (m, i) { m.hidden = i !== active; });

  function select(index, focus) {
    if (index === active) return;
    var prev = maps[active];
    var next = maps[index];
    tabs.forEach(function (t, i) {
      var on = i === index;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    tablist.setAttribute("data-active", String(index));
    if (focus) tabs[index].focus();

    sets[active].forEach(function (s) { setOpen(s, false); });
    openOnly(sets[index], sets[index][0]);
    prev.classList.remove("is-shown");
    prev.hidden = true;
    next.hidden = false;
    // перезапуск появи вузлів
    next.classList.remove("is-shown");
    void next.offsetWidth;
    next.classList.add("is-shown");
    active = index;
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(i, false); });
    tab.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowRight" || k === "ArrowLeft") {
        e.preventDefault();
        select((i + (k === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length, true);
      } else if (k === "Home" || k === "End") {
        e.preventDefault();
        select(k === "Home" ? 0 : tabs.length - 1, true);
      }
    });
  });

  /* ---------- Поява при скролі ---------- */
  function show() {
    maps[active].classList.add("is-shown");
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-shown"); });
  }
  if (reduce || !("IntersectionObserver" in window)) { show(); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) { show(); io.disconnect(); }
  }, { rootMargin: "0px 0px -15% 0px" });
  io.observe(root);
})();

/* ================= 04-about ================= */
(function initAbout() {
  var root = document.querySelector("[data-abt]");
  if (!root) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = root.querySelectorAll(".abt__reveal");
  var timeline = root.querySelector("[data-abt-timeline]");
  var progress = root.querySelector(".abt__progress");
  var steps = Array.prototype.slice.call(root.querySelectorAll(".abt__step"));

  /* ---------- Поява ---------- */
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-shown"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-shown"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* ---------- Липка колонка з фото ----------
     Якщо фото, імʼя і цитата не влазять у висоту екрана, колонка спершу прокручується
     разом зі сторінкою і «прилипає», лише коли видно її низ: так нічого не обрізається. */
  var person = root.querySelector(".abt__person");
  var deskMQ = window.matchMedia("(min-width: 1024px)");
  function fitPerson() {
    person.style.top = "";
    if (!deskMQ.matches) return;
    var normalTop = parseFloat(getComputedStyle(person).top) || 0;
    var room = window.innerHeight - person.offsetHeight - 24;
    if (room < normalTop) person.style.top = room + "px";
  }
  fitPerson();
  window.addEventListener("resize", fitPerson, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitPerson);

  /* ---------- Дашборд: картки оживають, коли панель видно ---------- */
  var dash = root.querySelector("[data-abt-dash]");
  if (dash && !reduce && "IntersectionObserver" in window) {
    var counters = Array.prototype.slice.call(dash.querySelectorAll("[data-count]"));
    var fmt = function (n) { return Math.round(n).toLocaleString("uk-UA"); };
    dash.classList.add("is-armed");
    counters.forEach(function (el) { el.textContent = "0"; });
    var dio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      dio.disconnect();
      dash.classList.add("is-run");
      var start = performance.now();
      var dur = 1400;
      (function tick(now) {
        var t = Math.min(1, (now - start) / dur);
        var k = 1 - Math.pow(1 - t, 3);   // плавне сповільнення в кінці
        counters.forEach(function (el) { el.textContent = fmt(+el.getAttribute("data-count") * k); });
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }, { threshold: 0.35 });
    dio.observe(dash);
  }

  /* ---------- Лінія таймлайну: доходить до точки на 60% висоти екрана ---------- */
  if (reduce) {
    steps.forEach(function (s) { s.classList.add("is-lit"); });
    return;
  }
  var ticking = false;
  function update() {
    ticking = false;
    var box = timeline.getBoundingClientRect();
    var mark = window.innerHeight * 0.6;
    var p = Math.min(1, Math.max(0, (mark - box.top) / box.height));
    progress.style.transform = "scaleY(" + p.toFixed(4) + ")";
    steps.forEach(function (s) {
      var dot = s.querySelector(".abt__dot").getBoundingClientRect();
      s.classList.toggle("is-lit", dot.top + dot.height / 2 <= mark);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();

/* ================= 05-process ================= */
(function initProcess() {
  var root = document.querySelector("[data-prc]");
  if (!root) return;
  var list = root.querySelector("[data-prc-steps]");
  var steps = Array.prototype.slice.call(list.children);
  var current = root.querySelector("[data-prc-current]");
  var prev = root.querySelector("[data-prc-prev]");
  var next = root.querySelector("[data-prc-next]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Запуск анімації в кадрі ---------- */
  if (reduce || !("IntersectionObserver" in window)) {
    root.classList.add("is-run");
  } else {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { root.classList.add("is-run"); io.disconnect(); }
    }, { rootMargin: "0px 0px -25% 0px" });
    io.observe(list);
  }

  /* ---------- Гортання карток (мобільний і планшет) ---------- */
  function index() {
    var left = list.scrollLeft;
    var base = steps[0].offsetLeft;
    var best = 0;
    steps.forEach(function (s, i) {
      if (Math.abs(s.offsetLeft - base - left) < Math.abs(steps[best].offsetLeft - base - left)) best = i;
    });
    // біля правого краю показуємо останній крок
    if (left + list.clientWidth >= list.scrollWidth - 4) best = steps.length - 1;
    return best;
  }
  var ticking = false;
  function update() {
    ticking = false;
    var i = index();
    current.textContent = String(i + 1);
    prev.disabled = list.scrollLeft <= 4;
    next.disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
  }
  list.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  function go(dir) {
    var i = Math.max(0, Math.min(steps.length - 1, index() + dir));
    list.scrollTo({ left: steps[i].offsetLeft - steps[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }
  prev.addEventListener("click", function () { go(-1); });
  next.addEventListener("click", function () { go(1); });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

/* ================= 06-faq ================= */
(function initFaq() {
  var root = document.querySelector("[data-faq]");
  if (!root) return;
  var items = Array.prototype.slice.call(root.querySelectorAll(".faq__item"));
  var reveals = root.querySelectorAll(".faq__reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setItem(item, open) {
    item.classList.toggle("is-open", open);
    item.querySelector(".faq__trigger").setAttribute("aria-expanded", String(open));
    var a = item.querySelector(".faq__a");
    if (open) a.removeAttribute("inert"); else a.setAttribute("inert", "");
  }
  items.forEach(function (item, i) {
    setItem(item, i === 0);   // перше питання відкрите
    item.querySelector(".faq__trigger").addEventListener("click", function () {
      setItem(item, !item.classList.contains("is-open"));
    });
  });

  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-shown"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-shown"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
})();

/* ================= 07-contact ================= */
(function initContact() {
  // Контакти заповнюються в одному місці: js/config.js
  var CONTACTS = window.HFContacts.data;

  var root = document.querySelector("[data-cta]");
  if (!root) return;
  var form = root.querySelector("[data-cta-form]");
  var steps = Array.prototype.slice.call(root.querySelectorAll(".cta__step"));
  var segs = root.querySelectorAll(".cta__seg");
  var counter = root.querySelector("[data-cta-counter]");
  var back = root.querySelector("[data-cta-back]");
  var next = root.querySelector("[data-cta-next]");
  var actions = root.querySelector("[data-cta-actions]");
  var result = root.querySelector("[data-cta-result]");
  var picksEl = root.querySelector("[data-cta-picks]");
  var msgEl = root.querySelector("[data-cta-msg]");
  var statusEl = root.querySelector("[data-cta-status]");
  var closeOption = root.querySelector('[data-only="fop"]');
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Контакти ---------- */
  window.HFContacts.fill(root);

  /* ---------- Підбір ---------- */
  var order = ["form", "staff", "vat", "goals"];
  var current = 0;

  function val(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }
  function goals() {
    return Array.prototype.map.call(form.querySelectorAll('input[name="goals"]:checked'), function (i) { return i.value; });
  }
  // Для «ще не зареєстрований» питання про працівників і ПДВ пропускаємо
  function activeSteps() {
    return val("form") === "new" ? ["form", "goals"] : order;
  }
  function stepEl(name) { return steps.filter(function (s) { return s.getAttribute("data-step") === name; })[0]; }

  function canGo() {
    var name = activeSteps()[current];
    return name === "goals" ? goals().length > 0 : !!val(name);
  }
  function refreshNext() {
    next.disabled = !canGo();
    var list = activeSteps();
    var last = current === list.length - 1;
    next.firstChild.nodeValue = last ? "Показати результат " : "Далі ";
    // для «ще не зареєстрований» кроків лише два: зайві сегменти ховаємо
    segs.forEach(function (s, i) { s.hidden = i >= list.length; });
    counter.textContent = "Крок " + (current + 1) + " / " + list.length;
  }
  function paintProgress(doneCount) {
    segs.forEach(function (s, i) { s.classList.toggle("is-done", i < doneCount); });
  }

  function show(index, dir) {
    var list = activeSteps();
    steps.forEach(function (s) { s.hidden = true; s.classList.remove("is-entering", "is-entering-back"); });
    var el = stepEl(list[index]);
    el.hidden = false;
    if (!reduce) el.classList.add(dir < 0 ? "is-entering-back" : "is-entering");
    current = index;
    paintProgress(index);
    back.hidden = index === 0;
    closeOption.hidden = val("form") !== "fop";
    if (closeOption.hidden) closeOption.querySelector("input").checked = false;
    refreshNext();
  }

  function goNext() {
    if (!canGo()) return;
    if (current < activeSteps().length - 1) show(current + 1, 1);
    else showResult();
  }

  form.addEventListener("change", function (e) {
    refreshNext();
    // одиночний вибір мишею чи пальцем — одразу далі; з клавіатури — кнопкою «Далі»
    if (e.target.type === "radio" && lastPointer && Date.now() - lastPointer < 600) {
      setTimeout(goNext, reduce ? 0 : 220);
    }
  });
  var lastPointer = 0;
  form.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".cta__option")) lastPointer = Date.now();
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); goNext(); });
  back.addEventListener("click", function () { if (current > 0) show(current - 1, -1); });

  /* ---------- Результат ---------- */
  function recommend() {
    var f = val("form"), staff = val("staff"), vat = val("vat"), g = goals();
    var has = function (k) { return g.indexOf(k) !== -1; };
    var picks = [];
    if (f === "new") {
      picks.push({ name: "Відкриття ФОП або ТОВ", note: "Підбір КВЕДів і системи оподаткування, онлайн-реєстрація" });
      if (has("docs")) picks.push({ name: "Шаблони договорів і первинних документів", note: "Щоб з першого дня все було оформлено правильно" });
      if (has("bank")) picks.push({ name: "Фінансовий моніторинг у банку", note: "Супровід будь-якої складності" });
      if (has("numbers") || has("reports")) picks.push({ name: "Щомісячний супровід після реєстрації", note: "Звітність, податки й контроль ліміту доходу" });
      return picks;
    }
    var onlyClose = f === "fop" && g.length === 1 && has("close");
    if (!onlyClose) {
      picks.push(f === "fop"
        ? { name: "Щомісячний бухгалтерський супровід", note: has("docs") ? "Звітність, податки, первинні документи й договори" : "Звітність, податки, виписка й контроль ліміту доходу" }
        : { name: "Щомісячний повний супровід", note: has("docs") ? "Первинні документи, клієнт-банк, проведення в програмі" : "Облік на вашій системі оподаткування" });
    }
    if (f === "tov" && has("reports")) picks.push({ name: "Звітність", note: "Податкова, статистика, ПФУ" });
    if (vat === "yes") picks.push({ name: "ПДВ", note: "Реєстрація й розблокування податкових накладних, звіти з ПДВ" });
    if (staff === "yes") picks.push({ name: "Кадровий облік", note: "Договори, зарплата, табель, лікарняні, звіти" });
    if (has("bank")) picks.push({ name: "Фінансовий моніторинг у банку", note: "Супровід будь-якої складності" });
    if (has("numbers")) picks.push(f === "fop"
      ? { name: "Фінансовий супровід", note: "Автоматизація обліку, структура й бізнес-процеси" }
      : { name: "Управлінський облік для власника", note: "P&L, Cashflow, Balance, аудит бізнес-процесів" });
    if (has("close")) picks.push({ name: "Закриття ФОП", note: "Супровід закриття" });
    return picks;
  }

  function buildMessage(picks) {
    var f = val("form"), staff = val("staff"), vat = val("vat");
    var who = f === "fop" ? "Я ФОП" : f === "tov" ? "У мене ТОВ" : "Хочу відкрити бізнес";
    var parts = [who];
    if (f !== "new") {
      parts.push(staff === "yes" ? "маю працівників" : "без працівників");
      parts.push(vat === "yes" ? "платник ПДВ" : vat === "no" ? "без ПДВ" : "не знаю, чи потрібен ПДВ");
    }
    var names = picks.map(function (p) { return p.name.charAt(0).toLowerCase() + p.name.slice(1); });
    return "Добрий день! " + parts.join(", ") + ". Цікавить: " + names.join(", ").replace("пДВ", "ПДВ").replace("фОП", "ФОП").replace("тОВ", "ТОВ") +
      ". Підкажіть, будь ласка, формат співпраці та вартість.";
  }

  function setMessengers(text) {
    root.querySelectorAll("[data-messenger]").forEach(function (a) {
      var key = a.getAttribute("data-messenger");
      var v = CONTACTS[key];
      if (!v) {
        a.setAttribute("aria-disabled", "true");
        a.setAttribute("href", "#contact");
        a.title = "Контакт ще не додано";
        return;
      }
      a.removeAttribute("aria-disabled");
      a.removeAttribute("title");
      a.href = window.HFContacts.message(key, v, text);
    });
  }

  function showResult() {
    var picks = recommend();
    picksEl.innerHTML = "";
    picks.forEach(function (p, i) {
      var li = document.createElement("li");
      li.className = "cta__pick";
      li.style.setProperty("--i", i);
      li.innerHTML = '<span class="cta__pick-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>' +
        '<span class="cta__pick-name"></span><span class="cta__pick-note"></span>';
      li.querySelector(".cta__pick-name").textContent = p.name;
      li.querySelector(".cta__pick-note").textContent = p.note;
      picksEl.appendChild(li);
    });
    var text = buildMessage(picks);
    msgEl.value = text;
    setMessengers(text);
    statusEl.textContent = "";
    steps.forEach(function (s) { s.hidden = true; });
    actions.hidden = true;
    result.hidden = false;
    paintProgress(4);
    counter.textContent = "Готово";
    result.querySelector(".cta__result-title").focus({ preventScroll: true });
  }

  /* ---------- Копіювання і месенджери ---------- */
  function copyText() {
    var text = msgEl.value;
    function fallback() {
      msgEl.focus();
      msgEl.select();
      statusEl.textContent = "Текст виділено. Скопіюйте його (Ctrl+C або «Копіювати»).";
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        statusEl.textContent = "Скопійовано. Вставте текст у чат.";
        return true;
      }, function () { fallback(); return false; });
    }
    fallback();
    return Promise.resolve(false);
  }
  root.querySelector("[data-cta-copy]").addEventListener("click", copyText);
  root.querySelectorAll("[data-messenger]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (a.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        statusEl.textContent = "Контакти ще не додано. Скопіюйте текст і надішліть його зручним способом.";
        return;
      }
      // текст копіюємо завжди: Instagram не вміє підставляти його сам, а в Telegram це запасний варіант
      copyText();
    });
  });

  root.querySelector("[data-cta-restart]").addEventListener("click", function () {
    form.reset();
    result.hidden = true;
    actions.hidden = false;
    show(0, -1);
    stepEl("form").querySelector("input").focus({ preventScroll: true });
  });

  show(0, 1);
})();

/* ================= 08-footer ================= */
(function initFooter() {
  var root = document.querySelector("[data-ftr]");
  if (!root) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Контакти (дані в js/config.js) ---------- */
  window.HFContacts.fill(root);

  /* ---------- Рік ---------- */
  root.querySelector("[data-ftr-year]").textContent = new Date().getFullYear();

  /* ---------- Великий напис: ділимо на літери ---------- */
  var word = root.querySelector("[data-ftr-word]");
  var text = word.textContent;
  word.textContent = "";
  Array.prototype.forEach.call(text, function (ch, i) {
    if (ch === " ") {
      var sp = document.createElement("span");
      sp.className = "ftr__space";
      word.appendChild(sp);
      return;
    }
    var box = document.createElement("span");
    var inner = document.createElement("span");
    box.className = "ftr__char";
    inner.textContent = ch;
    inner.style.setProperty("--i", i);
    box.appendChild(inner);
    word.appendChild(box);
  });
  var dot = document.createElement("span");
  dot.className = "ftr__dot";
  word.appendChild(dot);

  /* ---------- Вгору ---------- */
  root.querySelector("[data-ftr-up]").addEventListener("click", function (e) {
    var target = document.getElementById("top");
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });

  /* ---------- Поява ---------- */
  var mark = root.querySelector(".ftr__mark");
  var reveals = Array.prototype.slice.call(root.querySelectorAll(".ftr__reveal")).concat(mark);
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-shown"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-shown"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  reveals.forEach(function (el) { io.observe(el); });
})();
