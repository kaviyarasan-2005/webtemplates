/**
 * MediCare Plus — Pharmacy & Medical Supplies
 * Main JavaScript — ES6+ Modular Structure
 */

document.addEventListener('DOMContentLoaded', () => {
    const htmlEl = document.documentElement;

    // =========================================================
    // 1. THEME TOGGLE (Dark / Light Mode)
    // =========================================================
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('medicare-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(currentTheme);

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        updateThemeBtn(theme);
    }

    function updateThemeBtn(theme) {
        if (!themeBtn) return;
        const icon = themeBtn.querySelector('i');
        if (!icon) return;
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            themeBtn.setAttribute('title', 'Switch to Light Mode');
            themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            icon.className = 'fa-solid fa-moon';
            themeBtn.setAttribute('title', 'Switch to Dark Mode');
            themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('medicare-theme', currentTheme);
        });
    }

    // =========================================================
    // 2. LTR / RTL TOGGLE
    // =========================================================
    const dirBtn = document.getElementById('dir-toggle');
    const savedDir = localStorage.getItem('medicare-dir') || 'ltr';

    applyDir(savedDir);

    function applyDir(dir) {
        htmlEl.setAttribute('dir', dir);
        updateDirBtn(dir);
    }

    function updateDirBtn(dir) {
        if (!dirBtn) return;
        const label = dir === 'rtl' ? 'LTR' : 'RTL';
        dirBtn.innerHTML = `<span class="dir-badge">${label}</span>`;
        dirBtn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
        dirBtn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    }

    if (dirBtn) {
        dirBtn.addEventListener('click', () => {
            const newDir = htmlEl.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
            applyDir(newDir);
            localStorage.setItem('medicare-dir', newDir);
        });
    }

    // =========================================================
    // 3. MOBILE MENU TOGGLE
    // =========================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
            mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !e.target.closest('.header')) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // =========================================================
    // 4. MOBILE DROPDOWN ACCORDION
    // =========================================================
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (!link) return;

        link.addEventListener('click', (e) => {
            const isMobile = window.innerWidth <= 1024;
            const isHash = link.getAttribute('href') === '#' || !link.getAttribute('href');
            if (isMobile || isHash) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                const chevron = link.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = dropdown.classList.contains('active')
                        ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });
    });

    // =========================================================
    // 5. FORM VALIDATION
    // =========================================================
    function validateField(input) {
        const errorEl = input.parentElement.querySelector('.form-error');
        let valid = true;
        let message = '';

        if (input.required && !input.value.trim()) {
            valid = false;
            message = 'This field is required.';
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            valid = false;
            message = 'Please enter a valid email address.';
        } else if (input.type === 'tel' && input.value && !isValidPhone(input.value)) {
            valid = false;
            message = 'Please enter a valid phone number.';
        }

        if (!valid) {
            input.style.borderColor = 'var(--error)';
            if (errorEl) { errorEl.textContent = message; errorEl.classList.add('visible'); }
        } else {
            input.style.borderColor = '';
            if (errorEl) errorEl.classList.remove('visible');
        }
        return valid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
    }

    function setupFormValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Real-time validation on blur
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.style.borderColor === 'var(--error)') validateField(input);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let allValid = true;

            form.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
                if (!validateField(input)) allValid = false;
            });

            if (allValid) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalHTML = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
                    submitBtn.disabled = true;

                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent Successfully!';
                        submitBtn.style.background = 'var(--success)';
                        submitBtn.style.borderColor = 'var(--success)';
                        form.reset();

                        setTimeout(() => {
                            submitBtn.innerHTML = originalHTML;
                            submitBtn.style.background = '';
                            submitBtn.style.borderColor = '';
                            submitBtn.disabled = false;
                        }, 3500);
                    }, 1500);
                }
            }
        });
    }

    setupFormValidation('contact-form');
    setupFormValidation('prescription-form');
    setupFormValidation('newsletter-form');

    // =========================================================
    // 6. SCROLL-REVEAL ANIMATIONS
    // =========================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // =========================================================
    // 7. FAQ ACCORDION
    // =========================================================
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));

            // Open clicked (unless it was already open)
            if (!isActive) item.classList.add('active');
        });
    });

    // =========================================================
    // 8. COMING SOON COUNTDOWN
    // =========================================================
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);

        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;
            if (diff <= 0) { countdownEl.textContent = 'Launched!'; return; }

            const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('cd-days')?.querySelector('.cd-value') && (
                document.getElementById('cd-days').querySelector('.cd-value').textContent =
                    String(days).padStart(2, '0')
            );
            document.getElementById('cd-hours')?.querySelector('.cd-value') && (
                document.getElementById('cd-hours').querySelector('.cd-value').textContent =
                    String(hours).padStart(2, '0')
            );
            document.getElementById('cd-minutes')?.querySelector('.cd-value') && (
                document.getElementById('cd-minutes').querySelector('.cd-value').textContent =
                    String(minutes).padStart(2, '0')
            );
            document.getElementById('cd-seconds')?.querySelector('.cd-value') && (
                document.getElementById('cd-seconds').querySelector('.cd-value').textContent =
                    String(seconds).padStart(2, '0')
            );
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // =========================================================
    // 9. PRESCRIPTION UPLOAD — File name display
    // =========================================================
    const fileInput = document.getElementById('prescription-file');
    const dropzone = document.getElementById('upload-dropzone');
    const defaultUi = document.getElementById('upload-default-ui');
    const successUi = document.getElementById('upload-success-ui');
    const fileNameDisplay = document.getElementById('file-name-display');

    if (fileInput && dropzone && defaultUi && successUi) {
        
        const handleFile = (file) => {
            if (file) {
                fileNameDisplay.textContent = file.name;
                dropzone.classList.add('file-selected');
                defaultUi.style.display = 'none';
                successUi.style.display = 'flex';
            } else {
                dropzone.classList.remove('file-selected');
                defaultUi.style.display = 'flex';
                successUi.style.display = 'none';
            }
        };

        fileInput.addEventListener('change', () => {
            handleFile(fileInput.files[0]);
        });

        // Drag & Drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.add('drag-active'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.remove('drag-active'), false);
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                fileInput.files = files; // Update file input
                handleFile(files[0]);
            }
        }, false);
    }

    // =========================================================
    // 10. ACTIVE NAV LINK DETECTION
    // =========================================================
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href')?.split('/').pop();
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});
