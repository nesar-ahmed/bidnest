export const swaggerAuthCss = `
  .swagger-ui .auth-wrapper { display: none; }
  .swagger-auth-status { display: flex; align-items: center; gap: 10px; margin-left: auto; font-family: sans-serif; }
  .swagger-auth-label { color: #fff; font-size: 13px; }
  .swagger-auth-button { border: 0; border-radius: 4px; padding: 7px 12px; font-size: 13px; font-weight: 600; cursor: pointer; background: #4990e2; color: #fff; }
  .swagger-auth-button:hover { background: #357abd; }
  .swagger-auth-button:disabled { cursor: wait; opacity: 0.65; }
  .swagger-auth-status .swagger-auth-button-ghost { background: transparent; border: 1px solid rgba(255, 255, 255, 0.55); color: #fff; }
  .swagger-auth-status .swagger-auth-button-ghost:hover { background: rgba(255, 255, 255, 0.12); }
  .swagger-auth-overlay { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0, 0, 0, 0.55); }
  .swagger-auth-modal { width: 100%; max-width: 420px; border-radius: 8px; background: #fff; color: #3b4151; padding: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35); font-family: sans-serif; }
  .swagger-auth-modal h2 { margin: 0 0 8px; font-size: 20px; }
  .swagger-auth-hint { margin: 0 0 16px; color: #666; font-size: 13px; line-height: 1.5; }
  .swagger-auth-form label { display: block; margin-bottom: 12px; font-size: 13px; font-weight: 600; }
  .swagger-auth-form input { display: block; width: 100%; margin-top: 6px; padding: 9px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
  .swagger-auth-form input:focus { outline: 2px solid #4990e2; outline-offset: 1px; border-color: transparent; }
  .swagger-auth-error { min-height: 18px; margin: 0 0 12px; color: #c62828; font-size: 13px; }
  .swagger-auth-actions { display: flex; justify-content: flex-end; gap: 8px; }
  .swagger-auth-actions .swagger-auth-button-ghost { background: transparent; border: 1px solid #ccc; color: #3b4151; }
  .swagger-auth-actions .swagger-auth-button-ghost:hover { background: #f2f2f2; }
`;

// Injected after swagger-ui-init.js. It signs in through the normal API so the
// browser receives the same httpOnly cookies the web app uses.
export const swaggerAuthScript = String.raw`
(function () {
  var base = '/api/v1/auth';
  var nativeFetch = window.fetch.bind(window);
  var currentUser = null;
  var dialog = null;
  var statusBox = null;
  var refreshInFlight = null;

  function refreshSession() {
    if (!refreshInFlight) {
      refreshInFlight = nativeFetch(base + '/refresh', { method: 'POST', credentials: 'same-origin' })
        .then(function (res) { return res.ok; })
        .catch(function () { return false; })
        .then(function (ok) {
          refreshInFlight = null;
          return ok;
        });
    }
    return refreshInFlight;
  }

  function api(path, init) {
    var options = init || {};
    options.credentials = 'same-origin';
    options.headers = Object.assign({ 'content-type': 'application/json' }, options.headers || {});

    return nativeFetch(base + path, options)
      .then(function (res) {
        return res.text().then(function (text) {
          var body = null;
          try {
            body = text ? JSON.parse(text) : null;
          } catch (e) {
            body = null;
          }
          return { ok: res.ok, status: res.status, body: body };
        });
      })
      .catch(function () {
        return { ok: false, status: 0, body: null };
      });
  }

  function loadSession() {
    return api('/me')
      .then(function (result) {
        if (result.status === 401) {
          return refreshSession().then(function (ok) {
            if (!ok) return;
            return api('/me').then(function (retry) {
              if (retry.ok && retry.body) currentUser = retry.body;
            });
          });
        }
        if (result.ok && result.body) currentUser = result.body;
      })
      .then(render);
  }

  function render() {
    if (!statusBox) return;
    statusBox.textContent = '';

    if (currentUser) {
      var label = document.createElement('span');
      label.className = 'swagger-auth-label';
      label.textContent = 'Signed in as ' + (currentUser.name || currentUser.email);

      var out = document.createElement('button');
      out.type = 'button';
      out.className = 'swagger-auth-button swagger-auth-button-ghost';
      out.textContent = 'Sign out';
      out.addEventListener('click', signOut);

      statusBox.appendChild(label);
      statusBox.appendChild(out);
      return;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'swagger-auth-button';
    button.textContent = 'Sign in to test';
    button.addEventListener('click', openDialog);
    statusBox.appendChild(button);
  }

  function openDialog() {
    if (dialog) return;

    dialog = document.createElement('div');
    dialog.className = 'swagger-auth-overlay';
    dialog.innerHTML =
      '<div class="swagger-auth-modal" role="dialog" aria-modal="true" aria-labelledby="swagger-auth-title">' +
      '<h2 id="swagger-auth-title">Sign in to test the API</h2>' +
      '<p class="swagger-auth-hint">Use the same email and password as the web app. This sets the httpOnly session cookies for this browser.</p>' +
      '<form class="swagger-auth-form">' +
      '<label>Email<input name="email" type="email" autocomplete="username" required></label>' +
      '<label>Password<input name="password" type="password" autocomplete="current-password" required></label>' +
      '<p class="swagger-auth-error" role="alert"></p>' +
      '<div class="swagger-auth-actions">' +
      '<button type="button" class="swagger-auth-button swagger-auth-button-ghost" data-close>Cancel</button>' +
      '<button type="submit" class="swagger-auth-button">Sign in</button>' +
      '</div>' +
      '</form>' +
      '</div>';

    document.body.appendChild(dialog);

    var form = dialog.querySelector('form');
    var error = dialog.querySelector('.swagger-auth-error');
    var submit = form.querySelector('button[type="submit"]');

    dialog.querySelector('[data-close]').addEventListener('click', closeDialog);
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog();
    });
    document.addEventListener('keydown', onKey);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      error.textContent = '';
      submit.disabled = true;
      submit.textContent = 'Signing in...';

      var data = new FormData(form);
      api('/login', {
        method: 'POST',
        body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
      }).then(function (result) {
        submit.disabled = false;
        submit.textContent = 'Sign in';

        if (!result.ok) {
          error.textContent = messageFrom(result.body, 'Sign in failed. Check your email and password.');
          return;
        }

        currentUser = result.body;
        closeDialog();
        render();
      });
    });

    window.setTimeout(function () {
      var input = form.querySelector('input[name="email"]');
      if (input) input.focus();
    }, 0);
  }

  function messageFrom(body, fallback) {
    if (!body || !body.message) return fallback;
    return Array.isArray(body.message) ? body.message.join(', ') : String(body.message);
  }

  function closeDialog() {
    if (!dialog) return;
    document.removeEventListener('keydown', onKey);
    dialog.remove();
    dialog = null;
  }

  function onKey(event) {
    if (event.key === 'Escape') closeDialog();
  }

  function signOut() {
    api('/logout', { method: 'POST' }).then(function () {
      currentUser = null;
      render();
    });
  }

  function mount() {
    var topbar =
      document.querySelector('.swagger-ui .topbar .topbar-wrapper') ||
      document.querySelector('.swagger-ui .topbar .wrapper');

    if (!topbar) {
      window.setTimeout(mount, 100);
      return;
    }
    if (document.querySelector('.swagger-auth-status')) return;

    statusBox = document.createElement('div');
    statusBox.className = 'swagger-auth-status';
    topbar.appendChild(statusBox);
    render();
    loadSession();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
`;
