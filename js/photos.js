document.addEventListener("DOMContentLoaded", function () {
  const dropZone = document.getElementById("dropZone");
  const photoInput = document.getElementById("photoInput");
  const grid = document.getElementById("photoGrid");

  // ── Load existing photos from backend ──
  KV.api.get('php/photos/list.php')
    .then(function (res) {
      if (res.success && res.photos && res.photos.length > 0) {
        // Clear existing hardcoded photos (keep the add-slot)
        grid.querySelectorAll(".photo-card:not(.add-slot)").forEach(function (card) {
          card.remove();
        });

        // Render photos from database
        var addSlot = grid.querySelector(".add-slot");
        res.photos.forEach(function (photo) {
          var card = createPhotoCard(photo.file_path, photo.id, photo.is_primary);
          grid.insertBefore(card, addSlot);
        });

        updatePhotoCount();
      }
      // If backend not ready, keep the existing demo photos
    });

  // ── Drag & Drop ──
  if (dropZone && photoInput) {
    ["dragenter", "dragover"].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", function (e) {
      uploadFiles(e.dataTransfer.files);
    });

    photoInput.addEventListener("change", function () {
      uploadFiles(photoInput.files);
    });
  }

  /**
   * Upload files to backend and add preview cards.
   */
  function uploadFiles(files) {
    Array.from(files).forEach(function (file) {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        KV.showToast('File "' + file.name + '" exceeds 5MB limit.', 'error');
        return;
      }

      var formData = new FormData();
      formData.append('photo', file);

      KV.api.upload('php/photos/upload-photo.php', formData)
        .then(function (res) {
          if (res.success && res.photo) {
            // Backend saved the photo — add card with server data
            var card = createPhotoCard(res.photo.file_path, res.photo.id, false);
            var addSlot = grid.querySelector(".add-slot");
            grid.insertBefore(card, addSlot);
            updatePhotoCount();
            KV.showToast('Photo uploaded successfully!', 'success');
          } else {
            // Fallback: show preview with local file (demo mode)
            var reader = new FileReader();
            reader.onload = function (e) {
              var card = createPhotoCard(e.target.result, null, false);
              var addSlot = grid.querySelector(".add-slot");
              grid.insertBefore(card, addSlot);
              updatePhotoCount();
            };
            reader.readAsDataURL(file);
          }
        });
    });
  }

  /**
   * Create a photo card element.
   */
  function createPhotoCard(src, photoId, isPrimary) {
    var card = document.createElement("article");
    card.className = "photo-card" + (isPrimary ? " primary" : "");
    if (photoId) card.dataset.photoId = photoId;

    card.innerHTML =
      '<img src="' + src + '" alt="Profile photo">' +
      (isPrimary ? '<span class="photo-badge">Primary</span>' : '') +
      '<div class="photo-overlay">' +
      '<button type="button" class="photo-action set-primary" title="Set as primary"><i class="fas fa-star"></i></button>' +
      '<button type="button" class="photo-action delete-photo" title="Delete"><i class="fas fa-trash"></i></button>' +
      '</div>';

    bindPhotoActions(card);
    return card;
  }

  /**
   * Bind delete and set-primary actions to a photo card.
   */
  function bindPhotoActions(card) {
    // Delete photo
    card.querySelector(".delete-photo")?.addEventListener("click", function () {
      var photoId = card.dataset.photoId;

      if (photoId) {
        KV.api.post('php/photos/delete-photo.php', { photo_id: photoId })
          .then(function (res) {
            if (res.success) {
              card.remove();
              updatePhotoCount();
              KV.showToast('Photo deleted.', 'info');
            }
          });
      } else {
        // No backend ID — just remove from DOM (demo mode)
        card.remove();
        updatePhotoCount();
      }
    });

    // Set as primary
    card.querySelector(".set-primary")?.addEventListener("click", function () {
      var photoId = card.dataset.photoId;

      if (photoId) {
        KV.api.post('php/photos/set-primary.php', { photo_id: photoId })
          .then(function (res) {
            if (res.success) {
              applyPrimaryUI(card);
              KV.showToast('Primary photo updated!', 'success');
            }
          });
      } else {
        // Demo mode — just update UI
        applyPrimaryUI(card);
      }
    });
  }

  /**
   * Update the UI to mark a card as primary.
   */
  function applyPrimaryUI(card) {
    grid.querySelectorAll(".photo-card").forEach(function (c) {
      c.classList.remove("primary");
      var badge = c.querySelector(".photo-badge");
      if (badge) badge.remove();
    });
    card.classList.add("primary");
    var badge = document.createElement("span");
    badge.className = "photo-badge";
    badge.textContent = "Primary";
    card.appendChild(badge);
  }

  /**
   * Update the photo count display.
   */
  function updatePhotoCount() {
    var count = grid.querySelectorAll(".photo-card:not(.add-slot)").length;
    var statsEl = document.querySelector(".photo-stats span");
    if (statsEl) {
      statsEl.innerHTML = '<strong>' + count + '</strong> / 5 uploaded';
    }
  }

  // Bind actions to existing hardcoded photo cards
  grid.querySelectorAll(".photo-card:not(.add-slot)").forEach(bindPhotoActions);

  // ── Horoscope upload ──
  document.querySelector(".horoscope-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var btn = this.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';

    KV.api.upload('php/photos/upload-horoscope.php', formData)
      .then(function (res) {
        if (res.success) {
          KV.showToast('Horoscope uploaded successfully!', 'success');
        }
        btn.disabled = false;
        btn.innerHTML = 'Upload Horoscope';
      });
  });
});
