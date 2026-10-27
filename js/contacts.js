/* Спільні функції для контактів: посилання для кожного каналу і заповнення [data-contact].
   Дані беруться з js/config.js (window.HF_CONTACTS). */
(function () {
  var data = window.HF_CONTACTS || {};
  var digits = function (s) { return String(s).replace(/\D/g, ""); };
  var handle = function (v) { return String(v).replace(/^@/, ""); };
  var builders = {
    phone: function (v) { return "tel:+" + digits(v); },
    telegram: function (v) { return "https://t.me/" + handle(v); },
    instagram: function (v) { return "https://instagram.com/" + handle(v); }
  };

  function href(key, v) { return builders[key] ? builders[key](v) : ""; }

  // Посилання «написати повідомлення»: Telegram підставляє текст сам, Instagram відкриває діалог
  function message(key, v, text) {
    if (key === "telegram") return "https://t.me/" + handle(v) + "?text=" + encodeURIComponent(text);
    if (key === "instagram") return "https://ig.me/m/" + handle(v);
    return href(key, v);
  }

  // Замінює плейсхолдери в елементах [data-contact] на справжні контакти
  function fill(root) {
    root.querySelectorAll("[data-contact]").forEach(function (el) {
      var key = el.getAttribute("data-contact");
      var v = data[key];
      if (!v) return;
      el.textContent = "";
      var a = document.createElement("a");
      a.href = href(key, v);
      a.textContent = key === "phone" ? v : "@" + handle(v);
      if (/^https/.test(a.href)) { a.target = "_blank"; a.rel = "noopener"; }
      el.appendChild(a);
    });
  }

  window.HFContacts = { data: data, digits: digits, href: href, message: message, fill: fill };
})();
