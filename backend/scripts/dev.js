const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const backendDir = path.resolve(__dirname, "..");
const venvDir = path.join(backendDir, "venv");
const isWindows = process.platform === "win32";
const pythonExe = path.join(
  venvDir,
  isWindows ? "Scripts" : "bin",
  isWindows ? "python.exe" : "python"
);
const pipExe = path.join(
  venvDir,
  isWindows ? "Scripts" : "bin",
  isWindows ? "pip.exe" : "pip"
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: backendDir,
    stdio: "inherit",
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureVenv() {
  if (!fs.existsSync(pythonExe)) {
    console.log("Creating Python virtual environment...");
    run("python", ["-m", "venv", "venv"]);
  }
}

function ensureDependencies() {
  const marker = path.join(venvDir, ".deps-installed");
  if (fs.existsSync(marker)) {
    return;
  }

  console.log("Installing backend dependencies...");
  run(pipExe, ["install", "-r", "requirements.txt"]);
  fs.writeFileSync(marker, new Date().toISOString());
}

function startServer() {
  console.log("Starting PharmaScope API at http://127.0.0.1:8000");
  const server = spawn(
    pythonExe,
    ["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
    {
      cwd: backendDir,
      stdio: "inherit",
    }
  );

  server.on("exit", (code) => process.exit(code ?? 0));
}

ensureVenv();
ensureDependencies();
startServer();