# Chrome Extension for Personal Productivity Tracker

A Chrome Extension designed to help you track and enhance your personal productivity.

## 🚀 How to Run (For Developers/HR)

Since this project uses a build step, you need to generate the extension files before loading them into Chrome.

### Prerequisites
- Node.js (v14 or higher)
- npm (usually installs with Node.js)

### 1. Install Dependencies
Open your terminal in this folder and run:
```bash
npm install
```

### 2. Build the Extension
Run the build command to generate the `dist` folder:
```bash
npm run build
```

### 3. Load in Chrome
1. Open Google Chrome.
2. Go to `chrome://extensions`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** (top left).
5. Select the **`dist`** folder created in the previous step.

The extension is now installed and ready to use!

## 🛠 Project Structure
- `src`: Source code (React + Vite).
- `public`: Static assets (manifest.json, icons).
- `dist`: Production build (generated).
