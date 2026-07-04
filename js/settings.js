// ==========================================
// Kalyana Varan — Settings
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  var tabs = document.querySelectorAll(".settings-tab");
  var panels = document.querySelectorAll(".settings-panel");

  // ── Tab switching ──
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var panelId = "panel-" + tab.dataset.panel;

      tabs.forEach(function (t) {
        t.classList.remove("active");
      });
      panels.forEach(function (p) {
        p.classList.remove("active");
      });

      tab.classList.add("active");
      document.getElementById(panelId).classList.add("active");
    });
  });

  // ── Map each form to its backend endpoint ──
  var formEndpoints = {
    'panel-account': 'php/settings/update-account.php',
    'panel-privacy': 'php/settings/update-privacy.php',
    'panel-alerts': 'php/settings/update-alerts.php',
    'passwordForm': 'php/settings/change-password.php'
  };

  // ── Handle all settings form submissions ──
  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Password match validation
      if (form.id === "passwordForm") {
        var newPass = document.getElementById("newPassword").value;
        var confirm = document.getElementById("confirmPassword").value;
        if (newPass !== confirm) {
          KV.showToast("New passwords do not match.", "error");
          return;
        }
      }

      // Determine endpoint
      var endpoint = '';
      if (form.id && formEndpoints[form.id]) {
        endpoint = formEndpoints[form.id];
      } else {
        var panel = form.closest('.settings-panel');
        if (panel && formEndpoints[panel.id]) {
          endpoint = formEndpoints[panel.id];
        }
      }

      if (!endpoint) {
        KV.showToast("Settings saved (demo mode).", "info");
        return;
      }

      // Submit
      var btn = form.querySelector('[type="submit"]');
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

      var formData = new FormData(form);

      // For checkboxes that are unchecked — they won't be in FormData
      // Explicitly add them as '0'
      form.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        if (!cb.checked) {
          formData.set(cb.name, '0');
        }
      });

      KV.api.post(endpoint, formData)
        .then(function (res) {
          btn.disabled = false;
          btn.textContent = originalText;

          if (res.success) {
            KV.showToast('Settings saved successfully!', 'success');
          }
        });
    });
  });

  // ── Load current settings from backend ──
  KV.api.get('php/settings/get-settings.php')
    .then(function (res) {
      if (res.success && res.settings) {
        // Populate form fields with saved settings
        for (var key in res.settings) {
          if (!res.settings.hasOwnProperty(key)) continue;
          var field = document.querySelector('[name="' + key + '"]');
          if (!field) continue;

          if (field.type === 'checkbox') {
            field.checked = !!res.settings[key];
          } else if (field.tagName === 'SELECT') {
            for (var i = 0; i < field.options.length; i++) {
              if (field.options[i].value === res.settings[key] || field.options[i].text === res.settings[key]) {
                field.selectedIndex = i;
                break;
              }
            }
          } else {
            field.value = res.settings[key];
          }
        }
      }
      // If backend not ready, forms keep their existing hardcoded values
    });
});
