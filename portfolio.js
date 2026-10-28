(() => {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    document.querySelectorAll("#currentYear, #year").forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });

    document.querySelectorAll(".menu-toggle").forEach((button) => {
        const navId = button.getAttribute("aria-controls");
        const nav = navId ? document.getElementById(navId) : null;

        if (!nav) return;

        const setMenuOpen = (isOpen) => {
            nav.classList.toggle("open", isOpen);
            button.setAttribute("aria-expanded", String(isOpen));
            button.setAttribute(
                "aria-label",
                isOpen ? "Fermer le menu" : "Ouvrir le menu"
            );

            const icon = button.querySelector("i");
            if (icon) icon.className = `fas ${isOpen ? "fa-xmark" : "fa-bars"}`;
        };

        button.addEventListener("click", () => {
            setMenuOpen(button.getAttribute("aria-expanded") !== "true");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenuOpen(false));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        });
    });

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const filterMessage = document.getElementById("filterMessage");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            let visibleCount = 0;

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });

            projectCards.forEach((card) => {
                const isVisible =
                    filter === "all" || card.dataset.category === filter;
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });

            if (filterMessage) {
                filterMessage.textContent =
                    filter === "all"
                        ? "Tous les projets sont affichés."
                        : `${visibleCount} projet(s) affiché(s).`;
            }
        });
    });

    const modal = document.getElementById("photoModal");
    const modalImage = document.getElementById("modalImage");
    const closeButton = document.getElementById("closeModalBtn");

    if (modal && modalImage && closeButton) {
        let lastFocusedElement = null;
        let previousBodyOverflow = "";

        const closePhoto = () => {
            if (!modal.classList.contains("active")) return;

            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            modalImage.removeAttribute("src");
            document.body.style.overflow = previousBodyOverflow;
            lastFocusedElement?.focus();
        };

        document.querySelectorAll(".gallery-item").forEach((item) => {
            item.addEventListener("click", () => {
                lastFocusedElement = item;
                previousBodyOverflow = document.body.style.overflow;
                modalImage.src = item.dataset.full;
                modalImage.alt = item.dataset.alt || "Photo agrandie";
                modal.classList.add("active");
                modal.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
                closeButton.focus();
            });
        });

        closeButton.addEventListener("click", closePhoto);

        modal.addEventListener("click", (event) => {
            if (event.target === modal) closePhoto();
        });

        document.addEventListener("keydown", (event) => {
            if (!modal.classList.contains("active")) return;

            if (event.key === "Escape") {
                closePhoto();
            } else if (event.key === "Tab") {
                event.preventDefault();
                closeButton.focus();
            }
        });
    }

    if (!reducedMotion && "IntersectionObserver" in window) {
        const revealItems = document.querySelectorAll(
            "main h2, main section:not(.hero) h1, .content-card, .value-card, " +
            ".skill-card, .timeline-item, .interest-card, .project-card, " +
            ".gallery-item, .contact-card, .availability-box, .video-card, .goal-box"
        );

        if (revealItems.length > 0) {
            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    });
                },
                { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
            );

            revealItems.forEach((element) => {
                const siblingIndex = Array.from(element.parentElement.children)
                    .filter((sibling) => sibling.matches(element.tagName))
                    .indexOf(element);
                const stagger = Math.max(siblingIndex, 0) * 70;

                element.dataset.reveal = "";
                element.style.setProperty(
                    "--reveal-delay",
                    `${Math.min(stagger, 280)}ms`
                );
                revealObserver.observe(element);
            });

            document.body.classList.add("js-motion");
        }
    }
})();
