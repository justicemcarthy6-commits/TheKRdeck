/* =========================================
   TheKRdeck - Global Main JavaScript (Pure Offline Version)
   ========================================= */

// Work out the folder main.js itself lives in (the site root), so asset
// paths like the mascot images resolve correctly no matter how deep the
// current page is nested (root page vs. /lessons/...) AND whether the
// site is opened as a real URL or a local file:// path. A leading "/"
// only means "site root" over http(s) — under file:// it means "root of
// the whole computer," which is why that approach broke locally.
// This must run here, at the top level, while document.currentScript is
// still valid — it stops working once we're inside an event callback.
const KRDECK_BASE_PATH = (function () {
    let scriptEl = document.currentScript;
    if (!scriptEl) {
        const scripts = document.getElementsByTagName("script");
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src && scripts[i].src.split("?")[0].endsWith("main.js")) {
                scriptEl = scripts[i];
                break;
            }
        }
    }
    if (!scriptEl || !scriptEl.src) return "";
    return scriptEl.src.replace(/main\.js(\?.*)?$/, "");
})();

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");

    if (mobileMenu && navLinks) {
        mobileMenu.setAttribute("role", "button");
        mobileMenu.setAttribute("tabindex", "0");
        mobileMenu.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-label", "Toggle navigation menu");

        const toggleMenu = () => {
            const isOpen = navLinks.classList.toggle("active");
            mobileMenu.setAttribute("aria-expanded", String(isOpen));
        };

        mobileMenu.addEventListener("click", toggleMenu);
        mobileMenu.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    // 2. Reading Progress Bar
    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById("myBar");
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

    // 3. Back to Top Button
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 4. Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // 5. Interactive Randomized General Tour Guide Mascots (Zap & Mansa) - Brute Force Visibility
    const mascotData = [
        {
            name: "Zap",
            img: KRDECK_BASE_PATH + "assets/zap-mascot.png",
            tips: [
                "Looking for specific notes? Try using our <a href='" + KRDECK_BASE_PATH + "search.html' style='color:#0d1b3e; font-weight:bold; text-decoration:underline;'>Search Bar</a> above to quickly filter through subjects!",
                "Need curriculum resources? Check out our <a href='" + KRDECK_BASE_PATH + "index.html#hubs' style='color:#0d1b3e; font-weight:bold; text-decoration:underline;'>Department Hubs</a> for Pre-School, Primary, and JHS levels."
            ],
            defaultGreeting: "Akwaaba! I'm Zap, your platform guide. Click me for tips!"
        },
        {
            name: "Mansa",
            img: KRDECK_BASE_PATH + "assets/mansa-mascot.png",
            tips: [
                "Welcome! You can search for any topic across our database using the <a href='" + KRDECK_BASE_PATH + "search.html' style='color:#0d1b3e; font-weight:bold; text-decoration:underline;'>Search page</a>.",
                "Explore our curriculum-aligned hubs to find schemes of work, lesson notes, and exercises."
            ],
            defaultGreeting: "Akwaaba! I'm Mansa. Click me for some quick tips!"
        }
    ];

    const currentMascot = mascotData[Math.floor(Math.random() * mascotData.length)];

    // Only inject the generic tour-guide mascot if this page doesn't already
    // have its own hand-built one (e.g. a lesson page with a custom greeting,
    // quiz button, or search form baked into #mascot-guide). Two elements
    // sharing the id="mascot-guide" would silently break each other.
    if (!document.getElementById("mascot-guide")) {
        const mascotHTML = `
            <div class="mascot-container show-tip" id="mascot-guide" data-auto-generated="true">
                <div class="speech-bubble" id="speech-bubble">
                    <button class="close-btn" id="mascot-close" aria-label="Close tip">&times;</button>
                    <p id="mascot-text" style="margin: 0;">${currentMascot.defaultGreeting}</p>
                </div>
                <div class="mascot-avatars">
                    <img src="${currentMascot.img}" alt="${currentMascot.name}" class="mascot-img" id="mascot-avatar" title="${currentMascot.name}" loading="lazy">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", mascotHTML);
    }

    const mascotContainer = document.getElementById("mascot-guide");
    const mascotAvatar = document.getElementById("mascot-avatar");
    const speechBubble = document.getElementById("speech-bubble");
    const mascotClose = document.getElementById("mascot-close");
    const mascotText = document.getElementById("mascot-text");

    // Everything below only applies to the auto-generated mascot. A page
    // with its own custom mascot markup is wired separately, further down.
    if (mascotContainer && mascotContainer.dataset.autoGenerated === "true") {
    if (mascotClose) {
        mascotClose.addEventListener("click", (e) => {
            e.stopPropagation();
            mascotContainer.classList.remove("show-tip");
            mascotAvatar.style.transform = "scale(0.9) rotate(0deg)";
        });
    }

    function triggerMascotInteraction() {
        const randomTip = currentMascot.tips[Math.floor(Math.random() * currentMascot.tips.length)];
        mascotText.innerHTML = `<strong>${currentMascot.name}:</strong> ${randomTip}`;
        mascotContainer.classList.add("show-tip");
        mascotAvatar.style.transform = "scale(1.15) rotate(4deg)";
    }

    mascotContainer.addEventListener("mouseleave", () => {
        if (mascotContainer.classList.contains("show-tip")) {
            mascotAvatar.style.transform = "scale(1) rotate(0deg)";
        }
    });

    if (mascotAvatar) {
        mascotAvatar.addEventListener("click", triggerMascotInteraction);
    }

    if (speechBubble) {
        speechBubble.addEventListener("click", (e) => {
            if (e.target.tagName.toLowerCase() === 'a') return; 
            triggerMascotInteraction();
        });
    }
    }

    // 5b. Custom Per-Lesson Mascot (for pages like lesson-template.html that
    // hand-build their own #mascot-guide with a lesson-specific greeting,
    // instead of using the generic tour guide above).
    if (mascotContainer && mascotContainer.dataset.autoGenerated !== "true") {
        const lessonMascotImg = document.getElementById("mascot-img");
        const lessonCloseBtn = document.getElementById("close-mascot");

        mascotContainer.classList.remove("hidden");
        setTimeout(() => {
            mascotContainer.classList.add("show-tip", "slide-up");
        }, 600);

        if (lessonMascotImg) {
            lessonMascotImg.addEventListener("click", () => {
                mascotContainer.classList.toggle("show-tip");
            });
        }
        if (lessonCloseBtn) {
            lessonCloseBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                mascotContainer.classList.remove("show-tip");
            });
        }
    }

    // 5c. Lesson Star Tracker & Quiz Button
    // Only runs on lesson pages that actually have a #star-score element and
    // a quiz button — everywhere else this quietly does nothing.
    const starScoreEl = document.getElementById("star-score");
    if (starScoreEl) {
        let stars = parseInt(localStorage.getItem("krdeck-stars") || "0", 10);
        starScoreEl.textContent = stars;

        const quizBtn = document.querySelector(".lesson-actions .btn-gold");
        if (quizBtn) {
            quizBtn.addEventListener("click", () => {
                stars += 1;
                localStorage.setItem("krdeck-stars", stars);
                starScoreEl.textContent = stars;

                if (typeof confetti === "function") {
                    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
                }
            });
        }
    }

    // 6. Smooth Banner Animation
    const bannerStyle = document.createElement('style');
    bannerStyle.innerHTML = `
        @keyframes slideFadeDown {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animated-banner {
            animation: slideFadeDown 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
    `;
    document.head.appendChild(bannerStyle);

    const bannerElement = document.querySelector('.hero-banner'); 
    if (bannerElement) {
        bannerElement.classList.add('animated-banner');
    }

    // 7. Project Submission Popup Modal Logic
    const projectModal = document.getElementById('projectModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (openModalBtn && projectModal && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            projectModal.style.display = 'flex';
        });

        closeModalBtn.addEventListener('click', () => {
            projectModal.style.display = 'none';
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.style.display === 'flex') {
                projectModal.style.display = 'none';
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.style.display = 'none';
            }
        });
    }

    // 8. Contact Form Validation & AJAX Submission (Email-less Version)
    const form = document.getElementById('contactForm');
    if (form) {
        const msgInput = document.getElementById('userMessage');
        const msgError = document.getElementById('msgError');
        const honeypot = form.querySelector('input[name="_honey"]');
        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            let isValid = true;

            // Honeypot check
            if (honeypot && honeypot.value !== "") {
                console.warn("Spam detected. Submission blocked.");
                return false;
            }

            // Message validation
            if (msgInput.value.trim() === "") {
                msgError.style.display = 'block';
                isValid = false;
            } else {
                msgError.style.display = 'none';
            }

            // If valid, submit via Fetch (AJAX) to Formspree silently
            if (isValid) {
                submitBtn.textContent = "Sending...";
                submitBtn.disabled = true;
                
                const formData = new FormData(form);

                try {
                    const response = await fetch(form.action, {
                        method: form.method,
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Success! Redirect to Netlify success page
                        window.location.href = "https://thekrdeck.netlify.app/success.html";
                    } else {
                        const data = await response.json();
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data.errors.map(error => error.message).join(", ");
                        } else {
                            formStatus.textContent = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.style.display = "block";
                        formStatus.style.color = "#d9534f";
                        submitBtn.textContent = "Send Proposal 🚀";
                        submitBtn.disabled = false;
                    }
                } catch (error) {
                    formStatus.textContent = "Oops! There was a network problem.";
                    formStatus.style.display = "block";
                    formStatus.style.color = "#d9534f";
                    submitBtn.textContent = "Send Proposal 🚀";
                    submitBtn.disabled = false;
                }
            }
        });
    }
});