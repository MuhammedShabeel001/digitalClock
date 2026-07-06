export class Navigation {
    constructor(router) {
        this.router = router;
        this.navItems = document.querySelectorAll('.nav-item');
        this.indicator = document.getElementById('nav-indicator');
        
        this.init();
    }

    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.target;
                this.setActive(target);
                this.router.navigate(target);
            });
        });
        
        // Set initial indicator position
        // Give the DOM a tiny bit of time to render completely
        setTimeout(() => {
            this.updateIndicator(document.querySelector('.nav-item.active'));
        }, 50);

        // Update indicator on window resize
        window.addEventListener('resize', () => {
            const activeItem = document.querySelector('.nav-item.active');
            if (activeItem) this.updateIndicator(activeItem);
        });
    }

    setActive(targetView) {
        let activeItem = null;
        
        this.navItems.forEach(item => {
            if (item.dataset.target === targetView) {
                item.classList.add('active');
                activeItem = item;
            } else {
                item.classList.remove('active');
            }
        });
        
        if (activeItem) {
            this.updateIndicator(activeItem);
        }
    }

    updateIndicator(element) {
        if (!this.indicator || !element) return;
        
        // Calculate the position relative to the nav container
        const containerRect = element.parentElement.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // 6px is the padding of the nav-container
        const leftPos = elementRect.left - containerRect.left;
        
        this.indicator.style.width = `${elementRect.width}px`;
        this.indicator.style.transform = `translateX(${leftPos - 6}px)`;
    }
}
