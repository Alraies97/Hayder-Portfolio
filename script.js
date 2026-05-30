(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const yearEl = document.getElementById("year");
  const skillCards = document.querySelectorAll(".skill-card");

  /* -----------------------------------------------------------------------
     Footer year
     ----------------------------------------------------------------------- */

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------------------
     Mobile navigation
     ----------------------------------------------------------------------- */

  function closeNav() {
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openNav() {
    navToggle.setAttribute("aria-expanded", "true");
    navMenu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeNav() : openNav();
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeNav();
    }
  });

  /* -----------------------------------------------------------------------
     Header scroll state
     ----------------------------------------------------------------------- */

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* -----------------------------------------------------------------------
     Scroll reveal animations
     ----------------------------------------------------------------------- */

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(function (el, index) {
    el.style.transitionDelay = index * 0.05 + "s";
    revealObserver.observe(el);
  });

  /* -----------------------------------------------------------------------
     Skills: progress bars + hover cycling
     ----------------------------------------------------------------------- */

  const skillsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.3 }
  );

  skillCards.forEach(function (card) {
    skillsObserver.observe(card);
  });

  let activeSkillIndex = 0;
  let skillCycleTimer;

  function setActiveSkill(index) {
    skillCards.forEach(function (card, i) {
      card.classList.toggle("is-active", i === index);
    });
    activeSkillIndex = index;
  }

  function cycleSkills() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActiveSkill((activeSkillIndex + 1) % skillCards.length);
  }

  function startSkillCycle() {
    clearInterval(skillCycleTimer);
    skillCycleTimer = setInterval(cycleSkills, 3000);
  }

  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    const skillsSectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveSkill(0);
            startSkillCycle();
          } else {
            clearInterval(skillCycleTimer);
            skillCards.forEach(function (card) {
              card.classList.remove("is-active");
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    skillsSectionObserver.observe(skillsSection);
  }

  skillCards.forEach(function (card, index) {
    card.addEventListener("mouseenter", function () {
      clearInterval(skillCycleTimer);
      setActiveSkill(index);
    });

    card.addEventListener("mouseleave", function () {
      startSkillCycle();
    });
  });

  /* -----------------------------------------------------------------------
     Active nav link on scroll
     ----------------------------------------------------------------------- */

  const sections = document.querySelectorAll("section[id], footer[id]");

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            const href = link.getAttribute("href");
            link.classList.toggle("is-active", href === "#" + id);
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: "-20% 0px -60% 0px" }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* -----------------------------------------------------------------------
     Smooth scroll for anchor links (respects reduced motion)
     ----------------------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        target.focus({ preventScroll: true });
        target.scrollIntoView();
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
