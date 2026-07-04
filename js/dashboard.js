/**
 * Kalyana Varan - Dashboard interactions
 * Fetches dashboard data from backend when available.
 */
document.addEventListener("DOMContentLoaded", function () {

  // ── Load dashboard data from backend ──
  KVAuth.ready.then(function (user) {
    if (!user) return;

    // Personalized Welcome Name
    var welcomeBannerText = document.querySelector('.welcome-banner h2');
    if (welcomeBannerText && user.name) {
      welcomeBannerText.innerHTML = 'Welcome back, <span>' + user.name + ' 👋</span>';
    }

    // Dynamic Profile Checklist & Completion Calculation
    var personal = !!(user.name || user.fullname || user.email);
    var education = !!(user.education || user.highestQualification || user.profession || user.occupation);
    var family = !!(user.fatherOccupation || user.father_occupation || user.motherOccupation || user.mother_occupation || user.familyType || user.family_type);
    var preference = !!(user.partnerReligion || user.partnerEducation || user.partnerHeight || user.pref_religion || user.pref_education || user.pref_height);
    
    var photosCount = 0;
    try {
      var photos = JSON.parse(localStorage.getItem('kv_user_photos') || '[]');
      photosCount = photos.length;
    } catch (e) {}
    var uploadPhotos = photosCount > 0;
    var horoscope = !!user.horoscope || !!localStorage.getItem('kv_horoscope');

    var totalScore = 0;
    if (personal) totalScore += 25;
    if (education) totalScore += 15;
    if (family) totalScore += 15;
    if (preference) totalScore += 20;
    if (uploadPhotos) totalScore += 15;
    if (horoscope) totalScore += 10;

    // Update Checklist UI
    var pctText = document.querySelector('.completion-header h2');
    if (pctText) pctText.textContent = totalScore + '%';
    
    var progressFill = document.querySelector('.progress-fill');
    if (progressFill) progressFill.style.width = totalScore + '%';

    var grid = document.querySelector('.check-grid');
    if (grid) {
      grid.innerHTML = '';
      
      var createItem = function (label, completed) {
        var el = document.createElement('div');
        el.className = completed ? 'completed' : 'pending';
        el.textContent = (completed ? '✔ ' : '✖ ') + label;
        grid.appendChild(el);
      };
      
      createItem('Personal', personal);
      createItem('Education', education);
      createItem('Family', family);
      createItem('Partner Preference', preference);
      createItem('Upload Photos', uploadPhotos);
      createItem('Horoscope', horoscope);
    }

    KV.api.get('php/dashboard/data.php')
      .then(function (res) {
        if (res.success && res.data) {
          // Populate stats if available
          if (res.data.stats) {
            var statEls = document.querySelectorAll('.stat-number');
            var stats = res.data.stats;
            if (statEls[0] && stats.profile_views !== undefined) statEls[0].textContent = stats.profile_views;
            if (statEls[1] && stats.interests_received !== undefined) statEls[1].textContent = stats.interests_received;
            if (statEls[2] && stats.shortlisted !== undefined) statEls[2].textContent = stats.shortlisted;
          }
        }
      });

    // Populate mini profile details card on dashboard
    KV.api.get('php/profile/get-profile.php?user_id=' + user.id)
      .then(function (res) {
        if (res.success && res.profile) {
          var p = res.profile;

          var setField = function (selector, value) {
            var el = document.querySelector(selector);
            if (el) {
              el.textContent = value || 'Not specified';
            }
          };

          setField('[data-profile-field="fullname"]', p.fullname || p.name);
          
          var ageGender = '';
          if (p.age) ageGender += p.age + ' Years';
          if (p.gender) ageGender += (ageGender ? ' | ' : '') + p.gender;
          setField('[data-profile-field="age_gender"]', ageGender);

          var relCaste = '';
          if (p.religion) relCaste += p.religion;
          if (p.caste) relCaste += (relCaste ? ' | ' : '') + p.caste;
          setField('[data-profile-field="religion_caste"]', relCaste);

          setField('[data-profile-field="motherTongue"]', p.motherTongue || p.mothertongue);
          setField('[data-profile-field="location"]', p.city || p.location);

          setField('[data-profile-field="education"]', p.education || p.highestQualification);
          setField('[data-profile-field="profession"]', p.profession || p.occupation);
          
          var incomeVal = p.income || p.annualIncome;
          if (incomeVal) {
            if (!incomeVal.includes('LPA') && !incomeVal.includes('₹') && !incomeVal.includes('L')) {
              incomeVal = '₹' + incomeVal + ' LPA';
            }
          }
          setField('[data-profile-field="income"]', incomeVal);

          setField('[data-profile-field="email"]', p.email);
          setField('[data-profile-field="mobile"]', p.mobile || p.phone);
        }
      });
  });

  // ── View Profile buttons ──
  document.querySelectorAll(".match-card .primary-btn").forEach(function (btn) {
    if (btn.textContent.trim() === "View Profile") {
      btn.addEventListener("click", function () {
        var profileId = this.closest('.match-card')?.dataset.profileId;
        window.location.href = "profile-details.html" + (profileId ? "?id=" + profileId : "");
      });
    }
  });

  // ── Send Interest buttons ──
  document.querySelectorAll(".match-card .outline-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var profileId = this.closest('.match-card')?.dataset.profileId;
      var button = this;
      button.disabled = true;
      button.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Sending...';

      KV.api.post('php/interests/send.php', { receiver_id: profileId || '0' })
        .then(function (res) {
          if (res.success) {
            button.textContent = "Interest Sent";
            button.classList.add("sent");
            KV.showToast('Interest sent!', 'success');
          } else {
            // Fallback for demo
            button.textContent = "Interest Sent";
            button.classList.add("sent");
          }
        });
    });
  });

  // ── Quick action cards ──
  document.querySelectorAll(".quick-card").forEach(function (card) {
    card.style.cursor = "pointer";
    card.addEventListener("click", function () {
      var label = card.querySelector("h3");
      if (!label) return;

      var routes = {
        "Edit Profile": "edit-profile.html",
        "Upload Photos": "photos.html",
        "Partner Preference": "edit-profile.html#partner",
        "Find Matches": "profiles.html",
        Inbox: "interests.html",
        Settings: "settings.html",
      };

      var href = routes[label.textContent.trim()];
      if (href) window.location.href = href;
    });
  });

  var completeBtn = document.querySelector(".welcome-banner .primary-btn");
  if (completeBtn) {
    completeBtn.addEventListener("click", function () {
      window.location.href = "complete-profile.html";
    });
  }

  var upgradeBtn = document.querySelector(".premium-btn");
  if (upgradeBtn) {
    upgradeBtn.addEventListener("click", function () {
      window.location.href = "membership.html";
    });
  }

  document.querySelectorAll(".section-title a").forEach(function (link) {
    if (link.textContent.trim() === "View All") {
      var section = link.closest(".dashboard-section");
      if (!section) return;

      var title = section.querySelector("h2");
      if (!title) return;

      if (title.textContent.includes("Recommended")) {
        link.href = "profiles.html";
      } else if (title.textContent.includes("Activity")) {
        link.href = "notifications.html";
      }
    }
  });
});
