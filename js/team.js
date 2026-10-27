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

  // Посилання на поточну сторінку (aria-current="page") лишається активним, коли розділ не вибрано
  var pageLink = hdr.querySelector('.hdr__link[aria-current="page"]');
  function setActive(id) {
    var active = null;
    navLinks.concat(menuLinks).forEach(function (a) {
      if (a.getAttribute("aria-current") === "page") return;
      var on = a.getAttribute("href") === "#" + id;
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      if (on && a.classList.contains("hdr__link")) active = a;
    });
    moveIndicator(active || pageLink);
  }

  var sections = navLinks
    .filter(function (a) { return a.getAttribute("href").charAt(0) === "#"; })
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
    moveIndicator(hdr.querySelector('.hdr__link[aria-current="true"]') || pageLink);
  }, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      moveIndicator(hdr.querySelector('.hdr__link[aria-current="true"]') || pageLink);
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

/* ================= 09-team ================= */
(function () {
function initTeam() {
  var hero = document.querySelector("[data-tm-hero]");
  if (!hero) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Контакти (дані в js/config.js) ---------- */
  var cta = document.querySelector("#write");
  if (cta && window.HFContacts) {
    window.HFContacts.fill(cta);
    $$("[data-tm-link]", cta).forEach(function (a) {
      var key = a.getAttribute("data-tm-link");
      var v = window.HFContacts.data[key];
      if (v) a.href = window.HFContacts.href(key, v); else a.hidden = true;
    });
  }

  /* ---------- Поява блоків ---------- */
  var reveals = $$(".tm-reveal");
  var stamps = $$("[data-tm-stamp]");
  if (reduce || !hasIO) {
    reveals.forEach(function (el) { el.classList.add("is-shown"); });
    stamps.forEach(function (el) { el.classList.add("is-stamped"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-shown"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveals.forEach(function (el) { io.observe(el); });

    // печатка «ставиться», коли картка без фото зʼявляється на екрані
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        setTimeout(function () { el.classList.add("is-stamped"); }, el.closest("[data-tm-deck]") ? 1100 : 350);
        sio.unobserve(el);
      });
    }, { threshold: 0.5 });
    stamps.forEach(function (el) { sio.observe(el); });
  }

  /* ---------- Колода: роздача, нахил за мишкою, розкриття при скролі ---------- */
  var deck = hero.querySelector("[data-tm-deck]");
  if (deck) {
    if (reduce) {
      deck.classList.add("is-dealt", "is-ready");
    } else {
      requestAnimationFrame(function () {
        setTimeout(function () { deck.classList.add("is-dealt"); }, 250);
        setTimeout(function () { deck.classList.add("is-ready"); }, 1700);
      });
      var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
      hero.addEventListener("pointermove", function (e) {
        if (!fine.matches) return;
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        deck.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
        deck.style.setProperty("--rx", (y * -8).toFixed(2) + "deg");
      });
      hero.addEventListener("pointerleave", function () {
        deck.style.setProperty("--ry", "0deg");
        deck.style.setProperty("--rx", "0deg");
      });
      var ticking = false;
      var onScroll = function () {
        ticking = false;
        var h = hero.offsetHeight;
        var p = Math.min(1, Math.max(0, window.scrollY / (h * 0.8)));
        deck.style.setProperty("--p", p.toFixed(3));
      };
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
      }, { passive: true });
    }
  }

  /* ---------- Картки: перевертання ---------- */
  $$("[data-tm-card]").forEach(function (card) {
    var front = card.querySelector(".tm-card__front");
    var back = card.querySelector(".tm-card__back");
    var openBtn = front.querySelector("[data-tm-flip]");
    var backBtn = back.querySelector("[data-tm-flip]");
    var setFace = function (flipped) {
      card.classList.toggle("is-flipped", flipped);
      openBtn.setAttribute("aria-expanded", String(flipped));
      [front, back].forEach(function (face, i) {
        var hide = flipped ? i === 0 : i === 1;
        face.inert = hide;
        if (hide) face.setAttribute("aria-hidden", "true"); else face.removeAttribute("aria-hidden");
      });
      setTimeout(function () { (flipped ? backBtn : openBtn).focus({ preventScroll: true }); }, reduce ? 0 : 420);
    };
    openBtn.addEventListener("click", function () { setFace(true); });
    backBtn.addEventListener("click", function () { setFace(false); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && card.classList.contains("is-flipped")) setFace(false);
    });
  });

  /* ---------- Шлях документа: печатки за кроками ---------- */
  var stepsWrap = document.querySelector("[data-tm-steps]");
  if (stepsWrap) {
    var steps = $$(".tm-step", stepsWrap);
    var docStamps = $$(".tm-doc__stamp");
    var fill = stepsWrap.querySelector(".tm-steps__rail");
    var setStep = function (n) {
      steps.forEach(function (s, i) { s.classList.toggle("is-on", i <= n); });
      docStamps.forEach(function (s, i) { s.classList.toggle("is-on", i <= n); });
      var k = steps.length > 1 ? Math.max(0, n) / (steps.length - 1) : 1;
      fill.style.setProperty("--fill", n < 0 ? 0 : k.toFixed(3));
    };
    if (reduce || !hasIO) {
      setStep(steps.length - 1);
    } else {
      var passed = steps.map(function () { return false; });
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var i = steps.indexOf(e.target);
          // крок пройдено, коли його верх піднявся вище середини екрана
          passed[i] = e.isIntersecting || e.boundingClientRect.top < 0;
        });
        setStep(passed.lastIndexOf(true));
      }, { rootMargin: "0px 0px -50% 0px" });
      steps.forEach(function (s) { fio.observe(s); });
    }
  }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initTeam);
else initTeam();
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
