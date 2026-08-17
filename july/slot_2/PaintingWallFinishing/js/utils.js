/* ============================================================
   ColorCraft — Utility Functions
   ============================================================ */

'use strict';

/**
 * Query selector helper
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {Element|null}
 */
const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Query selector all helper
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {NodeList}
 */
const $$ = (selector, context = document) => context.querySelectorAll(selector);

/**
 * Add event listener with optional delegation
 * @param {Element|string} target
 * @param {string} event
 * @param {Function} handler
 * @param {Object} [options]
 */
const on = (target, event, handler, options = {}) => {
  const el = typeof target === 'string' ? $(target) : target;
  if (el) el.addEventListener(event, handler, options);
};

/**
 * Debounce function
 * @param {Function} fn
 * @param {number} delay
 */
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} fn
 * @param {number} limit
 */
const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Get/set localStorage with JSON parse/stringify
 * @param {string} key
 * @param {*} [value]
 */
const storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* silent fail */ }
  },
  remove: (key) => {
    try { localStorage.removeItem(key); }
    catch { /* silent fail */ }
  }
};

/**
 * Detect if user prefers dark mode
 * @returns {boolean}
 */
const prefersDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * Detect if user prefers RTL (Arabic, Hebrew, etc.)
 * @returns {boolean}
 */
const prefersRTL = () => {
  const lang = document.documentElement.lang || navigator.language || 'en';
  return ['ar', 'he', 'fa', 'ur'].some(l => lang.startsWith(l));
};

/**
 * Animate a numeric counter
 * @param {Element} el
 * @param {number} target
 * @param {number} duration
 */
const animateCounter = (el, target, duration = 2000) => {
  const start = performance.now();
  const startVal = 0;
  const isFloat = String(target).includes('.');
  const decimals = isFloat ? 1 : 0;

  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = startVal + (target - startVal) * eased;
    el.textContent = current.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toFixed(decimals);
  };
  requestAnimationFrame(update);
};

/**
 * Check if element is in viewport
 * @param {Element} el
 * @param {number} [threshold=0.2]
 */
const isInViewport = (el, threshold = 0.2) => {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  return rect.top <= windowHeight * (1 - threshold);
};

/**
 * Trap focus within an element (for modal/drawer accessibility)
 * @param {Element} container
 */
const trapFocus = (container) => {
  const focusables = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
};

/**
 * Format file size for display
 * @param {number} bytes
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Show toast notification
 * @param {string} message
 * @param {string} [type='info'] - 'info' | 'success' | 'error' | 'warning'
 * @param {number} [duration=3500]
 */
const showToast = (message, type = 'info', duration = 3500) => {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const icons = { info: 'fa-circle-info', success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info}" aria-hidden="true"></i>
    <span>${message}</span>
    <button class="toast__close" aria-label="Close notification"><i class="fas fa-times" aria-hidden="true"></i></button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--show'));

  const remove = () => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast__close').addEventListener('click', remove);
  setTimeout(remove, duration);
};

/**
 * Get base path for assets (handles root vs pages/ subfolder)
 * @returns {string}
 */
const getBasePath = () => {
  const path = window.location.pathname;
  return path.includes('/pages/') ? '../' : './';
};

export { $, $$, on, debounce, throttle, storage, prefersDark, prefersRTL, animateCounter, isInViewport, trapFocus, formatFileSize, showToast, getBasePath };
