import { ipcMain as a, screen as m, BrowserWindow as S, desktopCapturer as N, shell as q, app as d, dialog as O, protocol as L, nativeImage as A, net as $, Tray as G, Menu as Q } from "electron";
import { fileURLToPath as U, pathToFileURL as J } from "node:url";
import i from "node:path";
import v from "node:fs/promises";
const b = i.dirname(U(import.meta.url)), K = i.join(b, ".."), w = process.env.VITE_DEV_SERVER_URL, j = i.join(K, "dist");
let D = null;
a.on("hud-overlay-hide", () => {
  D && !D.isDestroyed() && D.minimize();
});
function X() {
  const c = m.getPrimaryDisplay(), { workArea: r } = c, o = 1e3, p = 100, f = Math.floor(r.x + (r.width - o) / 2), u = Math.floor(r.y + r.height - p - 5), e = new S({
    width: o,
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
      preload: i.join(b, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      backgroundThrottling: !1
    }
  });
  return e.setContentProtection(!0), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), D = e, e.on("closed", () => {
    D === e && (D = null);
  }), w ? e.loadURL(w + "?windowType=hud-overlay") : e.loadFile(i.join(j, "index.html"), {
    query: { windowType: "hud-overlay" }
  }), e;
}
function Y() {
  const c = process.platform === "darwin", r = new S({
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
      preload: i.join(b, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      backgroundThrottling: !1
    }
  });
  return r.maximize(), r.webContents.on("did-finish-load", () => {
    r == null || r.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), r == null || r.webContents.openDevTools();
  }), w ? r.loadURL(w + "?windowType=editor") : r.loadFile(i.join(j, "index.html"), {
    query: { windowType: "editor" }
  }), r;
}
function Z() {
  const { width: c, height: r } = m.getPrimaryDisplay().workAreaSize, o = new S({
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
      preload: i.join(b, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return w ? o.loadURL(w + "?windowType=source-selector") : o.loadFile(i.join(j, "index.html"), {
    query: { windowType: "source-selector" }
  }), o;
}
function ee() {
  const { width: c, height: r } = m.getPrimaryDisplay().workAreaSize, o = new S({
    width: 460,
    height: 600,
    minWidth: 400,
    minHeight: 500,
    x: Math.round((c - 460) / 2),
    y: Math.round((r - 600) / 2),
    frame: !1,
    resizable: !1,
    transparent: !0,
    backgroundColor: "#00000000",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 12, y: 12 },
    webPreferences: {
      preload: i.join(b, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return w ? o.loadURL(w + "?windowType=electron-auth") : o.loadFile(i.join(j, "index.html"), {
    query: { windowType: "electron-auth" }
  }), o;
}
let x = null, E = !1, I = [], k = 0, F = null;
function te(c, r, o, p, f) {
  a.handle("get-sources", async (e, s) => (await N.getSources(s)).map((t) => ({
    id: t.id,
    name: t.name,
    display_id: t.display_id,
    thumbnail: t.thumbnail ? t.thumbnail.toDataURL() : null,
    appIcon: t.appIcon ? t.appIcon.toDataURL() : null
  }))), a.handle("select-source", (e, s) => {
    x = s;
    const n = p();
    return n && n.close(), x;
  }), a.handle("get-selected-source", () => x), a.handle("open-source-selector", () => {
    const e = p();
    if (e) {
      e.focus();
      return;
    }
    r();
  }), a.handle("switch-to-editor", () => {
    const e = o();
    e && e.close(), c();
  }), a.handle("hide-main-window", () => {
    const e = o();
    e && !e.isDestroyed() && e.hide();
  }), a.handle("show-main-window", () => {
    const e = o();
    e && !e.isDestroyed() && e.show();
  }), a.handle("minimize-main-window", () => {
    const e = o();
    e && !e.isDestroyed() && e.minimize();
  }), a.handle("restore-main-window", () => {
    const e = o();
    e && !e.isDestroyed() && (e.isMinimized() && e.restore(), e.show());
  }), a.handle("store-recorded-video", async (e, s, n) => {
    try {
      const t = i.join(P, n);
      return await v.writeFile(t, Buffer.from(s)), u = t, {
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
  }), a.handle("get-recorded-video-path", async () => {
    try {
      const s = (await v.readdir(P)).filter((h) => h.endsWith(".webm"));
      if (s.length === 0)
        return { success: !1, message: "No recorded video found" };
      const n = s.sort().reverse()[0];
      return { success: !0, path: i.join(P, n) };
    } catch (e) {
      return console.error("Failed to get video path:", e), { success: !1, message: "Failed to get video path", error: String(e) };
    }
  }), a.handle("set-recording-state", (e, s) => {
    f && f(s, (x || { name: "Screen" }).name);
  }), a.handle("open-external-url", async (e, s) => {
    try {
      return await q.openExternal(s), { success: !0 };
    } catch (n) {
      return console.error("Failed to open URL:", n), { success: !1, error: String(n) };
    }
  }), a.handle("get-asset-base-path", () => {
    try {
      return d.isPackaged ? i.join(process.resourcesPath, "assets") : i.join(d.getAppPath(), "public");
    } catch (e) {
      return console.error("Failed to resolve asset base path:", e), null;
    }
  }), a.handle("save-exported-video", async (e, s, n) => {
    try {
      const t = o(), h = n.toLowerCase().endsWith(".gif"), _ = h ? [{ name: "GIF Image", extensions: ["gif"] }] : [{ name: "MP4 Video", extensions: ["mp4"] }];
      if (!t)
        throw new Error("Main window not available");
      const g = await O.showSaveDialog(t, {
        title: h ? "Save Exported GIF" : "Save Exported Video",
        defaultPath: i.join(d.getPath("downloads"), n),
        filters: _,
        properties: ["createDirectory", "showOverwriteConfirmation"]
      });
      return g.canceled || !g.filePath ? {
        success: !1,
        cancelled: !0,
        message: "Export cancelled"
      } : (await v.writeFile(g.filePath, Buffer.from(s)), {
        success: !0,
        path: g.filePath,
        message: "Video exported successfully"
      });
    } catch (t) {
      return console.error("Failed to save exported video:", t), {
        success: !1,
        message: "Failed to save exported video",
        error: String(t)
      };
    }
  }), a.handle("open-video-file-picker", async () => {
    try {
      const e = await O.showOpenDialog({
        title: "Select Video File",
        defaultPath: P,
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
  a.handle("set-current-video-path", (e, s) => (u = s, { success: !0 })), a.handle("get-current-video-path", () => u ? { success: !0, path: u } : { success: !1 }), a.handle("clear-current-video-path", () => (u = null, { success: !0 })), a.handle("get-platform", () => process.platform), a.handle("start-cursor-tracking", () => {
    const e = m.getPrimaryDisplay(), { width: s, height: n } = e.size;
    return I = [], k = Date.now(), E = !0, F = setInterval(() => {
      if (!E) return;
      const t = m.getCursorScreenPoint(), h = Date.now() - k;
      I.push({
        x: t.x / s,
        y: t.y / n,
        timestamp: h,
        type: "move"
      });
    }, 33), { success: !0, screenWidth: s, screenHeight: n };
  }), a.handle("stop-cursor-tracking", () => {
    E = !1, F && (clearInterval(F), F = null);
    const e = Date.now() - k, s = m.getPrimaryDisplay(), { width: n, height: t } = s.size, h = {
      events: I,
      screenWidth: n,
      screenHeight: t,
      duration: e
    };
    return I = [], h;
  }), a.handle("record-cursor-click", (e, s) => {
    if (!E) return { success: !1 };
    const n = m.getPrimaryDisplay(), { width: t, height: h } = n.size, _ = m.getCursorScreenPoint(), g = Date.now() - k;
    return I.push({
      x: _.x / t,
      y: _.y / h,
      timestamp: g,
      type: "click",
      button: s
    }), { success: !0 };
  }), a.handle("save-cursor-data", async (e, s, n) => {
    try {
      const t = s.replace(/\.\w+$/, ".cursor.json");
      return await v.writeFile(t, n, "utf-8"), { success: !0, path: t };
    } catch (t) {
      return console.error("Failed to save cursor data:", t), { success: !1, error: String(t) };
    }
  }), a.handle("load-cursor-data", async (e, s) => {
    try {
      const n = s.replace(/\.\w+$/, ".cursor.json");
      return { success: !0, data: await v.readFile(n, "utf-8") };
    } catch (n) {
      return { success: !1, error: String(n) };
    }
  });
}
const re = i.dirname(U(import.meta.url));
L.registerSchemesAsPrivileged([
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
const P = i.join(d.getPath("userData"), "recordings");
async function oe() {
  try {
    await v.mkdir(P, { recursive: !0 }), console.log("RECORDINGS_DIR:", P), console.log("User Data Path:", d.getPath("userData"));
  } catch (c) {
    console.error("Failed to create recordings directory:", c);
  }
}
process.env.APP_ROOT = i.join(re, "..");
const se = process.env.VITE_DEV_SERVER_URL, he = i.join(process.env.APP_ROOT, "dist-electron"), z = i.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = se ? i.join(process.env.APP_ROOT, "public") : z;
let l = null, y = null, R = null, T = null, M = "";
const H = B("openscreen.png"), ne = B("rec-button.png");
function W() {
  l = X();
}
function V() {
  T = new G(H);
}
function B(c) {
  return A.createFromPath(i.join(process.env.VITE_PUBLIC || z, c)).resize({
    width: 24,
    height: 24,
    quality: "best"
  });
}
function C(c = !1) {
  if (!T) return;
  const r = c ? ne : H, o = c ? `Recording: ${M}` : "Velo Studio", p = c ? [
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
        l && !l.isDestroyed() ? l.isMinimized() && l.restore() : W();
      }
    },
    {
      label: "Quit",
      click: () => {
        d.quit();
      }
    }
  ];
  T.setImage(r), T.setToolTip(o), T.setContextMenu(Q.buildFromTemplate(p));
}
function ie() {
  l && (l.close(), l = null), l = Y();
}
function ae() {
  return R = Z(), R.on("closed", () => {
    R = null;
  }), R;
}
d.on("window-all-closed", () => {
});
d.on("activate", () => {
  S.getAllWindows().length === 0 && W();
});
d.whenReady().then(async () => {
  if (L.handle("velo-asset", (r) => {
    const o = new URL(r.url), p = decodeURIComponent(o.pathname).replace(/^\//, "");
    let f;
    d.isPackaged ? f = i.join(process.resourcesPath, "assets") : f = i.join(process.env.APP_ROOT || "", "public");
    const u = i.join(f, p);
    return console.log("[velo-asset protocol] Resolving:", r.url, "->", u), $.fetch(J(u).href);
  }), process.platform === "darwin" && !d.isPackaged) {
    const r = i.join(process.env.APP_ROOT || "", "icons", "icons", "mac", "icon.icns");
    try {
      const o = A.createFromPath(r);
      !o.isEmpty() && d.dock && d.dock.setIcon(o);
    } catch (o) {
      console.warn("Failed to set dock icon:", o);
    }
  }
  const { ipcMain: c } = await import("electron");
  c.on("hud-overlay-close", () => {
    d.quit();
  }), c.on("auth-ready", () => {
    y && !y.isDestroyed() && (y.close(), y = null), W();
  }), V(), C(), await oe(), te(
    ie,
    ae,
    () => l,
    () => R,
    (r, o) => {
      M = o, T || V(), C(r), r || l && l.restore();
    }
  ), y = ee(), y.on("closed", () => {
    y = null;
  });
});
export {
  he as MAIN_DIST,
  P as RECORDINGS_DIR,
  z as RENDERER_DIST,
  se as VITE_DEV_SERVER_URL
};
