/**
 * Kalyana Varan — Centralized API Service
 * ========================================
 * All backend communication goes through this module.
 *
 * Usage:
 *   KV.api.get('php/profile/get-profiles.php?gender=Female')
 *   KV.api.post('php/auth/login.php', { email, password })
 *   KV.api.upload('php/photos/upload-photo.php', formDataWithFiles)
 *
 * Configure API_BASE below when deploying.
 */

const KV = (function () {

  // ── Change this when your backend is hosted elsewhere ──
  const API_BASE = '';  // e.g. 'https://api.kalyanavaran.com/' or leave '' for same-origin

  // ── Client-side mock backend for frontend-only demo ──
  function shouldMock(endpoint) {
    return !API_BASE && endpoint.indexOf('php/') === 0;
  }

  function parseFormData(body) {
    var data = {};
    if (body instanceof FormData) {
      if (typeof body.forEach === 'function') {
        body.forEach(function (value, key) {
          data[key] = value;
        });
      } else {
        for (var pair of body.entries()) {
          data[pair[0]] = pair[1];
        }
      }
    }
    return data;
  }

  function handleMock(endpoint, options) {
    var method = (options && options.method) || 'GET';
    var cleanEndpoint = endpoint.split('?')[0];

    // Helper to get active user
    var getActiveUser = function () {
      try {
        return JSON.parse(localStorage.getItem('kv_active_user'));
      } catch (e) {
        return null;
      }
    };

    // Helper to save active user
    var setActiveUser = function (user) {
      localStorage.setItem('kv_active_user', JSON.stringify(user));
    };

    // Helper to get registered users list
    var getRegisteredUsers = function () {
      try {
        return JSON.parse(localStorage.getItem('kv_registered_users') || '[]');
      } catch (e) {
        return [];
      }
    };

    // Helper to save registered users list
    var setRegisteredUsers = function (users) {
      localStorage.setItem('kv_registered_users', JSON.stringify(users));
    };

    // Parse incoming post data
    var postData = {};
    if (options && options.body) {
      postData = parseFormData(options.body);
    }

    console.log('[KV API Mock] Intercepted request:', method, endpoint, postData);

    if (cleanEndpoint === 'php/auth/register.php') {
      var users = getRegisteredUsers();
      var email = (postData.email || '').trim();
      if (!email) {
        return { success: false, message: 'Email address is required.' };
      }
      var existing = users.find(function (u) { return u.email.toLowerCase() === email.toLowerCase(); });
      if (existing) {
        return { success: false, message: 'This email address is already registered.' };
      }

      var newUser = {
        id: 'user_' + Date.now(),
        name: (postData.fullname || '').trim() || email.split('@')[0],
        email: email,
        mobile: (postData.mobile || '').trim(),
        gender: postData.gender || 'Male',
        photo: postData.gender === 'Female' ? './src/images/girl1.jpg' : './src/images/boy1.png',
        profile_completed: false
      };

      users.push(newUser);
      setRegisteredUsers(users);
      setActiveUser(newUser);
      localStorage.removeItem('kv_logged_out');

      return { success: true, message: 'Registration successful!' };
    }

    if (cleanEndpoint === 'php/auth/login.php') {
      var users = getRegisteredUsers();
      var email = (postData.email || '').trim();
      var password = postData.password || '';

      var user = users.find(function (u) { return u.email.toLowerCase() === email.toLowerCase(); });
      if (!user) {
        // Self-heal: automatically register on the fly for ease of preview testing
        user = {
          id: 'user_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          mobile: '9876543210',
          gender: 'Male',
          photo: './src/images/boy1.png',
          profile_completed: true
        };
        users.push(user);
        setRegisteredUsers(users);
      }

      setActiveUser(user);
      localStorage.removeItem('kv_logged_out');

      return { success: true, message: 'Logged in successfully!' };
    }

    if (cleanEndpoint === 'php/auth/logout.php') {
      localStorage.removeItem('kv_active_user');
      localStorage.setItem('kv_logged_out', 'true');
      return { success: true };
    }

    if (cleanEndpoint === 'php/auth/session-check.php') {
      var active = getActiveUser();
      if (active) {
        return { success: true, user: active };
      }
      return { success: false };
    }

    if (cleanEndpoint === 'php/profile/complete-profile.php' || cleanEndpoint === 'php/profile/update-profile.php') {
      var active = getActiveUser();
      if (active) {
        for (var key in postData) {
          if (postData.hasOwnProperty(key)) {
            active[key] = postData[key];
          }
        }
        if (postData.firstName || postData.lastName) {
          active.name = ((postData.firstName || active.firstName || '') + ' ' + (postData.lastName || active.lastName || '')).trim();
          active.fullname = active.name;
        }

        // Combine Age preference range
        if (postData.pref_age_from || postData.pref_age_to) {
          var fromAge = postData.pref_age_from || '';
          var toAge = postData.pref_age_to || '';
          if (fromAge !== 'From' && toAge !== 'To' && (fromAge || toAge)) {
            active.pref_age = (fromAge + ' - ' + toAge).trim() + ' Years';
            active.partnerAge = active.pref_age;
          }
        }

        // Combine Height preference range
        if (postData.pref_height_from || postData.pref_height_to) {
          var fromHt = postData.pref_height_from || '';
          var toHt = postData.pref_height_to || '';
          if (fromHt !== 'From' && toHt !== 'To' && (fromHt || toHt)) {
            active.pref_height = (fromHt + ' - ' + toHt).trim();
            active.partnerHeight = active.pref_height;
          }
        }

        // Replicate partner pref fields for dual naming support
        if (postData.pref_religion) active.partnerReligion = postData.pref_religion;
        if (postData.pref_education) active.partnerEducation = postData.pref_education;
        if (postData.pref_occupation) active.partnerOccupation = postData.pref_occupation;
        if (postData.pref_location) active.partnerLocation = postData.pref_location;

        active.profile_completed = true;
        setActiveUser(active);

        // Also update list
        var users = getRegisteredUsers();
        var idx = users.findIndex(function (u) { return u.id === active.id; });
        if (idx !== -1) {
          users[idx] = active;
          setRegisteredUsers(users);
        }
      }
      return { success: true, message: 'Profile saved successfully!' };
    }

    if (cleanEndpoint === 'php/profile/get-profile.php') {
      var active = getActiveUser();
      if (!active) {
        // Fallback preview details if no user has logged in/registered
        active = {
          id: 'default',
          name: 'Suraj P S',
          email: 'suraj@example.com',
          mobile: '9876543210',
          gender: 'Male',
          photo: './src/images/boy3.png',
          profile_completed: true
        };
        setActiveUser(active);
      }
      return { success: true, profile: active };
    }

    if (cleanEndpoint === 'php/dashboard/data.php') {
      return {
        success: true,
        data: {
          stats: {
            profile_views: 45,
            interests_received: 12,
            shortlisted: 8
          }
        }
      };
    }

    // Default mock response for success fallback of any other endpoints
    if (cleanEndpoint.indexOf('php/profile/get-profiles.php') === 0) {
      return { success: true, profiles: window.DEMO_PROFILES || [] };
    }

    if (cleanEndpoint === 'php/shortlist/list.php') {
      return { success: true, shortlisted: [] };
    }

    if (cleanEndpoint === 'php/interests/list.php') {
      return { success: true, interests: [] };
    }

    if (cleanEndpoint === 'php/notifications/list.php') {
      return { success: true, notifications: [] };
    }

    if (cleanEndpoint === 'php/settings/get-settings.php') {
      var active = getActiveUser() || {};
      return {
        success: true,
        settings: {
          fullname: active.name || '',
          email: active.email || '',
          mobile: active.mobile || '',
          gender: active.gender || '',
          profile_alerts: '1',
          match_alerts: '1',
          shortlist_alerts: '1'
        }
      };
    }

    // fallback for other updates/actions
    return { success: true };
  }

  // ── Toast notification helper ──
  function showToast(message, type) {
    // type: 'success' | 'error' | 'info'
    var existing = document.getElementById('kv-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'kv-toast';
    toast.className = 'kv-toast kv-toast--' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow then show
    toast.offsetHeight; // eslint-disable-line no-unused-expressions
    toast.classList.add('kv-toast--visible');

    setTimeout(function () {
      toast.classList.remove('kv-toast--visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3500);
  }

  // ── Core request helper ──
  function request(endpoint, options) {
    if (shouldMock(endpoint)) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var mockRes = handleMock(endpoint, options);
          if (mockRes && mockRes.success === false && mockRes.message) {
            showToast(mockRes.message, 'error');
          }
          resolve(mockRes);
        }, 300); // Add a small delay to simulate network latency for loading indicators
      });
    }

    var url = API_BASE + endpoint;

    return fetch(url, options)
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Server responded with status ' + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        if (data && data.success === false && data.message) {
          showToast(data.message, 'error');
        }
        return data;
      })
      .catch(function (err) {
        console.error('[KV API]', endpoint, err);
        // Avoid showing error toasts for auth guard checks during preview
        if (endpoint !== 'php/auth/session-check.php') {
          showToast('Something went wrong. Please try again.', 'error');
        }
        return { success: false, message: err.message, connectionError: true };
      });
  }

  // ── Public API methods ──
  var api = {

    /**
     * GET request.
     * @param {string} endpoint - e.g. 'php/profile/get-profiles.php?gender=Male'
     */
    get: function (endpoint) {
      return request(endpoint, {
        method: 'GET',
        credentials: 'same-origin'
      });
    },

    /**
     * POST request with JSON or key-value data.
     * Accepts a plain object — it will be sent as FormData (PHP-friendly).
     * @param {string} endpoint
     * @param {Object|FormData} data
     */
    post: function (endpoint, data) {
      var body;

      if (data instanceof FormData) {
        body = data;
      } else {
        body = new FormData();
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            body.append(key, data[key]);
          }
        }
      }

      return request(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        body: body
      });
    },

    /**
     * Upload files via multipart POST.
     * @param {string} endpoint
     * @param {FormData} formData - must include file inputs
     */
    upload: function (endpoint, formData) {
      return request(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
      });
    }
  };

  return {
    API_BASE: API_BASE,
    api: api,
    showToast: showToast
  };

})();
