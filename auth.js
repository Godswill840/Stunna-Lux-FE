document.addEventListener("DOMContentLoaded", () => {
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const panelLogin = document.getElementById("panel-login");
  const panelSignup = document.getElementById("panel-signup");
  const authFeedback = document.getElementById("auth-feedback");
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

  const setActive = (selected) => {
    tabLogin.classList.toggle("active", selected === "login");
    tabSignup.classList.toggle("active", selected === "signup");
    panelLogin.classList.toggle("active", selected === "login");
    panelSignup.classList.toggle("active", selected === "signup");
    authFeedback.textContent = "";
  };

  tabLogin.addEventListener("click", () => setActive("login"));
  tabSignup.addEventListener("click", () => setActive("signup"));

  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();

      if (!email || !password) {
        authFeedback.className = "feedback error";
        authFeedback.textContent = "Please enter email and password.";
        return;
      }

      try {
        const res = await fetch(
          "https://stunna-lux-backend.onrender.com/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          authFeedback.className = "feedback success";
          authFeedback.textContent = `Welcome back, ${data.user.name || email}!`;
          localStorage.setItem("token", data.token);
          e.target.reset();
          setTimeout(() => (window.location.href = "dashboard.html"), 1000);
        } else {
          authFeedback.className = "feedback error";
          authFeedback.textContent = data.msg || "Login failed.";
        }
      } catch (error) {
        authFeedback.className = "feedback error";
        authFeedback.textContent = "Network error. Please try again.";
      }
    });

  document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = e.target.name.value.trim();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();

      if (!name || !email || !password) {
        authFeedback.className = "feedback error";
        authFeedback.textContent = "Please fill in all fields.";
        return;
      }

      try {
        const res = await fetch(
          "https://stunna-lux-backend.onrender.com/api/auth/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          authFeedback.className = "feedback success";
          authFeedback.textContent = `Account created successfully! Welcome, ${name}.`;
          e.target.reset();
          setTimeout(() => (window.location.href = "dashboard.html"), 1000);
        } else {
          authFeedback.className = "feedback error";
          authFeedback.textContent = data.msg || "Signup failed.";
        }
      } catch (error) {
        authFeedback.className = "feedback error";
        authFeedback.textContent = "Network error. Please try again.";
      }
    });
});
