import { storage } from './storage.js';

class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = storage.get('is-muted', false);
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        storage.set('is-muted', this.isMuted);
        return this.isMuted;
    }
    
    playTick() {
        if (this.isMuted) return;
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        const time = this.ctx.currentTime;
        
        // Create a crisp, smooth, pleasant tick using a triangle wave
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle'; 
        
        // High pitch that drops rapidly for a sweet "click" character
        osc.frequency.setValueAtTime(1000, time);
        osc.frequency.exponentialRampToValueAtTime(200, time + 0.02);
        
        const gainNode = this.ctx.createGain();
        
        // Tiny 2ms attack to prevent harsh speaker popping, making it "smooth"
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.15, time + 0.002);
        
        // Fast decay for the crisp tick
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.03);
    }
    
    playDing() {
        if (this.isMuted) return;
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        // A nice ding for session complete
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 1.5);
        
        gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
        
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }
}

export const soundManager = new SoundManager();
