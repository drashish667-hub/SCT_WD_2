class StopWatch {
    constructor() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapsList = document.getElementById('lapsList');
        this.lapCount = document.getElementById('lapCount');

        this.elapsedTime = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.laps = [];

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;

        const startTime = Date.now() - this.elapsedTime;

        this.intervalId = setInterval(() => {
            this.elapsedTime = Date.now() - startTime;
            this.updateDisplay();
        }, 10);
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.intervalId);
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    reset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.elapsedTime = 0;
        this.laps = [];
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.updateDisplay();
        this.renderLaps();
    }

    recordLap() {
        if (!this.isRunning) return;

        const lapTime = this.elapsedTime;
        const previousLapTime = this.laps.length > 0 ? this.laps[this.laps.length - 1].time : 0;
        const lapDelta = lapTime - previousLapTime;

        this.laps.push({
            number: this.laps.length + 1,
            time: lapTime,
            delta: lapDelta
        });

        this.renderLaps();
    }

    updateDisplay() {
        const totalMilliseconds = Math.floor(this.elapsedTime);
        const minutes = Math.floor(totalMilliseconds / 60000);
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
        const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);

        this.timeDisplay.textContent = this.formatTime(minutes, seconds, centiseconds);
    }

    formatTime(min, sec, centi) {
        return `${this.pad(min)}:${this.pad(sec)}.${this.pad(centi)}`;
    }

    pad(num) {
        return String(num).padStart(2, '0');
    }

    renderLaps() {
        this.lapCount.textContent = `${this.laps.length} lap${this.laps.length !== 1 ? 's' : ''}`;

        if (this.laps.length === 0) {
            this.lapsList.innerHTML = '<div class="laps-empty">No laps recorded</div>';
            return;
        }

        this.lapsList.innerHTML = this.laps.map(lap => {
            const totalMilliseconds = Math.floor(lap.time);
            const minutes = Math.floor(totalMilliseconds / 60000);
            const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
            const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);
            const lapTimeFormatted = this.formatTime(minutes, seconds, centiseconds);

            const deltaTotalMilliseconds = Math.floor(lap.delta);
            const deltaMinutes = Math.floor(deltaTotalMilliseconds / 60000);
            const deltaSeconds = Math.floor((deltaTotalMilliseconds % 60000) / 1000);
            const deltaCentiseconds = Math.floor((deltaTotalMilliseconds % 1000) / 10);
            const deltaFormatted = this.formatTime(deltaMinutes, deltaSeconds, deltaCentiseconds);

            return `
                <div class="lap-item">
                    <span class="lap-number">Lap #${lap.number}</span>
                    <span class="lap-time">${lapTimeFormatted}</span>
                    <span class="lap-delta">+${deltaFormatted}</span>
                </div>
            `;
        }).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StopWatch();
});
