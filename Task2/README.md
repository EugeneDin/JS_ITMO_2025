# Задача

Изучите библиотеку для бенчмаркинга mitata
и создайте сценарий который доказывает что функция hash встроенного модуля node:crypto работает быстрее чем функция createHash из того же модуля

## Решение

Целью эксперимента является эмпирическое подтверждение гипотезы о том, что новый встроенный метод `crypto.hash()` обеспечивает более высокую производительность за счёт оптимизированной реализации и отсутствия промежуточных объектов. Результаты бенчмарка послужат основой для анализа эволюции API криптографических функций в Node.js и практического применения наиболее эффективных решений в реальных проектах.

## Проверка

Инициализируем проект в [папке](./benchmark_test/) при помощи команды:

```bash
npm init -y
```

Устанавливаем библиотеку **mitata** в проект:

```bash
npm install -D mitata
```

Создаём в папке проекта файл - [benchmark.mjs](./benchmark_test/benchmark.mjs)

```js
import { hash, createHash } from 'node:crypto';
import { run, bench, group } from 'mitata';

// Тестовые данные
const testData = 'Hello, World! This is a test string for hashing benchmark.';

group('Hash Functions Benchmark', () => {
  // Бенчмарк для hash()
  bench('crypto.hash()', () => {
    hash('sha256', testData);
  });

  // Бенчмарк для createHash()
  bench('crypto.createHash()', () => {
    const hashInstance = createHash('sha256');
    hashInstance.update(testData);
    hashInstance.digest('hex');
  });

  // Бенчмарк для оптимизированного createHash
  bench('crypto.createHash() one-liner', () => {
    createHash('sha256').update(testData).digest('hex');
  });
});

// Тестирование разных алгоритмов
group('Different Hash Algorithms', () => {
  const algorithms = ['sha1', 'sha256', 'md5'];
  
  algorithms.forEach(algorithm => {
    bench(`hash(${algorithm})`, () => {
      hash(algorithm, testData);
    });

    bench(`createHash(${algorithm})`, () => {
      createHash(algorithm).update(testData).digest('hex');
    });
  });
});

console.log('Starting benchmark: hash() vs createHash()');
console.log('Expected result: hash() should be faster\n');

run();
```

Запускаем нашу программу, при помощи команды:

```bash
node benchmark.mjs
```

Выводим результат работы программы:

```bash
ergeny@evgeny-sdl:~/benchmark_test$ node benchmark.mjs
Starting benchmark: hash() vs createHash()
Expected result: hash() should be faster

clk: ~1.67 GHz
cpu: AMD Ryzen 5 5600
runtime: node 22.20.0 (x64-linux)

benchmark                    avg (min … max) p75 / p99    (min … top 1%)
-------------------------------------------- -------------------------------
• Hash Functions Benchmark
-------------------------------------------- -------------------------------
crypto.hash()                 615.92 ns/iter 631.18 ns  █▃                  
                     (563.79 ns … 875.06 ns) 836.55 ns ▆██                  
                     (  9.83  b … 334.08  b) 105.04  b █████▄▆▃▃▄▂▂▂▂▂▂▁▁▁▂▂

crypto.createHash()             1.66 µs/iter   1.22 µs  █                   
                        (1.06 µs … 11.13 ms)   3.69 µs  █                   
                     (128.00  b … 770.25 kb) 319.67  b ▃█▃▃▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

crypto.createHash() one-liner   1.28 µs/iter   1.08 µs █                    
                       (954.95 ns … 7.70 µs)   7.18 µs █                    
                     ( 44.90  b … 421.48  b) 223.90  b █▅▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

• Different Hash Algorithms
-------------------------------------------- -------------------------------
hash(sha1)                    604.34 ns/iter 607.91 ns  █                   
                       (565.63 ns … 1.15 µs) 840.52 ns ▃█                   
                     ( 80.02  b … 229.17  b)  80.77  b ███▄▄▂▂▂▁▂▂▂▁▁▁▁▁▁▁▁▁

createHash(sha1)                1.30 µs/iter   1.01 µs █                    
                       (915.85 ns … 8.70 µs)   8.37 µs █                    
                     ( 23.38  b … 368.44  b) 199.97  b █▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

hash(sha256)                  623.05 ns/iter 621.83 ns  █                   
                     (580.18 ns … 965.27 ns) 866.68 ns  █▅                  
                     ( 12.57  b … 269.96  b) 104.00  b ▆██▃▃▄▂▂▂▂▁▂▁▁▁▁▁▁▁▁▁

createHash(sha256)              1.27 µs/iter   1.04 µs █                    
                       (948.79 ns … 7.21 µs)   6.63 µs █                    
                     ( 47.26  b … 392.44  b) 223.97  b █▄▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

hash(md5)                     713.57 ns/iter 705.39 ns  █                   
                       (666.71 ns … 1.01 µs) 992.87 ns  █▇                  
                     ( 72.02  b … 301.19  b)  73.04  b ███▅▄▂▂▁▂▁▂▂▂▂▁▁▁▁▂▁▁

createHash(md5)                 1.31 µs/iter   1.10 µs █                    
                         (1.02 µs … 9.14 µs)   8.25 µs █                    
                     (192.03  b … 377.38  b) 193.68  b █▄▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁


```

## Анализ результатов

### Скорость выполнения

- `crypto.hash()`: ~615 нс/итерация (sha256);

- `crypto.createHash()`: ~1.66 мкс/итерация (sha256);

**Вывод**: `crypto.hash()` работает примерно **в 2.7 раза быстрее** чем `crypto.createHash()`.

### **Производительность по алгоритмам**

Все алгоритмы показывают одинаковую тенденцию:

| Алгоритм | hash() | createHash() | Ускорение |
| -------- | ------ | ------------ | --------- |
| sha1     | 604 нс | 1.30 мкс     | 2.15x     |
| sha256   | 623 нс | 1.27 мкс     | 2.04x     |
| md5      | 714 нс | 1.31 мкс     | 1.83x     |

### **Оптимизация createHash()**

- `createHash() one-liner`: 1.28 мкс;

- `createHash()` стандартный: 1.66 мкс;

**Вывод**: Цепочка вызовов (`one-liner`) немного быстрее стандартного подхода.

## Вывод

Бенчмарк четко демонстрирует, что `crypto.hash()` работает значительно быстрее `crypto.createHash()` - в среднем в 2-2.7 раза для различных алгоритмов хеширования.

Это подтверждает исходную гипотезу о том, что оптимизированная синхронная функция `hash()` обеспечивает лучшую производительность по сравнению с традиционным объектно-ориентированным подходом `createHash()`.
