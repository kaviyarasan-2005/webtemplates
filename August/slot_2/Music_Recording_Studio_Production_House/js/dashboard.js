/* ============================================================
   SoundForge Studios — Dashboard JavaScript
   Calendar, file uploads, kanban, sidebar, notifications
   ============================================================ */

const DashboardManager = (() => {

  /* ── Sidebar mobile toggle ──────────────────────────────── */
  const initSidebar = () => {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('dashboard-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!toggle || !sidebar) return;

    const open = () => {
      sidebar.classList.add('is-open');
      overlay?.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      sidebar.classList.remove('is-open');
      overlay?.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () =>
      sidebar.classList.contains('is-open') ? close() : open()
    );

    overlay?.addEventListener('click', close);

    /* Active nav item */
    const links = sidebar.querySelectorAll('.sidebar__link[data-panel]');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        links.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');

        const panelId = link.getAttribute('data-panel');
        document.querySelectorAll('.dash-section').forEach((s) => {
          s.style.display = s.id === panelId ? '' : 'none';
        });

        if (window.innerWidth <= 1024) close();
      });
    });
  };

  /* ── Calendar widget ─────────────────────────────────────── */
  const initCalendar = () => {
    const widget = document.getElementById('booking-calendar');
    if (!widget) return;

    const monthLabel = widget.querySelector('.cal-widget__month');
    const gridEl     = widget.querySelector('.cal-grid');
    const prevBtn    = widget.querySelector('[data-cal-prev]');
    const nextBtn    = widget.querySelector('[data-cal-next]');

    const bookedDays  = [5, 12, 18, 25]; /* mock data */
    const dayNames    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames  = ['January','February','March','April','May','June',
                         'July','August','September','October','November','December'];

    let now      = new Date();
    let year     = now.getFullYear();
    let month    = now.getMonth();
    let selected = null;

    const render = () => {
      if (!gridEl) return;
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date();

      if (monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;

      /* Day labels */
      const dayLabelHtml = dayNames.map((d) =>
        `<div class="cal-day-label">${d}</div>`
      ).join('');

      /* Empty cells */
      const emptyHtml = Array.from({ length: firstDay }, () =>
        `<div class="cal-day cal-day--empty" aria-hidden="true"></div>`
      ).join('');

      /* Day cells */
      const daysHtml = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = day === selected;
        const isBooked = bookedDays.includes(day);
        const classes = ['cal-day',
          isToday    ? 'cal-day--today'    : '',
          isSelected ? 'cal-day--selected' : '',
          isBooked   ? 'cal-day--booked'   : '',
        ].filter(Boolean).join(' ');

        return `<button class="${classes}" data-day="${day}" aria-label="${monthNames[month]} ${day}, ${year}${isBooked ? ' — session booked' : ''}">${day}</button>`;
      }).join('');

      gridEl.innerHTML = dayLabelHtml + emptyHtml + daysHtml;

      /* Click events */
      gridEl.querySelectorAll('.cal-day[data-day]').forEach((btn) => {
        btn.addEventListener('click', () => {
          selected = parseInt(btn.getAttribute('data-day'), 10);
          render();
          const selectedDateEl = document.getElementById('selected-date');
          if (selectedDateEl) {
            selectedDateEl.textContent = `${monthNames[month]} ${selected}, ${year}`;
          }
        });
      });
    };

    if (prevBtn) prevBtn.addEventListener('click', () => {
      month--;
      if (month < 0) { month = 11; year--; }
      render();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
      month++;
      if (month > 11) { month = 0; year++; }
      render();
    });

    render();
  };

  /* ── File upload drag & drop ────────────────────────────── */
  const initUpload = () => {
    const zone = document.getElementById('upload-zone');
    const input = document.getElementById('file-input');
    const list  = document.getElementById('file-list');

    if (!zone) return;

    const formatSize = (bytes) => {
      if (bytes < 1024)        return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const addFiles = (files) => {
      if (!list) return;
      Array.from(files).forEach((file) => {
        const ext   = file.name.split('.').pop().toLowerCase();
        const icons = { mp3: 'ri-music-fill', wav: 'ri-music-2-fill', flac: 'ri-equalizer-fill', aiff: 'ri-radio-fill' };
        const icon  = icons[ext] || 'ri-file-music-fill';

        const item = document.createElement('div');
        item.className = 'file-item animate-fade-in-up';
        item.innerHTML = `
          <div class="file-item__icon"><i class="${icon}" aria-hidden="true"></i></div>
          <div class="file-item__info">
            <div class="file-item__name">${file.name}</div>
            <div class="file-item__meta">${formatSize(file.size)} &middot; ${ext.toUpperCase()}</div>
          </div>
          <div class="progress" style="width:100px">
            <div class="progress__bar" style="width:0" data-progress></div>
          </div>
          <button class="btn btn--ghost btn--sm btn--icon file-remove" aria-label="Remove file">
            <i class="ri-close-line" aria-hidden="true"></i>
          </button>
        `;

        const progressBar = item.querySelector('[data-progress]');
        list.appendChild(item);

        /* Simulate progress */
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            FormValidator?.showToast(`${file.name} uploaded successfully.`, 'success');
          }
          if (progressBar) progressBar.style.width = `${progress}%`;
        }, 200);

        item.querySelector('.file-remove').addEventListener('click', () => {
          clearInterval(interval);
          item.style.opacity = '0';
          setTimeout(() => item.remove(), 300);
        });
      });
    };

    zone.addEventListener('click', () => input?.click());
    input?.addEventListener('change', () => addFiles(input.files));

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      addFiles(e.dataTransfer.files);
    });

    zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input?.click(); }
    });
    zone.setAttribute('tabindex', '0');
    zone.setAttribute('role', 'button');
    zone.setAttribute('aria-label', 'Click or drag to upload reference tracks');
  };

  /* ── Notification dismiss ───────────────────────────────── */
  const initNotifications = () => {
    document.querySelectorAll('[data-dismiss-notif]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.notif-item');
        if (item) {
          item.style.opacity = '0';
          setTimeout(() => item.remove(), 300);
        }
      });
    });
  };

  /* ── Payment buttons ────────────────────────────────────── */
  const initPayments = () => {
    document.querySelectorAll('[data-pay-invoice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-pay-invoice');
        FormValidator?.showToast(`Redirecting to payment for Invoice #${id}…`, 'info');
        /* Stripe/PayPal integration point */
      });
    });
  };

  /* ── Init ─────────────────────────────────────────────── */
  const init = () => {
    initSidebar();
    initCalendar();
    initUpload();
    initNotifications();
    initPayments();
  };

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DashboardManager.init);
} else {
  DashboardManager.init();
}
