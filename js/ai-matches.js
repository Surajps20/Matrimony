// =======================================
// Kalyana Varan AI Matches
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    // Elements
    const startBtn = document.querySelector(".hero-buttons .primary-btn");

    const analysisSection = document.querySelector(".analysis-section");

    const loadingSection = document.getElementById("aiLoadingSection");

    const loadingBar = document.getElementById("loadingBar");

    const loadingPercent = document.getElementById("loadingPercent");

    const loadingText = document.getElementById("loadingText");

    const bestMatch = document.querySelector(".best-match-section");

    const report = document.querySelector(".ai-report-section");

    const recommended = document.querySelector(".recommended-section");

    // AI Messages

    const messages = [

        "Reading Your Profile...",

        "Checking Education...",

        "Checking Family Details...",

        "Matching Partner Preference...",

        "Comparing Lifestyle...",

        "Searching 12,486 Profiles...",

        "Finding Best Match...",

        "Generating AI Report..."

    ];

    // Button Click

    if(startBtn){

        startBtn.addEventListener("click",function(){

            // Hide analysis

            if(analysisSection){

                analysisSection.style.display="none";

            }

            // Show loading

            if(loadingSection){

                loadingSection.style.display="block";

            }

            let progress=0;

            let messageIndex=0;

            const timer=setInterval(function(){

                progress++;

                if(loadingBar){

                    loadingBar.style.width=progress+"%";

                }

                if(loadingPercent){

                    loadingPercent.innerHTML=progress+"%";

                }

                if(progress%15===0){

                    if(messageIndex<messages.length){

                        loadingText.innerHTML=messages[messageIndex];

                        messageIndex++;

                    }

                }

                if(progress>=100){

                    clearInterval(timer);

                    // Hide loading

                    if(loadingSection){

                        loadingSection.style.display="none";

                    }

                    // Show Result Sections

                    if(bestMatch){

                        bestMatch.style.display="block";

                    }

                    if(report){

                        report.style.display="block";

                    }

                    if(recommended){

                        recommended.style.display="block";

                    }

                    // Scroll

                    bestMatch.scrollIntoView({

                        behavior:"smooth"

                    });

                }

            },40);

        });

    }

    // ==========================
    // View Profile Buttons
    // ==========================

    document.querySelectorAll(".view-profile").forEach(function(button){

        button.addEventListener("click",function(){

            window.location.href="profile-details.html";

        });

    });

    // ==========================
    // Send Interest Buttons
    // ==========================

    document.querySelectorAll(".send-interest").forEach(function(button){

        button.addEventListener("click",function(){

            this.innerHTML="✔ Interest Sent";

            this.disabled=true;

            this.classList.remove("outline-btn");

            this.classList.add("btn","btn-success");

        });

    });

});