/**
 * Kalyana Varan - Shared user dashboard layout
 * Loads sidebar component and highlights active nav item.
 * Replace fetch with PHP include when backend is ready.
 */
document.addEventListener("DOMContentLoaded", function () {
  const sidebarHost = document.getElementById("user-sidebar");
  if (!sidebarHost) return;

  // Prepend Portal Header
  var portalHeader = document.createElement("header");
  portalHeader.className = "portal-header";
  portalHeader.innerHTML =
    '<div class="portal-header-container">' +
      '<div class="portal-header-left">' +
        // '<button type="button" class="portal-sidebar-toggle-btn d-lg-none" id="portalSidebarToggle" aria-label="Toggle menu">' +
//     '<i class="fas fa-bars"></i>' +
// '</button>' +
        '<a href="dashboard.html" class="portal-brand">' +
          '<img src="./src/images/kalyana-varan-logo.svg" alt="Kalyana Varan Logo">' +
        '</a>' +
      '</div>' +
      '<div class="portal-header-right">' +
        '<a href="index.html" class="public-site-link">' +
          '<i class="fas fa-globe me-1"></i> Public Site' +
        '</a>' +
        '<a href="notifications.html" class="portal-nav-icon" title="Notifications">' +
          '<i class="fas fa-bell"></i>' +
          '<span class="portal-badge-count">4</span>' +
        '</a>' +
        '<div class="portal-user-dropdown">' +
          '<img src="./src/images/boy1.png" alt="Profile" data-user-photo class="portal-avatar">' +
          '<span class="portal-user-name" data-user-name>Suraj P S</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.insertBefore(portalHeader, document.body.firstChild);

  const activePage = sidebarHost.dataset.active || document.body.dataset.page || "";

  fetch("components/user-sidebar.html")
    .then(function (res) {
      return res.text();
    })
    .then(function (html) {
      sidebarHost.innerHTML = html;

      if (activePage) {
        const activeLink = sidebarHost.querySelector('[data-nav="' + activePage + '"]');
        if (activeLink) {
          sidebarHost.querySelectorAll(".sidebar nav a").forEach(function (link) {
            link.classList.remove("active");
          });
          activeLink.classList.add("active");
        }
      }

      // Populate sidebar details with user session
      if (window.KVAuth) {
        window.KVAuth.ready.then(function (u) {
          if (u && typeof window.KVAuth.populateUI === 'function') {
            window.KVAuth.populateUI(u);
          }
        });
      }

      initSidebarToggle();
    })
    .catch(function () {
      sidebarHost.innerHTML =
        '<aside class="sidebar"><p class="text-muted small p-3">Sidebar could not load.</p></aside>';
    });
});

function initSidebarToggle() {
  const sidebar = document.getElementById("userSidebar");
  const toggle = document.getElementById("sidebarToggle");
  const portalToggle = document.getElementById("portalSidebarToggle");
  const closeBtn = sidebar && sidebar.querySelector(".sidebar-close");

  if (!sidebar) return;

  const handleOpen = function () {
    sidebar.classList.add("open");
    document.body.classList.add("sidebar-open");
  };

  if (toggle) toggle.addEventListener("click", handleOpen);
  if (portalToggle) portalToggle.addEventListener("click", handleOpen);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }

  document.addEventListener("click", function (e) {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      (!toggle || !toggle.contains(e.target)) &&
      (!portalToggle || !portalToggle.contains(e.target))
    ) {
      closeSidebar();
    }
  });
}

function closeSidebar() {
  const sidebar = document.getElementById("userSidebar");
  if (sidebar) sidebar.classList.remove("open");
  document.body.classList.remove("sidebar-open");
}
