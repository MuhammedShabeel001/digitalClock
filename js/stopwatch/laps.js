import { padZero } from '../format.js';

export class LapsManager {
    constructor() {
        this.lapsList = document.getElementById('laps-list');
        this.laps = [];
    }

    addLap(timeMs) {
        let diff = timeMs;
        if (this.laps.length > 0) {
            diff = timeMs - this.laps[0].total; // compare to previous lap total
        }
        
        const lapData = {
            index: this.laps.length + 1,
            total: timeMs,
            diff: diff
        };
        
        // Add to front of array
        this.laps.unshift(lapData);
        this.renderLap(lapData);
    }

    clearLaps() {
        this.laps = [];
        this.lapsList.innerHTML = '';
    }

    formatTime(ms) {
        const date = new Date(ms);
        const minutes = padZero(date.getUTCMinutes());
        const seconds = padZero(date.getUTCSeconds());
        const milliseconds = padZero(Math.floor(date.getUTCMilliseconds() / 10));
        return `${minutes}:${seconds}.${milliseconds}`;
    }

    renderLap(lapData) {
        const li = document.createElement('li');
        li.className = 'lap-item';
        
        const indexSpan = document.createElement('span');
        indexSpan.className = 'lap-index';
        indexSpan.textContent = `Lap ${lapData.index}`;
        
        const timeContainer = document.createElement('div');
        
        const diffSpan = document.createElement('span');
        diffSpan.className = 'lap-diff';
        diffSpan.textContent = `+${this.formatTime(lapData.diff)}`;
        
        const totalSpan = document.createElement('span');
        totalSpan.className = 'lap-total';
        totalSpan.textContent = this.formatTime(lapData.total);
        
        timeContainer.appendChild(totalSpan);
        timeContainer.appendChild(diffSpan);
        
        li.appendChild(indexSpan);
        li.appendChild(timeContainer);
        
        // Prepend to show newest at top
        this.lapsList.prepend(li);
    }
}
