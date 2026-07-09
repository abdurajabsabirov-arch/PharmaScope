const { app, BrowserWindow, dialog, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const waitOn = require("wait-on");

const isDev = process.env.PHARMASCOPE_DESKTOP_DEV === "1" || !app.isPackaged;
const FRONTEND_PORT = process.env.PHARMASCOPE_FRONTEND_PORT || "3000";
const BACKEND_PORT = process.env.PHARMASCOPE_BACKEND_PORT || "8000";
const FRONTEND_URL = `http://127.0.0.1:${FRONTEND_PORT}`;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;

let backendProcess = null;
let frontendProcess = null;
let mainWindow = null;

function rootPath(...segments) {
  if (isDev) return path.resolve(__dirname, "..", ...segments);
  return path.join(process.resourcesPath, ...segments);
}

function spawnProcess(command, args, options = {}) {
  const logFile = !isDev ? path.join(app.getPath("userData"), "logs", `${path.basename(command)}.log`) : null;
  if (logFile) fs.mkdirSync(path.dirname(logFile), { recursive: true });

  const child = spawn(command, args, {
    windowsHide: true,
    stdio: isDev ? "inherit" : ["ignore", "pipe", "pipe"],
    ...options,
  });

  if (logFile) {
    const logStream = fs.createWriteStream(logFile, { flags: "a" });
    logStream.write(`\n[${new Date().toISOString()}] ${command} ${args.join(" ")}\n`);
    child.stdout?.pipe(logStream, { end: false });
    child.stderr?.pipe(logStream, { end: false });
    child.on("exit", (code, signal) => {
      logStream.write(`\n[exit] code=${code ?? ""} signal=${signal ?? ""}\n`);
      logStream.end();
    });
  }

  child.on("error", (error) => {
    dialog.showErrorBox("PharmaScope startup error", `${command} failed: ${error.message}`);
  });

  return child;
}

function pythonExecutable() {
  const packagedVenv = rootPath("backend", "venv", "Scripts", "python.exe");
  if (!isDev && fs.existsSync(packagedVenv)) return packagedVenv;
  const bundled = rootPath("runtime", "python", "python.exe");
  if (!isDev && fs.existsSync(bundled)) return bundled;
  return process.platform === "win32" ? "python" : "python3";
}

function startBackend() {
  const backendDir = rootPath("backend");
  if (!isDev) {
    const backendExe = rootPath("runtime", "pharmascope-backend", "pharmascope-backend.exe");
    if (fs.existsSync(backendExe)) {
      backendProcess = spawnProcess(backendExe, [], {
        cwd: backendDir,
        env: {
          ...process.env,
          PHARMASCOPE_BACKEND_DIR: backendDir,
          PHARMASCOPE_BACKEND_PORT: BACKEND_PORT,
        },
      });
      return;
    }
  }
  backendProcess = spawnProcess(
    pythonExecutable(),
    ["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", BACKEND_PORT],
    {
      cwd: backendDir,
      env: {
        ...process.env,
        PHARMASCOPE_BACKEND_DIR: backendDir,
        PHARMASCOPE_BACKEND_PORT: BACKEND_PORT,
      },
    },
  );
}

function startFrontend() {
  if (isDev) {
    const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
    frontendProcess = spawnProcess(
      npmCommand,
      ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", FRONTEND_PORT],
      { cwd: rootPath("frontend") },
    );
    return;
  }

  const serverPath = rootPath("frontend", "server.js");
  const bundledNode = rootPath("runtime", "node", "node.exe");
  const nodeExecutable = fs.existsSync(bundledNode) ? bundledNode : process.execPath;
  const env = {
    ...process.env,
    HOSTNAME: "127.0.0.1",
    PORT: FRONTEND_PORT,
    NODE_ENV: "production",
  };
  if (nodeExecutable === process.execPath) {
    env.ELECTRON_RUN_AS_NODE = "1";
  }

  frontendProcess = spawnProcess(nodeExecutable, [serverPath], {
    cwd: rootPath("frontend"),
    env,
  });
}

async function waitForServices() {
  await waitOn({
    resources: [`${BACKEND_URL}/`, FRONTEND_URL],
    timeout: 120000,
    interval: 750,
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "PharmaScope",
    width: 1600,
    height: 950,
    minWidth: 1280,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#f6f8fc",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL(FRONTEND_URL);
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

async function startApp() {
  startBackend();
  startFrontend();
  await waitForServices();
  createWindow();
  if (!isDev) {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates().catch(() => undefined);
  }
}

app.whenReady().then(() => {
  startApp().catch((error) => {
    dialog.showErrorBox("PharmaScope startup error", error?.message || String(error));
    app.quit();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("before-quit", () => {
  if (backendProcess && !backendProcess.killed) backendProcess.kill();
  if (frontendProcess && !frontendProcess.killed) frontendProcess.kill();
});
