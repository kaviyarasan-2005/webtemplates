(function () {
  "use strict";

  var $ = function (s, c) {
    return (c || document).querySelector(s);
  };
  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };

  var NS = "http://www.w3.org/2000/svg";
  var CYAN = "#00f0ff";
  var MAGENTA = "#ff00a0";
  var PURPLE = "#b829dd";
  var GRID = "rgba(160,168,192,0.14)";
  var MUTED = "#a0a8c0";
  var HOLE = "#050508";
  var TRACK = "rgba(255,255,255,0.08)";
  var LABEL = "#e8eaf5";
  var CENTER = "#ffffff";
  var WARN = "#ffb800";

  function isRTL() {
    return (document.documentElement.getAttribute("dir") || "ltr") === "rtl";
  }

  function readVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function refreshChartColors() {
    CYAN = readVar("--cyan", CYAN);
    MAGENTA = readVar("--magenta", MAGENTA);
    PURPLE = readVar("--purple", PURPLE);
    WARN = readVar("--neon-warning", WARN);
    GRID = readVar("--chart-grid", GRID);
    MUTED = readVar("--text-secondary", MUTED);
    HOLE = readVar("--chart-hole", HOLE);
    TRACK = readVar("--chart-track", TRACK);
    LABEL = readVar("--chart-label", LABEL);
    CENTER = readVar("--chart-center", CENTER);
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS(NS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function rootSVG(w, h) {
    var svg = svgEl("svg", {
      viewBox: "0 0 " + w + " " + h,
      preserveAspectRatio: "none",
      role: "img",
      "aria-hidden": "true"
    });
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    return svg;
  }

  function wireSidebar() {
    var sidebar = $(".dshb-sidebar");
    var main = $(".dshb-main");
    var overlay = $(".dshb-sidenav-overlay");
    var collapse = $(".dshb-collapse");
    var menuBtn = $(".menu-btn");
    var isMobile = function () {
      return window.innerWidth < 1024;
    };

    if (collapse) {
      collapse.addEventListener("click", function () {
        var collapsed = sidebar.classList.toggle("collapsed");
        if (main) main.classList.toggle("sidebar-collapsed", collapsed);
        var ic = $("i", collapse);
        if (ic) ic.className = collapsed ? "ph-bold ph-caret-line-right" : "ph-bold ph-caret-line-left";
        var label = collapsed ? "Expand sidebar" : "Collapse sidebar";
        collapse.setAttribute("aria-label", label);
        collapse.setAttribute("title", label);
      });
    }

    function openDrawer() {
      sidebar.classList.add("open");
      if (overlay) overlay.classList.add("open");
    }
    function closeDrawer() {
      sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
    }

    if (menuBtn) menuBtn.addEventListener("click", openDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);

    window.addEventListener("resize", function () {
      if (!isMobile()) closeDrawer();
    });
  }

  function drawLineChart(el, points, opts) {
    opts = opts || {};
    var w = 720;
    var h = 300;
    var padL = 46;
    var padR = 20;
    var padT = 26;
    var padB = 44;
    var max = Math.max.apply(null, points.concat([1])) * 1.15;
    var min = 0;
    var rtl = isRTL();
    var L = rtl ? padR : padL;
    var R = rtl ? padL : padR;
    var xStep = (w - L - R) / (points.length - 1);
    var coords = points.map(function (v, i) {
      var x = rtl ? w - R - i * xStep : L + i * xStep;
      var y = padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
      return [x, y];
    });
    var svg = rootSVG(w, h);

    for (var gy = 0; gy < 5; gy++) {
      var yPos = padT + (gy / 4) * (h - padT - padB);
      svg.appendChild(
        svgEl("line", { x1: L, y1: yPos, x2: w - R, y2: yPos, stroke: GRID, "stroke-width": 1 })
      );
      var lbl = Math.round(max - (gy / 4) * (max - min));
      var t = svgEl("text", { x: rtl ? w - R + 8 : L - 10, y: yPos + 4, fill: MUTED, "font-size": 11, "text-anchor": rtl ? "start" : "end", "font-family": "Inter, sans-serif" });
      t.textContent = opts.currency ? "$" + lbl : lbl;
      svg.appendChild(t);
    }

    opts.labels.forEach(function (lab, i) {
      var t = svgEl("text", { x: coords[i][0], y: h - padB + 18, fill: MUTED, "font-size": 11, "text-anchor": "middle", "font-family": "Inter, sans-serif" });
      t.textContent = lab;
      svg.appendChild(t);
    });

    var area = "";
    var line = "";
    coords.forEach(function (c, i) {
      line += (i ? " L" : "M") + c[0].toFixed(1) + " " + c[1].toFixed(1);
      area += (i ? " L" : "M") + c[0].toFixed(1) + " " + c[1].toFixed(1);
    });
    area += " L" + coords[coords.length - 1][0].toFixed(1) + " " + (h - padB) + " L" + coords[0][0].toFixed(1) + " " + (h - padB) + " Z";

    svg.appendChild(
      svgEl("path", {
        d: area,
        fill: "url(#lineArea)",
        opacity: 0.35
      })
    );
    svg.appendChild(
      svgEl("path", {
        d: line,
        fill: "none",
        stroke: CYAN,
        "stroke-width": 3,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        filter: "url(#glowLine)"
      })
    );

    coords.forEach(function (c, i) {
      var dot = svgEl("circle", { cx: c[0], cy: c[1], r: 4.5, fill: HOLE, stroke: CYAN, "stroke-width": 2 });
      var tip = svgEl("title", {});
      tip.textContent = (opts.labels[i] || "") + ": " + (opts.currency ? "$" : "") + points[i];
      dot.appendChild(tip);
      svg.appendChild(dot);
    });

    appendDefs(svg, ["lineArea", "glowLine"]);
    el.appendChild(svg);
  }

  function drawBarChart(el, labels, values, opts) {
    opts = opts || {};
    var w = 720;
    var h = 300;
    var padL = 56;
    var padR = 20;
    var padT = 24;
    var padB = 44;
    var max = Math.max.apply(null, values.concat([1])) * 1.15;
    var rtl = isRTL();
    var L = rtl ? padR : padL;
    var R = rtl ? padL : padR;
    var step = (w - L - R) / labels.length;
    var bw = Math.min(step * 0.5, 54);
    var svg = rootSVG(w, h);

    for (var gy = 0; gy < 5; gy++) {
      var yPos = padT + (gy / 4) * (h - padT - padB);
      svg.appendChild(svgEl("line", { x1: L, y1: yPos, x2: w - R, y2: yPos, stroke: GRID, "stroke-width": 1 }));
      var lbl = Math.round(max - (gy / 4) * (max - min(0)));
      var t = svgEl("text", { x: rtl ? w - R + 8 : L - 10, y: yPos + 4, fill: MUTED, "font-size": 11, "text-anchor": rtl ? "start" : "end", "font-family": "Inter, sans-serif" });
      t.textContent = opts.percent ? lbl + "%" : lbl;
      svg.appendChild(t);
    }

    function min(a) {
      return a;
    }

    values.forEach(function (v, i) {
      var bh = ((h - padT - padB) * v) / max;
      var x = rtl ? w - R - (i + 1) * step + (step - bw) / 2 : L + i * step + (step - bw) / 2;
      var y = padT + (h - padT - padB) - bh;
      var gradId = "barGrad" + i;
      appendGradient(svg, gradId, CYAN, MAGENTA);
      var rect = svgEl("rect", {
        x: x,
        y: y,
        width: bw,
        height: Math.max(bh, 2),
        rx: 5,
        fill: "url(#" + gradId + ")"
      });
      var tip = svgEl("title", {});
      tip.textContent = labels[i] + ": " + v;
      rect.appendChild(tip);
      svg.appendChild(rect);
      var lt = svgEl("text", { x: x + bw / 2, y: h - padB + 18, fill: MUTED, "font-size": 11, "text-anchor": "middle", "font-family": "Inter, sans-serif" });
      lt.textContent = labels[i];
      svg.appendChild(lt);
    });

    el.appendChild(svg);
  }

  function drawDoughnut(el, segments, centerLabel) {
    var size = 300;
    var svg = rootSVG(size, size);
    var stroke = 42;
    var r = (size - stroke) / 2 - 8;
    var cx = size / 2;
    var cy = size / 2;
    var total = segments.reduce(function (a, b) {
      return a + b.value;
    }, 0);
    var start = -Math.PI / 2;

    segments.forEach(function (seg, i) {
      var angle = (seg.value / total) * Math.PI * 2;
      var large = angle > Math.PI ? 1 : 0;
      var x1 = cx + r * Math.cos(start);
      var y1 = cy + r * Math.sin(start);
      var x2 = cx + r * Math.cos(start + angle);
      var y2 = cy + r * Math.sin(start + angle);
      var d =
        "M " + x1.toFixed(2) + " " + y1.toFixed(2) +
        " A " + r + " " + r + " 0 " + large + " 1 " + x2.toFixed(2) + " " + y2.toFixed(2);
      var path = svgEl("path", {
        d: d,
        fill: "none",
        stroke: seg.color,
        "stroke-width": stroke,
        "stroke-linecap": "butt"
      });
      var tip = svgEl("title", {});
      tip.textContent = seg.label + ": " + Math.round((seg.value / total) * 100) + "%";
      path.appendChild(tip);
      svg.appendChild(path);
      start += angle;
    });

    var inner = svgEl("circle", { cx: cx, cy: cy, r: r - stroke / 2, fill: "none" });
    svg.appendChild(inner);

    var ct = svgEl("text", { x: cx, y: cy - 4, fill: CENTER, "font-size": 30, "font-weight": 700, "text-anchor": "middle", "font-family": "Orbitron, sans-serif" });
    ct.textContent = centerLabel;
    svg.appendChild(ct);
    var cs = svgEl("text", { x: cx, y: cy + 22, fill: MUTED, "font-size": 12, "text-anchor": "middle", "font-family": "Inter, sans-serif" });
    cs.textContent = "total players";
    svg.appendChild(cs);

    el.appendChild(svg);
  }

  function drawRadar(el, labels, values) {
    var size = 340;
    var cx = size / 2;
    var cy = size / 2;
    var R = 118;
    var n = labels.length;
    var svg = rootSVG(size, size);

    function point(i, r) {
      var a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }

    for (var ring = 1; ring <= 4; ring++) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var p = point(i, (R * ring) / 4);
        pts.push(p[0].toFixed(1) + "," + p[1].toFixed(1));
      }
      svg.appendChild(svgEl("polygon", { points: pts.join(" "), fill: "none", stroke: GRID, "stroke-width": 1 }));
    }
    for (var j = 0; j < n; j++) {
      var e = point(j, R);
      svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: e[0], y2: e[1], stroke: GRID, "stroke-width": 1 }));
    }

    var dataPts = [];
    var max = Math.max.apply(null, values.concat([1]));
    values.forEach(function (v, i) {
      var p = point(i, (R * v) / max);
      dataPts.push(p[0].toFixed(1) + "," + p[1].toFixed(1));
    });
    var poly = svgEl("polygon", {
      points: dataPts.join(" "),
      fill: "rgba(255,0,160,0.18)",
      stroke: MAGENTA,
      "stroke-width": 2,
      filter: "url(#glowLine)"
    });
    svg.appendChild(poly);

    labels.forEach(function (lab, i) {
      var p = point(i, R + 26);
      var t = svgEl("text", { x: p[0], y: p[1], fill: LABEL, "font-size": 11, "text-anchor": "middle", "font-family": "Inter, sans-serif", "font-weight": 600, "letter-spacing": "0.5px" });
      t.textContent = lab;
      svg.appendChild(t);
    });

    appendDefs(svg, ["glowLine"]);
    el.appendChild(svg);
  }

  function drawHBars(el, rows, opts) {
    opts = opts || {};
    var w = 620;
    var hArray = rows.length * 52 + 20;
    var padL = 130;
    var padR = 70;
    var padT = 14;
    var rtl = isRTL();
    var L = rtl ? padR : padL;
    var R = rtl ? padL : padR;
    var trackW = w - L - R;
    var svg = rootSVG(w, hArray);

    rows.forEach(function (row, i) {
      var y = padT + i * 52;
      var t = svgEl("text", { x: rtl ? w - R + 14 : L - 14, y: y + 18, fill: LABEL, "font-size": 12.5, "text-anchor": rtl ? "start" : "end", "font-family": "Inter, sans-serif", "font-weight": 600 });
      t.textContent = row.label;
      svg.appendChild(t);
      svg.appendChild(svgEl("rect", { x: L, y: y + 6, width: trackW, height: 14, rx: 7, fill: TRACK }));
      var bw = (trackW * row.value) / 100;
      var gradId = "hbGrad" + i;
      appendGradient(svg, gradId, CYAN, opts.color || MAGENTA);
      svg.appendChild(svgEl("rect", { x: rtl ? w - R - bw : L, y: y + 6, width: bw, height: 14, rx: 7, fill: "url(#" + gradId + ")", filter: "url(#glowLine)" }));
      var pt = svgEl("text", { x: rtl ? w - R - bw - 10 : L + bw + 10, y: y + 18, fill: CYAN, "font-size": 12, "font-family": "Orbitron, sans-serif", "font-weight": 700, "text-anchor": rtl ? "end" : "start" });
      pt.textContent = opts.suffix || "";
      pt.textContent = row.display || row.value + (opts.suffix || "%");
      svg.appendChild(pt);
    });

    appendDefs(svg, ["glowLine"]);
    el.appendChild(svg);
  }

  function appendGradient(svg, id, c1, c2) {
    var defs = svgEl("defs", {});
    var grad = svgEl("linearGradient", { id: id, x1: "0", y1: "0", x2: "1", y2: "0" });
    grad.appendChild(svgEl("stop", { offset: "0%", "stop-color": c1 }));
    grad.appendChild(svgEl("stop", { offset: "100%", "stop-color": c2 }));
    defs.appendChild(grad);
    svg.insertBefore(defs, svg.firstChild);
  }

  function appendDefs(svg, ids) {
    var defs = svgEl("defs", {});
    ids.forEach(function (id) {
      if (id === "lineArea") {
        var lg = svgEl("linearGradient", { id: id, x1: "0", y1: "0", x2: "0", y2: "1" });
        lg.appendChild(svgEl("stop", { offset: "0%", "stop-color": CYAN, "stop-opacity": "1" }));
        lg.appendChild(svgEl("stop", { offset: "100%", "stop-color": CYAN, "stop-opacity": "0" }));
        defs.appendChild(lg);
      }
      if (id === "glowLine") {
        var f = svgEl("filter", { id: id, x: "-60%", y: "-60%", width: "220%", height: "220%" });
        var fe = svgEl("feGaussianBlur", { stdDeviation: "4", result: "blur" });
        f.appendChild(fe);
        var merge = svgEl("feMerge", {});
        merge.appendChild(svgEl("feMergeNode", { in: "blur" }));
        merge.appendChild(svgEl("feMergeNode", { in: "SourceGraphic" }));
        f.appendChild(merge);
        defs.appendChild(f);
      }
    });
    svg.insertBefore(defs, svg.firstChild);
  }

  function initCharts() {
    var line = $("#chRevenue");
    if (line) {
      drawLineChart(line, [4200, 5100, 4700, 6200, 7100, 6800, 8300], {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        currency: true
      });
    }
    var perfs = $("#chPerf");
    if (perfs) {
      drawLineChart(perfs, [820, 930, 880, 1010, 1120, 980, 1200, 1330, 1190, 1450], {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      });
    }
    var pop = $("#chPopularity");
    if (pop) {
      drawBarChart(
        pop,
        ["FFA", "TDM", "CTF", "KOTH", "Zombie", "VIP", "Sniper", "VR Co-op"],
        [22, 30, 18, 24, 16, 12, 20, 26],
        {}
      );
    }
    var acc = $("#chAccuracy");
    if (acc) {
      drawBarChart(acc, ["Blaster", "Rifle", "Pistol", "Grenade"], [78, 64, 71, 52], {
        percent: true
      });
    }
    var demo = $("#chDemographics");
    if (demo) {
      drawDoughnut(
        demo,
        [
          { label: "Casual", value: 42, color: CYAN },
          { label: "Competitive", value: 26, color: MAGENTA },
          { label: "Corporate", value: 18, color: PURPLE },
          { label: "VR-Only", value: 14, color: WARN }
        ],
        "2,4k"
      );
    }
    var split = $("#chTimeSplit");
    if (split) {
      drawDoughnut(
        split,
        [
          { label: "Arena", value: 38, color: CYAN },
          { label: "VR", value: 27, color: MAGENTA },
          { label: "Arcade", value: 20, color: PURPLE },
          { label: "Lounge", value: 15, color: WARN }
        ],
        "3h"
      );
    }
    var radar = $("#chRadar");
    if (radar) {
      drawRadar(radar, ["Cleanliness", "Speed", "Fun", "Safety", "Tech", "Staff"], [92, 78, 96, 88, 82, 90]);
    }
    var ach = $("#chAchievements");
    if (ach) {
      drawHBars(
        ach,
        [
          { label: "First Blood", value: 100 },
          { label: "Rampage x5", value: 82 },
          { label: "Objective Master", value: 64 },
          { label: "Clan Founder", value: 41 },
          { label: "Night Ops Survivor", value: 23 }
        ],
        {}
      );
      var fills = $$("#chAchievements .progress-fill");
      fills.forEach(function (f) {
        f.style.width = f.getAttribute("data-w") + "%";
      });
    }
  }

  function initProgressBars() {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var f = en.target;
            f.style.width = f.getAttribute("data-w") + "%";
            io.unobserve(f);
          }
        });
      },
      { threshold: 0.3 }
    );
    $$(".progress-fill[data-w]").forEach(function (f) {
      io.observe(f);
    });
  }

  function renderCharts() {
    ["chRevenue", "chPerf", "chPopularity", "chAccuracy", "chDemographics", "chTimeSplit", "chRadar", "chAchievements"].forEach(function (id) {
      var c = $("#" + id);
      if (c) c.innerHTML = "";
    });
    refreshChartColors();
    initCharts();
  }

  function watchTheme() {
    var html = document.documentElement;
    if (!("MutationObserver" in window)) return;
    var mo = new MutationObserver(function () {
      renderCharts();
    });
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme", "dir"] });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireSidebar();
    renderCharts();
    initProgressBars();
    watchTheme();
  });
})();