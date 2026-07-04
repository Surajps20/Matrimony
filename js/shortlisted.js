// ==========================================
// Kalyana Varan — Shortlisted Profiles
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // ── Load shortlisted profiles from backend ──
  KV.api.get('php/shortlist/list.php')
    .then(function (res) {
      if (res.success && res.shortlisted) {
        // TODO: Dynamically render shortlisted cards from res.shortlisted
        // For now, the static HTML cards work as demo.
      }
    });

  // ── Remove from Shortlist ──
  document.querySelectorAll(".btn-remove").forEach(function (button) {
    button.onclick = function () {
      var card = this.closest(".shortlist-card");
      var profileId = card?.dataset.profileId || '0';

      KV.api.post('php/shortlist/remove.php', { profile_id: profileId })
        .then(function (res) {
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(function () { card.remove(); }, 300);

          if (res.success) {
            KV.showToast('Removed from shortlist.', 'info');
          }
        });
    };
  });

  // ── Send Interest from Shortlist ──
  document.querySelectorAll(".btn-send-interest").forEach(function (button) {
    button.onclick = function () {
      var card = this.closest(".shortlist-card");
      var profileId = card?.dataset.profileId || '0';
      var btn = this;

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

      KV.api.post('php/interests/send.php', { receiver_id: profileId })
        .then(function (res) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent';
          if (res.success) {
            KV.showToast('Interest sent!', 'success');
          }
        });
    };
  });

});