/* =========================================
   TheKRdeck - Global Main JavaScript (Pure Offline Version)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
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
            img: "assets/zap-mascot.png",
            tips: [
                "Looking for specific notes? Try using our <a href='search.html' style='color:#0d1b3e; font-weight:bold; text-decoration:underline;'>Search Bar</a> above to quickly filter through subjects!",
                "Need curriculum resources? Check out our <a href='index.html#hubs' style='color:#0d1b3e; font-weight:bold; text-decoration:underline;'>Department Hubs</a> for Pre-School, Primary, and JHS levels."
            ],
            defaultGreeting: "Akwaaba! I'm Zap, your platform guide. Click me for tips!"
        },
        {
            name: "Mansa",
            img: "assets/mansa-mascot.png",
            tips: [
                "Welcome! You can search for any topic across our database using the <a href='search.html' style='color:#0d1b3e; font-weight:bold; text-decoration:underline;'>Search page</a>.",
                "Explore our curriculum-aligned hubs to find schemes of work, lesson notes, and exercises."
            ],
            defaultGreeting: "Akwaaba! I'm Mansa. Click me for some quick tips!"
        }
    ];

    const currentMascot = mascotData[Math.floor(Math.random() * mascotData.length)];

    const mascotHTML = `
        <div class="mascot-container" id="mascot-guide" style="position: fixed !important; bottom: 10px !important; right: 10px !important; z-index: 9999 !important; display: flex !important; flex-direction: column !important; align-items: flex-end !important; gap: 12px !important;">
            <div class="speech-bubble" id="speech-bubble" style="cursor: pointer; position: relative; background: #ffffff; color: #0d1b3e; padding: 16px 20px; border-radius: 16px; max-width: 280px; box-shadow: 0 6px 20px rgba(0,0,0,0.25); border: 3px solid #f5c518; font-size: 0.95rem; display: block !important; visibility: visible !important; opacity: 1 !important;">
                <button class="close-btn" id="mascot-close" style="position: absolute; top: -10px; left: -10px; background: #0d1b3e; color: #fff; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">&times;</button>
                <p id="mascot-text" style="margin: 0;">${currentMascot.defaultGreeting}</p>
            </div>
            <div class="mascot-avatars">
                <img src="${currentMascot.img}" alt="${currentMascot.name}" class="mascot-img" id="mascot-avatar" title="${currentMascot.name}" style="width: 100px; height: 100px; object-fit: contain; cursor: pointer; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35)); transition: transform 0.3s ease; background: rgba(255,255,255,0.9); border-radius: 50%; padding: 6px; border: 3px solid #f5c518;">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", mascotHTML);

    const mascotContainer = document.getElementById("mascot-guide");
    const mascotAvatar = document.getElementById("mascot-avatar");
    const speechBubble = document.getElementById("speech-bubble");
    const mascotClose = document.getElementById("mascot-close");
    const mascotText = document.getElementById("mascot-text");

    if (mascotClose) {
        mascotClose.addEventListener("click", (e) => {
            e.stopPropagation();
            speechBubble.style.setProperty("display", "none", "important");
            mascotAvatar.style.transform = "scale(0.9) rotate(0deg)";
        });
    }

    function triggerMascotInteraction() {
        const randomTip = currentMascot.tips[Math.floor(Math.random() * currentMascot.tips.length)];
        mascotText.innerHTML = `<strong>${currentMascot.name}:</strong> ${randomTip}`;
        speechBubble.style.setProperty("display", "block", "important");
        mascotAvatar.style.transform = "scale(1.15) rotate(4deg)";
    }

    if (mascotContainer) {
        mascotContainer.addEventListener("mouseleave", () => {
            if (speechBubble.style.display !== "none") {
                mascotAvatar.style.transform = "scale(1) rotate(0deg)";
            }
        });
    }

    if (mascotAvatar) {
        mascotAvatar.addEventListener("click", triggerMascotInteraction);
    }

    if (speechBubble) {
        speechBubble.addEventListener("click", (e) => {
            if (e.target.tagName.toLowerCase() === 'a') return; 
            triggerMascotInteraction();
        });
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

        window.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.style.display = 'none';
            }
        });
    }
});