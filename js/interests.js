// ==========================================
// Kalyana Varan — Interests Page
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // ── Load interests from backend ──
  KV.api.get('php/interests/list.php')
    .then(function (res) {
      if (res.success && res.interests) {
        // TODO: Dynamically render interest cards from res.interests
        // For now, the static HTML cards work as demo.
        // When backend is ready, replace the static cards with:
        // renderInterests(res.interests);
      }
    });

  // ── Filter Buttons ──
  var filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      // Optional: re-fetch from backend with filter
      // var filter = button.dataset.filter;
      // KV.api.get('php/interests/list.php?type=' + filter)...
    });
  });

  // ── Accept Interest ──
  document.querySelectorAll(".btn-accept").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = this.closest('.interest-card, .card, [data-interest-id]');
      var interestId = card?.dataset.interestId || '0';
      var button = this;

      button.disabled = true;
      button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

      KV.api.post('php/interests/respond.php', {
        interest_id: interestId,
        action: 'accept'
      }).then(function (res) {
        button.innerHTML = '<i class="fa-solid fa-check"></i> Accepted';
        button.style.background = "#198754";
        if (res.success) {
          KV.showToast('Interest accepted!', 'success');
        }
      });
    });
  });

  // ── Decline Interest ──
  document.querySelectorAll(".btn-decline").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = this.closest('.interest-card, .card, [data-interest-id]');
      var interestId = card?.dataset.interestId || '0';
      var button = this;

      button.disabled = true;
      button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

      KV.api.post('php/interests/respond.php', {
        interest_id: interestId,
        action: 'decline'
      }).then(function (res) {
        button.innerHTML = '<i class="fa-solid fa-xmark"></i> Declined';
        button.style.background = "#dc3545";
        if (res.success) {
          KV.showToast('Interest declined.', 'info');
        }
      });
    });
  });

});