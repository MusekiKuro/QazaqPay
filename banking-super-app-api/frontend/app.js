const API_BASE = 'http://localhost:3000/api';
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
  e.preventDefault();
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
  e.preventDefault();
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
  if (!token) {
    window.location.href = 'vhod.html';
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
      item.className = 'account-card';
      item.innerHTML = `
        <div class="acc-title">${acc.type} • ${acc.currency}</div>
        <div class="acc-balance"><strong>${acc.balance}</strong></div>
        <div class="acc-mask">${acc.maskedCard || ''}</div>
      `;
      list.appendChild(item);
    });
  } catch (err) {
    alert('Ошибка подключения к серверу');
  }
}

// ---------- ПЕРЕВОДЫ ----------

async function handleTransfer(e) {
  e.preventDefault();
  const token = getToken();
  if (!token) {
    window.location.href = 'vhod.html';
    return;
  }

  const fromAccountId = document.getElementById('fromAccountId').value;
  const toAccountId = document.getElementById('toAccountId').value;
  const amount = Number(document.getElementById('amount').value);
  const description = document.getElementById('description').value;

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
