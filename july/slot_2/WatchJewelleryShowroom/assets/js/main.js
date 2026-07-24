/**
 * Watch & Jewellery Showroom - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;

    // ==========================================
    // Theme Toggle (Dark/Light Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let initialTheme = 'light';

    if (savedTheme) {
        initialTheme = savedTheme;
    } else if (prefersDark) {
        initialTheme = 'dark';
    }

    htmlElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        let icon = themeToggleBtn.querySelector('i');
        if (!icon) {
            icon = document.createElement('i');
            themeToggleBtn.appendChild(icon);
        }
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
            themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            icon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
            themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // ==========================================
    // LTR/RTL Toggle
    // ==========================================
    const dirToggleBtn = document.getElementById('dir-toggle');
    const savedDir = localStorage.getItem('dir') || 'ltr';

    htmlElement.setAttribute('dir', savedDir);
    updateDirUI(savedDir);

    function updateDirUI(dir) {
        if (!dirToggleBtn) return;
        const targetDirLabel = (dir === 'rtl') ? 'LTR' : 'RTL';
        dirToggleBtn.innerHTML = `<span class="dir-badge">${targetDirLabel}</span>`;
        dirToggleBtn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
        dirToggleBtn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
    }

    if (dirToggleBtn) {
        dirToggleBtn.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            const newDir = (currentDir === 'rtl') ? 'ltr' : 'rtl';
            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateDirUI(newDir);
        });
    }

    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle icon (assuming SVG or FontAwesome inside button)
            const icon = mobileMenuBtn.querySelector('i');
            if(icon) {
                if(navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && !e.target.closest('.header')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if(icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // ==========================================
    // Mobile / Touch Dropdown Accordion Toggle
    // ==========================================
    const navDropdowns = document.querySelectorAll('.nav-dropdown');

    navDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', (e) => {
                const isMobile = window.innerWidth <= 1024;
                const isHashLink = link.getAttribute('href') === '#' || link.getAttribute('href') === '';
                
                if (isMobile || isHashLink) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    
                    // Toggle chevron rotation
                    const chevron = link.querySelector('i.fa-chevron-down');
                    if (chevron) {
                        chevron.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                }
            });
        }
    });

    // ==========================================
    // Form Validation (Client-Side)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                const errorSpan = input.nextElementSibling;
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--error)';
                    if(errorSpan && errorSpan.classList.contains('form-error')) {
                        errorSpan.style.display = 'block';
                        errorSpan.textContent = 'This field is required';
                    }
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    input.style.borderColor = 'var(--error)';
                    if(errorSpan && errorSpan.classList.contains('form-error')) {
                        errorSpan.style.display = 'block';
                        errorSpan.textContent = 'Please enter a valid email address';
                    }
                } else {
                    input.style.borderColor = '';
                    if(errorSpan && errorSpan.classList.contains('form-error')) {
                        errorSpan.style.display = 'none';
                    }
                }
            });
            
            if (isValid) {
                // Mock form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = 'Sent Successfully!';
                    submitBtn.style.backgroundColor = 'var(--success)';
                    submitBtn.style.color = '#fff';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
