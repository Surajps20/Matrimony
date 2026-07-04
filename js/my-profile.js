document.addEventListener("DOMContentLoaded", function () {
  KVAuth.ready.then(function (user) {
    if (!user) return;

    KV.api.get('php/profile/get-profile.php?user_id=' + user.id)
      .then(function (res) {
        if (res.success && res.profile) {
          populateProfilePage(res.profile);
        }
      });
  });

  function populateProfilePage(p) {
    // 1. Update Header
    var nameHeader = document.querySelector('.profile-header h2');
    if (nameHeader) nameHeader.textContent = p.name || p.fullname || p.email;

    var idHeader = document.querySelector('.profile-header .profile-id strong');
    if (idHeader) {
      idHeader.textContent = p.id || 'KV100245';
    }

    var photoImg = document.querySelector('.profile-photo img');
    if (photoImg && p.photo) {
      photoImg.src = p.photo;
    }

    // 2. Map detail items
    document.querySelectorAll('.detail-item').forEach(function (item) {
      var labelEl = item.querySelector('label');
      var pEl = item.querySelector('p');
      if (!labelEl || !pEl) return;

      var label = labelEl.textContent.trim();
      var val = '';

      switch (label) {
        case 'Full Name':
          val = p.fullname || p.name || '';
          break;
        case 'Age':
          val = p.age ? (p.age + ' Years') : '';
          break;
        case 'Date of Birth':
          val = p.dob || '';
          break;
        case 'Height':
          val = p.height || '';
          break;
        case 'Religion':
          val = p.religion || '';
          break;
        case 'Caste':
          val = p.caste || '';
          break;
        case 'Community':
          val = p.community || '';
          break;
        case 'Mother Tongue':
          val = p.mother_tongue || p.motherTongue || p.mothertongue || '';
          break;
        case 'Marital Status':
          val = p.marital_status || p.maritalStatus || p.maritalstatus || '';
          break;
        case 'Location':
          val = p.city || p.location || '';
          break;
        case 'Highest Qualification':
          val = p.education || p.highestQualification || '';
          break;
        case 'College':
          val = p.college || '';
          break;
        case 'Occupation':
          val = p.profession || p.occupation || '';
          break;
        case 'Company':
          val = p.company || '';
          break;
        case 'Annual Income':
          val = p.income || p.annualIncome ? (p.income || p.annualIncome) : '';
          if (val && !val.includes('LPA') && !val.includes('₹') && !val.includes('L')) {
            val = '₹' + val + ' LPA';
          }
          break;
        case 'Experience':
          val = p.experience || '';
          break;
        case 'Father\'s Occupation':
          val = p.father_occupation || p.fatherOccupation || '';
          break;
        case 'Mother\'s Occupation':
          val = p.mother_occupation || p.motherOccupation || '';
          break;
        case 'Family Type':
          val = p.family_type || p.familyType || '';
          break;
        case 'Family Status':
          val = p.family_status || p.familyStatus || '';
          break;
        case 'Siblings':
          var bros = p.brothers !== undefined ? p.brothers : '';
          var sis = p.sisters !== undefined ? p.sisters : '';
          if (bros || sis) {
            var siblingDetails = [];
            if (bros && bros !== '0') siblingDetails.push(bros + ' Brother(s)');
            if (sis && sis !== '0') siblingDetails.push(sis + ' Sister(s)');
            val = siblingDetails.join(', ') || 'No Siblings';
          } else {
            val = p.siblings || '';
          }
          break;
        case 'Native Place':
          val = p.native_place || p.nativePlace || p.city || '';
          break;
        case 'Email':
          val = p.email || '';
          break;
        case 'Phone':
          val = p.mobile || p.phone || '';
          break;
        case 'Address':
          val = p.address || '';
          break;
        case 'Profile Visibility':
          val = p.visibility || 'Visible to Members';
          break;
      }

      if (val) {
        pEl.textContent = val;
      }
    });

    // 3. Map partner preference boxes
    document.querySelectorAll('.pref-box').forEach(function (box) {
      var labelEl = box.querySelector('label');
      var pEl = box.querySelector('p');
      if (!labelEl || !pEl) return;

      var label = labelEl.textContent.trim();
      var val = '';

      switch (label) {
        case 'Age':
          val = p.partnerAge || p.pref_age || '';
          break;
        case 'Height':
          val = p.partnerHeight || p.pref_height || '';
          break;
        case 'Religion':
          val = p.partnerReligion || p.pref_religion || '';
          break;
        case 'Education':
          val = p.partnerEducation || p.pref_education || '';
          break;
        case 'Occupation':
          val = p.partnerOccupation || p.pref_occupation || '';
          break;
        case 'Location':
          val = p.partnerLocation || p.pref_location || '';
          break;
      }

      if (val) {
        pEl.textContent = val;
      }
    });

    // 4. Update dynamic profile completion score
    var personal = !!(p.name || p.fullname || p.email);
    var education = !!(p.education || p.highestQualification || p.profession || p.occupation);
    var family = !!(p.fatherOccupation || p.motherOccupation || p.familyType);
    var preference = !!(p.partnerReligion || p.partnerEducation || p.partnerHeight);
    
    var photosCount = 0;
    try {
      var photos = JSON.parse(localStorage.getItem('kv_user_photos') || '[]');
      photosCount = photos.length;
    } catch (e) {}
    var uploadPhotos = photosCount > 0;
    
    var horoscope = !!p.horoscope || !!localStorage.getItem('kv_horoscope');

    var totalScore = 0;
    if (personal) totalScore += 25;
    if (education) totalScore += 15;
    if (family) totalScore += 15;
    if (preference) totalScore += 20;
    if (uploadPhotos) totalScore += 15;
    if (horoscope) totalScore += 10;

    var scorePctText = document.querySelector('.profile-header .d-flex strong');
    if (scorePctText) {
      scorePctText.textContent = totalScore + '%';
    }

    var scoreFill = document.querySelector('.profile-header .progress-bar');
    if (scoreFill) {
      scoreFill.style.width = totalScore + '%';
    }
  }
});
