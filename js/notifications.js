// ==========================================
// Kalyana Varan — Notifications
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  var list = document.getElementById("notifList");
  var empty = document.getElementById("emptyNotif");
  var filterBtns = document.querySelectorAll(".filter-btn");

  // ── Load notifications from backend ──
  KV.api.get('php/notifications/list.php')
    .then(function (res) {
      if (res.success && res.notifications) {
        // TODO: Dynamically render notification items from res.notifications
        // For now, the static HTML items work as demo.
      }
    });

  // ── Filter buttons ──
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      var filter = btn.dataset.filter;
      var visible = 0;

      list.querySelectorAll(".notif-item").forEach(function (item) {
        var show = filter === "all" || item.dataset.type === filter;
        item.style.display = show ? "" : "none";
        if (show) visible++;
      });

      empty.classList.toggle("d-none", visible > 0);
      list.classList.toggle("d-none", visible === 0);
    });
  });

  // ── Mark all as read ──
  document.getElementById("markAllRead").addEventListener("click", function () {
    KV.api.post('php/notifications/mark-read.php', { all: true })
      .then(function (res) {
        // Update UI regardless of backend status
        list.querySelectorAll(".notif-item").forEach(function (item) {
          item.classList.remove("unread");
        });

        document.querySelector(".nav-badge")?.remove();
        filterBtns.forEach(function (btn) {
          var span = btn.querySelector("span");
          if (span) span.textContent = "0";
        });

        if (res.success) {
          KV.showToast('All notifications marked as read.', 'success');
        }
      });
  });

  // ── Dismiss individual notification ──
  list.addEventListener("click", function (e) {
    var dismiss = e.target.closest(".btn-sm-dismiss");
    if (!dismiss) return;

    var item = dismiss.closest(".notif-item");
    var notifId = item?.dataset.notifId || '0';

    KV.api.post('php/notifications/dismiss.php', { notification_id: notifId })
      .then(function () {
        item.style.transition = 'opacity 0.3s';
        item.style.opacity = '0';
        setTimeout(function () {
          item.remove();
          if (!list.querySelector(".notif-item:not([style*='none'])")) {
            list.classList.add("d-none");
            empty.classList.remove("d-none");
          }
        }, 300);
      });
  });
});
