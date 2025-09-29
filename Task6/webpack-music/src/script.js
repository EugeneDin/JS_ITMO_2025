class MelodyPlayer {
    constructor() {
        this.audioContext = null;
        this.isPlayingMelody = false;
        
        // Частоты нот второй октавы (в Герцах)
        this.noteFrequencies = {
            'C#': 554.37,  // До диез
            'F#': 739.99,  // Фа диез
            'G#': 830.61,  // Соль диез
            'A':  880.00   // Ля
        };

        // Длительности нот (в секундах) для мелодии
        this.baseDuration = 0.5; // Базовая длительность (четвертная)
        this.noteDurations = {
            sixteenth: this.baseDuration / 2,        // Шестнадцатая
            quarter: this.baseDuration,              // Четверть
            quarterDotted: this.baseDuration * 1.5   // Четверть с точкой
        };

        // Новая последовательность мелодии: [нота, длительность]
        this.melodySequence = [
            ['C#', 'sixteenth'],      // До диез (шестнадцатая)
            ['F#', 'sixteenth'],      // Фа диез (шестнадцатая)
            ['G#', 'sixteenth'],      // Соль диез (шестнадцатая)
            ['A', 'quarterDotted'],   // Ля (четверть с точкой)
            ['G#', 'quarterDotted'],  // Соль диез (четверть с точкой)
            ['F#', 'quarterDotted'],  // Фа диез (четверть с точкой)
            ['C#', 'quarter']         // До диез (шестнадцатая)
        ];

        this.init();
    }

    init() {
        // Инициализация AudioContext при первом взаимодействии
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Кнопки отдельных нот
        document.querySelectorAll('.note-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                const note = e.target.dataset.note;
                this.playSingleNote(note);
            });
        });

        // Кнопка проигрывания всей мелодии
        document.getElementById('playMelody').addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            this.playMelody();
        });
    }

    createOscillator(frequency) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { oscillator, gainNode };
    }

    playSingleNote(note, duration = 0.5) {
        const frequency = this.noteFrequencies[note];
        if (!frequency) return;

        const { oscillator, gainNode } = this.createOscillator(frequency);
        
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(1, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);

        this.updateStatus(`Играем ноту: ${this.getNoteName(note)}`);
    }

    async playMelody() {
        if (this.isPlayingMelody) return;
        
        this.isPlayingMelody = true;
        this.updateStatus('Начинаем воспроизведение мелодии...');
        this.setMelodyButtonState(true);

        let currentTime = this.audioContext.currentTime;
        const totalDuration = this.calculateTotalDuration();

        try {
            for (const [index, [note, durationType]] of this.melodySequence.entries()) {
                const frequency = this.noteFrequencies[note];
                const duration = this.noteDurations[durationType];
                
                this.updateStatus(`Играем ноту ${index + 1}: ${this.getNoteName(note)} (${this.getDurationName(durationType)})`);
                
                const { oscillator, gainNode } = this.createOscillator(frequency);
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(1, currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + duration);
                
                currentTime += duration;
            }

            // Ждем окончания мелодии
            await new Promise(resolve => {
                setTimeout(resolve, totalDuration * 1000 + 100);
            });

        } catch (error) {
            console.error('Ошибка воспроизведения:', error);
            this.updateStatus('Ошибка воспроизведения');
        } finally {
            this.isPlayingMelody = false;
            this.setMelodyButtonState(false);
            this.updateStatus('Мелодия завершена');
        }
    }

    calculateTotalDuration() {
        return this.melodySequence.reduce((total, [, durationType]) => {
            return total + this.noteDurations[durationType];
        }, 0);
    }

    getNoteName(note) {
        const names = {
            'C#': 'До♯',
            'F#': 'Фа♯', 
            'G#': 'Соль♯',
            'A': 'Ля'
        };
        return names[note] || note;
    }

    getDurationName(durationType) {
        const names = {
            'sixteenth': 'шестнадцатая',
            'quarter': 'четверть',
            'quarterDotted': 'четверть с точкой'
        };
        return names[durationType] || durationType;
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    setMelodyButtonState(disabled) {
        const melodyButton = document.getElementById('playMelody');
        if (melodyButton) {
            melodyButton.disabled = disabled;
            melodyButton.textContent = disabled ? '🎼 Идет воспроизведение...' : '🎼 Проиграть всю мелодию';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MelodyPlayer();
});
