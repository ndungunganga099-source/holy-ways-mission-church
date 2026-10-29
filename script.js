document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const scrollBtn = document.getElementById("scrollTopBtn");
    const header = document.querySelector("header");
    const galleryImages = [...document.querySelectorAll(".gallery-grid img")];
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close-lightbox");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            img.classList.add("is-missing");
        }, { once: true });
    });

    if (menuBtn && navLinks) {
        const menuIcon = menuBtn.querySelector("i");

        function closeMenu() {
            navLinks.classList.remove("active");
            document.body.classList.remove("menu-open");
            menuBtn.setAttribute("aria-expanded", "false");
            if (menuIcon) menuIcon.className = "fas fa-bars";
        }

        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");
            document.body.classList.toggle("menu-open", isOpen);
            menuBtn.setAttribute("aria-expanded", String(isOpen));
            if (menuIcon) menuIcon.className = isOpen ? "fas fa-xmark" : "fas fa-bars";
        });

        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) closeMenu();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (event) {
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) return;

            event.preventDefault();
            const headerOffset = 86;
            const offsetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });
    });

    function updateHeader() {
        if (!header) return;
        const isScrolled = window.scrollY > 40;
        header.style.background = isScrolled ? "rgba(11, 36, 71, 0.97)" : "rgba(11, 36, 71, 0.9)";
        header.style.boxShadow = isScrolled ? "0 12px 32px rgba(8, 13, 23, 0.22)" : "none";
    }

    function updateScrollButton() {
        if (!scrollBtn) return;
        scrollBtn.style.display = window.scrollY > 360 ? "block" : "none";
    }

    window.addEventListener("scroll", () => {
        updateHeader();
        updateScrollButton();
    }, { passive: true });

    updateHeader();
    updateScrollButton();

    if (scrollBtn) {
        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        let activeImageIndex = 0;
        const imageSources = galleryImages.map((img) => img.currentSrc || img.src);

        function updateLightboxView() {
            lightboxImg.src = imageSources[activeImageIndex];
            lightboxImg.alt = galleryImages[activeImageIndex].alt || "Gallery preview";
        }

        function openLightbox(index) {
            activeImageIndex = index;
            updateLightboxView();
            lightbox.classList.add("show");
        }

        function closeLightbox() {
            lightbox.classList.remove("show");
        }

        function showNextImage(event) {
            if (event) event.stopPropagation();
            activeImageIndex = (activeImageIndex + 1) % imageSources.length;
            updateLightboxView();
        }

        function showPrevImage(event) {
            if (event) event.stopPropagation();
            activeImageIndex = (activeImageIndex - 1 + imageSources.length) % imageSources.length;
            updateLightboxView();
        }

        galleryImages.forEach((img, index) => {
            img.addEventListener("click", (event) => {
                event.stopPropagation();
                openLightbox(index);
            });
        });

        if (nextBtn) nextBtn.addEventListener("click", showNextImage);
        if (prevBtn) prevBtn.addEventListener("click", showPrevImage);
        if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", closeLightbox);
        lightboxImg.addEventListener("click", (event) => event.stopPropagation());

        document.addEventListener("keydown", (event) => {
            if (!lightbox.classList.contains("show")) return;
            if (event.key === "ArrowRight") showNextImage();
            if (event.key === "ArrowLeft") showPrevImage();
            if (event.key === "Escape") closeLightbox();
        });
    }

    document.addEventListener("contextmenu", (event) => {
        if (event.target.tagName === "IMG" || event.target.tagName === "VIDEO") {
            event.preventDefault();
        }
    });

    document.querySelectorAll("img, video").forEach((asset) => {
        asset.addEventListener("dragstart", (event) => event.preventDefault());
    });

    const animatedElements = document.querySelectorAll(".section, .welcome, .event-card, .leader-card, .ministry-card");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible-element");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        animatedElements.forEach((element) => {
            element.classList.add("hidden-element");
            observer.observe(element);
        });
    }

    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.prepend(loader);

    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.remove(), 500);
        }, 250);
    });
});
