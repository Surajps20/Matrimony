// ======================================
// Kalyana Varan Matrimony
// Complete Profile Wizard
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const pages = document.querySelectorAll(".wizard-page");
    const steps = document.querySelectorAll(".step-item");
    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    let currentStep = 0;

    // ================================
    // Show Step
    // ================================

    function showStep(index){

        pages.forEach(page=>{

            page.classList.remove("active");

        });

        pages[index].classList.add("active");

        steps.forEach((step,i)=>{

            step.classList.remove("active");
            step.classList.remove("completed");

            if(i<index){

                step.classList.add("completed");

            }

            if(i===index){

                step.classList.add("active");

            }

        });

        const percentage=((index+1)/pages.length)*100;

        progressBar.style.width=percentage+"%";

        progressText.innerHTML=Math.round(percentage)+"%";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    // ================================
    // Next
    // ================================

    nextButtons.forEach(button=>{

        button.addEventListener("click",function(){

            if(!validateStep(currentStep))
                return;

            if(currentStep<pages.length-1){

                currentStep++;

                showStep(currentStep);

            }

        });

    });

    // ================================
    // Previous
    // ================================

    prevButtons.forEach(button=>{

        button.addEventListener("click",function(){

            if(currentStep>0){

                currentStep--;

                showStep(currentStep);

            }

        });

    });


        // =====================================
    // Profile Image Preview
    // =====================================

    const profileImage = document.getElementById("profileImage");
    const previewImage = document.getElementById("previewImage");

    if(profileImage && previewImage){

        profileImage.addEventListener("change",function(){

            const file=this.files[0];

            if(file){

                const reader=new FileReader();

                reader.onload=function(e){

                    previewImage.src=e.target.result;

                }

                reader.readAsDataURL(file);

            }

        });

    }

    // =====================================
    // Auto Age Calculator
    // =====================================

    const dob=document.getElementById("dob");
    const age=document.getElementById("age");

    if(dob && age){

        dob.addEventListener("change",function(){

            const birthDate=new Date(this.value);

            const today=new Date();

            let years=today.getFullYear()-birthDate.getFullYear();

            const month=today.getMonth()-birthDate.getMonth();

            if(
                month<0 ||
                (month===0 && today.getDate()<birthDate.getDate())
            ){

                years--;

            }

            age.value=years;

        });

    }

    // =====================================
    // Step Validation
    // =====================================

    function validateStep(step){

    switch(step){

        // ==========================
        // STEP 1 - PERSONAL
        // ==========================
        case 0:

            if(document.getElementById("profileImage").files.length===0){
                alert("Please upload Profile Photo");
                return false;
            }

            if(document.getElementById("firstName").value.trim()==""){
                alert("Please enter First Name");
                return false;
            }

            if(document.getElementById("lastName").value.trim()==""){
                alert("Please enter Last Name");
                return false;
            }

            if(document.getElementById("gender").value==""){
                alert("Please select Gender");
                return false;
            }

            if(document.getElementById("dob").value==""){
                alert("Please select Date of Birth");
                return false;
            }

            if(document.querySelector('select[name="height"]').selectedIndex==0){
                alert("Please select Height");
                return false;
            }

            if(document.querySelector('input[name="weight"]').value.trim()==""){
                alert("Please enter Weight");
                return false;
            }

            if(document.querySelector('select[name="marital_status"]').selectedIndex==0){
                alert("Please select Marital Status");
                return false;
            }

            if(document.querySelector('select[name="religion"]').selectedIndex==0){
                alert("Please select Religion");
                return false;
            }

            if(document.querySelector('input[name="caste"]').value.trim()==""){
                alert("Please enter Caste");
                return false;
            }

            if(document.querySelector('select[name="mother_tongue"]').selectedIndex==0){
                alert("Please select Mother Tongue");
                return false;
            }

            return true;


        // ==========================
        // STEP 2 - FAMILY
        // ==========================
        case 1:

            if(document.querySelector('[name="father_name"]').value.trim()==""){
                alert("Please enter Father's Name");
                return false;
            }

            if(document.querySelector('[name="father_occupation"]').value.trim()==""){
                alert("Please enter Father's Occupation");
                return false;
            }

            if(document.querySelector('[name="father_education"]').value.trim()==""){
                alert("Please enter Father's Education");
                return false;
            }

            if(document.querySelector('[name="mother_name"]').value.trim()==""){
                alert("Please enter Mother's Name");
                return false;
            }

            if(document.querySelector('[name="mother_occupation"]').value.trim()==""){
                alert("Please enter Mother's Occupation");
                return false;
            }

            if(document.querySelector('[name="mother_education"]').value.trim()==""){
                alert("Please enter Mother's Education");
                return false;
            }

            if(document.querySelector('[name="family_type"]').selectedIndex==0){
                alert("Please select Family Type");
                return false;
            }

            if(document.querySelector('[name="family_status"]').selectedIndex==0){
                alert("Please select Family Status");
                return false;
            }

            if(document.querySelector('[name="native_place"]').value.trim()==""){
                alert("Please enter Native Place");
                return false;
            }

            return true;


        // ==========================
        // STEP 3 - CAREER
        // ==========================
        case 2:

            if(document.querySelector('[name="qualification"]').selectedIndex==0){
                alert("Please select Highest Qualification");
                return false;
            }

            if(document.querySelector('[name="college"]').value.trim()==""){
                alert("Please enter College / University");
                return false;
            }

            if(document.querySelector('[name="occupation"]').value.trim()==""){
                alert("Please enter Occupation");
                return false;
            }

            if(document.querySelector('[name="company"]').value.trim()==""){
                alert("Please enter Company Name");
                return false;
            }

            if(document.querySelector('[name="employment_type"]').selectedIndex==0){
                alert("Please select Employment Type");
                return false;
            }

            if(document.querySelector('[name="income"]').selectedIndex==0){
                alert("Please select Annual Income");
                return false;
            }

            if(document.querySelector('[name="work_location"]').value.trim()==""){
                alert("Please enter Work Location");
                return false;
            }

            if(document.querySelector('[name="about_me"]').value.trim()==""){
                alert("Please enter About Me");
                return false;
            }

            return true;


        // ==========================
        // STEP 4 - PARTNER
        // ==========================
        case 3:

            if(document.querySelector('[name="pref_age_from"]').selectedIndex==0){
                alert("Please select Preferred Age From");
                return false;
            }

            if(document.querySelector('[name="pref_age_to"]').selectedIndex==0){
                alert("Please select Preferred Age To");
                return false;
            }

            if(document.querySelector('[name="pref_height_from"]').selectedIndex==0){
                alert("Please select Preferred Height From");
                return false;
            }

            if(document.querySelector('[name="pref_height_to"]').selectedIndex==0){
                alert("Please select Preferred Height To");
                return false;
            }

            if(document.querySelector('[name="pref_religion"]').selectedIndex==0){
                alert("Please select Religion");
                return false;
            }

            if(document.querySelector('[name="pref_caste"]').value.trim()==""){
                alert("Please enter Preferred Caste");
                return false;
            }

            if(document.querySelector('[name="pref_mother_tongue"]').selectedIndex==0){
                alert("Please select Mother Tongue");
                return false;
            }

            if(document.querySelector('[name="pref_education"]').value.trim()==""){
                alert("Please enter Preferred Qualification");
                return false;
            }

            if(document.querySelector('[name="pref_occupation"]').value.trim()==""){
                alert("Please enter Preferred Occupation");
                return false;
            }

            if(document.querySelector('[name="pref_income"]').selectedIndex==0){
                alert("Please select Preferred Annual Income");
                return false;
            }

            if(document.querySelector('[name="pref_location"]').value.trim()==""){
                alert("Please enter Preferred Location");
                return false;
            }

            if(document.querySelector('[name="pref_expectations"]').value.trim()==""){
                alert("Please enter Expectations");
                return false;
            }

            return true;

    }
    
    return true;
    }

    // =====================================
    // Collect all wizard form data
    // =====================================

    function collectAllFormData() {
        var formData = new FormData();

        // Gather all form elements across all wizard steps
        var allForms = document.querySelectorAll('.step-content form');
        allForms.forEach(function (form) {
            var fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(function (field) {
                var name = field.name || field.id;
                if (!name) return;

                if (field.type === 'file') {
                    if (field.files && field.files.length > 0) {
                        for (var i = 0; i < field.files.length; i++) {
                            formData.append(name, field.files[i]);
                        }
                    }
                } else if (field.type === 'checkbox') {
                    formData.append(name, field.checked ? '1' : '0');
                } else {
                    formData.append(name, field.value);
                }
            });
        });

        return formData;
    }

    // =====================================
    // Final Submit
    // =====================================

    const form = document.getElementById("verificationForm");

    form.addEventListener("submit",function(e){

        e.preventDefault();

        const agree=document.getElementById("agreeTerms");

        if(agree && !agree.checked){

            alert("Please accept Terms & Conditions");

            return;

        }

        const finish=document.getElementById("completeProfile");

        finish.disabled=true;

        finish.innerHTML='<span class="spinner-border spinner-border-sm me-2"></span>Completing Profile...';

        // ── Collect all form data and submit to backend ──
        var formData = collectAllFormData();

        KV.api.upload('php/profile/complete-profile.php', formData)
            .then(function (res) {
                if (res.success) {
                    KV.showToast('Profile completed successfully!', 'success');
                    setTimeout(function () {
                        window.location.href = "dashboard.html";
                    }, 800);
                } else {
                    finish.disabled = false;
                    finish.innerHTML = 'Complete Profile';
                }
            });

    });

    // =====================================
    // Initialize
    // =====================================

    showStep(currentStep);

});