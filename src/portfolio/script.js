/* ==========================================================
   Portfolio scripts - Mahalakhsmi P
   ========================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ==========================================================
     YOUR PROFILE LINKS - edit only here.
     Paste your full profile URLs between the quotes, e.g.
       github:   "https://github.com/your-username"
       linkedin: "https://www.linkedin.com/in/your-profile"
     Every GitHub / LinkedIn icon and link on the page uses these.
     ========================================================== */
  const PROFILE_LINKS = {
    github: "https://github.com/lakshmimahaa",
    linkedin: "https://www.linkedin.com/in/maha-lakshmi-b7ba9a31a",
  };

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Small toast message ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ---------- Social profile links (GitHub / LinkedIn) ----------
     Fills every [data-social] link from PROFILE_LINKS above and
     opens the profile in a new tab.
     - If a URL is missing "https://", it is added automatically
       (without it the browser treats the link as part of your own site).
     - Links marked data-show-url also display the URL as their text. */
  $$("[data-social]").forEach((link) => {
    let url = (PROFILE_LINKS[link.dataset.social] || "").trim();
    if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      if (link.hasAttribute("data-show-url")) link.textContent = url;
    }
  });

  /* ---------- Placeholder links (project GitHub / demos) ----------
     Links still set to "#" do nothing but show a reminder.
     Once you put a real URL in href, they work normally. */
  $$(".placeholder-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
        const where = link.dataset.social ? "script.js (PROFILE_LINKS)" : "index.html";
        showToast(link.dataset.label + " - edit " + where + " to add it");
      }
    });
  });

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
  navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
  $$(".nav-link").forEach((l) => l.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Navbar style, back-to-top, active link on scroll ---------- */
  const navbar = $("#navbar");
  const backToTop = $("#backToTop");
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 20);
    backToTop.classList.toggle("show", y > 500);

    // Highlight the nav link of the section currently in view
    let current = sections[0].id;
    sections.forEach((sec) => {
      if (y + 140 >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach((l) => {
      const active = l.getAttribute("href") === "#" + current;
      l.classList.toggle("active", active);
      if (active) l.setAttribute("aria-current", "true");
      else l.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 80 + "ms"; // small stagger
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible")); // fallback
  }

  /* ---------- Contact form validation ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = {
    name: (v) => (v.length < 2 ? "Please enter your name (at least 2 characters)." : ""),
    email: (v) => (!emailPattern.test(v) ? "Please enter a valid email address." : ""),
    subject: (v) => (v.length < 3 ? "Please enter a subject (at least 3 characters)." : ""),
    message: (v) => (v.length < 10 ? "Message should be at least 10 characters." : ""),
  };

  function validateField(field) {
    const msg = rules[field.name](field.value.trim());
    $("#" + field.name + "Error").textContent = msg;
    field.closest(".form-group").classList.toggle("invalid", Boolean(msg));
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  /* Errors are no longer shown when a visitor just tabs through or leaves a field empty.
     They appear only after "Send Message" is pressed, and clear as soon as the field is fixed. */
  const fields = $$("input, textarea", form);
  fields.forEach((f) => {
    f.addEventListener("input", () => { if (f.closest(".form-group").classList.contains("invalid")) validateField(f); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    // Validate every field, focus the first invalid one
    const results = fields.map(validateField);
    const firstBad = fields[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }

    /* No backend yet: open the visitor's email app with the message filled in.
       To use a real form service, replace this block with a fetch() to your
       Formspree / Netlify Forms endpoint. */
    const data = Object.fromEntries(fields.map((f) => [f.name, f.value.trim()]));
    const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
    window.location.href =
      "mailto:lakshmimaha5141@gmail.com?subject=" + encodeURIComponent(data.subject) +
      "&body=" + encodeURIComponent(body);

    status.classList.add("success");
    status.textContent = "Thanks! Your email app should open with the message ready to send.";
    form.reset();
  });


  /* ==========================================================
     FEATURES
     ========================================================== */

  /* ---------- 1. Dark / Light theme toggle ----------
     Dark is the default and shows a sun icon (click = go Light).
     Light shows a half-moon icon (click = go back to Dark).
     The choice is remembered in localStorage across page refreshes. */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const themeIcon = $("#themeToggle i");
  const themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f5f7fc" : "#0b0f1a");
    if (themeBtn) {
      // Icon shows what you will switch TO: half-moon while light, sun while dark
      themeIcon.className = theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
      const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
      themeBtn.setAttribute("aria-label", label);
      themeBtn.setAttribute("title", label);
    }
  }

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";

      root.classList.add("theme-transition"); // smooth color fade
      applyTheme(next);
      themeBtn.classList.remove("spin");
      void themeBtn.offsetWidth;              // restart the icon animation
      themeBtn.classList.add("spin");
      setTimeout(() => root.classList.remove("theme-transition"), 400);

      try { localStorage.setItem("theme", next); } catch (err) { /* storage blocked - ignore */ }
    });
  }

  /* ---------- 2. Automatically changing titles ---------- */
  const titleEl = $("#rotatingTitle");
  if (titleEl) {
    const titles = ["Web Developer", "Front-End Developer", "Full Stack Developer"];
    let titleIndex = 0;

    setInterval(() => {
      titleEl.classList.add("is-leaving");                 // fade + slide out
      setTimeout(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        titleEl.textContent = titles[titleIndex];
        titleEl.classList.remove("is-leaving");
        titleEl.classList.add("is-entering");              // jump to start position (below)
        void titleEl.offsetWidth;                          // apply it
        titleEl.classList.remove("is-entering");           // fade + slide in
      }, 400);
    }, 2800);
  }

  /* ---------- 3. Mouse cursor animation ----------
     - Mouse devices: a small dot follows instantly, a soft ring trails behind it.
     - Touch devices: a quick ripple appears where you tap.
     Uses requestAnimationFrame + transform only, so it stays lightweight. */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (hasMouse && !reduceMotion) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let running = false, first = true;

    function render() {
      ringX += (mouseX - ringX) * 0.18;   // easing = smooth trailing
      ringY += (mouseY - ringY) * 0.18;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
        requestAnimationFrame(render);
      } else {
        running = false;                  // stop looping when the mouse is still
      }
    }

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (first) {                        // avoid the ring flying in from the corner
        ringX = mouseX; ringY = mouseY; first = false;
        dot.classList.add("cursor-visible");
        ring.classList.add("cursor-visible");
      }
      if (!running) { running = true; requestAnimationFrame(render); }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      dot.classList.remove("cursor-visible");
      ring.classList.remove("cursor-visible");
      first = true;
    });
    document.addEventListener("mouseenter", () => {
      dot.classList.add("cursor-visible");
      ring.classList.add("cursor-visible");
    });

    // Grow the ring over clickable things, shrink it while pressing
    const interactive = "a, button, input, textarea, .card, .chip, .badge";
    document.addEventListener("mouseover", (e) => ring.classList.toggle("is-hover", Boolean(e.target.closest(interactive))));
    document.addEventListener("mousedown", () => ring.classList.add("is-down"));
    document.addEventListener("mouseup", () => ring.classList.remove("is-down"));
  }

  // Touch screens: small tap ripple
  if (!hasMouse && !reduceMotion) {
    document.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;
      const ripple = document.createElement("span");
      ripple.className = "tap-ripple";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    }, { passive: true });
  }

  /* ---------- Who I Am: click / tap / Enter to light up a box ---------- */
  const glowBoxes = $$(".glow-box");
  glowBoxes.forEach((box) => {
    const toggle = () => {
      const turnOn = !box.classList.contains("is-lit");
      glowBoxes.forEach((b) => b.classList.remove("is-lit"));
      box.classList.toggle("is-lit", turnOn);
    };
    box.addEventListener("click", toggle);
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });
})();