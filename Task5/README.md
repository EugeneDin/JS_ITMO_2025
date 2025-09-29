# Задание

Добавить потомка к потомку и проверить порядок возникновения событий при различных комбинация параметра добавления события отвечающего за фазу: 

- false false;

- false true;

- true false;

- true true;

## Решение

```html
<!DOCTYPE html>
<html>
<head>
    <title>Event Phases Test</title>
    <meta charset="utf-8">
    <style>
        #container { margin: 20px; padding: 10px; border: 1px solid #ccc; }
        #parent { padding: 15px; margin: 10px; background: #e0e0e0; }
        #child { padding: 10px; margin: 5px; background: #c0c0c0; }
        #grandchild { padding: 5px; margin: 2px; background: #a0a0a0; cursor: pointer; }
        .log { margin: 10px; padding: 5px; border: 1px solid #999; min-height: 100px; }
        button { margin: 5px; }
    </style>
</head>
<body>
  <h1 align="center">Нажимайте на Grandchild</h1>
    <div id="container">
        <div id="parent">
            Parent
            <div id="child">
                Child
                <!-- Grandchild будет добавлен скриптом -->
            </div>
        </div>

        <div class="log" id="log1"><strong>Комбинация 1 (false false):</strong><br></div>
        <div class="log" id="log2"><strong>Комбинация 2 (false true):</strong><br></div>
        <div class="log" id="log3"><strong>Комбинация 3 (true false):</strong><br></div>
        <div class="log" id="log4"><strong>Комбинация 4 (true true):</strong><br></div>

        <button onclick="clearLogs()">Очистить логи</button>
    </div>

    <script>
        const parent = document.getElementById('parent');
        const child = document.getElementById('child');

        // Добавляем нового потомка
        const grandchild = document.createElement('div');
        grandchild.id = 'grandchild';
        grandchild.textContent = 'Grandchild';
        child.appendChild(grandchild);

        function addLog(combo, message) {
            const log = document.getElementById('log' + combo);
            log.innerHTML += message + '<br>';
        }

        function clearLogs() {
            for (let i = 1; i <= 4; i++) {
                const log = document.getElementById('log' + i);
                log.innerHTML = '<strong>Комбинация ' + i + ':</strong><br>';
            }
        }

        // Комбинация 1: false false
        parent.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(1, 'Parent - bubbling');
        }, false);
        child.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(1, 'Child - bubbling');
        }, false);
        grandchild.addEventListener('click', () => addLog(1, 'Grandchild - bubbling'), false);

        // Комбинация 2: false true
        parent.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(2, 'Parent - bubbling');
        }, false);
        child.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(2, 'Child - capturing');
        }, true);
        grandchild.addEventListener('click', () => addLog(2, 'Grandchild - bubbling'), false);

        // Комбинация 3: true false
        parent.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(3, 'Parent - capturing');
        }, true);
        child.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(3, 'Child - bubbling');
        }, false);
        grandchild.addEventListener('click', () => addLog(3, 'Grandchild - bubbling'), false);

        // Комбинация 4: true true
        parent.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(4, 'Parent - capturing');
        }, true);
        child.addEventListener('click', (e) => {
            if (e.target === grandchild) addLog(4, 'Child - capturing');
        }, true);
        grandchild.addEventListener('click', () => addLog(4, 'Grandchild - bubbling'), false);
    </script>
</body>
</html>bubbling'), false);
    </script>
</body>
</html>), false);
    </script>
</body>
</html>
```

## Ссылка для редактирования

https://kodaktor.ru/?!=93e66b9

## Ссылка для демонстрации

https://kodaktor.ru/g/93e66b9
