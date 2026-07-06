import { settings } from './settings.js';
import { ProgressRing } from './progress.js';
import { padZero } from '../format.js';
import { storage } from '../storage.js';
import { soundManager } from '../audio.js';

export class PomodoroTimer {
    constructor() {
        this.minutesEl = document.getElementById('pomodoro-minutes');
        this.secondsEl = document.getElementById('pomodoro-seconds');
        this.startBtn = document.getElementById('pomodoro-start');
        this.resetBtn = document.getElementById('pomodoro-reset');
        this.sessionLabel = document.getElementById('session-label');
        this.sessionCounter = document.getElementById('session-counter');
        
        this.progress = new ProgressRing();
        
        this.timerInterval = null;
        this.isRunning = false;
        
        this.sessionType = 'focus'; // 'focus', 'shortBreak', 'longBreak'
        this.currentSessionCount = 1;
        this.timeLeft = settings.focusDuration;
        this.totalTime = settings.focusDuration;
        
        this.init();
    }

    init() {
        this.updateDisplay();
        
        this.startBtn.addEventListener('click', () => this.toggle());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.textContent = 'Pause';
        this.startBtn.classList.add('secondary');
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            // Only tick if it's a focus session, so breaks are silent
            if (this.sessionType === 'focus' && this.timeLeft > 0) {
                soundManager.playTick();
            }
            
            if (this.timeLeft <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.startBtn.classList.remove('secondary');
        
        clearInterval(this.timerInterval);
    }

    reset() {
        this.pause();
        this.setSession(this.sessionType);
    }

    completeSession() {
        // Play alert sound
        soundManager.playDing();
        this.pause();
        
        if (this.sessionType === 'focus') {
            if (this.currentSessionCount % settings.sessionsBeforeLongBreak === 0) {
                this.setSession('longBreak');
            } else {
                this.setSession('shortBreak');
            }
        } else {
            if (this.sessionType === 'shortBreak' || this.sessionType === 'longBreak') {
                 if(this.sessionType === 'shortBreak') {
                     this.currentSessionCount++;
                 } else {
                     this.currentSessionCount = 1; // Reset after long break
                 }
            }
            this.setSession('focus');
        }
        
        // Auto-start next session after 2 seconds
        setTimeout(() => this.start(), 2000);
    }

    setSession(type) {
        this.sessionType = type;
        
        if (type === 'focus') {
            this.timeLeft = settings.focusDuration;
            this.totalTime = settings.focusDuration;
            this.sessionLabel.textContent = 'Focus Session';
            this.progress.setColor('--color-accent');
        } else if (type === 'shortBreak') {
            this.timeLeft = settings.shortBreakDuration;
            this.totalTime = settings.shortBreakDuration;
            this.sessionLabel.textContent = 'Short Break';
            this.progress.setColor('--color-text-secondary');
        } else if (type === 'longBreak') {
            this.timeLeft = settings.longBreakDuration;
            this.totalTime = settings.longBreakDuration;
            this.sessionLabel.textContent = 'Long Break';
            this.progress.setColor('--color-text-primary');
        }
        
        this.sessionCounter.textContent = `${(this.currentSessionCount - 1) % settings.sessionsBeforeLongBreak + 1}/${settings.sessionsBeforeLongBreak}`;
        this.updateDisplay();
    }

    animateElement(el, newValue) {
        if (el.textContent === newValue) return;
        
        el.classList.add('fade-out');
        setTimeout(() => {
            el.textContent = newValue;
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
            void el.offsetWidth;
            el.classList.remove('fade-in');
        }, 250);
    }

    updateElementValue(el, newValue) {
        if (!el) return;
        const digits = el.querySelectorAll('.digit');
        if (digits.length > 0) {
            const chars = newValue.split('');
            for (let i = 0; i < digits.length; i++) {
                if (digits[i] && digits[i].textContent !== chars[i]) {
                    this.animateElement(digits[i], chars[i]);
                }
            }
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        this.updateElementValue(this.minutesEl, padZero(minutes));
        this.updateElementValue(this.secondsEl, padZero(seconds));
        
        const percent = (this.timeLeft / this.totalTime) * 100;
        this.progress.setProgress(percent);
    }
}
