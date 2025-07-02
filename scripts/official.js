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

function applySavedTheme() {
  const root = document.documentElement;
  const checkbox = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme = storedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", theme);

  if (checkbox) checkbox.checked = theme === "dark";
}

function toggleTheme() {
  const root = document.documentElement;
  const checkbox = document.getElementById("themeToggle");
  const isDark = checkbox.checked;

  const nextTheme = isDark ? "dark" : "light";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
}

function applySavedTab() {
  const savedTab = localStorage.getItem("activeTab") || "user";
  showTab(savedTab);
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();

  const checkbox = document.getElementById("themeToggle");
  if (checkbox) checkbox.addEventListener("change", toggleTheme);

  applySavedTab();
});