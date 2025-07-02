const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const treeKill = require("tree-kill");

let win;
let springProcess;

// Detect dev mode (optional, if you want to support both dev and prod)
const isDev = require("electron-is-dev");

function startSpringBootBackend() {
  const jarPath = isDev
    ? path.join(__dirname, "Backend", "fileOrganizer-backend.jar")
    : path.join(process.resourcesPath, "fileOrganizer-backend.jar");

  const javaPath = isDev
    ? path.join(__dirname, "jre", "bin", "java")
    : path.join(process.resourcesPath, "jre", "bin", "java");

  springProcess = spawn(javaPath, ["-jar", jarPath, "--server.port=1527"]);

  springProcess.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`[Spring Boot] ${output}`);

    if (
      output.includes("Started") ||
      output.toLowerCase().includes("started application")
    ) {
      createWindow(); // Start the window only after backend is ready
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
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#ffffff",
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets", "FileOrganizerLogo.ico"),
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

app.whenReady().then(startSpringBootBackend);

app.on("window-all-closed", () => {
  treeKill(springProcess.pid, "SIGTERM", () => {
    setTimeout(() => {
      if (process.platform !== "darwin") app.quit();
    }, 500);
  });
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
