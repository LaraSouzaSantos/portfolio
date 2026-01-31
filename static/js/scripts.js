document.addEventListener("DOMContentLoaded", () => {
  // Ano no rodapé
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toggle nav mobile
  const siteNav = document.querySelector(".site-nav");
  // close button inside nav-card (kept for desktop/dialog usage)
  const navClose = document.querySelector(".nav-close");
  if (navClose && siteNav) {
    navClose.addEventListener("click", () => {
      siteNav.classList.remove("open");
      document.body.classList.remove("nav-open");
    });
  }

  // close when clicking on overlay background (outside nav-card)
  if (siteNav) {
    siteNav.addEventListener("click", (e) => {
      if (e.target === siteNav) {
        siteNav.classList.remove("open");
        document.body.classList.remove("nav-open");
      }
    });
  }

  // Smooth scroll for anchor links and close mobile nav on navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const targetId = href === "#" ? null : href.slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // close mobile nav after click
        if (siteNav && siteNav.classList.contains("open")) {
          siteNav.classList.remove("open");
          document.body.classList.remove("nav-open");
        }
      }
    });
  });

  // Bottom nav: highlight active section while scrolling
  const bnItems = document.querySelectorAll(".bottom-nav .bn-item");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  function updateActiveBottomNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let activeId = null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      if (scrollPos >= top) activeId = sec.id;
    }
    bnItems.forEach((el) => {
      const href = el.getAttribute("href") || "";
      const id = href.startsWith("#") ? href.slice(1) : null;
      if (id === activeId) el.classList.add("active");
      else el.classList.remove("active");
    });
  }
  if (bnItems.length && sections.length) {
    updateActiveBottomNav();
    window.addEventListener(
      "scroll",
      () => {
        updateActiveBottomNav();
      },
      { passive: true },
    );
  }

  // Dynamic background mix for creative purple->pink gradient while scrolling
  (function () {
    const root = document.documentElement;
    let ticking = false;

    function updateMix() {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      let pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      // map pct [0..100] to mix range [15..85]
      const mix = Math.round(15 + pct * 0.7);
      // store numeric percentage (0-100) so CSS can use calc(var(--bg-mix) * 1%)
      root.style.setProperty("--bg-mix", String(mix));
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateMix);
        ticking = true;
      }
    }

    // init and bind
    updateMix();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateMix);
  })();
});
