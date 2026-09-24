(function () {
  "use strict";

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var body = document.body;
  var isDash = body.classList.contains("dshb-body");

  function createLogoSVG(id) {
    return (
      '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true" id="' +
      id +
      '">' +
      '<circle cx="17" cy="17" r="9" stroke="currentColor" stroke-width="2.4" fill="none"/>' +
      '<circle cx="17" cy="17" r="3.4" fill="currentColor"/>' +
      '<path d="M8.5 4.5 L4.5 2.5 L6.5 9 L3 8.5 L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M25.5 29.5 L29.5 31.5 L27.5 25 L31 25.5 L26 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
    );
  }

  function brandHTML(nav) {
    return (
      '<a href="index.html" class="nav-logo" aria-label="PULSE — back to home">' +
      createLogoSVG("navLogo") +
      '<span class="brand-text">PULSE</span></a>'
    );
  }

  function toggleHTML(klass, id, label) {
    return (
      '<button class="pill-toggle ' +
      klass +
      '" id="' +
      id +
      '" type="button" aria-label="' +
      label +
      '"><i class="ph-bold ph-' +
      (klass.indexOf("theme") > -1 ? "moon-stars" : "swap") +
      '"></i><span></span></button>'
    );
  }

  var navLinks = function () {
    var active = body.getAttribute("data-page") || "";
    var items = [
      { label: "Home", href: "index.html", dropdown: true },
      { label: "About", href: "about.html" },
      { label: "Games", href: "games.html" },
      { label: "Pricing", href: "pricing.html" },
      { label: "Blog", href: "blog.html" },
      { label: "Contact", href: "contact.html" },
      { label: "Dashboard", href: "admin-dashboard.html", dropdown: true }
    ];
    return items
      .map(function (it) {
        var isActive =
          active === it.href ||
          (it.href === "index.html" &&
            (active === "home" || active === "index.html" || active === "home-2.html")) ||
          (it.href === "admin-dashboard.html" &&
            (active === "admin-dashboard.html" || active === "user-dashboard.html"));
        if (it.dropdown) {
          var child =
            it.label === "Home"
              ? '<a href="index.html" class="' +
                (active === "index.html" || active === "home" ? "active" : "") +
                '">Home 1</a><a href="home-2.html" class="' +
                (active === "home-2.html" ? "active" : "") +
                '">Home 2</a>'
              : '<a href="admin-dashboard.html" class="' +
                (active === "admin-dashboard.html" ? "active" : "") +
                '">Admin Dashboard</a><a href="user-dashboard.html" class="' +
                (active === "user-dashboard.html" ? "active" : "") +
                '">User Dashboard</a>';
          return (
            '<div class="dropdown' +
            (isActive ? " active" : "") +
            '"><a href="' +
            it.href +
            '" class="nav-link dropdown-trigger' +
            (isActive ? " active" : "") +
            '" aria-haspopup="true" aria-expanded="false">' +
            it.label +
            ' <i class="ph-bold ph-caret-down" aria-hidden="true"></i></a><div class="dropdown-menu">' +
            child +
            "</div></div>"
          );
        }
        return (
          '<a href="' +
          it.href +
          '" class="nav-link' +
          (isActive ? " active" : "") +
          '">' +
          it.label +
          "</a>"
        );
      })
      .join("");
  };

  function buildNavbar() {
    if ($(".navbar")) return;
    var el = document.createElement("header");
    el.className = "navbar";
    el.innerHTML =
      '<nav class="nav-inner" aria-label="Main navigation">' +
      brandHTML() +
      '<div class="nav-links" id="navLinks"></div>' +
      '<div class="nav-tools">' +
      toggleHTML("theme-toggle pill-nav", "themeToggleNav", "Toggle color theme") +
      toggleHTML("rtl-toggle pill-nav", "rtlToggleNav", "Toggle writing direction") +
      '<a href="login.html" class="btn btn-cyan nav-cta nav-login"><i class="ph-bold ph-sign-in" aria-hidden="true"></i><span>Login</span></a>' +
      '<button class="hamburger" id="hamburger" type="button" aria-label="Open menu" aria-expanded="false"><i class="ph-bold ph-list" aria-hidden="true"></i></button>' +
      "</div></nav>";
    document.body.appendChild(el);
    $("#navLinks").innerHTML = navLinks();
    wireDropdowns();
    wireHamburger();
    wireScroll();
  }

  function buildMobileMenu() {
    if ($("#mobileMenu")) return;
    var el = document.createElement("div");
    el.className = "mobile-menu";
    el.id = "mobileMenu";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    var base = navLinks();
    el.innerHTML =
      '<button class="m-close" type="button" aria-label="Close menu"><i class="ph-bold ph-x" aria-hidden="true"></i></button>' +
      base +
      '<a href="login.html" class="btn btn-cyan m-login"><i class="ph-bold ph-sign-in" aria-hidden="true"></i><span>Login</span></a>' +
      '<div class="m-tools">' +
      toggleHTML("theme-toggle m-toggle", "themeToggleM", "Toggle color theme") +
      toggleHTML("rtl-toggle m-toggle", "rtlToggleM", "Toggle writing direction") +
      "</div>";
    document.body.appendChild(el);
    wireHamburger();
    wireDropdowns();
  }

  function wireScroll() {
    var nav = $(".navbar");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 50) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function wireDropdowns() {
    $$(".dropdown-trigger").forEach(function (trig) {
      if (trig.getAttribute("data-dropdown-wired") === "1") return;
      trig.setAttribute("data-dropdown-wired", "1");
      trig.addEventListener("click", function (e) {
        e.preventDefault();
        var dd = trig.closest(".dropdown");
        var open = dd.classList.contains("open");
        $$(".dropdown").forEach(function (d) {
          d.classList.remove("open");
        });
        if (!open) {
          dd.classList.add("open");
          trig.setAttribute("aria-expanded", "true");
        } else {
          trig.setAttribute("aria-expanded", "false");
        }
      });
      trig.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          trig.closest(".dropdown").classList.remove("open");
          trig.setAttribute("aria-expanded", "false");
        }
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".dropdown")) {
        $$(".dropdown").forEach(function (d) {
          d.classList.remove("open");
        });
      }
    });
  }

  function wireHamburger() {
    var burger = $("#hamburger");
    var menu = $("#mobileMenu");
    if (!burger || !menu) return;
    var items = $$("#mobileMenu a, #mobileMenu .m-toggle");
    burger.addEventListener("click", function () {
      var opening = !menu.classList.contains("open");
      menu.classList.toggle("open", opening);
      burger.setAttribute("aria-expanded", opening ? "true" : "false");
      body.style.overflow = opening ? "hidden" : "";
      items.forEach(function (a, i) {
        a.style.transitionDelay = opening ? 50 * i + "ms" : "0ms";
      });
    });
    var close = $(".m-close", menu);
    if (close) {
      close.addEventListener("click", function () {
        menu.classList.remove("open");
        body.style.overflow = "";
        burger.setAttribute("aria-expanded", "false");
      });
    }
    items.forEach(function (a) {
      if (a.tagName === "A" && !a.classList.contains("dropdown-trigger")) {
        a.addEventListener("click", function () {
          menu.classList.remove("open");
          body.style.overflow = "";
        });
      }
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("pulse-theme", theme);
    } catch (e) {}
    var moon = "ph-bold ph-moon-stars";
    var sun = "ph-bold ph-sun";
    $$(".theme-toggle").forEach(function (b) {
      var ic = $("i", b);
      if (ic) {
        ic.className = theme === "dark" ? moon : sun;
      }
    });
  }

  function applyRtl(dir) {
    document.documentElement.setAttribute("dir", dir);
    try {
      localStorage.setItem("pulse-dir", dir);
    } catch (e) {}
    var label = dir === "rtl" ? "RTL" : "LTR";
    $$(".rtl-toggle").forEach(function (b) {
      var s = $("span", b);
      if (s) s.textContent = label;
    });
  }

  function wireCommonToggles() {
    $$(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(cur);
      });
    });
    $$(".rtl-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
        applyRtl(cur);
      });
    });
  }

  function initPrefs() {
    var theme = "dark";
    var dir = "ltr";
    try {
      theme = localStorage.getItem("pulse-theme") || "dark";
      dir = localStorage.getItem("pulse-dir") || "ltr";
    } catch (e) {}
    applyTheme(theme);
    applyRtl(dir);
  }

  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (it) {
        it.classList.add("in-view");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (it) {
      io.observe(it);
    });
  }

  function initCounters() {
    var nums = $$("[data-count]");
    if (!nums.length) return;
    function animate(n) {
      var target = parseFloat(n.getAttribute("data-count"));
      var dec = n.getAttribute("data-decimals") ? parseInt(n.getAttribute("data-decimals"), 10) : 0;
      var dur = 1100;
      var start = null;
      var suffix = n.getAttribute("data-suffix") || "";
      var prefix = n.getAttribute("data-prefix") || "";
      function fmt(v) {
        return v.toLocaleString("en-US", {
          minimumFractionDigits: dec,
          maximumFractionDigits: dec
        });
      }
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        n.textContent = prefix + fmt(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else n.textContent = prefix + fmt(target) + suffix;
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            animate(en.target);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach(function (n) {
      io.observe(n);
    });
  }

  function initAccordions() {
    $$(".accordion-item").forEach(function (item) {
      var head = $(".accordion-head", item);
      if (!head) return;
      var panel = $(".accordion-body", item);
      head.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        $$(".accordion-item.open").forEach(function (o) {
          o.classList.remove("open");
          var p = $(".accordion-body", o);
          if (p) p.style.maxHeight = "0px";
        });
        if (!isOpen) {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.setAttribute("aria-hidden", "false");
        }
      });
    });
  }

  function initFilters() {
    var pills = $$(".filter-pill");
    if (!pills.length) return;
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) {
          p.classList.remove("active");
        });
        pill.classList.add("active");
        var cat = pill.getAttribute("data-filter");
        $$("[data-cat]").forEach(function (card) {
          var show = cat === "All" || card.getAttribute("data-cat") === cat;
          card.style.display = show ? "" : "none";
          if (show) card.classList.remove("in-view");
        });
      });
    });
  }

  function initPasswordToggles() {
    $$(".password-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = btn.closest(".password-wrap").querySelector("input");
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        var ic = $("i", btn);
        if (ic) ic.className = show ? "ph-bold ph-eye" : "ph-bold ph-eye-slash";
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });
  }

  function initForms() {
    $$("form[data-validate]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;
        var firstInvalid = null;
        $$("[data-validate] [required], [data-validate] [data-rule]", form).forEach(function (el) {
          var field = el.closest(".field");
          var val = el.value.trim();
          var ok = true;
          var msg = "";
          if (el.hasAttribute("required") && !val) {
            ok = false;
            msg = el.getAttribute("data-error") || "This field is required.";
          } else if (val && el.getAttribute("type") === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            ok = false;
            msg = "Enter a valid email address.";
          } else if (val && el.hasAttribute("minlength") && val.length < parseInt(el.getAttribute("minlength"), 10)) {
            ok = false;
            msg = "Must be at least " + el.getAttribute("minlength") + " characters.";
          } else if (el.getAttribute("data-rule") === "match") {
            var target = document.getElementById(el.getAttribute("data-match"));
            if (target && val !== target.value) {
              ok = false;
              msg = "Passwords do not match.";
            }
          }
          if (!ok) {
            valid = false;
            if (field) {
              field.classList.add("invalid");
              var er = $(".field-error", field);
              if (er) er.textContent = msg;
            }
            if (!firstInvalid) firstInvalid = el;
          } else if (field) {
            field.classList.remove("invalid");
          }
        });
        if (valid) {
          var notify = form.getAttribute("data-success") || "Transmission sent. We'll be in touch shortly.";
          var wrap = document.createElement("div");
          wrap.className = "badge badge-success form-success";
          wrap.innerHTML = '<i class="ph-bold ph-check-circle" aria-hidden="true"></i> ' + notify;
          form.innerHTML = "";
          form.appendChild(wrap);
        } else if (firstInvalid) {
          firstInvalid.focus();
        }
      });
      $$("input, select, textarea", form).forEach(function (el) {
        el.addEventListener("input", function () {
          var field = el.closest(".field");
          if (field) field.classList.remove("invalid");
        });
      });
    });
  }

  function initCountdown() {
    var container = $("#countdown");
    if (!container) return;
    var cells = {
      d: $(".cd-days .cd-num", container),
      h: $(".cd-hours .cd-num", container),
      m: $(".cd-mins .cd-num", container),
      s: $(".cd-secs .cd-num", container)
    };
    var target = new Date(container.getAttribute("data-target") || "2026-12-25T00:00:00");
    function pad(n) {
      return String(n).padStart(2, "0");
    }
    function tick() {
      var diff = Math.max(0, target.getTime() - Date.now());
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      if (cells.d) cells.d.textContent = pad(days);
      if (cells.h) cells.h.textContent = pad(hours);
      if (cells.m) cells.m.textContent = pad(mins);
      if (cells.s) cells.s.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }

  function initMobileNavbar() {
    if (isDash) return;
    if (body.getAttribute("data-nofooter") === "true") return;
    buildNavbar();
    buildMobileMenu();
  }

  function initFooter() {
    if (isDash || $(".footer")) return;
    var hasNoFooter = body.getAttribute("data-nofooter") === "true";
    if (hasNoFooter) return;
    var el = document.createElement("footer");
    el.className = "footer";
    el.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      '<div>' +
      brandHTML() +
      '<p class="footer-desc">High-octane laser tag, VR and arcade battlegrounds engineered for squad supremacy.</p>' +
      "</div>" +
      '<div><h4>Arena Links</h4>' +
      '<ul><li><a href="games.html">Games</a></li><li><a href="pricing.html">Pricing</a></li><li><a href="about.html">About</a></li><li><a href="blog.html">Blog</a></li></ul></div>' +
      '<div><h4>Contact</h4>' +
      "<ul><li><a href=\"contact.html\"><i class=\"ph-bold ph-map-pin\" aria-hidden=\"true\"></i> 88 Neon Circuit, Sector 7</a></li>" +
      '<li><a href="tel:+15550100100"><i class="ph-bold ph-phone" aria-hidden="true"></i> +1 555 010 0100</a></li>' +
      '<li><a href="mailto:ops@pulsearena.example"><i class="ph-bold ph-envelope-simple" aria-hidden="true"></i> ops@pulsearena.example</a></li></ul></div>' +
      '<div><h4>Follow the Arena</h4><div class="footer-social">' +
      '<a href="#" aria-label="Meta" class="fab-social meta"><i class="ph-bold ph-meta-logo" aria-hidden="true"></i></a>' +
      '<a href="#" aria-label="Instagram" class="fab-social instagram"><i class="ph-bold ph-instagram-logo" aria-hidden="true"></i></a>' +
      '<a href="#" aria-label="X" class="fab-social x"><i class="ph-bold ph-x-logo" aria-hidden="true"></i></a>' +
      '<a href="#" aria-label="Google" class="fab-social google"><i class="ph-bold ph-google-logo" aria-hidden="true"></i></a>' +
      '<a href="#" aria-label="Apple" class="fab-social apple"><i class="ph-bold ph-apple-logo" aria-hidden="true"></i></a>' +
      "</div></div></div>" +
      '<div class="container footer-bottom"><span>&copy; 2026 PULSE Arena Group. All rights reserved.</span>' +
      '<div class="legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookie Policy</a></div></div>' +
      "</div>";
    document.body.appendChild(el);
  }

  function initAuthSwitch() {
    var triggers = $$("[data-auth-switch]");
    var modes = $$("[data-auth-mode]");
    if (!triggers.length) return;
    triggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var target = btn.getAttribute("data-auth-switch");
        modes.forEach(function (m) {
          var show = m.getAttribute("data-auth-mode") === target;
          m.classList.toggle("hidden", !show);
        });
        var h1 = $("#authTitle");
        if (h1) {
          h1.textContent =
            target === "login" ? "Access Terminal" : "Register Command";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPrefs();
    initMobileNavbar();
    applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
    applyRtl(document.documentElement.getAttribute("dir") || "ltr");
    wireCommonToggles();
    initFooter();
    initReveal();
    initCounters();
    initAccordions();
    initFilters();
    initPasswordToggles();
    initForms();
    initCountdown();
    initAuthSwitch();
  });
})();