/**
 * Kalyana Varan — Profiles Listing & Filtering
 * ==============================================
 * Fetches profiles from backend API. Falls back to demo data
 * if the backend is not available yet.
 */

// ── Demo fallback data (used only when backend is not ready) ──
var DEMO_PROFILES = [
    { id: 1, name: "Arjun", gender: "Male", motherTongue: "Tamil", age: 28, height: "5'9", income: "10L", education: "MBA", profession: "Engineer", country: "India", state: "Karnataka", city: "Bangalore", smoking: "No", drinking: "No", religion: "Hindu", community: "Brahmin", caste: "Iyer", image: "./src/images/boy1.png" },
    { id: 2, name: "Sneha", gender: "Female", motherTongue: "Telugu", age: 25, height: "5'4", income: "8L", education: "B.Tech", profession: "Designer", country: "India", state: "Tamil Nadu", city: "Chennai", smoking: "No", drinking: "No", religion: "Hindu", community: "Naidu", caste: "Balija", image: "./src/images/girl1.jpg" },
    { id: 3, name: "Rahul", gender: "Male", motherTongue: "Hindi", age: 30, height: "6'0", income: "15L", education: "PhD", profession: "Professor", country: "India", state: "Delhi", city: "Delhi", smoking: "Yes", drinking: "No", religion: "Hindu", community: "Punjabi", caste: "Khatri", image: "./src/images/boy2.png" },
    { id: 4, name: "Priya", gender: "Female", motherTongue: "Hindi", age: 27, height: "5'5", income: "12L", education: "M.Sc", profession: "Doctor", country: "India", state: "Maharashtra", city: "Mumbai", smoking: "No", drinking: "No", religion: "Christian", community: "Catholic", caste: "Latin Catholic", image: "./src/images/girl2.png" },
    { id: 5, name: "Karan", gender: "Male", motherTongue: "Punjabi", age: 29, height: "5'10", income: "20L", education: "MBA", profession: "Manager", country: "India", state: "Punjab", city: "Amritsar", smoking: "No", drinking: "Yes", religion: "Hindu", community: "Jat", caste: "Jat Sikh", image: "./src/images/boy3.png" },
    { id: 6, name: "Anita", gender: "Female", motherTongue: "Malayalam", age: 26, height: "5'3", income: "9L", education: "B.A", profession: "Teacher", country: "India", state: "Kerala", city: "Kochi", smoking: "No", drinking: "No", religion: "Hindu", community: "Nair", caste: "Nair", image: "./src/images/girl3.png" },
    { id: 7, name: "Vikram", gender: "Male", motherTongue: "Telugu", age: 32, height: "5'11", income: "18L", education: "M.Tech", profession: "Software Architect", country: "India", state: "Telangana", city: "Hyderabad", smoking: "No", drinking: "No", religion: "Hindu", community: "Reddy", caste: "Reddy", image: "./src/images/boy4.jpg" },
    { id: 8, name: "Meera", gender: "Female", motherTongue: "Gujarati", age: 24, height: "5'2", income: "7L", education: "B.Com", profession: "Chartered Accountant", country: "India", state: "Gujarat", city: "Ahmedabad", smoking: "No", drinking: "Yes", religion: "Christian", community: "Shwetambar", caste: "Shah", image: "./src/images/girl4.png" },
    { id: 9, name: "Siddharth", gender: "Male", motherTongue: "Hindi", age: 31, height: "6'1", income: "22L", education: "MBA", profession: "Entrepreneur", country: "India", state: "Haryana", city: "Gurgaon", smoking: "Yes", drinking: "Yes", religion: "Hindu", community: "Baniya", caste: "Agarwal", image: "./src/images/boy5.jpg" },
    { id: 10, name: "Radhika", gender: "Female", motherTongue: "Bengali", age: 29, height: "5'6", income: "14L", education: "LLB", profession: "Lawyer", country: "India", state: "West Bengal", city: "Kolkata", smoking: "No", drinking: "Yes", religion: "Hindu", community: "Kayastha", caste: "Kayastha", image: "./src/images/girl5.jpg" },
    { id: 11, name: "Manoj", gender: "Male", motherTongue: "Hindi", age: 27, height: "5'8", income: "11L", education: "B.E", profession: "Civil Engineer", country: "India", state: "Rajasthan", city: "Jaipur", smoking: "No", drinking: "No", religion: "Hindu", community: "Rajput", caste: "Rajput", image: "./src/images/boy6.png" },
    { id: 12, name: "Divya", gender: "Female", motherTongue: "Hindi", age: 28, height: "5'5", income: "13L", education: "MCA", profession: "Data Scientist", country: "India", state: "Uttar Pradesh", city: "Lucknow", smoking: "No", drinking: "No", religion: "Muslim", community: "Baniya", caste: "Agarwal", image: "./src/images/girl6.jpg" }
];

// Active profiles list (populated from backend or demo data)
var profiles = [];

/**
 * Fetch profiles from backend. Falls back to demo data.
 */
function loadProfiles(filters) {
    var query = '';
    if (filters) {
        var params = [];
        for (var key in filters) {
            if (filters.hasOwnProperty(key) && filters[key]) {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(filters[key]));
            }
        }
        if (params.length) query = '?' + params.join('&');
    }

    return KV.api.get('php/profile/get-profiles.php' + query)
        .then(function (res) {
            if (res.success && res.profiles) {
                profiles = res.profiles;
            } else {
                // Backend not ready — use demo data
                profiles = DEMO_PROFILES;
                if (filters) {
                    profiles = filterLocally(profiles, filters);
                }
            }
            return profiles;
        })
        .catch(function () {
            profiles = DEMO_PROFILES;
            if (filters) {
                profiles = filterLocally(profiles, filters);
            }
            return profiles;
        });
}

/**
 * Client-side filter fallback (used when backend is not available).
 */
function filterLocally(list, filters) {
    return list.filter(function (p) {
        if (filters.gender && filters.gender !== "Select Gender" && p.gender !== filters.gender) return false;
        if (filters.ageRange && filters.ageRange !== "Select Age") {
            if (filters.ageRange === '18-25' && (p.age < 18 || p.age > 25)) return false;
            if (filters.ageRange === '26-35' && (p.age < 26 || p.age > 35)) return false;
            if (filters.ageRange === '36+' && p.age < 36) return false;
        }
        if (filters.age && p.age != filters.age) return false;
        if (filters.religion && filters.religion !== "Select Religion" && filters.religion !== 'Other' && p.religion !== filters.religion) return false;
        if (filters.motherTongue && filters.motherTongue !== "Mother Tongue" && filters.motherTongue !== 'Other' && p.motherTongue !== filters.motherTongue) return false;
        if (filters.height && !p.height.includes(filters.height)) return false;
        if (filters.income && !p.income.includes(filters.income)) return false;
        if (filters.education && !p.education.toLowerCase().includes(filters.education.toLowerCase())) return false;
        if (filters.profession && !p.profession.toLowerCase().includes(filters.profession.toLowerCase())) return false;
        if (filters.country && !p.country.toLowerCase().includes(filters.country.toLowerCase())) return false;
        if (filters.state && !p.state.toLowerCase().includes(filters.state.toLowerCase())) return false;
        if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.community && !p.community.toLowerCase().includes(filters.community.toLowerCase())) return false;
        if (filters.caste && !p.caste.toLowerCase().includes(filters.caste.toLowerCase())) return false;
        return true;
    });
}

function renderProfiles(list) {
    const container = document.getElementById("profilesContainer");
    if (!container) return; // if we are on a page without profilesContainer
    
    container.innerHTML = "";
    document.getElementById("profileCount").innerText = 'Profiles Found: ' + list.length;

    if (!list.length) {
        container.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted fs-5">No profiles match your search criteria. Try adjusting the filters.</p></div>';
        return;
    }

    list.forEach(function (p, index) {
        var profileId = p.id || index;
        var isPremium = index % 3 === 0; // Highlight some profiles
        var badgeHTML = isPremium 
            ? '<div class="profile-badge-premium"><i class="fas fa-crown me-1"></i>Royal Premium</div>'
            : '<div class="profile-badge-verified"><i class="fas fa-check-circle me-1"></i>Verified</div>';

        var card = document.createElement("div");
        card.className = "col-xl-4 col-md-6 mb-4";
        card.setAttribute("data-aos", "zoom-in");
        card.innerHTML = '\
          <div class="card profile-card h-100 border-0 shadow-sm overflow-hidden ' + (isPremium ? 'premium-card-border' : '') + '">\
            <div class="position-relative overflow-hidden card-img-wrapper">\
              <img src="' + p.image + '" class="card-img-top" alt="' + p.name + '">\
              ' + badgeHTML + '\
            </div>\
            <div class="card-body d-flex flex-column p-4">\
              <div class="d-flex justify-content-between align-items-center mb-2">\
                <h5 class="card-title mb-0 fw-bold">' + p.name + '</h5>\
                <span class="text-muted small"><i class="bi bi-geo-alt-fill text-accent-color me-1"></i>' + p.city + '</span>\
              </div>\
              <p class="card-text text-muted mb-3 small">\
                ' + p.age + ' Yrs • ' + p.height + ' • ' + p.religion + ' • ' + p.motherTongue + '\
              </p>\
              \
              <a href="profile-details.html?id=' + profileId + '" class="btn btn-main mt-auto view-btn">View Profile</a>\
              \
              <div class="details mt-3" id="details-' + index + '">\
                <div class="details-divider mb-3"></div>\
                <div class="row g-2 text-start small mb-3">\
                  <div class="col-6"><strong>Income:</strong> ' + p.income + '</div>\
                  <div class="col-6"><strong>Education:</strong> ' + p.education + '</div>\
                  <div class="col-6"><strong>Profession:</strong> ' + p.profession + '</div>\
                  <div class="col-6"><strong>Caste:</strong> ' + p.caste + '</div>\
                  <div class="col-6"><strong>Community:</strong> ' + p.community + '</div>\
                  <div class="col-6"><strong>State:</strong> ' + p.state + '</div>\
                  <div class="col-6"><strong>Smoking:</strong> ' + p.smoking + '</div>\
                  <div class="col-6"><strong>Drinking:</strong> ' + p.drinking + '</div>\
                </div>\
                \
                <div class="d-flex gap-2">\
                  <button class="btn btn-send flex-grow-1 send-interest-btn" data-profile-id="' + profileId + '"><i class="fas fa-heart me-1"></i>Connect</button>\
                  <button class="btn btn-less view-less-btn" data-index="' + index + '"><i class="fas fa-chevron-up"></i></button>\
                </div>\
              </div>\
            </div>\
          </div>';
        container.appendChild(card);
    });

    // open one card at a time
    document.querySelectorAll(".view-btn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            // If it's a link with href, let it navigate; otherwise toggle details
            if (this.tagName === 'A' && this.href) return;
            e.preventDefault();
            var i = this.dataset.index;
            document.querySelectorAll(".details").forEach(function (d) { d.style.display = "none"; });
            document.querySelectorAll(".view-btn").forEach(function (b) { b.style.display = "block"; });
            this.style.display = "none";
            document.getElementById('details-' + i).style.display = "block";
        });
    });
    
    document.querySelectorAll(".view-less-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var i = this.dataset.index;
            document.getElementById('details-' + i).style.display = "none";
            var viewBtn = document.querySelector('.view-btn[data-index="' + i + '"]');
            if (viewBtn) viewBtn.style.display = "block";
        });
    });

    // ── Send interest from profile card ──
    document.querySelectorAll(".send-interest-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var profileId = this.dataset.profileId;
            var button = this;
            button.disabled = true;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Sending...';

            KV.api.post('php/interests/send.php', { receiver_id: profileId })
                .then(function (res) {
                    if (res.success) {
                        button.innerHTML = '<i class="fas fa-check me-1"></i>Interest Sent';
                        button.classList.add('sent');
                        KV.showToast('Interest sent successfully!', 'success');
                    } else {
                        button.disabled = false;
                        button.innerHTML = '<i class="fas fa-heart me-1"></i>Connect';
                    }
                });
        });
    });
}

// Filter logic
function applyFilters(source) {
    var form = document.getElementById(source === 'desktop' ? 'filterFormDesktop' : 'filterFormMobile');
    if (!form) return;
    var data = new FormData(form);
    var filters = Object.fromEntries(data.entries());

    loadProfiles(filters).then(function (result) {
        renderProfiles(result);
        var section = document.getElementById("profilesSection");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// Banner search filter
function bannerSearch(event) {
    event.preventDefault(); // prevent page reload

    var form = document.getElementById('filterFormBanner');
    if (!form) return;
    var data = new FormData(form);
    var filters = Object.fromEntries(data.entries());

    var container = document.getElementById("profilesContainer");
    if (!container) {
        // We are on index.html, save filters to sessionStorage and redirect
        sessionStorage.setItem("matrimony_search_gender", filters.gender || "");
        sessionStorage.setItem("matrimony_search_ageRange", filters.ageRange || "");
        sessionStorage.setItem("matrimony_search_religion", filters.religion || "");
        sessionStorage.setItem("matrimony_search_motherTongue", filters.motherTongue || "");
        window.location.href = "profiles.html";
    } else {
        loadProfiles(filters).then(function (result) {
            renderProfiles(result);
            form.reset();
            var section = document.getElementById("profilesSection");
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}

// Init
$(document).ready(function () {
    // If profiles page, load filters from session storage
    var container = document.getElementById("profilesContainer");
    if (container) {
        // Initialize bootstrap-select elements
        $('#filterFormDesktop .selectpicker, #filterFormMobile .selectpicker').selectpicker();

        // Check if there was a banner search from home page
        var bGender = sessionStorage.getItem("matrimony_search_gender");
        var bAgeRange = sessionStorage.getItem("matrimony_search_ageRange");
        var bReligion = sessionStorage.getItem("matrimony_search_religion");
        var bMotherTongue = sessionStorage.getItem("matrimony_search_motherTongue");

        var searchFilters = null;
        if (bGender || bAgeRange || bReligion || bMotherTongue) {
            searchFilters = {
                gender: bGender,
                ageRange: bAgeRange,
                religion: bReligion,
                motherTongue: bMotherTongue
            };
            // Clear storage
            sessionStorage.removeItem("matrimony_search_gender");
            sessionStorage.removeItem("matrimony_search_ageRange");
            sessionStorage.removeItem("matrimony_search_religion");
            sessionStorage.removeItem("matrimony_search_motherTongue");
        }

        // Fetch profiles from backend (with optional filters)
        loadProfiles(searchFilters).then(function (result) {
            renderProfiles(result);
        });

        $('#filterOffcanvas').on('hidden.bs.offcanvas', function () {
            document.getElementById('filterFormMobile').reset();
        });
    }
});
