# Задача

Проанализировать документацию по интерфейсу Web Audio на странице https://developer.mozilla.org/en-US/docs/Web/API

Используя AudioContext из WebAudio API осуществите проигрывание первых 7 нот либо песни Город над вольной Невой или любой другой мелодии из примерно десятка нот, из своего плей-листа предыдущего задания.

При это должна быть возможность каждой кнопкой проиграть отдельную ноту либо все вместе.

## Решение

1. Создаём папку [webpack-music](./webpack-music/):

```bash
mkdir webpack-music
```

И переходим в неё:

```bash
cd webpack-music
```

2. Инициализируем проект в этой папке:

```bash
npm init -y
```

3. Устанавливаем зависимости в этой папке:

```bash
npm i -D webpack webpack-cli serve
```

Создаём папку исходников src в этой же папке:

```bash
mkdir -p src
```

Создаём файл **webpack.config.js** в корне проекта. Содержание:

```js
// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/script.js',           // точка входа
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
```

Создаём файл **index.html** в корне проекта с содержанием:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Audio Player</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .controls {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        .note-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        button {
            padding: 15px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        button:active {
            transform: translateY(0);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .note-btn {
            background: #4CAF50;
            color: white;
        }
        .melody-btn {
            background: #2196F3;
            color: white;
            grid-column: 1 / -1;
            padding: 20px;
            font-size: 18px;
            font-weight: bold;
        }
        .status {
            text-align: center;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 5px;
            margin-top: 20px;
            min-height: 20px;
        }
        .note-info {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .note-item {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #2196F3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 Web Audio Player🎵</h1>

        <div class="controls">
            <div class="note-buttons">
                <button class="note-btn" data-note="C#">До♯ (C♯) 🎵</button>
                <button class="note-btn" data-note="F#">Фа♯ (F♯) 🎵</button>
                <button class="note-btn" data-note="G#">Соль♯ (G♯) 🎵</button>
                <button class="note-btn" data-note="A">Ля (A) 🎵</button>
            </div>

            <div class="note-info">
                <div class="note-item"><strong>Новая мелодия:</strong></div>
                <div class="note-item">До♯ (шестнадцатая)</div>
                <div class="note-item">Фа♯ (шестнадцатая)</div>
                <div class="note-item">Соль♯ (шестнадцатая)</div>
                <div class="note-item">Ля (четверть с точкой)</div>
                <div class="note-item">Соль♯ (четверть с точкой)</div>
                <div class="note-item">Фа♯ (четверть с точкой)</div>
                <div class="note-item">До♯ (шестнадцатая)</div>
            </div>
        </div>

        <button class="melody-btn" id="playMelody">🎼 Проиграть всю мелодию</button>

        <div class="status" id="status">Готов к воспроизведению</div>
    </div>

  <script src="./dist/main.js"></script>
</body>
</html>

status" id="status">Готов к воспроизведению</div>
    </div>

    <script src="bundle.js"></script>
</body>
</html>
```

Далее в папке **src** создаём файл **script.js** с таким содержанием:

```js
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
ние...' : '🎼 Проиграть всю мелодию';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MelodyPlayer();
});
```

Собираем проект:

```bash
npx webpack
```

```bash
asset main.js 3.16 KiB [emitted] [minimized] (name: main)
./src/script.js 6.84 KiB [built] [code generated]
webpack 5.101.3 compiled successfully in 234 ms
```

И запускаем проект:

```bash
npx serve
```

Вывод:

```bash
evgeny@evgeny-sdl:~/webpack-music$ npx serve

   ┌────────────────────────────────────────┐
   │                                        │
   │   Serving!                             │
   │                                        │
   │   - Local:    http://localhost:3000    │
   │   - Network:  http://10.0.1.12:3000    │
   │                                        │
   │   Copied local address to clipboard!   │
   │                                        │
   └────────────────────────────────────────┘
```

Переходим по адресу: http://localhost:3000

И тестируем проект.

## Результат

Мелодия "Blue Bird - Naruto Shippuden" воспроизводилась без ошибок. Отдельные ноты тоже верно проигрались. Добавил блокировку действие при воспроизведении мелодии, чтобы избежать наложение.
