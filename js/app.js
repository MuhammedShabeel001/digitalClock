import { initClock, toggleFormat } from './clock.js';
import { initTheme, toggleTheme } from './theme.js';

const moonSvg = `<path class="moon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
const sunSvg = `<circle class="sun" cx="12" cy="12" r="5"></circle>
                <line class="sun" x1="12" y1="1" x2="12" y2="3"></line>
                <line class="sun" x1="12" y1="21" x2="12" y2="23"></line>
                <line class="sun" x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line class="sun" x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line class="sun" x1="1" y1="12" x2="3" y2="12"></line>
                <line class="sun" x1="21" y1="12" x2="23" y2="12"></line>
                <line class="sun" x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line class="sun" x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme
    const currentTheme = initTheme();
    updateThemeIcon(currentTheme);
    
    // Initialize Clock
    initClock();
    
    // Event Listeners
    const formatToggleBtn = document.getElementById('format-toggle');
    if (formatToggleBtn) {
        formatToggleBtn.addEventListener('click', () => {
            toggleFormat();
        });
    }
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = toggleTheme();
            updateThemeIcon(newTheme);
        });
    }
});

function updateThemeIcon(theme) {
    const iconContainer = document.getElementById('theme-icon');
    if (iconContainer) {
        iconContainer.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
    }
}
