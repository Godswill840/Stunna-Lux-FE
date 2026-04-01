document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const userGreeting = document.getElementById("user-greeting");
  const dashboardFeedback = document.getElementById("dashboard-feedback");
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

  if (!token) {
    window.location.href = "auth.html";
    return;
  }

  // Decode token to get user info (simple decode, no verification on frontend)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userGreeting.textContent = `Hello, ${payload.name || payload.email}! Welcome to your StunnerLux dashboard.`;
  } catch (error) {
    dashboardFeedback.className = "feedback error";
    dashboardFeedback.textContent = "Invalid session. Please log in again.";
    localStorage.removeItem("token");
    window.location.href = "auth.html";
    return;
  }

  // Load order history
  loadOrderHistory();

  async function loadOrderHistory() {
    try {
      const res = await fetch(
        "https://stunna-lux-backend.onrender.com/api/order/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        const ordersList = document.getElementById("orders-list");
        if (data.orders.length === 0) {
          ordersList.innerHTML = "<p>No orders yet. Start shopping!</p>";
        } else {
          ordersList.innerHTML = data.orders
            .map(
              (order) =>
                `<div class="order-item">
              <p><strong>${order.product_name}</strong> - Purchased on ${new Date(order.created_at).toLocaleDateString()}</p>
            </div>`,
            )
            .join("");
        }
      } else {
        dashboardFeedback.className = "feedback error";
        dashboardFeedback.textContent =
          data.message || "Failed to load order history.";
      }
    } catch (error) {
      dashboardFeedback.className = "feedback error";
      dashboardFeedback.textContent = "Network error loading orders.";
    }
  }

  // Handle buy buttons
  document
    .getElementById("product-grid")
    .addEventListener("click", async (e) => {
      if (!e.target.classList.contains("buy-btn")) return;
      const itemName = e.target.dataset.name;

      try {
        const res = await fetch(
          "https://stunna-lux-backend.onrender.com/api/order/buy",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productName: itemName }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          productFeedback.className = "feedback success";
          productFeedback.textContent =
            data.message || `Successfully purchased '${itemName}'!`;
          loadOrderHistory();
        } else {
          productFeedback.className = "feedback error";
          productFeedback.textContent = data.message || "Purchase failed.";
        }
      } catch (error) {
        productFeedback.className = "feedback error";
        productFeedback.textContent = "Network error. Please try again.";
      }
    });

  // Handle logout
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});
