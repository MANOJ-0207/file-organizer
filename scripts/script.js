// ============================================================================
// FILE ORGANIZER - PRODUCTION READY SCRIPT
// ============================================================================

// ============================================================================
// INITIALIZATION & THEME MANAGEMENT
// ============================================================================
const port = "1527";
window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("templates")) {
    localStorage.setItem("templates", JSON.stringify({}));
  }
  applySavedTheme();
  setupDateCheckbox("includeDatePrefix", "prefixInput", "prefixFormatInput");
  setupDateCheckbox("includeDateSuffix", "suffixInput", "suffixFormatInput");
  handleRenameMode();
  toggleInstructionVisibility();

  document.getElementById("file-type-checkboxes").innerHTML =
    "<em>No folder selected - All file types inside the folder will be shown once folder is selected</em>";

  blockInvalidFilenameCharactersLive([
    "prefixInput",
    "suffixInput",
    "sourceWord",
    "targetWord",
    "namePattern",
    "subfolderName",
  ]);

  blockInvalidDateFormatCharactersLive([
    "prefixFormatInput",
    "suffixFormatInput",
  ]);
});

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

applySavedTheme();

  // Theme icon click listener
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

// ============================================================================
// FOLDER & FILE HANDLING
// ============================================================================

async function chooseFolder() {
  const folderPath = await window.electronAPI.pickFolder();
  if (folderPath) {
    const input = document.getElementById("homeDir");
    input.value = folderPath;
    input.dispatchEvent(new Event("change"));
  }
}

document.getElementById("homeDir").addEventListener("change", async () => {
  fillFileTypes();
});

async function fillFileTypes() {
  const path = document.getElementById("homeDir").value.trim();
  const container = document.getElementById("file-type-checkboxes");
  if (!path) return (container.innerHTML = "<em>No folder selected</em>");

  container.innerHTML = "<em>Loading...</em>";

  try {
    container.textContent = "Loading...";

    const types = await window.electronAPI.fetchFileTypes(path);
    container.innerHTML = ""; // Clear "Loading..."

    if (!types.length) {
      const em = document.createElement("em");
      em.textContent = "No files found";
      container.appendChild(em);
      return;
    }

    const allId = "ft_all";

    // All Checkbox
    const allLabel = document.createElement("label");
    allLabel.classList.add("fileTypeCheckBox");

    const allCheckbox = document.createElement("input");
    allCheckbox.type = "checkbox";
    allCheckbox.id = allId;
    allCheckbox.checked = true;

    allLabel.appendChild(allCheckbox);
    allLabel.append(" All");
    container.appendChild(allLabel);
    container.appendChild(document.createElement("br"));

    const checkboxes = [];

    types.forEach((ext) => {
      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "fileType";
      checkbox.value = ext;
      checkbox.classList.add("fileTypeCheckBox");
      checkbox.checked = true;

      label.appendChild(checkbox);
      label.append(` ${ext}`);
      container.appendChild(label);
      container.appendChild(document.createElement("br"));

      checkboxes.push(checkbox);
    });

    allCheckbox.addEventListener("change", () => {
      checkboxes.forEach((cb) => (cb.checked = allCheckbox.checked));
    });

    checkboxes.forEach((cb) => {
      cb.addEventListener("change", () => {
        allCheckbox.checked = checkboxes.every((cb) => cb.checked);
      });
    });
  } catch (err) {
    console.log(err);
    container.innerHTML = "";
    const em = document.createElement("em");
    em.textContent = "Error loading types";
    container.appendChild(em);
  }
}
// ============================================================================
// UI TOGGLE FUNCTIONS
// ============================================================================

function toggleSection(checkboxId, sectionId) {
  const isChecked = document.getElementById(checkboxId).checked;
  document.getElementById(sectionId).style.display = isChecked
    ? "block"
    : "none";
}

function toggleAdvanced() {
  toggleSection("enableAdvanced", "advanced-filter-section");
}

function toggleTimeFilter() {
  toggleSection("enableTimeFilter", "time-filter-section");
}

function toggleSubfolder() {
  toggleSection("moveToSub", "move-folder-section");
}

function toggleSortSection(event) {
  event.stopPropagation();
  toggleSection("enableSort", "sort-options-section");
  toggleSection("enableSort", "sort-order-section");
}

function toggleTillNow() {
  const endInput = document.getElementById("endTime");
  const isChecked = document.getElementById("tillNow").checked;
  endInput.disabled = isChecked;
  endInput.value = isChecked ? new Date().toISOString().slice(0, 16) : "";
}

function toggleAccordion(header) {
  header.parentElement.classList.toggle("open");
}

function handleRenameMode() {
  const mode = document.getElementById("renameMode").value;

  document.getElementById("rename-format-section").style.display =
    mode === "rename" ? "block" : "none";

  document.getElementById("replace-fields-section").style.display =
    mode === "replace" ? "block" : "none";
}

// ============================================================================
// DATE HANDLING FUNCTIONS
// ============================================================================

function setupDateCheckbox(toggleId, inputId, formatId) {
  const checkbox = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  const formatInput = document.getElementById(formatId);
  const token = "${date_time}";

  checkbox.addEventListener("change", () => {
    const show = checkbox.checked;
    formatInput.style.display = show ? "block" : "none";
    if (show && !input.value.includes(token)) input.value += token;
    if (!show && input.value.includes(token))
      input.value = input.value.replace(token, "");
    toggleInstructionVisibility();
  });

  input.addEventListener("input", () => {
    const show = input.value.includes(token);
    checkbox.checked = show;
    formatInput.style.display = show ? "block" : "none";
    toggleInstructionVisibility();
  });
}

function toggleInstructionVisibility() {
  const show =
    document.getElementById("includeDatePrefix").checked ||
    document.getElementById("includeDateSuffix").checked;
  const accordion = document.getElementById("date-format-instructions");
  const timeType = document.getElementById("time-type");
  accordion.style.display = timeType.style.display = show ? "block" : "none";
  if (!show) accordion.classList.remove("open");
}

// ============================================================================
// FORM DATA COLLECTION
// ============================================================================

function gatherFormData() {
  const getVal = (id) => document.getElementById(id)?.value.trim();
  const isChecked = (id) => document.getElementById(id)?.checked;

  const renameMode = document.getElementById("renameMode")?.value;
  const allFileTypesChecked = document.getElementById("ft_all")?.checked;

  const fileTypes = allFileTypesChecked
    ? null
    : Array.from(
        document.querySelectorAll("input[name='fileType']:checked")
      ).map((cb) => cb.value);

  return {
    homeDir: getVal("homeDir"),
    filters: {
      advancedNameFilter: isChecked("enableAdvanced"),
      namePattern: getVal("namePattern"),
      timeFilter: {
        timeType: getVal("filterTimeType"),
        enabled: isChecked("enableTimeFilter"),
        start: getVal("startTime"),
        end: getVal("endTime"),
      },
      ...(fileTypes ? { fileTypes } : {}),
    },
    sort: {
      enabled: isChecked("enableSort"),
      sortOrder: getVal("sortOrder"),
      type: getVal("sortType"),
    },
    rename: {
      mode: renameMode,
      startId: parseInt(getVal("startId")),
      moveToSubfolder: isChecked("moveToSub"),
      subfolderName: getVal("subfolderName"),
      renamePattern: {
        prefix: getVal("prefixInput"),
        suffix: getVal("suffixInput"),
        includeDatePrefix: isChecked("includeDatePrefix"),
        includeDateSuffix: isChecked("includeDateSuffix"),
        prefixFormat: getVal("prefixFormatInput"),
        suffixFormat: getVal("suffixFormatInput"),
        timeType: getVal("timeType"),
      },
      replacePattern: {
        find: getVal("sourceWord"),
        replace: getVal("targetWord"),
      },
    },
  };
}

// ============================================================================
// API COMMUNICATION & MAIN SUBMIT FUNCTION
// ============================================================================

async function submitFilters() {
  if (!validateInputs()) return;

  const formData = gatherFormData();
  // console.log("Sending to backend:", formData);

  try {
    const response = await fetch(`http://localhost:${port}/filterAndOrganize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    // console.log("Response from server:", data);

    const confirmCommit = await window.electronAPI.showConfirmDialog({
      title: "Commit Changes?",
      message:
        "Changes applied, Check the target directory once and decide to commit the changes or revert them to previous state?",
    });

    if (confirmCommit) {
      await fetch(`http://localhost:${port}/commit`, { method: "POST" });

      // Ask user whether to save this configuration as a template
      window.electronAPI
        .showSaveDialog({
          title: "Save Template?",
          message:
            "Changes Committed, Do you want to save this configuration as a template?",
        })
        .then((confirmSave) => {
          if (confirmSave) storeTemplate(formData);
        });
    } else {
      await fetch(`http://localhost:${port}/undo`, { method: "POST" });
      window.electronAPI.showNativeAlert({
        title: "Changes Reverted",
        message: "The changes have been reverted.",
      });
    }
  } catch (error) {
    // console.error("API Error:", error);
    window.electronAPI.showNativeAlert({
      title: "Error",
      message: `An error occurred while processing files.\n\n${error.message}`,
    });
  }
}

// ============================================================================
// INPUT VALIDATION FUNCTIONS
// ============================================================================

function validateInputs() {
  const folder = document.getElementById("homeDir").value.trim();
  if (!folder) return showError("Please select a folder.");

  if (document.getElementById("enableAdvanced").checked) {
    const pattern = document.getElementById("namePattern").value.trim();
    if (!pattern)
      return showError(
        "Wildcard pattern is required when Advanced Filter is enabled."
      );
    if (pattern.includes("_%") || pattern.includes("%_"))
      return showError("No point in keeping _ and % together.");
     if (pattern.includes("%%"))
      return showError("No point in keeping two %s together.");
    if (!validateNoInvalidChars("namePattern", "Name Pattern")) return false;
  }

  if (document.getElementById("enableTimeFilter").checked) {
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;
    const tillNow = document.getElementById("tillNow")?.checked;
    if (!start || (!end && !tillNow))
      return showError(
        "Both start and end time are required when Time Filter is enabled."
      );
  }

  const mode = document.getElementById("renameMode")?.value;
  const moveToSubfolder = document.getElementById("moveToSub")?.checked;

  // ✅ Check if at least one file type checkbox is selected
  const fileTypeChecks = document.querySelectorAll(".fileTypeCheckBox");
  const anyFileTypeSelected = Array.from(fileTypeChecks).some(
    (cb) => cb.checked
  );

  if (mode === "rename") {
    if (!validateFormat("includeDatePrefix", "prefixFormatInput")) return false;
    if (!validateFormat("includeDateSuffix", "suffixFormatInput")) return false;

    if (!validateNoInvalidChars("prefixInput", "Prefix")) return false;
    if (!validateNoInvalidChars("suffixInput", "Suffix")) return false;
    if (!validateNoInvalidChars("subfolderName", "Subfolder Name"))
      return false;
  } else if (mode === "replace") {
    const from = document.getElementById("sourceWord").value.trim();
    const to = document.getElementById("targetWord").value.trim();

    if (!from || !to)
      return showError(
        "Find Word and Replace With fields cannot be empty in Rename Parts mode."
      );

    if (from === to)
      return showError(
        "Find and Replace words must be different to perform replacement."
      );

    if (!validateNoInvalidChars("sourceWord", "Find Word")) return false;
    if (!validateNoInvalidChars("targetWord", "Replace Word")) return false;
  }

  if ((mode === "none" && !moveToSubfolder) || !anyFileTypeSelected) {
    return showError("No changes will be made in this configuration.");
  }

  return true;
}


function validateFormat(checkboxId, inputId) {
  const checked = document.getElementById(checkboxId).checked;
  const format = document.getElementById(inputId).value.trim();
  const hasInvalidChars = containsInvalidFileChars(format);
  if (checked && (!format || !isValidDateFormat(format) || hasInvalidChars)) {
    return showError(
      `Invalid format for ${
        checkboxId.includes("Prefix") ? "Prefix" : "Suffix"
      }.\n\n` +
        "Valid tokens: hh, mm, ss, dd, MM, yy, yyyy, mon, month, day, DAY\n" +
        'Avoid using: \\ / : * ? " < > |'
    );
  }
  return true;
}

function isValidDateFormat(format) {
  const valid = [
    "hh",
    "mm",
    "ss",
    "yy",
    "yyyy",
    "dd",
    "MM",
    "mon",
    "month",
    "day",
    "DAY",
  ];
  return format
    .split(/[^a-zA-Z]+/)
    .filter(Boolean)
    .every((token) => valid.includes(token));
}

function showError(message) {
  window.electronAPI.showNativeAlert({ title: "Alert", message });
  return false;
}

function containsInvalidFileChars(str) {
  return /[\\\/:*?"<>|]/.test(str);
}

function validateNoInvalidChars(id, label = "Input") {
  const val = document.getElementById(id)?.value.trim();
  if (containsInvalidFileChars(val)) {
    return showError(
      `${label} contains invalid characters: \\ / : * ? " < > |`
    );
  }
  return true;
}

function blockInvalidFilenameCharactersLive(ids) {
  const invalidCharRegex = /[\\\/:*?"<>|]/g;
  ids.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(invalidCharRegex, "");
      });
    }
  });
}

function blockInvalidDateFormatCharactersLive(ids) {
  const invalidCharRegex = /[\\\/:*?"<>|]/g;
  ids.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(invalidCharRegex, "");
      });
    }
  });
}

// ============================================================================
// TEMPLATE MANAGEMENT FUNCTIONS
// ============================================================================

function viewTemplates() {
  const modal = document.getElementById("template-modal");
  const container = document.getElementById("template-list");

  container.innerHTML = ""; // Clear previous content

  const templates = JSON.parse(localStorage.getItem("templates") || "{}");
  const entries = Object.entries(templates);

  if (entries.length === 0) {
    container.innerHTML = "<p class='no-template'>No templates saved</p>";
    modal.classList.remove("hidden");
    return;
  }

  entries.forEach(([name, data]) => {
    const entry = document.createElement("div");
    entry.className = "template-row";

    const nameLabel = document.createElement("span");
    nameLabel.textContent = name;
    nameLabel.className = "template-name";

    const btnGroup = document.createElement("div");
    btnGroup.className = "template-actions";

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply";
    applyBtn.className = "template-apply-btn";
    applyBtn.onclick = () => {
      fillData(data);
      fillFileTypes();
      modal.classList.add("hidden");
    };

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "template-remove-btn";
    removeBtn.onclick = () => {
      const confirmDelete = confirm(
        `Are you sure you want to delete "${name}"?`
      );
      if (confirmDelete) {
        delete templates[name];
        localStorage.setItem("templates", JSON.stringify(templates));
        viewTemplates(); // Refresh list
      }
    };

    btnGroup.appendChild(applyBtn);
    btnGroup.appendChild(removeBtn);
    entry.appendChild(nameLabel);
    entry.appendChild(btnGroup);
    container.appendChild(entry);
  });

  modal.classList.remove("hidden");
}

function closeTemplateModal() {
  document.getElementById("template-modal").classList.add("hidden");
}

function fillData(data) {
  if (!data || typeof data !== "object") return;

  // TOGGLE first
  const filters = data.filters || {};
  document.getElementById("enableAdvanced").checked =
    filters.advancedNameFilter || false;
  toggleAdvanced();

  document.getElementById("enableTimeFilter").checked =
    filters.timeFilter?.enabled || false;
  toggleTimeFilter();

  const sort = data.sort || {};
  document.getElementById("enableSort").checked = sort.enabled || false;
  toggleSortSection({ stopPropagation: () => {} });

  const rename = data.rename || {};
  document.getElementById("moveToSub").checked =
    rename.moveToSubfolder || false;
  toggleSubfolder();

  const rp = rename.renamePattern || {};
  document.getElementById("includeDatePrefix").checked =
    rp.includeDatePrefix || false;
  document.getElementById("includeDateSuffix").checked =
    rp.includeDateSuffix || false;
  toggleInstructionVisibility();

  // ASSIGN values
  document.getElementById("homeDir").value = data.homeDir || "";
  document.getElementById("namePattern").value = filters.namePattern || "";

  const timeFilter = filters.timeFilter || {};
  document.getElementById("filterTimeType").value =
    timeFilter.timeType || "modified";
  document.getElementById("startTime").value = timeFilter.start || "";
  document.getElementById("endTime").value = timeFilter.end || "";

  document.getElementById("sortOrder").value = sort.sortOrder || "asc";
  document.getElementById("sortType").value = sort.type || "name";

  const mode = rename.mode || "rename";
  document.querySelector(
    `input[name="renameMode"][value="${mode}"]`
  ).checked = true;
  handleRenameMode();

  document.getElementById("startId").value = rename.startId || 1;
  document.getElementById("subfolderName").value = rename.subfolderName || "";

  document.getElementById("prefixInput").value = rp.prefix || "";
  document.getElementById("suffixInput").value = rp.suffix || "";
  document.getElementById("prefixFormatInput").value = rp.prefixFormat || "";
  document.getElementById("suffixFormatInput").value = rp.suffixFormat || "";
  document.getElementById("timeType").value = rp.timeType || "modified";

  const replacePattern = rename.replacePattern || {};
  document.getElementById("sourceWord").value = replacePattern.find || "";
  document.getElementById("targetWord").value = replacePattern.replace || "";
}

// ============================================================================
// TEMPLATE SAVING FUNCTIONS
// ============================================================================

let pendingTemplateData = null;

function storeTemplate(formData) {
  pendingTemplateData = formData;
  document.getElementById("template-warning").style.display = "none";
  document.getElementById("templateNameInput").value = "";
  document.getElementById("save-template-modal").classList.remove("hidden");
}

function confirmSaveTemplate() {
  const name = document.getElementById("templateNameInput").value.trim();
  const warning = document.getElementById("template-warning");

  warning.style.display = "none";

  if (!name) {
    warning.innerText = "Template name cannot be empty.";
    warning.style.display = "block";
    return;
  }

  const allTemplates = JSON.parse(localStorage.getItem("templates") || "{}");

  if (allTemplates[name]) {
    const confirmOverwrite = confirm(
      `Template "${name}" already exists. Do you want to overwrite it?`
    );
    if (!confirmOverwrite) {
      return; // Don't proceed if user cancels overwrite
    }
  }

  // Save the template - clear time filters before saving
  const templateData = { ...pendingTemplateData };
  templateData.filters.timeFilter.start = "";
  templateData.filters.timeFilter.end = "";

  allTemplates[name] = templateData;
  localStorage.setItem("templates", JSON.stringify(allTemplates));
  closeSaveTemplateModal();

  window.electronAPI.showNativeAlert({
    title: "Template Saved",
    message: `Template "${name}" saved successfully.`,
  });
}

function closeSaveTemplateModal() {
  document.getElementById("save-template-modal").classList.add("hidden");
}
