document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".edit-nav a");
  const form = document.getElementById("editProfileForm");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      navLinks.forEach(function (l) {
        l.classList.remove("active");
      });
      link.classList.add("active");
    });
  });

  if (window.location.hash) {
    const hashLink = document.querySelector('.edit-nav a[href="' + window.location.hash + '"]');
    hashLink?.click();
  }

  // ── Load existing profile data from backend ──
  KVAuth.ready.then(function (user) {
    if (!user) return;

    KV.api.get('php/profile/get-profile.php?user_id=' + user.id)
      .then(function (res) {
        if (res.success && res.profile) {
          populateEditForm(res.profile);
        }
        // If backend not ready, form keeps its existing hardcoded values
      });
  });

  /**
   * Fill form fields with profile data from backend.
   */
  function populateEditForm(profile) {
    if (!form) return;

    for (var key in profile) {
      if (!profile.hasOwnProperty(key)) continue;
      var field = form.querySelector('[name="' + key + '"]');
      if (field) {
        if (field.tagName === 'SELECT') {
          // Try to select the matching option
          for (var i = 0; i < field.options.length; i++) {
            if (field.options[i].value === profile[key] || field.options[i].text === profile[key]) {
              field.selectedIndex = i;
              break;
            }
          }
        } else if (field.tagName === 'TEXTAREA') {
          field.value = profile[key];
        } else {
          field.value = profile[key];
        }
      }
    }
  }

  // ── Submit profile update to backend ──
  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Saving...";

    var formData = new FormData(form);

    KV.api.post('php/profile/update-profile.php', formData)
      .then(function (res) {
        if (res.success) {
          KV.showToast('Profile updated successfully!', 'success');
          setTimeout(function () {
            window.location.href = "my-profile.html";
          }, 800);
        } else {
          btn.disabled = false;
          btn.textContent = "Save Profile";
        }
      });
  });
});
