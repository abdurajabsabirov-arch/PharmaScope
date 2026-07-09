const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("pharmaScopeDesktop", {
  platform: process.platform,
  isDesktop: true,
});
