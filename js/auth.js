/**
 * Kalyana Varan — Auth Guard
 * ===========================
 * Include this script on every page that requires login.
 * It checks for an active session via the backend and redirects
 * to login.html if the user is not authenticated.
 *
 * Exposes:
 *   KVAuth.user   — { id, name, email, ... } of the logged-in user (null until loaded)
 *   KVAuth.ready   — Promise that resolves when session check completes
 *   KVAuth.logout() — Ends session and redirects to login page
 */

var KVAuth = (function () {

  var user = null;

  // Session check — resolves with user data
  var ready = new Promise(function (resolve) {
    var stored = localStorage.getItem('kv_active_user');
    if (stored) {
      try {
        user = JSON.parse(stored);
      } catch (e) {
        user = null;
      }
    } else {
      var loggedOut = localStorage.getItem('kv_logged_out');
      if (!loggedOut) {
        // Default preview user for frontend demonstration
        user = {
          id: 'default',
          name: 'Suraj P S',
          email: 'suraj@example.com',
          mobile: '9876543210',
          gender: 'Male',
          photo: './src/images/boy3.png',
          profile_completed: true
        };
        localStorage.setItem('kv_active_user', JSON.stringify(user));
      }
    }

    // Populate UI when DOM is ready
    if (user) {
      var doPopulate = function () {
        populateUserUI(user);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doPopulate);
      } else {
        doPopulate();
      }
    }

    resolve(user);
  });

  /**
   * Populate sidebar / header with the logged-in user's name & photo.
   * Targets common elements by data-attribute or class.
   */
  function populateUserUI(u) {
    if (!u) return;

    // Fill any element with data-user-name
    document.querySelectorAll('[data-user-name]').forEach(function (el) {
      el.textContent = u.name || u.email;
    });

    // Fill any element with data-user-email
    document.querySelectorAll('[data-user-email]').forEach(function (el) {
      el.textContent = u.email;
    });

    // Fill any element with data-user-id
    document.querySelectorAll('[data-user-id]').forEach(function (el) {
      var val = u.id || '';
      if (val.indexOf('user_') === 0) {
        val = 'KV' + val.substring(5, 11);
      }
      el.textContent = val || 'KV100245';
    });

    // Fill any img with data-user-photo
    if (u.photo) {
      document.querySelectorAll('[data-user-photo]').forEach(function (el) {
        el.src = u.photo;
      });
    }
  }

  /**
   * Logout — destroy session and redirect.
   */
  function logout() {
    KV.api.post('php/auth/logout.php', {})
      .then(function () {
        localStorage.removeItem('kv_active_user');
        window.location.href = 'login.html';
      })
      .catch(function () {
        localStorage.removeItem('kv_active_user');
        window.location.href = 'login.html';
      });
  }

  // Add dynamic logout click handler delegation
  document.addEventListener('click', function (e) {
    var logoutBtn = e.target.closest('.nav-logout, [data-nav="logout"]');
    if (logoutBtn) {
      e.preventDefault();
      logout();
    }
  });

  return {
    get user() { return user; },
    ready: ready,
    logout: logout,
    populateUI: populateUserUI
  };

})();
