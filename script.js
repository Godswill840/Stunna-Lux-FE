const API_BASE_URL = "https://stunna-lux-backend.onrender.com/api";


fetch(`${API_BASE_URL}/auth/verify`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (!data.valid) {
      window.location.href = "auth.html";
    }
  })
  .catch(() => {
    window.location.href = "auth.html";
  });

document.addEventListener("DOMContentLoaded", () => {
  const dashboardFeedback = document.getElementById("dashboard-feedback");
  const token = localStorage.getItem("token");

  if (!token) {
    dashboardFeedback.className = "feedback error";
    dashboardFeedback.textContent = "No session found. Please log in.";
    window.location.href = "auth.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    dashboardFeedback.className = "feedback success";
    dashboardFeedback.textContent = `Welcome back, ${payload.name || "valued customer"}!`;
  } catch (error) {
    dashboardFeedback.className = "feedback error";
    dashboardFeedback.textContent = "Invalid session. Please log in again.";
    localStorage.removeItem("token");
    window.location.href = "auth.html";
    return;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const contactFeedback = document.getElementById("contact-feedback");
  const productFeedback = document.getElementById("product-feedback");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  // Menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      menuToggle.classList.toggle("open");
    });

    // Close menu when clicking a link
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        menuToggle.classList.remove("open");
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  document.getElementById("product-grid")?.addEventListener("click", (e) => {
    if (!e.target.classList.contains("buy-btn")) return;
    const itemName = e.target.dataset.name;
    const token = localStorage.getItem("token");

    if (!token) {
      productFeedback.className = "feedback error";
      productFeedback.textContent = `Please sign in to purchase '${itemName}'. Click 'Account' to log in or create an account.`;
      return;
    }

    // If logged in, proceed with purchase (though on index.html, this might not be expected, but for consistency)
    productFeedback.className = "feedback";
    productFeedback.textContent = `Great choice! '${itemName}' has been added to your bag.`;
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const userName = e.target.userName.value.trim();
      const userEmail = e.target.userEmail.value.trim();
      const brand = e.target.brand.value.trim();
      const item = e.target.item.value.trim();
      const message = e.target.message.value.trim();

      if (!userName || !userEmail || !brand || !item) {
        contactFeedback.className = "feedback error";
        contactFeedback.textContent =
          "All fields except optional message are required.";
        return;
      }

      const supportEmail = "support@stunnerlux.com";
      const subject = encodeURIComponent(`New interest: ${brand} - ${item}`);
      const body = encodeURIComponent(
        `Hello StunnerLux Team,%0D%0A%0D%0AMy name is ${userName}. I purchased or am interested in ${brand} (${item}).%0D%0A%0D%0AMessage details: ${message || "(none provided)"}%0D%0A%0D%0APlease respond to ${userEmail}.%0D%0A%0D%0AThanks!`,
      );

      contactFeedback.className = "feedback";
      contactFeedback.textContent = `Great news, ${userName}! Your message has been prepared and your email client should open now. A confirmation was sent to ${userEmail} (frontend simulation).`;

      window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
      e.target.reset();
    });
  }
});
