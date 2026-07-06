export class Router {
    constructor(initialView = 'clock') {
        this.currentView = initialView;
        this.views = document.querySelectorAll('.module-view');
        this.isAnimating = false;
        
        // Initialize
        this.views.forEach(view => {
            if (view.dataset.view !== this.currentView) {
                view.classList.remove('active');
            } else {
                view.classList.add('active');
            }
        });
    }

    async navigate(targetViewName) {
        if (this.currentView === targetViewName || this.isAnimating) return;
        
        this.isAnimating = true;
        
        const currentViewEl = document.getElementById(`view-${this.currentView}`);
        const targetViewEl = document.getElementById(`view-${targetViewName}`);
        
        if (!targetViewEl) {
            console.error(`View ${targetViewName} not found`);
            this.isAnimating = false;
            return;
        }

        // 1. Animate out current view
        if (currentViewEl) {
            currentViewEl.classList.add('slide-out');
            
            // Wait for slide-out animation to finish
            await new Promise(resolve => setTimeout(resolve, 300));
            
            currentViewEl.classList.remove('active', 'slide-out');
        }

        // 2. Prepare and animate in new view
        targetViewEl.classList.add('slide-in', 'active');
        
        // Force reflow
        void targetViewEl.offsetWidth;
        
        targetViewEl.classList.remove('slide-in');
        
        // Wait for slide-in animation to finish
        await new Promise(resolve => setTimeout(resolve, 300));
        
        this.currentView = targetViewName;
        this.isAnimating = false;
        
        // Dispatch event for modules that need to know when they become visible
        window.dispatchEvent(new CustomEvent('viewChanged', { detail: { view: targetViewName } }));
    }
}
