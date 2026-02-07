let authToken = '';

function byId(id) {
  return document.getElementById(id);
}

function setStatus(id, kind, data) {
  const el = byId(id);
  el.className = `status ${kind}`;
  el.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

async function getConfig() {
  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error('Failed to load runtime config');
  }

  return response.json();
}

async function authRequest(config, path, options = {}) {
  const response = await fetch(`${config.authBaseUrl}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }

  return body;
}

async function signUpEmail(config, data) {
  return authRequest(config, '/api/auth/sign-up/email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function signInEmail(config, data) {
  return authRequest(config, '/api/auth/sign-in/email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function signInGoogle(config) {
  return authRequest(config, '/api/auth/sign-in/social', {
    method: 'POST',
    body: JSON.stringify({
      provider: 'google',
      callbackURL: `${window.location.origin}/auth/callback`,
    }),
  });
}

async function getSession(config) {
  return authRequest(config, '/api/auth/get-session', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
}

async function getApiToken(config) {
  const body = await authRequest(config, '/api/auth/token', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });

  authToken = body.token ?? '';
  return body;
}

async function signOut(config) {
  const body = await authRequest(config, '/api/auth/sign-out', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  authToken = '';
  return body;
}

async function createNote(config, title) {
  if (!authToken) {
    throw new Error('No access token. Click "Get API token" first.');
  }

  const response = await fetch(`${config.apiBaseUrl}/api/v1/notes`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ title }),
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }

  return body;
}

async function main() {
  const config = await getConfig();

  byId('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('signup-status', 'warn', 'working...');

    try {
      const body = await signUpEmail(config, {
        name: byId('signup-name').value,
        email: byId('signup-email').value,
        password: byId('signup-password').value,
      });
      setStatus('signup-status', 'ok', body);
    } catch (error) {
      setStatus('signup-status', 'err', String(error));
    }
  });

  byId('signin-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('signin-status', 'warn', 'working...');

    try {
      const body = await signInEmail(config, {
        email: byId('signin-email').value,
        password: byId('signin-password').value,
      });
      setStatus('signin-status', 'ok', body);
    } catch (error) {
      setStatus('signin-status', 'err', String(error));
    }
  });

  byId('google-button').addEventListener('click', async () => {
    setStatus('google-status', 'warn', 'requesting redirect URL...');

    try {
      const body = await signInGoogle(config);
      setStatus('google-status', 'ok', body);
      if (body.url) {
        window.location.href = body.url;
      }
    } catch (error) {
      setStatus('google-status', 'err', String(error));
    }
  });

  byId('session-button').addEventListener('click', async () => {
    setStatus('token-status', 'warn', 'reading session...');

    try {
      const body = await getSession(config);
      setStatus('token-status', 'ok', body);
    } catch (error) {
      setStatus('token-status', 'err', String(error));
    }
  });

  byId('token-button').addEventListener('click', async () => {
    setStatus('token-status', 'warn', 'minting JWT...');

    try {
      const body = await getApiToken(config);
      setStatus('token-status', 'ok', {
        token: body.token,
        tokenLength: body.token?.length ?? 0,
      });
    } catch (error) {
      setStatus('token-status', 'err', String(error));
    }
  });

  byId('logout-button').addEventListener('click', async () => {
    setStatus('token-status', 'warn', 'signing out...');

    try {
      const body = await signOut(config);
      setStatus('token-status', 'ok', body);
    } catch (error) {
      setStatus('token-status', 'err', String(error));
    }
  });

  byId('note-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('api-status', 'warn', 'calling API...');

    try {
      const body = await createNote(config, byId('note-title').value);
      setStatus('api-status', 'ok', body);
    } catch (error) {
      setStatus('api-status', 'err', String(error));
    }
  });
}

main().catch((error) => {
  setStatus('api-status', 'err', `fatal: ${String(error)}`);
});
