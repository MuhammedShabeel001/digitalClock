import { padZero, format12Hour, formatDate } from './format.js';

// State
let is12HourFormat = true;
const elements = {};

/**
 * Initializes the clock by caching DOM elements and starting the timer
 */
export const initClock = () => {
    // Cache DOM elements
    elements.hours = document.getElementById('hours');
    elements.minutes = document.getElementById('minutes');
    elements.seconds = document.getElementById('seconds');
    elements.amPm = document.getElementById('am-pm');
    elements.weekday = document.getElementById('weekday');
    elements.fullDate = document.getElementById('full-date');
    elements.formatBtnText = document.getElementById('format-icon-text');

    // Run immediately then set interval
    updateClock(true); // force first update to avoid animation
    setInterval(updateClock, 1000);
};

/**
 * Toggles the time format (12H <-> 24H)
 */
export const toggleFormat = () => {
    is12HourFormat = !is12HourFormat;
    
    // Update button text
    if (elements.formatBtnText) {
        elements.formatBtnText.textContent = is12HourFormat ? '24H' : '12H';
    }
    
    // Force immediate update to reflect format change
    updateClock(true);
};

/**
 * Updates a DOM element with a new value, adding a fade transition if changed
 * @param {HTMLElement} el 
 * @param {string} newValue 
 * @param {boolean} force - if true, bypasses the fade animation check
 */
const updateElementValue = (el, newValue, force = false) => {
    if (!el) return;
    
    if (el.textContent !== newValue) {
        if (!force) {
            // Apply fade out class
            el.classList.add('fade');
            
            // Wait for transition to complete before changing value and fading back in
            // Using 150ms to match the CSS --transition-fast
            setTimeout(() => {
                el.textContent = newValue;
                el.classList.remove('fade');
            }, 150);
        } else {
            // Update immediately without animation
            el.textContent = newValue;
            el.classList.remove('fade'); // ensure it's not stuck faded
        }
    }
};

/**
 * Main clock update function
 * @param {boolean} force - forces immediate update without animation
 */
const updateClock = (force = false) => {
    const now = new Date();
    
    // Get Time
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Format Time
    let amPmStr = '';
    if (is12HourFormat) {
        const { formattedHours, period } = format12Hour(hours);
        hours = formattedHours;
        amPmStr = period;
    }
    
    // Update Time DOM
    updateElementValue(elements.hours, padZero(hours), force);
    updateElementValue(elements.minutes, padZero(minutes), force);
    updateElementValue(elements.seconds, padZero(seconds), force);
    updateElementValue(elements.amPm, amPmStr, force);
    
    // Get Date
    const { weekday, fullDate } = formatDate(now);
    
    // Update Date DOM
    // For date, we typically don't want the fade animation every time, just update directly
    if (elements.weekday && elements.weekday.textContent !== weekday) {
        elements.weekday.textContent = weekday;
    }
    
    if (elements.fullDate && elements.fullDate.textContent !== fullDate) {
        elements.fullDate.textContent = fullDate;
    }
};
