# Kalyana Varan Matrimony — Frontend

Premium South Indian matrimony website (maroon/gold theme). Frontend-only; PHP/MySQL backend planned.

## Site Workflow

```
Public (Guest)
├── index.html          — Home, featured profiles, membership preview
├── profiles.html       — Search & filter matches
├── profile-details.html — View a profile (limited for guests)
├── about.html / contact.html
└── login.html / register.html → complete-profile.html

Logged-in User (Dashboard)
├── dashboard.html      — Overview, recommended matches, activity
├── my-profile.html     — View own profile
├── edit-profile.html   — Edit all profile sections
├── profiles.html       — Search matches
├── interests.html      — Received / sent / accepted / declined
├── shortlisted.html      — Saved profiles
├── photos.html         — Upload photos & horoscope
├── membership.html     — Plans & payment form
├── notifications.html  — Alerts & activity
└── settings.html       — Account, privacy, match alerts
```

## Tech Stack

- HTML5, CSS3, Bootstrap 5.3
- Font Awesome / Bootstrap Icons
- Vanilla JavaScript (no build step)
- Shared sidebar: `components/user-sidebar.html` + `js/user-layout.js`

## PHP Backend (planned)

Forms point to `php/` endpoints (e.g. `update-profile.php`, `upload-photo.php`). Replace sidebar `fetch()` with PHP `include` when ready.

## Run Locally

Open `index.html` in a browser, or use a local server (required for sidebar component):

```bash
npx serve .
# or: python -m http.server 8080
```

