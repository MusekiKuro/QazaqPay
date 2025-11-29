const API_BASE = 'http://192.168.0.104:3000/api';
let jwtToken = null;

function setToken(token) {
  jwtToken = token;
  localStorage.setItem('jwtToken', token);
}

function getToken() {
  if (jwtToken) return jwtToken;
  jwtToken = localStorage.getItem('jwtToken');
  return jwtToken;
}

// ---------- АВТОРИЗАЦИЯ ----------

async function handleLogin(e) {
  e.preventDefault && e.preventDefault();
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const json = await res.json();

    if (!json.success) {
      alert(json.error?.message || 'Ошибка логина');
      return;
    }

    if (json.data.requiresMFA) {
      document.getElementById('mfaSection').style.display = 'block';
    } else {
      setToken(json.data.token);
      window.location.href = 'main.html';
    }
  } catch (err) {
    alert('Сервер недоступен');
  }
}

async function handleMfa(e) {
  e.preventDefault && e.preventDefault();
  const phone = document.getElementById('phone').value;
  const code = document.getElementById('mfaCode').value;

  try {
    const res = await fetch(`${API_BASE}/auth/mfa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });
    const json = await res.json();

    if (!json.success) {
      alert(json.error?.message || 'Ошибка MFA');
      return;
    }

    setToken(json.data.token);
    window.location.href = 'main.html';
  } catch (err) {
    alert('Сервер недоступен');
  }
}

// ---------- ГЛАВНЫЙ ЭКРАН (СЧЕТА) ----------

async function loadAccounts() {
  const token = getToken();
  // Если токена нет, отправляем на вход
  if (!token) {
    if (!window.location.href.includes('vhod.html')) {
        window.location.href = 'vhod.html';
    }
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/accounts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();

    if (!json.success) {
      alert('Ошибка загрузки счетов');
      return;
    }

    const list = document.getElementById('accountsList');
    if (!list) return;

    list.innerHTML = '';
    json.data.forEach(acc => {
      const item = document.createElement('div');
      // Возвращаем красивые стили из макета (bg-zinc-100, rounded-xl и т.д.)
      // shrink-0 нужен, чтобы карточки не сжимались в карусели
      item.className = 'flex h-full w-60 flex-1 flex-col gap-3 rounded-xl bg-zinc-100 dark:bg-[#193324] p-4 shrink-0';
      
      // Картинка: если доллары - синяя, если тенге - золотая (пример логики)
      const bgImage = acc.currency === 'USD' 
        ? 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKSBxoWTzHma96f-aACTa_PLzL1LLBUfg5ST2Y4pKCCzJIm_wWPNvCMck2F3mGceIpuT2V0NR8VJpSrG1xWb1Lho3EYltqzsE5xBS3EitDlPjt7CTfwULVIs1iTMBb4CrFdv5AXEiANBRE7Nm8wSENF5uEPl_Js-uzagJsqMDeNwNi4jFV6lqGxsId6UzM17txpwsqkCrMm4tTcOplB34_XnyH2-TwF0AZ6MT-QzaF--BOXtUGDdIH9yuE-4reqN1yyXBhNoCJ6cQ")' 
        : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqk8FL8aSgebOiGhFua4gUnt3J1fFerTihivTW0uJSbKHscaAlkX1IfsEWnqOwNdMJTucwip7w6dKm5UFjcctGjx2UxCNBacw2416xa3xZxTB9ymVBg22JCCGwHSTniufBNsBf1rVRYulWR8XSNBYGDUQKRr8YWSsxJ-cPuHl_Nqb7t8LREY-_Pd3-boNJd62OudfFK-EJRxgKRX0tOOiqADpxp-uKQqoQCJ4EzAhoKrtMdRCwaj9YIWe161EFLJieAh447iRll2k")';

      item.innerHTML = `
        <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col" style='background-image: ${bgImage};'></div>
        <div>
            <p class="text-zinc-900 dark:text-white text-base font-medium leading-normal">
                ${acc.type === 'card' ? 'Qazaq Gold' : 'Депозит'} • ${acc.currency}
            </p>
            <p class="text-zinc-600 dark:text-[#92c9a9] text-2xl font-bold leading-normal tracking-tight">
                ${acc.balance.toLocaleString()} ₸
            </p>
            <p class="text-zinc-500 dark:text-gray-400 text-xs mt-1">
                ${acc.maskedCard || 'Сберегательный счёт'}
            </p>
        </div>
      `;
      list.appendChild(item);
    });
  } catch (err) {
    console.error(err);
    // alert('Ошибка подключения к серверу'); // Можно закомментировать, чтобы не спамило
  }
}

// ---------- ПЕРЕВОДЫ ----------

async function handleTransfer(e) {
  e.preventDefault && e.preventDefault();
  const token = getToken();
  if (!token) {
    window.location.href = 'vhod.html';
    return;
  }

  // пока жёстко: переводим с acc_1
  const fromAccountId = 'acc_1';
  const toAccountId = document.getElementById('toAccountId').value;
  const amount = Number(document.getElementById('amount').value);
  const description = document.getElementById('description').value;

  if (!toAccountId || !amount) {
    alert('Заполните поле Куда и Сумма');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ fromAccountId, toAccountId, amount, description })
    });
    const json = await res.json();

    if (!json.success) {
      alert(json.error?.message || 'Ошибка перевода');
      return;
    }

    alert('Перевод успешно выполнен');
  } catch (err) {
    alert('Ошибка подключения к серверу');
  }
}

// ---------- ИНИЦИАЛИЗАЦИЯ НА КАЖДОЙ СТРАНИЦЕ ----------

document.addEventListener('DOMContentLoaded', () => {
  // vhod.html
  const loginBtn = document.getElementById('loginBtn');
  const mfaBtn = document.getElementById('mfaBtn');
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  if (mfaBtn) mfaBtn.addEventListener('click', handleMfa);

  // main.html
  if (document.getElementById('accountsList')) {
    loadAccounts();
  }

  // perevod.html
  const transferBtn = document.getElementById('transferBtn');
  if (transferBtn) transferBtn.addEventListener('click', handleTransfer);
});
