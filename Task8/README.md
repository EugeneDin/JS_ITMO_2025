# Задание

https://kodaktor.ru/29032025.pem

Вы получили публичный ключ 29032025.pem. Зашифруйте этим ключом ваш номер в ИСУ  командой pkeyutl (или rsautl) включив параметр оптимального асимметричного шифрования с дополнением. Затем с помощью bash-команды base64 или другим удобным способом закодируйте полученное бинарное содержимое. Вставьте в поле «Здесь ваше решение» результат без кавычек.

Адрес для проверки - https://node-server.online/a?id=xxxxxx#y|80

## Решение

```html
<!doctype html>
<meta charset="utf-8" />
<title>RSA-OAEP (SHA-1) — PEM → base64</title>
<style>
  :root{
    --bg:#ffffff; --card:#f8fafc; --ink:#0f172a; --muted:#475569;
    --accent:#16a34a; --warn:#b91c1c; --hair:#e2e8f0; --radius:12px;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0; padding:2rem 1rem; color:var(--ink); background:var(--bg);
    font:16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  }
  main{max-width:820px; margin:0 auto;}
  h1{font-size:1.35rem; margin:0 0 .75rem}
  .card{background:var(--card); border:1px solid var(--hair); border-radius:var(--radius); padding:1rem; margin:1rem 0;}
  .row{display:flex; gap:.75rem; align-items:center; flex-wrap:wrap}
  .stack{display:grid; gap:.5rem}
  label{display:inline-flex; align-items:center; gap:.5rem}
  input[type="text"]{
    background:#fff; color:var(--ink); border:1px solid var(--hair);
    padding:.55rem .7rem; border-radius:10px; width:260px;
  }
  input[type="file"]{appearance:none; border:none; background:none; color:var(--ink);}
  .btn{
    border:1px solid var(--hair); background:#fff; color:var(--ink);
    padding:.6rem 1rem; border-radius:10px; cursor:pointer;
  }
  .hint{color:var(--muted); font-size:.9rem}
  .out{
    white-space:pre-wrap; word-break:break-all; background:#fff;
    border:1px dashed var(--hair); padding:.85rem; border-radius:var(--radius);
  }
  .ok{color:var(--accent)}
  .err{color:var(--warn)}
  hr{border:0; border-top:1px solid var(--hair); margin:1rem 0}
</style>

<main>
  <h1 align="center">RSA-OAEP шифрование</h1>

  <section class="card">
    <div class="stack">
      <div class="row">
        <label>
          <strong>Публичный ключ (.pem):</strong>
          <input id="pemFile" type="file" accept=".pem,.txt,.pub" />
        </label>
        <span id="fileMeta" class="hint"></span>
      </div>
      <div class="row">
        <label>
          Сообщение:
          <input id="plain" type="text" value="287512" />
        </label>
        <!-- кнопка всегда активна -->
        <button id="encrypt" class="btn">Зашифровать (RSA-OAEP, SHA-1)</button>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="stack">
      <div class="row" style="justify-content:space-between">
        <strong>Результат (base64)</strong>
      </div>
      <div id="out" class="out" aria-live="polite"></div>
      <div id="err" class="hint"></div>
    </div>
  </section>
</main>

<script>
  const pemInput  = document.getElementById('pemFile');
  const fileMeta  = document.getElementById('fileMeta');
  const encryptBt = document.getElementById('encrypt');
  const msgInput  = document.getElementById('plain');
  const outBox    = document.getElementById('out');
  const errBox    = document.getElementById('err');
  const statusEl  = document.getElementById('status');

  let publicKey = null;   // CryptoKey
  let pemRaw    = '';     // исходный PEM

  // показ ошибок/сброс
  function showError(err){
    const msg = (err && err.message) ? err.message : String(err);
    errBox.className = 'err';
    errBox.textContent = 'Ошибка: ' + msg;
  }
  function resetBoxes(){
    outBox.textContent = '';
    errBox.textContent = '';
    errBox.className   = 'hint';
  }

  // чтение и импорт
  function readAsText(file){
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload  = () => resolve(String(r.result));
      r.onerror = () => reject(new Error('Не удалось прочитать файл'));
      r.readAsText(file);
    });
  }
  function assertPem(pem){
    if (!/-----BEGIN PUBLIC KEY-----/.test(pem) || !/-----END PUBLIC KEY-----/.test(pem)){
      throw new Error('Нужен публичный ключ в формате PEM (BEGIN/END PUBLIC KEY).');
    }
  }
  function pemBodyToArrayBuffer(pem){
    const b64 = pem
      .replace(/-----BEGIN PUBLIC KEY-----/g,'')
      .replace(/-----END PUBLIC KEY-----/g,'')
      .replace(/\s+/g,'');
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }
  async function importSpkiFromPem(pem){
    const spki = pemBodyToArrayBuffer(pem);
    // более совместимый вариант: объект с name
    return crypto.subtle.importKey(
      'spki',
      spki,
      { name: 'RSA-OAEP', hash: { name: 'SHA-1' } },
      false,
      ['encrypt']
    );
  }

  // обработчики
  pemInput.addEventListener('change', async () => {
    resetBoxes();
    publicKey = null;
    pemRaw = '';

    const f = pemInput.files && pemInput.files[0];
    if (!f) { fileMeta.textContent = ''; statusEl.textContent = 'Ожидание ключа…'; return; }

    fileMeta.textContent = `${f.name} • ${f.size} байт`;
    try {
      pemRaw   = await readAsText(f);
      assertPem(pemRaw);
      publicKey = await importSpkiFromPem(pemRaw);
      statusEl.innerHTML = `<span class="ok">Ключ импортирован ✓</span>`;
    } catch (e) {
      showError(e);
      statusEl.textContent = 'Ошибка импорта ключа';
    }
  });

  encryptBt.addEventListener('click', async () => {
    resetBoxes();
    statusEl.textContent = 'Шифрование…';

    try {
      // если ключ ещё не импортирован, но файл выбран — импортнём на лету
      if (!publicKey) {
        const f = pemInput.files && pemInput.files[0];
        if (!f) throw new Error('Выберите PEM-файл публичного ключа.');
        pemRaw = await readAsText(f);
        assertPem(pemRaw);
        publicKey = await importSpkiFromPem(pemRaw);
      }

      const msg = msgInput.value ?? '';
      const pt  = new TextEncoder().encode(msg);
      const ct  = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, pt);
      outBox.textContent = abToBase64(ct);
      statusEl.innerHTML = `<span class="ok">Готово ✓</span>`;
    } catch (e) {
      showError(e);
      statusEl.textContent = 'Ошибка при шифровании';
    }
  });

  function abToBase64(buf){
    const bytes = new Uint8Array(buf);
    let s = '';
    for (let i=0;i<bytes.length;i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
</script>



```

### Ссылка для редактирования

https://kodaktor.ru/?!=897ac4f

### Ссылка для тестирования

https://kodaktor.ru/g/897ac4f

Результат был записан в журнал 
