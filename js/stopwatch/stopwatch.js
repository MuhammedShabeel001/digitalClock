import { padZero } from '../format.js';
import { LapsManager } from './laps.js';

export class Stopwatch {
    constructor() {
        this.minutesEl = document.getElementById('sw-minutes');
        this.secondsEl = document.getElementById('sw-seconds');
        this.msEl = document.getElementById('sw-milliseconds');
        this.startBtn = document.getElementById('sw-start');
        this.lapResetBtn = document.getElementById('sw-lap-reset');
        
        this.lapsManager = new LapsManager();
        
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        
        // Ensure buttons have initial text
        this.startBtn.textContent = 'Start';
        this.lapResetBtn.textContent = 'Lap';
        this.lapResetBtn.disabled = true;
        this.lapResetBtn.style.opacity = '0.5';
        
        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => {
            if (this.isRunning) {
                this.pause();
            } else {
                this.start();
            }
        });
        
        this.lapResetBtn.addEventListener('click', () => {
            if (this.isRunning) {
                this.lapsManager.addLap(this.elapsedTime);
            } else {
                this.reset();
            }
        });
    }

    start() {
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        
        this.startBtn.textContent = 'Stop';
        this.startBtn.classList.add('secondary');
        
        this.lapResetBtn.textContent = 'Lap';
        this.lapResetBtn.disabled = false;
        this.lapResetBtn.style.opacity = '1';
        
        // Use requestAnimationFrame for smoother high-precision updates than setInterval
        const update = () => {
            if (!this.isRunning) return;
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
            this.timerInterval = requestAnimationFrame(update);
        };
        this.timerInterval = requestAnimationFrame(update);
    }

    pause() {
        this.isRunning = false;
        cancelAnimationFrame(this.timerInterval);
        
        this.startBtn.textContent = 'Start';
        this.startBtn.classList.remove('secondary');
        
        this.lapResetBtn.textContent = 'Reset';
    }

    reset() {
        this.isRunning = false;
        cancelAnimationFrame(this.timerInterval);
        this.elapsedTime = 0;
        
        this.startBtn.textContent = 'Start';
        this.startBtn.classList.remove('secondary');
        
        this.lapResetBtn.textContent = 'Lap';
        this.lapResetBtn.disabled = true;
        this.lapResetBtn.style.opacity = '0.5';
        
        this.lapsManager.clearLaps();
        this.updateDisplay(true); // force update without animations
    }

    animateElement(el, newValue, force = false) {
        if (el.textContent === newValue) return;
        if (force) {
            el.textContent = newValue;
            return;
        }
        
        // For stopwatch, animations might make it jittery during fast updates.
        // We only animate minutes and maybe seconds to keep performance smooth.
        el.classList.add('fade-out');
        setTimeout(() => {
            el.textContent = newValue;
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
            void el.offsetWidth;
            el.classList.remove('fade-in');
        }, 150); // Faster animation for stopwatch
    }

    updateElementValue(el, newValue, animate = false) {
        if (!el) return;
        const digits = el.querySelectorAll('.digit');
        if (digits.length > 0) {
            const chars = newValue.split('');
            for (let i = 0; i < digits.length; i++) {
                if (digits[i] && digits[i].textContent !== chars[i]) {
                    if (animate) {
                        this.animateElement(digits[i], chars[i]);
                    } else {
                        digits[i].textContent = chars[i];
                    }
                }
            }
        }
    }

    updateDisplay(force = false) {
        const date = new Date(this.elapsedTime);
        const minutes = padZero(date.getUTCMinutes());
        const seconds = padZero(date.getUTCSeconds());
        // Show 2 digits for ms (centiseconds)
        const ms = padZero(Math.floor(date.getUTCMilliseconds() / 10));
        
        // Only animate minutes and maybe seconds if forced. 
        // Normal running doesn't animate to avoid performance issues.
        this.updateElementValue(this.minutesEl, minutes, force);
        this.updateElementValue(this.secondsEl, seconds, force);
        this.updateElementValue(this.msEl, ms, false); // Never animate ms
    }
}
