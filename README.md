# 📁 File Organizer

A powerful desktop utility that helps users organize their files and folders based on custom rules. Built using **Electron** for the frontend and **Spring Boot** for the backend.

✅ **No Java installation required** – the app bundles Amazon Corretto JRE internally.

---

## 🚀 Features

- ✅ Select folder to organize
- ✅ Advanced file renaming with date/time patterns
- ✅ Filter by file types, name patterns (with SQL-like syntax), and modified time
- ✅ Preview changes before applying
- ✅ Undo changes with a single click (in-memory session)
- ✅ Save & reuse configuration templates
- ✅ Light/Dark mode support

---

## 🧱 Architecture Overview

```
+---------------------+      HTTP      +------------------------+
|    Electron (UI)    |  <--------->   |  Spring Boot Backend   |
|  HTML/CSS/JS/IPC    |                |  Java + REST Endpoints |
+---------------------+                +------------------------+
        |                                       |
        | File System Access                    | Folder/File Analysis
        |                                       |
        +---------------------------------------+
```

- Electron handles UI and interaction.
- Spring Boot backend handles all file logic.
- Electron launches the backend with Amazon Corretto JRE bundled.
- Communication between frontend and backend is done via REST API.

---

## 🧩 Design Patterns & Internals

### 📌 Patterns Used

- **Strategy Pattern** – For switching sorting and renaming strategies dynamically.
- **Decorator Pattern** – For chaining filters like name, type, time in a modular way.
- **SQL-like Pattern Matching** – Supports wildcards like `IMG_%.jpg`, `data_??.csv`, etc.

### 🔍 Algorithm Workflow

1. User selects a folder.
2. Backend reads all files and collects metadata.
3. Applies filters (type, name pattern, modified time).
4. Groups and sorts based on user’s choices.
5. Files are renamed/moved based on pattern.
6. A snapshot of the original state is stored in memory for undo.

---

## 📦 Project Structure

```
📦 file-organizer/
├── 📁 Backend/                   # Spring Boot backend
│   ├── src/                     # Java source code
│   └── fileOrganizer-backend.jar (compiled JAR)
├── 📁 assets/                   # App icons, logos
├── 📁 scripts/                  # Frontend JS logic
├── 📁 styles/                   # CSS files (organized into base.css etc.)
├── 📄 main.js                   # Electron's main process
├── 📄 preload.js                # Secure preload bridge
├── 📄 index.html                # Main UI page
├── 📄 package.json              # Electron + builder config
└── 📄 README.md                 # This file
```

---

## ⚙️ Setup Instructions

### 🛠 Prerequisites

- Node.js 18+
- Maven (for backend build only)
- Amazon Corretto JRE is bundled – ❌ no Java installation needed

---

### 🧪 Build & Run

1. **Clone the repository**

```bash
git clone https://github.com/MANOJ-0207/file-organizer.git
cd file-organizer
```

2. **Build the Spring Boot Backend**

```bash
cd Backend
mvn clean install
```

> This generates: `target/fileOrganizer-backend.jar`

3. **Move the JAR to Electron folder**

```bash
mv target/fileOrganizer-backend.jar ../Backend/
```

4. **Install frontend dependencies**

```bash
cd ..
npm install
```

5. **Run in development**

```bash
npm start
```

---

## 🖥 Packaging the App (Windows)

```bash
npm run dist
```

- Generates `.exe` installer in `dist/`
- Includes:
  - Electron frontend
  - Spring Boot backend
  - Amazon Corretto JRE

---

## ⚠️ Current Limitations

- ❌ Date format placeholders must be together (e.g. `{yyyy-MM_dd}` only)
- ❌ Cannot mix static text with dynamic tokens (e.g. `File_{yyyy}_Report_{size}KB` not supported)
- ❌ No `{size}`, `{ext}` tokens for filenames yet

---

## 📈 Future Enhancements

- ✅ Support interleaving patterns like `name_{yyyy}_size_{size}KB`
- ✅ Add `{size}`, `{ext}` placeholders
- ✅ macOS & Linux build

---


## 🤝 Contributing

- Fork this repo
- Create a feature branch
- Submit a PR
- Suggestions or bugs? → [Open an issue](https://github.com/MANOJ-0207/file-organizer.git/issues)