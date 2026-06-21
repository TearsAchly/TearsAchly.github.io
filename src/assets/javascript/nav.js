/* =========================================================
 * Sidebar + SPA Navigation
 * ========================================================= */

export const initSidebarNavigation = () => {
    const nav = document.querySelector("nav.navbar");
    const menuToggle = document.getElementById("menu-toggle");

    const navLinks = document.querySelectorAll(".nav-link-btn");
    const sections = document.querySelectorAll("main#main section");
    const main = document.getElementById("main");

    if (!nav || !menuToggle || !main) return;

    const openSidebar = () => {
        nav.classList.remove("closing");
        nav.classList.add("active");
    };

    const closeSidebar = () => {
        if (!nav.classList.contains("active")) return;

        nav.classList.remove("active");
        nav.classList.add("closing");

        // Hapus class closing setelah animasi selesai
        setTimeout(() => {
            nav.classList.remove("closing");
        }, 500); // harus sama dengan durasi animasi CSS
    };

    const toggleSidebar = () => {
        if (nav.classList.contains("active")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    };

    const resetScroll = () => {
        main.scrollTop = 0;
        requestAnimationFrame(() => {
            main.scrollTop = 0;
        });
    };

    const hideAllSections = () => {
        sections.forEach(section => {
            section.classList.remove("active");
            section.style.display = "none";
        });
    };

    const showSection = (section, page) => {
        section.style.display = page === "home" ? "flex" : "block";
        section.classList.add("active");
    };

    const setActiveNav = activeLink => {
        navLinks.forEach(link => link.classList.remove("active"));
        activeLink.classList.add("active");
    };

    menuToggle.addEventListener("click", e => {
        e.stopPropagation();
        toggleSidebar();
    });

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            const page = link.dataset.page;
            if (!page) return;

            const targetSection = document.getElementById(page);
            if (!targetSection) return;

            resetScroll();
            hideAllSections();
            main.getBoundingClientRect();

            showSection(targetSection, page);
            setActiveNav(link);

            closeSidebar();
        });
    });

    document.addEventListener("click", e => {
        if (!nav.classList.contains("active")) return;

        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            closeSidebar();
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeSidebar();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) closeSidebar();
    });
};
