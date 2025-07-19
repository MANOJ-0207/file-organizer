function showTab(id) {
  // Remove active classes
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

  // Activate selected tab and content
  document.getElementById(id).classList.add("active");
  document.querySelector(`.tab[onclick="showTab('${id}')"]`).classList.add("active");

  // Store the selected tab
  localStorage.setItem("activeTab", id);
}

function applySavedTab() {
  const savedTab = localStorage.getItem("activeTab") || "user";
  showTab(savedTab);
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}

function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  applySavedTab();

  // Theme icon click listener
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});
