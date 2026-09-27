document.addEventListener('DOMContentLoaded', () => {
    // Parallax on hero title
    const heroContent = document.querySelector('.hero__content');
    const hero = document.querySelector('.hero');
    
    if (hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 25;
            const y = (e.clientY / window.innerHeight - 0.5) * 25;
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = `translate(0, 0)`;
            heroContent.style.transition = 'transform 0.5s ease';
        });
        
        hero.addEventListener('mouseenter', () => {
            heroContent.style.transition = 'none';
        });
    }

    // Leaf generator
    const leavesContainer = document.querySelector('.leaves-container');
    if (leavesContainer) {
        for (let i = 0; i < 5; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('leaf');
            leaf.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="var(--clr-green)" stroke="var(--clr-ink)" stroke-width="2"><path d="M12 2C7 2 3 7 3 12c0 4.4 3 8.3 7 9.6V22h4v-1.4c3.8-1.5 6-5.5 6-9.6 0-5-4-10-8-10z"/></svg>`;
            leaf.style.position = 'absolute';
            leaf.style.left = `${Math.random() * 80 + 10}%`;
            leaf.style.top = `${Math.random() * 80 + 10}%`;
            leaf.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite alternate`;
            leaf.style.animationDelay = `${Math.random() * 2}s`;
            leavesContainer.appendChild(leaf);
        }
    }
});
