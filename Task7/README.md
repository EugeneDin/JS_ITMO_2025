# Задание

Отошлите на проверку адрес клиентского приложения (веб-страницы), которое нативным JS обрабатывает адрес вида https://abc.def/ghi?123456, т.е. в конце адреса находится вопросительный знак и за ним число. Приложение должно вычислить, сколько простых чисел располагается между числом 2 и этим числом N включительно т.е. [2, N] и вывести результат в заголовок окна. В заголовке h4 должен быть ваш номер  в ИСУ. Пожалуйста напишите адрес до знака вопроса (например https://kodaktor.ru/g/0946c74) и НЕ используйте в коде console, а также URL
Адрес проверки https://node-server.online/a?id=xxx#y|74
замените иксы на свой номер в ИСУ

## Решение



```html
<!DOCTYPE html>
<html>
<head>
    <title>Простые числа</title>
</head>
<body>
    <h4>369781</h4>
    
    <script>
        window.onload = function() {
            const url = window.location.href;
            const questionMarkIndex = url.lastIndexOf('?');
            
            if (questionMarkIndex !== -1) {
                const numberStr = url.substring(questionMarkIndex + 1);
                const N = parseInt(numberStr);
                
                if (!isNaN(N) && N >= 2) {
                    let primeCount = 0;
                    
                    for (let i = 2; i <= N; i++) {
                        if (isPrime(i)) {
                            primeCount++;
                        }
                    }
                    
                    document.title = primeCount.toString();
                }
            }
            
            function isPrime(num) {
                if (num < 2) return false;
                if (num === 2) return true;
                if (num % 2 === 0) return false;
                
                for (let i = 3; i * i <= num; i += 2) {
                    if (num % i === 0) {
                        return false;
                    }
                }
                return true;
            }
        };
    </script>
</body>
</html>
```

### Ссылка для редактирования:

https://kodaktor.ru/?!=fe52fac

### Ссылка для демонстрации и системы проверки задания

https://kodaktor.ru/g/fe52fac

Результат был записан в журнал.
