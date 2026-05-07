(function() {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#header");
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  const scrollTop = document.querySelector(".scroll-top");
  const originalTitle = document.title;

  function toggleScrolled() {
    if (!header) return;
    if (!header.classList.contains("scroll-up-sticky") && !header.classList.contains("sticky-top") && !header.classList.contains("fixed-top")) return;
    body.classList.toggle("scrolled", window.scrollY > 100);
  }

  function toggleMobileNav() {
    if (!mobileNavToggleBtn) return;
    body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
    mobileNavToggleBtn.setAttribute(
      "aria-label",
      body.classList.contains("mobile-nav-active") ? "Close navigation" : "Open navigation"
    );
  }

  function toggleScrollTop() {
    if (!scrollTop) return;
    scrollTop.classList.toggle("active", window.scrollY > 100);
  }

  function aosInit() {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      mirror: false
    });
  }

  function initIsotope() {
    if (typeof Isotope === "undefined") return;

    document.querySelectorAll(".isotope-layout").forEach((isotopeItem) => {
      const container = isotopeItem.querySelector(".isotope-container");
      if (!container) return;

      const initIsotope = new Isotope(container, {
        itemSelector: ".isotope-item",
        layoutMode: isotopeItem.getAttribute("data-layout") || "masonry",
        filter: isotopeItem.getAttribute("data-default-filter") || "*",
        sortBy: isotopeItem.getAttribute("data-sort") || "original-order"
      });

      isotopeItem.querySelectorAll(".isotope-filters li").forEach((filter) => {
        const applyFilter = () => {
          const activeFilter = isotopeItem.querySelector(".isotope-filters .filter-active");
          if (activeFilter) activeFilter.classList.remove("filter-active");
          filter.classList.add("filter-active");
          initIsotope.arrange({ filter: filter.getAttribute("data-filter") });
          aosInit();
        };

        filter.addEventListener("click", applyFilter);
        filter.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            applyFilter();
          }
        });
      });
    });
  }

  function initSwiper() {
    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
      const configElement = swiperElement.querySelector(".swiper-config");
      if (!configElement) return;
      new Swiper(swiperElement, JSON.parse(configElement.textContent.trim()));
    });
  }

  function adjustHashScroll() {
    if (!window.location.hash) return;
    const section = document.querySelector(window.location.hash);
    if (!section) return;

    setTimeout(() => {
      const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;
      window.scrollTo({
        top: section.offsetTop - scrollMarginTop,
        behavior: "smooth"
      });
    }, 100);
  }

  const navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;

      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        document.querySelectorAll(".navmenu a.active").forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }

  function changePageTitle() {
    const messages = ["Don’t you love me 💔", "Please come back 😔", "Missing you already 🥺", "Don’t leave me 😭"];
    let i = 0, interval;

    if (document.hidden) {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        document.title = messages[i % messages.length];
        i++;
      }, 1500);
    } else {
      clearInterval(interval);
      interval = null;
      document.title = originalTitle;
      i = 0;
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);
  }

  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (body.classList.contains("mobile-nav-active")) {
        toggleMobileNav();
      }
    });
  });

  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function(event) {
      event.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      event.stopImmediatePropagation();
    });
  });

  if (scrollTop) {
    scrollTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("scroll", () => {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
  });

  document.addEventListener("DOMContentLoaded", () => {
    aosInit();
    initIsotope();
    initSwiper();
  });

  document.addEventListener("visibilitychange", () => {
    changePageTitle();
  });

  window.addEventListener("load", () => {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
    adjustHashScroll();
  });
})();
