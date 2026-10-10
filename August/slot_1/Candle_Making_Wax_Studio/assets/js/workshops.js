/* LUME — Workshops JS (calendar with fixed weekly schedule) */
(function () {
  'use strict';
  var IMG = 'assets/images/workshops/';
  var CLASSES = {
    beginner: { title: 'Beginner Pour', img: IMG + 'class-beginner.png', price: '$65 per person', level: 'All levels', cta: 'Reserve Seat', href: 'contact.html' },
    advanced: { title: 'Advanced Blending', img: IMG + 'class-advanced.png', price: '$95 per person', level: 'Ages 16+', cta: 'Reserve Seat', href: 'contact.html' },
    private:  { title: 'Private Group', img: IMG + 'class-private.png', price: '$450 flat rate', level: 'Up to 8 guests', cta: 'Request Booking', href: 'contact.html' }
  };
  // weekday (0=Sun) -> sessions
  var WEEK = {
    3: [{ c: 'beginner', time: '6:00 PM – 8:00 PM', cap: 8 }],
    5: [{ c: 'private', time: '6:30 PM – 9:00 PM', cap: 8 }],
    6: [{ c: 'beginner', time: '10:00 AM – 12:00 PM', cap: 8 }, { c: 'advanced', time: '2:00 PM – 5:00 PM', cap: 6 }]
  };
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var month, year, today;

  function pad(n) { return String(n).padStart(2, '0'); }
  function key(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function sessionsFor(date) {
    var list = WEEK[date.getDay()] || [];
    return list.map(function (s, i) {
      // deterministic seats left
      var seed = (date.getDate() * 7 + date.getMonth() * 3 + i * 5) % 5;
      var left = Math.min(s.cap, seed + 2);
      return { c: s.c, time: s.time, left: left, cap: s.cap };
    });
  }
  function isPast(date) { return date < today; }
  function fmt(date) { return DAYS[date.getDay()] + ', ' + MONTHS[date.getMonth()] + ' ' + date.getDate(); }

  function sessionHTML(s) {
    var c = CLASSES[s.c];
    var spots = s.c === 'private' ? 'Subject to availability' : s.left + ' of ' + s.cap + ' seats left';
    return '<div class="session"><img src="' + c.img + '" alt="' + c.title + ' workshop"><div>' +
      '<div class="session__title">' + c.title + '</div>' +
      '<div class="session__info">' + s.time + '<br>' + c.price + ' &bull; ' + c.level + '</div>' +
      '<div class="session__spots">' + spots + '</div>' +
      '<a href="' + c.href + '" class="btn btn--primary btn--sm">' + c.cta + '</a></div></div>';
  }

  function showPanel(date) {
    var panel = document.getElementById('cal-panel');
    if (!panel) return;
    var list = sessionsFor(date);
    panel.innerHTML = '<div class="cal-panel__date">' + fmt(date) + '</div>' + list.map(sessionHTML).join('');
  }

  function render() {
    var grid = document.getElementById('cal-grid');
    var title = document.getElementById('cal-title');
    if (!grid || !title) return;
    title.textContent = MONTHS[month] + ' ' + year;
    var first = new Date(year, month, 1).getDay();
    var days = new Date(year, month + 1, 0).getDate();
    var html = '';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function (d) { html += '<div class="cal-header">' + d + '</div>'; });
    for (var i = 0; i < first; i++) html += '<div class="cal-cell cal-cell--empty"></div>';
    for (var d = 1; d <= days; d++) {
      var date = new Date(year, month, d);
      var list = sessionsFor(date);
      var past = isPast(date);
      var avail = list.length && !past;
      var cls = 'cal-cell' + (avail ? ' cal-cell--available' : '') + (past ? ' cal-cell--past' : '') + (date.getTime() === today.getTime() ? ' cal-cell--today' : '');
      var dots = avail ? '<span class="cal-dots">' + list.map(function (s) { return '<i class="dot--' + s.c + '"></i>'; }).join('') + '</span>' : '';
      html += '<div class="' + cls + '"' + (avail ? ' data-date="' + key(year, month, d) + '"' : '') + '><span class="cal-day">' + d + '</span>' + dots + '</div>';
    }
    grid.innerHTML = html;
    grid.querySelectorAll('[data-date]').forEach(function (cell) {
      cell.addEventListener('click', function () {
        grid.querySelectorAll('.cal-cell--selected').forEach(function (c) { c.classList.remove('cal-cell--selected'); });
        cell.classList.add('cal-cell--selected');
        var p = cell.getAttribute('data-date').split('-');
        showPanel(new Date(+p[0], +p[1] - 1, +p[2]));
      });
    });
    var firstAvail = grid.querySelector('[data-date]');
    if (firstAvail) firstAvail.click();
    else document.getElementById('cal-panel').innerHTML = '<p style="color:var(--color-text-tertiary);font-size:var(--small-size);text-align:center;padding-top:var(--space-2xl);">No sessions in the past. Try another month.</p>';
  }

  function upcoming() {
    var el = document.getElementById('upcoming-grid');
    if (!el) return;
    var out = [], d = new Date(today);
    while (out.length < 6) {
      sessionsFor(d).forEach(function (s) {
        if (s.c !== 'private' && out.length < 6) out.push({ d: new Date(d), s: s });
      });
      d.setDate(d.getDate() + 1);
    }
    el.innerHTML = out.map(function (o) {
      var c = CLASSES[o.s.c];
      return '<div class="upcoming-card"><img src="' + c.img + '" alt="' + c.title + '"><div>' +
        '<div class="upcoming-card__date">' + DAYS[o.d.getDay()].slice(0, 3) + ', ' + MONTHS[o.d.getMonth()].slice(0, 3) + ' ' + o.d.getDate() + '</div>' +
        '<div class="upcoming-card__title">' + c.title + '</div>' +
        '<div class="upcoming-card__info">' + o.s.time + '<br>' + c.price + ' &bull; ' + o.s.left + ' seats left</div></div></div>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('workshop-calendar')) return;
    var n = new Date();
    today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    month = today.getMonth(); year = today.getFullYear();
    render(); upcoming();
    document.getElementById('cal-prev').addEventListener('click', function () { month--; if (month < 0) { month = 11; year--; } render(); });
    document.getElementById('cal-next').addEventListener('click', function () { month++; if (month > 11) { month = 0; year++; } render(); });
  });
})();
