const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const treeKill = require("tree-kill");

const isDev = require("electron-is-dev");

const APP_ID = "io.github.manoj-0207.file-organizer";

if (process.platform === "win32") {
  app.setAppUserModelId(APP_ID);
  app.name = "File Organizer";
}

// Prevent multiple instances (helps with taskbar/shortcut behavior)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

let win = null;
let springProcess = null;

function startSpringBootBackend() {
  const jarPath = isDev
    ? path.join(__dirname, "Backend", "fileOrganizer-backend.jar")
    : path.join(process.resourcesPath, "fileOrganizer-backend.jar");

  const javaPath = isDev
    ? path.join(__dirname, "jre", "bin", "java")
    : path.join(process.resourcesPath, "jre", "bin", "java");

  // spawn the bundled java runtime (or system java in dev if you prefer)
  springProcess = spawn(javaPath, ["-jar", jarPath, "--server.port=1527"]);

  springProcess.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`[Spring Boot] ${output}`);

    if (
      output.includes("Started") ||
      output.toLowerCase().includes("started application")
    ) {
      // Create window only after backend is ready
      if (!win) createWindow();
    }
  });

  springProcess.stderr.on("data", (data) => {
    console.error(`[Spring Boot ERROR] ${data}`);
  });

  springProcess.on("close", (code) => {
    console.log(`[Spring Boot exited with code ${code}]`);
  });
}

function createWindow() {
  const iconPath = isDev
    ? path.join(__dirname, "assets", "FileOrganizerLogo.ico")
    : path.join(process.resourcesPath, "assets", "FileOrganizerLogo.ico");

  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#ffffff",
    show: false,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile("home.html");
  win.once("ready-to-show", () => win.show());

  Menu.setApplicationMenu(null);

  win.on("closed", () => {
    win = null;
  });
}

// Run backend after app is ready
app.whenReady().then(startSpringBootBackend);

// Proper shutdown
app.on("window-all-closed", () => {
  // only quit after spring process is terminated
  if (springProcess && springProcess.pid) {
    treeKill(springProcess.pid, "SIGTERM", () => {
      setTimeout(() => {
        if (process.platform !== "darwin") app.quit();
      }, 500);
    });
  } else {
    if (process.platform !== "darwin") app.quit();
  }
});

app.on("activate", () => {
  if (win === null) createWindow();
});

// Folder picker
ipcMain.handle("dialog:open-folder", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });

  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// File type extractor
ipcMain.handle("get-file-types", async (_, folderPath) => {
  try {
    const files = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });

    const extensions = new Set();

    for (const entry of files) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext) extensions.add(ext);
      }
    }

    return [...extensions].sort();
  } catch (err) {
    return [];
  }
});

// Native alert
ipcMain.handle("dialog:show-alert", async (_, { title, message }) => {
  return await dialog.showMessageBox(win, {
    type: "info",
    buttons: ["OK"],
    defaultId: 0,
    title: title || "Notice",
    message: message || "",
  });
});

// Confirmation dialog (Commit / Undo)
ipcMain.handle("dialog:show-confirm", async (_, { title, message }) => {
  const result = await dialog.showMessageBox(win, {
    type: "question",
    buttons: ["Commit", "Undo"],
    defaultId: 0,
    cancelId: 1,
    title: title || "Confirm Action",
    message: message || "Do you want to commit or undo the changes?",
  });

  return result.response === 0;
});

// Save confirmation
ipcMain.handle("dialog:show-save", async (_, { title, message }) => {
  const result = await dialog.showMessageBox(win, {
    type: "question",
    buttons: ["Save", "Ignore"],
    defaultId: 0,
    cancelId: 1,
    title: title || "Confirm Action",
    message: message || "Do you want to save the configurations as a template?",
  });

  return result.response === 0;
});
