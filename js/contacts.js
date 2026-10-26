/* Спільні функції для контактів: посилання для кожного каналу і заповнення [data-contact].
   Дані беруться з js/config.js (window.HF_CONTACTS). */
(function () {
  var data = window.HF_CONTACTS || {};
  var digits = function (s) { return String(s).replace(/\D/g, ""); };
  var builders = {
    phone: function (v) { return "tel:+" + digits(v); },
    telegram: function (v) { return "https://t.me/" + v.replace(/^@/, ""); },
    viber: function (v) { return "viber://chat?number=%2B" + digits(v); },
    whatsapp: function (v) { return "https://wa.me/" + digits(v); },
    email: function (v) { return "mailto:" + v; }
  };

  function href(key, v) { return builders[key] ? builders[key](v) : ""; }

  // Замінює плейсхолдери в елементах [data-contact] на справжні контакти
  function fill(root) {
    root.querySelectorAll("[data-contact]").forEach(function (el) {
      var key = el.getAttribute("data-contact");
      var v = data[key];
      if (!v) return;
      el.textContent = "";
      if (builders[key]) {
        var a = document.createElement("a");
        a.href = href(key, v);
        a.textContent = key === "telegram" ? "@" + v.replace(/^@/, "") : v;
        if (/^https/.test(a.href)) { a.target = "_blank"; a.rel = "noopener"; }
        el.appendChild(a);
      } else {
        el.textContent = v;
      }
    });
  }

  window.HFContacts = { data: data, digits: digits, href: href, fill: fill };
})();
