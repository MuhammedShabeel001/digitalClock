export class ProgressRing {
    constructor() {
        this.circle = document.querySelector('.progress-ring-circle');
        this.radius = this.circle.r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;
        
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;
    }

    setProgress(percent) {
        // Percent goes from 100 to 0 as time decreases
        const offset = this.circumference - (percent / 100) * this.circumference;
        this.circle.style.strokeDashoffset = offset;
    }

    setColor(colorVar) {
        this.circle.style.stroke = `var(${colorVar})`;
    }
}
