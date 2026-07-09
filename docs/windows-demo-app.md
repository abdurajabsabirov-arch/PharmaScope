# PharmaScope Windows Demo App

This document explains how to run and package PharmaScope as a Windows desktop demo application without changing the normal web workflow.

## What Was Added

- `desktop/main.js` - Electron main process.
- `desktop/preload.js` - minimal safe preload bridge.
- `desktop/package.json` - Electron, electron-builder and future GitHub Releases configuration.
- Demo role login in the frontend:
  - Admin: `admin@pharmascope.local` / `admin123`
  - User: `user@pharmascope.local` / `user123`
- Role-based navigation:
  - Admin sees Market Intelligence, Performance Cockpit, Data Management, Administration.
  - User sees Market Intelligence and Performance Cockpit only.
- Route protection:
  - Standard users who open `/data` or `/admin` manually are redirected to Market Intelligence.
- Header actions:
  - current user name and role
  - logout
  - `Check for Updates`

## Normal Web Development Still Works

Frontend:

```powershell
cd frontend
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Backend:

```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The desktop app does not remove or rename any existing pages.

## Run Desktop App in Development

From the repository root:

```powershell
npm run desktop:dev
```

This starts:

- FastAPI backend on `127.0.0.1:8000`
- Next.js frontend on `127.0.0.1:3000`
- Electron desktop window titled `PharmaScope`

No browser address bar is shown.

## Build Windows Installer or Portable ZIP

From the repository root:

```powershell
npm run desktop:build
```

Build output appears in:

```text
desktop/dist/
```

Expected artifacts:

- Windows installer `.exe`
- portable `.zip`
- unpacked app folder for local testing

For the current Windows demo build, the generated files are:

```text
desktop/dist/PharmaScope-0.1.0-x64.exe
desktop/dist/PharmaScope-0.1.0-x64.zip
desktop/dist/win-unpacked/PharmaScope.exe
```

Use the installer `.exe` when sending the demo to management. Use the `.zip` when a portable package is preferred.

## Backend Runtime Note

In development, Electron uses the local Python command and runs FastAPI with Uvicorn.

For the Windows demo package, Electron starts the packaged backend executable:

```text
resources/runtime/pharmascope-backend/pharmascope-backend.exe
```

This means the demo recipient does not need to open Python, VS Code, terminal, npm, or a browser manually.

If backend code changes, rebuild the backend executable before creating the installer:

```powershell
python -m pip install pyinstaller
python -m PyInstaller --noconfirm --clean --onedir --name pharmascope-backend --distpath desktop\runtime --workpath desktop\build-backend --specpath desktop\scripts --paths backend --collect-submodules app backend\desktop_server.py
```

After that, rebuild the Windows app:

```powershell
npm run desktop:build
```

The Electron app still keeps a development fallback to local Python for normal development.

## Frontend Runtime Note

The packaged demo starts the built Next.js standalone server from:

```text
resources/frontend/server.js
```

For reliability, the Windows package includes a local Node runtime:

```text
resources/runtime/node/node.exe
```

Before building on a new Windows machine, place `node.exe` here:

```text
desktop/runtime/node/node.exe
```

This keeps the final demo independent from any Node.js installation on the recipient's computer.

## Startup Logs

If the packaged app fails to start, logs are written under the Windows user data folder:

```text
%APPDATA%\PharmaScope\logs\
```

These logs show whether the frontend server or backend server failed.

## Demo Roles

Demo credentials are implemented in:

```text
frontend/lib/demoAuth.ts
```

They are intentionally separated from backend authentication so they can later be replaced with production auth.

Admin:

- email: `admin@pharmascope.local`
- password: `admin123`
- role: `admin`

User:

- email: `user@pharmascope.local`
- password: `user123`
- role: `user`

The role is stored in `localStorage` as `pharmascope-user`.

## Updates Through GitHub Releases

Unsafe `git pull` from inside the app is not implemented.

The desktop app is prepared for GitHub Releases using:

- `electron-builder`
- `electron-updater`
- repository: `abdurajabsabirov-arch/PharmaScope`

The current `Check for Updates` button opens:

```text
https://github.com/abdurajabsabirov-arch/PharmaScope/releases
```

Future update flow:

1. Continue development normally in GitHub.
2. Build a new desktop version.
3. Create a GitHub Release.
4. Attach installer/zip artifacts.
5. Later, enable full auto-download/update prompts through `electron-updater`.

No GitHub tokens or secrets are embedded in the app.

## Important Constraints Preserved

- Market Intelligence remains available.
- Performance Cockpit name and route remain unchanged.
- Data Management remains available to admins.
- Administration remains available to admins.
- Standard web deployment remains possible later.
