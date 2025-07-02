const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  pickFolder: () => ipcRenderer.invoke("dialog:open-folder"),
  fetchFileTypes: (path) => ipcRenderer.invoke("get-file-types", path),
  showNativeAlert: ({ title, message }) => ipcRenderer.invoke("dialog:show-alert", { title, message }),
  showConfirmDialog: ({ title, message }) => ipcRenderer.invoke("dialog:show-confirm", { title, message }),
  showSaveDialog: ({ title, message }) => ipcRenderer.invoke("dialog:show-save", { title, message })
});
