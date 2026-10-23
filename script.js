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

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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


// Assignment 3: GitHub REST API integration.
// The GitHub API is public and does not require an API key for this request.
// Edit this username if the public GitHub account changes.
const GITHUB_USERNAME = "Jude0411";

async function loadGitHubRepositories() {
  const status = document.getElementById("repoStatus");
  const grid = document.getElementById("repoGrid");
  const refresh = document.getElementById("refreshRepos");
  if (!status || !grid || !refresh) return;

  status.textContent = "Loading live repositories from GitHub…";
  status.className = "api-status";
  grid.replaceChildren();
  refresh.disabled = true;
  refresh.textContent = "Loading…";

  try {
    const url = `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated`;
    const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error("GitHub's API rate limit may have been reached. Please try again later.");
      }
      if (response.status === 404) {
        throw new Error("The GitHub profile was not found. Please check the configured username.");
      }
      throw new Error(`GitHub request failed (HTTP ${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) throw new Error("Unexpected response from GitHub.");

    const publicRepos = repositories.filter(repo => !repo.fork).slice(0, 9);
    if (publicRepos.length === 0) {
      status.textContent = "No public original repositories are available right now.";
      return;
    }

    publicRepos.forEach(repo => {
      const card = document.createElement("article");
      card.className = "repo-card";

      const heading = document.createElement("h3");
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;
      heading.appendChild(link);

      const description = document.createElement("p");
      description.className = "repo-description";
      description.textContent = repo.description || "No description provided.";

      const meta = document.createElement("div");
      meta.className = "repo-meta";
      const language = document.createElement("span");
      language.textContent = `Language: ${repo.language || "Not specified"}`;
      const stars = document.createElement("span");
      stars.textContent = `★ ${Number(repo.stargazers_count) || 0} stars`;
      meta.append(language, stars);

      card.append(heading, description, meta);
      grid.appendChild(card);
    });

    status.textContent = `Showing ${publicRepos.length} public repositories from GitHub.`;
    status.className = "api-status api-success";
  } catch (error) {
    status.textContent = `Unable to load repositories: ${error.message}`;
    status.className = "api-status api-error";
  } finally {
    refresh.disabled = false;
    refresh.textContent = "Refresh Repositories";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const refresh = document.getElementById("refreshRepos");
  if (refresh) refresh.addEventListener("click", loadGitHubRepositories);
  loadGitHubRepositories();
});
