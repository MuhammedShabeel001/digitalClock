import { initClock, toggleFormat } from './clock.js';
import { initTheme, toggleTheme } from './theme.js';
import { Router } from './router.js';
import { Navigation } from './components/navigation.js';
import { PomodoroTimer } from './pomodoro/timer.js';
import { Stopwatch } from './stopwatch/stopwatch.js';
import { storage } from './storage.js';
import { soundManager } from './audio.js';

const volumeOnSvg = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
const volumeOffSvg = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;

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

    // Initialize Sound
    updateSoundIcon(soundManager.isMuted);

    // Initialize SPA Router and Navigation
    const router = new Router('clock');
    new Navigation(router);

    // Initialize Modules
    initClock();
    new PomodoroTimer();
    new Stopwatch();

    // Event Listeners for Top Controls
    const dateToggleBtn = document.getElementById('date-toggle');
    const dateDisplay = document.querySelector('.date-display');

    // Load date visibility preference
    const isDateHidden = storage.get('hide-date', false);
    if (isDateHidden && dateDisplay) {
        dateDisplay.classList.add('hidden');
    }

    if (dateToggleBtn && dateDisplay) {
        dateToggleBtn.addEventListener('click', () => {
            const isHidden = dateDisplay.classList.toggle('hidden');
            storage.set('hide-date', isHidden);
        });
    }
    
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const isMuted = soundManager.toggleMute();
            updateSoundIcon(isMuted);
        });
    }

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
    
    // View-specific Top Controls Logic
    const soundBtn = document.getElementById('sound-toggle');
    const dateBtn = document.getElementById('date-toggle');
    
    const updateTopControls = (view) => {
        if (soundBtn) soundBtn.style.display = view === 'pomodoro' ? 'flex' : 'none';
        if (dateBtn) dateBtn.style.display = view === 'clock' ? 'flex' : 'none';
        if (formatToggleBtn) formatToggleBtn.style.display = view === 'clock' ? 'flex' : 'none';
        
        const topControlsLeft = document.querySelector('.top-controls-left');
        if (topControlsLeft) topControlsLeft.style.display = view === 'clock' ? 'flex' : 'none';
    };
    
    // Set initial state (default view is clock)
    updateTopControls('clock');
    
    const analogToggleBtn = document.getElementById('analog-toggle');
    if (analogToggleBtn) {
        const isAnalog = storage.get('is-analog', false);
        const clockWrapper = document.querySelector('.clock-wrapper');
        
        if (isAnalog && clockWrapper) {
            clockWrapper.classList.add('show-analog');
        }
        
        analogToggleBtn.addEventListener('click', () => {
            if (clockWrapper) {
                const toggled = clockWrapper.classList.toggle('show-analog');
                storage.set('is-analog', toggled);
            }
        });
    }

    // Listen for view changes from router
    window.addEventListener('viewChanged', (e) => {
        updateTopControls(e.detail.view);
    });
});

function updateThemeIcon(theme) {
    const iconContainer = document.getElementById('theme-icon');
    if (iconContainer) {
        iconContainer.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
    }
}

function updateSoundIcon(isMuted) {
    const iconContainer = document.getElementById('sound-icon');
    if (iconContainer) {
        iconContainer.innerHTML = isMuted ? volumeOffSvg : volumeOnSvg;
    }
}
