import { ipcMain as n, screen as m, BrowserWindow as k, desktopCapturer as N, shell as B, app as d, dialog as O, protocol as C, nativeImage as L, net as $, Tray as q, Menu as G } from "electron";
import { fileURLToPath as U, pathToFileURL as Q } from "node:url";
import a from "node:path";
import y from "node:fs/promises";
const x = a.dirname(U(import.meta.url)), J = a.join(x, ".."), T = process.env.VITE_DEV_SERVER_URL, F = a.join(J, "dist");
let P = null;
n.on("hud-overlay-hide", () => {
  P && !P.isDestroyed() && P.minimize();
});
function K() {
  const c = m.getPrimaryDisplay(), { workArea: r } = c, i = 1e3, p = 100, f = Math.floor(r.x + (r.width - i) / 2), u = Math.floor(r.y + r.height - p - 5), e = new k({
    width: i,
    height: p,
    minWidth: 1e3,
    maxWidth: 1e3,
    minHeight: 100,
    maxHeight: 100,
    x: f,
    y: u,
    frame: !1,
    transparent: !0,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    hasShadow: !1,
    webPreferences: {
      preload: a.join(x, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      backgroundThrottling: !1
    }
  });
  return e.setContentProtection(!0), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), P = e, e.on("closed", () => {
    P === e && (P = null);
  }), T ? e.loadURL(T + "?windowType=hud-overlay") : e.loadFile(a.join(F, "index.html"), {
    query: { windowType: "hud-overlay" }
  }), e;
}
function X() {
  const c = process.platform === "darwin", r = new k({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    ...c && {
      titleBarStyle: "hiddenInset",
      trafficLightPosition: { x: 12, y: 12 }
    },
    transparent: !1,
    resizable: !0,
    alwaysOnTop: !1,
    skipTaskbar: !1,
    title: "OpenScreen",
    backgroundColor: "#000000",
    webPreferences: {
      preload: a.join(x, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      backgroundThrottling: !1
    }
  });
  return r.maximize(), r.webContents.on("did-finish-load", () => {
    r == null || r.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), r == null || r.webContents.openDevTools();
  }), T ? r.loadURL(T + "?windowType=editor") : r.loadFile(a.join(F, "index.html"), {
    query: { windowType: "editor" }
  }), r;
}
function Y() {
  const { width: c, height: r } = m.getPrimaryDisplay().workAreaSize, i = new k({
    width: 620,
    height: 420,
    minHeight: 350,
    maxHeight: 500,
    x: Math.round((c - 620) / 2),
    y: Math.round((r - 420) / 2),
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    transparent: !0,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: a.join(x, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return T ? i.loadURL(T + "?windowType=source-selector") : i.loadFile(a.join(F, "index.html"), {
    query: { windowType: "source-selector" }
  }), i;
}
let S = null, _ = !1, D = [], b = 0, E = null;
function Z(c, r, i, p, f) {
  n.handle("get-sources", async (e, o) => (await N.getSources(o)).map((t) => ({
    id: t.id,
    name: t.name,
    display_id: t.display_id,
    thumbnail: t.thumbnail ? t.thumbnail.toDataURL() : null,
    appIcon: t.appIcon ? t.appIcon.toDataURL() : null
  }))), n.handle("select-source", (e, o) => {
    S = o;
    const s = p();
    return s && s.close(), S;
  }), n.handle("get-selected-source", () => S), n.handle("open-source-selector", () => {
    const e = p();
    if (e) {
      e.focus();
      return;
    }
    r();
  }), n.handle("switch-to-editor", () => {
    const e = i();
    e && e.close(), c();
  }), n.handle("hide-main-window", () => {
    const e = i();
    e && !e.isDestroyed() && e.hide();
  }), n.handle("show-main-window", () => {
    const e = i();
    e && !e.isDestroyed() && e.show();
  }), n.handle("minimize-main-window", () => {
    const e = i();
    e && !e.isDestroyed() && e.minimize();
  }), n.handle("restore-main-window", () => {
    const e = i();
    e && !e.isDestroyed() && (e.isMinimized() && e.restore(), e.show());
  }), n.handle("store-recorded-video", async (e, o, s) => {
    try {
      const t = a.join(g, s);
      return await y.writeFile(t, Buffer.from(o)), u = t, {
        success: !0,
        path: t,
        message: "Video stored successfully"
      };
    } catch (t) {
      return console.error("Failed to store video:", t), {
        success: !1,
        message: "Failed to store video",
        error: String(t)
      };
    }
  }), n.handle("get-recorded-video-path", async () => {
    try {
      const o = (await y.readdir(g)).filter((h) => h.endsWith(".webm"));
      if (o.length === 0)
        return { success: !1, message: "No recorded video found" };
      const s = o.sort().reverse()[0];
      return { success: !0, path: a.join(g, s) };
    } catch (e) {
      return console.error("Failed to get video path:", e), { success: !1, message: "Failed to get video path", error: String(e) };
    }
  }), n.handle("set-recording-state", (e, o) => {
    f && f(o, (S || { name: "Screen" }).name);
  }), n.handle("open-external-url", async (e, o) => {
    try {
      return await B.openExternal(o), { success: !0 };
    } catch (s) {
      return console.error("Failed to open URL:", s), { success: !1, error: String(s) };
    }
  }), n.handle("get-asset-base-path", () => {
    try {
      return d.isPackaged ? a.join(process.resourcesPath, "assets") : a.join(d.getAppPath(), "public");
    } catch (e) {
      return console.error("Failed to resolve asset base path:", e), null;
    }
  }), n.handle("save-exported-video", async (e, o, s) => {
    try {
      const t = i(), h = s.toLowerCase().endsWith(".gif"), I = h ? [{ name: "GIF Image", extensions: ["gif"] }] : [{ name: "MP4 Video", extensions: ["mp4"] }];
      if (!t)
        throw new Error("Main window not available");
      const w = await O.showSaveDialog(t, {
        title: h ? "Save Exported GIF" : "Save Exported Video",
        defaultPath: a.join(d.getPath("downloads"), s),
        filters: I,
        properties: ["createDirectory", "showOverwriteConfirmation"]
      });
      return w.canceled || !w.filePath ? {
        success: !1,
        cancelled: !0,
        message: "Export cancelled"
      } : (await y.writeFile(w.filePath, Buffer.from(o)), {
        success: !0,
        path: w.filePath,
        message: "Video exported successfully"
      });
    } catch (t) {
      return console.error("Failed to save exported video:", t), {
        success: !1,
        message: "Failed to save exported video",
        error: String(t)
      };
    }
  }), n.handle("open-video-file-picker", async () => {
    try {
      const e = await O.showOpenDialog({
        title: "Select Video File",
        defaultPath: g,
        filters: [
          { name: "Video Files", extensions: ["webm", "mp4", "mov", "avi", "mkv"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      return e.canceled || e.filePaths.length === 0 ? { success: !1, cancelled: !0 } : {
        success: !0,
        path: e.filePaths[0]
      };
    } catch (e) {
      return console.error("Failed to open file picker:", e), {
        success: !1,
        message: "Failed to open file picker",
        error: String(e)
      };
    }
  });
  let u = null;
  n.handle("set-current-video-path", (e, o) => (u = o, { success: !0 })), n.handle("get-current-video-path", () => u ? { success: !0, path: u } : { success: !1 }), n.handle("clear-current-video-path", () => (u = null, { success: !0 })), n.handle("get-platform", () => process.platform), n.handle("start-cursor-tracking", () => {
    const e = m.getPrimaryDisplay(), { width: o, height: s } = e.size;
    return D = [], b = Date.now(), _ = !0, E = setInterval(() => {
      if (!_) return;
      const t = m.getCursorScreenPoint(), h = Date.now() - b;
      D.push({
        x: t.x / o,
        y: t.y / s,
        timestamp: h,
        type: "move"
      });
    }, 33), { success: !0, screenWidth: o, screenHeight: s };
  }), n.handle("stop-cursor-tracking", () => {
    _ = !1, E && (clearInterval(E), E = null);
    const e = Date.now() - b, o = m.getPrimaryDisplay(), { width: s, height: t } = o.size, h = {
      events: D,
      screenWidth: s,
      screenHeight: t,
      duration: e
    };
    return D = [], h;
  }), n.handle("record-cursor-click", (e, o) => {
    if (!_) return { success: !1 };
    const s = m.getPrimaryDisplay(), { width: t, height: h } = s.size, I = m.getCursorScreenPoint(), w = Date.now() - b;
    return D.push({
      x: I.x / t,
      y: I.y / h,
      timestamp: w,
      type: "click",
      button: o
    }), { success: !0 };
  }), n.handle("save-cursor-data", async (e, o, s) => {
    try {
      const t = o.replace(/\.\w+$/, ".cursor.json");
      return await y.writeFile(t, s, "utf-8"), { success: !0, path: t };
    } catch (t) {
      return console.error("Failed to save cursor data:", t), { success: !1, error: String(t) };
    }
  }), n.handle("load-cursor-data", async (e, o) => {
    try {
      const s = o.replace(/\.\w+$/, ".cursor.json");
      return { success: !0, data: await y.readFile(s, "utf-8") };
    } catch (s) {
      return { success: !1, error: String(s) };
    }
  });
}
const ee = a.dirname(U(import.meta.url));
C.registerSchemesAsPrivileged([
  {
    scheme: "velo-asset",
    privileges: {
      secure: !0,
      supportFetchAPI: !0,
      bypassCSP: !0,
      corsEnabled: !0,
      stream: !0
    }
  }
]);
d.setName("Velo Studio");
const g = a.join(d.getPath("userData"), "recordings");
async function te() {
  try {
    await y.mkdir(g, { recursive: !0 }), console.log("RECORDINGS_DIR:", g), console.log("User Data Path:", d.getPath("userData"));
  } catch (c) {
    console.error("Failed to create recordings directory:", c);
  }
}
process.env.APP_ROOT = a.join(ee, "..");
const re = process.env.VITE_DEV_SERVER_URL, de = a.join(process.env.APP_ROOT, "dist-electron"), A = a.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = re ? a.join(process.env.APP_ROOT, "public") : A;
let l = null, R = null, v = null, z = "";
const H = M("openscreen.png"), oe = M("rec-button.png");
function j() {
  l = K();
}
function V() {
  v = new q(H);
}
function M(c) {
  return L.createFromPath(a.join(process.env.VITE_PUBLIC || A, c)).resize({
    width: 24,
    height: 24,
    quality: "best"
  });
}
function W(c = !1) {
  if (!v) return;
  const r = c ? oe : H, i = c ? `Recording: ${z}` : "Velo Studio", p = c ? [
    {
      label: "Stop Recording",
      click: () => {
        l && !l.isDestroyed() && l.webContents.send("stop-recording-from-tray");
      }
    }
  ] : [
    {
      label: "Open",
      click: () => {
        l && !l.isDestroyed() ? l.isMinimized() && l.restore() : j();
      }
    },
    {
      label: "Quit",
      click: () => {
        d.quit();
      }
    }
  ];
  v.setImage(r), v.setToolTip(i), v.setContextMenu(G.buildFromTemplate(p));
}
function se() {
  l && (l.close(), l = null), l = X();
}
function ne() {
  return R = Y(), R.on("closed", () => {
    R = null;
  }), R;
}
d.on("window-all-closed", () => {
});
d.on("activate", () => {
  k.getAllWindows().length === 0 && j();
});
d.whenReady().then(async () => {
  if (C.handle("velo-asset", (r) => {
    const i = new URL(r.url), p = decodeURIComponent(i.pathname).replace(/^\//, "");
    let f;
    d.isPackaged ? f = a.join(process.resourcesPath, "assets") : f = a.join(process.env.APP_ROOT || "", "public");
    const u = a.join(f, p);
    return console.log("[velo-asset protocol] Resolving:", r.url, "->", u), $.fetch(Q(u).href);
  }), process.platform === "darwin" && !d.isPackaged) {
    const r = a.join(process.env.APP_ROOT || "", "icons", "icons", "mac", "icon.icns");
    try {
      const i = L.createFromPath(r);
      !i.isEmpty() && d.dock && d.dock.setIcon(i);
    } catch (i) {
      console.warn("Failed to set dock icon:", i);
    }
  }
  const { ipcMain: c } = await import("electron");
  c.on("hud-overlay-close", () => {
    d.quit();
  }), V(), W(), await te(), Z(
    se,
    ne,
    () => l,
    () => R,
    (r, i) => {
      z = i, v || V(), W(r), r || l && l.restore();
    }
  ), j();
});
export {
  de as MAIN_DIST,
  g as RECORDINGS_DIR,
  A as RENDERER_DIST,
  re as VITE_DEV_SERVER_URL
};
