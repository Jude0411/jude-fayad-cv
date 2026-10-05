// Assignment 2 - Interactive CV Webpage
// JavaScript is kept in a separate file as required.

document.addEventListener("DOMContentLoaded", function () {
  // Feature 1: Welcome message on page load.
  const welcome = document.getElementById("welcomeMessage");
  if (welcome) setTimeout(() => welcome.classList.add("hide"), 3500);

  // Feature 2: Dark / Light mode toggle.
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const dark = document.body.classList.toggle("dark-mode");
      themeToggle.textContent = dark ? "Light Mode" : "Dark Mode";
    });
  }

  // Feature 3: Show / Hide Skills and Projects.
  document.querySelectorAll(".section-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      const section = document.getElementById(button.dataset.target);
      if (!section) return;
      const hide = button.getAttribute("aria-expanded") === "true";
      Array.from(section.children).forEach(function (child) {
        if (child !== button && !child.classList.contains("section-heading")) {
          child.style.display = hide ? "none" : "";
        }
      });
      button.setAttribute("aria-expanded", String(!hide));
      const name = button.dataset.target.charAt(0).toUpperCase() + button.dataset.target.slice(1);
      button.textContent = hide ? "Show " + name : "Hide " + name;
    });
  });

  // Feature 4: Add skills dynamically.
  const skillInput = document.getElementById("skillInput");
  const addSkillBtn = document.getElementById("addSkillBtn");
  const dynamicSkills = document.getElementById("dynamicSkills");
  const skillMessage = document.getElementById("skillMessage");

  function addSkill() {
    const value = skillInput.value.trim();
    if (!value) {
      skillMessage.textContent = "Please enter a skill first.";
      return;
    }
    const skill = document.createElement("span");
    skill.className = "dynamic-skill";
    skill.textContent = value;
    dynamicSkills.appendChild(skill);
    skillInput.value = "";
    skillMessage.textContent = value + " was added successfully.";
    skillInput.focus();
  }

  if (skillInput && addSkillBtn) {
    addSkillBtn.addEventListener("click", addSkill);
    skillInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") addSkill();
    });
  }

  // Feature 5: Interactive project details.
  const detailsBtn = document.getElementById("projectDetailsBtn");
  const extraDetails = document.getElementById("projectExtraDetails");
  if (detailsBtn && extraDetails) {
    detailsBtn.addEventListener("click", function () {
      const opening = extraDetails.hidden;
      extraDetails.hidden = !opening;
      detailsBtn.textContent = opening ? "Hide Project Details" : "Show Project Details";
      detailsBtn.setAttribute("aria-expanded", String(opening));
    });
  }

  // Feature 6: Contact form validation.
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("contactName");
      const email = document.getElementById("contactEmail");
      const message = document.getElementById("contactMessage");
      const status = document.getElementById("formStatus");

      const checks = [
        [name, document.getElementById("nameError"), "Name is required."],
        [email, document.getElementById("emailError"), "Email is required."],
        [message, document.getElementById("messageError"), "Message is required."]
      ];

      let valid = true;
      checks.forEach(function (item) {
        item[0].classList.remove("input-error");
        item[1].textContent = "";
        if (!item[0].value.trim()) {
          item[0].classList.add("input-error");
          item[1].textContent = item[2];
          valid = false;
        }
      });

      const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (email.value.trim() && !emailPattern.test(email.value.trim())) {
        email.classList.add("input-error");
        document.getElementById("emailError").textContent = "Please enter a valid email address.";
        valid = false;
      }

      if (valid) {
        status.textContent = "Thank you! Your message passed validation successfully.";
        form.reset();
      } else {
        status.textContent = "Please correct the highlighted fields.";
      }
    });
  }
});
