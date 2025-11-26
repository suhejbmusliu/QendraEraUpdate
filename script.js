// ===== Select elements =====
const navBar = document.querySelector(".nav-bar");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("section");
const header = document.querySelector("header");

// ===== Helpers =====
const getHeaderHeight = () => (header ? header.offsetHeight : 0);

// ===== Mobile menu toggle + background lock =====
if (hamburger) {
  hamburger.addEventListener("click", () => {
    const isActive = navBar?.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
    // lock page scroll when menu is open
    document.body.classList.toggle("no-scroll", !!isActive);
  });
}

// Close mobile nav when a link is clicked (and smooth scroll with offset)
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return; // external link—let it go

    e.preventDefault();
    const targetId = href.slice(1);
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    // compute offset with live header height (sticky)
    const top =
      targetEl.getBoundingClientRect().top +
      window.scrollY -
      (getHeaderHeight() + 10);

    window.scrollTo({ top, behavior: "smooth" });

    // Close mobile nav
    navBar?.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
});

// ===== Scroll spy + sticky header toggle =====
window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;

    // Sticky header effect
    if (scrollY > 80) header?.classList.add("fixed-header");
    else header?.classList.remove("fixed-header");

    // Scroll spy (active link)
    sections.forEach((sec) => {
      const rectTop = sec.getBoundingClientRect().top + window.scrollY;
      const offset = rectTop - (getHeaderHeight() + 70);
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollY >= offset && scrollY < offset + height) {
        navLinks.forEach((a) => a.classList.remove("active"));
        const active = document.querySelector(`header nav a[href="#${id}"]`);
        active?.classList.add("active");
      }
    });
  },
  { passive: true }
);

// ===== Testimonials slider =====
const slider = document.getElementById("testimonial-slider");
let position = 0;

function getVisibleCount() {
  if (window.innerWidth >= 992) return 3;
  if (window.innerWidth >= 600) return 2;
  return 1;
}

function slide(direction) {
  if (!slider) return;
  const card = slider.querySelector(".testimonial-card");
  if (!card) return;

  const cardWidth = card.getBoundingClientRect().width + 20;
  const totalCards = slider.children.length;
  const visibleCount = getVisibleCount();

  const maxPosition = Math.max(0, totalCards - visibleCount);
  position = Math.min(Math.max(position + direction, 0), maxPosition);

  slider.style.transform = `translateX(-${position * cardWidth}px)`;
}

window.addEventListener("resize", () => slide(0), { passive: true });

// ===== Appointment form validation (inline errors) =====
const form = document.getElementById("appointment-form");
const thankYouMsg = document.getElementById("thank-you-msg");

// helper: show error under one field
function setFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const msgEl = document.querySelector(
    `.error-msg[data-error-for="${fieldId}"]`
  );

  if (input) input.classList.add("error");
  if (msgEl) msgEl.textContent = message;
}

// helper: clear all errors
function clearErrors() {
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));
  document
    .querySelectorAll(".error-msg")
    .forEach((el) => (el.textContent = ""));
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const name = (document.getElementById("name")?.value || "").trim();
    const surname = (document.getElementById("surname")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "").trim();
    const phone = (document.getElementById("phone")?.value || "").trim();
    const reason = (document.getElementById("reason")?.value || "").trim();

    let hasError = false;

    if (!name) {
      setFieldError("name", "Ju lutem shkruani emrin.");
      hasError = true;
    }

    if (!surname) {
      setFieldError("surname", "Ju lutem shkruani mbiemrin.");
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setFieldError("email", "Ju lutem shkruani emailin.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setFieldError("email", "Ju lutem shkruani një email të vlefshëm.");
      hasError = true;
    }

    if (!phone) {
      setFieldError("phone", "Ju lutem shkruani numrin e telefonit.");
      hasError = true;
    } else if (phone.replace(/\D/g, "").length < 6) {
      setFieldError("phone", "Numri i telefonit duket i gabuar.");
      hasError = true;
    }

    if (!reason) {
      setFieldError("reason", "Ju lutem shkruani arsyejen e takimit.");
      hasError = true;
    }

    if (hasError) return; // ❌ Don't submit, only show errors

    // ===== Send to Telegram via PHP =====
    const message = `
📅 New Appointment Request:
👤 Name: ${name} ${surname}
📧 Email: ${email}
📞 Phone: ${phone}
📝 Reason: ${reason}
`;

    try {
      const res = await fetch("tgcontact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });

      const raw = await res.text();
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {}

      if (res.ok && data && data.ok) {
        form.reset();
        clearErrors();
        thankYouMsg.style.display = "block";
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });
}

// ===== Scroll reveal =====
function reveal() {
  const reveals = document.querySelectorAll(".reveal");
  const winH = window.innerHeight;
  for (let i = 0; i < reveals.length; i++) {
    const top = reveals[i].getBoundingClientRect().top;
    if (top < winH - 150) reveals[i].classList.add("active");
    else reveals[i].classList.remove("active");
  }
}
window.addEventListener("scroll", reveal, { passive: true });
window.addEventListener("load", reveal);

// ===== Safeguard Isotope usage =====
(function initIsotope() {
  if (
    typeof jQuery === "undefined" ||
    typeof jQuery.fn?.isotope === "undefined"
  )
    return;
  const $galleryContainer = jQuery(".gallery").isotope({
    itemSelector: ".item",
    layoutMode: "fitRows",
    filter: ".work",
  });
  jQuery(".button-group .button").on("click", function () {
    jQuery(".button-group .button").removeClass("active");
    jQuery(this).addClass("active");
    const value = jQuery(this).attr("data-filter");
    $galleryContainer.isotope({ filter: value });
  });
})();

/* ============================
   Botpress — MOBILE ONLY logic
   ============================ */
(function botpressMobileGuards() {
  if (!window.matchMedia("(max-width: 768px)").matches) return;

  // Lock/unlock background page while chat is open
  function lockBody() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.dataset.scrollY = y;
    document.body.classList.add("chat-open");
    document.body.style.top = `-${y}px`;
  }
  function unlockBody() {
    const y = parseInt(document.body.dataset.scrollY || "0", 10);
    document.body.classList.remove("chat-open");
    document.body.style.top = "";
    window.scrollTo(0, isNaN(y) ? 0 : y);
  }

  // Hook Botpress events (in case inject.js loads late)
  function bind() {
    if (!window.botpressWebChat?.onEvent) return false;
    window.botpressWebChat.onEvent(
      (ev) => {
        if (ev.type === "webchat:opened") lockBody();
        if (ev.type === "webchat:closed") unlockBody();
      },
      ["webchat:opened", "webchat:closed", "webchat:ready"]
    );
    return true;
  }
  [0, 300, 1000, 2000].forEach((t) => setTimeout(bind, t));

  // Lift the widget above the mobile keyboard
  const vv = window.visualViewport;
  function adjustForKeyboard() {
    const cont = document.getElementById("bp-web-widget-container");
    if (!cont) return;
    const kb = vv
      ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      : 0;
    cont.style.bottom = kb ? kb + "px" : "0";
    cont.style.height = kb ? `calc(100dvh - ${kb}px)` : "";
  }
  if (vv) {
    vv.addEventListener("resize", adjustForKeyboard);
    vv.addEventListener("scroll", adjustForKeyboard);
    window.addEventListener("orientationchange", () =>
      setTimeout(adjustForKeyboard, 250)
    );
  }
  window.addEventListener("load", adjustForKeyboard);

  // Prevent background touch scroll while open (iOS)
  document.addEventListener(
    "touchmove",
    (e) => {
      if (document.body.classList.contains("chat-open")) e.preventDefault();
    },
    { passive: false }
  );
})();
