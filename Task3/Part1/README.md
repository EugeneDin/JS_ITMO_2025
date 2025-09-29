# Задание

Создание небольшого проекта со сборкой на основе webpack

1. Создайте новую папку и перейдите в нее в терминале
2. Инициализируйте в этой папке проект командой npm init -y
3. Установите зависимость moment командой npm i moment
4. Установите девелоперские зависимости сборки командой npm i -D webpack webpack-cli serve
5. Входная точка - веб-страница с подключенным исходным сценарием
   назовем ее index.html
   в этот файл пока что поместим лишь две строки `<h1 id="hh"></h1> <script src="./src/index.js"></script>`
6. Создадим папку src и в ней создадим исходный сценарий в файле index.js
   поместим в него лишь две строки
   `const moment = require('moment');
   hh.textContent = moment().format('DD.MM.YYYY HH:mm:ss');`
7. Команда npx webpack
   asset main.js 295 KiB [emitted] [minimized] [big] (name: main) 1 related asset
   файл сборки появился в папке dist и называется main.js
8. Чуть-чуть исправим файл index.html
   там вместо src надо написать dist
   и вместо index написать main
9. Для открытия получившейся страницы выполните команду npx serve
   │   - Local:    http://localhost:3000       │

## Решение

1. Создаём папку [webpack-moment](./webpack-moment/) при помощи команды:

```bash
mkdir webpack-moment
```

Далее следуем в эту папку:

```bash
cd webpack-task
```

2. Находясь в этой папке инициализируем проект при помощи команды:

```bash
npm init -y
```

3. Устанавливаем зависимость moment при помощи команды:

```bash
npm i moment
```

4. Устанавливаем dev-зависимости сборки при помощи команды:

```bash
npm i -D webpack webpack-cli serve
```

5. Создаём в папке файл index.html:

```html
<h1 id="hh"></h1>
<script src="./src/index.js"></script>
```

6. Создаём папку src и в ней файл index.js:

```js
const moment = require('moment');
hh.textContent = moment().format('DD.MM.YYYY HH:mm:ss');
```

7. Запускаем сборку:

```bash
npx webpack
```

После отработки команды в папке проекта создалась папка **dist**  с файлом main.js.

```bash
webpack 5.101.3 compiled with 3 warnings in 4531 ms
```

8. Исправляем файл index.html:

```html
<h1 id="hh"></h1>
<script src="./dist/main.js"></script>
```

9. Пересобираем прокт:

```bash
npx webpack
```

10. Запускаем проект, при помощи команды:

```bash
npx serve
```

Появится:

```bash
evgeny@evgeny-sdl:~/node_project/webpack-moment$ npx serve

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

Переходим по ссылке [http://localhost:3000](http://localhost:3000)

В результате открылся браузер и показал текущую дату и время.
