import { hash, createHash } from 'node:crypto';
import { run, bench, group } from 'mitata';

// Тестовые данные
const testData = 'Hello, World! This is a test string for hashing benchmark.';

group('Hash Functions Benchmark', () => {
  // Бенчмарк для hash() - синхронная функция
  bench('crypto.hash()', () => {
    hash('sha256', testData);
  });

  // Бенчмарк для createHash() - традиционный способ
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
