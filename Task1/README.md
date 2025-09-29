# Задача

Напишите адрес клиентского приложения, которое нативным образом обрабатывает  адрес вида https://abc.def/?A=55,33,44&B=21,32,43  где через запятую передаются два ряда целых чисел в качестве значений параметров A и B) и отдаёт значение коэффициента корреляции Пирсона для этих двух рядов данных. Приложение должно вычислить ответ вида 0.xyz (три знака после точки без округления, простое отсечение остальных цифр) либо 1 (модуль, без знака) и поместить результат в заголовок окна. В заголовке h4 должен быть ваш логин в этой системе без пробелов и новых строк. Пожалуйста напишите адрес до знака вопроса (например https://kodaktor.ru/g/0946c74) и НЕ используйте в коде console, а также свойство searchParams (в наилучшем варианте используйте для извлечения значений параметров из URL только встроенные в JS методы строк и массивов), можно использовать URLSearchParams(location.search). Также просьба избегать имён переменных, совпадающих с встроенными API браузера (например URL)

#### Ссылка для выполнения:

[Проверка задания](https://node-server.online/a?id=XXXXXXX#y%7C95)

## Решение

Мой код решения задачи:

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
    <h4>c637fcb</h4>
    <script>
        // Получаем строку запроса из URL
        const queryString = window.location.search.substring(1);
        
        // Разбиваем на пары параметров
        const params = {};
        if (queryString) {
            const pairs = queryString.split('&');
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i].split('=');
                if (pair.length === 2) {
                    params[pair[0]] = pair[1];
                }
            }
        }

        // Извлекаем и парсим значения A и B
        const aStr = params['A'];
        const bStr = params['B'];

        if (!aStr || !bStr) {
            document.title = '0.000';
        } else {
            const aValues = aStr.split(',').map(Number);
            const bValues = bStr.split(',').map(Number);

            if (aValues.length !== bValues.length || aValues.length === 0) {
                document.title = '0.000';
            } else {
                const n = aValues.length;

                // Суммы
                let sumA = 0, sumB = 0;
                for (let i = 0; i < n; i++) {
                    sumA += aValues[i];
                    sumB += bValues[i];
                }

                // Средние
                const meanA = sumA / n;
                const meanB = sumB / n;

                // Числитель и знаменатели для коэффициента корреляции Пирсона
                let numerator = 0;
                let sumSqA = 0;
                let sumSqB = 0;

                for (let i = 0; i < n; i++) {
                    const diffA = aValues[i] - meanA;
                    const diffB = bValues[i] - meanB;
                    numerator += diffA * diffB;
                    sumSqA += diffA * diffA;
                    sumSqB += diffB * diffB;
                }

                let correlation = 0;
                if (sumSqA > 0 && sumSqB > 0) {
                    correlation = numerator / Math.sqrt(sumSqA * sumSqB);
                }

                // Берём модуль
                correlation = Math.abs(correlation);

                // Ограничиваем диапазон [0, 1]
                if (correlation > 1) correlation = 1;
                if (correlation < 0) correlation = 0;

                // Форматируем до трёх знаков без округления
                if (correlation === 1) {
                    document.title = '1';
                } else {
                    const str = correlation.toString();
                    const dotIndex = str.indexOf('.');
                    if (dotIndex === -1) {
                        document.title = '0.000';
                    } else {
                        let result = str.substring(0, dotIndex + 4);
                        // Дополняем нулями, если нужно
                        while (result.length < dotIndex + 4) {
                            result += '0';
                        }
                        document.title = result;
                    }
                }
            }
        }
    </script>
</body>
</html>
```

### Ссылка в Кодактор:

[Kodaktor](https://kodaktor.ru/?!=c637fcb)

### Ссылка для демонстрации и системы проверки:

https://kodaktor.ru/g/c637fcb
