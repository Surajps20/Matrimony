// ==========================================
// Kalyana Varan — Membership
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  var planInput = document.getElementById("selectedPlan");
  var payBtn = document.getElementById("payNowBtn");
  var form = document.getElementById("membershipForm");

  // ── Plan selection ──
  document.querySelectorAll(".choose-plan-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var plan = btn.dataset.plan;
      planInput.value = plan;

      document.querySelectorAll(".plan-card").forEach(function (card) {
        card.classList.remove("selected");
      });

      btn.closest(".plan-card").classList.add("selected");
      payBtn.disabled = false;
      payBtn.textContent = "Proceed to Pay — " + btn.textContent.trim();
    });
  });

  // ── Form submission ──
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!planInput.value) {
        KV.showToast("Please select a membership plan first.", "error");
        return;
      }

      payBtn.disabled = true;
      payBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';

      // ── Backend API Call ──
      KV.api.post('php/membership/process.php', {
        plan: planInput.value
      }).then(function (res) {
        if (res.success) {
          KV.showToast('Payment successful! Plan: ' + planInput.value.toUpperCase(), 'success');
          setTimeout(function () {
            window.location.href = "dashboard.html";
          }, 1000);
        } else {
          payBtn.disabled = false;
          payBtn.textContent = "Proceed to Pay";
        }
      });
    });
  }
});
